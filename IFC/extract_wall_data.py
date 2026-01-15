from dataclasses import dataclass
from typing import List, Optional
import numpy as np
import ifcopenshell
from ifcopenshell.util.element import get_psets
from ifcopenshell.util.placement import get_local_placement

# 方案中房间id为415的墙体Guid
DEFAULT_WALL_GUIDS = [
    "0kBeBqDO9CzQFzMXVvcvra",
    "21gXS9JWz0dPROx27EBJb5",
    "0kcssZ20f0mALlwu_HBEtU",
    "0MKJVhdaLAeeNMsmUCajw_",
    "1mC6kkUOz2K8uIIJCm1dfr",
    "0Mz1oeeZv0vufB57CQqCAX",
]

@dataclass
class BoxDims:
    x: float  # model units
    y: float
    z: float

@dataclass
class OpeningData:
    guid: str
    name: str
    rel_matrix_in_src_space: np.ndarray  # 4x4, model units (mm)
    dims: Optional[BoxDims] = None

@dataclass
class WallData:
    guid: str
    name: str
    rel_matrix_in_src_space: np.ndarray  # 4x4, model units (mm)
    dims: Optional[BoxDims] = None
    openings: List[OpeningData] = None
    axis_start: Optional[np.ndarray] = None  # Axis polyline起点（相对space坐标）
    axis_end: Optional[np.ndarray] = None  # Axis polyline终点（相对space坐标）

def _model_units_matrix_to_si(matrix_model_units, m_per_unit):
    m = matrix_model_units.copy()
    m[:3, 3] = m[:3, 3] * m_per_unit
    return m

def _create_box_sweptsolid_representation(model: ifcopenshell.file, size: BoxDims):
    """创建一个简单的 SweptSolid 作为墙/洞的 Body（尺寸单位：模型单位 mm）"""
    body_ctx = None
    for ctx in model.by_type("IfcGeometricRepresentationSubContext"):
        if getattr(ctx, "ContextIdentifier", None) == "Body":
            body_ctx = ctx
            break
    if body_ctx is None:
        for ctx in model.by_type("IfcGeometricRepresentationContext"):
            if getattr(ctx, "CoordinateSpaceDimension", None) == 3:
                body_ctx = ctx
                break
    if body_ctx is None:
        raise RuntimeError("Cannot find Body context in dst model.")

    prof_pos = model.createIfcAxis2Placement2D(model.createIfcCartesianPoint((0.0, 0.0)))
    profile = model.create_entity(
        "IfcRectangleProfileDef",
        ProfileType="AREA",
        Position=prof_pos,
        XDim=float(size.x),
        YDim=float(size.y),
    )

    solid_pos = model.createIfcAxis2Placement3D(model.createIfcCartesianPoint((0.0, 0.0, 0.0)))
    solid = model.create_entity(
        "IfcExtrudedAreaSolid",
        SweptArea=profile,
        Position=solid_pos,
        ExtrudedDirection=model.createIfcDirection((0.0, 0.0, 1.0)),
        Depth=float(size.z),
    )

    return model.create_entity(
        "IfcShapeRepresentation",
        ContextOfItems=body_ctx,
        RepresentationIdentifier="Body",
        RepresentationType="SweptSolid",
        Items=[solid],
    )

def find_space(src, space_id, fallback_to_first=False):
    """
    查找space，支持多种匹配方式
    
    Args:
        src: IFC文件对象
        space_id: 要查找的space ID（可以是字符串或数字）
        fallback_to_first: 如果找不到匹配的space，是否使用第一个space作为fallback
    
    Returns:
        IfcSpace对象
    
    Raises:
        ValueError: 如果找不到space且fallback_to_first=False
    """
    # Try to convert space_id to int if it's a string that looks like a number
    space_id_int = None
    if isinstance(space_id, str):
        # Try to extract numeric part from strings like "BLDG-...-415" or just "415"
        try:
            # If it contains dashes, try to get the last part
            if "-" in space_id:
                last_part = space_id.split("-")[-1]
                space_id_int = int(last_part)
            else:
                space_id_int = int(space_id)
        except (ValueError, AttributeError):
            pass
    elif isinstance(space_id, (int, float)):
        space_id_int = int(space_id)
    
    all_spaces = list(src.by_type("IfcSpace"))
    
    for sp in all_spaces:
        psets = get_psets(sp)
        for _, kv in psets.items():
            if isinstance(kv, dict):
                # Try exact match first
                if kv.get("id") == space_id:
                    return sp
                # Try numeric match if space_id can be converted to int
                if space_id_int is not None:
                    pset_id = kv.get("id")
                    if isinstance(pset_id, (int, float)) and int(pset_id) == space_id_int:
                        return sp
                    # Also try string comparison
                    if isinstance(pset_id, str) and pset_id == str(space_id_int):
                        return sp
                    # Try if space_id ends with room_id (like "BLDG-LEVEL-415")
                    if isinstance(pset_id, str) and pset_id.endswith(f"-{space_id_int}"):
                        return sp

    # Fallback: use first space if available
    if fallback_to_first and all_spaces:
        print(f"[warning] 未找到space id={space_id}，使用第一个space: {all_spaces[0].Name}")
        return all_spaces[0]

    raise ValueError(f"Cannot find IfcSpace with business id = {space_id} (tried as string and int)")


