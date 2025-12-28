"""测试 maas_lego.relationships.rel 模块"""
from maas_lego.core.structural import (
    create_wall,
    create_door,
    create_window,
    create_opening,
)
from maas_lego.relationships.rel import add_opening_to_element, add_filling_to_opening

# 从 conftest 导入工具函数（fixtures 会自动发现）
try:
    from .conftest import validate_with_maas_ifc_file
except ImportError:
    from tests.test_maas_lego.conftest import validate_with_maas_ifc_file


class TestRelationships:
    """测试 relationships/rel.py 中的函数"""

    def test_add_opening_to_wall(self, storey_model, sample_representation):
        """测试将开口添加到墙体，并用 MaasIfcFile 验证"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        wall = create_wall(
            model=storey_model,
            name="Wall with Opening",
            storey=storey,
            representation=sample_representation,
        )
        wall_guid = wall.GlobalId
        
        opening = create_opening(
            model=storey_model,
            name="Wall Opening",
            representation=sample_representation,
        )
        opening_guid = opening.GlobalId
        
        add_opening_to_element(
            model=storey_model,
            opening=opening,
            element=wall,
        )
        
        # 验证关系已建立
        assert opening.VoidsElements is not None
        assert len(opening.VoidsElements) > 0
        assert opening.VoidsElements[0].RelatingBuildingElement == wall
        
        # 使用 MaasIfcFile 验证关系在文件中正确保存
        maas_file = validate_with_maas_ifc_file(
            storey_model,
            check_elements=[wall_guid, opening_guid],
            check_version=False,
        )
        
        wall_element = maas_file.by_guid(wall_guid)
        opening_element = maas_file.by_guid(opening_guid)
        
        assert wall_element is not None
        assert opening_element is not None
        
        # 验证关系在 MaasIfcFile 中也能正确读取
        opening_ifc = opening_element.ifc_element
        assert opening_ifc.VoidsElements is not None, "开口-墙体关系在 MaasIfcFile 中丢失"
        assert opening_ifc.VoidsElements[0].RelatingBuildingElement.GlobalId == wall_guid
        
        maas_file.close()

    def test_add_opening_to_element_idempotent(self, storey_model, sample_representation):
        """测试重复添加开口到同一元素"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        wall = create_wall(
            model=storey_model,
            name="Wall Idempotent",
            storey=storey,
            representation=sample_representation,
        )
        
        opening = create_opening(
            model=storey_model,
            name="Opening Idempotent",
            representation=sample_representation,
        )
        
        add_opening_to_element(model=storey_model, opening=opening, element=wall)
        add_opening_to_element(model=storey_model, opening=opening, element=wall)
        
        # 验证只有一个关系
        assert len(opening.VoidsElements) == 1

    def test_add_filling_to_opening(self, storey_model, sample_representation):
        """测试将门添加到开口，并用 MaasIfcFile 验证"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        
        opening = create_opening(
            model=storey_model,
            name="Door Opening",
            representation=sample_representation,
        )
        opening_guid = opening.GlobalId
        
        door = create_door(
            model=storey_model,
            name="Filling Door",
            storey=storey,
            representation=sample_representation,
        )
        door_guid = door.GlobalId
        
        add_filling_to_opening(
            model=storey_model,
            opening=opening,
            element=door,
        )
        
        # 验证关系已建立
        assert door.FillsVoids is not None
        assert len(door.FillsVoids) > 0
        assert door.FillsVoids[0].RelatingOpeningElement == opening
        
        # 使用 MaasIfcFile 验证关系在文件中正确保存
        maas_file = validate_with_maas_ifc_file(
            storey_model,
            check_elements=[door_guid, opening_guid],
            check_version=False,
        )
        
        door_element = maas_file.by_guid(door_guid)
        opening_element = maas_file.by_guid(opening_guid)
        
        assert door_element is not None
        assert opening_element is not None
        
        # 验证关系在 MaasIfcFile 中也能正确读取
        door_ifc = door_element.ifc_element
        assert door_ifc.FillsVoids is not None, "门-开口关系在 MaasIfcFile 中丢失"
        assert door_ifc.FillsVoids[0].RelatingOpeningElement.GlobalId == opening_guid
        
        maas_file.close()

    def test_add_filling_to_opening_idempotent(self, storey_model, sample_representation):
        """测试重复添加填充到同一开口"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        
        opening = create_opening(
            model=storey_model,
            name="Filling Opening",
            representation=sample_representation,
        )
        
        window = create_window(
            model=storey_model,
            name="Filling Window",
            storey=storey,
            representation=sample_representation,
        )
        
        add_filling_to_opening(model=storey_model, opening=opening, element=window)
        add_filling_to_opening(model=storey_model, opening=opening, element=window)
        
        # 验证只有一个关系
        assert len(window.FillsVoids) == 1

    def test_create_door_with_opening(self, storey_model, sample_representation):
        """测试创建门时直接关联开口"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        
        opening = create_opening(
            model=storey_model,
            name="Pre-created Opening",
            representation=sample_representation,
        )
        
        door = create_door(
            model=storey_model,
            name="Door with Opening",
            storey=storey,
            representation=sample_representation,
            opening=opening,
        )
        
        # 验证门已填充开口
        assert door.FillsVoids is not None

    def test_create_window_with_opening(self, storey_model, sample_representation):
        """测试创建窗户时直接关联开口"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        
        opening = create_opening(
            model=storey_model,
            name="Window Opening",
            representation=sample_representation,
        )
        
        window = create_window(
            model=storey_model,
            name="Window with Opening",
            storey=storey,
            representation=sample_representation,
            opening=opening,
        )
        
        # 验证窗户已填充开口
        assert window.FillsVoids is not None

