import API_BASE_URL from "./config";

export async function getCategoryFilters(
    categoryId
) {
    const response = await fetch(
        `${API_BASE_URL}/api/categories/${categoryId}/filters`
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch category filters: ${response.status}`
        );
    }

    const result = await response.json();

    if (!result.success) {
        throw new Error(
            result.message ||
                "Failed to fetch category filters"
        );
    }

    return result.data;
}

/* ============================================================
   FILTER GROUPS
   ============================================================ */

export async function getFilterGroups() {

    const response = await fetch(
        `${API_BASE_URL}/api/filter-groups/`
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch filter groups: ${response.status}`
        );
    }

    const result = await response.json();

    if (!result.success) {
        throw new Error(
            result.message ||
                "Failed to fetch filter groups"
        );
    }

    return result.data;
}


export async function deleteFilterGroup(
    groupId
) {

    const response = await fetch(
        `${API_BASE_URL}/api/filter-groups/${groupId}`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {

        const result =
            await response.json();

        throw new Error(
            result.detail ||
                result.message ||
                "Failed to delete filter group"
        );
    }

    const result =
        await response.json();

    if (!result.success) {
        throw new Error(
            result.message ||
                "Failed to delete filter group"
        );
    }

    return result.data;
}

export async function createFilterGroup(
    groupData
) {
    const response = await fetch(
        `${API_BASE_URL}/api/filter-groups/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(groupData),
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.detail ||
                result.message ||
                "Failed to create filter group"
        );
    }

    return result.data;
}

export async function updateFilterGroup(
    groupId,
    groupData
) {
    const response = await fetch(
        `${API_BASE_URL}/api/filter-groups/${groupId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(groupData),
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.detail ||
                result.message ||
                "Failed to update filter group"
        );
    }

    return result.data;
}

/* ============================================================
   FILTER OPTIONS
   ============================================================ */

export async function getFilterOptions() {
    const response = await fetch(
        `${API_BASE_URL}/api/filter-options/`
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch filter options: ${response.status}`
        );
    }

    const result = await response.json();

    if (!result.success) {
        throw new Error(
            result.message ||
                "Failed to fetch filter options"
        );
    }

    return result.data;
}


export async function getFilterOptionsByGroup(
    groupId
) {
    const response = await fetch(
        `${API_BASE_URL}/api/filter-options/group/${groupId}`
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch filter options: ${response.status}`
        );
    }

    const result = await response.json();

    if (!result.success) {
        throw new Error(
            result.message ||
                "Failed to fetch filter options"
        );
    }

    return result.data;
}


export async function createFilterOption(
    optionData
) {
    const response = await fetch(
        `${API_BASE_URL}/api/filter-options/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(optionData),
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.detail ||
                result.message ||
                "Failed to create filter option"
        );
    }

    return result.data;
}


export async function updateFilterOption(
    optionId,
    optionData
) {
    const response = await fetch(
        `${API_BASE_URL}/api/filter-options/${optionId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(optionData),
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.detail ||
                result.message ||
                "Failed to update filter option"
        );
    }

    return result.data;
}


export async function deleteFilterOption(
    optionId
) {
    const response = await fetch(
        `${API_BASE_URL}/api/filter-options/${optionId}`,
        {
            method: "DELETE",
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.detail ||
                result.message ||
                "Failed to delete filter option"
        );
    }

    return result.data;
}

/* ============================================================
   CATEGORY FILTER ASSIGNMENT
   ============================================================ */

export async function updateCategoryFilters(
    categoryId,
    filterOptionIds
) {
    const response = await fetch(
        `${API_BASE_URL}/api/categories/${categoryId}/filters`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                filter_option_ids:
                    filterOptionIds,
            }),
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.detail ||
                result.message ||
                "Failed to update category filters"
        );
    }

    return result.data;
}