import API_BASE_URL from "./config";

export async function getProducts() {
  const response = await fetch(
    `${API_BASE_URL}/api/products/`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch products: ${response.status}`
    );
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(
      result.message || "Failed to fetch products"
    );
  }

  return result.data;
}

export const createProduct = async (payload) => {
    const response = await fetch(
        `${API_BASE_URL}/api/products/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Failed to create product"
        );
    }

    return data;
};


export const uploadProductImages = async (
    productId,
    images
) => {
    const formData = new FormData();

    images.forEach((image) => {
        formData.append(
            "images",
            image.file
        );
    });

    const response = await fetch(
        `${API_BASE_URL}/api/products/${productId}/images`,
        {
            method: "POST",
            body: formData,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
                "Failed to upload product images"
        );
    }

    return data;
};

export const getProductById = async (productId) => {
    const response = await fetch(
        `${API_BASE_URL}/api/products/${productId}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Failed to fetch product"
        );
    }

    return data;
};

export const deleteProductImage = async (
    productId,
    imageId
) => {
    const response = await fetch(
        `${API_BASE_URL}/api/products/${productId}/images/${imageId}`,
        {
            method: "DELETE",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            "Failed to delete image"
        );
    }

    return data;
};

export const deleteProduct = async (productId) => {
    const response = await fetch(
        `${API_BASE_URL}/api/products/${productId}`,
        {
            method: "DELETE",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Failed to delete product"
        );
    }

    return data;
};

export const getDeletedProducts = async () => {
    const response = await fetch(
        `${API_BASE_URL}/api/products/deleted`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            "Failed to fetch deleted products"
        );
    }

    return data;
};


export const restoreProduct = async (
    productId
) => {
    const response = await fetch(
        `${API_BASE_URL}/api/products/${productId}/restore`,
        {
            method: "PATCH",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            "Failed to restore product"
        );
    }

    return data;
};