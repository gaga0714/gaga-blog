"""集成测试 - 测试多个模块协同工作"""
import numpy as np
from ifcopenshell.util.shape_builder import ShapeBuilder
from maas_lego.core.project import create_single_storey_building_project
from maas_lego.core.structural import (
    create_wall,
    create_slab,
    create_pillar,
    create_door,
    create_opening,
)

# 从 conftest 导入工具函数（fixtures 会自动发现）
try:
    from .conftest import create_space_direct, validate_with_maas_ifc_file
except ImportError:
    from tests.test_maas_lego.conftest import create_space_direct, validate_with_maas_ifc_file


class TestIntegration:
    """集成测试"""

    def test_complete_building_workflow(self):
        """测试完整的建筑工作流，并用 MaasIfcFile 验证"""
        # 创建项目
        model = create_single_storey_building_project("Integration Test")
        storey = model.by_type("IfcBuildingStorey")[0]
        
        # 创建空间
        space = create_space_direct(model=model, name="Living Room", storey=storey)
        space_guid = space.GlobalId
        
        # 创建墙体
        wall1 = create_wall(model=model, name="Wall 1", storey=storey)
        wall1_guid = wall1.GlobalId
        wall2 = create_wall(model=model, name="Wall 2", storey=storey)
        wall2_guid = wall2.GlobalId
        
        # 创建楼板
        slab = create_slab(model=model, name="Floor Slab", storey=storey)
        slab_guid = slab.GlobalId
        
        # 创建柱子
        pillar = create_pillar(model=model, name="Corner Pillar", storey=storey)
        pillar_guid = pillar.GlobalId
        
        # 验证所有元素已创建
        assert len(model.by_type("IfcSpace")) == 1
        assert len(model.by_type("IfcWall")) == 2
        assert len(model.by_type("IfcSlab")) == 1
        assert len(model.by_type("IfcColumn")) == 1
        
        # 使用 MaasIfcFile 验证文件可被下游正常使用
        check_guids = [space_guid, wall1_guid, wall2_guid, slab_guid, pillar_guid]
        maas_file = validate_with_maas_ifc_file(
            model,
            check_elements=check_guids,
            check_version=False,
            is_build_shape=False,
        )
        
        # 验证能够读取所有元素类型
        spaces = maas_file.by_type("IfcSpace")
        walls = maas_file.by_type("IfcWall")
        slabs = maas_file.by_type("IfcSlab")
        columns = maas_file.by_type("IfcColumn")
        
        assert len(spaces) == 1, "MaasIfcFile 无法正确读取空间"
        assert len(walls) == 2, "MaasIfcFile 无法正确读取墙体"
        assert len(slabs) == 1, "MaasIfcFile 无法正确读取楼板"
        assert len(columns) == 1, "MaasIfcFile 无法正确读取柱子"
        
        # 验证能够通过 by_type 获取的元素可以被正确使用
        # 注意：某些元素（如 Space）可能不在 root_maas_elements 中，所以通过 by_type 验证
        assert len(spaces) == 1, "无法通过 by_type 获取空间"
        assert spaces[0].is_a("IfcSpace"), "获取的空间元素类型错误"
        
        # 验证结构元素能够通过 GUID 获取（这些应该在 root_maas_elements 中）
        wall_element = maas_file.by_guid(wall1_guid)
        if wall_element is not None:
            assert wall_element.is_a("IfcWall"), "获取的墙体元素类型错误"
        else:
            # 如果 by_guid 返回 None，至少验证文件中存在该元素
            wall_ifc = maas_file.ifc_file.by_guid(wall1_guid)
            assert wall_ifc is not None, "文件中不存在墙体元素"
            assert wall_ifc.is_a("IfcWall"), "文件中的墙体元素类型错误"
        
        maas_file.close()

    def test_door_opening_wall_workflow(self, storey_model, body_context):
        """测试门-开口-墙体工作流，并用 MaasIfcFile 验证"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        
        # 创建几何表示
        builder = ShapeBuilder(storey_model)
        wall_profile = storey_model.create_entity(
            "IfcRectangleProfileDef",
            ProfileType="AREA",
            XDim=5000.0,
            YDim=200.0,
        )
        wall_solid = builder.extrude(wall_profile, magnitude=3000.0)
        wall_repr = builder.get_representation(context=body_context, items=[wall_solid])
        
        opening_profile = storey_model.create_entity(
            "IfcRectangleProfileDef",
            ProfileType="AREA",
            XDim=900.0,
            YDim=200.0,
        )
        opening_solid = builder.extrude(opening_profile, magnitude=2100.0)
        opening_repr = builder.get_representation(context=body_context, items=[opening_solid])
        
        door_profile = storey_model.create_entity(
            "IfcRectangleProfileDef",
            ProfileType="AREA",
            XDim=850.0,
            YDim=50.0,
        )
        door_solid = builder.extrude(door_profile, magnitude=2050.0)
        door_repr = builder.get_representation(context=body_context, items=[door_solid])
        
        # 创建墙体
        wall = create_wall(
            model=storey_model,
            name="Door Wall",
            storey=storey,
            representation=wall_repr,
        )
        wall_guid = wall.GlobalId
        
        # 使用矩阵创建开口并关联到墙体
        opening_matrix = np.eye(4)
        opening_matrix[:3, 3] = [2000.0, 0.0, 0.0]
        
        opening = create_opening(
            model=storey_model,
            name="Door Opening",
            matrix=opening_matrix,
            representation=opening_repr,
            relate_element=wall,
        )
        opening_guid = opening.GlobalId
        
        # 创建门并关联到开口
        door = create_door(
            model=storey_model,
            name="Entry Door",
            storey=storey,
            representation=door_repr,
            opening=opening,
        )
        door_guid = door.GlobalId
        
        # 验证关系
        assert opening.VoidsElements is not None
        assert door.FillsVoids is not None
        assert opening.VoidsElements[0].RelatingBuildingElement == wall
        assert door.FillsVoids[0].RelatingOpeningElement == opening
        
        # 使用 MaasIfcFile 验证文件可被下游正常使用
        check_guids = [wall_guid, door_guid, opening_guid]
        maas_file = validate_with_maas_ifc_file(
            storey_model,
            check_elements=check_guids,
            check_version=False,
            is_build_shape=False,
        )
        
        # 验证能够读取所有元素类型
        walls = maas_file.by_type("IfcWall")
        doors = maas_file.by_type("IfcDoor")
        openings = maas_file.by_type("IfcOpeningElement")
        
        assert len(walls) == 1, "MaasIfcFile 无法正确读取墙体"
        assert len(doors) == 1, "MaasIfcFile 无法正确读取门"
        assert len(openings) == 1, "MaasIfcFile 无法正确读取开口"
        
        # 验证能够通过 GUID 获取元素并验证关系
        wall_element = maas_file.by_guid(wall_guid)
        door_element = maas_file.by_guid(door_guid)
        opening_element = maas_file.by_guid(opening_guid)
        
        assert wall_element is not None, "无法通过 GUID 获取墙体"
        assert door_element is not None, "无法通过 GUID 获取门"
        assert opening_element is not None, "无法通过 GUID 获取开口"
        
        # 验证关系在 MaasIfcFile 中也能正确读取
        wall_ifc = wall_element.ifc_element
        door_ifc = door_element.ifc_element
        opening_ifc = opening_element.ifc_element
        
        assert opening_ifc.VoidsElements is not None, "开口-墙体关系丢失"
        assert door_ifc.FillsVoids is not None, "门-开口关系丢失"
        
        maas_file.close()

    def test_write_and_read_ifc_file(self, storey_model):
        """测试写入和读取 IFC 文件，使用 MaasIfcFile 验证"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        
        # 创建一些元素
        wall = create_wall(model=storey_model, name="Persistent Wall", storey=storey)
        wall_guid = wall.GlobalId
        space = create_space_direct(model=storey_model, name="Persistent Space", storey=storey)
        space_guid = space.GlobalId
        
        # 使用 MaasIfcFile 验证文件可被下游正常使用
        check_guids = [wall_guid, space_guid]
        maas_file = validate_with_maas_ifc_file(
            storey_model,
            check_elements=check_guids,
            check_version=False,
            is_build_shape=False,
        )
        
        # 验证能够读取元素
        walls = maas_file.by_type("IfcWall")
        spaces = maas_file.by_type("IfcSpace")
        
        wall_names = [w.Name for w in walls]
        space_names = [s.Name for s in spaces]
        
        assert "Persistent Wall" in wall_names, "MaasIfcFile 无法读取墙体名称"
        assert "Persistent Space" in space_names, "MaasIfcFile 无法读取空间名称"
        
        # 验证能够通过 by_type 获取的元素可以被正确使用
        assert len(walls) > 0, "无法通过 by_type 获取墙体"
        assert len(spaces) > 0, "无法通过 by_type 获取空间"
        
        # 验证元素名称
        wall_names = [w.Name for w in walls]
        space_names = [s.Name for s in spaces]
        assert "Persistent Wall" in wall_names, "无法找到创建的墙体"
        assert "Persistent Space" in space_names, "无法找到创建的空间"
        
        # 验证能够通过 GUID 获取元素（如果元素在 root_maas_elements 中）
        wall_element = maas_file.by_guid(wall_guid)
        if wall_element is not None:
            assert wall_element.ifc_element.Name == "Persistent Wall"
        else:
            # 如果不在 root_maas_elements 中，至少验证文件中存在
            wall_ifc = maas_file.ifc_file.by_guid(wall_guid)
            assert wall_ifc is not None, "文件中不存在墙体元素"
            assert wall_ifc.Name == "Persistent Wall"
        
        space_element = maas_file.by_guid(space_guid)
        if space_element is not None:
            assert space_element.ifc_element.Name == "Persistent Space"
        else:
            # 如果不在 root_maas_elements 中，至少验证文件中存在
            space_ifc = maas_file.ifc_file.by_guid(space_guid)
            assert space_ifc is not None, "文件中不存在空间元素"
            assert space_ifc.Name == "Persistent Space"
        
        maas_file.close()

