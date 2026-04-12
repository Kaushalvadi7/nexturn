import { useEffect, useState } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { useToast } from '../../contexts/ToastContext';
import AdminDeleteModal from '../../components/admin/AdminDeleteModal';
import AdminCreateSuccessStoryModal from '../../components/admin/AdminCreateSuccessStoryModal';
import {
  createClientProblemSolving,
  deleteClientProblemSolving,
  getClientProblemSolving,
  updateClientProblemSolving,
} from '../../lib/api';

const createEmptyStoryForm = () => ({
  title: "",
  product: "",
  country: "",
  year: "",
  challenge: "",
  solution: "",
  results: [""],
});

const getStoryFormErrors = (form) => {
  const title = String(form?.title || "").trim();
  const product = String(form?.product || "").trim();
  const country = String(form?.country || "").trim();
  const yearValue = String(form?.year ?? "").trim();
  const year = yearValue === "" ? NaN : Number(yearValue);

  return {
    title: title ? "" : "Client / Case Title is required.",
    product: product ? "" : "Industry / Product is required.",
    country: country ? "" : "Regional Market is required.",
    year: yearValue !== "" && !Number.isNaN(year)
      ? ""
      : "Year is required and must be a number.",
  };
};

const hasStoryFormErrors = (errors) => Object.values(errors).some(Boolean);

