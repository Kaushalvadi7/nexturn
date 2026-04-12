import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { useToast } from '../../contexts/ToastContext';
import AdminDeleteModal from '../../components/admin/AdminDeleteModal';
import AdminIconPicker from '../../components/admin/AdminIconPicker';
import AdminCreateCapabilityModal from '../../components/admin/AdminCreateCapabilityModal';
import {
  createManufacturingCapability,
  deleteManufacturingCapability,
  getManufacturingCapabilities,
  updateManufacturingCapability,
} from '../../lib/api';

const createEmptyCapabilityForm = () => ({
  title: '',
  description: '',
  icon: 'manufacturing',
  isActive: true,
  features: [''],
});

const mapCapabilityFromApi = (capability, index) => ({
  id: capability.id,
  title: capability.title || '',
  description: capability.description || '',
  icon: capability.icon_name || 'manufacturing',
  sortOrder: capability.sort_order ?? index + 1,
  isActive: capability.is_active ?? true,
  keyProperties: Array.isArray(capability.feature) && capability.feature.length > 0
    ? capability.feature.map((item) => ({ text: String(item || '') }))
    : [{ text: '' }],
  isNew: false,
  isDirty: false,
});

const AdminManufacturingCapabilities = () => {
  const toast = useToast();
  const [capabilities, setCapabilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: '' });
  const [iconPicker, setIconPicker] = useState({ isOpen: false, target: 'existing', capabilityId: null });
  const [savingIds, setSavingIds] = useState(() => new Set());

  const [createModal, setCreateModal] = useState({ isOpen: false, token: 0 });
  const [createForm, setCreateForm] = useState(createEmptyCapabilityForm);
  const [createErrors, setCreateErrors] = useState({ title: '', description: '', icon: '', features: '' });
  const [isCreating, setIsCreating] = useState(false);

  const loadCapabilities = async () => {
    setIsLoading(true);
    setFeedback({ type: '', message: '' });
    try {
      const data = await getManufacturingCapabilities();
      setCapabilities(
        Array.isArray(data) && data.length > 0
          ? data.map(mapCapabilityFromApi)
          : []
      );
    } catch (error) {
      setCapabilities([]);
      setFeedback({
        type: 'error',
        message: error?.message || 'Failed to load manufacturing capabilities.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCapabilities();
  }, []);

  const markSaving = (id, isSaving) => {
    setSavingIds((prev) => {
      const next = new Set(prev);
      if (isSaving) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const openCreateModal = () => {
    setFeedback({ type: '', message: '' });
    setCreateErrors({ title: '', description: '', icon: '', features: '' });
    setCreateForm(createEmptyCapabilityForm());
    setCreateModal({ isOpen: true, token: Date.now() });
  };

  const updateCreateForm = (field, value) => {
    if (field === 'feature') {
      const idx = value?.index;
      const nextValue = value?.value;
      setCreateForm((prev) => {
        const next = { ...prev };
        const features = Array.isArray(next.features) ? [...next.features] : [];
        features[idx] = nextValue;
        next.features = features;
        return next;
      });
      setCreateErrors((prev) => ({ ...prev, features: '' }));
      return;
    }

    setCreateForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'title') {
      setCreateErrors((prev) => ({ ...prev, title: '' }));
    }
    if (field === 'description') {
      setCreateErrors((prev) => ({ ...prev, description: '' }));
    }
    if (field === 'icon') {
      setCreateErrors((prev) => ({ ...prev, icon: '' }));
    }
  };

  const addCreateFeature = () => {
    setCreateForm((prev) => ({
      ...prev,
      features: [...(Array.isArray(prev.features) ? prev.features : []), ''],
    }));
  };

  const removeCreateFeature = (index) => {
    setCreateForm((prev) => {
      const features = (Array.isArray(prev.features) ? prev.features : []).filter((_, i) => i !== index);
      return { ...prev, features: features.length ? features : [''] };
    });
  };

  const updateCapability = (id, field, value) => {
    setCapabilities((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value, isDirty: true } : c)));
  };

  const handlePropertyUpdate = (capabilityId, index, value) => {
    setCapabilities((prev) => prev.map((c) => {
      if (c.id !== capabilityId) {
        return c;
      }
      const newProperties = [...c.keyProperties];
      newProperties[index] = { ...newProperties[index], text: value };
      return { ...c, keyProperties: newProperties, isDirty: true };
    }));
  };

  const addProperty = (capabilityId) => {
    setCapabilities((prev) => prev.map((c) => (
      c.id === capabilityId
        ? { ...c, keyProperties: [...c.keyProperties, { text: '' }], isDirty: true }
        : c
    )));
  };

  const removeProperty = (capabilityId, index) => {
    setCapabilities((prev) => prev.map((c) => {
      if (c.id !== capabilityId) {
        return c;
      }
      const newProperties = c.keyProperties.filter((_, i) => i !== index);
      return { ...c, keyProperties: newProperties.length ? newProperties : [{ text: '' }], isDirty: true };
    }));
  };

  const openDeleteModal = (id, title) => {
    setDeleteModal({ isOpen: true, id, title });
  };

  const confirmDelete = async () => {
    const target = capabilities.find((c) => c.id === deleteModal.id) || null;
    if (target?.isNew) {
      setCapabilities((prev) => prev.filter((c) => c.id !== deleteModal.id));
      setDeleteModal({ isOpen: false, id: null, title: '' });
      return;
    }

    setFeedback({ type: '', message: '' });
    try {
      await deleteManufacturingCapability(deleteModal.id);
      setCapabilities((prev) => prev.filter((c) => c.id !== deleteModal.id));
      toast.success("Deleted successfully");
      setFeedback({ type: 'success', message: 'Capability deleted.' });
    } catch (error) {
      toast.error("Failed");
      setFeedback({
        type: 'error',
        message: error?.message || 'Failed to delete capability.',
      });
    } finally {
      setDeleteModal({ isOpen: false, id: null, title: '' });
    }
  };

  const openIconPicker = (capabilityId) => {
    setIconPicker({ isOpen: true, target: 'existing', capabilityId });
  };

  const handleIconSelect = (icon) => {
    if (iconPicker.target === 'create') {
      updateCreateForm('icon', icon);
      setCreateErrors((prev) => ({ ...prev, icon: '' }));
      setIconPicker({ isOpen: false, target: 'existing', capabilityId: null });
      return;
    }

    if (iconPicker.capabilityId) {
      updateCapability(iconPicker.capabilityId, 'icon', icon);
    }
    setIconPicker({ isOpen: false, target: 'existing', capabilityId: null });
  };

  const buildPayload = (cap, index) => ({
    title: String(cap.title || "").trim(),
    description: String(cap.description || "").trim(),
    icon_name: String(cap.icon || "").trim(),
    feature: (cap.keyProperties || [])
      .map((prop) => String(prop?.text || "").trim())
      .filter(Boolean),
    sort_order: index + 1,
    is_active: cap.isActive ?? true,
  });

  const handleSaveCapability = async (capabilityId) => {
    const index = capabilities.findIndex((c) => c.id === capabilityId);
    const cap = index >= 0 ? capabilities[index] : null;
    if (!cap) return;

    const payload = buildPayload(cap, index);
    if (!payload.title) {
      setFeedback({ type: 'error', message: 'Title is required to save a capability.' });
      return;
    }
    if (!payload.description) {
      setFeedback({ type: 'error', message: 'Description is required to save a capability.' });
      return;
    }
    if (!payload.icon_name) {
      setFeedback({ type: 'error', message: 'Icon is required to save a capability.' });
      return;
    }
    if (!Array.isArray(payload.feature) || payload.feature.length === 0) {
      setFeedback({ type: 'error', message: 'At least 1 key property is required to save a capability.' });
      return;
    }

    setFeedback({ type: '', message: '' });
    markSaving(capabilityId, true);
    try {
      if (cap.isNew) {
        const result = await createManufacturingCapability(payload);
        const created = result?.data || null;
        const newId = created?.id;
        if (!newId) throw new Error('Failed to create manufacturing capability.');

        setCapabilities((prev) =>
          prev.map((c) =>
            c.id === capabilityId
              ? { ...c, id: newId, isNew: false, isDirty: false }
              : c,
          ),
        );
      } else {
        await updateManufacturingCapability(capabilityId, payload);
        setCapabilities((prev) =>
          prev.map((c) => (c.id === capabilityId ? { ...c, isDirty: false } : c)),
        );
      }
      toast.success(cap.isNew ? "Saved successfully" : "Edited successfully");
    } catch (error) {
      toast.error("Failed");
      setFeedback({
        type: 'error',
        message: error?.message || 'Failed to save capability.',
      });
    } finally {
      markSaving(capabilityId, false);
    }
  };

  const handleCreateCapability = async () => {
    const title = String(createForm.title || '').trim();
    const description = String(createForm.description || '').trim();
    const icon = String(createForm.icon || '').trim();
    const feature = (Array.isArray(createForm.features) ? createForm.features : [])
      .map((v) => String(v || '').trim())
      .filter(Boolean);

    if (!title) {
      setCreateErrors((prev) => ({ ...prev, title: 'Title is required.' }));
      return;
    }
    if (!description) {
      setCreateErrors((prev) => ({ ...prev, description: 'Description is required.' }));
      return;
    }
    if (!icon) {
      setCreateErrors((prev) => ({ ...prev, icon: 'Icon is required.' }));
      return;
    }
    if (feature.length === 0) {
      setCreateErrors((prev) => ({ ...prev, features: 'Add at least 1 key property.' }));
      return;
    }

    const payload = {
      title,
      description,
      icon_name: icon,
      feature,
      sort_order: capabilities.length + 1,
      is_active: createForm.isActive ?? true,
    };

    setIsCreating(true);
    setFeedback({ type: '', message: '' });
    try {
      const result = await createManufacturingCapability(payload);
      const created = result?.data || null;
      const newId = created?.id;

      setCreateModal({ isOpen: false, token: 0 });
      toast.success("Saved successfully");
      setFeedback({ type: 'success', message: 'Capability created.' });

      if (!newId) {
        await loadCapabilities();
        return;
      }

      setCapabilities((prev) => [
        ...prev,
        {
          id: newId,
          title: payload.title,
          description: payload.description || '',
          icon: payload.icon_name || 'manufacturing',
          sortOrder: payload.sort_order,
          isActive: payload.is_active,
          keyProperties: payload.feature.length ? payload.feature.map((t) => ({ text: t })) : [{ text: '' }],
          isNew: false,
          isDirty: false,
        },
      ]);
    } catch (error) {
      toast.error("Failed");
      setFeedback({ type: 'error', message: error?.message || 'Failed to create capability.' });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif]">
      <AdminNavbar />

      <AdminDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        title={`Delete "${deleteModal.title}"?`}
        message="Are you sure you want to remove this manufacturing capability? This action will permanently delete all associated descriptions and properties."
      />

      <AdminIconPicker
        isOpen={iconPicker.isOpen}
        onClose={() => setIconPicker({ isOpen: false, target: 'existing', capabilityId: null })}
        onSelect={handleIconSelect}
      />

      <AdminCreateCapabilityModal
        key={createModal.token}
        isOpen={createModal.isOpen}
        title="Create Capability"
        form={createForm}
        errors={createErrors}
        isSaving={isCreating}
        onClose={() => setCreateModal({ isOpen: false, token: 0 })}
        onChange={updateCreateForm}
        onAddFeature={addCreateFeature}
        onRemoveFeature={removeCreateFeature}
        onPickIcon={() => setIconPicker({ isOpen: true, target: 'create', capabilityId: null })}
        onSubmit={handleCreateCapability}
      />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 py-12 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-black font-black text-xs tracking-widest uppercase">
              <span className="material-symbols-outlined text-base text-orange-600">precision_manufacturing</span>
              CAPABILITIES HUB
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Manufacturing Capabilities</h1>
            <p className="text-black font-medium max-w-2xl leading-relaxed text-sm">
              Define and manage the core technical processes and manufacturing strengths of the facility.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-3 bg-black hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-black/20 active:scale-95 cursor-pointer w-full md:w-auto"
          >
            <span className="material-symbols-outlined text-xl">add_box</span>
            New Capability
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
            Loading manufacturing capabilities...
          </div>
        )}

        <div className="grid grid-cols-1 gap-8">
          {!isLoading && capabilities.map((cap) => (
            <div key={cap.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col group/card hover:border-orange-200 transition-all duration-300">
              <div className="p-8 md:p-10 space-y-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => openIconPicker(cap.id)}
                      className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-orange-600 hover:border-orange-600 hover:text-white transition-all cursor-pointer group/icon shadow-sm hover:shadow-xl hover:shadow-orange-600/20 relative"
                    >
                      <span className="material-symbols-outlined text-3xl transition-transform group-hover/icon:scale-110">{cap.icon}</span>
                      <div className="absolute top-1 right-1 w-6 h-6 bg-orange-700 text-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/icon:scale-110">
                        <span className="material-symbols-outlined text-xs font-black">edit</span>
                      </div>
                    </button>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-orange-600 uppercase tracking-widest opacity-80">Icon Identifier</p>
                      <p className="text-xs font-bold text-slate-400 tracking-tight">{cap.icon}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => openDeleteModal(cap.id, cap.title || 'Untitled capability')}
                    className="w-12 h-12 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm hover:shadow-lg hover:shadow-red-500/20"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-[#1b365d] uppercase tracking-widest block pl-1 opacity-70">CAPABILITY TITLE</label>
                      <input
                        type="text"
                        value={cap.title}
                        placeholder="e.g. Precision CNC Turning"
                        onChange={(e) => updateCapability(cap.id, 'title', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xl font-black text-black outline-none focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-[#1b365d] uppercase tracking-widest block pl-1 opacity-70">PROCESS DESCRIPTION</label>
                      <textarea
                        value={cap.description}
                        placeholder="Describe the technical process..."
                        onChange={(e) => updateCapability(cap.id, 'description', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm font-medium text-slate-600 outline-none focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/5 transition-all min-h-[140px] leading-relaxed shadow-sm resize-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-black text-[#1b365d] uppercase tracking-widest block pl-1 opacity-70">KEY TECHNICAL PROPERTIES</label>
                      <button
                        onClick={() => addProperty(cap.id)}
                        className="text-xs font-black text-orange-600 uppercase tracking-widest hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">add_circle</span>
                        Add Property
                      </button>
                    </div>
                    <div className="space-y-3 bg-slate-50/50 p-6 rounded-3xl border border-dashed border-slate-200">
                      {cap.keyProperties.map((prop, pIdx) => (
                        <div key={`${cap.id}-${pIdx}`} className="flex items-center gap-3 bg-white border border-slate-100 px-5 py-3 rounded-xl shadow-sm hover:border-orange-200 transition-all group/prop">
                          <input
                            type="text"
                            value={prop.text}
                            placeholder="Enter a tech property..."
                            onChange={(e) => handlePropertyUpdate(cap.id, pIdx, e.target.value)}
                            className="flex-1 text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300"
                          />
                          <button
                            onClick={() => removeProperty(cap.id, pIdx)}
                            className="material-symbols-outlined text-slate-300 hover:text-red-500 text-lg cursor-pointer opacity-0 group-hover/prop:opacity-100 transition-all"
                          >
                            close
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 md:px-10 pb-8">
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        cap.isDirty || cap.isNew ? "bg-amber-500" : "bg-green-500"
                      }`}
                    ></span>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Status</p>
                      <p className="text-sm font-bold text-[#1b365d]">
                        {cap.isDirty || cap.isNew ? "Unsaved changes" : "Saved"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSaveCapability(cap.id)}
                    disabled={
                      savingIds.has(cap.id) ||
                      (!cap.isDirty && !cap.isNew) ||
                      !String(cap.title || "").trim() ||
                      !String(cap.description || "").trim() ||
                      !String(cap.icon || "").trim() ||
                      (cap.keyProperties || [])
                        .map((prop) => String(prop?.text || "").trim())
                        .filter(Boolean).length === 0
                    }
                    className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                      ${savingIds.has(cap.id) ? "bg-slate-600 text-white shadow-slate-600/20" : ""}
                      ${!savingIds.has(cap.id) && (cap.isDirty || cap.isNew) ? "bg-[#1b365d] hover:bg-[#2c4c7c] text-white shadow-[#1b365d]/20" : ""}
                      ${!savingIds.has(cap.id) && !(cap.isDirty || cap.isNew) ? "bg-green-50 text-green-700 border border-green-200 shadow-green-500/10" : ""}
                    `}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {savingIds.has(cap.id)
                        ? "sync"
                        : cap.isDirty || cap.isNew
                          ? "save"
                          : "check_circle"}
                    </span>
                    {savingIds.has(cap.id)
                      ? "Saving..."
                      : cap.isNew
                        ? "Save Capability"
                        : cap.isDirty
                          ? "Save Changes"
                          : "Saved"}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!isLoading && capabilities.length === 0 && (
            <div className="py-20 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <span className="material-symbols-outlined text-4xl">inventory_2</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-black">No Capabilities Defined</h3>
                <p className="text-sm font-medium text-slate-400">Click the button above to add your first manufacturing capability.</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm flex items-center justify-center mt-12">
          <div className="max-w-[1440px] w-full flex items-center justify-between px-4">
            <div className="hidden md:flex items-center gap-6">
              <div className="flex flex-col">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest underline decoration-orange-500/30 underline-offset-4">STATUS</p>
                <p className="text-xs font-bold text-black flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  API Ready
                </p>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="flex flex-col">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">ENTRIES</p>
                <p className="text-xs font-bold text-black">{capabilities.length} Modules</p>
              </div>
            </div>

            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Save each capability card to publish changes
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminManufacturingCapabilities;
