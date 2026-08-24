from app.database.supabase_client import supabase_admin


# ============================================================
# GET ALL FILTER GROUPS
# ============================================================

def get_all_filter_groups():
    try:

        response = (
            supabase_admin
            .table("filter_groups")
            .select("""
                id,
                name,
                display_order,
                key,
                type,
                active
            """)
            .order(
                "display_order"
            )
            .execute()
        )

        return response.data or []

    except Exception as e:

        print(
            f"Exception in get_all_filter_groups: {e}"
        )

        raise


# ============================================================
# GET FILTER GROUP BY ID
# ============================================================

def get_filter_group_by_id(
    group_id: int,
):
    try:

        response = (
            supabase_admin
            .table("filter_groups")
            .select("""
                id,
                name,
                display_order,
                key,
                type,
                active
            """)
            .eq(
                "id",
                group_id
            )
            .single()
            .execute()
        )

        if not response.data:

            raise ValueError(
                "Filter group not found"
            )

        return response.data

    except Exception as e:

        print(
            f"Exception in get_filter_group_by_id: {e}"
        )

        raise


# ============================================================
# CREATE FILTER GROUP
# ============================================================

def create_filter_group_service(
    group_data,
):
    try:

        # Check duplicate key
        existing = (
            supabase_admin
            .table("filter_groups")
            .select("id")
            .eq(
                "key",
                group_data.key
            )
            .execute()
        )

        if existing.data:

            raise ValueError(
                "Filter group key already exists"
            )

        payload = {
            "name": group_data.name,
            "key": group_data.key,
            "type": group_data.type,
            "display_order":
                group_data.display_order,
            "active":
                group_data.active,
        }

        response = (
            supabase_admin
            .table("filter_groups")
            .insert(payload)
            .execute()
        )

        if not response.data:

            raise ValueError(
                "Failed to create filter group"
            )

        return response.data[0]

    except Exception as e:

        print(
            f"Exception in create_filter_group_service: {e}"
        )

        raise


# ============================================================
# UPDATE FILTER GROUP
# ============================================================

def update_filter_group_service(
    group_id: int,
    group_data,
):
    try:

        # Check group exists
        existing = (
            supabase_admin
            .table("filter_groups")
            .select("id")
            .eq(
                "id",
                group_id
            )
            .single()
            .execute()
        )

        if not existing.data:

            raise ValueError(
                "Filter group not found"
            )

        # Check duplicate key
        if group_data.key is not None:

            duplicate = (
                supabase_admin
                .table("filter_groups")
                .select("id")
                .eq(
                    "key",
                    group_data.key
                )
                .neq(
                    "id",
                    group_id
                )
                .execute()
            )

            if duplicate.data:

                raise ValueError(
                    "Filter group key already exists"
                )

        update_data = (
            group_data.model_dump(
                exclude_unset=True
            )
        )

        if not update_data:

            raise ValueError(
                "No fields provided for update"
            )

        response = (
            supabase_admin
            .table("filter_groups")
            .update(update_data)
            .eq(
                "id",
                group_id
            )
            .execute()
        )

        if not response.data:

            raise ValueError(
                "Failed to update filter group"
            )

        return response.data[0]

    except Exception as e:

        print(
            f"Exception in update_filter_group_service: {e}"
        )

        raise


# ============================================================
# DELETE / DEACTIVATE FILTER GROUP
# ============================================================

def delete_filter_group_service(
    group_id: int,
):
    try:

        existing = (
            supabase_admin
            .table("filter_groups")
            .select(
                "id, active"
            )
            .eq(
                "id",
                group_id
            )
            .single()
            .execute()
        )

        if not existing.data:

            raise ValueError(
                "Filter group not found"
            )

        if not existing.data["active"]:

            raise ValueError(
                "Filter group is already inactive"
            )

        response = (
            supabase_admin
            .table("filter_groups")
            .update({
                "active": False
            })
            .eq(
                "id",
                group_id
            )
            .execute()
        )

        if not response.data:

            raise ValueError(
                "Failed to deactivate filter group"
            )

        return response.data[0]

    except Exception as e:

        print(
            f"Exception in delete_filter_group_service: {e}"
        )

        raise