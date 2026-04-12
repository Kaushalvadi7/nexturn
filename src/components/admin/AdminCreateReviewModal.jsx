import React, { useMemo } from "react";

const isValidStars = (value) => {
  if (value === "" || value === null || value === undefined) return true;
  const parsed = Number(value);
  return !Number.isNaN(parsed) && parsed >= 0 && parsed <= 5;
};

const AdminCreateReviewModal = ({
  isOpen,
  form,
  errors,
  submitError,
  isSaving,
  onClose,
  onChange,
  onSubmit,
}) => {
  const canSubmit = useMemo(() => {
    return String(form?.client_name || "").trim() && isValidStars(form?.stars);
  }, [form?.client_name, form?.stars]);

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
                <span className="material-symbols-outlined text-base text-orange-600">format_quote</span>
                New Story
              </div>
              <h3 className="text-2xl font-black text-black tracking-tight">
                Create Client Success Story
              </h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                Add a new client testimonial that appears on the public site.
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.client_name}
                onChange={(e) => onChange("client_name", e.target.value)}
                placeholder="e.g. European Automotive Tier-1"
                className={`w-full bg-slate-50 border rounded-2xl px-5 py-4 text-sm font-black text-black outline-none focus:bg-white focus:ring-4 transition-all ${
                  errors.client_name
                    ? "border-red-200 focus:border-red-300 focus:ring-red-500/10"
                    : "border-slate-100 focus:border-orange-200 focus:ring-orange-500/10"
                }`}
              />
              {errors.client_name ? (
                <p className="text-xs font-bold text-red-600 pl-1">{errors.client_name}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                Client Position
              </label>
              <input
                type="text"
                value={form.client_position}
                onChange={(e) => onChange("client_position", e.target.value)}
                placeholder="e.g. Procurement Director"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-black outline-none focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                Client City
              </label>
              <input
                type="text"
                value={form.client_city}
                onChange={(e) => onChange("client_city", e.target.value)}
                placeholder="e.g. Germany"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-black outline-none focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                Client Purchase
              </label>
              <input
                type="text"
                value={form.client_purchase}
                onChange={(e) => onChange("client_purchase", e.target.value)}
                placeholder="e.g. Automotive Components"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-black outline-none focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 transition-all"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => onChange("description", e.target.value)}
                placeholder="Short client story or feedback..."
                rows={5}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium text-black outline-none focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 transition-all resize-none"
              />
            </div>

            <div className="space-y-2 md:max-w-[220px]">
              <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                Stars (0-5)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                value={form.stars}
                onChange={(e) => onChange("stars", e.target.value)}
                className={`w-full bg-slate-50 border rounded-2xl px-5 py-4 text-sm font-bold text-black outline-none focus:bg-white focus:ring-4 transition-all ${
                  errors.stars
                    ? "border-red-200 focus:border-red-300 focus:ring-red-500/10"
                    : "border-slate-100 focus:border-orange-200 focus:ring-orange-500/10"
                }`}
              />
              {errors.stars ? (
                <p className="text-xs font-bold text-red-600 pl-1">{errors.stars}</p>
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
              className="flex items-center justify-center gap-3 bg-accent text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20 active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-xl">
                {isSaving ? "sync" : "add_circle"}
              </span>
              {isSaving ? "Saving..." : "Add Story"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateReviewModal;