def get_matrix(product):
    return np.array(get_local_placement(product.ObjectPlacement),dtype=np.float64)

def _collect_points_from_curve(curve):
    """从曲线中收集点坐标"""
    pts = []
    if curve.is_a("IfcPolyline"):
        for pt in getattr(curve, "Points", []) or []:
            coords = getattr(pt, "Coordinates", None)
            if coords and len(coords) >= 2:
                pts.append((float(coords[0]), float(coords[1])))
    elif curve.is_a("IfcCompositeCurve"):
        for seg in getattr(curve, "Segments", []) or []:
            parent = getattr(seg, "ParentCurve", None)
            if parent:
                pts.extend(_collect_points_from_curve(parent))
    return pts

def get_dims(product):
    rep = getattr(product, "Representation", None)
    if not rep:
        return None

    reps = getattr(rep, "Representations", None) or []
    for r in reps:
        items = getattr(r, "Items", None) or []
        for it in items:
            if not it or not it.is_a("IfcExtrudedAreaSolid"):
                continue
            swept = getattr(it, "SweptArea", None)
            if not swept:
                continue
            
            depth = float(getattr(it, "Depth", 0.0))
            
            # 处理矩形profile
            if swept.is_a("IfcRectangleProfileDef"):
                xdim = float(getattr(swept, "XDim", 0.0))
                ydim = float(getattr(swept, "YDim", 0.0))
                return BoxDims(x=xdim, y=ydim, z=depth)
            
            # 处理任意闭合profile - 通过计算bounding box获取尺寸
            elif swept.is_a("IfcArbitraryClosedProfileDef"):
                outer = getattr(swept, "OuterCurve", None)
                if outer:
                    pts = _collect_points_from_curve(outer)
                    if pts:
                        xs = [p[0] for p in pts]
                        ys = [p[1] for p in pts]
                        xdim = max(xs) - min(xs) if xs else 200.0  # 默认200mm
                        ydim = max(ys) - min(ys) if ys else 200.0  # 默认200mm
                        return BoxDims(x=xdim, y=ydim, z=depth)
            
            # 如果depth存在但无法获取x/y，使用默认值
            if depth > 0:
                return BoxDims(x=200.0, y=200.0, z=depth)

    return None

