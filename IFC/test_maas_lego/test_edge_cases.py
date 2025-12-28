"""边界条件测试"""
import numpy as np
from maas_lego.core.spatial import create_storey
from maas_lego.core.structural import create_wall

# 从 conftest 导入工具函数（fixtures 会自动发现）
try:
    from .conftest import create_space_direct
except ImportError:
    from tests.test_maas_lego.conftest import create_space_direct


class TestEdgeCases:
    """边界条件测试"""

    def test_create_multiple_storeys(self, building_model):
        """测试创建多个楼层"""
        storeys = []
        for i in range(5):
            storey = create_storey(
                model=building_model,
                name=f"Floor {i}",
                elevation=float(i * 3000),
            )
            storeys.append(storey)
        
        assert len(building_model.by_type("IfcBuildingStorey")) == 5

    def test_create_multiple_spaces_in_storey(self, storey_model):
        """测试在一个楼层创建多个空间"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        for i in range(10):
            create_space_direct(
                model=storey_model,
                name=f"Room {i}",
                storey=storey,
            )
        
        assert len(storey_model.by_type("IfcSpace")) == 10

    def test_create_wall_with_matrix_transformation(self, storey_model):
        """测试使用矩阵变换创建墙体"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        
        # 创建旋转矩阵
        angle = np.pi / 4  # 45度
        matrix = np.array([
            [np.cos(angle), -np.sin(angle), 0, 1000],
            [np.sin(angle), np.cos(angle), 0, 2000],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ])
        
        wall = create_wall(
            model=storey_model,
            name="Rotated Wall",
            storey=storey,
            matrix=matrix,
        )
        
        assert wall is not None

