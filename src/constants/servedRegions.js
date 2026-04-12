export const servedRegions = {
  IN: ["Gujarat", "Maharashtra", "Delhi"],
  US: ["California", "Texas"],
  DE: ["Bavaria", "Berlin"],
};

const COUNTRY_NAME_FALLBACK = {
  IN: "India",
  US: "United States",
  DE: "Germany",
};

const regionDisplay =
  typeof Intl !== "undefined" && typeof Intl.DisplayNames === "function"
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

export const getCountryNameFromCode = (countryCode) => {
  const code = String(countryCode || "").toUpperCase();
  if (!code) return "Unknown";

  const resolved = regionDisplay?.of(code);
  if (resolved && resolved !== code) {
    return resolved;
  }

  return COUNTRY_NAME_FALLBACK[code] || code;
};

export const buildServedCountryList = (regionsByCountry = servedRegions) => {
  return Object.entries(regionsByCountry).map(([countryCode, regions]) => ({
    countryCode,
    countryName: getCountryNameFromCode(countryCode),
    regions: Array.isArray(regions) ? regions : [],
  }));
};
