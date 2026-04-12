import React, { useEffect, useRef, useState } from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { useNavigate } from "react-router-dom";
import AdminDeleteModal from "../../components/admin/AdminDeleteModal";
import {
  createCategoryForm,
  deleteCategory,
  deleteProduct,
  getCategories,
  getProducts,
  updateCategoryForm,
} from "../../lib/api";

const createEmptyKeyValueEntry = () => ({ key: "", value: "" });

const parseKeyValueField = (value) => {
  if (!value) return [];

  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => ({
        key: String(item?.key || ""),
        value: String(item?.value || ""),
      }))
      .filter((item) => item.key.trim() || item.value.trim());
  } catch {
    return [];
  }
};

const serializeKeyValueField = (items = []) =>
  JSON.stringify(
    items
      .map((item) => ({
        key: String(item?.key || "").trim(),
        value: String(item?.value || "").trim(),
      }))
      .filter((item) => item.key || item.value),
  );

const AdminCategory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showQuickAction, setShowQuickAction] = useState(false);
  const lastScrollYRef = useRef(0);

  const fetchData = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [categoryRes, productRes] = await Promise.all([
        getCategories(),
        getProducts(),
      ]);

      const mappedCategories = (categoryRes?.data || []).map((category) => {
        const image =
          (category.images || []).find((img) => img.is_primary)?.image_url ||
          (category.images || [])[0]?.image_url ||
          "https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=2070";

        const applications = Array.isArray(category.applications)
          ? category.applications.map((app) => {
              if (typeof app === "string") return { text: app };
              if (app && typeof app === "object") {
                const value = app.text || app.title || app.description || "";
                return { text: value };
              }
              return { text: "" };
            })
          : [];

        const materials = (category.material_grades || []).map((grade) => ({
          grade: grade.grade || "",
          standard: grade.standard || "",
          notes: grade.notes || "",
        }));

        const processDetails = parseKeyValueField(category.process);
        const surfaceFinishes = parseKeyValueField(category.surface_finish);

        return {
          id: category.id,
          title: category.name || "",
          description: category.description || "",
          image,
          status: category.is_active === false ? "Draft" : "Published",
          applications,
          processDetails,
          surfaceFinishes,
          materials,
        };
      });

      const mappedProducts = (productRes?.data || []).map((product) => {
        const primaryImage =
          (product.images || []).find((img) => img.is_primary)?.image_url ||
          (product.images || [])[0]?.image_url ||
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070";

        const specCount =
          product.specifications && typeof product.specifications === "object"
            ? Object.keys(product.specifications).length
            : 0;

        return {
          id: product.id,
          title: product.name || "",
          category: product.category?.name || "Uncategorized",
          description: product.description || "",
          image: primaryImage,
          status: product.is_active === false ? "DRAFT" : "PUBLISHED",
          imgCount: (product.images || []).length,
          specCount,
        };
      });

      setCategories(mappedCategories);
      setProducts(mappedProducts);
    } catch (error) {
      setLoadError(error?.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY || 0;
      const delta = current - lastScrollYRef.current;
      const scrollingDown = delta > 4;
      const scrollingUp = delta < -4;

      if (current < 120) {
        setShowQuickAction(false);
      } else if (scrollingDown) {
        setShowQuickAction(false);
      } else if (scrollingUp) {
        setShowQuickAction(true);
      }

      lastScrollYRef.current = current;
    };

    lastScrollYRef.current = window.scrollY || 0;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    type: "category",
    title: "",
    index: null,
  });

  const handleEdit = (category) => {
    setEditingCategory({ ...category, imageFile: null, deletedImages: [] });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setEditingCategory({
      id: Date.now(),
      title: "",
      description: "",
      image: null,
      imageFile: null,
      deletedImages: [],
      status: "Published",
      applications: [{ text: "" }],
      processDetails: [createEmptyKeyValueEntry()],
      surfaceFinishes: [createEmptyKeyValueEntry()],
      materials: [{ grade: "", standard: "", notes: "" }],
    });
    setIsEditing(true);
  };

  const buildCategoryFormData = (category) => {
    const applications = (category.applications || [])
      .filter((app) => app && app.text)
      .map((app) => app.text);

    const material_grades = (category.materials || [])
      .filter((mat) => mat && mat.grade)
      .map((mat, index) => ({
        grade: mat.grade || "",
        standard: mat.standard || "",
        notes: mat.notes || "",
        sort_order: index,
      }));

    const formData = new FormData();
    formData.append("name", category.title || "");
    formData.append("description", category.description || "");
    formData.append("applications", JSON.stringify(applications));
    formData.append("process", serializeKeyValueField(category.processDetails || []));
    formData.append(
      "surface_finish",
      serializeKeyValueField(category.surfaceFinishes || []),
    );
    formData.append("material_grades", JSON.stringify(material_grades));

    if (category.imageFile instanceof File) {
      formData.append("image", category.imageFile);
    }

    const deletedImages = category.deletedImages || [];
    if (deletedImages.length > 0) {
      formData.append("deleted_images", JSON.stringify(deletedImages));
    }

    return formData;
  };

  const handleSave = async () => {
    if (!editingCategory) return;
    setActionLoading(true);
    setActionError("");
    try {
      const payload = buildCategoryFormData(editingCategory);
      const exists = categories.some((c) => c.id === editingCategory.id);
      if (exists) {
        await updateCategoryForm(editingCategory.id, payload);
      } else {
        await createCategoryForm(payload);
      }
      setIsEditing(false);
      await fetchData();
    } catch (error) {
      setActionError(error?.message || "Failed to save category.");
    } finally {
      setActionLoading(false);
    }
  };

  const updateCategory = (field, value) => {
    setEditingCategory({ ...editingCategory, [field]: value });
  };

  const openDeleteConfirmation = (id) => {
    const cat = categories.find((c) => c.id === id);
    setDeleteModal({
      isOpen: true,
      id,
      type: "category",
      title: cat?.title || "this category",
      index: null,
    });
  };

  const openApplicationDelete = (index) => {
    setDeleteModal({
      isOpen: true,
      id: null,
      type: "application",
      title: editingCategory.applications[index]?.text || "this application",
      index,
    });
  };

  const openMaterialDelete = (index) => {
    setDeleteModal({
      isOpen: true,
      id: null,
      type: "material",
      title: editingCategory.materials[index]?.grade || "this material grade",
      index,
    });
  };

  const openKeyValueDelete = (type, field, index, fallbackTitle) => {
    const item = editingCategory?.[field]?.[index];
    setDeleteModal({
      isOpen: true,
      id: null,
      type,
      title: item?.key || item?.value || fallbackTitle,
      index,
    });
  };

  const openProductDeleteConfirmation = (product) => {
    setDeleteModal({
      isOpen: true,
      id: product.id,
      type: "product",
      title: product.title || "this product",
      index: null,
    });
  };

  const redirectToProductEditor = (productId) => {
    navigate("/admin/product", { state: { editProductId: productId } });
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.type === "category") {
      setActionLoading(true);
      setActionError("");
      try {
        await deleteCategory(deleteModal.id);
        setDeleteModal({
          isOpen: false,
          id: null,
          type: "category",
          title: "",
          index: null,
        });
        await fetchData();
      } catch (error) {
        setActionError(error?.message || "Failed to delete category.");
      } finally {
        setActionLoading(false);
      }
      return;
    }
    if (deleteModal.type === "product") {
      setActionLoading(true);
      setActionError("");
      try {
        await deleteProduct(deleteModal.id);
        setDeleteModal({
          isOpen: false,
          id: null,
          type: "category",
          title: "",
          index: null,
        });
        await fetchData();
      } catch (error) {
        setActionError(error?.message || "Failed to delete product.");
      } finally {
        setActionLoading(false);
      }
      return;
    }
    if (deleteModal.type === "application") {
      removeApplication(deleteModal.index);
    } else if (deleteModal.type === "material") {
      removeMaterial(deleteModal.index);
    } else if (deleteModal.type === "process") {
      removeKeyValueItem("processDetails", deleteModal.index);
    } else if (deleteModal.type === "surface_finish") {
      removeKeyValueItem("surfaceFinishes", deleteModal.index);
    }
    setDeleteModal({
      isOpen: false,
      id: null,
      type: "category",
      title: "",
      index: null,
    });
  };

  // Applications Handlers
  const addApplication = () => {
    updateCategory("applications", [
      ...editingCategory.applications,
      { text: "" },
    ]);
  };
  const removeApplication = (index) => {
    updateCategory(
      "applications",
      editingCategory.applications.filter((_, i) => i !== index),
    );
  };
  const updateApplication = (index, field, value) => {
    const newApps = [...editingCategory.applications];
    newApps[index] = { ...newApps[index], [field]: value };
    updateCategory("applications", newApps);
  };

  // Materials Handlers
  const addMaterial = () => {
    updateCategory("materials", [
      ...editingCategory.materials,
      { grade: "", standard: "", notes: "" },
    ]);
  };
  const removeMaterial = (index) => {
    updateCategory(
      "materials",
      editingCategory.materials.filter((_, i) => i !== index),
    );
  };
  const updateMaterial = (index, field, value) => {
    const newMats = [...editingCategory.materials];
    newMats[index] = { ...newMats[index], [field]: value };
    updateCategory("materials", newMats);
  };

  const addKeyValueItem = (field) => {
    updateCategory(field, [
      ...(editingCategory[field] || []),
      createEmptyKeyValueEntry(),
    ]);
  };

  const removeKeyValueItem = (field, index) => {
    updateCategory(
      field,
      (editingCategory[field] || []).filter((_, i) => i !== index),
    );
  };

  const updateKeyValueItem = (field, index, key, value) => {
    const nextItems = [...(editingCategory[field] || [])];
    nextItems[index] = { ...nextItems[index], [key]: value };
    updateCategory(field, nextItems);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingCategory((prev) => {
        const wasExisting = prev.image && !prev.imageFile;
        const deletedImages = wasExisting
          ? [...(prev.deletedImages || []), prev.image]
          : prev.deletedImages || [];
        return {
          ...prev,
          image: URL.createObjectURL(file),
          imageFile: file,
          deletedImages,
        };
      });
    }
  };

  const linkedProducts = editingCategory
    ? products.filter((p) => p.category === editingCategory.title)
    : [];

  const deleteTypeLabel =
    {
      category: "Category",
      product: "Product",
      application: "Application",
      material: "Material",
      process: "Process",
      surface_finish: "Surface Finish",
    }[deleteModal.type] || "Item";

  const renderKeyValueSection = ({
    field,
    title,
    addLabel,
    emptyMessage,
    keyPlaceholder,
    valuePlaceholder,
    deleteType,
  }) => {
    const items = editingCategory?.[field] || [];

    return (
      <div className="bg-white rounded-3xl md:rounded-[3rem] p-6 md:p-10 border border-slate-200 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
          <h4 className="text-xs font-black text-black uppercase tracking-[0.2em]">
            {title}
          </h4>
          <button
            onClick={() => addKeyValueItem(field)}
            className="text-blue-500 hover:text-blue-700 cursor-pointer flex items-center gap-2 text-xs font-black uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-base">
              add_circle
            </span>{" "}
            {addLabel}
          </button>
        </div>
        <div className="border border-slate-200 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[520px]">
            <thead>
              <tr className="bg-[#1b365d] text-white">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">
                  Key
                </th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">
                  Value
                </th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-center w-20">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 && (
                <tr className="bg-white">
                  <td
                    colSpan="3"
                    className="px-8 py-8 text-xs font-bold text-slate-400 text-center"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
              {items.map((item, idx) => (
                <tr
                  key={`${field}-${idx}`}
                  className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                >
                  <td className="px-8 py-4">
                    <input
                      type="text"
                      value={item.key}
                      onChange={(e) =>
                        updateKeyValueItem(field, idx, "key", e.target.value)
                      }
                      placeholder={keyPlaceholder}
                      className="bg-transparent border-none outline-none text-xs font-black text-black w-full"
                    />
                  </td>
                  <td className="px-8 py-4">
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) =>
                        updateKeyValueItem(field, idx, "value", e.target.value)
                      }
                      placeholder={valuePlaceholder}
                      className="bg-transparent border-none outline-none text-xs font-medium text-black w-full"
                    />
                  </td>
                  <td className="px-8 py-4 text-center">
                    <button
                      onClick={() =>
                        openKeyValueDelete(
                          deleteType,
                          field,
                          idx,
                          "this item",
                        )
                      }
                      className="text-black/50 hover:text-red-500 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">
                        remove_circle
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif]">
      {/* UI Tools: Modals */}
      <AdminDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteTypeLabel}?`}
        message={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone.`}
      />
      <AdminNavbar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 py-12 space-y-10">
        {!isEditing ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 pb-4">
              <div className="space-y-4 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-black font-black text-xs tracking-widest uppercase">
                  <span className="material-symbols-outlined text-base">
                    category
                  </span>
                  CATEGORY MANAGEMENT
                </div>
                <h1 className="text-3xl md:text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                  CATEGORY{" "}
                </h1>
                <p className="text-black font-medium max-w-2xl leading-relaxed text-sm">
                  Define high-level manufacturing categories, their technical
                  applications, process details, surface finishes, and material competencies.
                </p>
              </div>
              <button
                onClick={handleAddNew}
                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Create New Category
              </button>
            </div>

            {loadError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-6 py-4 rounded-2xl">
                {loadError}
              </div>
            )}
            {actionError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-6 py-4 rounded-2xl">
                {actionError}
              </div>
            )}
            {loading && (
              <div className="bg-white border border-slate-200 text-slate-500 text-xs font-bold px-6 py-4 rounded-2xl">
                Loading categories...
              </div>
            )}
            {actionLoading && !loading && (
              <div className="bg-white border border-slate-200 text-slate-500 text-xs font-bold px-6 py-4 rounded-2xl">
                Saving changes...
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white rounded-3xl md:rounded-[2.5rem] border border-slate-200 overflow-hidden flex flex-col hover:border-blue-300 transition-all group shadow-sm"
                >
                  <div className="p-6 md:p-8 flex flex-col sm:flex-row gap-6 md:gap-8">
                    <div className="w-full sm:w-32 md:w-40 aspect-square sm:aspect-auto sm:h-32 md:h-40 bg-slate-100 rounded-2xl md:rounded-3xl overflow-hidden flex-shrink-0">
                      <img
                        src={cat.image}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt=""
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg md:text-xl font-black text-black">
                          {cat.title}
                        </h3>
                        <span className="px-3 py-1 bg-green-50 text-black text-xs font-black rounded-lg uppercase whitespace-nowrap">
                          {cat.status}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-black leading-relaxed line-clamp-3">
                        {cat.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-slate-50 text-black/60 text-xs font-black px-3 py-1 rounded-lg uppercase tracking-widest">
                          {cat.applications.length} Applications
                        </span>
                        <span className="bg-slate-50 text-black/60 text-xs font-black px-3 py-1 rounded-lg uppercase tracking-widest">
                          {(cat.processDetails || []).length} Process Entries
                        </span>
                        <span className="bg-slate-50 text-black/60 text-xs font-black px-3 py-1 rounded-lg uppercase tracking-widest">
                          {(cat.surfaceFinishes || []).length} Surface Finishes
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="flex-1 md:flex-none bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg cursor-pointer"
                          >
                            Edit Properties
                          </button>
                          <button
                            onClick={() => openDeleteConfirmation(cat.id)}
                            className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-black/30 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
                            title="Delete Category"
                          >
                            <span className="material-symbols-outlined text-xl">
                              delete
                            </span>
                          </button>
                        </div>
                        <div className="text-xs font-bold text-black uppercase tracking-widest text-right">
                          {
                            products.filter((p) => p.category === cat.title)
                              .length
                          }{" "}
                          Linked Products
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Category Editor */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="sticky top-16 z-40 bg-slate-50/90 backdrop-blur-md border border-slate-200 rounded-2xl px-5 py-4 md:px-8 md:py-5 flex items-center justify-between shadow-sm">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 text-black hover:text-black transition-colors font-bold text-xs uppercase tracking-widest cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">
                  arrow_back
                </span>
                Discard Changes
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-10 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={actionLoading}
              >
                {actionLoading ? "Saving..." : "Save Category"}
              </button>
            </div>

            <div className="px-1">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Category Workspace</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">
                Update category details, applications, process and linked product context in one place.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Basic Info */}
              <div className="lg:col-span-12 space-y-10">
                <div className="bg-white/95 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-slate-200 shadow-[0_20px_45px_-25px_rgba(15,23,42,0.35)] ring-1 ring-slate-100 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                  <div className="md:col-span-4 space-y-6">
                    <label className="text-xs font-black text-black uppercase tracking-[0.2em] block pl-1">
                      Category Visual
                    </label>
                    <div
                      onClick={() => document.getElementById("cat-img").click()}
                      className="aspect-square w-full sm:w-64 md:w-full mx-auto rounded-3xl md:rounded-[2rem] border-2 border-dashed border-blue-100 bg-blue-50/20 flex flex-col items-center justify-center text-center gap-4 cursor-pointer hover:bg-blue-50 transition-all overflow-hidden relative group"
                    >
                      {editingCategory.image ? (
                        <img
                          src={editingCategory.image}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        <span className="material-symbols-outlined text-blue-500 text-4xl">
                          add_photo_alternate
                        </span>
                      )}
                      <input
                        id="cat-img"
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <div className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-black text-xs uppercase tracking-widest">
                        Change Image
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-8 space-y-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-black uppercase tracking-[0.2em] block pl-1">
                        Category Title
                      </label>
                      <input
                        type="text"
                        value={editingCategory.title}
                        onChange={(e) =>
                          updateCategory("title", e.target.value)
                        }
                        placeholder="Industrial Group Name"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-lg md:text-xl font-black text-black outline-none focus:border-blue-400 focus:bg-white transition-all shadow-inner"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-black uppercase tracking-[0.2em] block pl-1">
                        Strategic Description
                      </label>
                      <textarea
                        value={editingCategory.description}
                        onChange={(e) =>
                          updateCategory("description", e.target.value)
                        }
                        placeholder="Overview of this manufacturing capability..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl px-5 md:px-6 py-4 md:py-5 text-sm font-medium text-black outline-none focus:border-blue-400 focus:bg-white transition-all min-h-[140px] md:min-h-[160px] leading-relaxed shadow-inner resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Applications Section */}
                <div className="bg-white/95 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-slate-200 shadow-[0_20px_45px_-25px_rgba(15,23,42,0.25)] ring-1 ring-slate-100 space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
                    <h4 className="text-xs font-black text-black uppercase tracking-[0.2em]">
                      Industry Specific Applications
                    </h4>
                    <button
                      onClick={addApplication}
                      className="text-blue-500 hover:text-blue-700 cursor-pointer flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                    >
                      <span className="material-symbols-outlined text-base">
                        add_circle
                      </span>{" "}
                      Add Application
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {editingCategory.applications.map((app, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 rounded-3xl p-6 space-y-4 relative border border-transparent hover:border-blue-100 transition-all group/app"
                      >
                        <button
                          onClick={() => openApplicationDelete(idx)}
                          className="absolute -top-2 -right-2 bg-white text-black/30 w-8 h-8 rounded-full flex items-center justify-center shadow-md opacity-100 sm:opacity-0 sm:group-hover/app:opacity-100 hover:text-red-500 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            close
                          </span>
                        </button>
                        <input
                          type="text"
                          value={app.text}
                          onChange={(e) =>
                            updateApplication(idx, "text", e.target.value)
                          }
                          placeholder="Application of categoryNow "
                          className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold text-black outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {renderKeyValueSection({
                  field: "processDetails",
                  title: "Process Details",
                  addLabel: "Add Process Entry",
                  emptyMessage: "No process entries added yet.",
                  keyPlaceholder: "e.g. Process",
                  valuePlaceholder: "e.g. CNC Turning",
                  deleteType: "process",
                })}

                {renderKeyValueSection({
                  field: "surfaceFinishes",
                  title: "Surface Finish Options",
                  addLabel: "Add Surface Finish",
                  emptyMessage: "No surface finish entries added yet.",
                  keyPlaceholder: "e.g. Finish Type",
                  valuePlaceholder: "e.g. Nickel Plating",
                  deleteType: "surface_finish",
                })}

                {/* Materials Table Section */}
                <div className="bg-white/95 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-slate-200 shadow-[0_20px_45px_-25px_rgba(15,23,42,0.25)] ring-1 ring-slate-100 space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
                    <h4 className="text-xs font-black text-black uppercase tracking-[0.2em]">
                      Validated Material Competencies
                    </h4>
                    <button
                      onClick={addMaterial}
                      className="text-blue-500 hover:text-blue-700 cursor-pointer flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                    >
                      <span className="material-symbols-outlined text-base">
                        add_circle
                      </span>{" "}
                      Add Material
                    </button>
                  </div>
                  <div className="border border-slate-200 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="bg-[#1b365d] text-white">
                          <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">
                            Material Grade
                          </th>
                          <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">
                            Industry Standard
                          </th>
                          <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">
                            Technical Notes
                          </th>
                          <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-center w-20">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {editingCategory.materials.map((mat, idx) => (
                          <tr
                            key={idx}
                            className={
                              idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                            }
                          >
                            <td className="px-8 py-4">
                              <input
                                type="text"
                                value={mat.grade}
                                onChange={(e) =>
                                  updateMaterial(idx, "grade", e.target.value)
                                }
                                placeholder="e.g. Titanium Gr 5"
                                className="bg-transparent border-none outline-none text-xs font-black text-black w-full"
                              />
                            </td>
                            <td className="px-8 py-4">
                              <input
                                type="text"
                                value={mat.standard}
                                onChange={(e) =>
                                  updateMaterial(
                                    idx,
                                    "standard",
                                    e.target.value,
                                  )
                                }
                                placeholder="ASTM-X"
                                className="bg-transparent border-none outline-none text-xs font-bold text-black w-full"
                              />
                            </td>
                            <td className="px-8 py-4">
                              <input
                                type="text"
                                value={mat.notes}
                                onChange={(e) =>
                                  updateMaterial(idx, "notes", e.target.value)
                                }
                                placeholder="Enter details..."
                                className="bg-transparent border-none outline-none text-xs font-medium text-black w-full"
                              />
                            </td>
                            <td className="px-8 py-4 text-center">
                              <button
                                onClick={() => openMaterialDelete(idx)}
                                className="text-black/50 hover:text-red-500 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-base">
                                  remove_circle
                                </span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Linked Products View */}
                <div className="space-y-10 pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-black uppercase tracking-[0.2em]">
                        Associated Portfolio
                      </h4>
                      <h3 className="text-xl md:text-2xl font-black text-black">
                        {editingCategory.title || "Category Group"} Products
                      </h3>
                    </div>
                    <div className="bg-blue-50/50 rounded-2xl px-6 py-3 border border-blue-100/50 w-fit">
                      <span className="text-black font-black text-sm">
                        {linkedProducts.length} Currently Mapped
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {linkedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white rounded-3xl md:rounded-[2.5rem] border border-slate-100 overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500"
                      >
                        {/* Card Image */}
                        <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                          <img
                            src={p.image}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            alt=""
                          />
                          <div className="absolute top-4 left-4 md:top-5 md:left-5">
                            <span className="bg-green-500 text-white text-xs md:text-xs font-black px-3 md:px-4 py-1 md:py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-green-500/20">
                              {p.status}
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 md:p-8 space-y-5">
                          <div className="space-y-3">
                            <div className="flex flex-col gap-2">
                              <h4 className="text-base md:text-lg font-black text-black tracking-tight">
                                {p.title}
                              </h4>
                              <span className="bg-slate-50 text-black text-xs font-black px-2 py-1 rounded-sm uppercase tracking-tighter border border-slate-100 w-fit">
                                {p.category}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-black leading-relaxed line-clamp-2">
                              {p.description}
                            </p>
                          </div>

                          {/* Card Bottom: Icons Row */}
                          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-4 md:gap-6">
                              <div className="flex items-center gap-2 text-black/30">
                                <span className="material-symbols-outlined text-lg">
                                  image
                                </span>
                                <span className="text-xs font-bold text-black">
                                  {p.imgCount}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-black/30">
                                <span className="material-symbols-outlined text-lg">
                                  accessibility_new
                                </span>
                                <span className="text-xs font-bold text-black whitespace-nowrap">
                                  {p.specCount} Specs
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => redirectToProductEditor(p.id)}
                                title="Edit product"
                                className="w-9 h-9 md:w-10 md:h-10 bg-slate-50/50 border border-slate-50 rounded-xl flex items-center justify-center text-black hover:bg-blue-50 hover:text-black transition-all cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-base font-bold">
                                  edit_note
                                </span>
                              </button>
                              <button
                                onClick={() => openProductDeleteConfirmation(p)}
                                title="Delete product"
                                className="w-9 h-9 md:w-10 md:h-10 bg-slate-50/50 border border-slate-50 rounded-xl flex items-center justify-center text-black hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-base">
                                  delete
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {linkedProducts.length === 0 && (
                      <div className="lg:col-span-3 py-20 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[3rem] text-center">
                        <span className="material-symbols-outlined text-black/50 text-6xl mb-4 block">
                          inventory_2
                        </span>
                        <p className="text-black/30 font-black text-xs uppercase tracking-[0.2em] italic">
                          No products currently mapped to this industrial group
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      {!isEditing && (
        <button
          onClick={handleAddNew}
          className={`fixed bottom-6 right-6 z-40 bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/30 transition-all duration-200 hover:bg-blue-700 flex items-center gap-2 ${
            showQuickAction ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <span className="material-symbols-outlined text-sm leading-none">add</span>
          <span>Create New Category</span>
        </button>
      )}
    </div>
  );
};

export default AdminCategory;
