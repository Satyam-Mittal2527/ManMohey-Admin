const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:8000";

export async function getOrders() {
  const response = await fetch(
    `${baseUrl}/api/orders/`,
    {
      method: "GET",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Failed to fetch orders"
    );
  }

  return result;
}

export async function getOrderById(orderId) {
  const response = await fetch(
    `${baseUrl}/api/orders/${orderId}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Failed to fetch order"
    );
  }

  return result;
}

export async function updateOrderStatus(orderId, status) {
  const response = await fetch(
    `${baseUrl}/api/orders/${orderId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Failed to update order status"
    );
  }

  return result;
}