from app.database.supabase_client import supabase, supabase_admin


def get_all_orders():
    response = (
        supabase_admin
        .table("orders")
        .select(
            """
            id,
            order_number,
            user_id,
            full_name,
            phone_number,
            total_amount,
            status,
            payment_status,
            created_at
            """
        )
        .order("created_at", desc=True)
        .execute()
    )

    return response.data or []

def get_order_by_id(order_id: int):

    order_response = (
        supabase_admin
        .table("orders")
        .select("""
            id,
            order_number,
            user_id,
            full_name,
            phone_number,
            address_line_1,
            address_line_2,
            city,
            state,
            postal_code,
            country,
            subtotal,
            shipping_fee,
            discount,
            total_amount,
            status,
            payment_status,
            created_at,
            updated_at
        """)
        .eq("id", order_id)
        .single()
        .execute()
    )

    order = order_response.data

    if not order:
        return None

    items_response = (
        supabase_admin
        .table("order_items")
        .select("""
            id,
            order_id,
            product_id,
            product_name,
            sku,
            quantity,
            size,
            unit_price,
            subtotal,
            created_at
        """)
        .eq("order_id", order_id)
        .order("id")
        .execute()
    )

    order["items"] = items_response.data or []

    return order

def update_order_status(order_id: int, status: str):

    response = (
        supabase_admin
        .table("orders")
        .update({
            "status": status
        })
        .eq("id", order_id)
        .execute()
    )

    if not response.data:
        return None

    return response.data[0] 