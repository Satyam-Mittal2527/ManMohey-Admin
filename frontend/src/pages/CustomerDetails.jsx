import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";

import { getCustomerById } from "../api/customers";


function CustomerDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [customer, setCustomer] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    useEffect(() => {

        const loadCustomer = async () => {

            try {

                setLoading(true);
                setError(null);

                const data =
                    await getCustomerById(id);

                setCustomer(data);

            } catch (error) {

                console.error(
                    "Failed to load customer:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to load customer"
                );

            } finally {

                setLoading(false);

            }
        };

        loadCustomer();

    }, [id]);


    const fullName =
        customer
            ? `${customer.first_name || ""} ${customer.last_name || ""}`.trim()
            : "";


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

                <main className="grow">

                    <div className="mx-auto w-full max-w-9xl px-4 py-7 sm:px-6 lg:px-8 lg:py-8">

                        {/* Back */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/customers")
                            }
                            className="mb-5 text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400"
                        >
                            ← Back to Customers
                        </button>


                        {/* Loading */}

                        {loading && (

                            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">

                                <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-violet-600" />

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Loading customer...
                                </p>

                            </div>

                        )}


                        {/* Error */}

                        {!loading && error && (

                            <div className="rounded-xl border border-red-200 bg-white p-6 text-sm text-red-600 shadow-sm dark:border-red-900 dark:bg-gray-800">
                                {error}
                            </div>

                        )}


                        {!loading && !error && customer && (

                            <>
                                {/* Header */}

                                <div className="mb-7 flex items-center gap-4">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-xl font-semibold text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                                        {(customer.first_name || "?")
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div>

                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {fullName ||
                                                "Unnamed Customer"}
                                        </h1>

                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            {customer.email ||
                                                "No email"}
                                        </p>

                                    </div>

                                </div>


                                {/* Customer Information */}

                                <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">

                                    <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">

                                        <h2 className="font-semibold text-gray-900 dark:text-white">
                                            Customer Information
                                        </h2>

                                    </div>


                                    <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                First Name
                                            </p>

                                            <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                                                {customer.first_name ||
                                                    "—"}
                                            </p>
                                        </div>


                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Last Name
                                            </p>

                                            <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                                                {customer.last_name ||
                                                    "—"}
                                            </p>
                                        </div>


                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Age
                                            </p>

                                            <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                                                {customer.age ??
                                                    "—"}
                                            </p>
                                        </div>


                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Email
                                            </p>

                                            <p className="mt-1 break-all text-sm text-gray-800 dark:text-gray-200">
                                                {customer.email ||
                                                    "—"}
                                            </p>
                                        </div>


                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Phone
                                            </p>

                                            <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                                                {customer.phone_number ||
                                                    "—"}
                                            </p>
                                        </div>


                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Customer ID
                                            </p>

                                            <p className="mt-1 break-all text-xs text-gray-600 dark:text-gray-400">
                                                {customer.id}
                                            </p>
                                        </div>

                                    </div>

                                </div>


                                {/* Orders Placeholder */}

                                <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">

                                    <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">

                                        <h2 className="font-semibold text-gray-900 dark:text-white">
                                            Order History
                                        </h2>

                                    </div>

                                    <div className="px-6 py-12 text-center">

                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            No orders available
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            Order history will appear here once the ManMohey order system is implemented.
                                        </p>

                                    </div>

                                </div>

                            </>

                        )}

                    </div>

                </main>

            </div>

        </div>
    );
}

export default CustomerDetails;