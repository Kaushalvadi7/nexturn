import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { useToast } from '../../contexts/ToastContext';
import AdminDeleteModal from '../../components/admin/AdminDeleteModal';
import AdminCreateMaterialModal from '../../components/admin/AdminCreateMaterialModal';
import {
  createMaterialSpecialization,
  deleteMaterialSpecialization,
  getMaterialSpecializations,
  updateMaterialSpecialization,
  uploadImage,
} from '../../lib/api';

const createEmptyMaterial = () => ({
  id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  title: '',
  description: '',
  image: '',
  publicUrl: '',
  grades: [''],
  applications: [''],
  isUploadingImage: false,
});

const normalizeMaterialDraft = (material) => ({
  image: String(material.image || '').trim(),
  publicUrl: String(material.publicUrl || '').trim(),
  title: String(material.title || '').trim(),
  description: String(material.description || '').trim(),
  grades: (Array.isArray(material.grades) ? material.grades : []).map((item) => String(item || '').trim()).filter(Boolean),
  applications: (Array.isArray(material.applications) ? material.applications : []).map((item) => String(item || '').trim()).filter(Boolean),
});

const getMaterialValidationErrors = (material) => {
  const normalized = normalizeMaterialDraft(material);
  return {
    image: normalized.image ? '' : 'Image is required.',
    title: normalized.title ? '' : 'Title is required.',
    description: normalized.description ? '' : 'Description is required.',
    grades: normalized.grades.length > 0 ? '' : 'At least 1 grade is required.',
    applications: normalized.applications.length > 0 ? '' : 'At least 1 application is required.',
  };
};

const hasMaterialValidationErrors = (errors) => Object.values(errors).some(Boolean);

const mapMaterialFromApi = (material) => ({
  id: material.id,
  title: material.title || '',
  description: material.description || '',
  image: material.image_url || '',
  publicUrl: material.public_url || '',
  grades: Array.isArray(material.grades) && material.grades.length ? material.grades : [''],
  applications:
    Array.isArray(material.common_application) && material.common_application.length
      ? material.common_application
      : [''],
  isUploadingImage: false,
  isDirty: false,
});

