import worldMapData from "../assets/world-map-data.js";

const toUpperISO = (value) => String(value || "").trim().toUpperCase();

export const countryOptions = (Array.isArray(worldMapData?.locations) ? worldMapData.locations : [])
  .map((country) => {
    const code = toUpperISO(country?.id);
    const name = String(country?.name || "").trim();
    if (!/^[A-Z]{2}$/.test(code) || !name) return null;
    return { code, name };
  })
  .filter(Boolean)
  .sort((a, b) => a.name.localeCompare(b.name));

export const countryNameByCode = countryOptions.reduce((acc, country) => {
  acc[country.code] = country.name;
  return acc;
}, {});

