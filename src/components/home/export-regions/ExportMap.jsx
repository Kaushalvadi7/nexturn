import React, { useEffect, useMemo, useRef, useState } from "react";
import worldMapData from "../../../assets/world-map-data.js";
import { getCountryNameFromCode } from "../../../constants/servedRegions";
import MapTooltip from "./MapTooltip";
import MobileRegionModal from "./MobileRegionModal";

const DEFAULT_VIEWBOX = "0 0 1010 666";

const normalizeCountryCode = (rawId) => {
  const value = String(rawId || "").trim();
  if (!value) return null;

  let countryCode = value;
  if (countryCode.toLowerCase().startsWith("path_")) {
    countryCode = countryCode.slice(5);
  }

  countryCode = countryCode.toUpperCase();
  if (!/^[A-Z]{2}$/.test(countryCode)) return null;

  return countryCode;
};

const ExportMap = ({ servedRegions }) => {
  const containerRef = useRef(null);
  const [activeCountry, setActiveCountry] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const mapData = useMemo(() => {
    const locations = Array.isArray(worldMapData?.locations) ? worldMapData.locations : [];

    const countries = locations
      .map((location) => {
        const code = normalizeCountryCode(location?.id);
        const d = String(location?.path || "");

        if (!code || !d) return null;
        return { code, d };
      })
      .filter(Boolean);

    return {
      viewBox: worldMapData?.viewBox || DEFAULT_VIEWBOX,
      countries,
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(hover: none), (pointer: coarse)");

    const syncMobileState = () => {
      setIsMobile(media.matches);
      if (media.matches) {
        setTooltipPosition(null);
      }
    };

    syncMobileState();
    media.addEventListener("change", syncMobileState);

    return () => media.removeEventListener("change", syncMobileState);
  }, []);

  const servedSet = useMemo(
    () => new Set(Object.keys(servedRegions || {}).map((code) => code.toUpperCase())),
    [servedRegions]
  );

  const activeCountryName = activeCountry ? getCountryNameFromCode(activeCountry) : "";

  const updateTooltipPosition = (event) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const tooltipWidth = 272;
    const tooltipHeightOffset = 80;

    const x = Math.max(8, Math.min(event.clientX - rect.left, rect.width - tooltipWidth));
    const y = Math.max(8, Math.min(event.clientY - rect.top, rect.height - tooltipHeightOffset));

    setTooltipPosition({ x, y });
  };

  const handleDesktopEnter = (countryCode, event) => {
    if (isMobile || !servedSet.has(countryCode)) return;
    setActiveCountry(countryCode);
    updateTooltipPosition(event);
  };

  const handleDesktopMove = (countryCode, event) => {
    if (isMobile || activeCountry !== countryCode || !servedSet.has(countryCode)) return;
    updateTooltipPosition(event);
  };

  const handleDesktopLeave = () => {
    if (isMobile) return;
    setActiveCountry(null);
    setTooltipPosition(null);
  };

  const handleCountrySelect = (countryCode) => {
    if (!servedSet.has(countryCode)) return;
    setActiveCountry(countryCode);
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,var(--color-export-map-start),var(--color-export-map-end))] p-4 sm:p-6 lg:p-8 shadow-2xl"
      >
        <svg
          className="relative z-10 h-auto w-full"
          viewBox={mapData.viewBox}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="World export coverage map"
        >
          <g>
            {mapData.countries.map((country) => {
              const isServed = servedSet.has(country.code);
              const isActive = activeCountry === country.code;

              return (
                <path
                  key={`${country.code}-${country.d.slice(0, 18)}`}
                  id={country.code}
                  d={country.d}
                  tabIndex={isServed ? 0 : -1}
                  role={isServed ? "button" : "presentation"}
                  aria-label={isServed ? `${getCountryNameFromCode(country.code)} served country` : undefined}
                  onMouseEnter={(event) => handleDesktopEnter(country.code, event)}
                  onMouseMove={(event) => handleDesktopMove(country.code, event)}
                  onMouseLeave={handleDesktopLeave}
                  onClick={() => handleCountrySelect(country.code)}
                  onKeyDown={(event) => {
                    if (!isServed) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleCountrySelect(country.code);
                    }
                  }}
                  className="transition-all duration-300"
                  style={{
                    fill: isServed ? "var(--color-accent)" : "var(--color-export-country-muted)",
                    stroke: isActive ? "var(--color-accent)" : "rgba(255,255,255,0.38)",
                    strokeWidth: isActive ? 1.6 : 0.7,
                    cursor: isServed ? "pointer" : "default",
                    filter: isActive ? "brightness(1.08)" : "none",
                  }}
                />
              );
            })}
          </g>
        </svg>

        {!isMobile ? (
          <MapTooltip
            countryName={activeCountryName}
            position={tooltipPosition}
          />
        ) : null}
      </div>

      <div className="mt-5 flex items-center justify-center gap-6 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-accent)]" aria-hidden="true" />
          <span>Serving</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-export-country-muted)]" aria-hidden="true" />
          <span>Not Serving</span>
        </div>
      </div>

      <MobileRegionModal
        isOpen={Boolean(isMobile && activeCountry)}
        countryName={activeCountryName}
        onClose={() => setActiveCountry(null)}
      />
    </div>
  );
};

export default ExportMap;
