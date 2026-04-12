import React from "react";

const AdminCreateSuccessStoryModal = ({
  isOpen,
  form,
  errors,
  submitError,
  isSaving,
  onClose,
  onChange,
  onAddResult,
  onRemoveResult,
  onSubmit,
}) => {
  const title = String(form?.title || "").trim();
  const product = String(form?.product || "").trim();
  const country = String(form?.country || "").trim();
  const yearValue = String(form?.year ?? "").trim();
  const yearNumber = yearValue === "" ? NaN : Number(yearValue);
  const canSubmit =
    title &&
    product &&
    country &&
    yearValue !== "" &&
    !Number.isNaN(yearNumber);

  if (!isOpen) return null;

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
                <span className="material-symbols-outlined text-base text-blue-600">public</span>
                New Success Story
              </div>
              <h3 className="text-2xl font-black text-black tracking-tight">
                Create Client Success Story
              </h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                Add a new international case study, then refine it from the list if needed.
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

          <div className="grid grid-cols-1 gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                  Client / Case Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => onChange("title", e.target.value)}
                  placeholder="e.g. European Automotive Tier-1 Supplier"
                  className={`w-full bg-slate-50 border rounded-2xl px-6 py-5 text-lg font-black text-[#1b365d] outline-none focus:bg-white focus:ring-4 transition-all ${
                    errors.title
                      ? "border-red-200 focus:border-red-300 focus:ring-red-500/10"
                      : "border-slate-100 focus:border-blue-400 focus:ring-blue-500/10"
                  }`}
                />
                {errors.title ? (
                  <p className="text-xs font-bold text-red-600 pl-1">{errors.title}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                  Industry / Product <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.product}
                  onChange={(e) => onChange("product", e.target.value)}
                  placeholder="e.g. Automotive Components"
                  className={`w-full bg-slate-50 border rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all ${
                    errors.product
                      ? "border-red-200 focus:border-red-300 focus:ring-red-500/10"
                      : "border-slate-100 focus:border-blue-400 focus:ring-blue-500/10"
                  }`}
                />
                {errors.product ? (
                  <p className="text-xs font-bold text-red-600 pl-1">{errors.product}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                  Regional Market <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => onChange("country", e.target.value)}
                  placeholder="e.g. Germany"
                  className={`w-full bg-slate-50 border rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all ${
                    errors.country
                      ? "border-red-200 focus:border-red-300 focus:ring-red-500/10"
                      : "border-slate-100 focus:border-blue-400 focus:ring-blue-500/10"
                  }`}
                />
                {errors.country ? (
                  <p className="text-xs font-bold text-red-600 pl-1">{errors.country}</p>
                ) : null}
              </div>

              <div className="space-y-2 md:max-w-[220px]">
                <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                  Duration / Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => onChange("year", e.target.value)}
                  placeholder="e.g. 2022"
                  className={`w-full bg-orange-50/50 border rounded-2xl px-5 py-4 text-sm font-black text-orange-600 outline-none focus:bg-white focus:ring-4 transition-all ${
                    errors.year
                      ? "border-red-200 focus:border-red-300 focus:ring-red-500/10"
                      : "border-orange-100 focus:border-orange-400 focus:ring-orange-500/10"
                  }`}
                />
                {errors.year ? (
                  <p className="text-xs font-bold text-red-600 pl-1">{errors.year}</p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                  Challenge
                </label>
                <textarea
                  value={form.challenge}
                  onChange={(e) => onChange("challenge", e.target.value)}
                  placeholder="Describe the technical roadblock or requirement..."
                  rows={5}
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-5 text-sm font-medium text-slate-600 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">
                  Solution
                </label>
                <textarea
                  value={form.solution}
                  onChange={(e) => onChange("solution", e.target.value)}
                  placeholder="Explain the engineering approach and implementation..."
                  rows={5}
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-5 text-sm font-medium text-slate-600 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-black uppercase tracking-widest">
                    Measurable Results
                  </h4>
                  <p className="text-xs font-medium text-slate-500 mt-1">
                    Optional result points shown under the story.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onAddResult}
                  className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:text-blue-700 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  Add Result
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(form.results || []).map((result, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3"
                  >
                    <input
                      type="text"
                      value={result}
                      onChange={(e) => onChange("results", { index: idx, value: e.target.value })}
                      placeholder={`Result ${idx + 1}`}
                      className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveResult(idx)}
                      className="w-9 h-9 rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                      title="Remove result"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                ))}
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
              disabled={isSaving || !canSubmit}
              className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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

export default AdminCreateSuccessStoryModal;
