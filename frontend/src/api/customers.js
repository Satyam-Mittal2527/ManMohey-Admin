import API_BASE_URL from "./config";


export async function getCustomers() {

    const response = await fetch(
        `${API_BASE_URL}/api/customers/`
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch customers: ${response.status}`
        );
    }

    const result =
        await response.json();

    if (!result.success) {
        throw new Error(
            result.message ||
                "Failed to fetch customers"
        );
    }

    return result.data;
}


export async function getCustomerById(
    customerId
) {

    const response = await fetch(
        `${API_BASE_URL}/api/customers/${customerId}`
    );

    const result =
        await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.detail ||
                result.message ||
                "Failed to fetch customer"
        );
    }

    return result.data;
}