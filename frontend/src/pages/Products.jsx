import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../api/categories";
import { getProducts, deleteProduct } from "../api/products";


/* ============================================================
   STATUS CONFIG
   ------------------------------------------------------------
   These are temporary UI values.
   Your current products table does not yet provide status.
   ============================================================ */

const STATUS_LABELS = {
    active: "Active",
    draft: "Draft",
    out_of_stock: "Out of Stock",
    archived: "Archived",
};

const STATUS_STYLES = {
    active:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",

    draft:
        "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",

    out_of_stock:
        "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",

    archived:
        "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
};

/* ============================================================
   CATEGORY NAVIGATION
   ============================================================ */

function CategoryNavigation({
    categories,
    selectedCategory,
    setSelectedCategory,
    expandedCategories,
    setExpandedCategories,
}) {
    /* ----------------------------------------------------------
       Get children from API category data
       ---------------------------------------------------------- */

    const getChildren = (parentId) => {
        return categories
            .filter(
                (category) =>
                    category.parent_id === parentId
            )
            .sort(
                (a, b) =>
                    (a.display_order ?? 0) -
                    (b.display_order ?? 0)
            );
    };

    /* ----------------------------------------------------------
       Parent categories
       ---------------------------------------------------------- */

    const parentCategories = categories
        .filter(
            (category) =>
                category.parent_id === null &&
                category.active !== false
        )
        .sort(
            (a, b) =>
                (a.display_order ?? 0) -
                (b.display_order ?? 0)
        );

    /* ----------------------------------------------------------
       Toggle parent category
       ---------------------------------------------------------- */

    const toggleCategory = (categoryId) => {
        setExpandedCategories((current) => {
            const next = new Set(current);

            if (next.has(categoryId)) {
                next.delete(categoryId);
            } else {
                next.add(categoryId);
            }

            return next;
        });
    };

    /* ----------------------------------------------------------
       Select category
       ---------------------------------------------------------- */

    const selectCategory = (categoryId) => {
        setSelectedCategory(categoryId);

        const children = getChildren(categoryId);

        if (children.length > 0) {
            setExpandedCategories((current) => {
                const next = new Set(current);

                next.add(categoryId);

                return next;
            });
        }
    };

    return (
        <section
            className="mb-6 border-y border-gray-200 py-3 dark:border-gray-700/70"
            aria-label="Product categories"
        >
            {/* ==================================================
                PARENT NAVIGATION
                ================================================== */}

            <div className="flex min-w-max items-center gap-1 overflow-x-auto pb-1">

                {/* All Products */}

                <button
                    type="button"
                    onClick={() =>
                        setSelectedCategory("all")
                    }
                    className={`rounded-md px-3 py-2 text-sm font-medium transition ${selectedCategory === "all"
                        ? "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                        }`}
                >
                    All Products
                </button>

                {/* Parent Categories */}

                {parentCategories.map((category) => {
                    const children = getChildren(
                        category.id
                    );

                    const hasChildren =
                        children.length > 0;

                    const isExpanded =
                        expandedCategories.has(
                            category.id
                        );

                    const isSelected =
                        selectedCategory ===
                        category.id;

                    return (
                        <div
                            key={category.id}
                            className="flex items-center"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    selectCategory(
                                        category.id
                                    )
                                }
                                className={`px-3 py-2 text-sm font-medium transition ${hasChildren
                                    ? "rounded-l-md"
                                    : "rounded-md"
                                    } ${isSelected
                                        ? "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                                    }`}
                            >
                                {category.name}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/categories/${category.id}/filters`
                                    )
                                }
                                className="rounded-md px-3 py-1.5 text-sm font-medium text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-500/10"
                            >
                                Manage Filters
                            </button>

                            
                            {hasChildren && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        toggleCategory(
                                            category.id
                                        )
                                    }
                                    aria-label={`Toggle ${category.name} subcategories`}
                                    aria-expanded={
                                        isExpanded
                                    }
                                    className={`rounded-r-md p-2 transition ${isSelected
                                        ? "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
                                        : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        }`}
                                >
                                    <svg
                                        className={`h-3 w-3 fill-current transition-transform ${isExpanded
                                            ? "rotate-180"
                                            : ""
                                            }`}
                                        viewBox="0 0 12 12"
                                    >
                                        <path d="m6 8.8-4.5-4.5 1.4-1.4L6 6l3.1-3.1 1.4 1.4L6 8.8Z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ==================================================
                CHILD NAVIGATION
                ================================================== */}

            {Array.from(expandedCategories).map(
                (parentId) => {
                    const parent =
                        categories.find(
                            (category) =>
                                category.id ===
                                parentId
                        );

                    const children =
                        getChildren(parentId);

                    if (
                        !parent ||
                        !children.length
                    ) {
                        return null;
                    }

                    return (
                        <div
                            key={parentId}
                            className="mt-3 overflow-x-auto rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800"
                        >
                            <div className="mb-1 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                                {parent.name}
                            </div>

                            <div className="flex min-w-max gap-1">

                                {/* All parent products */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedCategory(
                                            parent.id
                                        )
                                    }
                                    className={`rounded-md px-3 py-2 text-sm transition ${selectedCategory ===
                                        parent.id
                                        ? "bg-violet-50 font-medium text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
                                        : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    All {parent.name}
                                </button>

                                {/* Children */}

                                {children.map(
                                    (child) => (
                                        <button
                                            key={
                                                child.id
                                            }
                                            type="button"
                                            onClick={() =>
                                                setSelectedCategory(
                                                    child.id
                                                )
                                            }
                                            className={`rounded-md px-3 py-2 text-sm transition ${selectedCategory ===
                                                child.id
                                                ? "bg-violet-50 font-medium text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
                                                : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                                                }`}
                                        >
                                            {
                                                child.name
                                            }
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    );
                }
            )}
        </section>
    );
}

/* ============================================================
   STATUS BADGE
   ============================================================ */

function StatusBadge({ status }) {
    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLES[status] ||
                STATUS_STYLES.active
                }`}
        >
            {STATUS_LABELS[status] ||
                STATUS_LABELS.active}
        </span>
    );
}

/* ============================================================
   PRODUCT ACTIONS
   ============================================================ */

function ProductActions({
    productId,
    actionId,
    setActionId,
    onDelete,
}) {
    const isOpen = actionId === productId;
    const navigate = useNavigate();

    return (
        <div className="relative">

            <button
                type="button"
                onClick={() =>
                    setActionId(
                        isOpen
                            ? null
                            : productId
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

                    {[
                        "View",
                        "Edit",
                        "Duplicate",
                        "Delete",
                    ].map((action) => (

                        <button
                            key={action}
                            type="button"
                            onClick={() => {

                                if (action === "Edit") {
                                    setActionId(null);

                                    navigate(
                                        `/products/${productId}/edit`
                                    );

                                    return;
                                }

                                if (action === "Delete") {
                                    onDelete(productId);

                                    return;
                                }

                                setActionId(null);
                            }}
                            className={`block w-full rounded-md px-3 py-2 text-left text-sm transition hover:bg-gray-50 dark:hover:bg-gray-700 ${action === "Delete"
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-gray-600 dark:text-gray-300"
                                }`}
                        >
                            {action}
                        </button>

                    ))}

                </div>
            )}

        </div>
    );
}
/* ============================================================
   PRODUCTS PAGE
   ============================================================ */

function Products() {
    const navigate = useNavigate();
    /* ----------------------------------------------------------
       API DATA
       ---------------------------------------------------------- */
    const [deletingProductId, setDeletingProductId] = useState(null);
    const [categories, setCategories] =
        useState([]);

    const [products, setProducts] =
        useState([]);

    /* ----------------------------------------------------------
       API STATE
       ---------------------------------------------------------- */

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    /* ----------------------------------------------------------
       SIDEBAR
       ---------------------------------------------------------- */

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    /* ----------------------------------------------------------
       CATEGORY STATE
       ---------------------------------------------------------- */

    const [
        selectedCategory,
        setSelectedCategory,
    ] = useState("all");

    const [
        expandedCategories,
        setExpandedCategories,
    ] = useState(new Set());

    /* ----------------------------------------------------------
       FILTER STATE
       ---------------------------------------------------------- */

    const [searchQuery, setSearchQuery] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [sortBy, setSortBy] =
        useState("newest");

    const [actionId, setActionId] =
        useState(null);

    /* ==========================================================
       LOAD PRODUCTS + CATEGORIES
       ========================================================== */

    useEffect(() => {
        async function loadProductsPage() {
            try {
                setLoading(true);
                setError(null);

                const [
                    categoryData,
                    productData,
                ] = await Promise.all([
                    getCategories(),
                    getProducts(),
                ]);

                setCategories(
                    Array.isArray(
                        categoryData
                    )
                        ? categoryData
                        : []
                );

                setProducts(
                    Array.isArray(productData)
                        ? productData
                        : []
                );

                console.log(
                    "Categories:",
                    categoryData
                );

                console.log(
                    "Products:",
                    productData
                );
            } catch (error) {
                console.error(
                    "Failed to load products page:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to load products"
                );
            } finally {
                setLoading(false);
            }
        }

        loadProductsPage();
    }, []);

    /* ==========================================================
       CATEGORY HELPERS
       ========================================================== */

    const getCategoryById = (id) => {
        return categories.find(
            (category) =>
                category.id === id
        );
    };

    const getChildren = (parentId) => {
        return categories
            .filter(
                (category) =>
                    category.parent_id ===
                    parentId
            )
            .sort(
                (a, b) =>
                    (a.display_order ?? 0) -
                    (b.display_order ?? 0)
            );
    };

    /* ----------------------------------------------------------
       Get all descendants recursively
       ---------------------------------------------------------- */

    const getDescendantIds = (
        categoryId
    ) => {
        const children =
            getChildren(categoryId);

        return [
            categoryId,
            ...children.flatMap(
                (child) =>
                    getDescendantIds(
                        child.id
                    )
            ),
        ];
    };

    /* ==========================================================
       SELECTED CATEGORY
       ========================================================== */

    const selectedCategoryData =
        selectedCategory === "all"
            ? {
                id: "all",
                name: "All Products",
            }
            : getCategoryById(
                selectedCategory
            );

    /* ==========================================================
       FILTER PRODUCTS
       ========================================================== */

    const displayedProducts = useMemo(() => {
        let result = [...products];

        /* ------------------------------------------------------
           Category
           ------------------------------------------------------ */

        if (
            selectedCategory !== "all"
        ) {
            const categoryIds =
                getDescendantIds(
                    selectedCategory
                );

            result = result.filter(
                (product) =>
                    categoryIds.includes(
                        Number(
                            product.category_id
                        )
                    )
            );
        }

        /* ------------------------------------------------------
           Search
           ------------------------------------------------------ */

        const query =
            searchQuery
                .trim()
                .toLowerCase();

        if (query) {
            result = result.filter(
                (product) =>
                    String(
                        product.name || ""
                    )
                        .toLowerCase()
                        .includes(query) ||
                    String(
                        product.slug || ""
                    )
                        .toLowerCase()
                        .includes(query)
            );
        }

        /* ------------------------------------------------------
           Status

           Status is not currently in your DB schema.
           This is kept ready for when it is added.
           ------------------------------------------------------ */

        if (
            statusFilter !== "all"
        ) {
            result = result.filter(
                (product) =>
                    product.status ===
                    statusFilter
            );
        }

        /* ------------------------------------------------------
           Sort
           ------------------------------------------------------ */

        result.sort((a, b) => {
            switch (sortBy) {
                case "name-asc":
                    return String(
                        a.name || ""
                    ).localeCompare(
                        String(
                            b.name || ""
                        )
                    );

                case "name-desc":
                    return String(
                        b.name || ""
                    ).localeCompare(
                        String(
                            a.name || ""
                        )
                    );

                case "price-asc":
                    return (
                        Number(
                            a.price || 0
                        ) -
                        Number(
                            b.price || 0
                        )
                    );

                case "price-desc":
                    return (
                        Number(
                            b.price || 0
                        ) -
                        Number(
                            a.price || 0
                        )
                    );

                case "oldest":
                    return (
                        new Date(
                            a.created_at ||
                            0
                        ) -
                        new Date(
                            b.created_at ||
                            0
                        )
                    );

                case "newest":
                default:
                    return (
                        new Date(
                            b.created_at ||
                            0
                        ) -
                        new Date(
                            a.created_at ||
                            0
                        )
                    );
            }
        });

        return result;
    }, [
        products,
        categories,
        selectedCategory,
        searchQuery,
        statusFilter,
        sortBy,
    ]);

    /* ==========================================================
       RESET FILTERS
       ========================================================== */

    const resetFilters = () => {
        setSelectedCategory("all");
        setSearchQuery("");
        setStatusFilter("all");
        setSortBy("newest");
    };

    /* ==========================================================
       FORMAT MONEY
       ========================================================== */

    const formatMoney = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "—";
        }

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }
        ).format(Number(value));
    };

    /* ==========================================================
       CATEGORY NAME
       ========================================================== */

    const getProductCategoryName = (
        categoryId
    ) => {
        return (
            getCategoryById(
                Number(categoryId)
            )?.name ||
            "Uncategorized"
        );
    };

    /* ==========================================================
       UPDATED LABEL
       ========================================================== */

    const getUpdatedLabel = (
        product
    ) => {
        const date =
            product.updated_at ||
            product.created_at;

        if (!date) {
            return "—";
        }

        const updated =
            new Date(date);

        if (
            Number.isNaN(
                updated.getTime()
            )
        ) {
            return "—";
        }

        const today = new Date();

        const difference = Math.floor(
            (
                new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate()
                ) -
                new Date(
                    updated.getFullYear(),
                    updated.getMonth(),
                    updated.getDate()
                )
            ) /
            86400000
        );

        if (difference === 0) {
            return "Today";
        }

        if (difference === 1) {
            return "Yesterday";
        }

        if (difference > 1) {
            return `${difference} days ago`;
        }

        return "—";
    };

    /* ==========================================================
       LOADING STATE
       ========================================================== */

    if (loading) {
        return (
            <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">

                <Sidebar
                    sidebarOpen={
                        sidebarOpen
                    }
                    setSidebarOpen={
                        setSidebarOpen
                    }
                />

                <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto">

                    <Header
                        sidebarOpen={
                            sidebarOpen
                        }
                        setSidebarOpen={
                            setSidebarOpen
                        }
                    />

                    <main className="grow">
                        <div className="mx-auto w-full max-w-9xl px-4 py-7 sm:px-6 lg:px-8 lg:py-8">

                            <div className="mb-7">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Products
                                </h1>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Manage your ManMohey
                                    product catalog
                                </p>
                            </div>

                            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">

                                <div className="text-center">

                                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-violet-600 dark:border-gray-700 dark:border-t-violet-400" />

                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Loading products...
                                    </p>

                                </div>

                            </div>

                        </div>
                    </main>
                </div>
            </div>
        );
    }

    /* ==========================================================
       ERROR STATE
       ========================================================== */

    if (error) {
        return (
            <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">

                <Sidebar
                    sidebarOpen={
                        sidebarOpen
                    }
                    setSidebarOpen={
                        setSidebarOpen
                    }
                />

                <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto">

                    <Header
                        sidebarOpen={
                            sidebarOpen
                        }
                        setSidebarOpen={
                            setSidebarOpen
                        }
                    />

                    <main className="grow">
                        <div className="mx-auto w-full max-w-9xl px-4 py-7 sm:px-6 lg:px-8 lg:py-8">

                            <div className="mb-7">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Products
                                </h1>
                            </div>

                            <div className="rounded-lg border border-red-200 bg-white p-8 text-center dark:border-red-900/50 dark:bg-gray-800">

                                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10">
                                    !
                                </div>

                                <h3 className="font-semibold text-gray-800 dark:text-white">
                                    Failed to load products
                                </h3>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {error}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        window.location.reload()
                                    }
                                    className="mt-5 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
                                >
                                    Try Again
                                </button>

                            </div>

                        </div>
                    </main>
                </div>
            </div>
        );
    }

    /* ==========================================================
       DELETE PRODUCTS
       ========================================================== */
    const handleDeleteProduct = async (productId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingProductId(productId);

            await deleteProduct(productId);

            // Remove product from current UI
            setProducts((current) =>
                current.filter(
                    (product) =>
                        product.id !== productId
                )
            );

            // Close action menu
            setActionId(null);

        } catch (error) {

            console.error(
                "Failed to delete product:",
                error
            );

            alert(
                error.message ||
                "Failed to delete product"
            );

        } finally {

            setDeletingProductId(null);
        }
    };

    /* ==========================================================
       MAIN RENDER
       ========================================================== */

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">

            {/* Sidebar */}

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

                <main className="grow">

                    <div className="mx-auto w-full max-w-9xl px-4 py-7 sm:px-6 lg:px-8 lg:py-8">

                        {/* ==================================================
                            PAGE HEADER
                            ================================================== */}

                        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    Products
                                </h1>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Manage your ManMohey
                                    product catalog
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate("/add-product")}
                                className="btn bg-violet-600 text-white shadow-sm hover:bg-violet-700 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                            >
                                <span className="mr-1 text-lg leading-none">
                                    +
                                </span>
                                Add Product
                            </button>

                        </div>

                        {/* ==================================================
                            CATEGORY NAVIGATION
                            ================================================== */}

                        <CategoryNavigation
                            categories={
                                categories
                            }
                            selectedCategory={
                                selectedCategory
                            }
                            setSelectedCategory={
                                setSelectedCategory
                            }
                            expandedCategories={
                                expandedCategories
                            }
                            setExpandedCategories={
                                setExpandedCategories
                            }
                        />

                        {/* ==================================================
                            SELECTED CATEGORY
                            ================================================== */}

                        <section className="mb-5">

                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {
                                    selectedCategoryData?.name
                                }
                            </h2>

                            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                {
                                    displayedProducts.length
                                }{" "}
                                {
                                    displayedProducts.length ===
                                        1
                                        ? "product"
                                        : "products"
                                }
                            </p>

                        </section>

                        {/* ==================================================
                            PRODUCTS CONTAINER
                            ================================================== */}

                        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">

                            {/* ==================================================
                                TOOLBAR
                                ================================================== */}

                            <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center dark:border-gray-700">

                                {/* Search */}

                                <label className="relative block flex-1">

                                    <span className="sr-only">
                                        Search products
                                    </span>

                                    <svg
                                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-current text-gray-400"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M7 14A7 7 0 1 1 7 0a7 7 0 0 1 0 14Zm0-12a5 5 0 1 0 0 10A5 5 0 0 0 7 2Zm6.6 10.2 2.1 2.1-1.4 1.4-2.1-2.1-1.4 1.4Z" />
                                    </svg>

                                    <input
                                        value={
                                            searchQuery
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setSearchQuery(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="form-input w-full py-2 pl-9 text-sm focus:border-violet-500 focus:ring-violet-500 dark:border-gray-700 dark:bg-gray-900"
                                        placeholder="Search products..."
                                    />

                                </label>

                                {/* Filters */}

                                <div className="flex flex-wrap gap-2">

                                    <select
                                        value={
                                            statusFilter
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setStatusFilter(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="form-select min-w-32 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                                    >
                                        <option value="all">
                                            All Status
                                        </option>

                                        <option value="active">
                                            Active
                                        </option>

                                        <option value="draft">
                                            Draft
                                        </option>

                                        <option value="out_of_stock">
                                            Out of Stock
                                        </option>

                                        <option value="archived">
                                            Archived
                                        </option>
                                    </select>

                                    <select
                                        value={
                                            sortBy
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setSortBy(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="form-select min-w-40 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                                    >
                                        <option value="newest">
                                            Newest
                                        </option>

                                        <option value="oldest">
                                            Oldest
                                        </option>

                                        <option value="name-asc">
                                            Name: A-Z
                                        </option>

                                        <option value="name-desc">
                                            Name: Z-A
                                        </option>

                                        <option value="price-asc">
                                            Price: Low to High
                                        </option>

                                        <option value="price-desc">
                                            Price: High to Low
                                        </option>
                                    </select>

                                </div>
                            </div>

                            {/* ==================================================
                                EMPTY STATE
                                ================================================== */}

                            {displayedProducts.length ===
                                0 ? (
                                <div className="px-6 py-16 text-center">

                                    <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-700">
                                        <svg
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM2 8a6 6 0 1 1 10.89 3.476l4.817 4.817-1.414 1.414-4.817-4.817A6 6 0 0 1 2 8Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>

                                    <h3 className="font-semibold text-gray-800 dark:text-white">
                                        No products found
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Try adjusting your
                                        search or filters.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={
                                            resetFilters
                                        }
                                        className="mt-4 text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400"
                                    >
                                        Reset filters
                                    </button>

                                </div>
                            ) : (

                                /* ==================================================
                                    PRODUCT TABLE
                                    ================================================== */

                                <div className="overflow-x-auto">

                                    <table className="w-full min-w-[1000px] text-left text-sm">

                                        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-400">

                                            <tr>

                                                <th className="whitespace-nowrap px-5 py-3 font-semibold">
                                                    Product
                                                </th>

                                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                                    Category
                                                </th>

                                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                                    Price
                                                </th>

                                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                                    Sale Price
                                                </th>

                                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                                    Stock
                                                </th>

                                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                                    Status
                                                </th>

                                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                                    Updated
                                                </th>

                                                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                                                    Actions
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/70">

                                            {displayedProducts.map(
                                                (
                                                    product
                                                ) => {
                                                    const stock =
                                                        product.stock;

                                                    const stockClass =
                                                        stock ===
                                                            undefined
                                                            ? "text-gray-500 dark:text-gray-400"
                                                            : stock ===
                                                                0
                                                                ? "text-red-600 dark:text-red-400"
                                                                : stock <=
                                                                    5
                                                                    ? "text-amber-600 dark:text-amber-400"
                                                                    : "text-gray-700 dark:text-gray-200";

                                                    return (
                                                        <tr
                                                            key={
                                                                product.id
                                                            }
                                                            className="transition hover:bg-gray-50/80 dark:hover:bg-gray-700/30"
                                                        >

                                                            {/* Product */}

                                                            <td className="px-5 py-3.5">

                                                                <div className="flex items-center gap-3">

                                                                    {product.image ? (
                                                                        <img
                                                                            src={
                                                                                product.image
                                                                            }
                                                                            alt={
                                                                                product.name
                                                                            }
                                                                            className="h-10 w-10 rounded-md bg-gray-100 object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-violet-50 text-xs font-semibold text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                                                                            {String(
                                                                                product.name ||
                                                                                "P"
                                                                            )
                                                                                .charAt(
                                                                                    0
                                                                                )
                                                                                .toUpperCase()}
                                                                        </div>
                                                                    )}

                                                                    <div>

                                                                        <div className="font-medium text-gray-800 dark:text-white">
                                                                            {
                                                                                product.name
                                                                            }
                                                                        </div>

                                                                        <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                                            {
                                                                                product.slug
                                                                            }
                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            </td>

                                                            {/* Category */}

                                                            <td className="whitespace-nowrap px-4 py-3.5 text-gray-600 dark:text-gray-300">
                                                                {getProductCategoryName(
                                                                    product.category_id
                                                                )}
                                                            </td>

                                                            {/* Price */}

                                                            <td className="whitespace-nowrap px-4 py-3.5 font-medium text-gray-700 dark:text-gray-200">
                                                                {formatMoney(
                                                                    product.price
                                                                )}
                                                            </td>

                                                            {/* Sale Price */}

                                                            <td className="whitespace-nowrap px-4 py-3.5 text-gray-600 dark:text-gray-300">
                                                                {formatMoney(
                                                                    product.sale_price
                                                                )}
                                                            </td>

                                                            {/* Stock */}

                                                            <td
                                                                className={`whitespace-nowrap px-4 py-3.5 font-medium ${stockClass}`}
                                                            >
                                                                {stock ===
                                                                    undefined
                                                                    ? "—"
                                                                    : stock ===
                                                                        0
                                                                        ? "Out of stock"
                                                                        : stock}
                                                            </td>

                                                            {/* Status */}

                                                            <td className="whitespace-nowrap px-4 py-3.5">

                                                                <StatusBadge
                                                                    status={
                                                                        product.status ||
                                                                        "active"
                                                                    }
                                                                />

                                                            </td>

                                                            {/* Updated */}

                                                            <td className="whitespace-nowrap px-4 py-3.5 text-gray-500 dark:text-gray-400">
                                                                {getUpdatedLabel(
                                                                    product
                                                                )}
                                                            </td>

                                                            {/* Actions */}

                                                            <td className="px-4 py-3.5">

                                                                <ProductActions
                                                                    productId={
                                                                        product.id
                                                                    }
                                                                    actionId={
                                                                        actionId
                                                                    }
                                                                    setActionId={
                                                                        setActionId
                                                                    }
                                                                    onDelete={
                                                                        handleDeleteProduct
                                                                    }
                                                                />

                                                            </td>

                                                        </tr>
                                                    );
                                                }
                                            )}

                                        </tbody>

                                    </table>

                                </div>
                            )}
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Products;