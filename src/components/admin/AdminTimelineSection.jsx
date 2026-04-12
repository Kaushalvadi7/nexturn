import React, { useEffect, useMemo, useState } from 'react';
import AdminDeleteModal from './AdminDeleteModal';
import { useToast } from '../../contexts/ToastContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getJourneyTimeline, saveJourneyTimeline } from '../../lib/api';

const AdminTimelineSection = () => {
  const toast = useToast();
  const [milestones, setMilestones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [deleteModal, setDeleteModal] = useState({ 
    isOpen: false, 
    index: null, 
    title: "" 
  });

  useEffect(() => {
    let isActive = true;
    const fetchTimeline = async () => {
      setIsLoading(true);
      setLoadError("");
      try {
        const data = await getJourneyTimeline();
        if (!isActive) return;
        const mapped = Array.isArray(data)
          ? data.map((item) => ({
              year: item?.year ? String(item.year) : "",
              title: item?.title || "",
              description: item?.description || "",
            }))
          : [];
        setMilestones(mapped.length > 0 ? mapped : []);
      } catch (error) {
        if (isActive) {
          setLoadError(error?.message || "Unable to load journey timeline.");
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchTimeline();
    return () => {
      isActive = false;
    };
  }, []);

  const canSave = useMemo(() => {
    if (milestones.length === 0) return false;
    return milestones.every((m) => m.year && m.title && m.description);
  }, [milestones]);

  const handleAddMilestone = () => {
    setMilestones([...milestones, { year: new Date().getFullYear().toString(), title: "", description: "" }]);
  };

  const handleUpdateMilestone = (index, field, value) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const handleRemoveMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
    setDeleteModal({ isOpen: false, index: null, title: "" });
    toast.success("Deleted successfully");
  };

  const openDeleteConfirmation = (index) => {
    setDeleteModal({
      isOpen: true,
      index,
      title: milestones[index].title || "this milestone"
    });
  };

  const handleSaveTimeline = async () => {
    setIsSaving(true);
    try {
      await saveJourneyTimeline(milestones);
      toast.success("Edited successfully");
    } catch (error) {
      toast.error("Failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
      <AdminDeleteModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={() => handleRemoveMilestone(deleteModal.index)}
        title={`Delete "${deleteModal.title}"?`}
        message="Are you sure you want to remove this milestone from your export journey? This action cannot be undone."
      />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-black tracking-tight">Export Journey Timeline</h3>
          <p className="text-xs text-black/50 font-medium mt-1 uppercase tracking-widest">Manage key milestones of your growth story</p>
        </div>
        <button 
          onClick={handleAddMilestone}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-black px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Add Milestone
        </button>
      </div>

      {loadError && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-bold text-red-600">
          {loadError}
        </div>
      )}
      {isLoading && (
        <div className="mb-6 rounded-xl bg-white border border-slate-200 px-4 py-3 text-xs font-bold text-slate-500">
          Loading timeline...
        </div>
      )}

      <div className="relative pl-8 space-y-12">
        {/* Vertical Line */}
        <div className="absolute left-[3.5px] top-4 bottom-0 w-0.5 bg-slate-100"></div>

        {milestones.map((milestone, index) => (
          <div key={index} className="relative group animate-in fade-in slide-in-from-left-4 duration-300">
            {/* Timeline Dot */}
            <div className={`absolute -left-[32px] top-6 w-2 h-2 rounded-full border-2 border-white ring-4 bg-blue-500 ring-blue-500/20`}></div>

            <div className="bg-slate-50/50 rounded-2xl border border-slate-200 p-6 space-y-6 hover:bg-white hover:shadow-md transition-all relative">
              <button 
                onClick={() => openDeleteConfirmation(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-red-200 cursor-pointer z-10"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>

              <div className="flex flex-col sm:flex-row gap-8">
                <div className="w-32">
                  <DatePicker
                    selected={milestone.year ? new Date(milestone.year, 0, 1) : null}
                    onChange={(date) => handleUpdateMilestone(index, 'year', date.getFullYear().toString())}
                    showYearPicker
                    dateFormat="yyyy"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-black text-black outline-none focus:border-[#1b365d]"
                  />
                </div>
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="Milestone Title"
                    value={milestone.title}
                    onChange={(e) => handleUpdateMilestone(index, 'title', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-black text-black outline-none focus:border-[#1b365d]"
                  />
                </div>
              </div>
              
              <textarea 
                value={milestone.description}
                placeholder="Describe this milestone..."
                onChange={(e) => handleUpdateMilestone(index, 'description', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 outline-none focus:border-[#1b365d] min-h-[80px] resize-none leading-relaxed"
              />
            </div>
          </div>
        ))}

        <div className="pt-2">
          <button 
            onClick={handleSaveTimeline}
            disabled={isSaving || !canSave}
            className="w-full bg-[#1b365d] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#2c4c7c] transition-all shadow-xl shadow-[#1b365d]/20 active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Timeline"}
          </button>
        </div>
      </div>



      <style>{`
        .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker {
          border: none;
          border-radius: 1.5rem;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          padding: 0.5rem;
          background: white;
        }
        .react-datepicker__header {
          background-color: white;
          border-bottom: none;
          padding-top: 1rem;
          padding-bottom: 0.5rem;
        }
        .react-datepicker__current-month {
          font-size: 1rem;
          font-weight: 900;
          color: #000;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .react-datepicker__year-wrapper {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          padding: 0.5rem;
          justify-content: center;
          max-width: none;
        }
        .react-datepicker__year-text {
          padding: 0.75rem 0.5rem;
          font-weight: 700;
          font-size: 0.875rem;
          color: #4b5563;
          border-radius: 0.75rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          margin: 0 !important;
          width: auto !important;
          display: flex !important;
          align-items: center;
          justify-content: center;
        }
        .react-datepicker__year-text:hover {
          background-color: #f8fafc !important;
          color: #1b365d !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .react-datepicker__year-text--selected {
          background-color: #1b365d !important;
          color: white !important;
          box-shadow: 0 10px 15px -3px rgba(27, 54, 93, 0.3);
        }
        .react-datepicker__year-text--today {
          border: 2px solid #e2e8f0;
        }
        .react-datepicker__navigation {
          top: 1.25rem;
        }
        .react-datepicker__navigation--previous {
          left: 1rem;
        }
        .react-datepicker__navigation--next {
          right: 1rem;
        }
        .react-datepicker__year-read-view--down-arrow,
        .react-datepicker__month-read-view--down-arrow,
        .react-datepicker__month-year-read-view--down-arrow,
        .react-datepicker__navigation-icon::before {
          border-color: #94a3b8;
          border-width: 2px 2px 0 0;
        }
        .react-datepicker__navigation:hover *::before {
          border-color: #1b365d;
        }
        .react-datepicker__triangle {
          display: none;
        }
      `}</style>

    </div>
  );
};

export default AdminTimelineSection;
