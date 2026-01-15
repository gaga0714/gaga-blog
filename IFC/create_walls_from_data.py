"""
从墙体数据创建墙并写入IFC文件
支持从IFC文件读取墙体信息，或直接使用墙体属性创建
"""
import json
import zipfile
from pathlib import Path
import numpy as np
import ifcopenshell
from ifcopenshell.api.geometry import add_profile_representation
from maas_lego.core.project import create_single_storey_building_project
from maas_lego.core.structural import create_wall
from maas_lego.core.style import add_element_color


def parse_point_string(point_str):
    """解析点坐标字符串，例如 '2224.080078,7306.207031,0.000000'"""
    if isinstance(point_str, str):
        coords = [float(x.strip()) for x in point_str.split(',')]
        return tuple(coords[:3])
    return point_str


def create_wall_representation_from_points(
    model: ifcopenshell.file,
    start_point: tuple[float, float, float],
    end_point: tuple[float, float, float],
    height: float,
    width: float,
    body_context: ifcopenshell.entity_instance,
):
    """
    从StartPoint、EndPoint、Height、Width创建墙的几何表示
    
    Args:
        model: IFC模型
        start_point: 起点坐标 (x, y, z)
        end_point: 终点坐标 (x, y, z)
        height: 墙高度（毫米）
        width: 墙宽度/厚度（毫米）
        body_context: Body上下文
        
    Returns:
        representation: 墙的几何表示
    """
    # 计算墙的长度
    start = np.array(start_point)
    end = np.array(end_point)
    direction = end - start
    length = np.linalg.norm(direction)
    
    if length < 1e-6:
        raise ValueError("StartPoint和EndPoint不能相同")
    
    # 创建矩形截面：宽度（厚度）x 高度
    profile = model.create_entity(
        "IfcRectangleProfileDef",
        ProfileType="AREA",
        XDim=width,  # 墙的厚度
        YDim=height,  # 墙的高度
    )
    
    # 使用add_profile_representation创建拉伸表示
    # depth参数是拉伸长度（米），所以需要将毫米转换为米
    representation = add_profile_representation(
        model,
        context=body_context,
        profile=profile,
        depth=length / 1000.0,  # 转换为米
    )
    
    return representation


def _get_psets(entity) -> dict:
    """提取实体的属性集字典"""
    psets = {}
    for rel in getattr(entity, "IsDefinedBy", []) or []:
        if rel.is_a("IfcRelDefinesByProperties"):
            prop_set = rel.RelatingPropertyDefinition
            if prop_set.is_a("IfcPropertySet"):
                pset_name = prop_set.Name
                pset_props = {}
                for prop in getattr(prop_set, "HasProperties", []) or []:
                    if prop.is_a("IfcPropertySingleValue"):
                        prop_name = prop.Name
                        prop_value = (
                            prop.NominalValue.wrappedValue if prop.NominalValue else None
                        )
                        pset_props[prop_name] = prop_value
                psets[pset_name] = pset_props
    return psets


def _extract_ifc(ifc_path: str | Path) -> Path:
    """如果是ifczip则解压出IFC文件"""
    p = Path(ifc_path)
    if p.suffix.lower() != ".ifczip":
        return p
    with zipfile.ZipFile(p, "r") as zf:
        names = zf.namelist()
        for name in names:
            if name.lower().endswith(".ifc"):
                target = p.with_suffix(".ifc")
                target.write_bytes(zf.read(name))
                return target
    raise FileNotFoundError("未在ifczip中找到IFC文件")


def _collect_points_from_curve(curve) -> list[tuple[float, float]]:
    """从曲线提取二维坐标点"""
    pts: list[tuple[float, float]] = []
    if curve.is_a("IfcPolyline"):
        for pt in curve.Points:
            coords = pt.Coordinates
            pts.append((float(coords[0]), float(coords[1])))
    elif curve.is_a("IfcCompositeCurve"):
        for seg in curve.Segments:
            pts.extend(_collect_points_from_curve(seg.ParentCurve))
    return pts


