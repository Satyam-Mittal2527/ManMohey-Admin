from pydantic import BaseModel
from typing import Optional, Literal


class OrderSummary(BaseModel):
    id: int
    order_number: str
    user_id: str
    full_name: str
    phone_number: str
    total_amount: float
    status: str
    payment_status: str
    created_at: str

class OrderStatusUpdate(BaseModel):
    status: Literal[
        "PENDING",
        "CONFIRMED",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
    ]