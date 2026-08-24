import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";

import {
    getCategoryFilters,
    updateCategoryFilters,
    getFilterGroups,
    getFilterOptionsByGroup,
} from "../api/filters";


function CategoryFilters() {

    const { categoryId } = useParams();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [filterGroups, setFilterGroups] =
        useState([]);

    const [selectedOptions, setSelectedOptions] =
        useState(new Set());

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState(null);


    useEffect(() => {

        const loadFilters = async () => {

            try {

                setLoading(true);
                setError(null);

                /*
                 * Get:
                 * 1. All filter groups
                 * 2. Currently assigned filters
                 */

                const [
                    groups,
                    assignedGroups,
                ] = await Promise.all([
                    getFilterGroups(),
                    getCategoryFilters(
                        categoryId
                    ),
                ]);


                /*
                 * Fetch options for every group.
                 */

                const groupsWithOptions =
                    await Promise.all(
                        groups.map(
                            async (group) => {

                                const options =
                                    await getFilterOptionsByGroup(
                                        group.id
                                    );

                                return {
                                    ...group,
                                    options,
                                };
                            }
                        )
                    );


                /*
                 * Find which options are
                 * already assigned to category.
                 */

                const assignedIds =
                    new Set();

                assignedGroups.forEach(
                    (group) => {

                        (group.options || []).forEach(
                            (option) => {

                                assignedIds.add(
                                    option.id
                                );

                            }
                        );

                    }
                );


                setFilterGroups(
                    groupsWithOptions
                );

                setSelectedOptions(
                    assignedIds
                );

            } catch (error) {

                console.error(
                    "Failed to load category filters:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to load category filters"
                );

            } finally {

                setLoading(false);

            }
        };

        loadFilters();

    }, [categoryId]);


    const toggleOption = (
        optionId
    ) => {

        setSelectedOptions(
            (current) => {

                const updated =
                    new Set(current);

                if (
                    updated.has(optionId)
                ) {

                    updated.delete(optionId);

                } else {

                    updated.add(optionId);

                }

                return updated;
            }
        );
    };


    const handleSave = async () => {

        try {

            setSaving(true);

            await updateCategoryFilters(
                categoryId,
                Array.from(selectedOptions)
            );

            alert(
                "Category filters updated successfully"
            );

        } catch (error) {

            console.error(
                "Failed to update category filters:",
                error
            );

            alert(
                error.message ||
                "Failed to update category filters"
            );

        } finally {

            setSaving(false);

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

                    <div className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 lg:px-8 lg:py-8">

                        {/* Header */}

                        <div className="mb-7">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/filter-groups"
                                    )
                                }
                                className="mb-4 text-sm font-medium text-violet-600 hover:text-violet-700"
                            >
                                ← Back
                            </button>

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                                <div>

                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Category Filters
                                    </h1>

                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Select the filters that should appear for this category.
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={
                                        saving ||
                                        loading
                                    }
                                    className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Filters"}
                                </button>

                            </div>

                        </div>


                        {/* Loading */}

                        {loading && (

                            <div className="rounded-lg border border-gray-200 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-800">

                                <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-violet-600" />

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Loading filters...
                                </p>

                            </div>

                        )}


                        {/* Error */}

                        {!loading &&
                            error && (

                                <div className="rounded-lg border border-red-200 bg-white p-6 text-red-600 dark:border-red-900 dark:bg-gray-800">

                                    {error}

                                </div>

                            )}


                        {/* Groups */}

                        {!loading &&
                            !error && (

                                <div className="space-y-5">

                                    {filterGroups.map(
                                        (group) => (

                                            <div
                                                key={
                                                    group.id
                                                }
                                                className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                                            >

                                                {/* Group Header */}

                                                <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">

                                                    <div className="flex items-center justify-between">

                                                        <div>

                                                            <h2 className="font-semibold text-gray-900 dark:text-white">
                                                                {
                                                                    group.name
                                                                }
                                                            </h2>

                                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                                {
                                                                    group.key
                                                                }
                                                            </p>

                                                        </div>

                                                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                                            {
                                                                group.type
                                                            }
                                                        </span>

                                                    </div>

                                                </div>


                                                {/* Options */}

                                                <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">

                                                    {group.options &&
                                                    group.options.length > 0 ? (

                                                        group.options.map(
                                                            (
                                                                option
                                                            ) => {

                                                                const checked =
                                                                    selectedOptions.has(
                                                                        option.id
                                                                    );

                                                                return (
                                                                    <label
                                                                        key={
                                                                            option.id
                                                                        }
                                                                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                                                                            checked
                                                                                ? "border-violet-400 bg-violet-50 dark:border-violet-500 dark:bg-violet-500/10"
                                                                                : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                                                                        }`}
                                                                    >

                                                                        <input
                                                                            type="checkbox"
                                                                            checked={
                                                                                checked
                                                                            }
                                                                            onChange={() =>
                                                                                toggleOption(
                                                                                    option.id
                                                                                )
                                                                            }
                                                                            className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                                                                        />

                                                                        <div className="min-w-0">

                                                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                                                {
                                                                                    option.name
                                                                                }
                                                                            </p>

                                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                                {
                                                                                    option.slug
                                                                                }
                                                                            </p>

                                                                        </div>

                                                                    </label>
                                                                );
                                                            }
                                                        )

                                                    ) : (

                                                        <p className="col-span-full text-sm text-gray-500 dark:text-gray-400">
                                                            No active options available.
                                                        </p>

                                                    )}

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                    </div>

                </main>

            </div>

        </div>
    );
}


export default CategoryFilters;