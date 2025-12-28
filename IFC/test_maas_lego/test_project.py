"""测试 maas_lego.core.project 模块"""
from maas_lego.core.project import (
    create_empty_project,
    create_single_building_project,
    create_single_storey_building_project,
)
from maas_lego.constant.colors import DEFAULT_COLORS

# 从 conftest 导入工具函数（fixtures 会自动发现）
try:
    from .conftest import validate_with_maas_ifc_file
except ImportError:
    # 如果相对导入失败，尝试绝对导入
    from tests.test_maas_lego.conftest import validate_with_maas_ifc_file


class TestProject:
    """测试 project.py 中的函数"""

    def test_create_empty_project_default_name(self):
        """测试使用默认名称创建空项目，并用 MaasIfcFile 验证"""
        model = create_empty_project()
        
        # 验证项目存在
        projects = model.by_type("IfcProject")
        assert len(projects) == 1
        assert projects[0].Name == "My Project"
        
        # 验证 context 存在
        contexts = model.by_type("IfcGeometricRepresentationContext")
        assert len(contexts) > 0
        
        # 验证默认颜色材质已添加
        materials = model.by_type("IfcMaterial")
        material_names = [m.Name for m in materials]
        for name, _, _ in DEFAULT_COLORS:
            assert name in material_names
        
        # 使用 MaasIfcFile 验证文件可被下游正常使用
        maas_file = validate_with_maas_ifc_file(model, check_version=False)
        assert maas_file is not None
        maas_file.close()

    def test_create_empty_project_custom_name(self):
        """测试使用自定义名称创建空项目，并用 MaasIfcFile 验证"""
        model = create_empty_project("Custom Project")
        projects = model.by_type("IfcProject")
        assert projects[0].Name == "Custom Project"
        
        # 使用 MaasIfcFile 验证
        maas_file = validate_with_maas_ifc_file(model, check_version=False)
        assert maas_file is not None
        maas_file.close()

    def test_create_single_building_project(self):
        """测试创建包含建筑的项目，并用 MaasIfcFile 验证"""
        model = create_single_building_project("Building Project")
        
        # 验证项目
        projects = model.by_type("IfcProject")
        assert len(projects) == 1
        
        # 验证站点
        sites = model.by_type("IfcSite")
        assert len(sites) == 1
        
        # 验证建筑
        buildings = model.by_type("IfcBuilding")
        assert len(buildings) == 1
        
        # 使用 MaasIfcFile 验证
        maas_file = validate_with_maas_ifc_file(model, check_version=False)
        storey_to_root = maas_file.build_storey_to_root_element()
        assert storey_to_root is not None
        maas_file.close()

    def test_create_single_storey_building_project(self):
        """测试创建包含楼层的项目，并用 MaasIfcFile 验证"""
        model = create_single_storey_building_project("Storey Project")
        
        # 验证项目
        projects = model.by_type("IfcProject")
        assert len(projects) == 1
        
        # 验证站点
        sites = model.by_type("IfcSite")
        assert len(sites) == 1
        
        # 验证建筑
        buildings = model.by_type("IfcBuilding")
        assert len(buildings) == 1
        
        # 验证楼层
        storeys = model.by_type("IfcBuildingStorey")
        assert len(storeys) == 1
        
        # 使用 MaasIfcFile 验证
        maas_file = validate_with_maas_ifc_file(model, check_version=False)
        storey_to_root = maas_file.build_storey_to_root_element()
        assert len(storey_to_root) > 0
        storey_to_room = maas_file.build_storey_to_room()
        assert storey_to_room is not None
        maas_file.close()

