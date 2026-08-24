import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";

import {
    getFilterOptionsByGroup,
    createFilterOption,
    updateFilterOption,
    deleteFilterOption,
} from "../api/filters";


function FilterOptions() {

    const { groupId } = useParams();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [options, setOptions] =
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
            value: "",
            display_order: 0,
            hex_code: "",
            active: true,
        });
    const [editingOption, setEditingOption] =
        useState(null);


    useEffect(() => {

        const loadOptions = async () => {

            try {

                setLoading(true);
                setError(null);

                const data =
                    await getFilterOptionsByGroup(
                        groupId
                    );

                setOptions(data);

            } catch (error) {

                console.error(
                    "Failed to load filter options:",
                    error
                );

                setError(
                    error.message
                );

            } finally {

                setLoading(false);

            }
        };

        loadOptions();

    }, [groupId]);


    const handleDeleteOption = async (
        optionId
    ) => {

        const confirmed = window.confirm(
            "Are you sure you want to deactivate this filter option?"
        );

        if (!confirmed) {
            return;
        }

        try {

            const updatedOption =
                await deleteFilterOption(
                    optionId
                );

            setOptions((current) =>
                current.map((option) =>
                    option.id === optionId
                        ? {
                            ...option,
                            ...updatedOption,
                            active: false,
                        }
                        : option
                )
            );

        } catch (error) {

            console.error(
                "Failed to delete filter option:",
                error
            );

            alert(
                error.message ||
                "Failed to delete filter option"
            );
        }
    };
    const handleCreateOption = async (
        event
    ) => {

        event.preventDefault();

        try {

            setIsCreating(true);

            const newOption =
                await createFilterOption({
                    group_id: Number(groupId),
                    name: formData.name,
                    slug: formData.slug,
                    value:
                        formData.value === ""
                            ? null
                            : Number(formData.value),
                    display_order:
                        Number(
                            formData.display_order
                        ),
                    hex_code:
                        formData.hex_code || null,
                    active: formData.active,
                });

            setOptions((current) => [
                ...current,
                newOption,
            ]);

            setFormData({
                name: "",
                slug: "",
                value: "",
                display_order: 0,
                hex_code: "",
                active: true,
            });

            setIsCreateOpen(false);

        } catch (error) {

            console.error(
                "Failed to create filter option:",
                error
            );

            alert(
                error.message ||
                "Failed to create filter option"
            );

        } finally {

            setIsCreating(false);

        }
    };
    const handleSaveOption = async (event) => {

        event.preventDefault();

        try {

            setIsCreating(true);

            if (editingOption) {

                const updatedOption =
                    await updateFilterOption(
                        editingOption.id,
                        {
                            group_id: Number(groupId),
                            name: formData.name,
                            slug: formData.slug,
                            value:
                                formData.value === ""
                                    ? null
                                    : Number(formData.value),
                            display_order:
                                Number(
                                    formData.display_order
                                ),
                            hex_code:
                                formData.hex_code || null,
                            active:
                                formData.active,
                        }
                    );

                setOptions((current) =>
                    current.map((option) =>
                        option.id === editingOption.id
                            ? updatedOption
                            : option
                    )
                );

            } else {

                const newOption =
                    await createFilterOption({
                        group_id: Number(groupId),
                        name: formData.name,
                        slug: formData.slug,
                        value:
                            formData.value === ""
                                ? null
                                : Number(formData.value),
                        display_order:
                            Number(
                                formData.display_order
                            ),
                        hex_code:
                            formData.hex_code || null,
                        active:
                            formData.active,
                    });

                setOptions((current) => [
                    ...current,
                    newOption,
                ]);
            }

            setFormData({
                name: "",
                slug: "",
                value: "",
                display_order: 0,
                hex_code: "",
                active: true,
            });

            setEditingOption(null);
            setIsCreateOpen(false);

        } catch (error) {

            console.error(
                "Failed to save filter option:",
                error
            );

            alert(
                error.message ||
                "Failed to save filter option"
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
                                ← Back to Filter Groups
                            </button>

                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Filter Options
                            </h1>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Manage options for this filter group
                            </p>

                        </div>


                        {/* Loading */}

                        {loading && (

                            <div className="rounded-lg border border-gray-200 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-800">

                                <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-violet-600" />

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Loading filter options...
                                </p>

                            </div>

                        )}


                        {/* Error */}

                        {!loading && error && (

                            <div className="rounded-lg border border-red-200 bg-white p-6 text-red-600 dark:border-red-900 dark:bg-gray-800">

                                Failed to load filter options:

                                <span className="ml-1">
                                    {error}
                                </span>

                            </div>

                        )}


                        {/* Options */}

                        {!loading && !error && (

                            <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">

                                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">

                                    <div>

                                        <h2 className="font-semibold text-gray-900 dark:text-white">
                                            Options
                                        </h2>

                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            {options.length} option
                                            {options.length !== 1
                                                ? "s"
                                                : ""}
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsCreateOpen(true)
                                        }
                                        className="btn bg-violet-600 text-white shadow-sm hover:bg-violet-700"
                                    >
                                        <span className="mr-1 text-lg leading-none">
                                            +
                                        </span>
                                        Add Option
                                    </button>

                                </div>


                                <div className="overflow-x-auto">

                                    <table className="w-full text-left text-sm">

                                        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">

                                            <tr>

                                                <th className="px-5 py-3">
                                                    Name
                                                </th>

                                                <th className="px-5 py-3">
                                                    Slug
                                                </th>

                                                <th className="px-5 py-3">
                                                    Value
                                                </th>

                                                <th className="px-5 py-3">
                                                    Order
                                                </th>

                                                <th className="px-5 py-3">
                                                    Status
                                                </th>
                                                <th className="px-5 py-3">
                                                    Actions
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">

                                            {options.length === 0 ? (

                                                <tr>

                                                    <td
                                                        colSpan="5"
                                                        className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                                                    >
                                                        No filter options found.
                                                    </td>

                                                </tr>

                                            ) : (

                                                options.map(
                                                    (option) => (

                                                        <tr
                                                            key={option.id}
                                                            className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                                                        >

                                                            <td className="px-5 py-4 font-medium text-gray-800 dark:text-white">
                                                                {option.name}
                                                            </td>

                                                            <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                                                                {option.slug}
                                                            </td>

                                                            <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                                                                {option.value}
                                                            </td>

                                                            <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                                                                {option.display_order}
                                                            </td>

                                                            <td className="px-5 py-4">

                                                                <span
                                                                    className={
                                                                        option.active
                                                                            ? "rounded-full bg-green-100 px-2 py-1 text-xs text-green-700"
                                                                            : "rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                                                                    }
                                                                >
                                                                    {option.active
                                                                        ? "Active"
                                                                        : "Inactive"}
                                                                </span>

                                                            </td>
                                                            <td className="px-5 py-4">

                                                                <td className="px-5 py-4">

                                                                    <div className="flex items-center gap-2">

                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {

                                                                                setEditingOption(option);

                                                                                setFormData({
                                                                                    name: option.name || "",
                                                                                    slug: option.slug || "",
                                                                                    value:
                                                                                        option.value ?? "",
                                                                                    display_order:
                                                                                        option.display_order ?? 0,
                                                                                    hex_code:
                                                                                        option.hex_code || "",
                                                                                    active:
                                                                                        option.active ?? true,
                                                                                });

                                                                                setIsCreateOpen(true);
                                                                            }}
                                                                            className="rounded-md px-3 py-1.5 text-sm font-medium text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-500/10"
                                                                        >
                                                                            Edit
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleDeleteOption(
                                                                                    option.id
                                                                                )
                                                                            }
                                                                            className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                                                                        >
                                                                            Delete
                                                                        </button>

                                                                    </div>

                                                                </td>

                                                            </td>

                                                        </tr>

                                                    )
                                                )

                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </section>

                        )}

                    </div>

                </main>

            </div>
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

                    <div className="w-full max-w-md rounded-xl bg-white shadow-xl dark:bg-gray-800">

                        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">

                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {editingOption
                                    ? "Edit Filter Option"
                                    : "Add Filter Option"}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Add a new option to this filter group.
                            </p>

                        </div>

                        <form
                            onSubmit={handleSaveOption}
                            className="space-y-5 p-6"
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
                                            name: event.target.value,
                                        })
                                    }
                                    placeholder="e.g. Cotton"
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
                                            slug: event.target.value,
                                        })
                                    }
                                    placeholder="e.g. cotton"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                                />

                            </div>


                            {/* Value */}

                            <div>

                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Value
                                </label>

                                <input
                                    type="number"
                                    value={formData.value}
                                    onChange={(event) =>
                                        setFormData({
                                            ...formData,
                                            value:
                                                event.target.value,
                                        })
                                    }
                                    placeholder="e.g. 1"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                                />

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


                            {/* Hex Code */}

                            <div>

                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Hex Code
                                </label>

                                <input
                                    type="text"
                                    value={
                                        formData.hex_code
                                    }
                                    onChange={(event) =>
                                        setFormData({
                                            ...formData,
                                            hex_code:
                                                event.target.value,
                                        })
                                    }
                                    placeholder="#FFFFFF"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                                />

                            </div>


                            {/* Active */}

                            <label className="flex cursor-pointer items-center gap-3">

                                <input
                                    type="checkbox"
                                    checked={formData.active}
                                    onChange={(event) =>
                                        setFormData({
                                            ...formData,
                                            active:
                                                event.target.checked,
                                        })
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                                />

                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Active
                                </span>

                            </label>


                            {/* Buttons */}

                            <div className="flex justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsCreateOpen(false)
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
                                        : editingOption
                                            ? "Save Changes"
                                            : "Create Option"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}
        </div>
    );
}

export default FilterOptions;