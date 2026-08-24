from fastapi import APIRouter, HTTPException

from app.schemas.filter_option import (
    FilterOptionCreate,
    FilterOptionUpdate,
)

from app.services.filter_option_service import (
    get_all_filter_options,
    get_filter_options_by_group,
    get_filter_option_by_id,
    create_filter_option_service,
    update_filter_option_service,
    delete_filter_option_service,
)


router = APIRouter()


@router.get("/")
def get_filter_options():

    try:

        options = get_all_filter_options()

        return {
            "success": True,
            "data": options,
        }

    except Exception as e:

        print(
            f"Get filter options error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch filter options",
        )


@router.get("/group/{group_id}")
def get_options_by_group(
    group_id: int,
):

    try:

        options = get_filter_options_by_group(
            group_id
        )

        return {
            "success": True,
            "data": options,
        }

    except Exception as e:

        print(
            f"Get group options error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch filter options",
        )


@router.get("/{option_id}")
def get_filter_option(
    option_id: int,
):

    try:

        option = get_filter_option_by_id(
            option_id
        )

        return {
            "success": True,
            "data": option,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except Exception as e:

        print(
            f"Get filter option error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch filter option",
        )


@router.post("/")
def create_filter_option(
    option_data: FilterOptionCreate,
):

    try:

        option = create_filter_option_service(
            option_data
        )

        return {
            "success": True,
            "message": "Filter option created successfully",
            "data": option,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:

        print(
            f"Create filter option error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to create filter option",
        )


@router.put("/{option_id}")
def update_filter_option(
    option_id: int,
    option_data: FilterOptionUpdate,
):

    try:

        option = update_filter_option_service(
            option_id,
            option_data
        )

        return {
            "success": True,
            "message": "Filter option updated successfully",
            "data": option,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:

        print(
            f"Update filter option error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to update filter option",
        )


@router.delete("/{option_id}")
def delete_filter_option(
    option_id: int,
):

    try:

        option = delete_filter_option_service(
            option_id
        )

        return {
            "success": True,
            "message": "Filter option deactivated successfully",
            "data": option,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except Exception as e:

        print(
            f"Delete filter option error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to deactivate filter option",
        )