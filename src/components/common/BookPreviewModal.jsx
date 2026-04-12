import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import BookStyleLedgerPreview from "../home/BookStyleLedgerPreview";

const BookPreviewModal = ({ isOpen, onClose, pdfUrl }) => {
  useEffect(() => {
    if (isOpen) {
      console.log("BookPreviewModal: Opening with URL:", pdfUrl);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, pdfUrl]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "company-profile.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-6 lg:p-10">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />

      {/* Action Buttons Container */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-4">
        {/* Floating Download Button */}
        <button
          onClick={handleDownload}
          className="p-3 rounded-full bg-[#f5a623] hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 transition-all group backdrop-blur-sm border border-orange-400/30 cursor-pointer"
          aria-label="Download PDF"
        >
          <span className="material-symbols-outlined text-white group-hover:scale-110 transition-transform">download</span>
        </button>

        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all group backdrop-blur-sm cursor-pointer"
          aria-label="Close preview"
        >
          <span className="material-symbols-outlined text-white group-hover:scale-110 transition-transform">close</span>
        </button>
      </div>

      {/* Modal Content - Transparent & Large */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full h-[95vh] flex items-center justify-center z-10 pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full h-full pointer-events-auto">
            <BookStyleLedgerPreview isModal={true} pdfUrl={pdfUrl} />
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default BookPreviewModal;
