from typing import List

from fastapi import UploadFile


from app.database.supabase_client import supabase, supabase_admin
from app.schemas.product import ProductCreate, ProductUpdate

#---------------------------------------------------------#
############### GET ALL PRODUCTS ##########################
#---------------------------------------------------------#
def get_all_products():
    try:
        response = (
            supabase_admin
            .table("products")
            .select("""
                *,
                categories!products_category_id_fkey(
                    id,
                    name,
                    slug
                ),
                product_images(
                    id,
                    image_url,
                    display_order
                )
            """)
            .eq("active", True)
            .order("created_at", desc=True)
            .execute()
        )

        products = response.data

        for product in products:

            images = product.get("product_images", [])

            # Sort images by display order
            images = sorted(
                images,
                key=lambda image: image.get(
                    "display_order", 999
                )
            )

            # Generate public URLs
            for image in images:
                image["public_url"] = (
                    supabase
                    .storage
                    .from_("website-assets")
                    .get_public_url(
                        image["image_url"]
                    )
                )

            # First image is used as the
            # product listing image
            if images:
                product["image"] = images[0]["public_url"]
            else:
                product["image"] = None

            # Keep the complete image list if
            # we need it later
            product["product_images"] = images

        return products

    except Exception as e:
        print(
            f"Exception in get_all_products: {e}"
        )
        return []

#---------------------------------------------------------#
############### CREATE PRODUCT ##########################
#---------------------------------------------------------#
def create_product_service(
    product_data: ProductCreate,
):
    try:

        # ========================================================
        # 1. Validate category
        # ========================================================

        category_response = (
            supabase_admin
            .table("categories")
            .select("id")
            .eq(
                "id",
                product_data.category_id
            )
            .eq("active", True)
            .single()
            .execute()
        )

        if not category_response.data:
            raise ValueError(
                "Invalid or inactive category"
            )

        # ========================================================
        # 2. Validate filter options
        # ========================================================

        filter_option_ids = list(
            set(product_data.filter_option_ids)
        )

        if filter_option_ids:

            filter_response = (
                supabase_admin
                .table("filter_options")
                .select("id, group_id")
                .in_(
                    "id",
                    filter_option_ids
                )
                .eq("active", True)
                .execute()
            )

            valid_filter_ids = {
                item["id"]
                for item in filter_response.data
            }

            invalid_filter_ids = [
                filter_id
                for filter_id in filter_option_ids
                if filter_id not in valid_filter_ids
            ]

            if invalid_filter_ids:
                raise ValueError(
                    f"Invalid filter option IDs: "
                    f"{invalid_filter_ids}"
                )

        # ========================================================
        # 3. Create product
        # ========================================================

        product_payload = {
            "name": product_data.name,
            "slug": product_data.slug,
            "short_description":
                product_data.short_description,
            "description":
                product_data.description,
            "category_id":
                product_data.category_id,
            "price":
                product_data.price,
            "sale_price":
                product_data.sale_price,
            "sku":
                product_data.sku,
            "stock":
                product_data.stock,
            "weight":
                product_data.weight,
            "featured":
                product_data.featured,
            "active":
                product_data.active,
        }

        product_response = (
            supabase_admin
            .table("products")
            .insert(product_payload)
            .execute()
        )

        if not product_response.data:
            raise ValueError(
                "Failed to create product"
            )

        product = product_response.data[0]

        product_id = product["id"]

        # ========================================================
        # 4. Create product-filter relationships
        # ========================================================

        if filter_option_ids:

            filter_values = [
                {
                    "product_id": product_id,
                    "filter_option_id": filter_id,
                }
                for filter_id in filter_option_ids
            ]

            filter_response = (
                supabase_admin
                .table("product_filter_values")
                .insert(filter_values)
                .execute()
            )

            if not filter_response.data:

                # Remove product because the filter
                # relationship failed
                (
                    supabase_admin
                    .table("products")
                    .delete()
                    .eq("id", product_id)
                    .execute()
                )

                raise ValueError(
                    "Failed to save product filters"
                )

        # ========================================================
        # 5. Create product variants
        # ========================================================

        if product_data.variants:

            variant_payload = [
                {
                    "product_id": product_id,
                    "sku": variant.sku,
                    "size": variant.size,
                    "color": variant.color,
                    "stock": variant.stock,
                    "price": variant.price,
                }
                for variant in product_data.variants
            ]

            variant_response = (
                supabase_admin
                .table("product_variants")
                .insert(variant_payload)
                .execute()
            )

            if not variant_response.data:

                # Remove filter relationships
                (
                    supabase_admin
                    .table("product_filter_values")
                    .delete()
                    .eq("product_id", product_id)
                    .execute()
                )

                # Remove product
                (
                    supabase_admin
                    .table("products")
                    .delete()
                    .eq("id", product_id)
                    .execute()
                )

                raise ValueError(
                    "Failed to save product variants"
                )

        # ========================================================
        # 6. Return created product
        # ========================================================

        return {
            "product": product,
            "filter_option_ids": filter_option_ids,
            "variants": [
                variant.model_dump()
                for variant in product_data.variants
            ],
        }

    except Exception as e:

        print(
            f"Exception in create_product_service: {e}"
        )

        raise


