import { useEffect, useState } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { useToast } from '../../contexts/ToastContext';
import AdminDeleteModal from '../../components/admin/AdminDeleteModal';
import AdminCreateLeadershipModal from '../../components/admin/AdminCreateLeadershipModal';
import {
  createCompanyEmployeeForm,
  deleteCompanyEmployee,
  getCompanyEmployees,
  updateCompanyEmployeeForm,
} from '../../lib/api';

const AdminExpertiseLeadership = () => {
  const toast = useToast();
  const [leaders, setLeaders] = useState([]);
  const [isLoadingLeaders, setIsLoadingLeaders] = useState(true);
  const [leaderError, setLeaderError] = useState("");
  const [savingIds, setSavingIds] = useState(() => new Set());

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: "" });
  const [createModal, setCreateModal] = useState({ isOpen: false, token: 0 });
  const [createForm, setCreateForm] = useState({
    name: "",
    role: "",
    education: "",
    experience: "",
    imageFile: null,
    imagePreview: "",
  });
  const [createErrors, setCreateErrors] = useState({ name: "", role: "" });
  const [createSubmitError, setCreateSubmitError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    let isActive = true;
    const loadLeaders = async () => {
      setIsLoadingLeaders(true);
      setLeaderError("");
      try {
        const data = await getCompanyEmployees();
        if (!isActive) return;
        const normalized = (Array.isArray(data) ? data : []).map((row) => ({
          id: row.id,
          name: row.name || "",
          role: row.role || "",
          education: row.education || "",
          experience: row.experience || "",
          image: row.image || null,
          imageFile: null,
          imagePreview: null,
          isDirty: false,
        }));
        setLeaders(normalized);
      } catch (error) {
        if (!isActive) return;
        console.error("Failed to load company employees", error);
        setLeaders([]);
        setLeaderError(error?.message || "Failed to load leadership profiles.");
      } finally {
        if (isActive) setIsLoadingLeaders(false);
      }
    };

    loadLeaders();
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

  const openCreateModal = () => {
    setCreateForm({
      name: "",
      role: "",
      education: "",
      experience: "",
      imageFile: null,
      imagePreview: "",
    });
    setCreateErrors({ name: "", role: "" });
    setCreateSubmitError("");
    setCreateModal({ isOpen: true, token: Date.now() });
  };

  const updateCreateForm = (field, value) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
    if (field === "name" || field === "role") {
      setCreateErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCreateImageUpload = (file) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setCreateForm((prev) => ({ ...prev, imageFile: file, imagePreview: previewUrl }));
  };

  const validateCreateForm = () => {
    const nextErrors = {
      name: String(createForm.name || "").trim() ? "" : "Name is required.",
      role: String(createForm.role || "").trim() ? "" : "Role is required.",
    };
    setCreateErrors(nextErrors);
    return !nextErrors.name && !nextErrors.role;
  };

  const handleCreateLeader = async () => {
    if (!validateCreateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("name", String(createForm.name || "").trim());
    formData.append("role", String(createForm.role || "").trim());
    formData.append("education", String(createForm.education || "").trim());
    formData.append("experience", String(createForm.experience || "").trim());
    if (createForm.imageFile) {
      formData.append("image", createForm.imageFile);
    }

    setCreateSubmitError("");
    setIsCreating(true);
    try {
      const result = await createCompanyEmployeeForm(formData);
      const newId = result?.data?.id;
      if (!newId) throw new Error("Failed to create leadership profile.");
      await refreshLeaderById(newId);
      toast.success("Saved successfully");
      setCreateModal({ isOpen: false, token: 0 });
    } catch (error) {
      toast.error("Failed");
      setCreateSubmitError(error?.message || "Failed to create leadership profile.");
    } finally {
      setIsCreating(false);
    }
  };

  const refreshLeaderById = async (leaderId) => {
    const data = await getCompanyEmployees();
    const row = (Array.isArray(data) ? data : []).find((item) => item.id === leaderId);
    if (!row) return;

    const normalized = {
      id: row.id,
      name: row.name || "",
      role: row.role || "",
      education: row.education || "",
      experience: row.experience || "",
      image: row.image || null,
      imageFile: null,
      imagePreview: null,
      isDirty: false,
    };

    setLeaders((prev) => [normalized, ...prev]);
  };

  const updateLeader = (id, field, value) => {
    setLeaders(leaders.map(l => l.id === id ? { ...l, [field]: value, isDirty: true } : l));
  };

  const handleImageUpload = (id, file) => {
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setLeaders((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, imageFile: file, imagePreview: previewUrl, isDirty: true } : l,
        ),
      );
    }
  };

  const openDeleteModal = (id, name) => {
    setDeleteModal({ isOpen: true, id, name });
  };

  const confirmDelete = async () => {
    setLeaderError("");
    try {
      await deleteCompanyEmployee(deleteModal.id);
      setLeaders(leaders.filter(l => l.id !== deleteModal.id));
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error("Failed");
      console.error("Failed to delete company employee", error);
      setLeaderError(error?.message || "Failed to delete leadership profile.");
    } finally {
      setDeleteModal({ isOpen: false, id: null, name: "" });
    }
  };

  const handleSaveLeader = async (leaderId) => {
    const leader = leaders.find((l) => l.id === leaderId);
    if (!leader) return;

    const name = String(leader.name || "").trim();
    const role = String(leader.role || "").trim();

    if (!name) {
      setLeaderError("Name is required to save a profile.");
      return;
    }
    if (!role) {
      setLeaderError("Role is required to save a profile.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", role);
    formData.append("education", String(leader.education || ""));
    formData.append("experience", String(leader.experience || ""));
    if (leader.imageFile) {
      formData.append("image", leader.imageFile);
    }

    setLeaderError("");
    markSaving(leaderId, true);
    try {
      await updateCompanyEmployeeForm(leaderId, formData);
      setLeaders((prev) =>
        prev.map((l) =>
          l.id === leaderId
            ? {
                ...l,
                isDirty: false,
                image: l.imagePreview || l.image,
                imageFile: null,
                imagePreview: null,
              }
            : l,
        ),
      );
      toast.success("Edited successfully");
    } catch (error) {
      toast.error("Failed");
      console.error("Failed to save company employee", { leaderId, error });
      setLeaderError(error?.message || "Failed to save leadership profile.");
    } finally {
      markSaving(leaderId, false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif]">
      <AdminNavbar />
      
      <AdminDeleteModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        title={`Remove ${deleteModal.name || 'Leader'}?`}
        message="Are you sure you want to remove this leadership profile? This action cannot be undone."
      />
      <AdminCreateLeadershipModal
        key={createModal.token}
        isOpen={createModal.isOpen}
        form={createForm}
        errors={createErrors}
        submitError={createSubmitError}
        isSaving={isCreating}
        onClose={() => setCreateModal({ isOpen: false, token: 0 })}
        onChange={updateCreateForm}
        onUploadImage={handleCreateImageUpload}
        onSubmit={handleCreateLeader}
      />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 py-12 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-black font-black text-xs tracking-widest uppercase">
               <span className="material-symbols-outlined text-base text-blue-600">groups</span>
               TEAM MANAGEMENT
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Engineering Expertise & Leadership</h1>
            <p className="text-black font-medium max-w-2xl leading-relaxed text-sm">
              Manage the leadership profiles that showcase the technical expertise and experience driving Nexturn's excellence.
            </p>
          </div>
          
          <button 
            onClick={openCreateModal}
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 cursor-pointer w-full md:w-auto"
          >
            <span className="material-symbols-outlined text-xl">person_add</span>
            Add New Profile
          </button>
        </div>

        {/* Leaders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {leaderError && (
            <div className="col-span-full rounded-2xl bg-red-50 border border-red-200 px-6 py-4 text-xs font-bold text-red-600">
              {leaderError}
            </div>
          )}
          {isLoadingLeaders && (
            <div className="col-span-full rounded-2xl bg-white border border-slate-200 px-6 py-4 text-xs font-bold text-slate-500">
              Loading leadership profiles...
            </div>
          )}
          {leaders.map((leader) => (
            <div key={leader.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row hover:border-blue-200 transition-all duration-300 group/card">
              {/* Image Section */}
              <div className="md:w-[40%] aspect-[4/5] relative bg-slate-100 overflow-hidden shrink-0">
                {leader.imagePreview || leader.image ? (
                  <img src={leader.imagePreview || leader.image} alt={leader.name} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 p-8 text-center gap-4">
                     <span className="material-symbols-outlined text-6xl">account_circle</span>
                     <p className="text-xs font-black uppercase tracking-widest leading-tight">No Profile Image Selected</p>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center p-4">
                  <button 
                    onClick={() => document.getElementById(`upload-${leader.id}`).click()}
                    className="bg-white text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer shadow-2xl active:scale-95"
                  >
                    <span className="material-symbols-outlined text-base">photo_camera</span>
                    Change Photo
                  </button>
                  <input 
                    id={`upload-${leader.id}`}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(leader.id, e.target.files[0])}
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-8 md:p-10 flex flex-col relative">
                <button 
                  onClick={() => openDeleteModal(leader.id, leader.name || "Profile")}
                  className="absolute top-6 right-6 w-10 h-10 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover/card:opacity-100 shadow-sm"
                  title="Remove Profile"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>

                <div className="space-y-8 flex-1">
                  {/* Name & Role */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-[#1b365d] uppercase tracking-widest ml-1 opacity-70">FULL NAME</label>
                       <input 
                        type="text" 
                        value={leader.name}
                        placeholder="EnterLeader Name"
                        onChange={(e) => updateLeader(leader.id, 'name', e.target.value)}
                        className="w-full bg-white border-b-2 border-slate-100 px-1 py-2 text-xl font-black text-[#1b365d] outline-none focus:border-blue-400 transition-all placeholder:text-slate-200"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-[#1b365d] uppercase tracking-widest ml-1 opacity-70">DESIGNATION / ROLE</label>
                       <input 
                        type="text" 
                        value={leader.role}
                        placeholder="Enter Managing Director"
                        onChange={(e) => updateLeader(leader.id, 'role', e.target.value)}
                        className="w-full bg-white border-b-2 border-slate-100 px-1 py-2 text-xs font-black text-blue-600 uppercase tracking-widest outline-none focus:border-blue-400 transition-all placeholder:text-slate-200"
                       />
                    </div>
                  </div>

                  {/* Bio Details */}
                  <div className="space-y-6 pt-4">
                    <div className="flex gap-4 items-start group/field">
                      <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-[#1b365d] shrink-0">
                         <span className="material-symbols-outlined text-xl font-light">school</span>
                      </div>
                      <div className="flex-1 space-y-2">
                         <p className="text-xs font-black text-[#1b365d] uppercase tracking-widest opacity-80">Education & Expertise</p>
                         <textarea 
                           value={leader.education}
                           placeholder="Mechanical Engineering, Export Management..."
                           rows="2"
                           onChange={(e) => updateLeader(leader.id, 'education', e.target.value)}
                           className="w-full bg-transparent text-base font-semibold text-slate-700 outline-none resize-none placeholder:text-slate-300 leading-relaxed"
                         />
                      </div>
                    </div>

                    <div className="flex gap-4 items-start group/field">
                      <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-[#1b365d] shrink-0">
                         <span className="material-symbols-outlined text-xl font-light">history_edu</span>
                      </div>
                      <div className="flex-1 space-y-2">
                         <p className="text-xs font-black text-[#1b365d] uppercase tracking-widest opacity-80">Professional Experience</p>
                         <textarea 
                           value={leader.experience}
                           placeholder="20+ years in precision manufacturing..."
                           rows="3"
                           onChange={(e) => updateLeader(leader.id, 'experience', e.target.value)}
                           className="w-full bg-transparent text-base font-semibold text-slate-700 outline-none resize-none placeholder:text-slate-300 leading-relaxed"
                         />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between gap-4">
                  <button
                    onClick={() => handleSaveLeader(leader.id)}
                    disabled={
                      savingIds.has(leader.id) ||
                      !leader.isDirty ||
                      !String(leader.name || "").trim() ||
                      !String(leader.role || "").trim()
                    }
                    className="flex items-center justify-center gap-3 bg-[#1b365d] hover:bg-[#2c4c7c] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#1b365d]/20 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-lg">save</span>
                    {savingIds.has(leader.id)
                      ? "Saving..."
                      : leader.isDirty
                        ? "Save Changes"
                        : "Saved"}
                  </button>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-widest">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${leader.isDirty ? "bg-amber-500" : "bg-green-500"}`}
                    ></span>
                    {leader.isDirty ? "Unsaved" : "Saved"}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {!isLoadingLeaders && leaders.length === 0 && (
            <div className="col-span-full py-24 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center gap-6 text-center bg-white/50">
               <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-xl border border-slate-100">
                  <span className="material-symbols-outlined text-4xl">person_off</span>
               </div>
               <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#1b365d]">No Leadership Profiles</h3>
                  <p className="text-sm font-medium text-slate-400 max-w-xs">Start by adding the first profile to showcase your team's expertise.</p>
               </div>
               <button 
                onClick={openCreateModal}
                className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 cursor-pointer"
               >
                 Create First Profile
               </button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default AdminExpertiseLeadership;
