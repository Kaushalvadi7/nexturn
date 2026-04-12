import React from "react";

const AdminCreateInfrastructureModal = ({
  isOpen,
  form,
  errors,
  submitError,
  isSaving,
  onClose,
  onChange,
  onAddPoint,
  onRemovePoint,
  onSubmit,
}) => {
  const title = String(form?.title || "").trim();
  const description = String(form?.description || "").trim();
  const hasPoint = (Array.isArray(form?.points) ? form.points : []).some((value) =>
    String(value || "").trim(),
  );
  const canSubmit = title && description && hasPoint;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-start sm:items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.35)] animate-in zoom-in-95 fade-in duration-300 ring-1 ring-black/5">
        <div className="max-h-[90vh] overflow-y-auto p-6 sm:p-10 space-y-8 custom-scrollbar">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-black font-black text-xs tracking-widest uppercase">
                <span className="material-symbols-outlined text-base text-blue-600">manufacturing</span>
                New Infrastructure
              </div>
              <h3 className="text-2xl font-black text-black tracking-tight">
                Create Manufacturing Infrastructure
              </h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                Add a complete infrastructure entry, then manage edits from the list.
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

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => onChange("title", e.target.value)}
                placeholder="e.g. CNC Manufacturing Cell"
                className={`w-full bg-slate-50 border rounded-2xl px-5 py-4 text-base font-black text-black outline-none focus:bg-white focus:ring-4 transition-all ${
                  errors.title
                    ? "border-red-200 focus:border-red-300 focus:ring-red-500/10"
                    : "border-slate-100 focus:border-blue-200 focus:ring-blue-500/10"
                }`}
              />
              {errors.title ? (
                <p className="text-xs font-bold text-red-600 pl-1">{errors.title}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => onChange("description", e.target.value)}
                placeholder="Summarize the equipment area, production setup, or facility capability..."
                rows={5}
                className={`w-full bg-slate-50 border rounded-2xl px-5 py-4 text-sm font-medium text-black outline-none focus:bg-white focus:ring-4 transition-all resize-none ${
                  errors.description
                    ? "border-red-200 focus:border-red-300 focus:ring-red-500/10"
                    : "border-slate-100 focus:border-blue-200 focus:ring-blue-500/10"
                }`}
              />
              {errors.description ? (
                <p className="text-xs font-bold text-red-600 pl-1">{errors.description}</p>
              ) : null}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-l-2 border-blue-500 pl-3">
                <div>
                  <h4 className="text-xs font-black text-black uppercase tracking-widest">
                    Key Points <span className="text-red-500">*</span>
                  </h4>
                  <p className="text-xs font-medium text-slate-500 mt-1">
                    Add at least one operational or technical point.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onAddPoint}
                  className="text-blue-600 hover:text-blue-700 font-bold text-xs uppercase tracking-widest flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  Add Point
                </button>
              </div>

              <div className="space-y-3">
                {(form.points || []).map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3"
                  >
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => onChange("points", { index: idx, value: e.target.value })}
                      placeholder={`Point ${idx + 1}`}
                      className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() => onRemovePoint(idx)}
                      className="w-9 h-9 rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                      title="Remove point"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
              {errors.points ? (
                <p className="text-xs font-bold text-red-600 pl-1">{errors.points}</p>
              ) : null}
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
              disabled={isSaving || !canSubmit}
              className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-xl">
                {isSaving ? "sync" : "playlist_add"}
              </span>
              {isSaving ? "Saving..." : "Add Entry"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateInfrastructureModal;
