# 添加分组元素
from typing import Optional, Sequence, List
import ifcopenshell
from ifcopenshell.api.root import create_entity
from ifcopenshell.api.group import assign_group, unassign_group
from maas_lego.properties.pset import add_pset
import ifcopenshell.util.element as ifc_element

def create_group(
    model: ifcopenshell.file,
    name: str,
    description: Optional[str] = None,
    group_type: Optional[str] = None,
    psets: Optional[dict] = None,
    products: Optional[Sequence[ifcopenshell.entity_instance]] = None,
) -> ifcopenshell.entity_instance:
    group = create_entity(model, ifc_class="IfcGroup", name=name)

    if description is not None:
        group.Description = description
    if group_type is not None:
        group.ObjectType = group_type
    if psets:
        for pset_name, props in psets.items():
            add_pset(model, product=group, name=pset_name, properties=props)
    if products:
        add_to_group(model, group=group, products=products)
    return group


def add_to_group(
    model: ifcopenshell.file,
    group: ifcopenshell.entity_instance,
    products: Sequence[ifcopenshell.entity_instance],
):
    """把 products 加入 group（assign_group 会自动去重）。"""
    if products:
        return assign_group(model, group=group, products=list(products))
    return None


def remove_from_group(
    model: ifcopenshell.file,
    group: ifcopenshell.entity_instance,
    products: Sequence[ifcopenshell.entity_instance],
):
    """从 group 移除 products。"""
    if products:
        return unassign_group(model, group=group, products=list(products))
    return None


def get_group_members(group: ifcopenshell.entity_instance) -> List[ifcopenshell.entity_instance]:
    """获取分组成员"""
    return list(ifc_element.get_grouped_by(group))


def get_element_groups(element: ifcopenshell.entity_instance) -> List[ifcopenshell.entity_instance]:
    """获取元素所属的所有 IfcGroup。"""
    groups: List[ifcopenshell.entity_instance] = []
    for rel in getattr(element, "HasAssignments", []) or []:
        if rel.is_a("IfcRelAssignsToGroup") and getattr(rel, "RelatingGroup", None) is not None:
            groups.append(rel.RelatingGroup)
    return groups
