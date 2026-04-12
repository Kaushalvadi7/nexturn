import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const isValidEmail = (value) => {
  const email = String(value || "").trim();
  if (!email) return false;
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
};

const LeadCaptureModal = ({ isOpen, title, onClose, onConfirm, isSubmitting = false }) => {
  const [form, setForm] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({ name: "", email: "" });
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const timer = setTimeout(() => nameInputRef.current?.focus(), 0);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const canSubmit = useMemo(() => {
    return form.name.trim().length > 0 && isValidEmail(form.email);
  }, [form.email, form.name]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = { name: "", email: "" };
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    else if (!isValidEmail(form.email))
      nextErrors.email = "Enter a valid email address.";
    setErrors(nextErrors);
    return !nextErrors.name && !nextErrors.email;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (isSubmitting) return;
    onConfirm?.({ name: form.name.trim(), email: form.email.trim() });
  };

  if (!isOpen) return null;

  const heading = title || "Download";
  const subheading = heading.toLowerCase().includes("profile")
    ? "We’d love to get in touch—share your details to download our Company Profile."
    : "We’d love to get in touch—share your details to download our latest Catalogue.";

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Continue"}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close"
        onClick={() => {
          if (!isSubmitting) onClose?.();
        }}
      />

      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-[#052136] mt-1">
              {heading}
            </h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              {subheading}
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-slate-100 cursor-pointer"
            aria-label="Close"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="px-6 py-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                ref={nameInputRef}
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter your name"
                disabled={isSubmitting}
                className={`w-full bg-white border rounded-lg py-3 px-4 text-slate-900 focus:outline-none focus:border-[#f2a67a] transition-colors placeholder:text-slate-300 text-sm ${
                  errors.name ? "border-red-300" : "border-slate-200"
                }`}
              />
              {errors.name ? (
                <p className="text-xs text-red-500 mt-2">{errors.name}</p>
              ) : null}
            </div>

            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="Enter your email"
                disabled={isSubmitting}
                className={`w-full bg-white border rounded-lg py-3 px-4 text-slate-900 focus:outline-none focus:border-[#f2a67a] transition-colors placeholder:text-slate-300 text-sm ${
                  errors.email ? "border-red-300" : "border-slate-200"
                }`}
              />
              {errors.email ? (
                <p className="text-xs text-red-500 mt-2">{errors.email}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="sm:order-1 bg-white text-[#052136] px-5 py-3 rounded-lg font-black text-xs uppercase tracking-wider border border-slate-200 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className={`sm:order-2 px-5 py-3 rounded-lg font-black text-xs uppercase tracking-wider transition-all active:scale-95 ${
                canSubmit && !isSubmitting
                  ? "bg-[#052136] text-white hover:bg-[#031a2a] cursor-pointer"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Processing..." : "Download"}
            </button>
          </div>

          <p className="mt-5 text-[11px] font-semibold text-slate-400 leading-relaxed">
            We’ll only use this to share the requested file and follow up if
            needed.
          </p>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default LeadCaptureModal;
