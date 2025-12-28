"""测试 maas_lego.properties.pset 模块"""
from maas_lego.core.structural import create_wall
from maas_lego.properties.pset import add_pset, edit_pset, remove_pset


class TestPset:
    """测试 pset.py 中的函数"""

    def test_add_pset_basic(self, storey_model):
        """测试添加基本属性集"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        wall = create_wall(model=storey_model, name="Wall for Pset", storey=storey)
        
        pset = add_pset(
            model=storey_model,
            product=wall,
            name="Pset_WallCommon",
            properties={"IsExternal": True, "LoadBearing": False},
        )
        
        assert pset is not None
        assert pset.Name == "Pset_WallCommon"

    def test_add_pset_default_name(self, storey_model):
        """测试使用默认属性集名称"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        wall = create_wall(model=storey_model, name="Wall Default Pset", storey=storey)
        
        pset = add_pset(
            model=storey_model,
            product=wall,
            properties={"TestProperty": "TestValue"},
        )
        
        assert pset.Name == "Pset_WallCommon"

    def test_edit_pset(self, storey_model):
        """测试编辑属性集"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        wall = create_wall(model=storey_model, name="Wall Edit Pset", storey=storey)
        
        pset = add_pset(
            model=storey_model,
            product=wall,
            name="TestPset",
            properties={"Prop1": "Value1"},
        )
        
        # 编辑属性集
        edit_pset(
            model=storey_model,
            pset=pset,
            properties={"Prop2": "Value2"},
        )
        
        assert pset is not None

    def test_edit_pset_empty_properties(self, storey_model):
        """测试编辑属性集为空属性"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        wall = create_wall(model=storey_model, name="Wall Empty Pset", storey=storey)
        
        pset = add_pset(
            model=storey_model,
            product=wall,
            name="EmptyPset",
            properties={"Prop1": "Value1"},
        )
        
        result = edit_pset(model=storey_model, pset=pset)
        
        assert result is not None

    def test_remove_pset(self, storey_model):
        """测试删除属性集"""
        storey = storey_model.by_type("IfcBuildingStorey")[0]
        wall = create_wall(model=storey_model, name="Wall Remove Pset", storey=storey)
        
        pset = add_pset(
            model=storey_model,
            product=wall,
            name="RemovablePset",
            properties={"Prop1": "Value1"},
        )
        
        remove_pset(model=storey_model, product=wall, pset=pset)
        
        # 验证属性集已删除 - 检查是否还能通过 by_id 找到
        # 这里我们只验证函数不抛出异常

