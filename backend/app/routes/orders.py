from fastapi import APIRouter, HTTPException

from app.services.order_service import get_all_orders , get_order_by_id, update_order_status
from app.schemas.order import OrderStatusUpdate


router = APIRouter(
    prefix="/api/orders",
    tags=["Orders"]
)


@router.get("/")
async def get_orders():

    try:

        orders = get_all_orders()

        return {
            "success": True,
            "data": orders
        }

    except Exception as e:

        print("Get orders error:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch orders"
        )

@router.get("/{order_id}")
async def get_order(order_id: int):

    try:

        order = get_order_by_id(order_id)

        if not order:
            raise HTTPException(
                status_code=404,
                detail="Order not found"
            )

        return {
            "success": True,
            "data": order
        }

    except HTTPException:
        raise

    except Exception as e:

        print("Get order details error:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch order"
        )

@router.patch("/{order_id}/status")
async def update_status(
    order_id: int,
    status_data: OrderStatusUpdate,
):

    try:
        order = update_order_status(
            order_id,
            status_data.status,
        )

        if not order:
            raise HTTPException(
                status_code=404,
                detail="Order not found",
            )

        return {
            "success": True,
            "message": "Order status updated successfully",
            "data": order,
        }

    except HTTPException:
        raise

    except Exception as e:
        print(f"Update order status error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Failed to update order status",
        )