#---------------------------------------------------------#
############### UPLOAD PRODUCTS IMAGE ##########################
#---------------------------------------------------------#

async def upload_product_images_service(
    product_id: int,
    images: List[UploadFile],
):
    try:

        # ========================================================
        # 1. Verify product exists
        # ========================================================

        product_response = (
            supabase_admin
            .table("products")
            .select("id")
            .eq("id", product_id)
            .single()
            .execute()
        )

        if not product_response.data:
            raise ValueError(
                "Product not found"
            )

        uploaded_images = []

        # ========================================================
        # 2. Upload each image
        # ========================================================

        for index, image in enumerate(images):

            if not image.filename:
                continue

            # Basic content-type validation
            allowed_types = {
                "image/jpeg",
                "image/png",
                "image/webp",
                "image/jpg",
            }

            if image.content_type not in allowed_types:
                raise ValueError(
                    f"Unsupported image type: "
                    f"{image.content_type}"
                )

            # Read file
            file_data = await image.read()

            # Create storage path
            file_extension = (
                image.filename
                .split(".")[-1]
                .lower()
            )

            storage_path = (
                f"products/{product_id}/"
                f"{index + 1}.{file_extension}"
            )

            # Upload to Supabase Storage
            storage_response = (
                supabase_admin
                .storage
                .from_("website-assets")
                .upload(
                    storage_path,
                    file_data,
                    {
                        "content-type":
                            image.content_type,
                        "upsert": "true",
                    },
                )
            )

            # ====================================================
            # 3. Save image record
            # ====================================================

            image_response = (
                supabase_admin
                .table("product_images")
                .insert({
                    "product_id": product_id,
                    "image_url": storage_path,
                    "alt_text": image.filename,
                    "display_order": index + 1,
                })
                .execute()
            )

            if not image_response.data:
                raise ValueError(
                    "Failed to save image record"
                )

            image_record = image_response.data[0]

            public_url = (
                supabase
                .storage
                .from_("website-assets")
                .get_public_url(
                    storage_path
                )
            )

            uploaded_images.append({
                "id": image_record["id"],
                "image_url": storage_path,
                "public_url": public_url,
                "display_order": index + 1,
            })

        return uploaded_images

    except Exception as e:

        print(
            "Exception in "
            f"upload_product_images_service: {e}"
        )

        raise

#---------------------------------------------------------#
############### GET PRODUCTS BY ID ##########################
#---------------------------------------------------------#

def get_product_by_id_service(
    product_id: int,
):
    try:

        # ========================================================
        # 1. Product + Category
        # ========================================================

        product_response = (
            supabase_admin
            .table("products")
            .select("""
                *,
                categories!products_category_id_fkey(
                    id,
                    name,
                    slug
                )
            """)
            .eq(
                "id",
                product_id
            )
            .single()
            .execute()
        )

        if not product_response.data:
            return None

        product = product_response.data

        # ========================================================
        # 2. Product Images
        # ========================================================

        images_response = (
            supabase_admin
            .table("product_images")
            .select("""
                id,
                product_id,
                image_url,
                alt_text,
                display_order,
                created_at
            """)
            .eq(
                "product_id",
                product_id
            )
            .order(
                "display_order"
            )
            .execute()
        )

        images = (
            images_response.data or []
        )

        for image in images:

            image["public_url"] = (
                supabase
                .storage
                .from_("website-assets")
                .get_public_url(
                    image["image_url"]
                )
            )

        # ========================================================
        # 3. Product Filters
        # ========================================================

        filter_response = (
            supabase_admin
            .table("product_filter_values")
            .select("""
                filter_option_id,
                filter_options(
                    id,
                    name,
                    slug,
                    group_id,
                    display_order
                )
            """)
            .eq(
                "product_id",
                product_id
            )
            .execute()
        )

        filter_values = (
            filter_response.data or []
        )

        filter_option_ids = [
            item["filter_option_id"]
            for item in filter_values
        ]

        # ========================================================
        # 4. Product Variants
        # ========================================================

        variants_response = (
            supabase_admin
            .table("product_variants")
            .select("""
                id,
                product_id,
                sku,
                size,
                color,
                stock,
                price
            """)
            .eq(
                "product_id",
                product_id
            )
            .order(
                "id"
            )
            .execute()
        )

        variants = (
            variants_response.data or []
        )

        # ========================================================
        # 5. Build response
        # ========================================================

        product["product_images"] = images

        product["filter_option_ids"] = (
            filter_option_ids
        )

        product["filter_values"] = (
            filter_values
        )

        product["variants"] = variants

        return product

    except Exception as e:

        print(
            f"Exception in "
            f"get_product_by_id_service: {e}"
        )

        raise

