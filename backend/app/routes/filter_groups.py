from fastapi import APIRouter, HTTPException

from app.schemas.filter_group import (
    FilterGroupCreate,
    FilterGroupUpdate,
)

from app.services.filter_group_service import (
    get_all_filter_groups,
    get_filter_group_by_id,
    create_filter_group_service,
    update_filter_group_service,
    delete_filter_group_service,
)


router = APIRouter()


# ============================================================
# GET ALL FILTER GROUPS
# ============================================================

@router.get("/")
def get_filter_groups():

    try:

        groups = get_all_filter_groups()

        return {
            "success": True,
            "data": groups,
        }

    except Exception as e:

        print(
            f"Get filter groups error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch filter groups",
        )


# ============================================================
# GET FILTER GROUP BY ID
# ============================================================

@router.get("/{group_id}")
def get_filter_group(
    group_id: int,
):

    try:

        group = get_filter_group_by_id(
            group_id
        )

        return {
            "success": True,
            "data": group,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except Exception as e:

        print(
            f"Get filter group error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch filter group",
        )


# ============================================================
# CREATE FILTER GROUP
# ============================================================

@router.post("/")
def create_filter_group(
    group_data: FilterGroupCreate,
):

    try:

        group = create_filter_group_service(
            group_data
        )

        return {
            "success": True,
            "message": "Filter group created successfully",
            "data": group,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:

        print(
            f"Create filter group error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to create filter group",
        )


# ============================================================
# UPDATE FILTER GROUP
# ============================================================

@router.put("/{group_id}")
def update_filter_group(
    group_id: int,
    group_data: FilterGroupUpdate,
):

    try:

        group = update_filter_group_service(
            group_id,
            group_data
        )

        return {
            "success": True,
            "message": "Filter group updated successfully",
            "data": group,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:

        print(
            f"Update filter group error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to update filter group",
        )


# ============================================================
# DELETE / DEACTIVATE FILTER GROUP
# ============================================================

@router.delete("/{group_id}")
def delete_filter_group(
    group_id: int,
):

    try:

        group = delete_filter_group_service(
            group_id
        )

        return {
            "success": True,
            "message": "Filter group deactivated successfully",
            "data": group,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except Exception as e:

        print(
            f"Delete filter group error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to deactivate filter group",
        )