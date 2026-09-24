"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { getOrders } from "../api/orders";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sidebarOpen, setSidebarOpen] =
        useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [refreshing, setRefreshing] = useState(false);
    const getStatusStyle = (status) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-700";

            case "CONFIRMED":
                return "bg-blue-100 text-blue-700";

            case "SHIPPED":
                return "bg-violet-100 text-violet-700";

            case "DELIVERED":
                return "bg-green-100 text-green-700";

            case "CANCELLED":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const loadOrders = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response = await getOrders();

            setOrders(response.data || []);
            setError("");
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            setError(error.message || "Failed to load orders");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const filteredOrders = useMemo(() => {
        const query = search.trim().toLowerCase();

        return orders.filter((order) => {
            const matchesStatus =
                statusFilter === "ALL" || order.status === statusFilter;
            const matchesSearch = !query || [
                order.order_number,
                order.full_name,
                order.phone_number,
            ].some((value) =>
                String(value || "").toLowerCase().includes(query)
            );

            return matchesStatus && matchesSearch;
        });
    }, [orders, search, statusFilter]);

    const statusCounts = orders.reduce((counts, order) => {
        counts[order.status] = (counts[order.status] || 0) + 1;
        return counts;
    }, {});

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">
                    Loading orders...
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
                <button
                    type="button"
                    onClick={() => loadOrders()}
                    className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
                >
                    Try again
                </button>
            </div>
        );
    }

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

                    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Orders
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Track fulfillment progress and customer payments.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => loadOrders(true)}
                            disabled={refreshing}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {refreshing ? "Refreshing..." : "Refresh orders"}
                        </button>
                    </div>

                    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                        {["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => setStatusFilter(status)}
                                className={`rounded-lg border p-3 text-left transition ${statusFilter === status
                                    ? "border-violet-300 bg-violet-50"
                                    : "border-gray-200 bg-white hover:border-violet-200"
                                    }`}
                            >
                                <p className="text-xs font-semibold uppercase text-gray-500">
                                    {status === "ALL" ? "All orders" : status}
                                </p>
                                <p className="mt-1 text-xl font-semibold text-gray-900">
                                    {status === "ALL" ? orders.length : statusCounts[status] || 0}
                                </p>
                            </button>
                        ))}
                    </div>

                    <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                        <label className="flex-1">
                            <span className="sr-only">Search orders</span>
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search by order number, customer, or phone"
                                className="w-full rounded-lg border-gray-300 bg-white text-sm shadow-sm focus:border-violet-500 focus:ring-violet-500"
                            />
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            className="rounded-lg border-gray-300 bg-white text-sm shadow-sm focus:border-violet-500 focus:ring-violet-500"
                            aria-label="Filter orders by status"
                        >
                            <option value="ALL">All statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>

                    <div className="mb-3 text-sm text-gray-500">
                        Showing {filteredOrders.length} of {orders.length} orders
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                        <div className="overflow-x-auto">

                            <table className="min-w-full divide-y divide-gray-200">

                                <thead className="bg-gray-50">

                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                                            Order
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                                            Customer
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                                            Total
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                                            Order Status
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                                            Payment
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                                            Date
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                                            Action
                                        </th>
                                    </tr>

                                </thead>

                                <tbody className="divide-y divide-gray-100">

                                    {filteredOrders.map((order) => (

                                        <tr
                                            key={order.id}
                                            className="hover:bg-gray-50"
                                        >

                                            <td className="whitespace-nowrap px-6 py-4">
                                                <p className="font-medium text-gray-900">
                                                    {order.order_number}
                                                </p>

                                                <p className="text-xs text-gray-400">
                                                    #{order.id}
                                                </p>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4">

                                                <p className="font-medium text-gray-900">
                                                    {order.full_name}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {order.phone_number}
                                                </p>

                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                                                ₹{Number(order.total_amount).toFixed(2)}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                                                        order.status
                                                    )}`}
                                                >
                                                    {order.status}
                                                </span>

                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4">

                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                                    {order.payment_status}
                                                </span>

                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {new Date(
                                                    order.created_at
                                                ).toLocaleDateString()}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-right">

                                                <Link
                                                    to={`/orders/${order.id}`}
                                                    className="font-medium text-violet-600 hover:text-violet-700"
                                                >
                                                    Track order
                                                </Link>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                        {filteredOrders.length === 0 && (
                            <div className="p-10 text-center text-gray-500">
                                No orders match the current search or filter.
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
}