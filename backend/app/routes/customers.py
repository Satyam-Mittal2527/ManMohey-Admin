from fastapi import APIRouter, HTTPException

from app.services.customer_service import (
    get_all_customers,
    get_customer_by_id,
)


router = APIRouter()


@router.get("/")
def get_customers():

    try:

        customers = get_all_customers()

        return {
            "success": True,
            "data": customers,
        }

    except Exception as e:

        print(
            f"Get customers error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch customers",
        )


@router.get("/{customer_id}")
def get_customer(
    customer_id: str,
):

    try:

        customer = get_customer_by_id(
            customer_id
        )

        return {
            "success": True,
            "data": customer,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except Exception as e:

        print(
            f"Get customer error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch customer",
        )