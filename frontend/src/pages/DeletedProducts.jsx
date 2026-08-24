import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";

import {
    getDeletedProducts,
    restoreProduct,
} from "../api/products";


function DeletedProductActions({
    productId,
    onRestore,
}) {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] =
        useState(false);
    /* ----------------------------------------------------------
           SIDEBAR
           ---------------------------------------------------------- */



    return (

        <div className="relative">

            <button
                type="button"
                onClick={() =>
                    setIsOpen(
                        (current) =>
                            !current
                    )
                }
                className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                aria-label="Product actions"
            >
                <svg
                    className="h-5 w-5 fill-current"
                    viewBox="0 0 20 20"
                >
                    <circle
                        cx="4"
                        cy="10"
                        r="1.5"
                    />
                    <circle
                        cx="10"
                        cy="10"
                        r="1.5"
                    />
                    <circle
                        cx="16"
                        cy="10"
                        r="1.5"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-9 z-30 w-36 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">

                    <button
                        type="button"
                        onClick={() => {
                            setIsOpen(false);

                            navigate(
                                `/products/${productId}/edit`
                            );
                        }}
                        className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-600 transition hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        View
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setIsOpen(false);

                            onRestore(
                                productId
                            );
                        }}
                        className="block w-full rounded-md px-3 py-2 text-left text-sm text-green-600 transition hover:bg-gray-50 dark:text-green-400 dark:hover:bg-gray-700"
                    >
                        Restore
                    </button>

                </div>
            )}
        </div>
    );
}


export default function DeletedProducts() {

    const [products, setProducts] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const [restoringProductId, setRestoringProductId] =
        useState(null);

    const [sidebarOpen, setSidebarOpen] =
        useState(false);


    // ========================================================
    // Load deleted products
    // ========================================================

    const loadDeletedProducts = async () => {

        try {

            setLoading(true);
            setError(null);

            const response =
                await getDeletedProducts();

            setProducts(
                response.data || []
            );

        } catch (error) {

            console.error(
                "Failed to load deleted products:",
                error
            );

            setError(
                error.message ||
                "Failed to load deleted products"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadDeletedProducts();
    }, []);


    // ========================================================
    // Restore product
    // ========================================================

    const handleRestoreProduct = async (
        productId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to restore this product?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setRestoringProductId(
                productId
            );

            await restoreProduct(
                productId
            );

            setProducts((current) =>
                current.filter(
                    (product) =>
                        product.id !==
                        productId
                )
            );

        } catch (error) {

            console.error(
                "Failed to restore product:",
                error
            );

            alert(
                error.message ||
                "Failed to restore product"
            );

        } finally {

            setRestoringProductId(null);

        }
    };


    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900" >
            <Sidebar
                sidebarOpen={
                    sidebarOpen
                }
                setSidebarOpen={
                    setSidebarOpen
                }
            />

            <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto">

                {/* Header */}

                <Header
                    sidebarOpen={
                        sidebarOpen
                    }
                    setSidebarOpen={
                        setSidebarOpen
                    }
                />

                <div className="mb-8">

                    <div className="mb-1 flex items-center gap-3">

                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Deleted Products
                        </h1>

                        <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
                            {products.length}
                        </span>

                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Products that are currently
                        removed from the active catalog
                    </p>

                </div>


                {/* ================================================= */}
                {/* ERROR                                             */}
                {/* ================================================= */}

                {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                        {error}
                    </div>
                )}


                {/* ================================================= */}
                {/* TABLE                                             */}
                {/* ================================================= */}

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">

                    {loading ? (

                        <div className="flex h-64 items-center justify-center">

                            <div className="flex items-center gap-3 text-sm text-gray-500">

                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-violet-600" />

                                Loading deleted products...

                            </div>

                        </div>

                    ) : products.length === 0 ? (

                        <div className="flex h-64 flex-col items-center justify-center">

                            <div className="mb-3 rounded-full bg-gray-100 p-4 dark:bg-gray-700">

                                <svg
                                    className="h-6 w-6 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M5 12h14"
                                    />
                                </svg>

                            </div>

                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                No deleted products
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                Deleted products will appear here
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[800px]">

                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40">

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Product
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Category
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Price
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Stock
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Actions
                                        </th>

                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">

                                    {products.map(
                                        (product) => (

                                            <tr
                                                key={product.id}
                                                className="transition hover:bg-gray-50 dark:hover:bg-gray-700/30"
                                            >

                                                {/* Product */}

                                                <td className="px-6 py-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">

                                                            {product.image ? (
                                                                <img
                                                                    src={
                                                                        product.image
                                                                    }
                                                                    alt={
                                                                        product.name
                                                                    }
                                                                    className="h-full w-full object-cover opacity-70"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                                                    No image
                                                                </div>
                                                            )}

                                                        </div>

                                                        <div>

                                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                                                {
                                                                    product.name
                                                                }
                                                            </p>

                                                            <p className="text-xs text-gray-400">
                                                                ID:{" "}
                                                                {
                                                                    product.id
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* Category */}

                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">

                                                    {
                                                        product
                                                            .categories
                                                            ?.name ||
                                                        "—"
                                                    }

                                                </td>


                                                {/* Price */}

                                                <td className="px-6 py-4">

                                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                                        ₹
                                                        {
                                                            product.price
                                                        }
                                                    </span>

                                                </td>


                                                {/* Stock */}

                                                <td className="px-6 py-4">

                                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                                        {
                                                            product.stock
                                                        }
                                                    </span>

                                                </td>


                                                {/* Actions */}

                                                <td className="px-6 py-4 text-right">

                                                    <DeletedProductActions
                                                        productId={
                                                            product.id
                                                        }
                                                        onRestore={
                                                            handleRestoreProduct
                                                        }
                                                    />

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>
        </div>
    );
}