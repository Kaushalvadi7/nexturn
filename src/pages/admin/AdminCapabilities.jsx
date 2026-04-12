import { useEffect, useState } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { useToast } from '../../contexts/ToastContext';
import AdminDeleteModal from '../../components/admin/AdminDeleteModal';
import AdminCreateInfrastructureModal from '../../components/admin/AdminCreateInfrastructureModal';
import {
  createCertificate,
  createManufacturingInfrastructure,
  deleteCertificate,
  deleteManufacturingInfrastructure,
  getCertificates,
  getManufacturingInfrastructures,
  updateManufacturingInfrastructure,
} from '../../lib/api';

const createEmptyInfrastructureForm = () => ({
  title: "",
  description: "",
  points: [""],
});

const getInfrastructureErrors = (asset) => {
  const title = String(asset?.title || "").trim();
  const description = String(asset?.description || "").trim();
  const points = (Array.isArray(asset?.points) ? asset.points : Array.isArray(asset?.keyPoints) ? asset.keyPoints : [])
    .map((value) => (typeof value === "string" ? value : String(value?.text || "")).trim())
    .filter(Boolean);

  return {
    title: title ? "" : "Title is required.",
    description: description ? "" : "Description is required.",
    points: points.length > 0 ? "" : "At least 1 key point is required.",
  };
};

const hasInfrastructureErrors = (errors) => Object.values(errors).some(Boolean);

