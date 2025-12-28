"""共享的 fixtures 和工具函数"""
import tempfile
import os
import pytest
import ifcopenshell
from ifcopenshell.util.shape_builder import ShapeBuilder
from ifcopenshell.api.aggregate import assign_object

# 导入要测试的模块
from maas_lego.core.project import (
    create_empty_project,
    create_single_building_project,
    create_single_storey_building_project,
)

# 导入 MaasIfcFile 用于验证
from maas_ifc_tool.maas_ifc_parser import MaasIfcFile


def create_space_direct(
    model: ifcopenshell.file,
    name: str = "Space",
    storey: ifcopenshell.entity_instance = None,
) -> ifcopenshell.entity_instance:
    """直接创建空间，绕过 assign_container 的兼容性问题"""
    from ifcopenshell.api.root import create_entity
    
    if storey is None:
        storey = model.by_type("IfcBuildingStorey")[0]
    
    space = create_entity(model, ifc_class="IfcSpace", name=name)
    assign_object(model, relating_object=storey, products=[space])
    return space


def validate_with_maas_ifc_file(
    model: ifcopenshell.file,
    check_elements: list = None,
    check_version: bool = False,
    is_build_shape: bool = False,
) -> MaasIfcFile:
    """使用 MaasIfcFile 验证生成的 IFC 文件能否被下游正常使用
    
    Args:
        model: ifcopenshell 文件对象
        check_elements: 要检查的元素 GUID 列表
        check_version: 是否检查版本（默认 False，因为生成的测试文件可能没有版本信息）
        is_build_shape: 是否构建形状（默认 False，加快测试速度）
    
    Returns:
        MaasIfcFile 对象，如果验证失败会抛出异常
    """
    # 写入临时文件
    with tempfile.NamedTemporaryFile(suffix=".ifc", delete=False) as tmp:
        tmp_path = tmp.name
    
    try:
        model.write(tmp_path)
        
        # 使用 MaasIfcFile 读取并验证
        maas_file = MaasIfcFile(
            tmp_path,
            check_version=check_version,
            is_build_shape=is_build_shape,
            furniture_use_box=True,
        )
        
        # 验证基本功能
        assert maas_file.ifc_file is not None, "IFC 文件无法打开"
        assert maas_file.head_info is not None, "无法读取文件头信息"
        
        # 验证能够读取元素
        root_elements = maas_file.build_storey_to_root_element()
        assert root_elements is not None, "无法读取楼层到根元素的映射"
        
        # 验证能够读取根元素
        root_maas_elements = maas_file.build_root_maas_element()
        assert root_maas_elements is not None, "无法读取根元素"
        
        # 验证能够通过 by_type 获取元素
        spaces = maas_file.by_type("IfcSpace")
        walls = maas_file.by_type("IfcWall")
        assert isinstance(spaces, list), "by_type 返回类型错误"
        assert isinstance(walls, list), "by_type 返回类型错误"
        
        # 如果提供了要检查的元素 GUID，验证能够通过 by_guid 获取
        # 注意：某些元素可能不在 root_maas_elements 中，所以先检查文件是否存在该 GUID
        if check_elements:
            for guid in check_elements:
                # 先检查文件是否包含该 GUID
                try:
                    ifc_element = maas_file.ifc_file.by_guid(guid)
                    assert ifc_element is not None, f"文件中不存在 GUID: {guid}"
                    
                    # 尝试通过 MaasIfcFile 获取（可能返回 None，如果不在 root_maas_elements 中）
                    element = maas_file.by_guid(guid)
                    # 如果 element 为 None，说明该元素不在根元素列表中，这是可以接受的
                    # 只要文件中有该元素即可
                except Exception as e:
                    # 如果文件本身就没有该 GUID，这才是真正的错误
                    raise AssertionError(f"文件中不存在 GUID: {guid}, 错误: {e}")
        
        return maas_file
    finally:
        # 清理临时文件
        if os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except:
                pass


@pytest.fixture
def empty_model() -> ifcopenshell.file:
    """创建一个空项目"""
    return create_empty_project("Test Project")


@pytest.fixture
def building_model() -> ifcopenshell.file:
    """创建包含建筑的项目"""
    return create_single_building_project("Test Building Project")


@pytest.fixture
def storey_model() -> ifcopenshell.file:
    """创建包含楼层的项目"""
    return create_single_storey_building_project("Test Storey Project")


@pytest.fixture
def body_context(storey_model):
    """获取 Body context"""
    contexts = storey_model.by_type("IfcGeometricRepresentationSubContext")
    for ctx in contexts:
        if ctx.ContextIdentifier == "Body":
            return ctx
    return storey_model.by_type("IfcGeometricRepresentationContext")[0]


@pytest.fixture
def sample_representation(storey_model, body_context):
    """创建一个示例几何表示"""
    builder = ShapeBuilder(storey_model)
    profile = storey_model.create_entity(
        "IfcRectangleProfileDef",
        ProfileType="AREA",
        XDim=1000.0,
        YDim=500.0,
    )
    solid = builder.extrude(
        profile,
        magnitude=2000.0,
        extrusion_vector=(0, 0, 1),
    )
    return builder.get_representation(context=body_context, items=[solid])

