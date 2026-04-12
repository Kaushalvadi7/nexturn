import React from "react";

const MapTooltip = ({ countryName, position }) => {
  if (!countryName || !position) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute z-40 w-64 rounded-lg border border-white/15 bg-[color:var(--color-export-tooltip-bg)] p-4 text-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] animate-fade-in"
      style={{ left: position.x, top: position.y, transform: "translate(14px, -50%)" }}
      role="tooltip"
    >
      <p className="text-sm font-bold">{countryName}</p>
      <p className="mt-2 text-xs text-slate-100">Serving</p>
    </div>
  );
};

export default MapTooltip;
