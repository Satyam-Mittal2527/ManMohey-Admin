from typing import List

from fastapi import (
    APIRouter,
    HTTPException,
    UploadFile,
    File,
)

from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductStatusUpdate,
    ProductImageReorder,
)

from app.services.product_service import (
    get_all_products,
    get_deleted_products_service,
    get_product_by_id_service,
    create_product_service,
    update_product_service,
    update_product_status_service,
    delete_product_service,
    upload_product_images_service,
    delete_product_image_service,
    reorder_product_image_service,
    restore_product_service,
)


router = APIRouter()


# ============================================================
# GET ALL PRODUCTS
# ============================================================

@router.get("/")
def get_products():

    try:

        products = get_all_products()

        return {
            "success": True,
            "data": products,
        }

    except Exception as e:

        print(
            f"Get products error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch products",
        )


# ============================================================
# GET DELETED PRODUCTS
# ============================================================
@router.get("/deleted")
def get_deleted_products():

    try:

        products = (
            get_deleted_products_service()
        )

        return {
            "success": True,
            "data": products,
        }

    except Exception as e:

        print(
            f"Get deleted products error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch deleted products",
        )
    
# ============================================================
# GET PRODUCT BY ID
# ============================================================

@router.get("/{product_id}")
def get_product(
    product_id: int,
):

    try:

        product = get_product_by_id_service(
            product_id
        )

        if not product:

            raise HTTPException(
                status_code=404,
                detail="Product not found",
            )

        return {
            "success": True,
            "data": product,
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            f"Get product error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch product",
        )


# ============================================================
# CREATE PRODUCT
# ============================================================

@router.post("/")
def create_product(
    product_data: ProductCreate,
):

    try:

        result = create_product_service(
            product_data
        )

        return {
            "success": True,
            "message": "Product created successfully",
            "data": result,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:

        print(
            f"Create product error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to create product",
        )


# ============================================================
# UPDATE PRODUCT
# ============================================================

@router.put("/{product_id}")
def update_product(
    product_id: int,
    product_data: ProductUpdate,
):

    try:

        result = update_product_service(
            product_id,
            product_data,
        )

        return {
            "success": True,
            "message": "Product updated successfully",
            "data": result,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:

        print(
            f"Update product error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to update product",
        )


# ============================================================
# UPDATE PRODUCT STATUS
# ============================================================

@router.patch("/{product_id}/status")
def update_product_status(
    product_id: int,
    status_data: ProductStatusUpdate,
):

    try:

        result = update_product_status_service(
            product_id,
            status_data.active,
        )

        return {
            "success": True,
            "message": "Product status updated successfully",
            "data": result,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except Exception as e:

        print(
            f"Update product status error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to update product status",
        )


# ============================================================
# UPLOAD PRODUCT IMAGES
# ============================================================

@router.post("/{product_id}/images")
async def upload_product_images(
    product_id: int,
    images: List[UploadFile] = File(...),
):

    try:

        result = await upload_product_images_service(
            product_id,
            images,
        )

        return {
            "success": True,
            "message": "Product images uploaded successfully",
            "data": result,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:

        print(
            f"Image upload error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to upload product images",
        )


# ============================================================
# DELETE PRODUCT IMAGE
# ============================================================

@router.delete(
    "/{product_id}/images/{image_id}"
)
def delete_product_image(
    product_id: int,
    image_id: int,
):

    try:

        result = delete_product_image_service(
            product_id,
            image_id,
        )

        return {
            "success": True,
            "message": "Product image deleted successfully",
            "data": result,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except Exception as e:

        print(
            f"Delete image error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to delete product image",
        )


# ============================================================
# REORDER PRODUCT IMAGE
# ============================================================

@router.patch(
    "/{product_id}/images/reorder"
)
def reorder_product_image(
    product_id: int,
    reorder_data: ProductImageReorder,
):

    try:

        result = reorder_product_image_service(
            product_id,
            reorder_data.image_id,
            reorder_data.display_order,
        )

        return {
            "success": True,
            "message": "Image order updated successfully",
            "data": result,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except Exception as e:

        print(
            f"Reorder image error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to reorder product image",
        )


# ============================================================
# DELETE A PRODUCT
# ============================================================

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
):

    try:

        result = delete_product_service(
            product_id
        )

        return {
            "success": True,
            "message": "Product deleted successfully",
            "data": result,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except Exception as e:

        print(
            f"Delete product error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to delete product",
        )


# ============================================================
# RESTORE A PRODUCT
# ============================================================


@router.patch("/{product_id}/restore")
def restore_product(
    product_id: int,
):

    try:

        result = restore_product_service(
            product_id
        )

        return {
            "success": True,
            "message": "Product restored successfully",
            "data": result,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except Exception as e:

        print(
            f"Restore product error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to restore product",
        )