def _get_space_bbox(space) -> tuple[float, float, float, float] | None:
    """从空间的扫掠轮廓获取二维包围盒 (minx,maxx,miny,maxy)"""
    reps = getattr(space, "Representation", None)
    if reps is None or not getattr(reps, "Representations", None):
        return None
    pts: list[tuple[float, float]] = []
    for rep in reps.Representations:
        for item in getattr(rep, "Items", []) or []:
            if item.is_a("IfcExtrudedAreaSolid") and getattr(item, "SweptArea", None):
                swept = item.SweptArea
                outer = getattr(swept, "OuterCurve", None)
                if outer:
                    pts.extend(_collect_points_from_curve(outer))
    if not pts:
        return None
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    return min(xs), max(xs), min(ys), max(ys)


def create_wall_from_properties(
    model: ifcopenshell.file,
    wall_name: str,
    start_point: tuple[float, float, float],
    end_point: tuple[float, float, float],
    height: float,
    width: float,
    storey: ifcopenshell.entity_instance,
    body_context: ifcopenshell.entity_instance,
    load_bearing: bool = False,
    exterior: bool = False,
    predefined_type: str = "STANDARD",
):
    """
    从墙体属性创建墙
    
    Args:
        model: IFC模型
        wall_name: 墙的名称
        start_point: 起点坐标
        end_point: 终点坐标
        height: 高度（毫米）
        width: 宽度/厚度（毫米）
        storey: 楼层对象
        body_context: Body上下文
        load_bearing: 是否承重
        exterior: 是否外墙
        predefined_type: 预定义类型
    """
    # 计算墙的方向和长度
    start = np.array(start_point)
    end = np.array(end_point)
    direction = end - start
    length = np.linalg.norm(direction)
    
    if length < 1e-6:
        raise ValueError("StartPoint和EndPoint不能相同")
    
    # 归一化方向向量
    direction_normalized = direction / length
    
    # 创建几何表示（在局部坐标系中，墙沿X轴方向）
    representation = create_wall_representation_from_points(
        model, start_point, end_point, height, width, body_context
    )
    
    # 计算中点作为位置
    mid_point = (
        (start_point[0] + end_point[0]) / 2,
        (start_point[1] + end_point[1]) / 2,
        (start_point[2] + end_point[2]) / 2,
    )
    
    # 创建变换矩阵，将墙从局部坐标系（X轴沿墙方向）变换到世界坐标系
    # 局部坐标系：X轴沿墙方向，Y轴为厚度方向（垂直于墙面），Z轴向上
    x_axis = direction_normalized
    
    # 计算垂直于墙面的向量（用于确定墙的厚度方向）
    # 默认假设墙在XY平面，Z轴向上
    z_axis = np.array([0, 0, 1])
    y_axis = np.cross(z_axis, x_axis)
    if np.linalg.norm(y_axis) < 1e-6:
        # 如果墙是垂直的，使用Y轴
        y_axis = np.cross(np.array([0, 1, 0]), x_axis)
    y_axis = y_axis / np.linalg.norm(y_axis)
    
    # 重新计算Z轴确保正交
    z_axis_local = np.cross(x_axis, y_axis)
    z_axis_local = z_axis_local / np.linalg.norm(z_axis_local)
    
    # 构建4x4变换矩阵
    matrix = np.eye(4)
    matrix[:3, 0] = x_axis  # X轴沿墙方向
    matrix[:3, 1] = y_axis  # Y轴为厚度方向
    matrix[:3, 2] = z_axis_local  # Z轴向上
    matrix[:3, 3] = start  # 起点作为原点
    
    # 准备属性集
    psets = {
        "Pset_WallCommon": {
            "LoadBearing": load_bearing,
            "Reference": wall_name,
        },
        "Cbp_Wall": {
            "StartPoint": f"{start_point[0]},{start_point[1]},{start_point[2]}",
            "EndPoint": f"{end_point[0]},{end_point[1]},{end_point[2]}",
            "MidPoint": f"{mid_point[0]},{mid_point[1]},{mid_point[2]}",
            "Height": height,
            "Width": width,
        },
    }
    
    if exterior:
        psets["Maas_WallCommon"] = {
            "Exterior": exterior,
        }
    
    # 创建墙，使用matrix来正确定位和旋转
    wall = create_wall(
        model=model,
        name=wall_name,
        predefined_type=predefined_type,
        matrix=matrix,
        storey=storey,
        representation=representation,
        psets=psets,
    )
    
    return wall


