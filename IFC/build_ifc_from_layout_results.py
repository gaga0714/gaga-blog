"""
从 layout_model_results.json 构建 IFC 文件

使用 maas-lego API 将模型输出结果转换为 IFC 文件
"""
import json
import numpy as np
from pathlib import Path
from typing import Dict, List, Optional

import ifcopenshell
from ifcopenshell.api.geometry import edit_object_placement
from ifcopenshell.util.placement import rotation

from maas_lego.core.project import create_single_storey_building_project
from maas_lego.core.spatial import create_space
from maas_lego.core.furniture import create_furniture
from maas_lego.core.style import add_element_color


# 家具类型映射：将 JSON 中的 type 编号映射到 IFC 家具类型
# 这是一个示例映射，您可能需要根据实际业务需求调整
FURNITURE_TYPE_MAP: Dict[int, str] = {
    30: "CABINET",      # 地柜
    31: "CABINET",      # 地柜
    32: "CABINET",      # 地柜
    33: "CABINET",      # 地柜
    34: "CABINET",      # 吊柜
    41: "CABINET",      # 地柜
    42: "CABINET",      # 吊柜
    43: "CABINET",      # 地柜
    44: "CABINET",      # 地柜
    49: "CABINET",      # 地柜
    54: "CABINET",      # 地柜
    63: "CABINET",      # 吊柜
    64: "CABINET",      # 地柜
    84: "CABINET",      # 地柜
    # 可以根据需要添加更多映射
}


def mm_to_m(value: float) -> float:
    """将毫米转换为米"""
    return value / 1000.0


def create_transformation_matrix(
    position: Dict[str, float],
    rotation_data: Dict[str, float],
    size: Dict[str, float]
) -> np.ndarray:
    """创建变换矩阵
    
    Args:
        position: 位置字典，包含 x, y, z（单位：毫米）
        rotation_data: 旋转字典，包含 x, y, z（单位：弧度）
        size: 尺寸字典，包含 x, y, z（单位：毫米）
    
    Returns:
        4x4 变换矩阵
    """
    # 转换为米
    pos_x = mm_to_m(position["x"])
    pos_y = mm_to_m(position["y"])
    pos_z = mm_to_m(position["z"])
    
    # 创建旋转矩阵（绕 Z 轴旋转）
    z_angle = rotation_data.get("z", 0.0)
    rot_matrix = rotation(z_angle, "Z")
    
    # 设置平移（注意：家具的 z 位置通常是底部，需要调整到中心）
    height = mm_to_m(size["z"])
    rot_matrix[0, 3] = pos_x
    rot_matrix[1, 3] = pos_y
    rot_matrix[2, 3] = pos_z + height / 2.0  # 将底部位置调整为中心位置
    
    return rot_matrix


def build_ifc_from_layout_results(
    json_path: str,
    output_path: str,
    room_id: Optional[str] = None
) -> ifcopenshell.file:
    """从 layout_model_results.json 构建 IFC 文件
    
    Args:
        json_path: JSON 文件路径
        output_path: 输出 IFC 文件路径
        room_id: 房间ID，如果为None则使用第一个房间
    
    Returns:
        创建的 IFC 文件对象
    """
    # 读取 JSON 文件
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 获取布局结果
    layout_result = data.get("layoutResult", {})
    if not layout_result:
        raise ValueError("JSON 文件中没有找到 layoutResult")
    
    # 获取第一个房间（或指定的房间）
    if room_id is None:
        room_id = list(layout_result.keys())[0]
    
    room_data = layout_result.get(room_id)
    if not room_data:
        raise ValueError(f"找不到房间ID: {room_id}")
    
    # 创建 IFC 项目
    model = create_single_storey_building_project(
        name=f"Layout Model - Room {room_id}",
        dual_context=False
    )
    
    # 获取楼层
    storey = model.by_type("IfcBuildingStorey")[0]
    
    # 创建空间（房间）
    space = create_space(
        model=model,
        name=f"Room {room_id}",
        storey=storey,
        psets={
            "Pset_SpaceCommon": {
                "RoomId": room_id,
                "LayoutStatus": room_data.get("layoutStatus", 0)
            }
        }
    )
    
    # 处理每个房间布局
    room_layout_list = room_data.get("roomLayoutList", [])
    for room_layout in room_layout_list:
        layout_id = room_layout.get("id", "")
        furniture_models = room_layout.get("furnitureModels", [])
        
        # 为每个家具创建 IFC 元素
        for furniture_data in furniture_models:
            furniture_id = furniture_data.get("id", "")
            furniture_layout = furniture_data.get("furnitureLayout", {})
            
            if not furniture_layout:
                continue
            
            # 获取家具类型
            furniture_type_id = furniture_layout.get("type")
            furniture_type = FURNITURE_TYPE_MAP.get(furniture_type_id, "CABINET")
            
            # 获取尺寸（单位：毫米）
            size_dict = furniture_layout.get("size", {})
            size = (
                mm_to_m(size_dict.get("x", 0)),
                mm_to_m(size_dict.get("y", 0)),
                mm_to_m(size_dict.get("z", 0))
            )
            
            # 获取位置和旋转
            position = furniture_layout.get("position", {})
            rotation_data = furniture_layout.get("rotation", {})
            
            # 创建变换矩阵
            matrix = create_transformation_matrix(position, rotation_data, size_dict)
            
            # 创建家具
            furniture = create_furniture(
                model=model,
                name=f"Furniture_{furniture_type_id}_{furniture_id[:8]}",
                size=size,
                matrix=matrix,
                space=space,
                storey=storey,
                predefined_type="USERDEFINED",
                use_default_geometry=True,
                furniture_type=furniture_type,
                psets={
                    "Pset_FurnitureTypeCommon": {
                        "FurnitureTypeId": furniture_type_id,
                        "FurnitureId": furniture_id,
                        "LayoutId": layout_id,
                        "RoomId": room_id,
                        "Position": f"{position.get('x', 0)}, {position.get('y', 0)}, {position.get('z', 0)}",
                        "Rotation": f"{rotation_data.get('x', 0)}, {rotation_data.get('y', 0)}, {rotation_data.get('z', 0)}",
                        "Size": f"{size_dict.get('x', 0)}, {size_dict.get('y', 0)}, {size_dict.get('z', 0)}",
                    }
                }
            )
    
    # 保存 IFC 文件
    model.write(output_path)
    print(f"IFC 文件已保存到: {output_path}")
    
    return model


def main():
    """主函数"""
    # 设置路径
    json_path = Path(__file__).parent.parent / "src" / "maas_lego" / "constant" / "layout_model_results.json"
    output_path = Path(__file__).parent.parent / "data" / "layout_model_output.ifc"
    
    # 确保输出目录存在
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    # 构建 IFC 文件
    try:
        model = build_ifc_from_layout_results(
            json_path=str(json_path),
            output_path=str(output_path),
            room_id="415"  # 使用 JSON 中的房间ID
        )
        print(f"成功创建 IFC 文件，包含 {len(model.by_type('IfcFurniture'))} 个家具元素")
    except Exception as e:
        print(f"错误: {e}")
        raise


if __name__ == "__main__":
    main()

