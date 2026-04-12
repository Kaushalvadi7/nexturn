import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const toast = React.useMemo(() => ({
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  }), [addToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} removeToast={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            pointer-events-auto min-w-[300px] max-w-md px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl
            flex items-center justify-between gap-4 animate-in fade-in slide-in-from-right-8 duration-300
            ${t.type === 'success' ? 'bg-white/95 border-green-100 text-green-900' : 
              t.type === 'error' ? 'bg-red-50/95 border-red-100 text-red-900' : 
              'bg-blue-50/95 border-blue-100 text-blue-900'}
          `}
        >
          <div className="flex items-center gap-3">
            <span className={`material-symbols-outlined ${t.type === 'success' ? 'text-green-600' : t.type === 'error' ? 'text-red-600' : 'text-blue-600'}`}>
              {t.type === 'success' ? 'check_circle' : t.type === 'error' ? 'error' : 'info'}
            </span>
            <p className="text-sm font-black tracking-tight leading-tight">{t.message}</p>
          </div>
          <button 
            onClick={() => removeToast(t.id)}
            className="text-slate-400 hover:text-black transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
};
