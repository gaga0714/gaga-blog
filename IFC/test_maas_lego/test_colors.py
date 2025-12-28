"""测试 maas_lego.constant.colors 模块"""
from maas_lego.constant.colors import DEFAULT_COLORS


class TestColors:
    """测试 constant/colors.py"""

    def test_default_colors_structure(self):
        """测试默认颜色结构"""
        assert isinstance(DEFAULT_COLORS, list)
        assert len(DEFAULT_COLORS) > 0
        
        for item in DEFAULT_COLORS:
            assert isinstance(item, tuple)
            assert len(item) == 3
            name, color, transparency = item
            assert isinstance(name, str)
            assert isinstance(color, dict)
            assert "Red" in color
            assert "Green" in color
            assert "Blue" in color
            assert isinstance(transparency, (int, float))

    def test_default_colors_values(self):
        """测试默认颜色值范围"""
        for name, color, transparency in DEFAULT_COLORS:
            assert 0.0 <= color["Red"] <= 1.0
            assert 0.0 <= color["Green"] <= 1.0
            assert 0.0 <= color["Blue"] <= 1.0
            assert 0.0 <= transparency <= 1.0

