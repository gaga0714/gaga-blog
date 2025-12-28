"""测试 maas_lego.core.style 模块"""
from maas_lego.core.style import add_element_color


class TestStyle:
    """测试 style.py 中的函数"""

    def test_add_element_color_basic(self, storey_model, body_context):
        """测试添加基本颜色"""
        material = add_element_color(
            model=storey_model,
            name="Test Color",
            rgb={"Red": 1.0, "Green": 0.0, "Blue": 0.0},
            body_context=body_context,
        )
        
        assert material is not None
        assert material.Name == "Test Color"
        assert material.is_a("IfcMaterial")

    def test_add_element_color_with_transparency(self, storey_model, body_context):
        """测试添加带透明度的颜色"""
        material = add_element_color(
            model=storey_model,
            name="Transparent Color",
            rgb={"Red": 0.0, "Green": 1.0, "Blue": 0.0},
            transparency=0.5,
            body_context=body_context,
        )
        
        assert material is not None

    def test_add_element_color_default_rgb(self, storey_model, body_context):
        """测试使用默认 RGB 值"""
        material = add_element_color(
            model=storey_model,
            name="Default Color",
            body_context=body_context,
        )
        
        assert material is not None

    def test_add_element_color_auto_context(self, storey_model):
        """测试自动获取 context"""
        material = add_element_color(
            model=storey_model,
            name="Auto Context Color",
            rgb={"Red": 0.5, "Green": 0.5, "Blue": 0.5},
        )
        
        assert material is not None

