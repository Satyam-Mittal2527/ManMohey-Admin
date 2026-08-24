import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../api/categories";


function Categories() {

    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [categories, setCategories] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const [isCreateOpen, setIsCreateOpen] =
        useState(false);

    const [isCreating, setIsCreating] =
        useState(false);

    const [formData, setFormData] =
        useState({
            name: "",
            slug: "",
            parent_id: null,
            display_order: 0,
            active: true,
        });

    const [editingCategory, setEditingCategory] =
        useState(null);

    useEffect(() => {


        const loadCategories = async () => {

            try {

                setLoading(true);
                setError(null);

                const data =
                    await getCategories();

                setCategories(data);

            } catch (error) {

                console.error(
                    "Failed to load categories:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to load categories"
                );

            } finally {

                setLoading(false);

            }
        };

        loadCategories();

    }, []);

    const handleDeleteCategory = async (
        category
    ) => {

        const confirmed = window.confirm(
            `Deactivate "${category.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteCategory(
                category.id
            );

            setCategories(
                (current) =>
                    current.map(
                        (item) =>
                            item.id === category.id
                                ? {
                                    ...item,
                                    active: false,
                                }
                                : item
                    )
            );

        } catch (error) {

            console.error(
                "Failed to deactivate category:",
                error
            );

            alert(
                error.message ||
                "Failed to deactivate category"
            );
        }
    };
    const handleEditCategory = async (
        event
    ) => {

        event.preventDefault();

        try {

            setIsCreating(true);

            const updatedCategory =
                await updateCategory(
                    editingCategory.id,
                    {
                        name: formData.name,
                        slug: formData.slug,
                        parent_id:
                            formData.parent_id
                                ? Number(
                                    formData.parent_id
                                )
                                : null,
                        display_order:
                            Number(
                                formData.display_order
                            ),
                        active:
                            formData.active,
                    }
                );

            setCategories(
                (current) =>
                    current.map(
                        (category) =>
                            category.id ===
                                updatedCategory.id
                                ? updatedCategory
                                : category
                    )
            );

            setEditingCategory(null);
            setIsCreateOpen(false);

        } catch (error) {

            console.error(
                "Failed to update category:",
                error
            );

            alert(
                error.message ||
                "Failed to update category"
            );

        } finally {

            setIsCreating(false);

        }
    };

    const handleCreateCategory = async (
        event
    ) => {

        event.preventDefault();

        try {

            setIsCreating(true);

            const newCategory =
                await createCategory({
                    name: formData.name,
                    slug: formData.slug,
                    parent_id:
                        formData.parent_id
                            ? Number(
                                formData.parent_id
                            )
                            : null,
                    display_order:
                        Number(
                            formData.display_order
                        ),
                    active:
                        formData.active,
                });

            setCategories((current) => [
                ...current,
                newCategory,
            ]);

            setFormData({
                name: "",
                slug: "",
                parent_id: null,
                display_order: 0,
                active: true,
            });

            setIsCreateOpen(false);

        } catch (error) {

            console.error(
                "Failed to create category:",
                error
            );

            alert(
                error.message ||
                "Failed to create category"
            );

        } finally {

            setIsCreating(false);

        }
    };

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

                        {/* Page Header */}

                        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Categories
                                </h1>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Manage your product categories and filters.
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setIsCreateOpen(true)
                                }
                                className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700"
                            >
                                + Add Category
                            </button>

                        </div>


                        {/* Loading */}

                        {loading && (

                            <div className="rounded-lg border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">

                                <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-violet-600" />

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Loading categories...
                                </p>

                            </div>

                        )}


                        {/* Error */}

                        {!loading && error && (

                            <div className="rounded-lg border border-red-200 bg-white p-6 text-sm text-red-600 shadow-sm dark:border-red-900 dark:bg-gray-800">
                                {error}
                            </div>

                        )}


                        {/* Categories */}

                        {!loading && !error && (

                            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">

                                <div className="overflow-x-auto">

                                    <table className="w-full text-left text-sm">

                                        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">

                                            <tr>

                                                <th className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">
                                                    Category
                                                </th>

                                                <th className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">
                                                    Parent
                                                </th>

                                                <th className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">
                                                    Order
                                                </th>

                                                <th className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">
                                                    Status
                                                </th>

                                                <th className="px-5 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">
                                                    Actions
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">

                                            {categories.length === 0 ? (

                                                <tr>

                                                    <td
                                                        colSpan="5"
                                                        className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                                                    >
                                                        No categories found.
                                                    </td>

                                                </tr>

                                            ) : (

                                                categories.map(
                                                    (category) => {

                                                        const parent =
                                                            categories.find(
                                                                (item) =>
                                                                    item.id ===
                                                                    category.parent_id
                                                            );

                                                        return (
                                                            <tr
                                                                key={
                                                                    category.id
                                                                }
                                                                className="transition hover:bg-gray-50 dark:hover:bg-gray-700/30"
                                                            >

                                                                <td className="px-5 py-4">

                                                                    <div>

                                                                        <p className="font-medium text-gray-800 dark:text-white">
                                                                            {
                                                                                category.name
                                                                            }
                                                                        </p>

                                                                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                                            {
                                                                                category.slug
                                                                            }
                                                                        </p>

                                                                    </div>

                                                                </td>


                                                                <td className="px-5 py-4 text-gray-600 dark:text-gray-300">

                                                                    {parent
                                                                        ? parent.name
                                                                        : "—"}

                                                                </td>


                                                                <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                                                                    {
                                                                        category.display_order
                                                                    }
                                                                </td>


                                                                <td className="px-5 py-4">

                                                                    <span
                                                                        className={
                                                                            category.active
                                                                                ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                                                                                : "rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
                                                                        }
                                                                    >
                                                                        {category.active
                                                                            ? "Active"
                                                                            : "Inactive"}
                                                                    </span>

                                                                </td>


                                                                <td className="px-5 py-4">

                                                                    <div className="flex justify-end gap-2">

                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {

                                                                                setEditingCategory(
                                                                                    category
                                                                                );

                                                                                setFormData({
                                                                                    name:
                                                                                        category.name || "",
                                                                                    slug:
                                                                                        category.slug || "",
                                                                                    parent_id:
                                                                                        category.parent_id ??
                                                                                        null,
                                                                                    display_order:
                                                                                        category.display_order ??
                                                                                        0,
                                                                                    active:
                                                                                        category.active ??
                                                                                        true,
                                                                                });

                                                                                setIsCreateOpen(true);
                                                                            }}
                                                                            className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                                                        >
                                                                            Edit
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

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleDeleteCategory(
                                                                                    category
                                                                                )
                                                                            }
                                                                            disabled={!category.active}
                                                                            className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-red-400 dark:hover:bg-red-500/10"
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>

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
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

                    <div className="w-full max-w-md rounded-xl bg-white shadow-xl dark:bg-gray-800">

                        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">

                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {editingCategory
                                    ? "Edit Category"
                                    : "Add Category"}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Create a new product category.
                            </p>

                        </div>

                        <form
                            onSubmit={
                                editingCategory
                                    ? handleEditCategory
                                    : handleCreateCategory
                            }
                        >

                            {/* Name */}

                            <div>

                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(event) =>
                                        setFormData({
                                            ...formData,
                                            name:
                                                event.target.value,
                                        })
                                    }
                                    placeholder="e.g. Cotton Kurtis"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                                />

                            </div>


                            {/* Slug */}

                            <div>

                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Slug
                                </label>

                                <input
                                    type="text"
                                    required
                                    value={formData.slug}
                                    onChange={(event) =>
                                        setFormData({
                                            ...formData,
                                            slug:
                                                event.target.value,
                                        })
                                    }
                                    placeholder="e.g. cotton-kurtis"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                                />

                            </div>


                            {/* Parent */}

                            <div>

                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Parent Category
                                </label>

                                <select
                                    value={
                                        formData.parent_id ??
                                        ""
                                    }
                                    onChange={(event) =>
                                        setFormData({
                                            ...formData,
                                            parent_id:
                                                event.target.value
                                                    ? Number(
                                                        event.target.value
                                                    )
                                                    : null,
                                        })
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                                >

                                    <option value="">
                                        No Parent
                                    </option>

                                    {categories.map(
                                        (category) => (
                                            <option
                                                key={
                                                    category.id
                                                }
                                                value={
                                                    category.id
                                                }
                                            >
                                                {
                                                    category.name
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>


                            {/* Display Order */}

                            <div>

                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Display Order
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    value={
                                        formData.display_order
                                    }
                                    onChange={(event) =>
                                        setFormData({
                                            ...formData,
                                            display_order:
                                                Number(
                                                    event.target.value
                                                ),
                                        })
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                                />

                            </div>


                            {/* Active */}

                            <label className="flex cursor-pointer items-center gap-3">

                                <input
                                    type="checkbox"
                                    checked={
                                        formData.active
                                    }
                                    onChange={(event) =>
                                        setFormData({
                                            ...formData,
                                            active:
                                                event.target
                                                    .checked,
                                        })
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                                />

                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Active
                                </span>

                            </label>


                            {/* Actions */}

                            <div className="flex justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsCreateOpen(
                                            false
                                        )
                                    }
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isCreating
                                        ? "Saving..."
                                        : editingCategory
                                            ? "Save Changes"
                                            : "Create Category"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}
        </div>
    );
}

export default Categories;