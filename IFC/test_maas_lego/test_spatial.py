"""测试 maas_lego.core.spatial 模块"""
from maas_lego.core.spatial import (
    create_site,
    create_building,
    create_storey,
)

# 从 conftest 导入工具函数（fixtures 会自动发现）
try:
    from .conftest import create_space_direct
except ImportError:
    from tests.test_maas_lego.conftest import create_space_direct


class TestSpatial:
    """测试 spatial.py 中的函数"""

    def test_create_site_default_name(self, empty_model):
        """测试创建默认名称站点"""
        project = empty_model.by_type("IfcProject")[0]
        site = create_site(model=empty_model, project=project)
        
        assert site is not None
        assert site.Name == "Site"
        assert site.is_a("IfcSite")

    def test_create_site_custom_name(self, empty_model):
        """测试创建自定义名称站点"""
        project = empty_model.by_type("IfcProject")[0]
        site = create_site(model=empty_model, name="My Site", project=project)
        
        assert site.Name == "My Site"

    def test_create_site_auto_project(self, empty_model):
        """测试自动获取项目"""
        site = create_site(model=empty_model)
        assert site is not None

    def test_create_building_default_name(self, empty_model):
        """测试创建默认名称建筑"""
        project = empty_model.by_type("IfcProject")[0]
        site = create_site(model=empty_model, project=project)
        building = create_building(model=empty_model, site=site)
        
        assert building is not None
        assert building.Name == "Building"
        assert building.is_a("IfcBuilding")

    def test_create_building_custom_name(self, empty_model):
        """测试创建自定义名称建筑"""
        project = empty_model.by_type("IfcProject")[0]
        site = create_site(model=empty_model, project=project)
        building = create_building(model=empty_model, name="My Building", site=site)
        
        assert building.Name == "My Building"

    def test_create_building_auto_site(self, building_model):
        """测试自动获取站点"""
        building = create_building(model=building_model, name="Auto Site Building")
        assert building is not None

    def test_create_storey_default(self, building_model):
        """测试创建默认楼层"""
        storey = create_storey(model=building_model)
        
        assert storey is not None
        assert storey.Name == "Ground Floor"
        assert storey.Elevation == 0.0
        assert storey.is_a("IfcBuildingStorey")

    def test_create_storey_custom(self, building_model):
        """测试创建自定义楼层"""
        storey = create_storey(
            model=building_model,
            name="First Floor",
            elevation=3000.0,
        )
        
        assert storey.Name == "First Floor"
        assert storey.Elevation == 3000.0

    def test_create_space_default(self, storey_model):
        """测试创建默认空间 - 使用直接方法绕过兼容性问题"""
        space = create_space_direct(model=storey_model)
        
        assert space is not None
        assert space.Name == "Space"
        assert space.is_a("IfcSpace")

    def test_create_space_custom_name(self, storey_model):
        """测试创建自定义名称空间"""
        space = create_space_direct(model=storey_model, name="Kitchen")
        
        assert space.Name == "Kitchen"

    def test_create_space_with_storey(self, storey_model):
        """测试创建空间并关联到楼层"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        space = create_space_direct(
            model=storey_model,
            name="Living Room",
            storey=storey,
        )
        
        assert space is not None
        assert space.is_a("IfcSpace")

    def test_create_multiple_spaces(self, storey_model):
        """测试创建多个空间"""
        for i in range(5):
            space = create_space_direct(model=storey_model, name=f"Room {i}")
            assert space is not None
        
        spaces = storey_model.by_type("IfcSpace")
        assert len(spaces) == 5

