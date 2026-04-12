import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { useToast } from "../../contexts/ToastContext";
import AdminDeleteModal from "../../components/admin/AdminDeleteModal";
import AdminCreateReviewModal from "../../components/admin/AdminCreateReviewModal";
import {
  createClientSuccessStory,
  deleteClientSuccessStory,
  getClientSuccessStories,
} from "../../lib/api";

const createEmptyStoryForm = () => ({
  client_name: "",
  client_position: "",
  client_city: "",
  client_purchase: "",
  description: "",
  stars: 5,
});

const getStoryFormErrors = (form) => {
  const starsValue = form.stars;
  const starsNumber =
    starsValue === "" || starsValue === null || starsValue === undefined
      ? null
      : Number(starsValue);

  return {
    client_name: String(form.client_name || "").trim()
      ? ""
      : "Client name is required.",
    stars:
      starsNumber === null ||
      (!Number.isNaN(starsNumber) && starsNumber >= 0 && starsNumber <= 5)
        ? ""
        : "Stars must be between 0 and 5.",
  };
};

const hasStoryFormErrors = (errors) => Object.values(errors).some(Boolean);

const AdminReview = () => {
  const toast = useToast();
  const [stories, setStories] = useState([]);
  const [isLoadingStories, setIsLoadingStories] = useState(true);
  const [storyError, setStoryError] = useState("");
  const [isSavingStory, setIsSavingStory] = useState(false);
  const [storyForm, setStoryForm] = useState(createEmptyStoryForm());
  const [storyFormErrors, setStoryFormErrors] = useState({
    client_name: "",
    stars: "",
  });
  const [storyModal, setStoryModal] = useState({ isOpen: false, token: 0 });
  const [deleteStoryModal, setDeleteStoryModal] = useState({
    isOpen: false,
    id: null,
    title: "",
  });

  const loadStories = async () => {
    setIsLoadingStories(true);
    setStoryError("");
    try {
      const data = await getClientSuccessStories();
      setStories(Array.isArray(data) ? data : []);
    } catch (error) {
      setStoryError(error?.message || "Failed to load success stories.");
      setStories([]);
    } finally {
      setIsLoadingStories(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const openStoryModal = () => {
    setStoryError("");
    setStoryForm(createEmptyStoryForm());
    setStoryFormErrors({ client_name: "", stars: "" });
    setStoryModal({ isOpen: true, token: Date.now() });
  };

  const updateStoryForm = (field, value) => {
    setStoryForm((prev) => ({ ...prev, [field]: value }));
    if (field === "client_name" || field === "stars") {
      setStoryFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddStory = async () => {
    const nextErrors = getStoryFormErrors(storyForm);
    if (hasStoryFormErrors(nextErrors)) {
      setStoryFormErrors(nextErrors);
      return;
    }

    const starsValue = storyForm.stars;
    const starsNumber =
      starsValue === "" || starsValue === null || starsValue === undefined
        ? null
        : Number(starsValue);

    setIsSavingStory(true);
    setStoryError("");
    try {
      await createClientSuccessStory({
        client_name: storyForm.client_name.trim(),
        client_position: storyForm.client_position.trim() || null,
        client_city: storyForm.client_city.trim() || null,
        client_purchase: storyForm.client_purchase.trim() || null,
        description: storyForm.description.trim() || null,
        stars: starsNumber,
      });
      setStoryForm(createEmptyStoryForm());
      setStoryFormErrors({ client_name: "", stars: "" });
      setStoryModal({ isOpen: false, token: 0 });
      toast.success("Saved successfully");
      await loadStories();
    } catch (error) {
      toast.error("Failed");
      setStoryError(error?.message || "Failed to add success story.");
    } finally {
      setIsSavingStory(false);
    }
  };

  const handleDeleteStory = async () => {
    if (!deleteStoryModal.id) {
      setDeleteStoryModal({ isOpen: false, id: null, title: "" });
      return;
    }
    setIsSavingStory(true);
    setStoryError("");
    try {
      await deleteClientSuccessStory(deleteStoryModal.id);
      setStories((prev) => prev.filter((s) => s.id !== deleteStoryModal.id));
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error("Failed");
      setStoryError(error?.message || "Failed to delete success story.");
    } finally {
      setIsSavingStory(false);
      setDeleteStoryModal({ isOpen: false, id: null, title: "" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif]">
      <AdminNavbar />

      <AdminCreateReviewModal
        key={storyModal.token}
        isOpen={storyModal.isOpen}
        form={storyForm}
        errors={storyFormErrors}
        submitError={storyError}
        isSaving={isSavingStory}
        onClose={() => setStoryModal({ isOpen: false, token: 0 })}
        onChange={updateStoryForm}
        onSubmit={handleAddStory}
      />

      <AdminDeleteModal
        isOpen={deleteStoryModal.isOpen}
        onClose={() =>
          setDeleteStoryModal({ isOpen: false, id: null, title: "" })
        }
        onConfirm={handleDeleteStory}
        title="Delete Success Story?"
        message={`Are you sure you want to remove "${deleteStoryModal.title}"? This action cannot be undone.`}
      />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 py-12 space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-black font-black text-xs tracking-widest uppercase">
              <span className="material-symbols-outlined text-base">
                format_quote
              </span>
              CLIENT SUCCESS
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
              Client Review
            </h1>
            <p className="text-black font-medium max-w-2xl leading-relaxed text-sm">
              Add and manage international client Review shown on the
              public site.
            </p>
          </div>
        </div>
        {/* Client Success Stories */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-sm space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-black text-2xl md:text-3xl">
                format_quote
              </span>
              <div className="space-y-1">
                <h3 className="text-lg md:text-xl font-black text-black uppercase tracking-widest">
                  Client Success Stories
                </h3>
                <p className="text-xs font-black text-black/40 uppercase tracking-widest leading-none">
                  Add and manage client testimonials
                </p>
              </div>
            </div>
            <button
              onClick={openStoryModal}
              className="bg-accent text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20 flex items-center gap-2 active:scale-95 cursor-pointer w-full sm:w-auto justify-center"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              Add New Story
            </button>
          </div>

          {storyError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-bold text-red-600">
              {storyError}
            </div>
          )}
          {isLoadingStories && (
            <div className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-xs font-bold text-slate-500">
              Loading success stories...
            </div>
          )}

          {/* Stories List */}
          <div className="grid gap-6">
            {!isLoadingStories && stories.length === 0 && !storyError && (
              <div className="text-xs font-bold text-slate-500 py-12 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                No success stories yet. Bring some life to your platform!
              </div>
            )}
            <AnimatePresence mode="popLayout">
              {stories.map((story, index) => (
                <motion.div
                  key={story.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-8 border border-slate-100 rounded-3xl bg-white shadow-sm hover:shadow-xl hover:border-accent/10 transition-all relative group flex flex-col md:flex-row gap-6 items-start overflow-hidden min-w-0 w-full"
                >
                  {/* Decorative Quote Icon in background */}
                  <div className="absolute top-4 right-16 opacity-[0.03] pointer-events-none select-none">
                    <span className="material-symbols-outlined text-8xl">
                      format_quote
                    </span>
                  </div>

                  {/* Left side: Avatar style initial */}
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100 shadow-inner group-hover:bg-white transition-colors">
                    <span className="text-xl font-black text-slate-800 uppercase">
                      {story.client_name?.charAt(0) || "C"}
                    </span>
                  </div>

                  <div className="flex-1 space-y-4 min-w-0 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap min-w-0">
                          <h4 className="text-lg font-black text-slate-900 tracking-tight break-words min-w-0 flex-1">
                            {story.client_name}
                          </h4>
                          <div className="flex items-center gap-0.5 px-2 py-1 bg-orange-50 rounded-lg flex-shrink-0">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`material-symbols-outlined text-[16px] leading-none ${
                                  i < (story.stars || 0)
                                    ? "text-orange-500 font-variation-fill"
                                    : "text-slate-200"
                                }`}
                                style={{
                                  fontVariationSettings: `'FILL' ${
                                    i < (story.stars || 0) ? 1 : 0
                                  }`,
                                }}
                              >
                                star
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
                          {story.client_position && (
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 break-words min-w-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-200 flex-shrink-0" />
                              {story.client_position}
                            </span>
                          )}
                          {story.client_city && (
                            <span className="text-[11px] font-black text-accent uppercase tracking-widest flex items-center gap-1.5 border-l border-slate-100 pl-3 ml-1 break-words min-w-0">
                              {story.client_city}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setDeleteStoryModal({
                            isOpen: true,
                            id: story.id,
                            title: story.client_name || "this story",
                          })
                        }
                        className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer flex items-center justify-center border border-transparent hover:border-red-100 active:scale-90 flex-shrink-0"
                        title="Delete Review"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          delete
                        </span>
                      </button>
                    </div>

                    {story.description && (
                      <div className="relative min-w-0">
                        <p className="text-[13px] md:text-sm font-medium text-slate-600 leading-relaxed italic pr-8 break-words whitespace-pre-wrap overflow-hidden">
                          "{story.description}"
                        </p>
                      </div>
                    )}

                    {story.client_purchase && (
                      <div className="flex items-center gap-3 pt-2 min-w-0">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-100 to-transparent min-w-[20px]" />
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50/80 rounded-full border border-slate-100 flex-shrink-0 max-w-full">
                          <span className="material-symbols-outlined text-[14px] text-slate-400 flex-shrink-0">
                            shopping_bag
                          </span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate break-words">
                            {story.client_purchase}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>{" "}
      </main>
    </div>
  );
};

export default AdminReview;
