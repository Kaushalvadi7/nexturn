import React from "react";

const MobileRegionModal = ({ isOpen, countryName, onClose }) => {
  if (!isOpen || !countryName) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-4" role="dialog" aria-modal="true" aria-label={countryName}>
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/60"
        onClick={onClose}
        aria-label="Close country dialog"
      />

      <div className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-white/15 bg-[color:var(--color-export-tooltip-bg)] text-white p-6 shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold">{countryName}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-200 hover:bg-white/10"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="mt-2 text-sm text-slate-300">Serving</p>
      </div>
    </div>
  );
};

export default MobileRegionModal;
