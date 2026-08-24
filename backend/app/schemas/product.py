from typing import List, Optional

from pydantic import BaseModel, Field


# ============================================================
# PRODUCT VARIANT - CREATE
# ============================================================

class ProductVariantCreate(BaseModel):
    sku: Optional[str] = None
    size: Optional[str] = None
    color: Optional[str] = None

    stock: int = Field(
        default=0,
        ge=0
    )

    price: float = Field(
        ...,
        ge=0
    )


# ============================================================
# PRODUCT CREATE
# ============================================================

class ProductCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=1
    )

    slug: str = Field(
        ...,
        min_length=1
    )

    short_description: Optional[str] = None

    description: Optional[str] = None

    category_id: int

    price: float = Field(
        ...,
        ge=0
    )

    sale_price: Optional[float] = Field(
        default=None,
        ge=0
    )

    sku: Optional[str] = None

    stock: int = Field(
        default=0,
        ge=0
    )

    weight: Optional[float] = Field(
        default=None,
        ge=0
    )

    featured: bool = False

    active: bool = True

    # Filter options selected for the product
    filter_option_ids: List[int] = Field(
        default_factory=list
    )

    # Size/color-specific inventory
    variants: List[ProductVariantCreate] = Field(
        default_factory=list
    )


# ============================================================
# PRODUCT VARIANT - UPDATE
# ============================================================

class ProductVariantUpdate(BaseModel):
    """
    Existing variant will have an ID.
    New variants will have id=None.
    """

    id: Optional[int] = None

    sku: Optional[str] = None

    size: Optional[str] = None

    color: Optional[str] = None

    stock: int = Field(
        default=0,
        ge=0
    )

    price: float = Field(
        ...,
        ge=0
    )


# ============================================================
# PRODUCT UPDATE
# ============================================================

class ProductUpdate(BaseModel):
    name: str = Field(
        ...,
        min_length=1
    )

    slug: str = Field(
        ...,
        min_length=1
    )

    short_description: Optional[str] = None

    description: Optional[str] = None

    category_id: int

    price: float = Field(
        ...,
        ge=0
    )

    sale_price: Optional[float] = Field(
        default=None,
        ge=0
    )

    sku: Optional[str] = None

    stock: int = Field(
        default=0,
        ge=0
    )

    weight: Optional[float] = Field(
        default=None,
        ge=0
    )

    featured: bool = False

    active: bool = True

    # Complete set of filters currently assigned
    filter_option_ids: List[int] = Field(
        default_factory=list
    )

    # Complete current set of variants
    variants: List[ProductVariantUpdate] = Field(
        default_factory=list
    )


# ============================================================
# PRODUCT STATUS UPDATE
# ============================================================

class ProductStatusUpdate(BaseModel):
    active: bool


# ============================================================
# PRODUCT IMAGE REORDER
# ============================================================

class ProductImageReorder(BaseModel):
    image_id: int

    display_order: int = Field(
        ...,
        ge=1
    )