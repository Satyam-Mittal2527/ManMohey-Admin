import { useParams } from "react-router-dom";
import React, {
    useEffect,
    useState,
} from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";

import { getCategories } from "../api/categories";
import {
    getCategoryFilters,
} from "../api/filters";
import {
    getProductById,
    createProduct,
    uploadProductImages,
    deleteProductImage,
} from "../api/products";
/* ============================================================
   FILTER MULTI SELECT
   ============================================================ */

function FilterMultiSelect({
    group,
    selectedFilters,
    setSelectedFilters,
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const selected =
        selectedFilters[group.id] || [];

    const filteredOptions =
        group.options.filter((option) =>
            option.name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );

    const toggleOption = (optionId) => {
        setSelectedFilters((current) => {
            const currentValues =
                current[group.id] || [];

            const exists =
                currentValues.includes(
                    optionId
                );

            return {
                ...current,
                [group.id]: exists
                    ? currentValues.filter(
                        (id) =>
                            id !==
                            optionId
                    )
                    : [
                        ...currentValues,
                        optionId,
                    ],
            };
        });
    };

    const selectedNames =
        group.options
            .filter((option) =>
                selected.includes(
                    option.id
                )
            )
            .map(
                (option) =>
                    option.name
            );

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() =>
                    setOpen(!open)
                }
                className="form-select flex min-h-[42px] w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm dark:border-gray-700 dark:bg-gray-900"
            >
                <span
                    className={
                        selectedNames.length
                            ? "text-gray-800 dark:text-white"
                            : "text-gray-400"
                    }
                >
                    {selectedNames.length
                        ? selectedNames.join(
                            ", "
                        )
                        : `Select ${group.name.toLowerCase()}`}
                </span>

                <svg
                    className={`ml-2 h-4 w-4 shrink-0 fill-current text-gray-400 transition-transform ${open
                        ? "rotate-180"
                        : ""
                        }`}
                    viewBox="0 0 12 12"
                >
                    <path d="m6 8.8-4.5-4.5 1.4-1.4L6 6l3.1-3.1 1.4 1.4L6 8.8Z" />
                </svg>
            </button>

            {open && (
                <div className="absolute left-0 right-0 top-[46px] z-50 rounded-lg border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-800">

                    {/* Search */}

                    {group.options.length >
                        5 && (
                            <input
                                type="text"
                                value={search}
                                onChange={(
                                    event
                                ) =>
                                    setSearch(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder={`Search ${group.name.toLowerCase()}...`}
                                className="form-input mb-2 w-full text-sm dark:border-gray-700 dark:bg-gray-900"
                            />
                        )}

                    <div className="max-h-52 overflow-y-auto">

                        {filteredOptions.map(
                            (option) => {
                                const checked =
                                    selected.includes(
                                        option.id
                                    );

                                return (
                                    <label
                                        key={
                                            option.id
                                        }
                                        className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
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
                                            className="form-checkbox text-violet-600"
                                        />

                                        {group.type ===
                                            "color" && (
                                                <span
                                                    className="h-4 w-4 rounded-full border border-gray-300"
                                                    style={{
                                                        backgroundColor:
                                                            option.hex_code,
                                                    }}
                                                />
                                            )}

                                        <span className="text-sm text-gray-700 dark:text-gray-200">
                                            {
                                                option.name
                                            }
                                        </span>
                                    </label>
                                );
                            }
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}

/* ============================================================
   IMAGE UPLOAD
   ============================================================ */

function ImageUploader({
    images,
    setImages,
    existingImages,
    setExistingImages,
    onDeleteExisting,
}) {
    // ============================================
    // New image upload
    // ============================================

    const handleImages = (event) => {
        const files = Array.from(
            event.target.files || []
        );

        const previews = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setImages((current) => [
            ...current,
            ...previews,
        ]);

        // Allow selecting the same file again
        event.target.value = "";
    };

    // ============================================
    // Remove newly selected image
    // ============================================

    const removeNewImage = (index) => {
        setImages((current) =>
            current.filter(
                (_, i) => i !== index
            )
        );
    };

    // ============================================
    // Delete existing image
    // ============================================

    const removeExistingImage = async (imageId) => {
        if (!onDeleteExisting) {
            return;
        }

        await onDeleteExisting(imageId);
    };

    // ============================================
    // Move existing image
    // ============================================

    const moveExistingImage = async (
        index,
        direction
    ) => {
        const newIndex =
            direction === "up"
                ? index - 1
                : index + 1;

        if (
            newIndex < 0 ||
            newIndex >= existingImages.length
        ) {
            return;
        }

        const reordered = [
            ...existingImages,
        ];

        const temp = reordered[index];

        reordered[index] =
            reordered[newIndex];

        reordered[newIndex] = temp;

        setExistingImages(reordered);
    };

    return (
        <div>

            {/* ===================================== */}
            {/* EXISTING IMAGES                       */}
            {/* ===================================== */}

            {existingImages.length > 0 && (
                <div className="mb-4">

                    <p className="mb-2 text-xs font-medium text-gray-400">
                        Existing Images
                    </p>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                        {existingImages.map(
                            (image, index) => (
                                <div
                                    key={`existing-${image.id}`}
                                    className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
                                >

                                    <img
                                        src={
                                            image.public_url
                                        }
                                        alt={
                                            image.alt_text ||
                                            `Product ${index + 1}`
                                        }
                                        className="h-full w-full object-cover"
                                    />

                                    {/* Primary */}

                                    {index === 0 && (
                                        <span className="absolute left-2 top-2 rounded bg-violet-600 px-2 py-1 text-[10px] font-semibold text-white">
                                            Primary
                                        </span>
                                    )}

                                    {/* Delete */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeExistingImage(
                                                image.id
                                            )
                                        }
                                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                                    >
                                        ×
                                    </button>

                                    {/* Reorder controls */}

                                    <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1 opacity-0 transition group-hover:opacity-100">

                                        <button
                                            type="button"
                                            disabled={
                                                index === 0
                                            }
                                            onClick={() =>
                                                moveExistingImage(
                                                    index,
                                                    "up"
                                                )
                                            }
                                            className="rounded bg-black/70 px-2 py-1 text-xs text-white disabled:opacity-30"
                                        >
                                            ↑
                                        </button>

                                        <button
                                            type="button"
                                            disabled={
                                                index ===
                                                existingImages.length -
                                                1
                                            }
                                            onClick={() =>
                                                moveExistingImage(
                                                    index,
                                                    "down"
                                                )
                                            }
                                            className="rounded bg-black/70 px-2 py-1 text-xs text-white disabled:opacity-30"
                                        >
                                            ↓
                                        </button>

                                    </div>

                                </div>
                            )
                        )}

                    </div>

                </div>
            )}

            {/* ===================================== */}
            {/* NEW IMAGES                             */}
            {/* ===================================== */}

            {images.length > 0 && (
                <div className="mb-4">

                    <p className="mb-2 text-xs font-medium text-gray-400">
                        New Images
                    </p>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                        {images.map(
                            (image, index) => (
                                <div
                                    key={`new-${index}`}
                                    className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
                                >

                                    <img
                                        src={
                                            image.preview
                                        }
                                        alt={`New Product ${index + 1
                                            }`}
                                        className="h-full w-full object-cover"
                                    />

                                    <span className="absolute left-2 top-2 rounded bg-blue-600 px-2 py-1 text-[10px] font-semibold text-white">
                                        New
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeNewImage(
                                                index
                                            )
                                        }
                                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                                    >
                                        ×
                                    </button>

                                </div>
                            )
                        )}

                    </div>

                </div>
            )}

            {/* ===================================== */}
            {/* UPLOAD                                 */}
            {/* ===================================== */}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-violet-400 hover:bg-violet-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-violet-500">

                    <svg
                        className="mb-2 h-7 w-7 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <path d="M12 5v14M5 12h14" />
                    </svg>

                    <span className="text-xs font-medium text-gray-500">
                        Add Image
                    </span>

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImages}
                    />

                </label>

            </div>

            <p className="mt-2 text-xs text-gray-400">
                The first image is used as the
                primary image.
            </p>

        </div>
    );
}
/* ============================================================
   DELETE PRODUCT
   ============================================================ */
const handleDeleteExistingImage = async (
    imageId
) => {
    try {
        await deleteProductImage(
            id,
            imageId
        );

        setExistingImages((current) =>
            current.filter(
                (image) =>
                    image.id !== imageId
            )
        );

    } catch (error) {
        console.error(
            "Failed to delete image:",
            error
        );

        alert(
            "Failed to delete image"
        );
    }
};
/* ============================================================
   ADD PRODUCT
   ============================================================ */

function AddProduct() {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [categories, setCategories] = useState([]);
    const [filterGroups, setFilterGroups] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingFilters, setLoadingFilters] = useState(false);
    const [filterError, setFilterError] = useState(null);
    const [loadingProduct, setLoadingProduct] = useState(false);
    const [productError, setProductError] = useState(null);
    const [existingImages, setExistingImages] = useState([]);
    const [sidebarOpen, setSidebarOpen] =
        useState(false);
    /* Product fields */
    const [formData, setFormData] =
        useState({
            name: "",
            slug: "",
            category_id: "",
            short_description: "",
            description: "",
            sku: "",
            price: "",
            sale_price: "",
            stock: "",
            active: true,
            featured: false,
        });

    /* Selected filters */

    const [
        selectedFilters,
        setSelectedFilters,
    ] = useState({});

    /* Product Variants */

    const [variants, setVariants] = useState([]);
    /* Images */

    const [images, setImages] =
        useState([]);


    /*##########################################################
        EDIT PRODUCTS
        ######################################################## */
    useEffect(() => {
        if (!isEditMode) {
            return;
        }

        const loadProduct = async () => {
            try {
                setLoadingProduct(true);
                setProductError(null);

                const response =
                    await getProductById(id);

                const product =
                    response.data;

                console.log(
                    "EDIT PRODUCT:",
                    product
                );

                // ============================================
                // Product fields
                // ============================================

                setFormData({
                    name: product.name || "",
                    slug: product.slug || "",
                    short_description:
                        product.short_description || "",
                    description:
                        product.description || "",
                    category_id:
                        product.category_id || "",
                    price:
                        product.price ?? "",
                    sale_price:
                        product.sale_price ?? "",
                    sku:
                        product.sku || "",
                    stock:
                        product.stock ?? "",
                    weight:
                        product.weight ?? "",
                    featured:
                        product.featured ?? false,
                    active:
                        product.active ?? true,
                });

                // ============================================
                // Filters
                // ============================================

                setSelectedFilters(
                    product.filter_values?.reduce(
                        (groups, filterValue) => {

                            const groupId =
                                filterValue
                                    .filter_options
                                    .group_id;

                            if (!groups[groupId]) {
                                groups[groupId] = [];
                            }

                            groups[groupId].push(
                                filterValue
                                    .filter_option_id
                            );

                            return groups;

                        },
                        {}
                    ) || {}
                );

                // ============================================
                // Variants
                // ============================================

                setVariants(
                    (product.variants || []).map(
                        (variant) => ({
                            id: variant.id,
                            sku: variant.sku || "",
                            size: variant.size || "",
                            color: variant.color || "",
                            stock:
                                variant.stock ?? "",
                            price:
                                variant.price ?? "",
                        })
                    )
                );

                // ============================================
                // Existing images
                // ============================================

                setExistingImages(
                    product.product_images || []
                );

            } catch (error) {

                console.error(
                    "Failed to load product:",
                    error
                );

                setProductError(
                    error.message ||
                    "Failed to load product"
                );

            } finally {

                setLoadingProduct(false);
            }
        };

        loadProduct();

    }, [id, isEditMode]);
    /* ==========================================================
       FORM CHANGE
       ========================================================== */
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoadingCategories(true);

                const data =
                    await getCategories();

                setCategories(
                    Array.isArray(data)
                        ? data
                        : []
                );
            } catch (error) {
                console.error(
                    "Failed to load categories:",
                    error
                );
            } finally {
                setLoadingCategories(false);
            }
        };

        loadCategories();
    }, []);

    useEffect(() => {
        const loadFilters = async () => {
            if (!formData.category_id) {
                setFilterGroups([]);
                return;
            }

            try {
                setLoadingFilters(true);
                setFilterError(null);

                const data =
                    await getCategoryFilters(
                        formData.category_id
                    );

                setFilterGroups(
                    Array.isArray(data)
                        ? data
                        : []
                );

                // Reset previously selected filters
                setSelectedFilters({});
            } catch (error) {
                console.error(
                    "Failed to load filters:",
                    error
                );

                setFilterGroups([]);
                setFilterError(
                    error.message ||
                    "Failed to load filters"
                );
            } finally {
                setLoadingFilters(false);
            }
        };

        loadFilters();
    }, [formData.category_id]);

    useEffect(() => {
        const sizeGroup = filterGroups.find(
            (group) => group.key === "size"
        );

        if (!sizeGroup) {
            setVariants([]);
            return;
        }

        const selectedSizeIds =
            selectedFilters[sizeGroup.id] || [];

        const selectedSizes = sizeGroup.options.filter(
            (option) =>
                selectedSizeIds.includes(option.id)
        );

        setVariants((currentVariants) => {
            return selectedSizes.map((size) => {
                const existing = currentVariants.find(
                    (variant) =>
                        variant.size === size.name
                );

                return (
                    existing || {
                        size: size.name,
                        sku: "",
                        price: formData.price || "",
                        stock: "",
                        color: "",
                    }
                );
            });
        });
    }, [
        selectedFilters,
        filterGroups,
        formData.price,
    ]);

    const handleVariantChange = (
        index,
        field,
        value
    ) => {
        setVariants((current) =>
            current.map((variant, variantIndex) =>
                variantIndex === index
                    ? {
                        ...variant,
                        [field]: value,
                    }
                    : variant
            )
        );
    };

    const handleChange = (event) => {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setFormData((current) => ({
            ...current,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    /* ==========================================================
       CATEGORY
       ========================================================== */

    const selectedCategory =
        categories.find(
            (category) =>
                String(
                    category.id
                ) ===
                String(
                    formData.category_id
                )
        );

    /* ==========================================================
       SUBMIT
       ========================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setIsSubmitting(true);

            // =====================================================
            // 1. Prepare filter IDs
            // =====================================================

            const filterOptionIds = Object.values(
                selectedFilters
            ).flat();

            // =====================================================
            // 2. Prepare product payload
            // =====================================================

            const payload = {
                ...formData,

                category_id: Number(
                    formData.category_id
                ),

                price: Number(
                    formData.price
                ),

                sale_price: formData.sale_price
                    ? Number(formData.sale_price)
                    : null,

                stock: Number(
                    formData.stock || 0
                ),

                filter_option_ids:
                    filterOptionIds.map(Number),

                variants: variants.map(
                    (variant) => ({
                        sku: variant.sku || null,
                        size: variant.size || null,
                        color: variant.color || null,
                        stock: Number(
                            variant.stock || 0
                        ),
                        price: Number(
                            variant.price || 0
                        ),
                    })
                ),
            };

            console.log(
                "Creating product:",
                payload
            );

            // =====================================================
            // 3. Create product
            // =====================================================

            const productResponse =
                await createProduct(payload);

            console.log(
                "Product created:",
                productResponse
            );

            const productId =
                productResponse.data.product.id;

            // =====================================================
            // 4. Upload images
            // =====================================================

            if (images.length > 0) {

                console.log(
                    `Uploading ${images.length} images...`
                );

                const imageResponse =
                    await uploadProductImages(
                        productId,
                        images
                    );

                console.log(
                    "Images uploaded:",
                    imageResponse
                );
            }

            // =====================================================
            // 5. Success
            // =====================================================

            alert(
                "Product created successfully!"
            );

            console.log(
                "PRODUCT CREATION COMPLETE"
            );

        } catch (error) {

            console.error(
                "Product creation failed:",
                error
            );

            alert(
                error.message ||
                "Failed to create product"
            );

        } finally {

            setIsSubmitting(false);
        }
    };

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

                    <div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 lg:px-8 lg:py-8">

                        {/* ==================================================
                            PAGE HEADER
                            ================================================== */}

                        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                            <div>

                                <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                                    <button
                                        type="button"
                                        className="hover:text-violet-600"
                                        onClick={() =>
                                            window.history.back()
                                        }
                                    >
                                        Products
                                    </button>

                                    <span>
                                        /
                                    </span>

                                    <span className="text-gray-700 dark:text-gray-300">
                                        {isEditMode
                                            ? "Edit Product"
                                            : "Add Product"}
                                    </span>
                                </div>

                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {isEditMode
                                        ? "Edit Product"
                                        : "Add Product"}
                                </h1>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {isEditMode
                                        ? "Update the product details in the ManMohey catalog"
                                        : "Create a new product for the ManMohey catalog"}
                                </p>

                            </div>

                        </div>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <div className="space-y-6">

                                {/* ==================================================
                                    BASIC INFORMATION
                                    ================================================== */}

                                <section className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">

                                    <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">

                                        <h2 className="font-semibold text-gray-900 dark:text-white">
                                            Basic Information
                                        </h2>

                                        <p className="mt-1 text-xs text-gray-500">
                                            Basic details
                                            about the product
                                        </p>

                                    </div>

                                    <div className="grid gap-5 p-5 sm:grid-cols-2">

                                        {/* Name */}

                                        <div className="sm:col-span-2">

                                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Product Name
                                                <span className="ml-1 text-red-500">
                                                    *
                                                </span>
                                            </label>

                                            <input
                                                name="name"
                                                value={
                                                    formData.name
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="e.g. Royal Silk Saree"
                                                className="form-input w-full"
                                                required
                                            />

                                        </div>

                                        {/* Slug */}

                                        <div>

                                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Slug
                                            </label>

                                            <input
                                                name="slug"
                                                value={
                                                    formData.slug
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="royal-silk-saree"
                                                className="form-input w-full"
                                            />

                                        </div>

                                        {/* SKU */}

                                        <div>

                                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                SKU
                                            </label>

                                            <input
                                                name="sku"
                                                value={
                                                    formData.sku
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="SAREE-001"
                                                className="form-input w-full"
                                            />

                                        </div>

                                        {/* Category */}

                                        <div className="sm:col-span-2">

                                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Category
                                                <span className="ml-1 text-red-500">
                                                    *
                                                </span>
                                            </label>

                                            <select
                                                name="category_id"
                                                value={formData.category_id}
                                                onChange={handleChange}
                                                className="form-select w-full"
                                                required
                                                disabled={loadingCategories}
                                            >
                                                <option value="">
                                                    {loadingCategories
                                                        ? "Loading categories..."
                                                        : "Select category"}
                                                </option>

                                                {categories
                                                    .filter(
                                                        (
                                                            category
                                                        ) =>
                                                            category.parent_id ===
                                                            null
                                                    )
                                                    .map(
                                                        (
                                                            parent
                                                        ) => (
                                                            <React.Fragment
                                                                key={
                                                                    parent.id
                                                                }
                                                            >

                                                                <option
                                                                    value={
                                                                        parent.id
                                                                    }
                                                                >
                                                                    {
                                                                        parent.name
                                                                    }
                                                                </option>

                                                                {categories
                                                                    .filter(
                                                                        (
                                                                            child
                                                                        ) =>
                                                                            child.parent_id ===
                                                                            parent.id
                                                                    )
                                                                    .map(
                                                                        (
                                                                            child
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    child.id
                                                                                }
                                                                                value={
                                                                                    child.id
                                                                                }
                                                                            >
                                                                                &nbsp;&nbsp;
                                                                                └{" "}
                                                                                {
                                                                                    child.name
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}

                                                            </React.Fragment>
                                                        )
                                                    )}

                                            </select>

                                        </div>

                                        {/* Short Description */}

                                        <div className="sm:col-span-2">

                                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Short Description
                                            </label>

                                            <textarea
                                                name="short_description"
                                                value={
                                                    formData.short_description
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                rows="2"
                                                placeholder="A short description of the product..."
                                                className="form-textarea w-full"
                                            />

                                        </div>

                                        {/* Description */}

                                        <div className="sm:col-span-2">

                                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Description
                                            </label>

                                            <textarea
                                                name="description"
                                                value={
                                                    formData.description
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                rows="5"
                                                placeholder="Detailed product description..."
                                                className="form-textarea w-full"
                                            />

                                        </div>

                                    </div>
                                </section>

                                {/* ==================================================
                                    PRICING & INVENTORY
                                    ================================================== */}

                                <section className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">

                                    <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">

                                        <h2 className="font-semibold text-gray-900 dark:text-white">
                                            Pricing & Inventory
                                        </h2>

                                    </div>

                                    <div className="grid gap-5 p-5 sm:grid-cols-3">

                                        <div>

                                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Price
                                                <span className="ml-1 text-red-500">
                                                    *
                                                </span>
                                            </label>

                                            <div className="relative">

                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                                    ₹
                                                </span>

                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={
                                                        formData.price
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="0"
                                                    min="0"
                                                    className="form-input w-full pl-7"
                                                    required
                                                />

                                            </div>

                                        </div>

                                        <div>

                                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Sale Price
                                            </label>

                                            <div className="relative">

                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                                    ₹
                                                </span>

                                                <input
                                                    type="number"
                                                    name="sale_price"
                                                    value={
                                                        formData.sale_price
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="Optional"
                                                    min="0"
                                                    className="form-input w-full pl-7"
                                                />

                                            </div>

                                        </div>

                                        <div>

                                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Stock
                                            </label>

                                            <input
                                                type="number"
                                                name="stock"
                                                value={
                                                    formData.stock
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="0"
                                                min="0"
                                                className="form-input w-full"
                                            />

                                        </div>

                                    </div>
                                </section>

                                {/* ==================================================
                                    PRODUCT IMAGES
                                    ================================================== */}

                                <section className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">

                                    <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">

                                        <h2 className="font-semibold text-gray-900 dark:text-white">
                                            Product Images
                                        </h2>

                                        <p className="mt-1 text-xs text-gray-500">
                                            Add product images.
                                            The first image
                                            will be the
                                            primary image.
                                        </p>

                                    </div>

                                    <div className="p-5">

                                        <ImageUploader
                                            images={images}
                                            setImages={setImages}
                                            existingImages={existingImages}
                                            setExistingImages={setExistingImages}
                                            onDeleteExisting={
                                                handleDeleteExistingImage
                                            }
                                        />

                                    </div>

                                </section>

                                {/* ==================================================
                                    FILTERS
                                    ================================================== */}

                                <section className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">

                                    <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">

                                        <div className="flex items-center justify-between">

                                            <div>

                                                <h2 className="font-semibold text-gray-900 dark:text-white">
                                                    Product Filters
                                                </h2>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    Select attributes
                                                    that describe
                                                    this product
                                                </p>

                                            </div>

                                            {selectedCategory && (
                                                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                                                    {
                                                        selectedCategory.name
                                                    }
                                                </span>
                                            )}

                                        </div>

                                    </div>

                                    <div className="grid gap-5 p-5 sm:grid-cols-2">

                                        {loadingFilters ? (
                                            <div className="sm:col-span-2 flex items-center justify-center py-8">
                                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-violet-600" />
                                                <span className="ml-3 text-sm text-gray-500">
                                                    Loading filters...
                                                </span>
                                            </div>
                                        ) : filterError ? (
                                            <div className="sm:col-span-2 rounded-md bg-red-50 p-4 text-sm text-red-600">
                                                {filterError}
                                            </div>
                                        ) : filterGroups.length === 0 ? (
                                            <div className="sm:col-span-2 rounded-md bg-gray-50 p-4 text-sm text-gray-500 dark:bg-gray-900">
                                                {formData.category_id
                                                    ? "No filters are assigned to this category."
                                                    : "Select a category to view its available filters."}
                                            </div>
                                        ) : (
                                            filterGroups.map((group) => (
                                                <div key={group.id}>
                                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {group.name}
                                                    </label>

                                                    <FilterMultiSelect
                                                        group={group}
                                                        selectedFilters={selectedFilters}
                                                        setSelectedFilters={setSelectedFilters}
                                                    />
                                                </div>
                                            ))
                                        )}

                                    </div>

                                </section>

                                {/* ==================================================
                                    PRODUCT VARIANTS
                                    ================================================== */}

                                {variants.length > 0 && (
                                    <section className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">

                                        <div className="border-b border-gray-200 px-5 py-4">

                                            <div className="flex items-center justify-between">

                                                <div>
                                                    <h2 className="font-semibold text-gray-900 dark:text-white">
                                                        Product Variants
                                                    </h2>

                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Set price, stock and SKU for
                                                        each size.
                                                    </p>
                                                </div>

                                                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                                                    {variants.length}{" "}
                                                    {variants.length === 1
                                                        ? "variant"
                                                        : "variants"}
                                                </span>

                                            </div>

                                        </div>

                                        <div className="p-5">

                                            <div className="overflow-x-auto">

                                                <table className="w-full min-w-[700px]">

                                                    <thead>
                                                        <tr className="border-b border-gray-200 text-left dark:border-gray-700">

                                                            <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                                Size
                                                            </th>

                                                            <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                                SKU
                                                            </th>

                                                            <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                                Price
                                                            </th>

                                                            <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                                Stock
                                                            </th>

                                                        </tr>
                                                    </thead>

                                                    <tbody>

                                                        {variants.map(
                                                            (variant, index) => (
                                                                <tr
                                                                    key={variant.size}
                                                                    className="border-b border-gray-100 last:border-0 dark:border-gray-700/60"
                                                                >

                                                                    {/* SIZE */}

                                                                    <td className="px-3 py-4">

                                                                        <span className="inline-flex min-w-[45px] items-center justify-center rounded-md bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                                                                            {variant.size}
                                                                        </span>

                                                                    </td>

                                                                    {/* SKU */}

                                                                    <td className="px-3 py-4">

                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                variant.sku
                                                                            }
                                                                            onChange={(
                                                                                event
                                                                            ) =>
                                                                                handleVariantChange(
                                                                                    index,
                                                                                    "sku",
                                                                                    event
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder={`e.g. ${formData.slug || "PRODUCT"}-${variant.size}`}
                                                                            className="form-input w-full"
                                                                        />

                                                                    </td>

                                                                    {/* PRICE */}

                                                                    <td className="px-3 py-4">

                                                                        <div className="relative">

                                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                                                                ₹
                                                                            </span>

                                                                            <input
                                                                                type="number"
                                                                                min="0"
                                                                                value={
                                                                                    variant.price
                                                                                }
                                                                                onChange={(
                                                                                    event
                                                                                ) =>
                                                                                    handleVariantChange(
                                                                                        index,
                                                                                        "price",
                                                                                        event
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                }
                                                                                placeholder="0"
                                                                                className="form-input w-full pl-7"
                                                                                required
                                                                            />

                                                                        </div>

                                                                    </td>

                                                                    {/* STOCK */}

                                                                    <td className="px-3 py-4">

                                                                        <input
                                                                            type="number"
                                                                            min="0"
                                                                            value={
                                                                                variant.stock
                                                                            }
                                                                            onChange={(
                                                                                event
                                                                            ) =>
                                                                                handleVariantChange(
                                                                                    index,
                                                                                    "stock",
                                                                                    event
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="0"
                                                                            className="form-input w-full"
                                                                            required
                                                                        />

                                                                    </td>

                                                                </tr>
                                                            )
                                                        )}

                                                    </tbody>

                                                </table>

                                            </div>

                                        </div>

                                    </section>
                                )}

                                {/* ==================================================
                                    STATUS
                                    ================================================== */}

                                <section className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">

                                    <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">

                                        <h2 className="font-semibold text-gray-900 dark:text-white">
                                            Product Settings
                                        </h2>

                                    </div>

                                    <div className="space-y-4 p-5">

                                        <label className="flex cursor-pointer items-start gap-3">

                                            <input
                                                type="checkbox"
                                                name="active"
                                                checked={
                                                    formData.active
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="form-checkbox mt-0.5 text-violet-600"
                                            />

                                            <div>

                                                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                    Active
                                                </div>

                                                <div className="text-xs text-gray-500">
                                                    Product is
                                                    visible on the
                                                    website.
                                                </div>

                                            </div>

                                        </label>

                                        <label className="flex cursor-pointer items-start gap-3">

                                            <input
                                                type="checkbox"
                                                name="featured"
                                                checked={
                                                    formData.featured
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="form-checkbox mt-0.5 text-violet-600"
                                            />

                                            <div>

                                                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                    Featured
                                                </div>

                                                <div className="text-xs text-gray-500">
                                                    Show this product
                                                    in featured
                                                    sections.
                                                </div>

                                            </div>

                                        </label>

                                    </div>

                                </section>

                                {/* ==================================================
                                    ACTIONS
                                    ================================================== */}

                                <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            window.history.back()
                                        }
                                        className="btn border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn bg-violet-600 text-white shadow-sm hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                                {isEditMode ? "Saving..." : "Creating..."}
                                            </>
                                        ) : (
                                            isEditMode ? "Save Changes" : "Create Product"
                                        )}
                                    </button>

                                </div>

                            </div>
                        </form>

                    </div>
                </main>
            </div>
        </div>
    );
}

export default AddProduct;