def extract_space_walls_data(ifc_path,space_id, wall_guids=DEFAULT_WALL_GUIDS, fallback_to_first_space=True):
    src = ifcopenshell.open(ifc_path)
    try:
        src_space = find_space(src, space_id, fallback_to_first=fallback_to_first_space)
    except ValueError:
        # If still can't find, try to find space by checking which space contains the walls
        print(f"[warning] 无法通过id找到space {space_id}，尝试通过墙的GUID查找所属space...")
        all_spaces = list(src.by_type("IfcSpace"))
        if all_spaces:
            print(f"[info] 使用第一个space作为fallback: {all_spaces[0].Name}")
            src_space = all_spaces[0]
        else:
            raise ValueError(f"IFC文件中没有找到任何IfcSpace")
    
    src_space_matrix=get_matrix(src_space)
    inv_src_space_matrix=np.linalg.inv(src_space_matrix)
    wall_data:List[WallData]=[]
    for idx,gid in enumerate(wall_guids):
        wall = src.by_guid(gid) if hasattr(src, "by_guid") else None
        if wall is None:
            continue
        if not (wall.is_a("IfcWall") or wall.is_a("IfcWallStandardCase")):
            continue

        wall_name = getattr(wall, "Name", None) or f"Wall_{gid}"
        src_wall_matrix=get_matrix(wall)
        
        # 尝试从Axis representation中获取墙的实际位置
        # 因为有些墙的placement在原点，但实际位置在Axis polyline中
        axis_position = None
        rep = getattr(wall, "Representation", None)
        if rep:
            reps = getattr(rep, "Representations", None) or []
            for r in reps:
                identifier = getattr(r, "RepresentationIdentifier", None)
                if identifier == "Axis":
                    items = getattr(r, "Items", None) or []
                    for item in items:
                        if item.is_a("IfcPolyline"):
                            points = getattr(item, "Points", None) or []
                            if points and len(points) >= 2:
                                # 使用Axis polyline的中点作为墙的位置（更准确）
                                first_pt = points[0]
                                last_pt = points[-1]
                                coords0 = getattr(first_pt, "Coordinates", None)
                                coords1 = getattr(last_pt, "Coordinates", None)
                                if coords0 and coords1 and len(coords0) >= 2 and len(coords1) >= 2:
                                    # 计算中点
                                    mid_x = (float(coords0[0]) + float(coords1[0])) / 2.0
                                    mid_y = (float(coords0[1]) + float(coords1[1])) / 2.0
                                    mid_z = (float(coords0[2]) + float(coords1[2])) / 2.0 if len(coords0) > 2 and len(coords1) > 2 else (float(coords0[2]) if len(coords0) > 2 else 0.0)
                                    axis_position = np.array([mid_x, mid_y, mid_z])
                                elif coords0 and len(coords0) >= 2:
                                    # 如果只有一个点，使用第一个点
                                    axis_position = np.array([
                                        float(coords0[0]),
                                        float(coords0[1]),
                                        float(coords0[2]) if len(coords0) > 2 else 0.0
                                    ])
                                break
                    if axis_position is not None:
                        break
        
        # 保存Axis polyline的起点和终点（全局坐标）
        axis_start_global = None
        axis_end_global = None
        if axis_position is not None and points and len(points) >= 2:
            first_pt = points[0]
            last_pt = points[-1]
            coords0 = getattr(first_pt, "Coordinates", None)
            coords1 = getattr(last_pt, "Coordinates", None)
            if coords0 and coords1:
                axis_start_global = np.array([
                    float(coords0[0]),
                    float(coords0[1]),
                    float(coords0[2]) if len(coords0) > 2 else 0.0
                ])
                axis_end_global = np.array([
                    float(coords1[0]),
                    float(coords1[1]),
                    float(coords1[2]) if len(coords1) > 2 else 0.0
                ])
        
        # 如果找到了Axis位置，更新墙的矩阵
        if axis_position is not None:
            # 创建新的矩阵，使用Axis位置但保留原有的旋转
            src_wall_matrix_updated = src_wall_matrix.copy()
            src_wall_matrix_updated[0, 3] = axis_position[0]
            src_wall_matrix_updated[1, 3] = axis_position[1]
            src_wall_matrix_updated[2, 3] = axis_position[2]
            src_wall_matrix = src_wall_matrix_updated
        
        rel_wall_matrix=inv_src_space_matrix@src_wall_matrix
        wall_dims=get_dims(wall)
        
        # 计算Axis起点和终点相对于源space的坐标
        axis_start_rel = None
        axis_end_rel = None
        if axis_start_global is not None and axis_end_global is not None:
            # 将全局坐标转换为齐次坐标
            axis_start_homogeneous = np.append(axis_start_global, 1.0)
            axis_end_homogeneous = np.append(axis_end_global, 1.0)
            # 转换为相对space坐标
            axis_start_rel = (inv_src_space_matrix @ axis_start_homogeneous)[:3]
            axis_end_rel = (inv_src_space_matrix @ axis_end_homogeneous)[:3]

        openings: List[OpeningData] = []
        for rel in getattr(wall, "HasOpenings", []) or []:
            op = getattr(rel, "RelatedOpeningElement", None)
            if not op or not op.is_a("IfcOpeningElement"):
                continue
            op_gid = getattr(op, "GlobalId", f"NO_GID_OPEN_{gid}_{len(openings)}")
            op_name = getattr(op, "Name", None) or f"Opening_{op_gid}"

            M_src_op = get_matrix(op)
            M_rel_op = inv_src_space_matrix @ M_src_op
            op_dims = get_dims(op)

            openings.append(
                OpeningData(
                    guid=op_gid,
                    name=op_name,
                    rel_matrix_in_src_space=M_rel_op,
                    dims=op_dims,
                )
            )

        wall_data.append(
            WallData(
                guid=gid,
                name=wall_name,
                rel_matrix_in_src_space=rel_wall_matrix,
                dims=wall_dims,
                openings=openings,
                axis_start=axis_start_rel,
                axis_end=axis_end_rel,
            )
        )

    return wall_data
