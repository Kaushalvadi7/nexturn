import React, { useEffect, useMemo, useState } from "react";
import AdminDeleteModal from "./AdminDeleteModal";
import { useToast } from "../../contexts/ToastContext";
import { createRegion, deleteRegion, getRegions } from "../../lib/api";
import { countryNameByCode, countryOptions } from "../../constants/countryOptions";

const GlobalPresenceCard = () => {
  const toast = useToast();
  const [regions, setRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("");

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    countryCode: "",
    title: "",
  });

  const loadRegions = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getRegions();
      setRegions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load regions.");
      setRegions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRegions();
  }, []);

  const countryEntries = useMemo(() => {
    const grouped = regions.reduce((acc, region) => {
      const countryCode = String(region.country_code || "").trim().toUpperCase();
      if (!countryCode) return acc;
      if (!acc[countryCode]) {
        acc[countryCode] = [];
      }
      acc[countryCode].push(region);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([countryCode, rows]) => ({
        countryCode,
        countryName: countryNameByCode[countryCode] || countryCode,
        rows,
      }))
      .sort((a, b) => a.countryName.localeCompare(b.countryName));
  }, [regions]);

  const addCountry = async () => {
    const countryCode = String(selectedCountryCode || "").trim().toUpperCase();

    if (!countryCode) {
      setError("Please select a country.");
      return;
    }

    const duplicate = regions.some(
      (region) => String(region.country_code || "").trim().toUpperCase() === countryCode
    );

    if (duplicate) {
      setError("This country already exists.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      await createRegion({ country_code: countryCode });
      setSelectedCountryCode("");
      await loadRegions();
      toast.success("Saved successfully");
    } catch (err) {
      setError(err?.message || "Failed to save country.");
      toast.error("Failed");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDeleteCountry = (countryCode) => {
    const normalizedCode = String(countryCode || "").trim().toUpperCase();
    if (!normalizedCode) return;

    const countryName = countryNameByCode[normalizedCode] || normalizedCode;

    setDeleteModal({
      isOpen: true,
      countryCode: normalizedCode,
      title: countryName,
    });
  };

  const handleDeleteCountry = async () => {
    if (!deleteModal.countryCode) return;

    const idsToDelete = regions
      .filter((region) => String(region.country_code || "").trim().toUpperCase() === deleteModal.countryCode)
      .map((region) => region.id)
      .filter(Boolean);

    if (!idsToDelete.length) {
      setDeleteModal({ isOpen: false, countryCode: "", title: "" });
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      await Promise.all(idsToDelete.map((id) => deleteRegion(id)));
      setDeleteModal({ isOpen: false, countryCode: "", title: "" });
      await loadRegions();
      toast.success("Deleted successfully");
    } catch (err) {
      setError(err?.message || "Failed to delete country.");
      toast.error("Failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#eff6ff] rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col gap-6">
      <AdminDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, countryCode: "", title: "" })}
        onConfirm={handleDeleteCountry}
        title="Remove Country?"
        message={`Are you sure you want to remove "${deleteModal.title}" from your global presence list?`}
      />

      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-black">map</span>
        <h3 className="text-sm font-black text-black uppercase tracking-widest mt-0.5">Regions We Serve</h3>
      </div>

      <div className="flex flex-col gap-6">
        {error ? (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-bold text-red-600">
            {error}
          </div>
        ) : null}

        <div className="space-y-4 border-b border-blue-100 pb-6">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Add Served Country</div>

          <div className="grid md:grid-cols-1 gap-3">
            <select
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
              className="bg-white/50 border border-blue-100 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all"
            >
              <option value="">Select country</option>
              {countryOptions.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              onClick={addCountry}
              disabled={isSaving}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Add Country
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-xl bg-white border border-blue-100 px-4 py-3 text-xs font-bold text-slate-500">
            Loading regions...
          </div>
        ) : null}

        {countryEntries.map((group) => (
          <div
            key={group.countryCode}
            className="space-y-3 border-b border-blue-100 pb-6 last:border-0 last:pb-0"
          >
            <div className="flex items-center justify-between gap-3 bg-white/80 border border-blue-100 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-lg">public</span>
                <div className="text-sm font-black text-slate-900">
                  {group.countryName} ({group.countryCode})
                </div>
              </div>
              <button
                onClick={() => confirmDeleteCountry(group.countryCode)}
                className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200"
                title="Delete country"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobalPresenceCard;
