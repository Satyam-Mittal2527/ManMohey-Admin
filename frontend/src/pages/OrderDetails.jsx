import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import {
    getOrderById,
    updateOrderStatus,
} from "../api/orders";

const ORDER_STATUSES = [
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
];

const statusLabels = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

export default function OrderDetails() {
    const { id } = useParams();
    const [sidebarOpen, setSidebarOpen] =
        useState(false);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const handleStatusUpdate = async () => {
        if (!order) return;

        try {
            setUpdatingStatus(true);

            const response = await updateOrderStatus(
                order.id,
                selectedStatus
            );

            setOrder((prev) => ({
                ...prev,
                status: response.data.status,
            }));

            setFeedback({
                type: "success",
                message: `Order moved to ${statusLabels[response.data.status] || response.data.status}.`,
            });

        } catch (error) {
            console.error(
                "Failed to update order status:",
                error
            );

            setFeedback({
                type: "error",
                message: error.message || "Failed to update order status",
            });
        } finally {
            setUpdatingStatus(false);
        }
    };
    useEffect(() => {
        const loadOrder = async () => {
            try {
                setLoading(true);

                const response = await getOrderById(id);

                setOrder(response.data);
                setSelectedStatus(response.data.status);
            } catch (error) {
                console.error(
                    "Failed to fetch order:",
                    error
                );

                setError(
                    error.message || "Failed to load order"
                );
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">
                    Loading order...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="rounded-lg bg-red-50 p-4 text-red-600">
                    {error}
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="p-6">
                <p className="text-gray-500">
                    Order not found.
                </p>
            </div>
        );
    }

    const currentStatusIndex = ORDER_STATUSES.indexOf(order.status);
    const isCancelled = order.status === "CANCELLED";

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />
            <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto">

                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <div className="p-6">

                    {/* Header */}

                    <div className="mb-6 flex items-center justify-between">

                        <div>
                            <Link
                                to="/orders"
                                className="text-sm text-violet-600 hover:text-violet-700"
                            >
                                ← Back to Orders
                            </Link>

                            <h1 className="mt-3 text-2xl font-semibold text-gray-900">
                                {order.order_number}
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Order #{order.id}
                            </p>
                        </div>

                        <div className="text-right">

                            <div className="flex items-center gap-2">

                                <select
                                    value={selectedStatus}
                                    onChange={(e) =>
                                        setSelectedStatus(e.target.value)
                                    }
                                    disabled={updatingStatus}
                                    className={`rounded-lg border px-3 py-2 text-sm font-medium ${selectedStatus === "PENDING"
                                            ? "border-yellow-300 bg-yellow-50 text-yellow-700"
                                            : selectedStatus === "CONFIRMED"
                                                ? "border-blue-300 bg-blue-50 text-blue-700"
                                                : selectedStatus === "SHIPPED"
                                                    ? "border-violet-300 bg-violet-50 text-violet-700"
                                                    : selectedStatus === "DELIVERED"
                                                        ? "border-green-300 bg-green-50 text-green-700"
                                                        : selectedStatus === "CANCELLED"
                                                            ? "border-red-300 bg-red-50 text-red-700"
                                                            : "border-gray-300 bg-white text-gray-700"
                                        }`}
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="CONFIRMED">CONFIRMED</option>
                                    <option value="SHIPPED">SHIPPED</option>
                                    <option value="DELIVERED">DELIVERED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={handleStatusUpdate}
                                    disabled={
                                        updatingStatus ||
                                        selectedStatus === order.status
                                    }
                                    className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {updatingStatus
                                        ? "Updating..."
                                        : "Update Status"}
                                </button>

                            </div>

                            <p className="mt-2 text-sm text-gray-500">
                                Payment:{" "}
                                <span className="font-medium text-gray-700">
                                    {order.payment_status}
                                </span>
                            </p>

                            {feedback && (
                                <p
                                    role="status"
                                    className={`mt-2 text-sm ${feedback.type === "success"
                                        ? "text-green-600"
                                        : "text-red-600"
                                        }`}
                                >
                                    {feedback.message}
                                </p>
                            )}

                        </div>

                    </div>

                    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Fulfillment progress
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    {isCancelled
                                        ? "This order has been cancelled."
                                        : `${statusLabels[order.status]} is the current stage.`}
                                </p>
                            </div>
                            <span className="text-sm font-medium text-gray-500">
                                {isCancelled ? "Stopped" : `${currentStatusIndex + 1} of ${ORDER_STATUSES.length}`}
                            </span>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-4">
                            {ORDER_STATUSES.map((status, index) => {
                                const isComplete = !isCancelled && index <= currentStatusIndex;
                                const isCurrent = !isCancelled && status === order.status;

                                return (
                                    <div key={status} className="relative">
                                        <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${isComplete
                                            ? "bg-violet-600 text-white"
                                            : "bg-gray-100 text-gray-400"
                                            }`}>
                                            {isComplete ? "✓" : index + 1}
                                        </div>
                                        {index < ORDER_STATUSES.length - 1 && (
                                            <div className={`absolute left-9 right-0 top-4 hidden h-0.5 sm:block ${index < currentStatusIndex && !isCancelled
                                                ? "bg-violet-600"
                                                : "bg-gray-200"
                                                }`} />
                                        )}
                                        <p className={`mt-2 text-sm font-medium ${isCurrent ? "text-violet-700" : "text-gray-700"}`}>
                                            {statusLabels[status]}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>


                    {/* Customer + Address */}

                    <div className="grid gap-6 lg:grid-cols-2">

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                            <h2 className="mb-4 text-lg font-semibold text-gray-900">
                                Customer
                            </h2>

                            <div className="space-y-2 text-sm">

                                <p>
                                    <span className="text-gray-500">
                                        Name:
                                    </span>{" "}
                                    <span className="font-medium text-gray-900">
                                        {order.full_name}
                                    </span>
                                </p>

                                <p>
                                    <span className="text-gray-500">
                                        Phone:
                                    </span>{" "}
                                    {order.phone_number}
                                </p>

                                <p>
                                    <span className="text-gray-500">
                                        User ID:
                                    </span>{" "}
                                    {order.user_id}
                                </p>

                            </div>

                        </div>


                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                            <h2 className="mb-4 text-lg font-semibold text-gray-900">
                                Shipping Address
                            </h2>

                            <div className="text-sm leading-6 text-gray-600">

                                <p>{order.full_name}</p>

                                <p>{order.address_line_1}</p>

                                {order.address_line_2 && (
                                    <p>{order.address_line_2}</p>
                                )}

                                <p>
                                    {order.city}, {order.state}{" "}
                                    {order.postal_code}
                                </p>

                                <p>{order.country}</p>

                                <p className="mt-2">
                                    Phone: {order.phone_number}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Products */}

                    <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm">

                        <div className="border-b border-gray-200 p-6">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Order Items
                            </h2>

                        </div>

                        <div className="overflow-x-auto">

                            <table className="min-w-full divide-y divide-gray-200">

                                <thead className="bg-gray-50">

                                    <tr>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                                            Product
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                                            Size
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                                            Quantity
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                                            Unit Price
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                                            Subtotal
                                        </th>

                                    </tr>

                                </thead>

                                <tbody className="divide-y divide-gray-100">

                                    {order.items?.map((item) => (

                                        <tr key={item.id}>

                                            <td className="px-6 py-4">

                                                <p className="font-medium text-gray-900">
                                                    {item.product_name}
                                                </p>

                                                {item.sku && (
                                                    <p className="text-xs text-gray-500">
                                                        SKU: {item.sku}
                                                    </p>
                                                )}

                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {item.size || "-"}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {item.quantity}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                ₹{Number(item.unit_price).toFixed(2)}
                                            </td>

                                            <td className="px-6 py-4 text-right font-medium text-gray-900">
                                                ₹{Number(item.subtotal).toFixed(2)}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>


                    {/* Summary */}

                    <div className="mt-6 flex justify-end">

                        <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:w-96">

                            <h2 className="mb-4 text-lg font-semibold text-gray-900">
                                Order Summary
                            </h2>

                            <div className="space-y-3 text-sm">

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Subtotal
                                    </span>

                                    <span>
                                        ₹{Number(order.subtotal).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Shipping
                                    </span>

                                    <span>
                                        ₹{Number(order.shipping_fee).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Discount
                                    </span>

                                    <span>
                                        - ₹{Number(order.discount).toFixed(2)}
                                    </span>
                                </div>

                                <div className="border-t border-gray-200 pt-3">

                                    <div className="flex justify-between text-base font-semibold">

                                        <span>
                                            Total
                                        </span>

                                        <span>
                                            ₹{Number(order.total_amount).toFixed(2)}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}