const AdminSuccessStories = () => {
  const toast = useToast();
  const [stories, setStories] = useState([/*
    {
      id: 1,
      title: "European Automotive Tier-1 Supplier",
      product: "Automotive Components",
      country: "Germany",
      year: "2022-PRESENT",
      challenge: "Required custom metal fittings with Â±0.015mm tolerance for hydraulic systems, with monthly volumes of 50,000+ pieces and zero-defect delivery expectations.",
      solution: "Implemented dedicated production line with Swiss-type CNC machines, developed custom inspection fixtures, and established weekly shipment schedule with complete traceability documentation.",
      results: [
        "99.7% first-pass quality rate achieved",
        "Reduced lead time from 8 weeks to 3 weeks",
        "Zero delivery delays over 18-month partnership",
        "Cost reduction of 12% through process optimization"
      ]
    }
  */]);
  const [isLoadingStories, setIsLoadingStories] = useState(true);
  const [storyError, setStoryError] = useState("");
  const [savingIds, setSavingIds] = useState(() => new Set());
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [showCreateStoryModal, setShowCreateStoryModal] = useState(false);
  const [createStoryForm, setCreateStoryForm] = useState(createEmptyStoryForm());
  const [createStoryErrors, setCreateStoryErrors] = useState({
    title: "",
    product: "",
    country: "",
    year: "",
  });

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: "" });

  useEffect(() => {
    let isActive = true;
    const loadStories = async () => {
      setIsLoadingStories(true);
      setStoryError("");
      try {
        const data = await getClientProblemSolving();
        if (!isActive) return;
        const normalized = (Array.isArray(data) ? data : []).map((row) => ({
          id: row.id,
          title: row.client_name || "",
          product: row.product_name || "",
          country: row.client_location || "",
          year: row.year ?? "",
          challenge: row.challange || "",
          solution: row.solution || "",
          results: Array.isArray(row.results) ? row.results : [],
          isNew: false,
          isDirty: false,
        }));
        setStories(normalized);
      } catch (error) {
        if (!isActive) return;
        console.error("Failed to load client problem solving stories", error);
        setStories([]);
        setStoryError(error?.message || "Failed to load success stories.");
      } finally {
        if (isActive) setIsLoadingStories(false);
      }
    };

    loadStories();
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

  const openCreateStoryModal = () => {
    setStoryError("");
    setCreateStoryForm(createEmptyStoryForm());
    setCreateStoryErrors({
      title: "",
      product: "",
      country: "",
      year: "",
    });
    setShowCreateStoryModal(true);
  };

  const updateStory = (id, field, value) => {
    setStories(stories.map(s => s.id === id ? { ...s, [field]: value, isDirty: true } : s));
  };

  const updateCreateStoryForm = (field, value) => {
    if (field === "results") {
      setCreateStoryForm((prev) => {
        const nextResults = [...prev.results];
        nextResults[value.index] = value.value;
        return { ...prev, results: nextResults };
      });
      return;
    }

    setCreateStoryForm((prev) => ({ ...prev, [field]: value }));
    if (field in createStoryErrors) {
      setCreateStoryErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const addCreateResult = () => {
    setCreateStoryForm((prev) => ({ ...prev, results: [...prev.results, ""] }));
  };

  const removeCreateResult = (index) => {
    setCreateStoryForm((prev) => {
      const nextResults = prev.results.filter((_, i) => i !== index);
      return { ...prev, results: nextResults.length ? nextResults : [""] };
    });
  };

  const updateResult = (storyId, resultIndex, value) => {
    setStories(stories.map(s => {
      if (s.id === storyId) {
        const newResults = [...s.results];
        newResults[resultIndex] = value;
        return { ...s, results: newResults, isDirty: true };
      }
      return s;
    }));
  };

  const addResult = (storyId) => {
    setStories(stories.map(s => {
      if (s.id === storyId) {
        return { ...s, results: [...s.results, ""], isDirty: true };
      }
      return s;
    }));
  };

  const removeResult = (storyId, index) => {
    setStories(stories.map(s => {
      if (s.id === storyId) {
        const newResults = s.results.filter((_, i) => i !== index);
        return { ...s, results: newResults, isDirty: true };
      }
      return s;
    }));
  };

  const openDeleteModal = (id, title) => {
    setDeleteModal({ isOpen: true, id, title });
  };

  const confirmDelete = async () => {
    setStoryError("");
    try {
      await deleteClientProblemSolving(deleteModal.id);
      setStories(stories.filter(s => s.id !== deleteModal.id));
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error("Failed");
      console.error("Failed to delete success story", error);
      setStoryError(error?.message || "Failed to delete success story.");
    } finally {
      setDeleteModal({ isOpen: false, id: null, title: "" });
    }
  };

  const handleSaveStory = async (storyId) => {
    const story = stories.find((s) => s.id === storyId);
    if (!story) return;

    const title = String(story.title || "").trim();
    const product = String(story.product || "").trim();
    const country = String(story.country || "").trim();
    const yearValue = story.year;
    const year = yearValue === "" || yearValue === null || yearValue === undefined ? NaN : Number(yearValue);

    if (!title) {
      setStoryError("Client / Case Title is required.");
      return;
    }
    if (!product) {
      setStoryError("Industry / Product is required.");
      return;
    }
    if (!country) {
      setStoryError("Regional Market is required.");
      return;
    }
    if (Number.isNaN(year)) {
      setStoryError("Year is required and must be a number.");
      return;
    }

    const payload = {
      client_name: title,
      product_name: product,
      client_location: country,
      year,
      challange: String(story.challenge || "").trim() || null,
      solution: String(story.solution || "").trim() || null,
      results: (Array.isArray(story.results) ? story.results : [])
        .map((r) => String(r ?? "").trim())
        .filter(Boolean),
    };

    setStoryError("");
    markSaving(storyId, true);
    try {
      if (story.isNew) {
        const result = await createClientProblemSolving(payload);
        const newId = result?.data?.id;
        if (!newId) throw new Error("Failed to create success story.");

        setStories((prev) =>
          prev.map((s) =>
            s.id === storyId ? { ...s, id: newId, isNew: false, isDirty: false } : s,
          ),
        );
      } else {
        setStories((prev) => prev.map((s) => (s.id === storyId ? { ...s, isDirty: false } : s)));
      }
      toast.success(story.isNew ? "Saved successfully" : "Edited successfully");
    } catch (error) {
      toast.error("Failed");
      console.error("Failed to save success story", { storyId, error });
      setStoryError(error?.message || "Failed to save success story.");
    } finally {
      markSaving(storyId, false);
    }
  };

  const handleCreateStory = async () => {
    const nextErrors = getStoryFormErrors(createStoryForm);
    if (hasStoryFormErrors(nextErrors)) {
      setCreateStoryErrors(nextErrors);
      return;
    }

    const payload = {
      client_name: String(createStoryForm.title || "").trim(),
      product_name: String(createStoryForm.product || "").trim(),
      client_location: String(createStoryForm.country || "").trim(),
      year: Number(createStoryForm.year),
      challange: String(createStoryForm.challenge || "").trim() || null,
      solution: String(createStoryForm.solution || "").trim() || null,
      results: (Array.isArray(createStoryForm.results) ? createStoryForm.results : [])
        .map((result) => String(result || "").trim())
        .filter(Boolean),
    };

    setIsCreatingStory(true);
    setStoryError("");
    try {
      const result = await createClientProblemSolving(payload);
      const newId = result?.data?.id;
      if (!newId) throw new Error("Failed to create success story.");

      setStories((prev) => [
        ...prev,
        {
          id: newId,
          title: payload.client_name,
          product: payload.product_name,
          country: payload.client_location,
          year: payload.year,
          challenge: payload.challange || "",
          solution: payload.solution || "",
          results: payload.results,
          isNew: false,
          isDirty: false,
        },
      ]);
      toast.success("Saved successfully");
      setShowCreateStoryModal(false);
      setCreateStoryForm(createEmptyStoryForm());
      setCreateStoryErrors({
        title: "",
        product: "",
        country: "",
        year: "",
      });
    } catch (error) {
      toast.error("Failed");
      console.error("Failed to create success story", error);
      setStoryError(error?.message || "Failed to create success story.");
    } finally {
      setIsCreatingStory(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif]">
      <AdminNavbar />
      
      <AdminCreateSuccessStoryModal
        isOpen={showCreateStoryModal}
        form={createStoryForm}
        errors={createStoryErrors}
        submitError={showCreateStoryModal ? storyError : ""}
        isSaving={isCreatingStory}
        onClose={() => setShowCreateStoryModal(false)}
        onChange={updateCreateStoryForm}
        onAddResult={addCreateResult}
        onRemoveResult={removeCreateResult}
        onSubmit={handleCreateStory}
      />
      
      <AdminDeleteModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        title={`Delete "${deleteModal.title}"?`}
        message="Are you sure you want to remove this success story? This will permanently delete all associated data."
      />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 py-12 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-black font-black text-xs tracking-widest uppercase">
               <span className="material-symbols-outlined text-base text-blue-600">public</span>
               GLOBAL PARTNERSHIPS
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">International Success Stories</h1>
            <p className="text-black font-medium max-w-2xl leading-relaxed text-sm">
              Document and showcase how Nexturn solves complex engineering challenges for international clients.
            </p>
          </div>
          
          <button 
            onClick={openCreateStoryModal}
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 cursor-pointer w-full md:w-auto"
          >
            <span className="material-symbols-outlined text-xl">add_circle</span>
            Add Success Story
          </button>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 gap-12">
          {storyError && (
            <div className="rounded-2xl bg-red-50 border border-red-200 px-6 py-4 text-xs font-bold text-red-600">
              {storyError}
            </div>
          )}
          {isLoadingStories && (
            <div className="rounded-2xl bg-white border border-slate-200 px-6 py-4 text-xs font-bold text-slate-500">
              Loading success stories...
            </div>
          )}
          {stories.map((story) => (
            <div key={story.id} className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col hover:border-blue-200 transition-all duration-300 group/card relative">

              <div className="p-10 md:p-16 space-y-12">
                {/* Header Input Group */}
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                    <div className="flex-1 space-y-3 w-full">
                      <label className="text-xs font-black text-[#1b365d] uppercase tracking-widest block pl-1 opacity-70">Client / Case Title</label>
                      <input 
                        type="text" 
                        value={story.title}
                        placeholder="e.g. European Automotive Tier-1 Supplier"
                        onChange={(e) => updateStory(story.id, 'title', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-2xl font-black text-[#1b365d] outline-none focus:bg-white focus:border-blue-400 transition-all shadow-sm placeholder:text-slate-200"
                      />
                    </div>
                    <div className="w-full md:w-64 space-y-3">
                      <label className="text-xs font-black text-[#1b365d] uppercase tracking-widest block pl-1 opacity-70">Duration / Year</label>
                      <input 
                        type="number"
                        value={story.year}
                        placeholder="e.g. 2022"
                        onChange={(e) => updateStory(story.id, 'year', e.target.value)}
                        className="w-full bg-orange-50/50 border border-orange-100 rounded-2xl px-6 py-5 text-sm font-black text-orange-600 uppercase tracking-widest outline-none focus:bg-white focus:border-orange-400 transition-all shadow-sm placeholder:text-orange-200 text-center"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-[#1b365d] uppercase tracking-widest block pl-1 opacity-70">Industry / Product</label>
                      <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus-within:bg-white focus-within:border-blue-400 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-slate-400">category</span>
                        <input 
                          type="text" 
                          value={story.product}
                          placeholder="e.g. Automotive Components"
                          onChange={(e) => updateStory(story.id, 'product', e.target.value)}
                          className="flex-1 bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-200"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-[#1b365d] uppercase tracking-widest block pl-1 opacity-70">Regional Market</label>
                      <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus-within:bg-white focus-within:border-blue-400 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-blue-500">public</span>
                        <input 
                          type="text" 
                          value={story.country}
                          placeholder="e.g. GERMANY"
                          onChange={(e) => updateStory(story.id, 'country', e.target.value)}
                          className="flex-1 bg-transparent text-sm font-black text-[#1b365d] uppercase tracking-widest outline-none placeholder:text-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Challenge & Solution Side-by-Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#1b365d]">
                        <span className="material-symbols-outlined text-xl">warning</span>
                      </div>
                      <h3 className="text-base font-black text-[#1b365d]">Challenge</h3>
                    </div>
                    <textarea 
                      value={story.challenge}
                      placeholder="Describe the initial technical roadblock or requirement..."
                      onChange={(e) => updateStory(story.id, 'challenge', e.target.value)}
                      rows="4"
                      className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-6 text-base font-semibold text-slate-600 outline-none focus:bg-white focus:border-blue-400 transition-all leading-relaxed shadow-sm resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#1b365d]">
                        <span className="material-symbols-outlined text-xl">lightbulb</span>
                      </div>
                      <h3 className="text-base font-black text-[#1b365d]">Solution</h3>
                    </div>
                    <textarea 
                      value={story.solution}
                      placeholder="Explain Nexturn's engineering approach and implementation..."
                      onChange={(e) => updateStory(story.id, 'solution', e.target.value)}
                      rows="4"
                      className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-6 text-base font-semibold text-slate-600 outline-none focus:bg-white focus:border-blue-400 transition-all leading-relaxed shadow-sm resize-none"
                    />
                  </div>
                </div>

                {/* Measurable Results */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#1b365d]">
                          <span className="material-symbols-outlined text-xl">bar_chart</span>
                        </div>
                        <h3 className="text-base font-black text-[#1b365d]">Measurable Results</h3>
                      </div>
                      <button 
                        onClick={() => addResult(story.id)}
                        className="text-sm font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:text-blue-700 transition-all"
                      >
                        <span className="material-symbols-outlined text-base">add_circle</span>
                        Add Result Point
                      </button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {story.results.map((result, rIdx) => (
                      <div key={rIdx} className="group/result flex items-center gap-4 bg-white border border-slate-100 p-5 rounded-2xl hover:border-green-200 hover:shadow-md transition-all">
                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-green-600 text-lg font-black">check</span>
                        </div>
                        <input 
                          type="text" 
                          value={result}
                          placeholder="Outcome achieved..."
                          onChange={(e) => updateResult(story.id, rIdx, e.target.value)}
                          className="flex-1 bg-transparent text-sm font-bold text-slate-700 outline-none"
                        />
                        <button 
                          onClick={() => removeResult(story.id, rIdx)}
                          className="material-symbols-outlined text-slate-300 hover:text-red-500 text-lg opacity-0 group-hover/result:opacity-100 transition-all cursor-pointer"
                        >
                          close
                        </button>
                      </div>
                    ))}
                   </div>
                </div>

                <div className="pt-2">
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-7 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          story.isDirty || story.isNew ? "bg-amber-500" : "bg-green-500"
                        }`}
                      ></span>
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                          Status
                        </p>
                        <p className="text-sm font-bold text-[#1b365d]">
                          {story.isDirty || story.isNew ? "Unsaved changes" : "Saved"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-end">
                      <button
                        onClick={() => handleSaveStory(story.id)}
                        disabled={
                          savingIds.has(story.id) ||
                          (!story.isDirty && !story.isNew) ||
                          !String(story.title || "").trim() ||
                          !String(story.product || "").trim() ||
                          !String(story.country || "").trim() ||
                          String(story.year ?? "").trim() === ""
                        }
                        className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                          ${savingIds.has(story.id) ? "bg-slate-600 text-white shadow-slate-600/20" : ""}
                          ${!savingIds.has(story.id) && (story.isDirty || story.isNew) ? "bg-[#1b365d] hover:bg-[#2c4c7c] text-white shadow-[#1b365d]/20" : ""}
                          ${!savingIds.has(story.id) && !(story.isDirty || story.isNew) ? "bg-green-50 text-green-700 border border-green-200 shadow-green-500/10" : ""}
                        `}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {savingIds.has(story.id)
                            ? "sync"
                            : story.isDirty || story.isNew
                              ? "save"
                              : "check_circle"}
                        </span>
                        {savingIds.has(story.id)
                          ? "Saving..."
                          : story.isNew
                            ? "Save Story"
                            : story.isDirty
                              ? "Save Changes"
                              : "Saved"}
                      </button>

                      <button
                        onClick={() => openDeleteModal(story.id, story.title)}
                        className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 shadow-sm active:scale-95 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {!isLoadingStories && stories.length === 0 && (
            <div className="py-24 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center gap-6 text-center bg-white/50">
               <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-xl border border-slate-100">
                  <span className="material-symbols-outlined text-4xl">travel_explore</span>
               </div>
               <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#1b365d]">No Success Stories</h3>
                  <p className="text-sm font-medium text-slate-400 max-w-xs">Start documenting your global engineering victories.</p>
               </div>
               <button 
                onClick={openCreateStoryModal}
                className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 cursor-pointer"
               >
                 Create First Story
               </button>
            </div>
          )}
        </div>

        {/* Action Bar Footer */}
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
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest">PORTFOLIO</p>
                   <p className="text-xs font-bold text-black">{stories.length} Client Case Studies</p>
                </div>
             </div>
             
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Save each story to publish changes
              </div>
           </div>
         </div>
      </main>
    </div>
  );
};

export default AdminSuccessStories;
