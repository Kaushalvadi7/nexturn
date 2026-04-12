import React from 'react';

const AdminCreateMaterialModal = ({
  isOpen,
  form,
  errors,
  isUploadingImage,
  onClose,
  onChange,
  onUploadImage,
  onAddListItem,
  onRemoveListItem,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const hasGrade = (form.grades || []).some((value) => String(value || '').trim());
  const hasApplication = (form.applications || []).some((value) => String(value || '').trim());
  const canSubmit =
    !isUploadingImage &&
    String(form.image || '').trim() &&
    String(form.title || '').trim() &&
    String(form.description || '').trim() &&
    hasGrade &&
    hasApplication;

  return (
    <div className="fixed inset-0 z-[120] flex items-start sm:items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.35)] animate-in zoom-in-95 fade-in duration-300 ring-1 ring-black/5">
        <div className="max-h-[90vh] overflow-y-auto p-6 sm:p-10 space-y-8 custom-scrollbar">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-black font-black text-xs tracking-widest uppercase">
                <span className="material-symbols-outlined text-base text-blue-600">add_box</span>
                New Material
              </div>
              <h3 className="text-2xl font-black text-black tracking-tight">Create Material Specialization</h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                Add a complete material specialization first, then review it in the list before publishing.
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

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-4 space-y-3">
              <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                Image <span className="text-red-500">*</span>
              </label>
              <div className="rounded-[2rem] overflow-hidden border border-slate-200 bg-slate-50 aspect-[4/5] relative">
                {form.image ? (
                  <img src={form.image} alt={form.title || 'Material preview'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-3 p-8 text-center">
                    <span className="material-symbols-outlined text-5xl">image</span>
                    <p className="text-xs font-black uppercase tracking-widest">Upload Material Image</p>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/35 flex items-center justify-center p-4">
                  <label className="bg-white text-black px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer shadow-2xl">
                    <span className="material-symbols-outlined text-base">
                      {isUploadingImage ? 'sync' : 'cloud_upload'}
                    </span>
                    {isUploadingImage ? 'Uploading...' : form.image ? 'Change Image' : 'Upload Image'}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      disabled={isUploadingImage}
                      onChange={(e) => onUploadImage(e.target.files?.[0])}
                    />
                  </label>
                </div>
              </div>
              {errors.image ? <p className="text-xs font-bold text-red-600 pl-1">{errors.image}</p> : null}
            </div>

            <div className="xl:col-span-8 space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => onChange('title', e.target.value)}
                    placeholder="e.g. Brass Forged Components"
                    className={`w-full bg-slate-50 border rounded-2xl px-6 py-4 text-lg font-black text-black outline-none focus:bg-white focus:ring-4 transition-all ${
                      errors.title ? 'border-red-200 focus:border-red-300 focus:ring-red-500/10' : 'border-slate-100 focus:border-blue-200 focus:ring-blue-500/10'
                    }`}
                  />
                  {errors.title ? <p className="text-xs font-bold text-red-600 pl-1">{errors.title}</p> : null}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => onChange('description', e.target.value)}
                    placeholder="Summarize the alloy expertise, production depth, or manufacturing suitability..."
                    rows={4}
                    className={`w-full bg-slate-50 border rounded-2xl px-6 py-4 text-sm font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all resize-none leading-relaxed ${
                      errors.description ? 'border-red-200 focus:border-red-300 focus:ring-red-500/10' : 'border-slate-100 focus:border-blue-200 focus:ring-blue-500/10'
                    }`}
                  />
                  {errors.description ? <p className="text-xs font-bold text-red-600 pl-1">{errors.description}</p> : null}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-l-2 border-orange-500 pl-3">
                    <div>
                      <h4 className="text-xs font-black text-black uppercase tracking-widest">
                        Grades <span className="text-red-500">*</span>
                      </h4>
                      <p className="text-xs font-medium text-slate-500 mt-1">Add at least one grade.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddListItem('grades')}
                      className="text-orange-600 hover:text-orange-700 font-bold text-xs uppercase tracking-widest flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">add_circle</span>
                      Add Grade
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(form.grades || []).map((grade, idx) => (
                      <div key={idx} className="flex items-center gap-2 group/item">
                        <input
                          type="text"
                          value={grade}
                          onChange={(e) => onChange('grades', { index: idx, value: e.target.value })}
                          placeholder={`Grade ${idx + 1}`}
                          className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:bg-white focus:border-orange-100 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => onRemoveListItem('grades', idx)}
                          className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-red-500 transition-all cursor-pointer"
                          title="Remove grade"
                        >
                          <span className="material-symbols-outlined text-sm">remove_circle</span>
                        </button>
                      </div>
                    ))}
                  </div>
                  {errors.grades ? <p className="text-xs font-bold text-red-600 pl-1">{errors.grades}</p> : null}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-l-2 border-green-500 pl-3">
                    <div>
                      <h4 className="text-xs font-black text-black uppercase tracking-widest">
                        Common Applications <span className="text-red-500">*</span>
                      </h4>
                      <p className="text-xs font-medium text-slate-500 mt-1">Add at least one application.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddListItem('applications')}
                      className="text-green-600 hover:text-green-700 font-bold text-xs uppercase tracking-widest flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">add_circle</span>
                      Add Application
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(form.applications || []).map((app, idx) => (
                      <div key={idx} className="flex items-center gap-2 group/item">
                        <input
                          type="text"
                          value={app}
                          onChange={(e) => onChange('applications', { index: idx, value: e.target.value })}
                          placeholder={`Application ${idx + 1}`}
                          className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:bg-white focus:border-green-100 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => onRemoveListItem('applications', idx)}
                          className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-red-500 transition-all cursor-pointer"
                          title="Remove application"
                        >
                          <span className="material-symbols-outlined text-sm">remove_circle</span>
                        </button>
                      </div>
                    ))}
                  </div>
                  {errors.applications ? <p className="text-xs font-bold text-red-600 pl-1">{errors.applications}</p> : null}
                </div>
              </div>
            </div>
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
              className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-xl">playlist_add</span>
              Add Material
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateMaterialModal;