const AdminMaterials = () => {
  const toast = useToast();
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: '' });
  const [savingIds, setSavingIds] = useState(() => new Set());
  const [createModal, setCreateModal] = useState({ isOpen: false, token: 0 });
  const [createForm, setCreateForm] = useState(createEmptyMaterial());
  const [createErrors, setCreateErrors] = useState({
    image: '',
    title: '',
    description: '',
    grades: '',
    applications: '',
  });

  const loadMaterials = async () => {
    setIsLoading(true);
    setFeedback({ type: '', message: '' });
    try {
      const data = await getMaterialSpecializations();
      setMaterials(Array.isArray(data) ? data.map(mapMaterialFromApi) : []);
    } catch (error) {
      setMaterials([]);
      setFeedback({
        type: 'error',
        message: error?.message || 'Failed to load material specializations.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const openCreateModal = () => {
    setCreateForm(createEmptyMaterial());
    setCreateErrors({
      image: '',
      title: '',
      description: '',
      grades: '',
      applications: '',
    });
    setCreateModal({ isOpen: true, token: Date.now() });
  };

  const markSaving = (id, isSaving) => {
    setSavingIds((prev) => {
      const next = new Set(prev);
      if (isSaving) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const updateMaterial = (id, field, value) => {
    setMaterials((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value, isDirty: true } : m)));
  };

  const updateCreateForm = (field, value) => {
    if (field === 'grades' || field === 'applications') {
      setCreateForm((prev) => {
        const nextList = [...prev[field]];
        nextList[value.index] = value.value;
        return { ...prev, [field]: nextList };
      });
      setCreateErrors((prev) => ({ ...prev, [field]: '' }));
      return;
    }

    setCreateForm((prev) => ({ ...prev, [field]: value }));
    if (field in createErrors) {
      setCreateErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleListUpdate = (id, field, index, value) => {
    setMaterials((prev) => prev.map((m) => {
      if (m.id !== id) {
        return m;
      }
      const newList = [...m[field]];
      newList[index] = value;
      return { ...m, [field]: newList, isDirty: true };
    }));
  };

  const addListItem = (id, field) => {
    setMaterials((prev) => prev.map((m) => (
      m.id === id ? { ...m, [field]: [...m[field], ''], isDirty: true } : m
    )));
  };

  const addCreateListItem = (field) => {
    setCreateForm((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeListItem = (id, field, index) => {
    setMaterials((prev) => prev.map((m) => {
      if (m.id !== id) {
        return m;
      }
      const newList = m[field].filter((_, i) => i !== index);
      return { ...m, [field]: newList.length ? newList : [''], isDirty: true };
    }));
  };

  const removeCreateListItem = (field, index) => {
    setCreateForm((prev) => {
      const nextList = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: nextList.length ? nextList : [''] };
    });
  };

  const handleImageUpload = async (id, file) => {
    if (!file) {
      return;
    }

    updateMaterial(id, 'isUploadingImage', true);
    setFeedback({ type: '', message: '' });

    try {
      const uploaded = await uploadImage(file);
      setMaterials((prev) => prev.map((m) => (
        m.id === id
          ? {
              ...m,
              image: uploaded?.secureUrl || '',
              publicUrl: uploaded?.publicId || '',
              isUploadingImage: false,
              isDirty: true,
            }
          : m
      )));
    } catch (error) {
      updateMaterial(id, 'isUploadingImage', false);
      setFeedback({
        type: 'error',
        message: error?.message || 'Failed to upload image.',
      });
    }
  };

  const handleCreateImageUpload = async (file) => {
    if (!file) return;

    setCreateForm((prev) => ({ ...prev, isUploadingImage: true }));
    setCreateErrors((prev) => ({ ...prev, image: '' }));
    setFeedback({ type: '', message: '' });

    try {
      const uploaded = await uploadImage(file);
      setCreateForm((prev) => ({
        ...prev,
        image: uploaded?.secureUrl || '',
        publicUrl: uploaded?.publicId || '',
        isUploadingImage: false,
      }));
    } catch (error) {
      setCreateForm((prev) => ({ ...prev, isUploadingImage: false }));
      setFeedback({
        type: 'error',
        message: error?.message || 'Failed to upload image.',
      });
    }
  };

  const openDeleteModal = (id, title) => {
    setDeleteModal({ isOpen: true, id, title });
  };

  const confirmDelete = async () => {
    const id = deleteModal.id;
    if (!id) {
      setDeleteModal({ isOpen: false, id: null, title: '' });
      return;
    }

    setFeedback({ type: '', message: '' });
    try {
      await deleteMaterialSpecialization(id);
      setMaterials((prev) => prev.filter((m) => m.id !== id));
      toast.success("Deleted successfully");
      setFeedback({ type: 'success', message: 'Material specialization deleted successfully.' });
    } catch (error) {
      toast.error("Failed");
      setFeedback({
        type: 'error',
        message: error?.message || 'Failed to delete material specialization.',
      });
    } finally {
      setDeleteModal({ isOpen: false, id: null, title: '' });
    }
  };

  const handleCreateMaterial = async () => {
    const errors = getMaterialValidationErrors(createForm);
    if (hasMaterialValidationErrors(errors)) {
      setCreateErrors(errors);
      return;
    }

    const normalized = normalizeMaterialDraft(createForm);
    setFeedback({ type: '', message: '' });
    try {
      await createMaterialSpecialization({
        image_url: normalized.image,
        public_url: normalized.publicUrl || null,
        title: normalized.title,
        description: normalized.description,
        grades: normalized.grades,
        common_application: normalized.applications,
      });
      setCreateModal({ isOpen: false, token: 0 });
      await loadMaterials();
      toast.success('Saved successfully');
      setFeedback({ type: 'success', message: 'Material specialization created successfully.' });
    } catch (error) {
      toast.error('Failed');
      setCreateErrors((prev) => ({ ...prev }));
      setFeedback({
        type: 'error',
        message: error?.message || 'Failed to create material specialization.',
      });
    }
  };

  const handleSaveMaterial = async (id) => {
    const material = materials.find((item) => item.id === id);
    if (!material) return;

    if (material.isUploadingImage) {
      setFeedback({ type: 'error', message: 'Please wait for the image upload to finish before saving.' });
      return;
    }

    const errors = getMaterialValidationErrors(material);
    if (hasMaterialValidationErrors(errors)) {
      const firstError = Object.values(errors).find(Boolean);
      setFeedback({
        type: 'error',
        message: `${material.title || 'Material'}: ${firstError}`,
      });
      return;
    }

    const normalized = normalizeMaterialDraft(material);
    markSaving(id, true);
    setFeedback({ type: '', message: '' });
    try {
      await updateMaterialSpecialization(id, {
        image_url: normalized.image,
        public_url: normalized.publicUrl || null,
        title: normalized.title,
        description: normalized.description,
        grades: normalized.grades,
        common_application: normalized.applications,
      });
      setMaterials((prev) => prev.map((item) => (
        item.id === id ? { ...item, isDirty: false } : item
      )));
      toast.success('Edited successfully');
      setFeedback({ type: 'success', message: 'Material specialization saved successfully.' });
    } catch (error) {
      toast.error('Failed');
      setFeedback({
        type: 'error',
        message: error?.message || 'Failed to save material specialization.',
      });
    } finally {
      markSaving(id, false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif]">
      <AdminNavbar />

      <AdminCreateMaterialModal
        key={createModal.token}
        isOpen={createModal.isOpen}
        form={createForm}
        errors={createErrors}
        isUploadingImage={createForm.isUploadingImage}
        onClose={() => setCreateModal({ isOpen: false, token: 0 })}
        onChange={updateCreateForm}
        onUploadImage={handleCreateImageUpload}
        onAddListItem={addCreateListItem}
        onRemoveListItem={removeCreateListItem}
        onSubmit={handleCreateMaterial}
      />

      <AdminDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        title={`Delete ${deleteModal.title}?`}
        message="Are you sure you want to remove this material specialization? This will delete all its grades and common applications."
      />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 py-12 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-black font-black text-xs tracking-widest uppercase">
              <span className="material-symbols-outlined text-base">architecture</span>
              MATERIAL MANAGEMENT
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Material Specializations</h1>
            <p className="text-black font-medium max-w-2xl leading-relaxed text-sm">
              Manage the material specializations shown on the home page.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 cursor-pointer w-full md:w-auto"
          >
            <span className="material-symbols-outlined text-xl">add_box</span>
            Add New Material
          </button>
        </div>

        {feedback.message && (
          <div className={`rounded-2xl border px-5 py-4 text-sm font-bold ${
            feedback.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-600'
              : 'border-green-200 bg-green-50 text-green-700'
          }`}>
            {feedback.message}
          </div>
        )}

        {isLoading && (
          <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-5 text-sm font-bold text-slate-500 shadow-sm">
            Loading material specializations...
          </div>
        )}

        <div className="grid grid-cols-1 gap-12">
          {!isLoading && materials.map((material) => (
            <div key={material.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col lg:flex-row lg:items-start group/card">
              <div className="lg:w-1/3 lg:h-[480px] relative bg-slate-100 shrink-0 overflow-hidden">
                {material.image ? (
                  <img src={material.image} alt={material.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-5xl mb-2">image</span>
                    <p className="text-xs font-black uppercase tracking-widest">No Image Selected</p>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => document.getElementById(`upload-${material.id}`)?.click()}
                    disabled={material.isUploadingImage}
                    className="bg-white text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-base">cloud_upload</span>
                    {material.isUploadingImage ? 'Uploading...' : 'Change Image'}
                  </button>
                  <input
                    id={`upload-${material.id}`}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(material.id, e.target.files?.[0])}
                  />
                </div>
              </div>

              <div className="flex-1 p-8 md:p-12 space-y-8 relative">
                <button
                  onClick={() => openDeleteModal(material.id, material.title || 'Untitled')}
                  className="absolute top-8 right-8 w-11 h-11 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center transition-all cursor-pointer"
                  title="Delete Specialization"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-black/30 uppercase tracking-widest ml-1">ALLOY TITLE</label>
                      <input
                        type="text"
                        value={material.title}
                        onChange={(e) => updateMaterial(material.id, 'title', e.target.value)}
                        placeholder="e.g. CW617N Components"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xl font-bold text-black outline-none focus:bg-white focus:border-blue-200 transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-black/30 uppercase tracking-widest ml-1">DESCRIPTION</label>
                      <textarea
                        value={material.description}
                        onChange={(e) => updateMaterial(material.id, 'description', e.target.value)}
                        placeholder="Expertise in multiple metal alloys..."
                        rows="2"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium text-slate-600 outline-none focus:bg-white focus:border-blue-200 transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-l-2 border-orange-500 pl-3">
                        <h4 className="text-xs font-black text-black uppercase tracking-widest">Grades</h4>
                        <button
                          onClick={() => addListItem(material.id, 'grades')}
                          className="text-orange-600 hover:text-orange-700 font-bold text-xs uppercase tracking-widest flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">add_circle</span>
                          Add Grade
                        </button>
                      </div>
                      <div className="space-y-2">
                        {material.grades.map((grade, idx) => (
                          <div key={idx} className="flex items-center gap-2 group/item">
                            <input
                              type="text"
                              value={grade}
                              onChange={(e) => handleListUpdate(material.id, 'grades', idx, e.target.value)}
                              placeholder="Enter grade"
                              className="flex-1 bg-slate-50 border border-slate-50 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:border-orange-100 transition-all"
                            />
                            <button
                              onClick={() => removeListItem(material.id, 'grades', idx)}
                              className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm">remove_circle</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-l-2 border-green-500 pl-3">
                        <h4 className="text-xs font-black text-black uppercase tracking-widest">Common Applications</h4>
                        <button
                          onClick={() => addListItem(material.id, 'applications')}
                          className="text-green-600 hover:text-green-700 font-bold text-xs uppercase tracking-widest flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">add_circle</span>
                          Add Application
                        </button>
                      </div>
                      <div className="space-y-2">
                        {material.applications.map((app, idx) => (
                          <div key={idx} className="flex items-center gap-2 group/item">
                            <input
                              type="text"
                              value={app}
                              onChange={(e) => handleListUpdate(material.id, 'applications', idx, e.target.value)}
                              placeholder="Enter application"
                              className="flex-1 bg-slate-50 border border-slate-50 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:border-green-100 transition-all"
                            />
                            <button
                              onClick={() => removeListItem(material.id, 'applications', idx)}
                              className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm">remove_circle</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        material.isDirty ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                    ></span>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Status</p>
                      <p className="text-sm font-bold text-[#1b365d]">
                        {material.isDirty ? 'Unsaved changes' : 'Saved'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSaveMaterial(material.id)}
                    disabled={
                      savingIds.has(material.id) ||
                      material.isUploadingImage ||
                      !material.isDirty ||
                      hasMaterialValidationErrors(getMaterialValidationErrors(material))
                    }
                    className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                      ${savingIds.has(material.id) ? 'bg-slate-600 text-white shadow-slate-600/20' : ''}
                      ${!savingIds.has(material.id) && material.isDirty ? 'bg-[#1b365d] hover:bg-[#2c4c7c] text-white shadow-[#1b365d]/20' : ''}
                      ${!savingIds.has(material.id) && !material.isDirty ? 'bg-green-50 text-green-700 border border-green-200 shadow-green-500/10' : ''}
                    `}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {savingIds.has(material.id)
                        ? 'sync'
                        : material.isDirty
                          ? 'save'
                          : 'check_circle'}
                    </span>
                    {savingIds.has(material.id)
                      ? 'Saving...'
                      : material.isDirty
                        ? 'Save Changes'
                        : 'Saved'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!isLoading && materials.length === 0 && (
            <div className="py-20 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center gap-4 text-center bg-white">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <span className="material-symbols-outlined text-4xl">layers</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-black">No Materials Defined</h3>
                <p className="text-sm font-medium text-slate-400">Click the button above to add your first material specialization.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminMaterials;
