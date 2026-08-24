from app.database.supabase_client import (
    supabase,
    supabase_admin,
)


def get_all_categories():
    response = (
        supabase_admin
        .table("categories")
        .select("*")
        .eq("active", True)
        .order("display_order")
        .execute()
    )

    return response.data


def get_filters_for_category(
    category_id: int
):
    try:

        category_filters = (
            supabase_admin
            .table("category_filter_options")
            .select(
                "filter_option_id"
            )
            .eq(
                "category_id",
                category_id
            )
            .execute()
        )

        if not category_filters.data:
            return []

        filter_option_ids = [
            item["filter_option_id"]
            for item in category_filters.data
        ]

        filter_options_response = (
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
            .in_(
                "id",
                filter_option_ids
            )
            .eq(
                "active",
                True
            )
            .order(
                "display_order"
            )
            .execute()
        )

        filter_options = (
            filter_options_response.data
        )

        if not filter_options:
            return []

        group_ids = list({
            option["group_id"]
            for option in filter_options
        })

        filter_groups_response = (
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
            .in_(
                "id",
                group_ids
            )
            .eq(
                "active",
                True
            )
            .order(
                "display_order"
            )
            .execute()
        )

        filter_groups = (
            filter_groups_response.data
        )

        result = []

        for group in filter_groups:

            options = [
                option
                for option in filter_options
                if option["group_id"]
                == group["id"]
            ]

            options.sort(
                key=lambda option:
                    option.get(
                        "display_order",
                        0
                    )
            )

            result.append({
                "id": group["id"],
                "name": group["name"],
                "key": group["key"],
                "type": group["type"],
                "display_order":
                    group["display_order"],
                "options": options,
            })

        result.sort(
            key=lambda group:
                group.get(
                    "display_order",
                    0
                )
        )

        return result

    except Exception as e:

        print(
            "Exception in "
            f"get_filters_for_category: {e}"
        )

        raise


def get_category_by_id(
    category_id: int
):
    try:

        response = (
            supabase_admin
            .table("categories")
            .select("*")
            .eq(
                "id",
                category_id
            )
            .single()
            .execute()
        )

        if not response.data:
            raise ValueError(
                "Category not found"
            )

        return response.data

    except Exception as e:

        print(
            f"Exception in get_category_by_id: {e}"
        )

        raise

def create_category_service(
    category_data
):
    try:

        # Check duplicate slug
        existing = (
            supabase_admin
            .table("categories")
            .select("id")
            .eq(
                "slug",
                category_data.slug
            )
            .execute()
        )

        if existing.data:
            raise ValueError(
                "Category slug already exists"
            )

        payload = {
            "name": category_data.name,
            "slug": category_data.slug,
            "display_order":
                category_data.display_order,
            "active":
                category_data.active,
        }

        response = (
            supabase_admin
            .table("categories")
            .insert(payload)
            .execute()
        )

        if not response.data:
            raise ValueError(
                "Failed to create category"
            )

        return response.data[0]

    except Exception as e:

        print(
            f"Exception in create_category_service: {e}"
        )

        raise

def update_category_service(
    category_id: int,
    category_data
):
    try:

        existing = (
            supabase_admin
            .table("categories")
            .select("id")
            .eq(
                "id",
                category_id
            )
            .single()
            .execute()
        )

        if not existing.data:
            raise ValueError(
                "Category not found"
            )

        if category_data.slug is not None:

            duplicate = (
                supabase_admin
                .table("categories")
                .select("id")
                .eq(
                    "slug",
                    category_data.slug
                )
                .neq(
                    "id",
                    category_id
                )
                .execute()
            )

            if duplicate.data:
                raise ValueError(
                    "Category slug already exists"
                )

        update_data = (
            category_data.model_dump(
                exclude_unset=True
            )
        )

        if not update_data:
            raise ValueError(
                "No fields provided for update"
            )

        response = (
            supabase_admin
            .table("categories")
            .update(update_data)
            .eq(
                "id",
                category_id
            )
            .execute()
        )

        if not response.data:
            raise ValueError(
                "Failed to update category"
            )

        return response.data[0]

    except Exception as e:

        print(
            f"Exception in update_category_service: {e}"
        )

        raise

def update_category_filters_service(
    category_id: int,
    filter_option_ids: list[int],
):
    try:

        # --------------------------------------------------
        # 1. Verify category exists
        # --------------------------------------------------

        category_response = (
            supabase_admin
            .table("categories")
            .select("id")
            .eq(
                "id",
                category_id
            )
            .single()
            .execute()
        )

        if not category_response.data:
            raise ValueError(
                "Category not found"
            )

        # --------------------------------------------------
        # 2. Remove duplicate option IDs
        # --------------------------------------------------

        unique_ids = list(
            dict.fromkeys(
                filter_option_ids
            )
        )

        # --------------------------------------------------
        # 3. Validate ALL filter options BEFORE changing DB
        # --------------------------------------------------

        if unique_ids:

            options_response = (
                supabase_admin
                .table("filter_options")
                .select(
                    "id, active"
                )
                .in_(
                    "id",
                    unique_ids
                )
                .execute()
            )

            existing_options = (
                options_response.data or []
            )

            existing_ids = {
                option["id"]
                for option in existing_options
            }

            missing_ids = [
                option_id
                for option_id in unique_ids
                if option_id not in existing_ids
            ]

            if missing_ids:
                raise ValueError(
                    "One or more filter options "
                    "do not exist"
                )

            inactive_ids = [
                option["id"]
                for option in existing_options
                if not option["active"]
            ]

            if inactive_ids:
                raise ValueError(
                    "Cannot assign inactive "
                    "filter options"
                )

        # --------------------------------------------------
        # 4. Only NOW remove existing assignments
        # --------------------------------------------------

        (
            supabase_admin
            .table("category_filter_options")
            .delete()
            .eq(
                "category_id",
                category_id
            )
            .execute()
        )

        # --------------------------------------------------
        # 5. If no options selected, we're done
        # --------------------------------------------------

        if not unique_ids:
            return []

        # --------------------------------------------------
        # 6. Create new assignments
        # --------------------------------------------------

        assignments = [
            {
                "category_id": category_id,
                "filter_option_id": option_id,
            }
            for option_id in unique_ids
        ]

        response = (
            supabase_admin
            .table("category_filter_options")
            .insert(assignments)
            .execute()
        )

        return response.data or []

    except ValueError:
        raise

    except Exception as e:

        print(
            "Exception in "
            f"update_category_filters_service: {e}"
        )

        raise