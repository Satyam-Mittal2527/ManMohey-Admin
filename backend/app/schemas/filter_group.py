from typing import Optional

from pydantic import BaseModel, Field


class FilterGroupCreate(BaseModel):

    name: str = Field(
        ...,
        min_length=1
    )

    key: str = Field(
        ...,
        min_length=1
    )

    type: str = Field(
        ...,
        min_length=1
    )

    display_order: int = Field(
        default=0,
        ge=0
    )

    active: bool = True


class FilterGroupUpdate(BaseModel):

    name: Optional[str] = Field(
        default=None,
        min_length=1
    )

    key: Optional[str] = Field(
        default=None,
        min_length=1
    )

    type: Optional[str] = Field(
        default=None,
        min_length=1
    )

    display_order: Optional[int] = Field(
        default=None,
        ge=0
    )

    active: Optional[bool] = None