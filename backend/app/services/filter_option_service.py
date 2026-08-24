from app.database.supabase_client import supabase_admin


# ============================================================
# GET ALL FILTER OPTIONS
# ============================================================

def get_all_filter_options():
    try:

        response = (
            supabase_admin
            .table("filter_options")
            .select("""
                id,
                group_id,
                name,
                slug,
                display_order,
                hex_code,
                value,
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
            f"Exception in get_all_filter_options: {e}"
        )

        raise


# ============================================================
# GET FILTER OPTIONS BY GROUP
# ============================================================

def get_filter_options_by_group(
    group_id: int,
):
    try:

        response = (
            supabase_admin
            .table("filter_options")
            .select("""
                id,
                group_id,
                name,
                slug,
                display_order,
                hex_code,
                value,
                active
            """)
            .eq(
                "group_id",
                group_id
            )
            .order(
                "display_order"
            )
            .execute()
        )

        return response.data or []

    except Exception as e:

        print(
            f"Exception in "
            f"get_filter_options_by_group: {e}"
        )

        raise


# ============================================================
# GET FILTER OPTION BY ID
# ============================================================

def get_filter_option_by_id(
    option_id: int,
):
    try:

        response = (
            supabase_admin
            .table("filter_options")
            .select("""
                id,
                group_id,
                name,
                slug,
                display_order,
                hex_code,
                value,
                active
            """)
            .eq(
                "id",
                option_id
            )
            .single()
            .execute()
        )

        if not response.data:

            raise ValueError(
                "Filter option not found"
            )

        return response.data

    except Exception as e:

        print(
            f"Exception in "
            f"get_filter_option_by_id: {e}"
        )

        raise


# ============================================================
# CREATE FILTER OPTION
# ============================================================

def create_filter_option_service(
    option_data,
):
    try:

        # Check filter group exists
        group_response = (
            supabase_admin
            .table("filter_groups")
            .select(
                "id, active"
            )
            .eq(
                "id",
                option_data.group_id
            )
            .single()
            .execute()
        )

        if not group_response.data:

            raise ValueError(
                "Filter group not found"
            )

        if not group_response.data["active"]:

            raise ValueError(
                "Filter group is inactive"
            )

        # Check duplicate slug within group
        existing = (
            supabase_admin
            .table("filter_options")
            .select("id")
            .eq(
                "group_id",
                option_data.group_id
            )
            .eq(
                "slug",
                option_data.slug
            )
            .execute()
        )

        if existing.data:

            raise ValueError(
                "Filter option slug already exists "
                "in this group"
            )

        payload = {
            "group_id":
                option_data.group_id,

            "name":
                option_data.name,

            "slug":
                option_data.slug,

            "display_order":
                option_data.display_order,

            "hex_code":
                option_data.hex_code,

            "value":
                option_data.value,

            "active":
                option_data.active,
        }

        response = (
            supabase_admin
            .table("filter_options")
            .insert(payload)
            .execute()
        )

        if not response.data:

            raise ValueError(
                "Failed to create filter option"
            )

        return response.data[0]

    except Exception as e:

        print(
            f"Exception in create_filter_option_service: {e}"
        )

        raise


# ============================================================
# UPDATE FILTER OPTION
# ============================================================

def update_filter_option_service(
    option_id: int,
    option_data,
):
    try:

        existing = (
            supabase_admin
            .table("filter_options")
            .select(
                "id, group_id"
            )
            .eq(
                "id",
                option_id
            )
            .single()
            .execute()
        )

        if not existing.data:

            raise ValueError(
                "Filter option not found"
            )

        current_group_id = (
            existing.data["group_id"]
        )

        new_group_id = (
            option_data.group_id
            if option_data.group_id is not None
            else current_group_id
        )

        # Validate new group if changed
        group_response = (
            supabase_admin
            .table("filter_groups")
            .select(
                "id, active"
            )
            .eq(
                "id",
                new_group_id
            )
            .single()
            .execute()
        )

        if not group_response.data:

            raise ValueError(
                "Filter group not found"
            )

        if not group_response.data["active"]:

            raise ValueError(
                "Filter group is inactive"
            )

        # Check duplicate slug
        if option_data.slug is not None:

            duplicate = (
                supabase_admin
                .table("filter_options")
                .select("id")
                .eq(
                    "group_id",
                    new_group_id
                )
                .eq(
                    "slug",
                    option_data.slug
                )
                .neq(
                    "id",
                    option_id
                )
                .execute()
            )

            if duplicate.data:

                raise ValueError(
                    "Filter option slug already exists "
                    "in this group"
                )

        update_data = (
            option_data.model_dump(
                exclude_unset=True
            )
        )

        if not update_data:

            raise ValueError(
                "No fields provided for update"
            )

        response = (
            supabase_admin
            .table("filter_options")
            .update(update_data)
            .eq(
                "id",
                option_id
            )
            .execute()
        )

        if not response.data:

            raise ValueError(
                "Failed to update filter option"
            )

        return response.data[0]

    except Exception as e:

        print(
            f"Exception in "
            f"update_filter_option_service: {e}"
        )

        raise


# ============================================================
# DELETE / DEACTIVATE FILTER OPTION
# ============================================================

def delete_filter_option_service(
    option_id: int,
):
    try:

        existing = (
            supabase_admin
            .table("filter_options")
            .select(
                "id, active"
            )
            .eq(
                "id",
                option_id
            )
            .single()
            .execute()
        )

        if not existing.data:

            raise ValueError(
                "Filter option not found"
            )

        if not existing.data["active"]:

            raise ValueError(
                "Filter option is already inactive"
            )

        response = (
            supabase_admin
            .table("filter_options")
            .update({
                "active": False
            })
            .eq(
                "id",
                option_id
            )
            .execute()
        )

        if not response.data:

            raise ValueError(
                "Failed to deactivate filter option"
            )

        return response.data[0]

    except Exception as e:

        print(
            f"Exception in "
            f"delete_filter_option_service: {e}"
        )

        raise