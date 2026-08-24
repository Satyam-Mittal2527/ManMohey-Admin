from app.database.supabase_client import supabase_admin


def get_all_customers():

    try:

        response = (
            supabase_admin
            .table("profiles")
            .select(
                """
                id,
                email,
                first_name,
                last_name,
                age,
                phone_number
                """
            )
            .order(
                "first_name"
            )
            .execute()
        )

        return response.data or []

    except Exception as e:

        print(
            f"Exception in get_all_customers: {e}"
        )

        raise


def get_customer_by_id(
    customer_id: str
):

    try:

        response = (
            supabase_admin
            .table("profiles")
            .select(
                """
                id,
                email,
                first_name,
                last_name,
                age,
                phone_number
                """
            )
            .eq(
                "id",
                customer_id
            )
            .single()
            .execute()
        )

        if not response.data:

            raise ValueError(
                "Customer not found"
            )

        return response.data

    except ValueError:
        raise

    except Exception as e:

        print(
            f"Exception in get_customer_by_id: {e}"
        )

        raise