const AdminCapabilities = () => {
  const toast = useToast();
  const [assets, setAssets] = useState([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  const [assetError, setAssetError] = useState("");
  const [savingIds, setSavingIds] = useState(() => new Set());
  const [isCreatingAsset, setIsCreatingAsset] = useState(false);
  const [createAssetForm, setCreateAssetForm] = useState(createEmptyInfrastructureForm());
  const [createAssetErrors, setCreateAssetErrors] = useState({
    title: "",
    description: "",
    points: "",
  });
  const [showCreateAssetModal, setShowCreateAssetModal] = useState(false);

  const [deleteModal, setDeleteModal] = useState({ 
    isOpen: false, 
    id: null, 
    type: 'asset', // 'asset', 'cert'
    title: "" 
  });

  useEffect(() => {
    let isActive = true;
    const loadAssets = async () => {
      setIsLoadingAssets(true);
      setAssetError("");
      try {
        const data = await getManufacturingInfrastructures();
        if (!isActive) return;
        const normalized = (Array.isArray(data) ? data : []).map((row) => ({
          id: row.id,
          title: row.title || "",
          description: row.description || "",
          keyPoints: Array.isArray(row.points) ? row.points : [],
          isNew: false,
          isDirty: false,
        }));
        setAssets(normalized);
      } catch (error) {
        if (!isActive) return;
        console.error("Failed to load manufacturing infrastructures", error);
        setAssets([]);
        setAssetError(error?.message || "Failed to load manufacturing infrastructures.");
      } finally {
        if (isActive) setIsLoadingAssets(false);
      }
    };

    loadAssets();
    return () => {
      isActive = false;
    };
  }, []);

  const markSaving = (id, isSaving) => {
    setSavingIds((prev) => {
      const next = new Set(prev);
      if (isSaving) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const openCreateAssetModal = () => {
    setAssetError("");
    setCreateAssetForm(createEmptyInfrastructureForm());
    setCreateAssetErrors({ title: "", description: "", points: "" });
    setShowCreateAssetModal(true);
  };

  const handleUpdateAsset = (id, field, value) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === id ? { ...asset, [field]: value, isDirty: true } : asset,
      ),
    );
  };

  const updateCreateAssetForm = (field, value) => {
    if (field === "points") {
      setCreateAssetForm((prev) => {
        const nextPoints = [...prev.points];
        nextPoints[value.index] = value.value;
        return { ...prev, points: nextPoints };
      });
      setCreateAssetErrors((prev) => ({ ...prev, points: "" }));
      return;
    }

    setCreateAssetForm((prev) => ({ ...prev, [field]: value }));
    if (field === "title" || field === "description") {
      setCreateAssetErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const addCreateAssetPoint = () => {
    setCreateAssetForm((prev) => ({ ...prev, points: [...prev.points, ""] }));
  };

  const removeCreateAssetPoint = (index) => {
    setCreateAssetForm((prev) => {
      const nextPoints = prev.points.filter((_, i) => i !== index);
      return { ...prev, points: nextPoints.length ? nextPoints : [""] };
    });
  };

  const handleAddPoint = (assetId) => {
    setAssets((prev) =>
      prev.map((asset) => {
        if (asset.id === assetId) {
          return { ...asset, keyPoints: [...asset.keyPoints, ""], isDirty: true };
        }
        return asset;
      }),
    );
  };

  const handleRemovePoint = (assetId, pointIndex) => {
    setAssets((prev) =>
      prev.map((asset) => {
        if (asset.id === assetId) {
          return {
            ...asset,
            keyPoints: asset.keyPoints.filter((_, i) => i !== pointIndex),
            isDirty: true,
          };
        }
        return asset;
      }),
    );
  };

  const handleUpdatePoint = (assetId, pointIndex, value) => {
    setAssets((prev) =>
      prev.map((asset) => {
        if (asset.id === assetId) {
          const keyPoints = [...asset.keyPoints];
          keyPoints[pointIndex] = value;
          return { ...asset, keyPoints, isDirty: true };
        }
        return asset;
      }),
    );
  };

  const handleSaveAsset = async (assetId) => {
    const asset = assets.find((row) => row.id === assetId);
    if (!asset) return;

    const errors = getInfrastructureErrors(asset);
    if (hasInfrastructureErrors(errors)) {
      const firstError = Object.values(errors).find(Boolean);
      setAssetError(firstError || "Invalid infrastructure entry.");
      return;
    }

    const payload = {
      title: String(asset.title ?? "").trim(),
      description: String(asset.description ?? "").trim(),
      points: (Array.isArray(asset.keyPoints) ? asset.keyPoints : [])
        .map((p) => String(p ?? "").trim())
        .filter(Boolean),
    };

    setAssetError("");
    markSaving(assetId, true);
    try {
      await updateManufacturingInfrastructure(assetId, payload);
      setAssets((prev) =>
        prev.map((row) => (row.id === assetId ? { ...row, isDirty: false } : row)),
      );
      toast.success("Edited successfully");
    } catch (error) {
      toast.error("Failed");
      console.error("Failed to save infrastructure", { assetId, error });
      setAssetError(error?.message || "Failed to save infrastructure.");
    } finally {
      markSaving(assetId, false);
    }
  };

  const openDeleteModal = (id, type, title) => {
    setDeleteModal({ isOpen: true, id, type, title });
  };

  const [certs, setCerts] = useState([]);
  const [isLoadingCerts, setIsLoadingCerts] = useState(true);
  const [certError, setCertError] = useState("");
  const [isSavingCert, setIsSavingCert] = useState(false);

  const handleConfirmDelete = async () => {
    if (deleteModal.type === 'asset') {
      setAssetError("");
      try {
        await deleteManufacturingInfrastructure(deleteModal.id);
        setAssets(assets.filter(a => a.id !== deleteModal.id));
        toast.success("Deleted successfully");
        setDeleteModal({ isOpen: false, id: null, type: 'asset', title: "" });
      } catch (error) {
        toast.error("Failed");
        console.error("Failed to delete infrastructure", error);
        setAssetError(error?.message || "Failed to delete infrastructure.");
      }
      return;
    }

    if (deleteModal.type === 'cert') {
      setCertError("");
      try {
        await deleteCertificate(deleteModal.id);
        setCerts(prev => prev.filter(c => c.id !== deleteModal.id));
        toast.success("Deleted successfully");
      } catch (error) {
        toast.error("Failed");
        setCertError(error?.message || "Failed to delete certificate.");
      } finally {
        setDeleteModal({ isOpen: false, id: null, type: 'asset', title: "" });
      }
    }
  };

  const [showAddCertForm, setShowAddCertForm] = useState(false);
  const [newCert, setNewCert] = useState({ name: "" });

  useEffect(() => {
    let isActive = true;
    const fetchCerts = async () => {
      setIsLoadingCerts(true);
      setCertError("");
      try {
        const data = await getCertificates();
        if (isActive) {
          setCerts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (isActive) {
          setCertError(error?.message || "Failed to load certificates.");
        }
      } finally {
        if (isActive) setIsLoadingCerts(false);
      }
    };

    fetchCerts();
    return () => {
      isActive = false;
    };
  }, []);

  const handleAddCert = async () => {
    const name = newCert.name.trim();
    if (!name) return;
    setIsSavingCert(true);
    setCertError("");
    try {
      const result = await createCertificate(name);
      const newId = result?.data?.id;
      if (newId) {
        setCerts(prev => [{ id: newId, name }, ...prev]);
      } else {
        const data = await getCertificates();
        setCerts(Array.isArray(data) ? data : []);
      }
      toast.success("Saved successfully");
      setNewCert({ name: "" });
      setShowAddCertForm(false);
    } catch (error) {
      toast.error("Failed");
      setCertError(error?.message || "Failed to add certificate.");
    } finally {
      setIsSavingCert(false);
    }
  };

  const handleCreateAsset = async () => {
    const errors = getInfrastructureErrors(createAssetForm);
    if (hasInfrastructureErrors(errors)) {
      setCreateAssetErrors(errors);
      return;
    }

    const payload = {
      title: String(createAssetForm.title || "").trim(),
      description: String(createAssetForm.description || "").trim(),
      points: (Array.isArray(createAssetForm.points) ? createAssetForm.points : [])
        .map((point) => String(point || "").trim())
        .filter(Boolean),
    };

    setIsCreatingAsset(true);
    setAssetError("");
    try {
      const result = await createManufacturingInfrastructure(payload);
      const newId = result?.data?.id;
      if (!newId) throw new Error("Failed to create infrastructure.");

      setAssets((prev) => [
        ...prev,
        {
          id: newId,
          title: payload.title,
          description: payload.description,
          keyPoints: payload.points,
          isNew: false,
          isDirty: false,
        },
      ]);
      toast.success("Saved successfully");
      setShowCreateAssetModal(false);
    } catch (error) {
      toast.error("Failed");
      console.error("Failed to create infrastructure", error);
      setAssetError(error?.message || "Failed to create infrastructure.");
    } finally {
      setIsCreatingAsset(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif]">
      <AdminNavbar />

      <AdminCreateInfrastructureModal
        isOpen={showCreateAssetModal}
        form={createAssetForm}
        errors={createAssetErrors}
        submitError={showCreateAssetModal ? assetError : ""}
        isSaving={isCreatingAsset}
        onClose={() => setShowCreateAssetModal(false)}
        onChange={updateCreateAssetForm}
        onAddPoint={addCreateAssetPoint}
        onRemovePoint={removeCreateAssetPoint}
        onSubmit={handleCreateAsset}
      />
      
      <AdminDeleteModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title={`Delete ${
          deleteModal.type === 'cert' ? 'Certificate' : 
          'Manufacturing Asset'
        }?`}
        message={`Are you sure you want to remove "${deleteModal.title}"? This action cannot be undone.`}
      />
      
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 py-12 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-black font-black text-xs tracking-widest uppercase">
               <span className="material-symbols-outlined text-base">home_repair_service</span>
               SITE OPERATIONS
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Infrastructure & Compliance Center</h1>
            <p className="text-black font-medium max-w-2xl leading-relaxed text-sm">
              Manage manufacturing hardware assets and regulatory documentation to maintain peak operational standards.
            </p>
          </div>
          

        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column (Certifications) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-black">verified</span>
                  <h3 className="text-base font-black text-slate-800 uppercase tracking-widest">Certifications</h3>
                </div>
                <button 
                  onClick={() => setShowAddCertForm(!showAddCertForm)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">{showAddCertForm ? 'close' : 'add'}</span>
                  {showAddCertForm ? 'Cancel' : 'Add New'}
                </button>
              </div>

              {/* Add New Cert Form */}
              {showAddCertForm && (
                <div className="p-6 border-2 border-blue-100 rounded-3xl bg-blue-50/20 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
                   <div className="space-y-3">
                      <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">CERTIFICATE NAME</label>
                      <input 
                        type="text" 
                        value={newCert.name}
                        placeholder="e.g. ISO 9001:2015"
                        onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                        className="w-full bg-white border border-blue-50 rounded-xl px-5 py-3 text-sm font-black text-black outline-none focus:border-blue-400 transition-all shadow-sm"
                      />
                   </div>
                   
                   <button 
                    onClick={handleAddCert}
                    disabled={!newCert.name.trim() || isSavingCert}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                    {isSavingCert ? "Saving..." : "Save Certificate"}
                   </button>
                </div>
              )}

              {/* Certification List */}
              <div className="space-y-4">
                {certError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-bold text-red-600">
                    {certError}
                  </div>
                )}
                {isLoadingCerts && (
                  <div className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-xs font-bold text-slate-500">
                    Loading certificates...
                  </div>
                )}
                {!isLoadingCerts && certs.length === 0 && !certError && (
                  <div className="text-xs font-bold text-slate-500">
                    No certificates added yet.
                  </div>
                )}
                {certs.map((cert) => (
                  <div key={cert.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/30 space-y-4 relative group">
                    <button 
                      onClick={() => openDeleteModal(cert.id, 'cert', cert.name || cert.title || "Certificate")}
                      className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                    <div className="flex items-center justify-between">
                      <div className="w-full pr-6">
                        <div className="font-black text-black text-sm tracking-tight py-1">
                          {cert.name || cert.title}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Right Column (Manufacturing Infrastructure) */}
          <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-sm flex flex-col gap-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-black text-2xl md:text-3xl">manufacturing</span>
                <h3 className="text-lg md:text-xl font-black text-black uppercase tracking-widest">Manufacturing Infrastructure</h3>
              </div>
              <button
                onClick={openCreateAssetModal}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 cursor-pointer w-full sm:w-auto justify-center"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add Infra
              </button>
            </div>

              {/* Assets List */}
              <div className="space-y-8">
                {assetError && (
                  <div className="rounded-2xl bg-red-50 border border-red-200 px-6 py-4 text-xs font-bold text-red-600">
                    {assetError}
                  </div>
                )}
                {isLoadingAssets && (
                  <div className="rounded-2xl bg-white border border-slate-200 px-6 py-4 text-xs font-bold text-slate-500">
                    Loading infrastructure entries...
                  </div>
                )}
                {!isLoadingAssets && assets.length === 0 && !assetError && (
                  <div className="text-xs font-bold text-slate-500">
                    No infrastructure entries added yet.
                  </div>
                )}
                {assets.map((asset) => (
                  <div key={asset.id} className="space-y-10 border border-slate-100 rounded-[2.5rem] p-8 md:p-10 hover:border-blue-100 transition-all shadow-sm">
                    <div className="grid grid-cols-1 gap-12">
                      <div className="space-y-8">
                        <div className="space-y-3">
                          <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">ASSET TITLE</label>
                          <input 
                            type="text" 
                            value={asset.title}
                            placeholder="e.g. Metrology Laboratory"
                            onChange={(e) => handleUpdateAsset(asset.id, 'title', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-base font-black text-black outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">ASSET DESCRIPTION</label>
                          <textarea 
                            value={asset.description}
                            placeholder="Enter detailed description..."
                            onChange={(e) => handleUpdateAsset(asset.id, 'description', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-5 text-sm font-medium text-black outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all min-h-[160px] leading-relaxed shadow-sm resize-none"
                          />
                        </div>
                        {savingIds.has(asset.id) && (
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <span className="material-symbols-outlined text-sm">sync</span>
                            Saving...
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs font-black text-black/50 uppercase tracking-widest block pl-1">INFRASTRUCTURE KEY POINTS</label>
                      <div className="flex flex-wrap items-center gap-4">
                         {asset.keyPoints.map((point, pIndex) => (
                            <div key={pIndex} className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm hover:border-blue-200 transition-all group/point">
                              <input 
                                 type="text"
                                 value={point}
                                 placeholder="Enter specific capability..."
                                 onChange={(e) => handleUpdatePoint(asset.id, pIndex, e.target.value)}
                                 className="text-xs font-black text-slate-700 outline-none bg-transparent min-w-[140px] focus:text-black transition-colors placeholder:text-slate-300"
                              />
                              <button
                               onClick={() => handleRemovePoint(asset.id, pIndex)}
                               className="text-xs font-black text-black/40 uppercase tracking-widest hover:text-red-500 transition-all cursor-pointer"
                              >
                               Remove
                              </button>
                            </div>
                          ))}
                         
                         <button 
                           onClick={() => handleAddPoint(asset.id)}
                           className="flex items-center gap-3 border-2 border-dashed border-slate-200 px-8 py-3 rounded-xl text-xs font-black text-black uppercase tracking-widest hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer h-[52px]"
                          >
                             ADD POINT
                           </button>

                          <button
                            onClick={() => handleSaveAsset(asset.id)}
                            disabled={
                              savingIds.has(asset.id) ||
                              !asset.isDirty ||
                              hasInfrastructureErrors(getInfrastructureErrors(asset))
                            }
                            className="flex items-center gap-2 bg-[#1b365d] hover:bg-[#2c4c7c] text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#1b365d]/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                          >
                            <span className="material-symbols-outlined text-base">save</span>
                            {asset.isDirty ? "Save Changes" : "Saved"}
                          </button>

                          <button 
                            onClick={() => openDeleteModal(asset.id, 'asset', asset.title)}
                            className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-widest hover:bg-red-50 px-5 py-3 rounded-xl transition-all cursor-pointer group/del"
                          >
                            <span className="material-symbols-outlined text-xl group-hover/del:scale-110 transition-transform">delete</span>
                            REMOVE ENTRY
                          </button>
                      </div>
                    </div>
                  </div>
                ))}

              </div>

              <div className="flex items-center justify-between pt-10 border-t border-slate-50">
                <div className="flex items-center gap-8">
                   <div className="text-xs font-bold text-black/50 uppercase tracking-widest">Total Assets: <span className="text-slate-800 font-black">{assets.length}</span></div>
                   <div className="text-xs font-bold text-black/50 uppercase tracking-widest">Visibility: <span className="text-black font-black">Public Site</span></div>
                </div>
                <div className="flex items-center gap-3">
                   <span className="material-symbols-outlined text-black text-sm">info</span>
                   <span className="text-xs font-bold text-black/50 italic">Use "Save" on each entry to persist changes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminCapabilities;

