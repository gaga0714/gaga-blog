# 添加家具构件元素
from typing import Literal
import numpy as np
import ifcopenshell
from ifcopenshell.api.root import create_entity
from maas_lego.core.structural import _apply_common_props

def create_furniture(
    model: ifcopenshell.file,
    name: str,
    placement: tuple[float, float, float] = None,
    matrix: np.ndarray = None,
    predefined_type: Literal[
        "BED", 'CHAIR', 'DESK', 'FILECABINET', 'SHELF', 'SOFA', 
        'TABLE', 'TECHNICALCABINET', 'USERDEFINED', 'NOTDEFINED'
    ] = None,
    space: ifcopenshell.entity_instance = None,
    storey: ifcopenshell.entity_instance = None,
    material: ifcopenshell.entity_instance = None,
    representation: ifcopenshell.entity_instance = None,
    psets: dict = None,
) -> ifcopenshell.entity_instance:
    furniture = create_entity(
        model,
        ifc_class="IfcFurniture",
        name=name,
        predefined_type=predefined_type,
    )
    _apply_common_props(
        model=model,
        product=furniture,
        placement=placement,
        matrix=matrix,
        space=space,
        storey=storey,
        material=material,
        representation=representation,
        psets=psets,
    )
    return furniture
