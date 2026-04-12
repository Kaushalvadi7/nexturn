import React from 'react';

const AdminDeleteModal = ({ isOpen, onClose, onConfirm, title = "Delete Item", message = "Are you sure you want to remove this? This action cannot be undone." }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        <div className="p-8">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-red-600 text-3xl">delete_forever</span>
          </div>

          <h3 className="text-2xl font-black text-black tracking-tight mb-2">{title}</h3>
          <p className="text-slate-600 font-medium leading-relaxed">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-black hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-6 py-4 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-95 cursor-pointer"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDeleteModal;
