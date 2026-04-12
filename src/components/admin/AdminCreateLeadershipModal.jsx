import React from "react";

const AdminCreateLeadershipModal = ({
  isOpen,
  form,
  errors,
  submitError,
  isSaving,
  onClose,
  onChange,
  onUploadImage,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const canSubmit =
    !isSaving &&
    String(form?.name || "").trim() &&
    String(form?.role || "").trim();

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
                <span className="material-symbols-outlined text-base text-blue-600">person_add</span>
                New Leadership Profile
              </div>
              <h3 className="text-2xl font-black text-black tracking-tight">Create Expertise Profile</h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                Add a leadership profile first, then fine-tune details from the profile cards.
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

          {submitError ? (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-bold text-red-600">
              {submitError}
            </div>
          ) : null}

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-4 space-y-3">
              <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                Profile Image
              </label>
              <div className="rounded-[2rem] overflow-hidden border border-slate-200 bg-slate-50 aspect-[4/5] relative">
                {form?.imagePreview ? (
                  <img src={form.imagePreview} alt={form.name || "Profile preview"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-3 p-8 text-center">
                    <span className="material-symbols-outlined text-5xl">account_circle</span>
                    <p className="text-xs font-black uppercase tracking-widest">Upload Profile Photo</p>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/35 flex items-center justify-center p-4">
                  <label className="bg-white text-black px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer shadow-2xl">
                    <span className="material-symbols-outlined text-base">cloud_upload</span>
                    {form?.imagePreview ? "Change Photo" : "Upload Photo"}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      disabled={isSaving}
                      onChange={(e) => onUploadImage(e.target.files?.[0])}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="xl:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => onChange("name", e.target.value)}
                    placeholder="e.g. John Doe"
                    className={`w-full bg-slate-50 border rounded-2xl px-5 py-4 text-sm font-black text-black outline-none focus:bg-white focus:ring-4 transition-all ${
                      errors.name
                        ? "border-red-200 focus:border-red-300 focus:ring-red-500/10"
                        : "border-slate-100 focus:border-blue-200 focus:ring-blue-500/10"
                    }`}
                  />
                  {errors.name ? <p className="text-xs font-bold text-red-600 pl-1">{errors.name}</p> : null}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                    Designation / Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => onChange("role", e.target.value)}
                    placeholder="e.g. Managing Director"
                    className={`w-full bg-slate-50 border rounded-2xl px-5 py-4 text-sm font-black text-black outline-none focus:bg-white focus:ring-4 transition-all ${
                      errors.role
                        ? "border-red-200 focus:border-red-300 focus:ring-red-500/10"
                        : "border-slate-100 focus:border-blue-200 focus:ring-blue-500/10"
                    }`}
                  />
                  {errors.role ? <p className="text-xs font-bold text-red-600 pl-1">{errors.role}</p> : null}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                  Education & Expertise
                </label>
                <textarea
                  value={form.education}
                  onChange={(e) => onChange("education", e.target.value)}
                  placeholder="Mechanical Engineering, Export Management..."
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium text-black outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                  Professional Experience
                </label>
                <textarea
                  value={form.experience}
                  onChange={(e) => onChange("experience", e.target.value)}
                  placeholder="20+ years in precision manufacturing..."
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium text-black outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                />
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
              className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-xl">{isSaving ? "sync" : "add_circle"}</span>
              {isSaving ? "Saving..." : "Add Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateLeadershipModal;