#---------------------------------------------------------#
############### UPDATE THE PRODUCT ##########################
#---------------------------------------------------------#

def update_product_service(
    product_id: int,
    product_data: ProductUpdate,
):
    try:

        # ========================================================
        # 1. Verify product exists
        # ========================================================

        existing_response = (
            supabase_admin
            .table("products")
            .select("id")
            .eq(
                "id",
                product_id
            )
            .single()
            .execute()
        )

        if not existing_response.data:

            raise ValueError(
                "Product not found"
            )

        # ========================================================
        # 2. Validate category
        # ========================================================

        category_response = (
            supabase_admin
            .table("categories")
            .select("id")
            .eq(
                "id",
                product_data.category_id
            )
            .eq(
                "active",
                True
            )
            .single()
            .execute()
        )

        if not category_response.data:

            raise ValueError(
                "Invalid or inactive category"
            )

        # ========================================================
        # 3. Validate filter options
        # ========================================================

        filter_option_ids = list(
            set(
                product_data.filter_option_ids
            )
        )

        if filter_option_ids:

            filter_response = (
                supabase_admin
                .table("filter_options")
                .select(
                    "id, group_id"
                )
                .in_(
                    "id",
                    filter_option_ids
                )
                .eq(
                    "active",
                    True
                )
                .execute()
            )

            valid_filter_ids = {
                item["id"]
                for item in filter_response.data
            }

            invalid_filter_ids = [
                filter_id
                for filter_id in filter_option_ids
                if filter_id
                not in valid_filter_ids
            ]

            if invalid_filter_ids:

                raise ValueError(
                    "Invalid filter option IDs: "
                    f"{invalid_filter_ids}"
                )

        # ========================================================
        # 4. Validate variants
        # ========================================================

        variants = (
            product_data.variants
        )

        seen_combinations = set()

        for variant in variants:

            combination = (
                variant.size,
                variant.color,
            )

            if combination in seen_combinations:

                raise ValueError(
                    "Duplicate product variant: "
                    f"size={variant.size}, "
                    f"color={variant.color}"
                )

            seen_combinations.add(
                combination
            )

        # ========================================================
        # 5. Update product
        # ========================================================

        product_payload = {
            "name":
                product_data.name,

            "slug":
                product_data.slug,

            "short_description":
                product_data.short_description,

            "description":
                product_data.description,

            "category_id":
                product_data.category_id,

            "price":
                product_data.price,

            "sale_price":
                product_data.sale_price,

            "sku":
                product_data.sku,

            "stock":
                product_data.stock,

            "weight":
                product_data.weight,

            "featured":
                product_data.featured,

            "active":
                product_data.active,
        }

        product_response = (
            supabase_admin
            .table("products")
            .update(product_payload)
            .eq(
                "id",
                product_id
            )
            .execute()
        )

        if not product_response.data:

            raise ValueError(
                "Failed to update product"
            )

        # ========================================================
        # 6. Replace filter relationships
        # ========================================================

        (
            supabase_admin
            .table("product_filter_values")
            .delete()
            .eq(
                "product_id",
                product_id
            )
            .execute()
        )

        if filter_option_ids:

            filter_values = [
                {
                    "product_id":
                        product_id,

                    "filter_option_id":
                        filter_id,
                }

                for filter_id
                in filter_option_ids
            ]

            filter_response = (
                supabase_admin
                .table(
                    "product_filter_values"
                )
                .insert(
                    filter_values
                )
                .execute()
            )

            if not filter_response.data:

                raise ValueError(
                    "Failed to update product filters"
                )

        # ========================================================
        # 7. Replace variants
        # ========================================================

        (
            supabase_admin
            .table("product_variants")
            .delete()
            .eq(
                "product_id",
                product_id
            )
            .execute()
        )

        if variants:

            variant_payload = [
                {
                    "product_id":
                        product_id,

                    "sku":
                        variant.sku,

                    "size":
                        variant.size,

                    "color":
                        variant.color,

                    "stock":
                        variant.stock,

                    "price":
                        variant.price,
                }

                for variant
                in variants
            ]

            variant_response = (
                supabase_admin
                .table(
                    "product_variants"
                )
                .insert(
                    variant_payload
                )
                .execute()
            )

            if not variant_response.data:

                raise ValueError(
                    "Failed to update product variants"
                )

        # ========================================================
        # 8. Return updated product
        # ========================================================

        updated_product = (
            get_product_by_id_service(
                product_id
            )
        )

        return updated_product

    except Exception as e:

        print(
            f"Exception in "
            f"update_product_service: {e}"
        )

        raise