def read_walls_from_ifc(ifc_path: str):
    """
    从IFC文件读取墙体信息
    
    Returns:
        list: 墙体信息列表
    """
    source = _extract_ifc(ifc_path)
    model = ifcopenshell.open(source)
    walls = model.by_type("IfcWall")
    
    wall_data = []
    for wall in walls:
        psets = _get_psets(wall)
        info = {
            "Name": wall.Name if hasattr(wall, "Name") else "WALL",
            "PredefinedType": wall.PredefinedType
            if hasattr(wall, "PredefinedType")
            else "STANDARD",
            "Guid": wall.GlobalId,
        }
        
        # 提取Cbp_Wall属性
        cbp_wall = psets.get("Cbp_Wall", {})
        start_point_str = cbp_wall.get("StartPoint")
        end_point_str = cbp_wall.get("EndPoint")
        height = cbp_wall.get("Height")
        width = cbp_wall.get("Width")
        
        if start_point_str and end_point_str and height and width:
            wall_data.append({
                "name": info["Name"],
                "guid": info["Guid"],
                "predefined_type": info["PredefinedType"],
                "start_point": parse_point_string(start_point_str),
                "end_point": parse_point_string(end_point_str),
                "height": float(height),
                "width": float(width),
                "load_bearing": psets.get("Pset_WallCommon", {}).get("LoadBearing", False),
                "exterior": psets.get("Maas_WallCommon", {}).get("Exterior", False),
            })
    
    return wall_data


def read_walls_from_ifc_for_room(
    ifc_path: str, room_id: int | str, margin: float = 200.0
) -> list:
    """
    根据房间id过滤墙体（使用空间几何包围盒）"""
    source = _extract_ifc(ifc_path)
    model = ifcopenshell.open(source)
    
    # 找空间
    target_space = None
    for sp in model.by_type("IfcSpace"):
        psets = _get_psets(sp)
        sid = psets.get("Idp_SpaceCommon", {}).get("id")
        if sid and (str(sid).endswith(f"-{room_id}") or str(sid) == str(room_id)):
            target_space = sp
            break
    if target_space is None:
        raise ValueError(f"未找到房间 {room_id}")
    
    bbox = _get_space_bbox(target_space)
    if bbox is None:
        raise ValueError(f"房间 {room_id} 未找到几何包围盒")
    xmin, xmax, ymin, ymax = bbox
    
    wall_data = []
    for wall in model.by_type("IfcWall"):
        psets = _get_psets(wall)
        cbp_wall = psets.get("Cbp_Wall", {})
        start_point_str = cbp_wall.get("StartPoint")
        end_point_str = cbp_wall.get("EndPoint")
        height = cbp_wall.get("Height")
        width = cbp_wall.get("Width")
        if not (start_point_str and end_point_str and height and width):
            continue
        
        sp = parse_point_string(start_point_str)
        ep = parse_point_string(end_point_str)
        
        def within(pt):
            return (
                xmin - margin <= pt[0] <= xmax + margin
                and ymin - margin <= pt[1] <= ymax + margin
            )
        
        if within(sp) and within(ep):
            wall_data.append(
                {
                    "name": wall.Name if hasattr(wall, "Name") else "WALL",
                    "guid": wall.GlobalId,
                    "predefined_type": wall.PredefinedType
                    if hasattr(wall, "PredefinedType")
                    else "STANDARD",
                    "start_point": sp,
                    "end_point": ep,
                    "height": float(height),
                    "width": float(width),
                    "load_bearing": psets.get("Pset_WallCommon", {}).get(
                        "LoadBearing", False
                    ),
                    "exterior": psets.get("Maas_WallCommon", {}).get(
                        "Exterior", False
                    ),
                }
            )
    return wall_data


