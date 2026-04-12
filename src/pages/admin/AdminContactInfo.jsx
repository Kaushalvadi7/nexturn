import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { useToast } from '../../contexts/ToastContext';
import { getContactInfo, saveContactInfo, uploadCompanyProfileForm } from '../../lib/api';

const socialMediaFields = [
  {
    key: 'facebook',
    label: 'Facebook',
    placeholder: 'https://facebook.com/your-page',
    iconPath:
      'M22 12C22 6.477 17.523 2 12 2S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z',
    accentClass: 'from-[#1877F2] to-[#0b5ec7]',
    ringClass: 'focus:ring-[#1877F2]/20 focus:border-[#1877F2]/35',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    placeholder: 'https://instagram.com/your-handle',
    iconPath:
      'M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm8.5 1.8h-8.5A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4zm5.4-2.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z',
    accentClass: 'from-[#fd5949] via-[#d6249f] to-[#285AEB]',
    ringClass: 'focus:ring-[#d6249f]/20 focus:border-[#d6249f]/35',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    placeholder: 'https://linkedin.com/company/your-company',
    iconPath:
      'M6.5 8.5A2.5 2.5 0 1 1 6.5 3.5a2.5 2.5 0 0 1 0 5zM4.25 9.75h4.5v10.5h-4.5V9.75zm6.25 0h4.31v1.43h.06c.6-1.14 2.07-2.34 4.26-2.34 4.55 0 5.39 2.99 5.39 6.88v4.53h-4.5v-4.02c0-1.6-.03-3.66-2.23-3.66-2.24 0-2.58 1.74-2.58 3.54v4.14h-4.5V9.75z',
    accentClass: 'from-[#0A66C2] to-[#004182]',
    ringClass: 'focus:ring-[#0A66C2]/20 focus:border-[#0A66C2]/35',
  },
  {
    key: 'x',
    label: 'X (Twitter)',
    placeholder: 'https://x.com/your-handle',
    iconPath:
      'M18.244 2H21.5l-7.107 8.124L22 22h-5.95l-4.66-6.09L6.063 22H2.805l7.6-8.689L2 2h6.103l4.212 5.553L18.244 2zm-1.142 18h1.8L7.12 3.898H5.19L17.102 20z',
    accentClass: 'from-[#111111] to-[#2f2f2f]',
    ringClass: 'focus:ring-black/20 focus:border-black/30',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    placeholder: 'https://youtube.com/@your-channel',
    iconPath:
      'M23 12.1c0-2.3-.2-3.9-.6-5-.4-1-1.2-1.8-2.2-2.2-1.1-.4-2.7-.6-5-.6h-6.4c-2.3 0-3.9.2-5 .6-1 .4-1.8 1.2-2.2 2.2-.4 1.1-.6 2.7-.6 5s.2 3.9.6 5c.4 1 1.2 1.8 2.2 2.2 1.1.4 2.7.6 5 .6h6.4c2.3 0 3.9-.2 5-.6 1-.4 1.8-1.2 2.2-2.2.4-1.1.6-2.7.6-5zm-13.5 4.2V7.9l7.3 4.2-7.3 4.2z',
    accentClass: 'from-[#FF0000] to-[#c20000]',
    ringClass: 'focus:ring-[#FF0000]/20 focus:border-[#FF0000]/35',
  },
];

const SocialIcon = ({ path }) => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
    <path d={path} />
  </svg>
);

