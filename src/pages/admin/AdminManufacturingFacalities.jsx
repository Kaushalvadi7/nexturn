import { useEffect, useState } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { useToast } from '../../contexts/ToastContext';
import AdminDeleteModal from '../../components/admin/AdminDeleteModal';
import {
  createManufacturingFacalityForm,
  deleteManufacturingFacality,
  getManufacturingFacalities,
  updateManufacturingFacalityForm,
} from '../../lib/api';

const AdminManufacturingFacalities = () => {
  const toast = useToast();
  const [facalities, setFacalities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingIds, setSavingIds] = useState(() => new Set());

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    title: '',
  });

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await getManufacturingFacalities();
        if (!isActive) return;
        const normalized = (Array.isArray(data) ? data : []).map((row) => ({
          id: row.id,
          title: row.title || '',
          description: row.description || '',
          image: row.image || null,
          imageFile: null,
          imagePreview: null,
          isNew: false,
          isDirty: false,
        }));
        setFacalities(normalized);
      } catch (e) {
        if (!isActive) return;
        console.error('Failed to load manufacturing facalities', e);
        setFacalities([]);
        setError(e?.message || 'Failed to load manufacturing facalities.');
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    load();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      facalities.forEach((f) => {
        if (f.imagePreview) URL.revokeObjectURL(f.imagePreview);
      });
    };
  }, [facalities]);

  const markSaving = (id, isSaving) => {
    setSavingIds((prev) => {
      const next = new Set(prev);
      if (isSaving) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const addFacality = () => {
    const tempId = Date.now() * -1;
    setFacalities((prev) => [
      ...prev,
      {
        id: tempId,
        title: '',
        description: '',
        image: null,
        imageFile: null,
        imagePreview: null,
        isNew: true,
        isDirty: true,
      },
    ]);
  };

  const updateFacality = (id, field, value) => {
    setFacalities((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value, isDirty: true } : f)));
  };

  const handleImageUpload = (id, file) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setFacalities((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        if (f.imagePreview) URL.revokeObjectURL(f.imagePreview);
        return { ...f, imageFile: file, imagePreview: previewUrl, isDirty: true };
      }),
    );
  };

  const openDeleteModal = (id, title) => {
    setDeleteModal({ isOpen: true, id, title });
  };

  const confirmDelete = async () => {
    const target = facalities.find((f) => f.id === deleteModal.id) || null;
    if (target?.isNew) {
      if (target.imagePreview) URL.revokeObjectURL(target.imagePreview);
      setFacalities((prev) => prev.filter((f) => f.id !== deleteModal.id));
      setDeleteModal({ isOpen: false, id: null, title: '' });
      return;
    }

    setError('');
    try {
      await deleteManufacturingFacality(deleteModal.id);
      setFacalities((prev) => prev.filter((f) => f.id !== deleteModal.id));
      toast.success("Deleted successfully");
    } catch (e) {
      toast.error("Failed");
      console.error('Failed to delete manufacturing facality', e);
      setError(e?.message || 'Failed to delete manufacturing facality.');
    } finally {
      setDeleteModal({ isOpen: false, id: null, title: '' });
    }
  };

  const saveFacality = async (id) => {
    const facality = facalities.find((f) => f.id === id);
    if (!facality) return;

    const title = String(facality.title || '').trim();
    const description = String(facality.description || '').trim();

    if (!title) {
      setError('Title is required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (facality.imageFile) {
      formData.append('image', facality.imageFile);
    }

    setError('');
    markSaving(id, true);
    try {
      if (facality.isNew) {
        const result = await createManufacturingFacalityForm(formData);
        const created = result?.data || null;
        const newId = created?.id;
        if (!newId) throw new Error('Failed to create manufacturing facality.');

        setFacalities((prev) =>
          prev.map((f) =>
            f.id === id
              ? {
                  ...f,
                  id: newId,
                  image: created?.image || f.image || null,
                  imageFile: null,
                  imagePreview: null,
                  isNew: false,
                  isDirty: false,
                }
              : f,
          ),
        );
      } else {
        const result = await updateManufacturingFacalityForm(id, formData);
        const updated = result?.data || null;
        setFacalities((prev) =>
          prev.map((f) =>
            f.id === id
              ? {
                  ...f,
                  title,
                  description,
                  image: updated?.image || f.image || null,
                  imageFile: null,
                  imagePreview: null,
                  isDirty: false,
                }
              : f,
          ),
        );
      }
      toast.success(facality.isNew ? "Saved successfully" : "Edited successfully");
    } catch (e) {
      toast.error("Failed");
      console.error('Failed to save manufacturing facality', e);
      setError(e?.message || 'Failed to save manufacturing facality.');
    } finally {
      markSaving(id, false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif]">
      <AdminNavbar />

      <AdminDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        title="Delete Manufacturing Facality?"
        message={`Are you sure you want to remove "${deleteModal.title}"? This action cannot be undone.`}
      />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 py-12 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-black font-black text-xs tracking-widest uppercase">
              <span className="material-symbols-outlined text-base text-blue-600">factory</span>
              ABOUT US
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Manufacturing Facalities</h1>
            <p className="text-black font-medium max-w-2xl leading-relaxed text-sm">
              Manage the manufacturing facality cards displayed on the public About Us page. Save each card individually.
            </p>
          </div>

          <button
            type="button"
            onClick={addFacality}
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 cursor-pointer w-full md:w-auto"
          >
            <span className="material-symbols-outlined text-xl">add_box</span>
            Add New Facality
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {error && (
            <div className="col-span-full rounded-2xl bg-red-50 border border-red-200 px-6 py-4 text-xs font-bold text-red-600">
              {error}
            </div>
          )}
          {isLoading && (
            <div className="col-span-full rounded-2xl bg-white border border-slate-200 px-6 py-4 text-xs font-bold text-slate-500">
              Loading manufacturing facalities...
            </div>
          )}

          {facalities.map((f) => (
            <div
              key={f.id}
              className="relative group/card bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 space-y-8 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300"
            >
              <button
                type="button"
                onClick={() => openDeleteModal(f.id, f.title || 'Untitled facality')}
                className="absolute -top-3 -right-3 w-10 h-10 bg-white border border-slate-100 text-slate-400 hover:text-white hover:bg-red-500 hover:border-red-500 rounded-full flex items-center justify-center shadow-lg transition-all opacity-100 lg:opacity-0 lg:group-hover/card:opacity-100 cursor-pointer z-10"
                title="Delete facality"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>

              <div className="space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Facality Image</p>

                <div className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 aspect-[4/3]">
                  {(f.imagePreview || f.image) ? (
                    <img
                      src={f.imagePreview || f.image}
                      alt={f.title || 'Facality'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <span className="material-symbols-outlined text-4xl">image</span>
                      <p className="text-xs font-black uppercase tracking-widest mt-2">No image</p>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="bg-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-black flex items-center gap-2 cursor-pointer">
                      <span className="material-symbols-outlined text-base">cloud_upload</span>
                      {f.imagePreview || f.image ? 'Change Image' : 'Upload Image'}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(f.id, e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#1b365d] uppercase tracking-widest block pl-1 opacity-70">
                    Title
                  </label>
                  <input
                    type="text"
                    value={f.title}
                    placeholder="e.g. CNC Turning Floor"
                    onChange={(e) => updateFacality(f.id, 'title', e.target.value)}
                    className="w-full bg-white border-b-2 border-slate-100 px-1 py-1 text-base font-black text-[#1b365d] outline-none focus:border-blue-400 transition-all placeholder:text-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-[#1b365d] uppercase tracking-widest block pl-1 opacity-70">
                    Description
                  </label>
                  <textarea
                    value={f.description}
                    placeholder="Describe this manufacturing facality..."
                    onChange={(e) => updateFacality(f.id, 'description', e.target.value)}
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-semibold text-slate-600 outline-none focus:bg-white focus:border-blue-100 transition-all resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="pt-2">
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        f.isDirty || f.isNew ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                    ></span>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Status</p>
                      <p className="text-sm font-bold text-[#1b365d]">
                        {f.isDirty || f.isNew ? 'Unsaved changes' : 'Saved'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => saveFacality(f.id)}
                    disabled={savingIds.has(f.id) || (!f.isDirty && !f.isNew) || !String(f.title || '').trim()}
                    className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                      ${savingIds.has(f.id) ? 'bg-slate-600 text-white shadow-slate-600/20' : ''}
                      ${!savingIds.has(f.id) && (f.isDirty || f.isNew) ? 'bg-[#1b365d] hover:bg-[#2c4c7c] text-white shadow-[#1b365d]/20' : ''}
                      ${!savingIds.has(f.id) && !(f.isDirty || f.isNew) ? 'bg-green-50 text-green-700 border border-green-200 shadow-green-500/10' : ''}
                    `}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {savingIds.has(f.id) ? 'sync' : f.isDirty || f.isNew ? 'save' : 'check_circle'}
                    </span>
                    {savingIds.has(f.id) ? 'Saving...' : f.isNew ? 'Save Facality' : f.isDirty ? 'Save Changes' : 'Saved'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!isLoading && facalities.length === 0 && (
            <div className="col-span-full py-24 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center gap-6 text-center bg-white/50">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-xl border border-slate-100">
                <span className="material-symbols-outlined text-4xl">factory</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-[#1b365d]">No Facalities Added</h3>
                <p className="text-sm font-medium text-slate-400 max-w-xs">
                  Add your first manufacturing facality card.
                </p>
              </div>
              <button
                type="button"
                onClick={addFacality}
                className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 cursor-pointer"
              >
                Add First Facality
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminManufacturingFacalities;

