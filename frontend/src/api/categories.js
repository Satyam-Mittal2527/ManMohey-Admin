import API_BASE_URL from "./config";

export async function getCategories() {
  const response = await fetch(
    `${API_BASE_URL}/api/categories/`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch categories: ${response.status}`
    );
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(
      result.message || "Failed to fetch categories"
    );
  }

  return result.data;
}

export async function createCategory(
    categoryData
) {
    const response = await fetch(
        `${API_BASE_URL}/api/categories/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                categoryData
            ),
        }
    );

    const result =
        await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.detail ||
                result.message ||
                "Failed to create category"
        );
    }

    return result.data;
}

export async function updateCategory(
    categoryId,
    categoryData
) {
    const response = await fetch(
        `${API_BASE_URL}/api/categories/${categoryId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                categoryData
            ),
        }
    );

    const result =
        await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.detail ||
                result.message ||
                "Failed to update category"
        );
    }

    return result.data;
}
export async function deleteCategory(
    categoryId
) {
    const response = await fetch(
        `${API_BASE_URL}/api/categories/${categoryId}`,
        {
            method: "DELETE",
        }
    );

    const result =
        await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.detail ||
                result.message ||
                "Failed to deactivate category"
        );
    }

    return result.data;
}