const FieldCard = ({ label, value, onChange, placeholder, type = 'text', isTextArea = false, accentClass = 'from-[#1b365d] to-[#2c4c7c]', ringClass = 'focus:ring-blue-500/10 focus:border-blue-200' }) => (
  <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
    <div className={`h-1 w-full bg-gradient-to-r ${accentClass}`} />
    <div className="p-4 space-y-3">
      <label className="text-xs font-black text-slate-700 uppercase tracking-widest block">
        {label}
      </label>
      {isTextArea ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          className={`w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all resize-none leading-relaxed ${ringClass}`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all ${ringClass}`}
        />
      )}
    </div>
  </div>
);

const EMPTY_FORM = {
  email: '',
  inquiryReceiverEmail: '',
  phone: '',
  whatsapp: '',
  location: '',
  companyDescription: '',
  companyProfile: '',
  facebook: '',
  instagram: '',
  linkedin: '',
  x: '',
  youtube: '',
};

const normalizeForm = (form) => ({
  email: String(form?.email || '').trim(),
  inquiryReceiverEmail: String(form?.inquiryReceiverEmail || '').trim(),
  phone: String(form?.phone || '').trim(),
  whatsapp: String(form?.whatsapp || '').trim(),
  location: String(form?.location || '').trim(),
  companyDescription: String(form?.companyDescription || '').trim(),
  companyProfile: String(form?.companyProfile || '').trim(),
  facebook: String(form?.facebook || '').trim(),
  instagram: String(form?.instagram || '').trim(),
  linkedin: String(form?.linkedin || '').trim(),
  x: String(form?.x || '').trim(),
  youtube: String(form?.youtube || '').trim(),
});

const AdminContactInfo = () => {
  const toast = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [savedForm, setSavedForm] = useState(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const load = async () => {
    setIsLoading(true);
    setFeedback({ type: '', message: '' });
    try {
      const data = await getContactInfo();
      const loadedForm = {
        email: String(data?.email || ''),
        inquiryReceiverEmail: String(data?.inquiryReceiverEmail || ''),
        phone: String(data?.phone || ''),
        whatsapp: String(data?.whatsapp || ''),
        location: String(data?.location || ''),
        companyDescription: String(data?.companyDescription || ''),
        companyProfile: String(data?.companyProfile || ''),
        facebook: String(data?.facebook || ''),
        instagram: String(data?.instagram || ''),
        linkedin: String(data?.linkedin || ''),
        x: String(data?.x || ''),
        youtube: String(data?.youtube || ''),
      };
      setForm(loadedForm);
      setSavedForm(loadedForm);
    } catch (error) {
      setFeedback({ type: 'error', message: error?.message || 'Failed to load contact info.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isDirty = JSON.stringify(normalizeForm(form)) !== JSON.stringify(normalizeForm(savedForm));

  const handleSave = async () => {
    if (!isDirty) return;
    setIsSaving(true);
    setFeedback({ type: '', message: '' });
    try {
      const payload = normalizeForm(form);
      await saveContactInfo(payload);
      toast.success('Edited successfully');
      setFeedback({ type: 'success', message: 'Contact info saved.' });
      setForm(payload);
      setSavedForm(payload);
    } catch (error) {
      toast.error('Failed');
      setFeedback({ type: 'error', message: error?.message || 'Failed to save contact info.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompanyProfileUpload = async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      toast.error('Only PDF files are allowed');
      event.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('PDF size must be 10MB or less');
      event.target.value = '';
      return;
    }

    setIsUploadingProfile(true);
    setFeedback({ type: '', message: '' });

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await uploadCompanyProfileForm(formData);
      const nextUrl = String(response?.companyProfile || '');

      setForm((prev) => ({ ...prev, companyProfile: nextUrl }));
      setSavedForm((prev) => ({ ...prev, companyProfile: nextUrl }));
      setFeedback({ type: 'success', message: 'Company profile PDF uploaded.' });
      toast.success('Company profile uploaded');
    } catch (error) {
      setFeedback({ type: 'error', message: error?.message || 'Failed to upload company profile.' });
      toast.error('Upload failed');
    } finally {
      setIsUploadingProfile(false);
      event.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif]">
      <AdminNavbar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 py-12 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-black font-black text-xs tracking-widest uppercase">
              <span className="material-symbols-outlined text-base text-blue-600">contact_phone</span>
              SITE SETTINGS
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Contact Info</h1>
            <p className="text-black font-medium max-w-2xl leading-relaxed text-sm">
              Update the public contact details used across the website.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isLoading || !isDirty}
            className={`flex items-center justify-center gap-3 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 w-full md:w-auto ${
              isSaving || isLoading || !isDirty
                ? 'bg-blue-400/70 shadow-blue-300/30 cursor-not-allowed'
                : 'bg-[#1b365d] hover:bg-[#2c4c7c] shadow-[#1b365d]/20 cursor-pointer'
            }`}
          >
            <span className="material-symbols-outlined text-xl">{isSaving ? 'sync' : 'save'}</span>
            {isSaving ? 'Saving...' : isDirty ? 'Save' : 'Saved'}
          </button>
        </div>

        {feedback.message && (
          <div
            className={`rounded-2xl border px-6 py-4 text-xs font-bold ${
              feedback.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-2xl bg-white border border-slate-200 px-6 py-4 text-xs font-bold text-slate-500">
            Loading contact info...
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-sm space-y-10">
            <section className="rounded-3xl border border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-6 md:p-8 space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg md:text-xl font-black tracking-tight text-slate-900">Primary Contact</h2>
                <p className="text-xs font-semibold text-slate-500">
                  Business communication details shown across public pages.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FieldCard
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="e.g. sales@nexturnprecision.com"
                />
                <FieldCard
                  label="Inquiry Receiver Email"
                  type="email"
                  value={form.inquiryReceiverEmail}
                  onChange={(e) => updateField('inquiryReceiverEmail', e.target.value)}
                  placeholder="e.g. inquiries@nexturnprecision.com"
                />
                <FieldCard
                  label="Phone Number"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                />
                <FieldCard
                  label="WhatsApp Number"
                  value={form.whatsapp}
                  onChange={(e) => updateField('whatsapp', e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                />
                <div className="lg:col-span-2">
                  <FieldCard
                    label="Company Location"
                    value={form.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="e.g. Plot 123, Industrial Area, City, State, Country"
                    isTextArea
                  />
                </div>
                <div className="lg:col-span-2">
                  <FieldCard
                    label="Company Description"
                    value={form.companyDescription}
                    onChange={(e) => updateField('companyDescription', e.target.value)}
                    placeholder="e.g. Custom metal components manufactured to exact specifications with proven export experience."
                    isTextArea
                  />
                </div>
                <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                  <div className="h-1 w-full bg-gradient-to-r from-[#1b365d] to-[#2c4c7c]" />
                  <div className="p-4 space-y-4">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-widest block">
                      Company Profile (PDF)
                    </label>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <label className="inline-flex items-center justify-center gap-2 bg-[#1b365d] hover:bg-[#2c4c7c] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer transition-all">
                        <span className="material-symbols-outlined text-base">upload_file</span>
                        {isUploadingProfile ? 'Uploading...' : 'Upload PDF'}
                        <input
                          type="file"
                          accept="application/pdf,.pdf"
                          onChange={handleCompanyProfileUpload}
                          disabled={isUploadingProfile}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs font-semibold text-slate-500">
                        Max size: 10MB. Only PDF files are accepted.
                      </p>
                    </div>

                    {form.companyProfile ? (
                      <a
                        href={form.companyProfile}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                        View current company profile PDF
                      </a>
                    ) : (
                      <p className="text-xs font-semibold text-slate-500">No company profile PDF uploaded yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-6 md:p-8 space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg md:text-xl font-black tracking-tight text-slate-900">Social Media</h2>
                <p className="text-xs font-semibold text-slate-500">
                  Add profile URLs for your official platforms.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {socialMediaFields.map((item) => (
                  <div key={item.key} className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                    <div className={`h-1 w-full bg-gradient-to-r ${item.accentClass}`} />
                    <div className="p-4 space-y-3">
                      <label className="flex items-center gap-3 text-xs font-black text-slate-700 uppercase tracking-widest">
                        <span className={`w-8 h-8 rounded-xl bg-gradient-to-br ${item.accentClass} text-white flex items-center justify-center shadow-sm`}>
                          <SocialIcon path={item.iconPath} />
                        </span>
                        {item.label}
                      </label>
                      <input
                        type="url"
                        value={form[item.key]}
                        onChange={(e) => updateField(item.key, e.target.value)}
                        placeholder={item.placeholder}
                        className={`w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all ${item.ringClass}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-10 bg-slate-50 border border-slate-100 rounded-3xl p-5 flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-600">info</span>
              <div className="space-y-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Note</p>
                <p className="text-xs font-bold text-slate-600 leading-relaxed">
                  Changes here update the data stored in the database. Your public pages can read these values to show the
                  latest contact details.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminContactInfo;