#---------------------------------------------------------#
############### UPDATE THE PRODUCTS STATUS ##########################
#---------------------------------------------------------#

def update_product_status_service(
    product_id: int,
    active: bool,
):
    try:

        response = (
            supabase_admin
            .table("products")
            .update({
                "active": active
            })
            .eq(
                "id",
                product_id
            )
            .execute()
        )

        if not response.data:

            raise ValueError(
                "Product not found"
            )

        return response.data[0]

    except Exception as e:

        print(
            f"Exception in "
            f"update_product_status_service: {e}"
        )

        raise

#---------------------------------------------------------#
############### DELETE THE PRODUCT ##########################
#---------------------------------------------------------#

def delete_product_image_service(
    product_id: int,
    image_id: int,
):
    try:

        # ========================================================
        # 1. Find image
        # ========================================================

        image_response = (
            supabase_admin
            .table("product_images")
            .select("""
                id,
                product_id,
                image_url
            """)
            .eq(
                "id",
                image_id
            )
            .eq(
                "product_id",
                product_id
            )
            .single()
            .execute()
        )

        if not image_response.data:

            raise ValueError(
                "Product image not found"
            )

        image = image_response.data

        # ========================================================
        # 2. Delete from Storage
        # ========================================================

        storage_response = (
            supabase_admin
            .storage
            .from_("website-assets")
            .remove([
                image["image_url"]
            ])
        )

        # ========================================================
        # 3. Delete database record
        # ========================================================

        delete_response = (
            supabase_admin
            .table("product_images")
            .delete()
            .eq(
                "id",
                image_id
            )
            .eq(
                "product_id",
                product_id
            )
            .execute()
        )

        if not delete_response.data:

            raise ValueError(
                "Failed to delete product image"
            )

        return {
            "id":
                image_id,

            "image_url":
                image["image_url"],
        }

    except Exception as e:

        print(
            f"Exception in "
            f"delete_product_image_service: {e}"
        )

        raise


#---------------------------------------------------------#
############### REORDER THE IMAGE OF THE PRODUCT ##########################
#---------------------------------------------------------#

