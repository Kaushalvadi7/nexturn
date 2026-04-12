import { useEffect, useState } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { useToast } from '../../contexts/ToastContext';
import AdminDeleteModal from '../../components/admin/AdminDeleteModal';
import AdminIconPicker from '../../components/admin/AdminIconPicker';
import {
  createInspectionEquipment,
  deleteInspectionEquipment,
  getInspectionEquipment,
  updateInspectionEquipment,
} from '../../lib/api';

const AdminInspectionEquipment = () => {
  const toast = useToast();
  const [inspectionEquipment, setInspectionEquipment] = useState([/*
    {
       id: 1,
       icon: "straighten",
       title: "Digital Vernier Caliper",
       range: "0-150MM / 0-6 INCH RANGE",
       accuracy: "Â±0.01mm / Â±0.0005 inch",
       application: "External & internal diameter measurement, depth measurement"
    },
    {
       id: 2,
       icon: "architecture",
       title: "Micrometer Set",
       range: "0-25MM TO 75-100MM RANGE",
       accuracy: "Â±0.001mm / Â±0.00005 inch",
       application: "Precision diameter and thickness measurement"
    }
  */]);
  const [isLoadingEquipment, setIsLoadingEquipment] = useState(true);
  const [equipmentError, setEquipmentError] = useState("");
  const [savingIds, setSavingIds] = useState(() => new Set());
  const [iconPicker, setIconPicker] = useState({ isOpen: false, equipmentId: null });

  const [deleteModal, setDeleteModal] = useState({ 
    isOpen: false, 
    id: null, 
    title: "" 
  });

  useEffect(() => {
    let isActive = true;
    const loadEquipment = async () => {
      setIsLoadingEquipment(true);
      setEquipmentError("");
      try {
        const data = await getInspectionEquipment();
        if (!isActive) return;
        const normalized = (Array.isArray(data) ? data : []).map((row) => ({
          id: row.id,
          icon: row.icon_name || "straighten",
          title: row.title || "",
          range: row.measurement || "",
          accuracy: row.accuracy || "",
          application: Array.isArray(row.application) ? row.application.join(", ") : "",
          isNew: false,
          isDirty: false,
        }));
        setInspectionEquipment(normalized);
      } catch (error) {
        if (!isActive) return;
        console.error("Failed to load inspection equipment", error);
        setInspectionEquipment([]);
        setEquipmentError(error?.message || "Failed to load inspection equipment.");
      } finally {
        if (isActive) setIsLoadingEquipment(false);
      }
    };

    loadEquipment();
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

  const handleAddEquipment = () => {
    const tempId = Date.now() * -1;
    const newEquip = {
      id: tempId,
      icon: "inventory_2",
      title: "",
      range: "",
      accuracy: "",
      application: "",
      isNew: true,
      isDirty: true,
    };
    setInspectionEquipment([...inspectionEquipment, newEquip]);
  };

  const handleUpdateEquipment = (id, field, value) => {
    setInspectionEquipment(inspectionEquipment.map(e => e.id === id ? { ...e, [field]: value, isDirty: true } : e));
  };

  const openDeleteModal = (id, title) => {
    setDeleteModal({ isOpen: true, id, title });
  };

  const openIconPicker = (equipmentId) => {
    setIconPicker({ isOpen: true, equipmentId });
  };

  const handleSelectIcon = (iconName) => {
    if (iconPicker.equipmentId != null) {
      handleUpdateEquipment(iconPicker.equipmentId, 'icon', iconName);
    }
    setIconPicker({ isOpen: false, equipmentId: null });
  };

  const handleConfirmDelete = async () => {
    const target = inspectionEquipment.find((e) => e.id === deleteModal.id) || null;
    if (target?.isNew) {
      setInspectionEquipment(inspectionEquipment.filter(e => e.id !== deleteModal.id));
      setDeleteModal({ isOpen: false, id: null, title: "" });
      return;
    }

    setEquipmentError("");
    try {
      await deleteInspectionEquipment(deleteModal.id);
      setInspectionEquipment(inspectionEquipment.filter(e => e.id !== deleteModal.id));
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error("Failed");
      console.error("Failed to delete inspection equipment", error);
      setEquipmentError(error?.message || "Failed to delete inspection equipment.");
    } finally {
      setDeleteModal({ isOpen: false, id: null, title: "" });
    }
  };

  const handleSaveEquipment = async (equipId) => {
    const equip = inspectionEquipment.find((e) => e.id === equipId);
    if (!equip) return;

    const title = String(equip.title || "").trim();
    const measurement = String(equip.range || "").trim();
    const accuracy = String(equip.accuracy || "").trim();
    const icon_name = String(equip.icon || "").trim() || null;

    if (!title) {
      setEquipmentError("Title is required to save an equipment entry.");
      return;
    }
    if (!measurement) {
      setEquipmentError("Measurement (range) is required to save an equipment entry.");
      return;
    }
    if (!accuracy) {
      setEquipmentError("Accuracy is required to save an equipment entry.");
      return;
    }

    const application = String(equip.application || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = { title, icon_name, measurement, accuracy, application };

    setEquipmentError("");
    markSaving(equipId, true);
    try {
      if (equip.isNew) {
        const result = await createInspectionEquipment(payload);
        const newId = result?.data?.id;
        if (!newId) throw new Error("Failed to create inspection equipment.");

        setInspectionEquipment((prev) =>
          prev.map((e) => (e.id === equipId ? { ...e, id: newId, isNew: false, isDirty: false } : e)),
        );
      } else {
        await updateInspectionEquipment(equipId, payload);
        setInspectionEquipment((prev) =>
          prev.map((e) => (e.id === equipId ? { ...e, isDirty: false } : e)),
        );
      }
      toast.success(equip.isNew ? "Saved successfully" : "Edited successfully");
    } catch (error) {
      toast.error("Failed");
      console.error("Failed to save inspection equipment", { equipId, error });
      setEquipmentError(error?.message || "Failed to save inspection equipment.");
    } finally {
      markSaving(equipId, false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif]">
      <AdminNavbar />
      
      <AdminDeleteModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title="Delete Inspection Equipment?"
        message={`Are you sure you want to remove "${deleteModal.title}"? This action cannot be undone.`}
      />

      <AdminIconPicker
        isOpen={iconPicker.isOpen}
        onClose={() => setIconPicker({ isOpen: false, equipmentId: null })}
        onSelect={handleSelectIcon}
      />
      
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 py-12 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-black font-black text-xs tracking-widest uppercase">
               <span className="material-symbols-outlined text-base text-blue-600">biotech</span>
               QUALITY ASSURANCE
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Inspection Equipment Specifications</h1>
            <p className="text-black font-medium max-w-2xl leading-relaxed text-sm">
              Manage the metrology assets and precision measurement tools used for quality verification and quality control.
            </p>
          </div>
          
          <button 
            onClick={handleAddEquipment}
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 cursor-pointer w-full md:w-auto"
          >
            <span className="material-symbols-outlined text-xl">add_box</span>
            Add New Equipment
          </button>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {equipmentError && (
            <div className="col-span-full rounded-2xl bg-red-50 border border-red-200 px-6 py-4 text-xs font-bold text-red-600">
              {equipmentError}
            </div>
          )}
          {isLoadingEquipment && (
            <div className="col-span-full rounded-2xl bg-white border border-slate-200 px-6 py-4 text-xs font-bold text-slate-500">
              Loading inspection equipment...
            </div>
          )}
          {inspectionEquipment.map((equip) => (
            <div key={equip.id} className="relative group/card bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 space-y-8 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300">
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-start gap-5 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => openIconPicker(equip.id)}
                  className="relative w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-[#1b365d] shrink-0 group-hover/card:bg-blue-600 group-hover/card:text-white transition-all duration-500 cursor-pointer group/icon shadow-sm hover:shadow-xl hover:shadow-blue-600/15"
                  title="Select icon"
                >
                  <span className="material-symbols-outlined text-3xl transition-transform group-hover/icon:scale-110">
                    {equip.icon}
                  </span>
                  <div className="absolute top-1 right-1 w-6 h-6 bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/icon:scale-110">
                    <span className="material-symbols-outlined text-xs font-black">edit</span>
                  </div>
                </button>
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#1b365d] uppercase tracking-widest block pl-1 opacity-70">Equipment Title</label>
                    <input 
                      type="text"
                      value={equip.title}
                      placeholder="e.g. Micrometer Set"
                      onChange={(e) => handleUpdateEquipment(equip.id, 'title', e.target.value)}
                      className="w-full bg-white border-b-2 border-slate-100 px-1 py-1 text-base font-black text-[#1b365d] outline-none focus:border-blue-400 transition-all placeholder:text-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#1b365d] uppercase tracking-widest block pl-1 opacity-70">Measurement Range</label>
                    <input 
                      type="text"
                      value={equip.range}
                      placeholder="e.g. 0-25mm to 75-100mm"
                      onChange={(e) => handleUpdateEquipment(equip.id, 'range', e.target.value)}
                      className="w-full bg-white border-b-2 border-slate-100 px-1 py-1 text-sm font-black text-orange-600 uppercase tracking-widest outline-none focus:border-blue-400 transition-all placeholder:text-slate-200"
                    />
                  </div>
                </div>
                </div>

                <button
                  onClick={() => openDeleteModal(equip.id, equip.title)}
                  className="w-12 h-12 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"
                  title="Delete equipment"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#1b365d] uppercase tracking-widest block pl-1 opacity-70">Accuracy / Tolerance</label>
                  <input 
                    type="text"
                    value={equip.accuracy}
                    placeholder="e.g. Â±0.001mm"
                    onChange={(e) => handleUpdateEquipment(equip.id, 'accuracy', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-100 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#1b365d] uppercase tracking-widest block pl-1 opacity-70">Typical Applications</label>
                  <textarea 
                    value={equip.application}
                    placeholder="Comma-separated applications..."
                    onChange={(e) => handleUpdateEquipment(equip.id, 'application', e.target.value)}
                    rows="3"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-semibold text-slate-600 outline-none focus:bg-white focus:border-blue-100 transition-all resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="pt-2">
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        equip.isDirty || equip.isNew ? "bg-amber-500" : "bg-green-500"
                      }`}
                    ></span>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Status
                      </p>
                      <p className="text-sm font-bold text-[#1b365d]">
                        {equip.isDirty || equip.isNew ? "Unsaved changes" : "Saved"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSaveEquipment(equip.id)}
                    disabled={
                      savingIds.has(equip.id) ||
                      (!equip.isDirty && !equip.isNew) ||
                      !String(equip.title || "").trim() ||
                      !String(equip.range || "").trim() ||
                      !String(equip.accuracy || "").trim()
                    }
                    className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                      ${savingIds.has(equip.id) ? "bg-slate-600 text-white shadow-slate-600/20" : ""}
                      ${!savingIds.has(equip.id) && (equip.isDirty || equip.isNew) ? "bg-[#1b365d] hover:bg-[#2c4c7c] text-white shadow-[#1b365d]/20" : ""}
                      ${!savingIds.has(equip.id) && !(equip.isDirty || equip.isNew) ? "bg-green-50 text-green-700 border border-green-200 shadow-green-500/10" : ""}
                    `}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {savingIds.has(equip.id)
                        ? "sync"
                        : equip.isDirty || equip.isNew
                          ? "save"
                          : "check_circle"}
                    </span>
                    {savingIds.has(equip.id)
                      ? "Saving..."
                      : equip.isNew
                        ? "Save Equipment"
                        : equip.isDirty
                          ? "Save Changes"
                          : "Saved"}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!isLoadingEquipment && inspectionEquipment.length === 0 && (
            <div className="col-span-full py-24 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center gap-6 text-center bg-white/50">
               <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-xl border border-slate-100">
                  <span className="material-symbols-outlined text-4xl">straighten</span>
               </div>
               <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#1b365d]">No Equipment Defined</h3>
                  <p className="text-sm font-medium text-slate-400 max-w-xs">Start by adding your metrology assets into the specifications system.</p>
               </div>
               <button 
                onClick={handleAddEquipment}
                className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 cursor-pointer"
               >
                 Add First Asset
               </button>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm flex items-center justify-center mt-12 mb-20">
          <div className="w-full flex items-center justify-between px-4">
             <div className="hidden md:flex items-center gap-10">
                <div className="flex flex-col">
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest underline decoration-blue-500/30 underline-offset-4">DB FEED</p>
                   <p className="text-xs font-bold text-black flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                     API Ready
                   </p>
                </div>
                <div className="h-10 w-px bg-slate-200"></div>
                <div className="flex flex-col">
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest">ASSETS</p>
                   <p className="text-xs font-bold text-black">{inspectionEquipment.length} Tool Specifications</p>
                </div>
             </div>
             
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Save each equipment entry to publish changes
              </div>
           </div>
         </div>
      </main>
    </div>
  );
};

export default AdminInspectionEquipment;
