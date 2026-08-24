from fastapi import APIRouter, HTTPException

from app.services.category_service import (
    get_all_categories,
    get_filters_for_category,
    get_category_by_id,
    create_category_service,
    update_category_service,
    update_category_filters_service,
)
from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    CategoryFilterUpdate,
)


router = APIRouter()


@router.get("/")
def get_categories():

    try:

        categories = get_all_categories()

        return {
            "success": True,
            "data": categories,
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


@router.get("/{category_id}/filters")
def get_category_filters(
    category_id: int
):

    try:

        filters = get_filters_for_category(
            category_id
        )

        return {
            "success": True,
            "data": filters,
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )

@router.put("/{category_id}/filters")
def update_category_filters(
    category_id: int,
    filter_data: CategoryFilterUpdate,
):

    try:

        result = update_category_filters_service(
            category_id,
            filter_data.filter_option_ids,
        )

        return {
            "success": True,
            "message": (
                "Category filters updated successfully"
            ),
            "data": result,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:

        print(
            f"Update category filters error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to update category filters"
            ),
        )

@router.post("/")
def create_category(
    category_data: CategoryCreate,
):

    try:

        category = create_category_service(
            category_data
        )

        return {
            "success": True,
            "message": "Category created successfully",
            "data": category,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:

        print(
            f"Create category error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to create category",
        )

@router.put("/{category_id}")
def update_category(
    category_id: int,
    category_data: CategoryUpdate,
):

    try:

        category = update_category_service(
            category_id,
            category_data,
        )

        return {
            "success": True,
            "message": "Category updated successfully",
            "data": category,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:

        print(
            f"Update category error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to update category",
        )

@router.delete("/{category_id}")
def delete_category(
    category_id: int,
):

    try:

        category = update_category_service(
            category_id,
            CategoryUpdate(
                active=False
            ),
        )

        return {
            "success": True,
            "message": "Category deactivated successfully",
            "data": category,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except Exception as e:

        print(
            f"Delete category error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to deactivate category",
        )