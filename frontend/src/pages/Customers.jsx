import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { getCustomers } from "../api/customers";
import { useNavigate } from "react-router-dom";

function Customers() {
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [customers, setCustomers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const [search, setSearch] =
        useState("");


    useEffect(() => {

        const loadCustomers = async () => {

            try {

                setLoading(true);
                setError(null);

                const data =
                    await getCustomers();

                setCustomers(data);

            } catch (error) {

                console.error(
                    "Failed to load customers:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to load customers"
                );

            } finally {

                setLoading(false);

            }
        };

        loadCustomers();

    }, []);


    const filteredCustomers =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();

            if (!query) {
                return customers;
            }

            return customers.filter(
                (customer) => {

                    const fullName =
                        `${customer.first_name || ""} ${customer.last_name || ""}`
                            .toLowerCase();

                    return (
                        fullName.includes(query) ||
                        (
                            customer.email ||
                            ""
                        )
                            .toLowerCase()
                            .includes(query) ||
                        (
                            customer.phone_number ||
                            ""
                        )
                            .toLowerCase()
                            .includes(query)
                    );
                }
            );

        }, [customers, search]);


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

                        {/* Header */}

                        <div className="mb-7">

                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Customers
                            </h1>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                View and manage your ManMohey customers.
                            </p>

                        </div>


                        {/* Search */}

                        <div className="mb-5">

                            <div className="relative max-w-md">

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search by name, email or phone..."
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                />

                            </div>

                        </div>


                        {/* Loading */}

                        {loading && (

                            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">

                                <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-violet-600" />

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Loading customers...
                                </p>

                            </div>

                        )}


                        {/* Error */}

                        {!loading && error && (

                            <div className="rounded-xl border border-red-200 bg-white p-6 text-sm text-red-600 shadow-sm dark:border-red-900 dark:bg-gray-800">
                                {error}
                            </div>

                        )}


                        {/* Table */}

                        {!loading && !error && (

                            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">

                                <div className="overflow-x-auto">

                                    <table className="w-full text-left text-sm">

                                        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">

                                            <tr>

                                                <th className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">
                                                    Customer
                                                </th>

                                                <th className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">
                                                    Email
                                                </th>

                                                <th className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">
                                                    Phone
                                                </th>

                                                <th className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">
                                                    Age
                                                </th>

                                                <th className="px-5 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">
                                                    Actions
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">

                                            {filteredCustomers.length === 0 ? (

                                                <tr>

                                                    <td
                                                        colSpan="5"
                                                        className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                                                    >
                                                        {search
                                                            ? "No customers match your search."
                                                            : "No customers found."}
                                                    </td>

                                                </tr>

                                            ) : (

                                                filteredCustomers.map(
                                                    (customer) => {

                                                        const fullName =
                                                            `${customer.first_name || ""} ${customer.last_name || ""}`
                                                                .trim();

                                                        return (
                                                            <tr
                                                                key={
                                                                    customer.id
                                                                }
                                                                className="transition hover:bg-gray-50 dark:hover:bg-gray-700/30"
                                                            >

                                                                {/* Customer */}

                                                                <td className="px-5 py-4">

                                                                    <div className="flex items-center gap-3">

                                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                                                                            {(
                                                                                customer.first_name ||
                                                                                "?"
                                                                            )
                                                                                .charAt(
                                                                                    0
                                                                                )
                                                                                .toUpperCase()}
                                                                        </div>

                                                                        <div>

                                                                            <p className="font-medium text-gray-800 dark:text-white">
                                                                                {
                                                                                    fullName ||
                                                                                    "Unnamed Customer"
                                                                                }
                                                                            </p>

                                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                                {customer.id}
                                                                            </p>

                                                                        </div>

                                                                    </div>

                                                                </td>


                                                                {/* Email */}

                                                                <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                                                                    {
                                                                        customer.email ||
                                                                        "—"
                                                                    }
                                                                </td>


                                                                {/* Phone */}

                                                                <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                                                                    {
                                                                        customer.phone_number ||
                                                                        "—"
                                                                    }
                                                                </td>


                                                                {/* Age */}

                                                                <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                                                                    {
                                                                        customer.age ??
                                                                        "—"
                                                                    }
                                                                </td>


                                                                {/* Actions */}

                                                                <td className="px-5 py-4 text-right">

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            navigate(
                                                                                `/customers/${customer.id}`
                                                                            )
                                                                        }
                                                                        className="rounded-md px-3 py-1.5 text-sm font-medium text-violet-600 transition hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-500/10"
                                                                    >
                                                                        View
                                                                    </button>

                                                                </td>

                                                            </tr>
                                                        );
                                                    }
                                                )

                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        )}

                    </div>

                </main>

            </div>

        </div>
    );
}

export default Customers;