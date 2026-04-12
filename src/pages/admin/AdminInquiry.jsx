import React, { useEffect, useMemo, useState } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { useToast } from '../../contexts/ToastContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { deleteInquiry, getInquiries, updateInquiry } from '../../lib/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';

const AdminInquiry = () => {
  const toast = useToast();
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const generatePDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12;
    const contentWidth = pageWidth - (margin * 2);

    filteredInquiries.forEach((inq, index) => {
      if (index > 0) doc.addPage();
      
      // 1. Premium Background Layer (Subtle Gradient effect)
      doc.setFillColor(252, 252, 254); 
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Decorative blurred shapes (Simulated with light color rects)
      doc.setFillColor(240, 244, 255);
      doc.roundedRect(-20, -20, 100, 100, 50, 50, 'F');
      doc.setFillColor(255, 248, 240);
      doc.roundedRect(pageWidth - 60, pageHeight - 60, 100, 100, 50, 50, 'F');

      // --- 2. HEADER (Letterhead) ---
      const companyName = "NEXTURN COMPONENTCRAFT PVT. LTD.";
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20); // Increased slightly for visibility
      
      // Calculate widths to perfectly center logo + text as a single inline group
      const textWidth = doc.getTextWidth(companyName);
      const logoWidth = 19; 
      const logoHeight = 16;
      const spacing = 5; // Distance between logo and text
      const totalWidth = logoWidth + spacing + textWidth;
      const startX = (pageWidth - totalWidth) / 2;

      try {
        doc.addImage(
          '/images/Screenshot_2026-03-18_182531-removebg-preview.png', 
          startX, 
          7.4, 
          logoWidth, 
          logoHeight
        );
      } catch (e) {}

      doc.setTextColor(17, 24, 39);
      // Place the text directly to the right of the perfectly centered logo
      doc.text(companyName, startX + logoWidth + spacing, 18.5);
      
      // Increased line visibility (darker and thicker)
      doc.setDrawColor(100, 116, 139); // Slate-500
      doc.setLineWidth(1);
      
      // Increase header height by pushing line down ~20%
      doc.line(margin, 28, pageWidth - margin, 28);
      
      doc.setLineWidth(1); // Reset for later use

      let y = 35; // Moved content start down 20% from y=30

      // 3. Document Title / Header Banner
      doc.setFillColor(31, 41, 55); // Dark Slate header band
      doc.rect(margin, y, contentWidth, 12, 'F');
      
      const badgeText = (inq.type || 'INQUIRY').toUpperCase();
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`OFFICIAL ${badgeText} RECORD`, margin + 4, y + 8);
      
      doc.setFontSize(8);
      doc.text(`DATE: ${formatDate(inq.date)}`, pageWidth - margin - 4, y + 8, { align: 'right' });
      
      y += 24;

      // Inquiry Main Info (Company Name)
      doc.setTextColor(15, 23, 42); // Gray 900
      doc.setFontSize(18);
      doc.text(inq.company || 'N/A', margin, y);
      
      doc.setTextColor(100, 116, 139); // Gray 500
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Location: ${inq.country || 'Global'}`, pageWidth - margin, y, { align: 'right' });
      
      y += 12;

      // Helper function for sub-section banners
      const drawSectionBanner = (title, currentY) => {
        doc.setFillColor(241, 245, 249); // light slate background
        doc.rect(margin, currentY, contentWidth, 9, 'F');
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(title.toUpperCase(), margin + 4, currentY + 6.5);
        return currentY + 16;
      };

      // Helper function for left/right tabular data rows
      const drawDataRow = (lbl1, val1, lbl2, val2, currentY, isEmail = false) => {
        const halfW = contentWidth / 2;
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 116, 139);
        doc.text(lbl1, margin + 4, currentY);
        doc.text(lbl2, margin + halfW + 4, currentY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        
        // Col 1 Value
        const str1 = String(val1 || 'N/A');
        if (isEmail && val1 && val1 !== 'N/A') {
          doc.setTextColor(37, 99, 235);
          doc.text(str1, margin + 4, currentY + 6);
          doc.link(margin + 4, currentY + 2, doc.getTextWidth(str1), 5, { url: `mailto:${val1}` });
        } else {
          doc.setTextColor(15, 23, 42);
          doc.text(str1, margin + 4, currentY + 6);
        }
        
        // Col 2 Value
        doc.setTextColor(15, 23, 42);
        doc.text(String(val2 || 'N/A'), margin + halfW + 4, currentY + 6);
        
        // Thin horizontal divider
        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.5);
        doc.line(margin, currentY + 12, pageWidth - margin, currentY + 12);
        
        return currentY + 20;
      };

      // SECTION 1: CLIENT PROFILE
      y = drawSectionBanner('1. Client Profile', y);
      y = drawDataRow('CONTACT PERSON', inq.person, 'PHONE NUMBER', inq.phone, y);
      y = drawDataRow('EMAIL ADDRESS', inq.email, 'SOURCE', 'Automated Web Form', y, true);
      y += 4;

      // SECTION 2: TECHNICAL SPECIFICATIONS
      y = drawSectionBanner('2. Technical Specifications', y);
      y = drawDataRow('REQUEST CATEGORY', inq.category_name, 'QUANTITY REQUIRED', inq.details?.quantity, y);
      y = drawDataRow('TOLERANCE LEVEL', inq.details?.tolerance, 'CURRENT STATUS', inq.status, y);
      y += 4;

      // SECTION 3: SUPPORTING DOCUMENTS
      y = drawSectionBanner('3. Supporting Documents', y);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text('ATTACHED FILE NAME', margin + 4, y);
      
      const imageUrl = inq.images?.[0]?.image_url;
      const fName = imageUrl ? imageUrl.split("/").pop() : 'No Uploads';
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      if (imageUrl) {
        doc.setTextColor(37, 99, 235);
        const nameToPrint = doc.splitTextToSize(fName, contentWidth - 10).join(' ');
        doc.text(nameToPrint, margin + 4, y + 6);
        doc.link(margin + 4, y + 2, doc.getTextWidth(nameToPrint), 5, { url: imageUrl });
      } else {
        doc.setTextColor(15, 23, 42);
        doc.text(fName, margin + 4, y + 6);
      }
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.5);
      doc.line(margin, y + 12, pageWidth - margin, y + 12);
      y += 24;

      // SECTION 4: ADDITIONAL REQUIREMENTS
      y = drawSectionBanner('4. Additional Requirements / Notes', y);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      
      const reqTxt = inq.details?.requirements || inq.message || 'No additional requirements provided.';
      const splitReqLines = doc.splitTextToSize(`"${reqTxt}"`, contentWidth - 8);
      
      const reqBoxHeight = (splitReqLines.length * 5) + 6;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin, y, contentWidth, reqBoxHeight, 2, 2, 'FD');
      
      doc.text(splitReqLines, margin + 4, y + 7);

      // 5. Footer Letterhead Branding
      // Increased footer line visibility to match header
      doc.setDrawColor(100, 116, 139); // Slate-500
      doc.setLineWidth(1); // Match header thickness
      doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);

      // Re-adjust for footer text
      doc.setFont('helvetica', 'bold'); // Made slightly bolder for efficiency
      doc.setFontSize(8);
      doc.setTextColor(17, 24, 39); // Visibly darker text
      
      // Company Email
      doc.text("info@nexturn.com", margin, pageHeight - 12);
      
      // Page Number
      doc.text(`Page ${index + 1} of ${filteredInquiries.length}`, pageWidth - margin, pageHeight - 12, { align: 'right' });
    });

    return doc;
  };

  const handlePreviewPdf = () => {
    const doc = generatePDF();
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    setShowExportModal(true);
  };

  const handleDownloadPdf = () => {
    const doc = generatePDF();
    doc.save(`Nexturn_Inquiries_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleDownloadExcel = () => {
    const data = filteredInquiries.map(inq => ({
      ID: inq.id,
      Date: formatDate(inq.date),
      Company: inq.company,
      'Contact Person': inq.person,
      Email: inq.email,
      Phone: inq.phone,
      Country: inq.country,
      Category: inq.category_name,
      Quantity: inq.details?.quantity || 'N/A',
      Tolerance: inq.details?.tolerance || 'N/A',
      Requirements: inq.details?.requirements || inq.message || 'N/A',
      'Attachment URL': inq.images?.[0]?.image_url || 'N/A',
      Status: inq.status
    }));

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Inquiries");
    
    // Set column widths for better readability
    const wscols = [
      {wch: 10}, {wch: 15}, {wch: 25}, {wch: 20}, {wch: 25}, 
      {wch: 15}, {wch: 15}, {wch: 20}, {wch: 10}, {wch: 15}, 
      {wch: 50}, {wch: 60}, {wch: 10}
    ];
    worksheet['!cols'] = wscols;

    writeFile(workbook, `Nexturn_Inquiries_Dataset_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const [dateFilter, setDateFilter] = useState(() => {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 14);
    const formatDate = (value) => value.toISOString().split('T')[0];
    return {
      start: formatDate(startDate),
      end: formatDate(today),
    };
  });

  useEffect(() => {
    let isActive = true;
    const fetchInquiries = async () => {
      setIsLoading(true);
      setLoadError("");
      try {
        const data = await getInquiries();
        if (isActive) {
          setInquiries(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (isActive) {
          setLoadError(error?.message || "Unable to load inquiries.");
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchInquiries();
    return () => {
      isActive = false;
    };
  }, []);

  const parseDetails = (message = "") => {
    const details = {};
    message
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => {
        const idx = line.indexOf(":");
        if (idx === -1) return;
        const key = line.slice(0, idx).trim().toLowerCase();
        const value = line.slice(idx + 1).trim();
        if (key) details[key] = value;
      });
    return details;
  };

  const formatDate = (value) => {
    if (!value) return "N/A";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "N/A";
    return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const withDerivedFields = useMemo(() => {
    return inquiries.map((inq) => {
      const created = inq.created_at ? new Date(inq.created_at) : new Date();
      const date = created ? created.toISOString().split("T")[0] : "";
      const details = parseDetails(inq.message || "");
      return {
        ...inq,
        date,
        status: inq.is_viewed ? "SEEN" : "UNSEEN",
        details,
        type: inq.category_name || inq.subject || "Inquiry",
        company: inq.company_name || "N/A",
        person: inq.full_name || "N/A",
        country: details.country || "N/A",
      };
    });
  }, [inquiries]);

  // Analytics Calculation
  const chartData = useMemo(() => {
    const dates = {};
    const start = new Date(dateFilter.start);
    const end = new Date(dateFilter.end);
    
    // Fill all dates in range with 0
    let current = new Date(start);
    while (current <= end) {
      const dStr = current.toISOString().split('T')[0];
      dates[dStr] = 0;
      current.setDate(current.getDate() + 1);
    }

    // Count inquiries per day
    withDerivedFields.forEach(inq => {
      if (dates[inq.date] !== undefined) {
        dates[inq.date] += 1;
      }
    });

    return Object.keys(dates).sort().map(date => ({
      name: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      count: dates[date]
    }));
  }, [withDerivedFields, dateFilter]);

  const filteredInquiries = useMemo(() => {
    return withDerivedFields.filter((inq) => {
      if (!inq.date) return true;
      return inq.date >= dateFilter.start && inq.date <= dateFilter.end;
    });
  }, [withDerivedFields, dateFilter]);

  const handleOpenInquiry = async (inq) => {
    const nextInquiry = inq.status === 'UNSEEN' ? { ...inq, status: 'SEEN' } : inq;
    setSelectedInquiry(nextInquiry);
    if (inq.status === 'UNSEEN') {
      setInquiries((prev) =>
        prev.map((item) => (item.id === inq.id ? { ...item, is_viewed: true } : item))
      );
      try {
        await updateInquiry(inq.id, { is_viewed: true });
        toast.success("Edited successfully");
      } catch (error) {
        toast.error("Failed");
        setLoadError(error?.message || "Unable to update inquiry status.");
      }
    }
  };

  const handleDiscardInquiry = async () => {
    if (!selectedInquiry) return;
    const id = selectedInquiry.id;
    try {
      await deleteInquiry(id);
      setInquiries((prev) => prev.filter((item) => item.id !== id));
      toast.success("Deleted successfully");
      setSelectedInquiry(null);
    } catch (error) {
      toast.error("Failed");
      setLoadError(error?.message || "Unable to discard inquiry.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif]">
      <AdminNavbar />
      
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 py-12 space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-black font-black text-xs tracking-widest uppercase">
               <span className="material-symbols-outlined text-base">mail</span>
               INCOMING REQUESTS
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Client Inquiries Hub</h1>
            <p className="text-black font-medium max-w-2xl leading-relaxed text-sm">
              Review and manage technical specifications from potential global clients.
            </p>
          </div>
        </div>
          
        {/* Analytics Card & Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Chart Section */}
           <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                 <div className="space-y-1 w-full sm:w-auto">
                    <h3 className="text-xl font-black text-black leading-tight sm:leading-none">Inquiry Volume Trends</h3>
                    <p className="text-xs font-black text-black/40 uppercase tracking-widest leading-none pt-1">Daily Arrival Velocity</p>
                 </div>
                 <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100 w-full sm:w-auto">
                    <div className="flex items-center justify-between xs:justify-start gap-2 px-4 py-2 xs:py-0 xs:border-r border-slate-200">
                       <span className="text-xs font-black text-black/50 uppercase">Start:</span>
                       <input 
                        type="date"
                        value={dateFilter.start}
                        onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
                        className="bg-transparent border-none outline-none text-xs font-black text-black cursor-pointer text-right xs:text-left" 
                       />
                    </div>
                    <div className="flex items-center justify-between xs:justify-start gap-2 px-4 py-2 xs:py-0">
                       <span className="text-xs font-black text-black/50 uppercase">End:</span>
                       <input 
                        type="date"
                        value={dateFilter.end}
                        onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
                        className="bg-transparent border-none outline-none text-xs font-black text-black cursor-pointer text-right xs:text-left" 
                       />
                    </div>
                 </div>
              </div>

              <div className="h-[280px] w-full pr-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                       <defs>
                          <linearGradient id="colorInq" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 9, fontWeight: 900, fill: '#64748b'}} 
                        dy={10}
                       />
                       <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 9, fontWeight: 900, fill: '#64748b'}} 
                        dx={-10}
                       />
                       <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: '900' }}
                       />
                       <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#2563eb" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorInq)" 
                        animationDuration={1500}
                       />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Stats Summary Panel */}
           <div className="space-y-6">
              <div className="bg-[#1b365d] rounded-[2.5rem] p-8 text-white shadow-xl shadow-[#1b365d]/20 relative overflow-hidden group">
                 <div className="relative z-10 space-y-1">
                    <p className="text-xs font-black text-blue-200/50 uppercase tracking-[0.2em]">Total Lifecycle</p>
                    <h4 className="text-4xl font-black">{inquiries.length}</h4>
                    <p className="text-xs font-bold text-blue-200 uppercase tracking-widest pt-2">Global Inquiries</p>
                 </div>
                 <div className="absolute -bottom-6 -right-6 text-white/5 opacity-10 transition-transform group-hover:scale-110 duration-700">
                    <span className="material-symbols-outlined text-9xl">analytics</span>
                 </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm space-y-6">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                       <span className="text-xs font-black text-black/50 uppercase">Today's Arrival</span>
                       <span className="text-sm font-black text-black">{withDerivedFields.filter(i => i.date === new Date().toISOString().split('T')[0]).length} New</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                       <span className="text-xs font-black text-black/50 uppercase">Awaiting Review</span>
                       <span className="text-sm font-black text-blue-600">{withDerivedFields.filter(i => i.status === 'UNSEEN').length} Leads</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-black text-black/50 uppercase">Processed</span>
                       <span className="text-sm font-black text-slate-400">{withDerivedFields.filter(i => i.status === 'SEEN').length} Handled</span>
                    </div>
                 </div>
                 <button 
                  onClick={handlePreviewPdf}
                  className="w-full bg-slate-50 text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all cursor-pointer"
                 >
                    Export Dataset
                 </button>
              </div>
           </div>
        </div>

        {/* Inquiry List Area */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          {loadError && (
            <div className="px-8 py-6 text-sm font-semibold text-red-600 bg-red-50 border-b border-red-100">
              {loadError}
            </div>
          )}

          {isLoading ? (
            <div className="px-8 py-12 text-center text-sm font-semibold text-slate-500">
              Loading inquiries...
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="px-8 py-12 text-center text-sm font-semibold text-slate-500">
              No inquiries found for this date range.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-8 py-5 text-xs font-black text-black/50 uppercase tracking-widest">Company</th>
                    <th className="px-8 py-5 text-xs font-black text-black/50 uppercase tracking-widest">Inquiry Type</th>
                    <th className="px-8 py-5 text-xs font-black text-black/50 uppercase tracking-widest">Contact Person</th>
                    <th className="px-8 py-5 text-xs font-black text-black/50 uppercase tracking-widest">Date Sent</th>
                    <th className="px-8 py-5 text-xs font-black text-black/50 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-xs font-black text-black/50 uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredInquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="font-black text-black text-sm">{inq.company}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex flex-col gap-1">
                           <span className="px-3 py-1 bg-blue-50 text-black text-xs font-black rounded-lg uppercase tracking-wider">
                             {inq.category_name || 'General'}
                           </span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-slate-700 text-sm">{inq.person}</span>
                          <span className="text-xs font-medium text-black/50 uppercase">{inq.country || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                      <span className="text-sm font-bold text-black uppercase">{formatDate(inq.date)}</span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${inq.status === 'UNSEEN' ? 'bg-blue-600 animate-pulse' : 'bg-slate-300'}`}></div>
                            <span className={`text-xs font-black uppercase tracking-widest ${inq.status === 'UNSEEN' ? 'text-black' : 'text-black/50'}`}>
                              {inq.status}
                            </span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <button 
                          onClick={() => handleOpenInquiry(inq)}
                          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95 cursor-pointer"
                         >
                           View Details
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detailed Modal (when an inquiry is selected) */}
        {selectedInquiry && (
          <div className="fixed inset-0 bg-[#1b365d]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
             <div className="bg-white rounded-none w-full max-w-4xl max-h-[77vh] overflow-y-auto shadow-2xl relative p-8 md:p-12 space-y-10 animate-in zoom-in-95 duration-300">
                <button 
                  onClick={() => setSelectedInquiry(null)}
                  className="absolute top-8 right-8 w-12 h-12 bg-slate-50 rounded-none flex items-center justify-center text-black/50 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined font-black">close</span>
                </button>

                <div className="flex flex-col md:flex-row items-start justify-between gap-8 border-b border-slate-100 pb-10">
                   <div className="space-y-3">
                      <div className="flex items-center gap-2 text-black font-black text-xs tracking-widest uppercase mb-1">
                        <span className="material-symbols-outlined text-sm">business</span>
                        {selectedInquiry.type} Request
                      </div>
                      <h2 className="text-3xl font-black text-black tracking-tight leading-none">{selectedInquiry.company}</h2>
                      <p className="text-black/50 font-bold text-xs uppercase tracking-widest flex items-center gap-4 py-1">
                         <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">event</span> {formatDate(selectedInquiry.date)}</span>
                         <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">public</span> {selectedInquiry.country || 'N/A'}</span>
                      </p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
                   {/* Personal Info */}
                   <div className="space-y-6">
                      <h4 className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] border-b border-blue-50 pb-2">Client Profile</h4>
                      <div className="space-y-5">
                         <div>
                            <p className="text-xs font-black text-black/50 uppercase mb-1.5">Contact Person</p>
                            <p className="text-sm font-bold text-slate-800">{selectedInquiry.person}</p>
                         </div>
                         <div>
                            <p className="text-xs font-black text-black/50 uppercase mb-1.5">Email Address</p>
                            <p className="text-sm font-bold text-black underline">{selectedInquiry.email || 'N/A'}</p>
                         </div>
                         <div>
                            <p className="text-xs font-black text-black/50 uppercase mb-1.5">Phone Number</p>
                            <p className="text-sm font-bold text-slate-800">{selectedInquiry.phone || 'N/A'}</p>
                         </div>
                      </div>
                   </div>

                   {/* Technical Specs */}
                   <div className="space-y-6">
                      <h4 className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] border-b border-blue-50 pb-2">Technical Specs</h4>
                     <div className="space-y-5">
                         <div>
                            <p className="text-xs font-black text-black/50 uppercase mb-1.5">Category</p>
                            <p className="text-sm font-bold text-slate-800">{selectedInquiry.category_name || 'N/A'}</p>
                         </div>
                         <div>
                            <p className="text-xs font-black text-black/50 uppercase mb-1.5">Quantity Required</p>
                            <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">
                              {selectedInquiry.details?.quantity || 'N/A'}
                            </span>
                         </div>
                         <div>
                            <p className="text-xs font-black text-black/50 uppercase mb-1.5">Tolerance Required</p>
                            <p className="text-sm font-bold text-slate-800 uppercase tracking-tighter">
                              {selectedInquiry.details?.tolerance || 'N/A'}
                            </p>
                         </div>
                      </div>
                   </div>

                   {/* Attachment */}
                   <div className="space-y-6">
                      <h4 className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] border-b border-blue-50 pb-2">Technical Support</h4>
                      <div className="space-y-5">
                         <div className="p-5 border border-slate-100 rounded-3xl bg-slate-50/50 space-y-4">
                            <p className="text-xs font-black text-black/50 uppercase mb-3">Supporting Files</p>
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black shadow-sm">
                                  <span className="material-symbols-outlined text-xl">description</span>
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-sm font-black text-slate-700 truncate max-w-[120px]">
                                    {selectedInquiry.images?.[0]?.image_url
                                      ? selectedInquiry.images[0].image_url.split("/").pop()
                                      : "No file uploaded"}
                                  </span>
                                  {selectedInquiry.images?.[0]?.image_url ? (
                                    <a
                                      href={selectedInquiry.images[0].image_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-xs font-black text-black uppercase text-left hover:underline"
                                    >
                                      Download File
                                    </a>
                                  ) : (
                                    <span className="text-xs font-black text-black/40 uppercase text-left">No download</span>
                                  )}
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-blue-50/30 p-8 rounded-[2rem] border border-blue-100/50 space-y-4">
                   <h4 className="text-xs font-black text-black/50 uppercase tracking-widest">Additional Requirements</h4>
                   <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                      "{selectedInquiry.details?.requirements || selectedInquiry.message || 'No additional requirements provided.'}"
                   </p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                   {/* <button className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] cursor-pointer">
                      Mark as Proccessed
                   </button> */}
                   <button
                     onClick={handleDiscardInquiry}
                     className="bg-slate-100 text-black/50 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all active:scale-[0.98] cursor-pointer"
                   >
                     Discard
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* PDF Export Preview Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center pt-24 pb-6 px-4 animate-in fade-in duration-300">
             <div className="bg-white rounded-[2.5rem] w-full max-w-6xl h-full overflow-hidden shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-300">
                {/* Modal Header */}
                <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                   <div className="space-y-1">
                      <h3 className="text-xl sm:text-2xl font-black text-black leading-tight">Inquiry Dataset Preview</h3>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-[0.15em] leading-relaxed">
                        Previewing {filteredInquiries.length} inquiries based on active filters
                      </p>
                   </div>
                   <div className="flex flex-wrap items-center gap-3">
                      <button 
                        onClick={handleDownloadExcel}
                        className="flex-1 sm:flex-none justify-center bg-emerald-600 text-white px-4 sm:px-6 py-3 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2"
                      >
                         <span className="material-symbols-outlined text-sm">table_view</span>
                         Export Excel
                      </button>
                      <button 
                        onClick={handleDownloadPdf}
                        className="flex-1 sm:flex-none justify-center bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2"
                      >
                         <span className="material-symbols-outlined text-sm">download</span>
                         Official PDF
                      </button>
                      <button 
                        onClick={() => {
                          setShowExportModal(false);
                          if (pdfUrl) URL.revokeObjectURL(pdfUrl);
                          setPdfUrl(null);
                        }}
                        className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all shrink-0"
                      >
                         <span className="material-symbols-outlined font-black">close</span>
                      </button>
                   </div>
                </div>

                {/* PDF Viewer Area (Native Browser Handler) */}
                <div className="flex-1 bg-slate-100 p-2 md:p-6 overflow-hidden relative">
                   {pdfUrl ? (
                     <>
                       {/* Desktop / Large Screen: Standard Iframe */}
                       <iframe 
                         src={`${pdfUrl}#view=FitH&toolbar=1&navpanes=0&scrollbar=1`} 
                         className="w-full h-full rounded-2xl shadow-inner border border-slate-200 bg-white hidden sm:block"
                         title="Official PDF Export Preview"
                       />
                       
                       {/* Mobile Screen: Fallback UI (Native browsers often block inline blobs) */}
                       <div className="sm:hidden w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
                          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 animate-in fade-in zoom-in duration-500">
                             <span className="material-symbols-outlined text-4xl">picture_as_pdf</span>
                          </div>
                          <div className="space-y-2">
                             <h4 className="text-xl font-black text-slate-800">Preview is Ready</h4>
                             <p className="text-[10px] font-black text-slate-500 leading-relaxed uppercase tracking-[0.15em] max-w-[240px] mx-auto">
                                Mobile browsers require documents to be opened in a dedicated view for security and clarity.
                             </p>
                          </div>
                          <a 
                            href={pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all flex items-center gap-2 active:scale-95"
                          >
                             <span className="material-symbols-outlined text-sm">open_in_new</span>
                             Open Full Preview
                          </a>
                       </div>
                     </>
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                        Generating High-Fidelity PDF...
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminInquiry;