def create_walls_to_ifc(
    wall_data_list: list,
    output_path: str,
    project_name: str = "Wall Project",
):
    """
    从墙体数据列表创建IFC文件
    
    Args:
        wall_data_list: 墙体数据列表，每个元素包含：
            - name: 墙名称
            - start_point: 起点 (x, y, z)
            - end_point: 终点 (x, y, z)
            - height: 高度（毫米）
            - width: 宽度（毫米）
            - load_bearing: 是否承重（可选）
            - exterior: 是否外墙（可选）
            - predefined_type: 预定义类型（可选）
        output_path: 输出IFC文件路径
        project_name: 项目名称
    """
    # 创建项目
    model = create_single_storey_building_project(project_name)
    storey = model.by_type("IfcBuildingStorey")[0]
    body_context = model.by_type("IfcGeometricRepresentationContext")[0]
    
    # 添加墙材质
    wall_material = add_element_color(
        model=model,
        name="WALL",
        use_color_map=True,
    )
    
    # 创建墙
    walls_created = []
    for i, wall_data in enumerate(wall_data_list):
        wall_name = wall_data.get("name", f"WALL_{i+1}")
        start_point = wall_data["start_point"]
        end_point = wall_data["end_point"]
        height = wall_data["height"]
        width = wall_data["width"]
        load_bearing = wall_data.get("load_bearing", False)
        exterior = wall_data.get("exterior", False)
        predefined_type = wall_data.get("predefined_type", "STANDARD")
        
        # 如果predefined_type是SOLIDWALL，转换为STANDARD
        if predefined_type == "SOLIDWALL":
            predefined_type = "STANDARD"
        
        try:
            wall = create_wall_from_properties(
                model=model,
                wall_name=wall_name,
                start_point=start_point,
                end_point=end_point,
                height=height,
                width=width,
                storey=storey,
                body_context=body_context,
                load_bearing=load_bearing,
                exterior=exterior,
                predefined_type=predefined_type,
            )
            
            # 分配材质
            if wall_material:
                from ifcopenshell.api.material import assign_material
                assign_material(model, products=[wall], material=wall_material)
            
            walls_created.append(wall)
        except Exception as e:
            print(f"创建墙 {wall_name} 时出错: {e}")
            continue
    
    # 写入文件
    model.write(output_path)
    print(f"成功创建 {len(walls_created)} 个墙，IFC文件已保存到：{output_path}")
    
    return model


def main():
    """主函数：读取指定房间的墙并写入新的IFC文件"""
    import sys
    
    input_ifc = sys.argv[1] if len(sys.argv) > 1 else "data/huxingjiegou.ifczip"
    output_ifc = sys.argv[2] if len(sys.argv) > 2 else "results/1.ifc"
    room_id = sys.argv[3] if len(sys.argv) > 3 else "415"
    
    try:
        wall_data = read_walls_from_ifc_for_room(input_ifc, room_id)
        if not wall_data:
            raise ValueError(f"房间 {room_id} 未找到可用墙体数据")
        print(f"房间 {room_id} 读取到 {len(wall_data)} 个墙")
        create_walls_to_ifc(wall_data, output_ifc, project_name=f"Room {room_id}")
    except Exception as e:
        print(f"处理过程中出错: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()

