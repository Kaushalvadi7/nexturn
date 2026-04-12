import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { useToast } from '../../contexts/ToastContext';
import AdminDeleteModal from '../../components/admin/AdminDeleteModal';
import AdminIconPicker from '../../components/admin/AdminIconPicker';
import {
  addHeroSliderImagesForm,
  deleteHeroSliderImage,
  createPerformanceMetrices,
  deletePerformanceMetrices,
  getHeroSliderImages,
  getPerformanceMetrices,
  updatePerformanceMetrices,
} from '../../lib/api';

const AdminHome = () => {
  const toast = useToast();
  const [heroImages, setHeroImages] = useState([]);
  const [pendingHeroImages, setPendingHeroImages] = useState([]);
  const [isLoadingHero, setIsLoadingHero] = useState(true);
  const [isSavingHero, setIsSavingHero] = useState(false);
  const [heroError, setHeroError] = useState("");
  const [heroNote, setHeroNote] = useState("");

  const [stats, setStats] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");
  const [statsNote, setStatsNote] = useState("");
  const [isSavingStat, setIsSavingStat] = useState(false);

  const [deleteModal, setDeleteModal] = useState({ 
    isOpen: false, 
    id: null, 
    type: 'stat',
    title: "" 
  });

  const [iconPicker, setIconPicker] = useState({
    isOpen: false,
    activeStatId: null
  });

  const loadHeroImages = async () => {
    setIsLoadingHero(true);
    setHeroError("");
    try {
      const data = await getHeroSliderImages();
      setHeroImages(Array.isArray(data) ? data : []);
    } catch (err) {
      setHeroImages([]);
      setHeroError(err?.message || "Failed to load hero images.");
    } finally {
      setIsLoadingHero(false);
    }
  };

  const loadStats = async () => {
    setIsLoadingStats(true);
    setStatsError("");
    try {
      const data = await getPerformanceMetrices();
      if (Array.isArray(data)) {
        setStats(
          data.map((item) => ({
            id: item.id,
            icon: item.icon_name || "query_stats",
            value: item.value || "",
            label: item.field || "",
            viewInHeroPage: Boolean(item.view_in_hero_page),
            viewInAboutUsPage: Boolean(item.view_in_about_us),
          }))
        );
      } else {
        setStats([]);
      }
    } catch (err) {
      setStatsError(err?.message || "Failed to load metrics.");
      setStats([]);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    loadHeroImages();
    loadStats();
  }, []);

  useEffect(() => {
    return () => {
      pendingHeroImages.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, [pendingHeroImages]);

  const handleSelectHeroImages = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";

    setHeroError("");
    setHeroNote("");

    if (files.length === 0) return;

    if (files.length > 7) {
      setHeroError("You can upload at most 7 images.");
      return;
    }

    setPendingHeroImages((prev) => {
      prev.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });

      return files.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));
    });
  };

  const removePendingHeroImage = (id) => {
    setPendingHeroImages((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const clearPendingHeroImages = () => {
    setPendingHeroImages((prev) => {
      prev.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
      return [];
    });
  };

  const saveHeroImages = async () => {
    setHeroError("");
    setHeroNote("");

    if (pendingHeroImages.length === 0) {
      setHeroError("Select at least 1 image to save.");
      return;
    }

    if (heroImages.length + pendingHeroImages.length > 7) {
      setHeroError("You can have at most 7 hero slider images.");
      return;
    }

    setIsSavingHero(true);
    try {
      const formData = new FormData();
      pendingHeroImages.forEach((item) => formData.append("images", item.file));
      const saved = await addHeroSliderImagesForm(formData);
      setHeroImages(Array.isArray(saved) ? saved : []);
      clearPendingHeroImages();
      toast.success("Edited successfully");
      setHeroNote("Hero slider images added.");
    } catch (err) {
      toast.error("Failed");
      setHeroError(err?.message || "Failed to save hero images.");
    } finally {
      setIsSavingHero(false);
    }
  };

  const handleDeleteHeroImage = async (id) => {
    if (!id) return;
    setIsSavingHero(true);
    setHeroError("");
    setHeroNote("");
    try {
      await deleteHeroSliderImage(id);
      await loadHeroImages();
      toast.success("Deleted successfully");
      setHeroNote("Hero slider image deleted.");
    } catch (err) {
      toast.error("Failed");
      setHeroError(err?.message || "Failed to delete hero image.");
    } finally {
      setIsSavingHero(false);
    }
  };

  const handleAddStat = async () => {
    setIsSavingStat(true);
    setStatsError("");
    setStatsNote("");
    try {
      await createPerformanceMetrices({
        field: "New Metric",
        value: "0",
        icon_name: "add_chart",
        view_in_hero_page: false,
        view_in_about_us: false,
      });
      await loadStats();
      toast.success("Saved successfully");
      setStatsNote("Metric added.");
    } catch (err) {
      toast.error("Failed");
      setStatsError(err?.message || "Failed to add metric.");
    } finally {
      setIsSavingStat(false);
    }
  };

  const handleUpdateStat = (id, field, value) => {
    setStats(stats.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const persistStat = async (id, payload) => {
    if (!id) return;
    setIsSavingStat(true);
    setStatsError("");
    setStatsNote("");
    try {
      await updatePerformanceMetrices(id, payload);
      toast.success("Edited successfully");
      setStatsNote("Metric saved.");
    } catch (err) {
      toast.error("Failed");
      setStatsError(err?.message || "Failed to save metric.");
    } finally {
      setIsSavingStat(false);
    }
  };

  const openDeleteModal = (id, type, title) => {
    setDeleteModal({ isOpen: true, id, type, title });
  };

  const openIconPicker = (statId) => {
    setIconPicker({ isOpen: true, activeStatId: statId });
  };

  const handleSelectIcon = (iconName) => {
    handleUpdateStat(iconPicker.activeStatId, 'icon', iconName);
    persistStat(iconPicker.activeStatId, { icon_name: iconName });
    setIconPicker({ isOpen: false, activeStatId: null });
  };

  const handleConfirmDelete = async () => {
    setIsSavingStat(true);
    setStatsError("");
    setStatsNote("");
    try {
      await deletePerformanceMetrices(deleteModal.id);
      setStats(stats.filter(s => s.id !== deleteModal.id));
      toast.success("Deleted successfully");
      setStatsNote("Metric deleted.");
    } catch (err) {
      toast.error("Failed");
      setStatsError(err?.message || "Failed to delete metric.");
    } finally {
      setIsSavingStat(false);
    }
    setDeleteModal({ isOpen: false, id: null, type: 'stat', title: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif]">
      <AdminNavbar />
      
      <AdminDeleteModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title="Delete Metric?"
        message={`Are you sure you want to remove "${deleteModal.title}"? This action cannot be undone.`}
      />

      <AdminIconPicker 
        isOpen={iconPicker.isOpen}
        onClose={() => setIconPicker({ ...iconPicker, isOpen: false })}
        onSelect={handleSelectIcon}
      />
      
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 py-12 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-black font-black text-xs tracking-widest uppercase">
               <span className="material-symbols-outlined text-base">home</span>
               HOME PAGE MANAGEMENT
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Main Hero & Key Metrics</h1>
          <p className="text-black font-medium max-w-2xl leading-relaxed text-sm">
              Control the first impression of your site by managing the hero slider images and the high-level performance statistics.
            </p>
          </div>
        </div>

        {/* Hero Images Slider Management */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-sm space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-black text-2xl md:text-3xl">gallery_thumbnail</span>
              <h3 className="text-lg md:text-xl font-black text-black uppercase tracking-widest">Hero Slider Images</h3>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <input
                id="hero-slider-upload"
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleSelectHeroImages}
              />
              <button
                type="button"
                onClick={() => document.getElementById("hero-slider-upload")?.click()}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2 active:scale-95 cursor-pointer justify-center"
              >
                <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                Select Images (Max 7)
              </button>
              <button
                type="button"
                onClick={saveHeroImages}
                disabled={isSavingHero || pendingHeroImages.length === 0}
                className="bg-[#1b365d] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#2c4c7c] transition-all shadow-xl shadow-[#1b365d]/20 flex items-center gap-2 active:scale-95 cursor-pointer justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                title="Add selected images to current hero slider"
              >
                <span className="material-symbols-outlined text-sm">{isSavingHero ? "sync" : "save"}</span>
                {isSavingHero ? "Saving..." : "Add To Slider"}
              </button>
            </div>
          </div>

          {(heroError || heroNote) && (
            <div
              className={`rounded-xl px-4 py-3 text-xs font-bold border ${
                heroError
                  ? "bg-red-50 border-red-200 text-red-600"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}
            >
              {heroError || heroNote}
            </div>
          )}

          {pendingHeroImages.length > 0 && (
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-black text-black uppercase tracking-widest">
                    New Selection (Not Saved)
                  </p>
                  <p className="text-xs font-bold text-black/40">
                    Selected images will be added to the current slider.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearPendingHeroImages}
                  className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-black flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                  Clear Selection
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pendingHeroImages.map((img, idx) => (
                  <div
                    key={img.id}
                    className="relative group/img bg-white rounded-3xl border border-slate-100 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
                  >
                    <button
                      type="button"
                      onClick={() => removePendingHeroImage(img.id)}
                      className="absolute top-4 right-4 w-9 h-9 bg-white text-slate-400 hover:text-white hover:bg-red-500 rounded-full flex items-center justify-center shadow-lg transition-all opacity-100 lg:opacity-0 lg:group-hover/img:opacity-100 cursor-pointer z-20"
                      title="Remove from selection"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>

                    <div className="aspect-[4/3] relative border-b border-slate-50 overflow-hidden">
                      <img
                        src={img.previewUrl}
                        alt={`Pending hero ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                      />
                    </div>

                    <div className="p-4 bg-white">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-xs font-black text-black uppercase tracking-widest">Slot {idx + 1}</p>
                          <p className="text-xs font-bold text-black/30">Pending upload</p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingHero && (
              <div className="md:col-span-2 lg:col-span-4 rounded-2xl bg-white border border-slate-200 px-6 py-4 text-xs font-bold text-slate-500">
                Loading hero images...
              </div>
            )}
            {!isLoadingHero && heroImages.length === 0 && !heroError && (
              <div className="md:col-span-2 lg:col-span-4 py-16 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-4 text-center bg-slate-50/40">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-md border border-slate-100">
                  <span className="material-symbols-outlined text-3xl">gallery_thumbnail</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-black text-[#1b365d]">No Slider Images</h4>
                  <p className="text-xs font-bold text-black/40">Select up to 7 images and save to publish.</p>
                </div>
              </div>
            )}

            {heroImages.map((img, idx) => (
              <div
                key={img.id || img.public_url || `${idx}`}
                className="relative group/img bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <button
                  type="button"
                  onClick={() => handleDeleteHeroImage(img.id)}
                  className="absolute top-4 right-4 w-9 h-9 bg-white text-slate-400 hover:text-white hover:bg-red-500 rounded-full flex items-center justify-center shadow-lg transition-all opacity-100 lg:opacity-0 lg:group-hover/img:opacity-100 cursor-pointer z-20"
                  title="Delete image"
                  disabled={isSavingHero}
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>

                <div className="aspect-[4/3] relative border-b border-slate-50 overflow-hidden">
                  <img
                    src={img.image_url}
                    alt={`Hero ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                  />
                </div>

                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-xs font-black text-black uppercase tracking-widest">Slot {idx + 1}</p>
                      <p className="text-xs font-bold text-black/30">Published</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics Management */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-sm space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-black text-2xl md:text-3xl">query_stats</span>
              <h3 className="text-lg md:text-xl font-black text-black uppercase tracking-widest">Key Performance Metrics</h3>
            </div>
            <button 
              onClick={handleAddStat}
              disabled={isSavingStat}
              className="bg-[#FF6B00] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20 flex items-center gap-2 active:scale-95 cursor-pointer w-full sm:w-auto justify-center"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              {isSavingStat ? "Saving..." : "Add New Metric"}
            </button>
          </div>

          {statsError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-bold text-red-600">
              {statsError}
            </div>
          )}
          {statsNote && !statsError && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-bold text-emerald-700">
              {statsNote}
            </div>
          )}
          {isLoadingStats && (
            <div className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-xs font-bold text-slate-500">
              Loading metrics...
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {!isLoadingStats && stats.length === 0 && !statsError && (
              <div className="text-sm font-semibold text-slate-500">
                No metrics added yet.
              </div>
            )}
            {stats.map((stat) => (
              <div key={stat.id} className="relative group/stat bg-[#1b365d] rounded-3xl p-8 space-y-6 shadow-2xl shadow-slate-900/10 transition-all hover:-translate-y-2 border border-white/5">
                <button 
                  onClick={() => openDeleteModal(stat.id, 'stat', stat.label)}
                  className="absolute -top-3 -right-3 w-9 h-9 bg-white text-slate-400 hover:text-white hover:bg-red-500 rounded-full flex items-center justify-center shadow-lg transition-all opacity-100 lg:opacity-0 lg:group-hover/stat:opacity-100 cursor-pointer z-10"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>

                <div className="flex items-center gap-4">
                  <div 
                    onClick={() => openIconPicker(stat.id)}
                    className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white/10 cursor-pointer hover:bg-white/20 transition-all group/iconbox text-orange-400"
                  >
                    <span className="material-symbols-outlined text-2xl group-hover/iconbox:scale-110 transition-transform">
                      {stat.icon}
                    </span>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100">
                       <span className="material-symbols-outlined text-black text-xs">edit</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                     <input 
                        type="text"
                        value={stat.value}
                        onChange={(e) => handleUpdateStat(stat.id, 'value', e.target.value)}
                        onBlur={() => {
                          if (!stat.value.trim()) {
                            setStatsError("Value is required for each metric.");
                            return;
                          }
                          persistStat(stat.id, { value: stat.value });
                        }}
                        placeholder="e.g. 98%"
                        className="w-full bg-transparent text-2xl font-black text-white outline-none border-b border-white/10 focus:border-orange-400/50 transition-all placeholder:text-white/20"
                     />
                     <input 
                        type="text"
                        value={stat.label}
                        onChange={(e) => handleUpdateStat(stat.id, 'label', e.target.value)}
                        onBlur={() => {
                          if (!stat.label.trim()) {
                            setStatsError("Label is required for each metric.");
                            return;
                          }
                          persistStat(stat.id, { field: stat.label });
                        }}
                        placeholder="Label"
                        className="w-full bg-transparent text-xs font-black text-slate-300 uppercase tracking-widest outline-none border-b border-white/5 focus:border-orange-400/30 transition-all placeholder:text-slate-500"
                     />
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 pt-2">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-orange-500"
                      checked={!!stat.viewInHeroPage}
                      onChange={(e) => {
                        const nextValue = e.target.checked;
                        handleUpdateStat(stat.id, 'viewInHeroPage', nextValue);
                        persistStat(stat.id, { view_in_hero_page: nextValue });
                      }}
                    />
                    Show In Hero Page
                  </label>
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-orange-500"
                      checked={!!stat.viewInAboutUsPage}
                      onChange={(e) => {
                        const nextValue = e.target.checked;
                        handleUpdateStat(stat.id, 'viewInAboutUsPage', nextValue);
                        persistStat(stat.id, { view_in_about_us: nextValue });
                      }}
                    />
                    Show In About Us Page
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminHome;

