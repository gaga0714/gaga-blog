import json
from maas_lego.core.furniture import create_furniture
from maas_lego.core.project import create_single_storey_building_project
from maas_lego.core.spatial import create_space
from maas_lego.core.style import add_element_color
from maas_lego.constant.colors import FURNITURE_COLOR_MAP
from maas_lego.utils.furniture_type import extract_base_type
from ifcopenshell.util.placement import rotation as create_rotation
from util.extract_wall_data import extract_space_walls_data,get_matrix,_create_box_sweptsolid_representation,_model_units_matrix_to_si
from ifcopenshell.util.unit import calculate_unit_scale
from maas_lego.core.structural import create_wall, create_opening

walls_input_path='data/file.ifc'
# space_id will be determined from room_id in the JSON


def create_matrix(position,rotation):
    z_angle=rotation.get("z")
    rot_matrix=create_rotation(z_angle,"Z",is_degrees=False)
    rot_matrix[0,3]=position.get("x")
    rot_matrix[1,3]=position.get("y")
    rot_matrix[2,3]=position.get("z")
    return rot_matrix

def results_to_ifc(input_path,output_path):
    with open(input_path,'r',encoding='utf-8') as f:
        data=json.load(f)
    layout_result=data.get("layoutResult")
    room_id=list(layout_result.keys())[0]
    room_data=layout_result.get(room_id)
    room_layout_list=room_data.get("roomLayoutList")
    model=create_single_storey_building_project(f"Layout Model - Room {room_id}")
    space=create_space(
        model=model,
        name=f"Room {room_id}",
        storey=model.by_type("IfcBuildingStorey")[0],
        psets={
            "Pset_SpaceCommon": {
                "RoomId":room_id,
                "LayoutStatus":room_data.get("layoutStatus")
            }
        }
    )
    
    # Extract walls data once, before processing furniture
    # Try to find space in source IFC file using room_id
    # 如果找不到精确匹配，使用第一个space作为fallback
    try:
        walls_data = extract_space_walls_data(walls_input_path, room_id, fallback_to_first_space=True)
        dst_space_matrix = get_matrix(space)
        dst_scale = float(calculate_unit_scale(model))
        created_walls = 0
        created_openings = 0
        
        for w in walls_data:
            if w.dims is None:
                print(f"[warning] 墙 {w.name} (GUID: {w.guid}) 没有尺寸信息，跳过")
                continue
            dst_wall_matrix = dst_space_matrix @ w.rel_matrix_in_src_space
            wall_rep = _create_box_sweptsolid_representation(model, w.dims)
            dst_wall = create_wall(
                model=model,
                name=w.name,
                predefined_type="STANDARD",
                matrix=dst_wall_matrix,
                space=space,
                representation=wall_rep,
                psets={
                    "Pset_SourceTrace": {
                        "SourceIfc": walls_input_path,
                        "SourceSpaceId": str(room_id),
                        "SourceWallGlobalId": w.guid,
                    }
                },
            )
            created_walls += 1

            for op in (w.openings or []):
                open_matrix_mm = dst_space_matrix @ op.rel_matrix_in_src_space
                open_matrix_si = _model_units_matrix_to_si(open_matrix_mm, dst_scale)
                op_rep = None
                if op.dims is not None:
                    op_rep = _create_box_sweptsolid_representation(model, op.dims)

                _ = create_opening(
                    model=model,
                    name=op.name,
                    matrix=open_matrix_si,
                    representation=op_rep,
                    relate_element=dst_wall,
                    psets={
                        "Pset_SourceTrace": {
                            "SourceIfc": walls_input_path,
                            "SourceSpaceId": str(room_id),
                            "SourceWallGlobalId": w.guid,
                            "SourceOpeningGlobalId": op.guid,
                        }
                    },
                )
                created_openings += 1
        
        print(f"[merge] created walls={created_walls}, openings={created_openings}")
    except ValueError as e:
        print(f"[warning] Could not extract walls: {e}")
        print(f"[warning] Continuing without walls for room_id={room_id}")
    
    for room_layout in room_layout_list:
        layout_id=room_layout.get("id")
        furniture_models=room_layout.get("furnitureModels")
        for furniture_model in furniture_models:
            furniture_id=furniture_model.get("id")
            furniture_layout=furniture_model.get("furnitureLayout")
            furniture_type=furniture_layout.get("type")
            furniture_size=furniture_layout.get("size")
            size=tuple(furniture_size.get(k) for k in ("x","y","z"))
            furniture_rotation=furniture_layout.get("rotation")
            furniture_position=furniture_layout.get("position")
            matrix=create_matrix(furniture_position,furniture_rotation)
            type_translated = furniture_layout.get("typeTranslated", "")
            base_type = extract_base_type(type_translated)
            color_name = FURNITURE_COLOR_MAP.get(base_type, 'LIGHT_GRAY') if base_type else 'LIGHT_GRAY'
            color_material = add_element_color(
                model=model,
                name=color_name,
                use_color_map=True,
            )
            furniture=create_furniture(
                model=model,
                name=f"Furniture_{furniture_type}_{furniture_id}",
                size=size,
                matrix=matrix,
                space=space,
                material=color_material,
                # furniture_type=furniture_type,# ?
                psets={
                    "Pset_FurnitureTypeCommon": {
                        "FurnitureTypeId": furniture_type,
                        "FurnitureId": furniture_id,
                        "LayoutId": layout_id,
                        "RoomId": room_id,
                        "TypeTranslated": type_translated,
                        "BaseType": base_type or "",
                        "Position": f"{furniture_position.get('x')}, {furniture_position.get('y')}, {furniture_position.get('z')}",
                        "Rotation": f"{furniture_rotation.get('x')}, {furniture_rotation.get('y')}, {furniture_rotation.get('z')}",
                        "Size": f"{size[0]}, {size[1]}, {size[2]}",
                    }
                }
            )
            
    model.write(output_path)
    print(f"IFC文件已保存到：{output_path}")

    return model


def main():
    # input_path='data/layout_model_results_trans.json'
    # output_path='results/processed_result_trans.ifc'
    input_path='data/1.json'
    output_path='results/1_has_wall_opening.ifc'


    model=results_to_ifc(input_path,output_path)
    print(f"创建成功，共{len(model.by_type('IfcFurniture'))}个家具")


if __name__ == "__main__":
    main()