from typing import Optional

from pydantic import BaseModel, Field


class FilterOptionCreate(BaseModel):

    group_id: int

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

    hex_code: Optional[str] = None

    value: Optional[int] = None

    active: bool = True


class FilterOptionUpdate(BaseModel):

    group_id: Optional[int] = None

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

    hex_code: Optional[str] = None

    value: Optional[int] = None

    active: Optional[bool] = None