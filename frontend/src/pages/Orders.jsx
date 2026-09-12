"use client";

import { useEffect, useState } from "react";
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

    useEffect(() => {
        const loadOrders = async () => {
            try {
                setLoading(true);

                const response = await getOrders();

                setOrders(response.data || []);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                setError(error.message || "Failed to load orders");
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

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

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Orders
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage customer orders and payments.
                        </p>
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

                                    {orders.map((order) => (

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
                                                    View
                                                </Link>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                        {orders.length === 0 && (
                            <div className="p-10 text-center text-gray-500">
                                No orders found.
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
}