import React, { useEffect, useRef, useState } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { useToast } from '../../contexts/ToastContext';
import { useLocation, useNavigate } from "react-router-dom";
import AdminDeleteModal from '../../components/admin/AdminDeleteModal';
import { createProductForm, deleteProduct, getCategories, getProducts, updateProductForm } from '../../lib/api';

const AdminProduct = () => {
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const requestedEditProductId = location.state?.editProductId ?? null;
  const hasConsumedRouteEditRef = useRef(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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
      const [productRes, categoryRes] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      const mappedProducts = (productRes?.data || []).map((product) => {
        const specs = product.specifications && typeof product.specifications === "object"
          ? Object.entries(product.specifications).map(([label, value]) => ({
              label,
              value: value === null || value === undefined ? "" : String(value),
            }))
          : [];

        return {
          id: product.id,
          title: product.name || "",
          description: product.description || "",
          images: (product.images || []).map((img) => img.image_url),
          applications: Array.isArray(product.applications) ? product.applications : [],
          materials: Array.isArray(product.material_grades)
            ? product.material_grades.map((grade) => ({
                grade: grade.grade || "",
                standard: grade.standard || "",
                notes: grade.notes || "",
              }))
            : [],
          specs,
          category: product.category?.name || "Uncategorized",
          status: product.is_active === false ? "Draft" : "Published",
        };
      });

      const mappedCategories = (categoryRes?.data || []).map((category) => ({
        id: category.id,
        name: category.name || "",
      }));

      setProducts(mappedProducts);
      setCategories(mappedCategories);
    } catch (error) {
      setLoadError(error?.message || "Failed to load products.");
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
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ 
    isOpen: false, 
    id: null, 
    title: "" 
  });

  const handleEdit = (product) => {
    const images = (product.images || []).map((url) => ({
      url,
      file: null,
      existing: true,
    }));
    setEditingProduct({ ...product, images, deletedImages: [] });
    setIsEditing(true);
  };

  useEffect(() => {
    if (!requestedEditProductId || loading || isEditing || hasConsumedRouteEditRef.current) {
      return;
    }

    const productToEdit = products.find((product) => product.id === requestedEditProductId);
    if (!productToEdit) {
      return;
    }

    const images = (productToEdit.images || []).map((url) => ({
      url,
      file: null,
      existing: true,
    }));

    hasConsumedRouteEditRef.current = true;
    setEditingProduct({ ...productToEdit, images, deletedImages: [] });
    setIsEditing(true);
    navigate(location.pathname, { replace: true, state: {} });
  }, [requestedEditProductId, loading, isEditing, products, navigate, location.pathname]);

  const handleAddNew = () => {
    setEditingProduct({
      id: Date.now(),
      title: "",
      description: "",
      images: [],
      deletedImages: [],
      applications: [""],
      materials: [{ grade: "", standard: "", notes: "" }],
      specs: [{ label: "", value: "" }],
      category: categories[0]?.name || "Uncategorized",
      status: "Published"
    });
    setIsEditing(true);
  };

  const buildProductFormData = (product) => {
    const categoryMatch = categories.find((cat) => cat.name === product.category);
    const specifications = (product.specs || []).reduce((acc, spec) => {
      if (spec?.label) {
        acc[spec.label] = spec.value ?? "";
      }
      return acc;
    }, {});

    const formData = new FormData();
    formData.append("name", product.title || "");
    formData.append("description", product.description || "");
    const categoryId = categoryMatch?.id ?? "";
    formData.append("category_id", categoryId === "" ? "" : String(categoryId));
    formData.append(
      "applications",
      JSON.stringify((product.applications || []).filter((item) => item)),
    );
    formData.append("specifications", JSON.stringify(specifications));
    formData.append(
      "material_grades",
      JSON.stringify(
        (product.materials || [])
          .filter((item) => item && item.grade)
          .map((item, index) => ({
            grade: item.grade || "",
            standard: item.standard || "",
            notes: item.notes || "",
            sort_order: index,
          })),
      ),
    );

    const newFiles = (product.images || []).filter((img) => img.file instanceof File);
    if (newFiles.length > 0) {
      formData.append("image", newFiles[0].file);
      if (newFiles.length > 1) {
        newFiles.slice(1).forEach((img) => formData.append("images", img.file));
      }
    }

    const deletedImages = product.deletedImages || [];
    if (deletedImages.length > 0) {
      formData.append("deleted_images", JSON.stringify(deletedImages));
    }

    return formData;
  };

  const handleSave = async () => {
    if (!editingProduct) return;
    setActionLoading(true);
    setActionError("");
    try {
      const payload = buildProductFormData(editingProduct);
      const exists = products.some((p) => p.id === editingProduct.id);
      if (exists) {
        await updateProductForm(editingProduct.id, payload);
        toast.success("Edited successfully");
      } else {
        await createProductForm(payload);
        toast.success("Saved successfully");
      }
      setIsEditing(false);
      await fetchData();
    } catch (error) {
      toast.error("Failed");
      setActionError(error?.message || "Failed to save product.");
    } finally {
      setActionLoading(false);
    }
  };

  const openDeleteConfirmation = (id) => {
    const prod = products.find(p => p.id === id);
    setDeleteModal({
      isOpen: true,
      id,
      title: prod?.title || "this product"
    });
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    setActionError("");
    try {
      await deleteProduct(id);
      toast.success("Deleted successfully");
      setDeleteModal({ isOpen: false, id: null, title: "" });
      await fetchData();
    } catch (error) {
      toast.error("Failed");
      setActionError(error?.message || "Failed to delete product.");
    } finally {
      setActionLoading(false);
    }
  };

  const updateProduct = (field, value) => {
    setEditingProduct({ ...editingProduct, [field]: value });
  };

  const addArrayItem = (field) => {
    updateProduct(field, [...editingProduct[field], ""]);
  };

  const removeArrayItem = (field, index) => {
    updateProduct(field, editingProduct[field].filter((_, i) => i !== index));
  };

  const updateArrayItem = (field, index, value) => {
    const newArr = [...editingProduct[field]];
    newArr[index] = value;
    updateProduct(field, newArr);
  };

  const addSpec = () => {
    updateProduct('specs', [...editingProduct.specs, { label: "", value: "" }]);
  };

  const removeSpec = (index) => {
    updateProduct('specs', editingProduct.specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index, field, value) => {
    const newSpecs = [...editingProduct.specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    updateProduct('specs', newSpecs);
  };

  const addMaterial = () => {
    updateProduct('materials', [...editingProduct.materials, { grade: "", standard: "", notes: "" }]);
  };

  const removeMaterial = (index) => {
    updateProduct('materials', editingProduct.materials.filter((_, i) => i !== index));
  };

  const updateMaterial = (index, field, value) => {
    const newMaterials = [...editingProduct.materials];
    newMaterials[index] = { ...newMaterials[index], [field]: value };
    updateProduct('materials', newMaterials);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const nextImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      existing: false,
    }));
    setEditingProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...nextImages],
    }));
  };

  const removeImage = (index) => {
    const image = editingProduct.images[index];
    const remaining = editingProduct.images.filter((_, i) => i !== index);
    const deletedImages = image?.existing
      ? [...(editingProduct.deletedImages || []), image.url]
      : editingProduct.deletedImages || [];
    setEditingProduct((prev) => ({
      ...prev,
      images: remaining,
      deletedImages,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif]">
      {/* UI Tools: Modals */}
      <AdminDeleteModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={() => handleDelete(deleteModal.id)}
        title="Delete Product?"
        message={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone.`}
      />
      <AdminNavbar />
      
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 py-12 space-y-10">
        {!isEditing ? (
          <>
            {/* List View Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-black font-black text-xs tracking-widest uppercase">
                   <span className="material-symbols-outlined text-base">inventory_2</span>
                   PRODUCT
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Product Management</h1>
                <p className="text-black font-medium max-w-2xl leading-relaxed text-sm">
                  Organize and showcase your high-precision manufacturing products with technical depth.
                </p>
              </div>
              <button 
                onClick={handleAddNew}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add New Product
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
                Loading products...
              </div>
            )}
            {actionLoading && !loading && (
              <div className="bg-white border border-slate-200 text-slate-500 text-xs font-bold px-6 py-4 rounded-2xl">
                Saving changes...
              </div>
            )}

            {/* Product Cards Grid */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((prod) => (
                <div key={prod.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden flex flex-col hover:border-blue-300 transition-all group shadow-sm">
                  {/* Image Preview Container */}
                  <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                    {prod.images.length > 0 ? (
                      <img src={prod.images[0]} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-black/50">
                        <span className="material-symbols-outlined text-5xl font-light">image</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${prod.status === 'Published' ? 'bg-green-500/90 text-white' : 'bg-slate-500/90 text-black'}`}>
                        {prod.status}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-8 space-y-4 flex-1 flex flex-col">
                    <div className="space-y-2">
                       <div className="flex items-center gap-2">
                         <h3 className="text-lg font-black text-black line-clamp-1">{prod.title}</h3>
                         <span className="bg-slate-100 text-black text-xs font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                           {prod.category}
                         </span>
                       </div>
                       <p className="text-xs font-medium text-black line-clamp-2 leading-relaxed">
                         {prod.description}
                       </p>
                    </div>

                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                       <div className="flex items-center gap-4 text-black">
                          <div className="flex items-center gap-1.5">
                             <span className="material-symbols-outlined text-base">photo_library</span>
                             <span className="text-xs font-bold">{prod.images.length}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                             <span className="material-symbols-outlined text-base">settings_accessibility</span>
                             <span className="text-xs font-bold">{prod.specs.length} Specs</span>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEdit(prod)}
                            className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-black hover:bg-blue-50 hover:text-black transition-all cursor-pointer shadow-sm"
                          >
                             <span className="material-symbols-outlined text-xl font-bold">edit_note</span>
                          </button>
                          <button 
                            onClick={() => openDeleteConfirmation(prod.id)}
                            className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-black hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer shadow-sm"
                          >
                             <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}
          </>
        ) : (
          /* Editor View */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Nav / Actions */}
            <div className="sticky top-16 z-40 bg-gradient-to-r from-slate-50/95 via-white/95 to-slate-50/95 backdrop-blur-md border border-slate-200 rounded-2xl px-5 py-4 md:px-8 md:py-5 flex items-center justify-between shadow-sm ring-1 ring-slate-100">
               <button 
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 text-black hover:text-black transition-colors font-bold text-xs uppercase tracking-widest cursor-pointer"
               >
                 <span className="material-symbols-outlined text-base">arrow_back</span>
                 Discard & Return
               </button>
               <div className="flex items-center gap-4">
                  <select 
                    value={editingProduct.status}
                    onChange={(e) => updateProduct('status', e.target.value)}
                    className="bg-slate-100 border-none outline-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-slate-200 transition-all"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                  <button 
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-10 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Saving..." : "Save Changes"}
                  </button>
               </div>
            </div>

            <div className="px-1">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Product Workspace</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">
                Manage identity, media, specs, applications, and material grades with a single full-screen workflow.
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-black uppercase tracking-widest">
                  {(editingProduct?.images || []).length} Images
                </span>
                <span className="px-3 py-1 rounded-lg bg-sky-50 text-sky-700 text-[11px] font-black uppercase tracking-widest">
                  {(editingProduct?.applications || []).length} Applications
                </span>
                <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-black uppercase tracking-widest">
                  {(editingProduct?.specs || []).length} Specs
                </span>
                <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-black uppercase tracking-widest">
                  {(editingProduct?.materials || []).length} Materials
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               {/* Left: Core Info & Images */}
               <div className="lg:col-span-12 space-y-12">
                  <div className="relative overflow-hidden bg-white/95 rounded-[2.5rem] p-10 md:p-12 border border-slate-200 shadow-[0_20px_45px_-25px_rgba(15,23,42,0.35)] ring-1 ring-slate-100 space-y-12">
                     <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500/60 via-sky-400/40 to-indigo-500/60"></div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Title & Description */}
                        <div className="space-y-10">
                           <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-black text-black uppercase tracking-[0.2em] block pl-1">Product Identity</label>
                                <div className="flex items-center gap-3">
                                  <label className="text-xs font-black text-black uppercase tracking-[0.2em]">Category:</label>
                  <select 
                    value={editingProduct.category}
                    onChange={(e) => updateProduct('category', e.target.value)}
                    className="bg-slate-100 border-none outline-none px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-slate-200 transition-all text-black"
                  >
                    {categories.length === 0 && (
                      <option value={editingProduct.category}>{editingProduct.category}</option>
                    )}
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
                              <input 
                                type="text"
                                placeholder="Product Title"
                                value={editingProduct.title}
                                onChange={(e) => updateProduct('title', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-xl font-black text-black outline-none focus:border-blue-400 focus:bg-white transition-all shadow-inner"
                              />
                           </div>
                           <div className="space-y-3">
                              <label className="text-xs font-black text-black uppercase tracking-[0.2em] block pl-1">Technical Storytelling</label>
                              <textarea 
                                placeholder="Describe the engineering depth and quality aspects..."
                                value={editingProduct.description}
                                onChange={(e) => updateProduct('description', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-6 text-sm font-medium text-black outline-none focus:border-blue-400 focus:bg-white transition-all min-h-[220px] leading-relaxed shadow-inner resize-none"
                              />
                           </div>
                        </div>

                        {/* Image Management */}
                        <div className="space-y-5">
           <label className="text-xs font-black text-black uppercase tracking-[0.2em] block pl-1">Portfolio Gallery</label>
                           <div className="grid grid-cols-2 gap-4">
                              {editingProduct.images.map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group">
                                   <img src={img.url} alt="" className="w-full h-full object-cover" />
                                   
                                   {/* Image Type Label */}
                                   <div className="absolute top-2 left-2 z-10">
                                      <span className="bg-black/80 backdrop-blur-sm text-xs font-black uppercase tracking-tight px-2 py-1 rounded-md text-white shadow-sm">
                                         {idx === 0 ? 'Cover Image' : 'Other Image'}
                                      </span>
                                   </div>

                                   <button 
                                    onClick={() => removeImage(idx)}
                                    className="absolute inset-0 bg-red-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer z-20"
                                   >
                                      <span className="material-symbols-outlined font-black">delete</span>
                                   </button>
                                </div>
                              ))}
                              <div 
                                onClick={() => document.getElementById('image-upload').click()}
                                className="aspect-square rounded-2xl border-2 border-dashed border-blue-100 bg-blue-50/20 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all group"
                              >
                                 <input 
                                  id="image-upload"
                                  type="file"
                                  className="hidden"
                                  multiple
                                  accept="image/*"
                                  onChange={handleFileChange}
                                 />
                                 <span className="material-symbols-outlined text-blue-500 group-hover:scale-110 transition-transform">add_photo_alternate</span>
                                 <span className="text-xs font-black text-black/30 uppercase tracking-widest pl-2 pr-2">
                                    {editingProduct.images.length === 0 ? "Upload Cover Image" : "Upload Other Image"}
                                 </span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 border-t border-slate-50 pt-12">
                        {/* Industrial Applications */}
                        <div className="space-y-6">
                           <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <h4 className="text-xs font-black text-black uppercase tracking-[0.2em]">Application Hub</h4>
                              <button onClick={() => addArrayItem('applications')} className="text-blue-500 hover:text-blue-700 cursor-pointer">
                                 <span className="material-symbols-outlined text-sm font-black">add_circle</span>
                              </button>
                           </div>
                           <div className="space-y-3">
                              {editingProduct.applications.map((app, idx) => (
                                <div key={idx} className="flex gap-2">
                                   <input 
                                    type="text"
                                    placeholder="e.g. Endoscopic Tools"
                                    value={app}
                                    onChange={(e) => updateArrayItem('applications', idx, e.target.value)}
                                    className="flex-1 bg-slate-50 border border-slate-50 rounded-xl px-4 py-3 text-xs font-bold text-black outline-none focus:bg-white focus:border-blue-200"
                                   />
                                   <button onClick={() => removeArrayItem('applications', idx)} className="text-slate-200 hover:text-red-400 cursor-pointer">
                                      <span className="material-symbols-outlined text-base">remove_circle</span>
                                   </button>
                                </div>
                              ))}
                           </div>
                        </div>

                        {/* Technical Specs */}
                        <div className="space-y-6">
                           <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <h4 className="text-xs font-black text-black uppercase tracking-[0.2em]">Tech Specs Matrix</h4>
                              <button onClick={addSpec} className="text-blue-500 hover:text-blue-700 cursor-pointer">
                                 <span className="material-symbols-outlined text-sm font-black">add_circle</span>
                              </button>
                           </div>
                           
                           <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                              {/* Table Header - Hidden on mobile */}
                              <div className="hidden sm:flex bg-[#1b365d] px-8 py-4 items-center justify-between">
                                 <span className="text-xs font-black text-white uppercase tracking-widest">Parameter / Property</span>
                                 <span className="text-xs font-black text-white uppercase tracking-widest mr-12">Verified Value</span>
                              </div>
                              
                              {/* Table Body */}
                              <div className="divide-y divide-slate-100">
                                 {editingProduct.specs.map((spec, idx) => (
                                   <div key={idx} className={`flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 px-6 sm:px-8 py-5 relative group/spec transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                      <div className="flex-1 space-y-1 sm:space-y-0">
                                        <label className="sm:hidden text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Parameter</label>
                                        <input 
                                         type="text"
                                         placeholder="e.g. Density"
                                         value={spec.label}
                                         onChange={(e) => updateSpec(idx, 'label', e.target.value)}
                                         className="w-full bg-slate-50/50 sm:bg-transparent border border-slate-100 sm:border-none rounded-lg sm:rounded-none px-3 py-2 sm:p-0 outline-none text-xs font-black text-black placeholder:text-black/30 transition-all focus:bg-white sm:focus:bg-transparent"
                                        />
                                      </div>
                                      
                                      <div className="flex-1 space-y-1 sm:space-y-0">
                                        <label className="sm:hidden text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Verified Value</label>
                                        <input 
                                         type="text"
                                         placeholder="e.g. 8.5 g/cmÂ³"
                                         value={spec.value}
                                         onChange={(e) => updateSpec(idx, 'value', e.target.value)}
                                         className="w-full bg-slate-50/50 sm:bg-transparent border border-slate-100 sm:border-none rounded-lg sm:rounded-none px-3 py-2 sm:p-0 outline-none text-xs font-bold text-black sm:text-right placeholder:text-black/30 sm:mr-10 transition-all focus:bg-white sm:focus:bg-transparent"
                                        />
                                      </div>
                                      
                                      <button 
                                       onClick={() => removeSpec(idx)}
                                       className="absolute top-4 right-4 sm:static text-slate-300 hover:text-red-500 transition-colors opacity-100 sm:opacity-0 sm:group-hover/spec:opacity-100 cursor-pointer p-1"
                                      >
                                         <span className="material-symbols-outlined text-base">remove_circle</span>
                                      </button>
                                   </div>
                                 ))}

                                 {editingProduct.specs.length === 0 && (
                                   <div className="p-12 text-center">
                                      <p className="text-xs font-black text-black/30 uppercase tracking-widest">No technical specs added yet</p>
                                   </div>
                                 )}
                              </div>
                           </div>
                        </div>

                        <div className="space-y-8 lg:col-span-2">
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
                                  {editingProduct.materials.map((item, idx) => (
                                    <tr
                                      key={idx}
                                      className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                                    >
                                      <td className="px-8 py-4">
                                        <input
                                          type="text"
                                          value={item.grade}
                                          onChange={(e) => updateMaterial(idx, 'grade', e.target.value)}
                                          placeholder="e.g. Titanium Gr 5"
                                          className="bg-transparent border-none outline-none text-xs font-black text-black w-full"
                                        />
                                      </td>
                                      <td className="px-8 py-4">
                                        <input
                                          type="text"
                                          value={item.standard}
                                          onChange={(e) => updateMaterial(idx, 'standard', e.target.value)}
                                          placeholder="ASTM-X"
                                          className="bg-transparent border-none outline-none text-xs font-bold text-black w-full"
                                        />
                                      </td>
                                      <td className="px-8 py-4">
                                        <input
                                          type="text"
                                          value={item.notes}
                                          onChange={(e) => updateMaterial(idx, 'notes', e.target.value)}
                                          placeholder="Enter details..."
                                          className="bg-transparent border-none outline-none text-xs font-medium text-black w-full"
                                        />
                                      </td>
                                      <td className="px-8 py-4 text-center">
                                        <button
                                          onClick={() => removeMaterial(idx)}
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
          <span>Add New Product</span>
        </button>
      )}
    </div>
  );
};

export default AdminProduct;
