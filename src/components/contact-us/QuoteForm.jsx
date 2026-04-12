import React, { useEffect, useMemo, useRef, useState } from "react";
import { createInquiryForm, getCategories } from "../../lib/api";
import { countryOptions } from "../../constants/countryOptions";
const QuoteForm = () => {
  const [form, setForm] = useState({
    categoryId: "",
    categoryName: "",
    categoryOther: "",
    company: "",
    person: "",
    email: "",
    phone: "",
    country: "",
    quantity: "",
    tolerance: "",
    requirements: "",
    file: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [catalogError, setCatalogError] = useState("");
  const fileLabel = useMemo(() => {
    if (!form.file) return "Click to upload or drag and drop";
    return form.file.name;
  }, [form.file]);

  useEffect(() => {
    let isActive = true;
    const fetchCatalog = async () => {
      setCatalogError("");
      try {
        const [categoryRes] = await Promise.all([getCategories()]);

        const mappedCategories = (categoryRes?.data || []).map((cat) => ({
          id: String(cat.id),
          name: cat.name || "",
        }));

        if (isActive) {
          setCategories(mappedCategories);
        }
      } catch (error) {
        if (isActive) {
          setCatalogError(error?.message || "Unable to load categories.");
        }
      }
    };

    fetchCatalog();
    return () => {
      isActive = false;
    };
  }, []);
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSubmitStatus({ type: "", message: "" });
  };
  const validateForm = () => {
    const nextErrors = {};
    if (!form.categoryId) nextErrors.categoryId = "Please select a category.";
    if (form.categoryId === "other" && !form.categoryOther.trim()) {
      nextErrors.categoryOther = "Please describe the category.";
    }
    if (!form.company.trim())
      nextErrors.company = "Company name is required.";
    if (!form.person.trim())
      nextErrors.person = "Contact person is required.";
    if (!form.email.trim()) nextErrors.email = "Email address is required.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim()))
      nextErrors.email = "Enter a valid email address.";
    if (!form.country) nextErrors.country = "Country is required.";
    if (!form.quantity.trim()) nextErrors.quantity = "Quantity is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });
    try {
      const formData = new FormData();
      const messageLines = [
        ["Category", form.categoryName],
        ["Country", form.country],
        ["Quantity", form.quantity],
        ["Tolerance", form.tolerance],
        ["Requirements", form.requirements],
      ]
        .filter(([, value]) => value && String(value).trim() !== "")
        .map(([label, value]) => `${label}: ${value}`);

      formData.append("full_name", form.person);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("company_name", form.company);
      formData.append("category_name", form.categoryName);
      formData.append("subject", form.categoryName);
      formData.append("message", messageLines.join("\n"));
      if (form.file) formData.append("files", form.file);
      await createInquiryForm(formData);
      setSubmitStatus({
        type: "success",
        message:
          "Thanks! Your inquiry has been sent. Our team will reach out shortly.",
      });
      setForm({
        categoryId: "",
        categoryName: "",
        categoryOther: "",
        company: "",
        person: "",
        email: "",
        phone: "",
        country: "",
        quantity: "",
        tolerance: "",
        requirements: "",
        file: null,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section className="py-2 bg-white">
      <div className="container mx-auto px-5 max-w-[1440px]">
        {/* Header */}
        <div className="text-center mb-2">
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            Request a Quote
          </h2>
          
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            Fill out the form below and our technical team will respond within 24 hours
          </p>
        </div>
        {/* Form Card */}
        <div className="bg-[#f4f6f8] rounded-2xl border border-slate-100 shadow-md shadow-slate-200/40 overflow-hidden">
          <div className="p-3 md:p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              {/* Left Column: Personal & Company Info */}
              <div className="space-y-2">
                <div className="rounded-xl border border-slate-200/50 bg-white/50 p-4 md:p-5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Company Details
                  </p>
                  <h3 className="text-sm font-bold text-[#1a2b3c] mt-0.5">
                    Primary Information
                  </h3>
                  <div className="grid grid-cols-1 gap-3 mt-3">
                    {/* Category */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#1a2b3c] uppercase tracking-wider mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={form.categoryId}
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            const selected = categories.find(
                              (c) => c.id === selectedId,
                            );
                            const isOther = selectedId === "other";
                            updateField("categoryId", selectedId);
                            updateField("categoryName", isOther ? "" : selected?.name || "");
                            if (!isOther) updateField("categoryOther", "");
                          }}
                          className={`w-full bg-white border rounded-lg py-2.5 px-4 text-slate-600 appearance-none focus:outline-none focus:border-accent group transition-colors text-sm ${
                            errors.categoryId ? "border-red-300" : "border-slate-200"
                          }`}
                        >
                          <option value="">Select category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                          <option value="other">Others</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {errors.categoryId && <p className="text-xs text-red-500 mt-2">{errors.categoryId}</p>}
                    </div>

                    {/* Other Category */}
                    {form.categoryId === "other" && (
                      <div>
                        <label className="block text-[11px] font-bold text-[#1a2b3c] uppercase tracking-wider mb-2">
                          Describe Category <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.categoryOther}
                          onChange={(e) => {
                            updateField("categoryOther", e.target.value);
                            updateField("categoryName", e.target.value.trim());
                          }}
                          placeholder="Enter category description"
                          className={`w-full bg-white border rounded-lg py-2.5 px-4 text-slate-900 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-300 text-sm ${
                            errors.categoryOther ? "border-red-300" : "border-slate-200"
                          }`}
                        />
                        {errors.categoryOther && <p className="text-xs text-red-500 mt-2">{errors.categoryOther}</p>}
                      </div>
                    )}
                    
                    {/* Company Name */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#1a2b3c] uppercase tracking-wider mb-2">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => updateField("company", e.target.value)}
                        placeholder="Enter your company name"
                        className={`w-full bg-white border rounded-lg py-2.5 px-4 text-slate-900 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-300 text-sm ${
                          errors.company ? "border-red-300" : "border-slate-200"
                        }`}
                      />
                      {errors.company && <p className="text-xs text-red-500 mt-2">{errors.company}</p>}
                    </div>
                    {/* Contact Person */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#1a2b3c] uppercase tracking-wider mb-2">
                        Contact Person <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.person}
                        onChange={(e) => updateField("person", e.target.value)}
                        placeholder="Enter contact person name"
                        className={`w-full bg-white border rounded-lg py-2.5 px-4 text-slate-900 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-300 text-sm ${
                          errors.person ? "border-red-300" : "border-slate-200"
                        }`}
                      />
                      {errors.person && <p className="text-xs text-red-500 mt-2">{errors.person}</p>}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200/50 bg-white/50 p-4 md:p-5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Contact Information
                  </p>
                  <h3 className="text-sm font-bold text-[#1a2b3c] mt-0.5">
                    How Can We Reach You
                  </h3>
                  <div className="grid grid-cols-1 gap-3 mt-3">
                    {/* Email Address */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#1a2b3c] uppercase tracking-wider mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="your.email@company.com"
                        className={`w-full bg-white border rounded-lg py-2.5 px-4 text-slate-900 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-300 text-sm ${
                          errors.email ? "border-red-300" : "border-slate-200"
                        }`}
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-2">{errors.email}</p>}
                    </div>
                    {/* Phone Number & Country Select */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                          <label className="block text-[11px] font-bold text-[#1a2b3c] uppercase tracking-wider mb-2">
                            Phone Number
                          </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          placeholder="+1 234 567 8900"
                            className={`w-full bg-white border rounded-lg py-2.5 px-4 text-slate-900 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-300 text-sm ${
                              errors.phone ? "border-red-300" : "border-slate-200"
                            }`}
                        />
                      </div>
                      <div>
                          <label className="block text-[11px] font-bold text-[#1a2b3c] uppercase tracking-wider mb-2">
                            Country <span className="text-red-500">*</span>
                          </label>
                        <div className="relative">
                          <select
                            value={form.country}
                            onChange={(e) => updateField("country", e.target.value)}
                             className={`w-full bg-white border rounded-lg py-2.5 px-4 text-slate-600 appearance-none focus:outline-none focus:border-accent group transition-colors text-sm ${
                               errors.country ? "border-red-300" : "border-slate-200"
                             }`}
                          >
                            <option value="">Select country</option>
                            {countryOptions.map((country) => (
                              <option key={country.code} value={country.name}>
                                {country.name}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {errors.country && <p className="text-xs text-red-500 mt-2">{errors.country}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Project Details & Requirements */}
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-200/50 bg-white/50 p-4 md:p-5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Project Details
                  </p>
                  <h3 className="text-sm font-bold text-[#1a2b3c] mt-0.5">
                    Requirements Summary
                  </h3>
                  <div className="space-y-3 mt-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Quantity */}
                      <div>
                          <label className="block text-[11px] font-bold text-[#1a2b3c] uppercase tracking-wider mb-2">
                            Quantity Required <span className="text-red-500">*</span>
                          </label>
                        <input
                          type="text"
                          value={form.quantity}
                          onChange={(e) => updateField("quantity", e.target.value)}
                          placeholder="e.g., 10k pcs"
                            className={`w-full bg-white border rounded-lg py-2.5 px-4 text-slate-900 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-300 text-sm ${
                              errors.quantity ? "border-red-300" : "border-slate-200"
                            }`}
                        />
                        {errors.quantity && <p className="text-xs text-red-500 mt-2">{errors.quantity}</p>}
                      </div>
                      {/* Tolerance */}
                      <div>
                          <label className="block text-[11px] font-bold text-[#1a2b3c] uppercase tracking-wider mb-2">
                            Tolerance Required
                          </label>
                        <input
                          type="text"
                          value={form.tolerance}
                          onChange={(e) => updateField("tolerance", e.target.value)}
                          placeholder="e.g., +/-0.05mm"
                            className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-slate-900 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-300 text-sm"
                        />
                      </div>
                    </div>

                    {/* Additional Requirements */}
                    <div>
                        <label className="block text-[11px] font-bold text-[#1a2b3c] uppercase tracking-wider mb-2">
                          Additional Requirements
                        </label>
                      <textarea
                        value={form.requirements}
                        onChange={(e) => updateField("requirements", e.target.value)}
                        placeholder="Describe your specific requirements, quality standards, etc."
                        rows={5}
                        className="w-full bg-white border border-slate-200 rounded-lg py-3 px-4 text-slate-900 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-300 text-sm resize-none"
                      ></textarea>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-[11px] font-bold text-[#1a2b3c] uppercase tracking-wider mb-2">
                          Upload Technical Drawing
                        </label>
                      <label
                        className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center hover:border-accent transition-colors group cursor-pointer bg-white block"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.jpg,.jpeg"
                          className="hidden"
                          onChange={(e) => updateField("file", e.target.files?.[0] || null)}
                        />
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-accent transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1a2b3c] truncate max-w-[200px]">
                              {fileLabel}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">
                              PDF, JPG, JPEG (Max 10MB)
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>
                      {/* Navigation Buttons */}
          
                  </div>
                  
                </div>
                  <div className="flex items-center justify-end mt-1">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-3 py-2.5 px-10 rounded-xl font-bold transition-all cursor-pointer ${
                  isSubmitting
                    ? "bg-[#f4c1a3] text-white/70 cursor-not-allowed"
                    : "bg-[#f2a67a] text-white hover:bg-[#e89568]"
                }`}
              >
                {isSubmitting ? "Sending..." : "Submit Request"}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
              </div>
            </div>
            {/* Form Divider */}
            <div className="h-[1px] bg-slate-200/50 mt-4 mb-2"></div>
            {/* Catalog Error Moved here if exists */}
            {catalogError && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-bold text-red-600">
                {catalogError}
              </div>
            )}
            {submitStatus.message && (
              <div
                className={`mb-6 rounded-xl px-6 py-4 text-sm font-semibold ${
                  submitStatus.type === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {submitStatus.message}
              </div>
            )}
          
          </div>
        </div>
        {/* Security Footer */}
        <div className="mt-2 flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-2 text-[#1a2b3c]">
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="text-xs font-bold tracking-tight">
              Your information is secure
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium text-center">
            All data is encrypted and handled according to international privacy
            standards. We never share your information with third parties.
          </p>
        </div>
      </div>
    </section>
  );
};
export default QuoteForm;
