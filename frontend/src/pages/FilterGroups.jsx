import React, { useEffect, useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { useNavigate } from "react-router-dom";
import {
    getFilterGroups,
    deleteFilterGroup,
    createFilterGroup,
    updateFilterGroup
} from "../api/filters";


function FilterGroupActions({
    group,
    onEdit,
    onDelete,
}) {
    const [isOpen, setIsOpen] =
        useState(false);

    return (
        <div className="relative">

            <button
                type="button"
                onClick={() =>
                    setIsOpen(
                        (current) => !current
                    )
                }
                className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
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
                            onEdit(group);
                        }}
                        className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setIsOpen(false);
                            onDelete(group.id);
                        }}
                        className="block w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-50 dark:text-red-400 dark:hover:bg-gray-700"
                    >
                        Delete
                    </button>

                </div>
            )}
        </div>
    );
}


function FilterGroups() {
    const navigate = useNavigate();
    const [loading, setLoading] =
        useState(true);
    const [isCreateOpen, setIsCreateOpen] =
        useState(false);

    const [isCreating, setIsCreating] =
        useState(false);
    const [groups, setGroups] =
        useState([]);
    const [formData, setFormData] =
        useState({
            name: "",
            key: "",
            type: "select",
            display_order: 0,
            active: true,
        });
    const [error, setError] =
        useState(null);
    const [sidebarOpen, setSidebarOpen] =
        useState(false);
    const [editingGroup, setEditingGroup] =
        useState(null);

    /* ==========================================================
       LOAD FILTER GROUPS
       ========================================================== */

    useEffect(() => {

        async function loadFilterGroups() {

            try {

                setLoading(true);
                setError(null);

                const data =
                    await getFilterGroups();

                setGroups(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load filter groups:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to load filter groups"
                );

            } finally {

                setLoading(false);

            }
        }

        loadFilterGroups();

    }, []);

    const handleSaveGroup = async (event) => {

        event.preventDefault();

        try {

            setIsCreating(true);

            let savedGroup;

            if (editingGroup) {

                savedGroup =
                    await updateFilterGroup(
                        editingGroup.id,
                        formData
                    );

                setGroups((current) =>
                    current.map((group) =>
                        group.id === editingGroup.id
                            ? savedGroup
                            : group
                    )
                );

            } else {

                savedGroup =
                    await createFilterGroup(
                        formData
                    );

                setGroups((current) => [
                    ...current,
                    savedGroup,
                ]);
            }

            setFormData({
                name: "",
                key: "",
                type: "select",
                display_order: 0,
                active: true,
            });

            setEditingGroup(null);
            setIsCreateOpen(false);

        } catch (error) {

            console.error(
                "Failed to save filter group:",
                error
            );

            alert(
                error.message ||
                "Failed to save filter group"
            );

        } finally {

            setIsCreating(false);
        }
    };
    /* ==========================================================
       DELETE
       ========================================================== */

    const handleDeleteGroup = async (
        groupId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this filter group?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteFilterGroup(
                groupId
            );

            setGroups((current) =>
                current.filter(
                    (group) =>
                        group.id !== groupId
                )
            );

        } catch (error) {

            console.error(
                "Failed to delete filter group:",
                error
            );

            alert(
                error.message ||
                "Failed to delete filter group"
            );
        }
    };


    /* ==========================================================
       LOADING
       ========================================================== */

    if (loading) {

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

                            <div className="mb-7">

                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Filter Groups
                                </h1>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Manage product filter groups for the ManMohey catalog
                                </p>

                            </div>

                            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">

                                <div className="text-center">

                                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-violet-600 dark:border-gray-700 dark:border-t-violet-400" />

                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Loading filter groups...
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
       ERROR
       ========================================================== */

    if (error) {

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

                            <div className="mb-7">

                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Filter Groups
                                </h1>

                            </div>

                            <div className="rounded-lg border border-red-200 bg-white p-8 text-center dark:border-red-900/50 dark:bg-gray-800">

                                <h3 className="font-semibold text-gray-800 dark:text-white">
                                    Failed to load filter groups
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
       MAIN
       ========================================================== */

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

                        {/* PAGE HEADER */}

                        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                            <div>

                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    Filter Groups
                                </h1>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Manage filter groups used across the ManMohey catalog
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
                                Add Filter Group
                            </button>

                        </div>


                        {/* FILTER GROUP TABLE */}

                        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">

                            <div className="overflow-x-auto">

                                <table className="w-full min-w-[800px] text-left text-sm">

                                    <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-400">

                                        <tr>

                                            <th className="px-5 py-3 font-semibold">
                                                Filter Group
                                            </th>

                                            <th className="px-4 py-3 font-semibold">
                                                Key
                                            </th>

                                            <th className="px-4 py-3 font-semibold">
                                                Type
                                            </th>

                                            <th className="px-4 py-3 font-semibold">
                                                Order
                                            </th>

                                            <th className="px-4 py-3 font-semibold">
                                                Status
                                            </th>

                                            <th className="px-4 py-3 font-semibold">
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/70">

                                        {groups.map(
                                            (group) => (

                                                <tr
                                                    key={group.id}
                                                    className="transition hover:bg-gray-50/80 dark:hover:bg-gray-700/30"
                                                >

                                                    <td className="px-5 py-4">

                                                        <td className="px-5 py-4">

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/filter-groups/${group.id}`
                                                                    )
                                                                }
                                                                className="font-medium text-gray-800 hover:text-violet-600 dark:text-white dark:hover:text-violet-400"
                                                            >
                                                                {group.name}
                                                            </button>

                                                        </td>

                                                    </td>

                                                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                                                        {group.key}
                                                    </td>

                                                    <td className="px-4 py-4">

                                                        <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                                            {group.type}
                                                        </span>

                                                    </td>

                                                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                                                        {group.display_order}
                                                    </td>

                                                    <td className="px-4 py-4">

                                                        <span
                                                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${group.active
                                                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                                                                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                                                }`}
                                                        >
                                                            {group.active
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </span>

                                                    </td>

                                                    <td className="px-4 py-4">

                                                        <FilterGroupActions
                                                            group={group}
                                                            onEdit={(selectedGroup) => {
                                                                setEditingGroup(selectedGroup);

                                                                setFormData({
                                                                    name: selectedGroup.name || "",
                                                                    key: selectedGroup.key || "",
                                                                    type: selectedGroup.type || "select",
                                                                    display_order:
                                                                        selectedGroup.display_order ?? 0,
                                                                    active:
                                                                        selectedGroup.active ?? true,
                                                                });

                                                                setIsCreateOpen(true);
                                                            }}
                                                            onDelete={handleDeleteGroup}
                                                        />

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </section>

                    </div>

                </main>

            </div>
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

                    <div className="w-full max-w-md rounded-xl bg-white shadow-xl dark:bg-gray-800">

                        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">

                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {editingGroup
                                    ? "Edit Filter Group"
                                    : "Add Filter Group"}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Create a new filter group for your catalog.
                            </p>

                        </div>

                        <form
                            onSubmit={handleSaveGroup}
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
                                    placeholder="e.g. Fabric"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                                />

                            </div>


                            {/* Key */}

                            <div>

                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Key
                                </label>

                                <input
                                    type="text"
                                    required
                                    value={formData.key}
                                    onChange={(event) =>
                                        setFormData({
                                            ...formData,
                                            key: event.target.value,
                                        })
                                    }
                                    placeholder="e.g. fabric"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                                />

                            </div>


                            {/* Type */}

                            <div>

                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Type
                                </label>

                                <select
                                    value={formData.type}
                                    onChange={(event) =>
                                        setFormData({
                                            ...formData,
                                            type: event.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                                >
                                    <option value="select">
                                        Select
                                    </option>

                                    <option value="multi-select">
                                        Multi Select
                                    </option>

                                    <option value="color">
                                        Color
                                    </option>

                                    <option value="range">
                                        Range
                                    </option>
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
                                    value={formData.display_order}
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
                                    onClick={() => {
                                        setIsCreateOpen(false);
                                        setEditingGroup(null);

                                        setFormData({
                                            name: "",
                                            key: "",
                                            type: "select",
                                            display_order: 0,
                                            active: true,
                                        });
                                    }}
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
                                        : editingGroup
                                            ? "Save Changes"
                                            : "Create Filter Group"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}
        </div>
    );
}

export default FilterGroups;