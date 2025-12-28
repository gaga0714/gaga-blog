"""测试 maas_lego.core.structural 模块"""
import numpy as np
from maas_lego.core.structural import (
    create_covering,
    create_door,
    create_window,
    create_slab,
    create_wall,
    create_pillar,
    create_opening,
)

# 从 conftest 导入工具函数（fixtures 会自动发现）
try:
    from .conftest import validate_with_maas_ifc_file
except ImportError:
    from tests.test_maas_lego.conftest import validate_with_maas_ifc_file


class TestStructural:
    """测试 structural.py 中的函数"""

    def test_create_wall_basic(self, storey_model):
        """测试创建基本墙体，并用 MaasIfcFile 验证"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        wall = create_wall(model=storey_model, name="Wall 1", storey=storey)
        wall_guid = wall.GlobalId
        
        assert wall is not None
        assert wall.Name == "Wall 1"
        assert wall.is_a("IfcWall")
        
        # 使用 MaasIfcFile 验证
        maas_file = validate_with_maas_ifc_file(
            storey_model,
            check_elements=[wall_guid],
            check_version=False,
        )
        wall_element = maas_file.by_guid(wall_guid)
        assert wall_element is not None
        assert wall_element.is_a("IfcWall")
        maas_file.close()

    def test_create_wall_with_matrix(self, storey_model):
        """测试使用矩阵创建墙体"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        matrix = np.eye(4)
        matrix[:3, 3] = [100.0, 200.0, 0.0]
        
        wall = create_wall(
            model=storey_model,
            name="Wall Placed",
            matrix=matrix,
            storey=storey,
        )
        
        assert wall.ObjectPlacement is not None

    def test_create_wall_with_predefined_type(self, storey_model):
        """测试创建不同类型墙体"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        wall = create_wall(
            model=storey_model,
            name="Partition Wall",
            predefined_type="PARTITIONING",
            storey=storey,
        )
        
        assert wall.PredefinedType == "PARTITIONING"

    def test_create_wall_with_psets(self, storey_model):
        """测试创建带属性集的墙体"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        psets = {"Pset_WallCommon": {"IsExternal": False}}
        wall = create_wall(
            model=storey_model,
            name="Wall with Psets",
            storey=storey,
            psets=psets,
        )
        
        assert wall is not None

    def test_create_slab_basic(self, storey_model):
        """测试创建基本楼板"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        slab = create_slab(model=storey_model, name="Slab 1", storey=storey)
        
        assert slab is not None
        assert slab.Name == "Slab 1"
        assert slab.is_a("IfcSlab")

    def test_create_slab_with_predefined_type(self, storey_model):
        """测试创建不同类型楼板"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        slab = create_slab(
            model=storey_model,
            name="Roof Slab",
            predefined_type="ROOF",
            storey=storey,
        )
        
        assert slab.PredefinedType == "ROOF"

    def test_create_pillar_basic(self, storey_model):
        """测试创建基本柱子"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        pillar = create_pillar(model=storey_model, name="Pillar 1", storey=storey)
        
        assert pillar is not None
        assert pillar.Name == "Pillar 1"
        assert pillar.is_a("IfcColumn")

    def test_create_pillar_with_predefined_type(self, storey_model):
        """测试创建不同类型柱子"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        pillar = create_pillar(
            model=storey_model,
            name="Pilaster",
            predefined_type="PILASTER",
            storey=storey,
        )
        
        assert pillar.PredefinedType == "PILASTER"

    def test_create_door_basic(self, storey_model):
        """测试创建基本门"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        door = create_door(model=storey_model, name="Door 1", storey=storey)
        
        assert door is not None
        assert door.Name == "Door 1"
        assert door.is_a("IfcDoor")

    def test_create_door_with_predefined_type(self, storey_model):
        """测试创建不同类型门"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        door = create_door(
            model=storey_model,
            name="Gate",
            predefined_type="GATE",
            storey=storey,
        )
        
        assert door.PredefinedType == "GATE"

    def test_create_window_basic(self, storey_model):
        """测试创建基本窗户"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        window = create_window(model=storey_model, name="Window 1", storey=storey)
        
        assert window is not None
        assert window.Name == "Window 1"
        assert window.is_a("IfcWindow")

    def test_create_window_with_predefined_type(self, storey_model):
        """测试创建不同类型窗户"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        window = create_window(
            model=storey_model,
            name="Skylight",
            predefined_type="SKYLIGHT",
            storey=storey,
        )
        
        assert window.PredefinedType == "SKYLIGHT"

    def test_create_covering_basic(self, storey_model):
        """测试创建基本装饰面"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        covering = create_covering(model=storey_model, name="Floor Covering", storey=storey)
        
        assert covering is not None
        assert covering.Name == "Floor Covering"
        assert covering.is_a("IfcCovering")

    def test_create_covering_with_predefined_type(self, storey_model):
        """测试创建不同类型装饰面"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        covering = create_covering(
            model=storey_model,
            name="Roof Covering",
            predefined_type="ROOFING",
            storey=storey,
        )
        
        assert covering.PredefinedType == "ROOFING"

    def test_create_opening_basic(self, storey_model):
        """测试创建基本开口"""
        opening = create_opening(model=storey_model, name="Opening 1")
        
        assert opening is not None
        assert opening.Name == "Opening 1"
        assert opening.is_a("IfcOpeningElement")

    def test_create_opening_with_matrix_placement(self, storey_model):
        """测试使用矩阵创建带位置的开口"""
        matrix = np.eye(4)
        matrix[:3, 3] = [100.0, 0.0, 500.0]
        
        opening = create_opening(
            model=storey_model,
            name="Opening Placed",
            matrix=matrix,
        )
        
        assert opening.ObjectPlacement is not None

    def test_create_opening_with_predefined_type(self, storey_model):
        """测试创建不同类型开口"""
        opening = create_opening(
            model=storey_model,
            name="Recess",
            predefined_type="RECESS",
        )
        
        assert opening.PredefinedType == "RECESS"

    def test_create_opening_with_matrix(self, storey_model):
        """测试使用矩阵创建开口"""
        matrix = np.eye(4)
        matrix[:3, 3] = [200.0, 0.0, 100.0]
        
        opening = create_opening(
            model=storey_model,
            name="Matrix Opening",
            matrix=matrix,
        )
        
        assert opening is not None

    def test_wall_with_representation(self, storey_model, sample_representation):
        """测试创建带几何表示的墙体"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        wall = create_wall(
            model=storey_model,
            name="Wall with Geometry",
            storey=storey,
            representation=sample_representation,
        )
        
        assert wall.Representation is not None