def reorder_product_image_service(
    product_id: int,
    image_id: int,
    display_order: int,
):
    try:

        # ========================================================
        # 1. Get all product images
        # ========================================================

        images_response = (
            supabase_admin
            .table("product_images")
            .select("""
                id,
                product_id,
                display_order
            """)
            .eq(
                "product_id",
                product_id
            )
            .order(
                "display_order"
            )
            .execute()
        )

        images = images_response.data or []

        if not images:
            raise ValueError(
                "No images found for product"
            )

        # ========================================================
        # 2. Find requested image
        # ========================================================

        image_index = next(
            (
                index
                for index, image
                in enumerate(images)
                if image["id"] == image_id
            ),
            None
        )

        if image_index is None:
            raise ValueError(
                "Product image not found"
            )

        # ========================================================
        # 3. Clamp requested position
        # ========================================================

        new_index = max(
            0,
            min(
                display_order - 1,
                len(images) - 1
            )
        )

        # ========================================================
        # 4. Remove image from current position
        # ========================================================

        image_to_move = images.pop(
            image_index
        )

        # ========================================================
        # 5. Insert at new position
        # ========================================================

        images.insert(
            new_index,
            image_to_move
        )

        # ========================================================
        # 6. Reassign display orders
        # ========================================================

        for index, image in enumerate(
            images,
            start=1
        ):

            (
                supabase_admin
                .table("product_images")
                .update({
                    "display_order": index
                })
                .eq(
                    "id",
                    image["id"]
                )
                .eq(
                    "product_id",
                    product_id
                )
                .execute()
            )

        # ========================================================
        # 7. Return updated image
        # ========================================================

        updated_image_response = (
            supabase_admin
            .table("product_images")
            .select("""
                id,
                product_id,
                image_url,
                alt_text,
                display_order,
                created_at
            """)
            .eq(
                "id",
                image_id
            )
            .eq(
                "product_id",
                product_id
            )
            .single()
            .execute()
        )

        if not updated_image_response.data:
            raise ValueError(
                "Failed to retrieve reordered image"
            )

        return updated_image_response.data

    except Exception as e:

        print(
            f"Exception in "
            f"reorder_product_image_service: {e}"
        )

        raise

def delete_product_service(
    product_id: int,
):
    try:

        # ========================================================
        # 1. Check product exists
        # ========================================================

        product_response = (
            supabase_admin
            .table("products")
            .select("id, active")
            .eq(
                "id",
                product_id
            )
            .single()
            .execute()
        )

        if not product_response.data:
            raise ValueError(
                "Product not found"
            )

        # ========================================================
        # 2. Check if already deleted
        # ========================================================

        if not product_response.data["active"]:

            raise ValueError(
                "Product is already deleted"
            )

        # ========================================================
        # 3. Soft delete
        # ========================================================

        response = (
            supabase_admin
            .table("products")
            .update({
                "active": False
            })
            .eq(
                "id",
                product_id
            )
            .execute()
        )

        if not response.data:

            raise ValueError(
                "Failed to delete product"
            )

        # ========================================================
        # 4. Return result
        # ========================================================

        return response.data[0]

    except Exception as e:

        print(
            f"Exception in "
            f"delete_product_service: {e}"
        )

        raise


# ========================================================
# Get all deleted products
# ========================================================

def get_deleted_products_service():
    try:

        response = (
            supabase_admin
            .table("products")
            .select("""
                *,
                categories!products_category_id_fkey(
                    id,
                    name,
                    slug
                ),
                product_images(
                    id,
                    image_url,
                    display_order
                )
            """)
            .eq(
                "active",
                False
            )
            .order(
                "created_at",
                desc=True
            )
            .execute()
        )

        products = response.data or []

        # ========================================================
        # Generate image URLs
        # ========================================================

        for product in products:

            images = product.get(
                "product_images",
                []
            )

            images = sorted(
                images,
                key=lambda image:
                    image.get(
                        "display_order",
                        999
                    )
            )

            for image in images:

                image["public_url"] = (
                    supabase
                    .storage
                    .from_("website-assets")
                    .get_public_url(
                        image["image_url"]
                    )
                )

            if images:

                product["image"] = (
                    images[0]["public_url"]
                )

            else:

                product["image"] = None

            product["product_images"] = images

        return products

    except Exception as e:

        print(
            f"Exception in "
            f"get_deleted_products_service: {e}"
        )

        raise


# ========================================================
# # Restore products 
# # ========================================================
def restore_product_service(
    product_id: int,
):
    try:

        # ========================================================
        # 1. Check product exists
        # ========================================================

        product_response = (
            supabase_admin
            .table("products")
            .select(
                "id, active"
            )
            .eq(
                "id",
                product_id
            )
            .single()
            .execute()
        )

        if not product_response.data:

            raise ValueError(
                "Product not found"
            )

        product = (
            product_response.data
        )

        # ========================================================
        # 2. Check product is actually deleted
        # ========================================================

        if product["active"]:

            raise ValueError(
                "Product is already active"
            )

        # ========================================================
        # 3. Restore product
        # ========================================================

        response = (
            supabase_admin
            .table("products")
            .update({
                "active": True
            })
            .eq(
                "id",
                product_id
            )
            .execute()
        )

        if not response.data:

            raise ValueError(
                "Failed to restore product"
            )

        return response.data[0]

    except Exception as e:

        print(
            f"Exception in "
            f"restore_product_service: {e}"
        )

        raise