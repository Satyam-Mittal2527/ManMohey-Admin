from typing import Optional

from pydantic import BaseModel, Field 

from typing import List


class CategoryCreate(BaseModel):

    name: str = Field(
        ...,
        min_length=1
    )

    slug: str = Field(
        ...,
        min_length=1
    )

    display_order: int = Field(
        default=0,
        ge=0
    )

    active: bool = True


class CategoryUpdate(BaseModel):

    name: Optional[str] = Field(
        default=None,
        min_length=1
    )

    slug: Optional[str] = Field(
        default=None,
        min_length=1
    )

    display_order: Optional[int] = Field(
        default=None,
        ge=0
    )

    active: Optional[bool] = None

class CategoryFilterUpdate(BaseModel):
    filter_option_ids: List[int] = Field(
        default_factory=list
    )