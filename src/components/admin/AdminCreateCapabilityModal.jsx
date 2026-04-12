import React, { useMemo } from 'react';

const AdminCreateCapabilityModal = ({
  isOpen,
  title,
  form,
  errors,
  isSaving,
  onClose,
  onChange,
  onAddFeature,
  onRemoveFeature,
  onPickIcon,
  onSubmit,
}) => {
  const canSubmit = useMemo(() => {
    if (isSaving) return false;
    const titleValue = String(form?.title || '').trim();
    const descriptionValue = String(form?.description || '').trim();
    const iconValue = String(form?.icon || '').trim();
    const features = Array.isArray(form?.features) ? form.features : [];
    const hasFeature = features.some((v) => String(v || '').trim().length > 0);
    return titleValue.length > 0 && descriptionValue.length > 0 && iconValue.length > 0 && hasFeature;
  }, [form?.title, form?.description, form?.icon, form?.features, isSaving]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-start sm:items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.35)] animate-in zoom-in-95 fade-in duration-300 ring-1 ring-black/5">
        <div className="max-h-[90vh] overflow-y-auto p-6 sm:p-10 space-y-8 custom-scrollbar">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-black font-black text-xs tracking-widest uppercase">
                <span className="material-symbols-outlined text-base text-orange-600">add_box</span>
                New Capability
              </div>
              <h3 className="text-2xl font-black text-black tracking-tight">
                {title || 'Create Manufacturing Capability'}
              </h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                Add a capability that will appear on the public site. You can edit it later from the list.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-11 h-11 bg-slate-50 text-slate-400 hover:text-black hover:bg-slate-100 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => onChange('title', e.target.value)}
                  placeholder="e.g. CNC Turning"
                  className={`w-full bg-slate-50 border rounded-2xl px-6 py-4 text-sm font-black text-black outline-none focus:bg-white focus:ring-4 transition-all ${
                    errors.title ? 'border-red-200 focus:border-red-300 focus:ring-red-500/10' : 'border-slate-100 focus:border-orange-200 focus:ring-orange-500/10'
                  }`}
                />
                {errors.title ? (
                  <p className="text-xs font-bold text-red-600 pl-1">{errors.title}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => onChange('description', e.target.value)}
                  placeholder="Short summary shown under the capability title..."
                  rows={5}
                  className={`w-full bg-slate-50 border rounded-2xl px-6 py-4 text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all resize-none leading-relaxed ${
                    errors.description ? 'border-red-200 focus:border-red-300 focus:ring-red-500/10' : 'border-slate-100 focus:border-orange-200 focus:ring-orange-500/10'
                  }`}
                />
                {errors.description ? (
                  <p className="text-xs font-bold text-red-600 pl-1">{errors.description}</p>
                ) : null}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                  Icon
                </label>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-500 shrink-0">
                      <span className="material-symbols-outlined text-2xl">{form.icon || 'manufacturing'}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Material Symbol
                      </p>
                      <input
                        type="text"
                        value={form.icon}
                        onChange={(e) => onChange('icon', e.target.value)}
                        className="w-full bg-transparent outline-none text-sm font-black text-[#1b365d] truncate"
                        placeholder="e.g. precision_manufacturing"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onPickIcon}
                    className="bg-black text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all cursor-pointer shrink-0"
                  >
                    Pick
                  </button>
                </div>
                {errors.icon ? (
                  <p className="text-xs font-bold text-red-600 pl-1">{errors.icon}</p>
                ) : null}
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Visibility</p>
                  <p className="text-sm font-black text-[#1b365d] mt-1">
                    {form.isActive ? 'Active on site' : 'Hidden (draft)'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onChange('isActive', !form.isActive)}
                  className={`w-16 h-9 rounded-full p-1 transition-all cursor-pointer ${
                    form.isActive ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle active"
                >
                  <div
                    className={`w-7 h-7 bg-white rounded-full shadow-md transition-transform ${
                      form.isActive ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black text-black/50 uppercase tracking-widest">Key Properties</p>
                <p className="text-sm font-bold text-slate-600 mt-1">
                  Bullet points shown under this capability.
                </p>
              </div>
              <button
                type="button"
                onClick={onAddFeature}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-black px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">add</span>
                Add Point
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(form.features || []).map((value, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3"
                >
                  <span className="material-symbols-outlined text-slate-300">check_circle</span>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange('feature', { index: idx, value: e.target.value })}
                    placeholder={`Point ${idx + 1}`}
                    className="flex-1 bg-transparent outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveFeature(idx)}
                    className="w-9 h-9 rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    title="Remove point"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              ))}
            </div>

            {errors.features ? (
              <p className="text-xs font-bold text-red-600 pl-1">{errors.features}</p>
            ) : null}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:text-black hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={!canSubmit}
              className="flex items-center justify-center gap-3 bg-black hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-black/20 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-xl">{isSaving ? 'sync' : 'rocket_launch'}</span>
              {isSaving ? 'Creating...' : 'Create Capability'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateCapabilityModal;
