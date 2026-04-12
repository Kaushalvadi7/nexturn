import React, {  useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useContactInfo } from "./contactInfo";
import LeadCaptureModal from "./LeadCaptureModal";
import BookPreviewModal from "./BookPreviewModal";
import { createDownloadLead } from "../../lib/api";

const CTACatalogueSection = () => {
  const { hrefs } = useContactInfo();
  const sectionRef = useRef(null);
  
  const [leadModal, setLeadModal] = useState({ open: false, asset: "" });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState("");
  const [downloadNoticeType, setDownloadNoticeType] = useState("success");
  const [isLeadSubmitting, setIsLeadSubmitting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const openLeadModal = (asset) => {
    setDownloadNotice("");
    setDownloadNoticeType("success");
    setLeadModal({ open: true, asset, token: Date.now() });
  };

  const handleLeadConfirm = async ({ name, email }) => {
    const assetToPreview = leadModal.asset;
    if (!assetToPreview) return;
    console.log("Lead confirmed for asset:", assetToPreview);
    setIsLeadSubmitting(true);
    setDownloadNotice("");
    setDownloadNoticeType("success");

    try {
      await createDownloadLead({ name, email, asset: assetToPreview });
      setLeadModal({ open: false, asset: "" });
      setDownloadNotice(`Thanks ${name}! Your download will start now.`);
      setDownloadNoticeType("success");
      setTimeout(() => setDownloadNotice(""), 6000);

      if (assetToPreview === "company_profile") {
        console.log("Triggering preview for company_profile...");
        setTimeout(() => {
          setIsPreviewOpen(true);
        }, 600);
      }
    } catch (error) {
      console.error("Failed to record download lead", error);
      setDownloadNotice("Unable to show company's profile now.");
      setDownloadNoticeType("error");
      setTimeout(() => {
        setDownloadNotice("");
      }, 6000);
    } finally {
      setIsLeadSubmitting(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const viewportConfig = { once: true, amount: 0.3 };

  return (
    <section 
      ref={sectionRef}
      className="w-full bg-[#f8fafc] py-4 px-4 sm:px-8 lg:px-12 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="cta-catalogue-section-card relative overflow-hidden mx-auto max-w-[1440px] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
        style={{
          background: "#051124",
          padding: "30px 40px",
        }}
      >
        {/* Cursor Glow Effect (Hidden on Mobile) */}
        <div 
          className="hidden md:block absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(245, 166, 35, 0.06), transparent 60%)`,
            zIndex: 1
          }}
        ></div>

        {/* Mobile Styles and Responsive Grid Override */}
        <style>{`
          @media (max-width: 1024px) {
            .cta-catalogue-grid {
               grid-template-columns: 1fr !important;
            }
            .cta-catalogue-divider-vert {
              display: none !important;
            }
             .cta-catalogue-divider-horiz {
              display: block !important;
              height: 1px;
              background: rgba(255, 255, 255, 0.15);
              margin: 40px 0;
              width: 100% !important;
            }
          }
          @media (max-width: 767px) {
            .cta-catalogue-section-card {
              padding: 40px 24px !important;
            }
            .cta-catalogue-title-left {
              font-size: 23.8px !important;
            }
            .cta-catalogue-title-right {
              font-size: 18.7px !important;
            }
            .cta-catalogue-label {
              font-size: 9.35px !important;
            }
            .cta-catalogue-subtitle {
              font-size: 11.9px !important;
            }
            .cta-catalogue-desc {
              font-size: 11px !important;
            }
            .catalogue-image-wrapper {
               float: right;
               width: 80px !important;
            }
            .feature-cards-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

        <div 
          className="cta-catalogue-grid grid w-full items-center relative z-[2]"
          style={{
            gridTemplateColumns: "1.4fr auto 1fr",
            gap: "0",
          }}
        >

          {/* LEFT COLUMN */}
          <div className="flex flex-col items-start relative z-[2]">
            <motion.span 
              className="cta-catalogue-label mb-3"
              style={{
                fontSize: "11px",
                letterSpacing: "3px",
                color: "#f5a623",
                fontWeight: "600",
                textTransform: "uppercase",
                display: "inline-block",
              }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportConfig}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            >
              GET IN TOUCH
            </motion.span>
            
            <motion.h2 
              className="cta-catalogue-title-left mb-3"
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#ffffff",
                lineHeight: "1.3",
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              Ready to Start Your Success Story?
            </motion.h2>
            
            <motion.p 
              className="cta-catalogue-subtitle mb-8"
              style={{
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.65)",
                lineHeight: "1.6",
                maxWidth: "500px",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
            >
              Join our growing list of satisfied international clients. 
              Let's discuss how we can solve your precision metal component challenges.
            </motion.p>

            {/* Feature Cards Section */}
            <div className="feature-cards-grid grid grid-cols-3 gap-4 w-full mb-10">
               {[
                 { 
                   icon: "schedule", 
                   title: "24-Hour Response", 
                   desc: "QUICK TURNAROUND ON ALL INQUIRIES", 
                   delay: 0.4 
                 },
                 { 
                   icon: "engineering", 
                   title: "Technical Support", 
                   desc: "EXPERT GUIDANCE THROUGHOUT THE PROCESS", 
                   delay: 0.55 
                 },
                 { 
                   icon: "verified", 
                   title: "Quality Guaranteed", 
                   desc: "100% INSPECTION AND DOCUMENTATION", 
                   delay: 0.7 
                 }
               ].map((card, idx) => (
                  <motion.div 
                    key={idx}
                    className="flex flex-col items-center text-center p-5 rounded-2xl cursor-default"
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      position: "relative",
                    }}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportConfig}
                    transition={{ duration: 0.5, ease: "easeOut", delay: card.delay }}
                    whileHover="hover"
                  >
                    <motion.div
                       className="absolute inset-0 rounded-2xl pointer-events-none"
                       variants={{
                         hover: {
                           backgroundColor: "rgba(245,166,35,0.08)",
                           borderColor: "rgba(245,166,35,0.4)",
                         }
                       }}
                       style={{ border: "1px solid transparent",  transition: { duration: 0.25 } }}
                       initial={false}
                    />
                    <motion.div
                       variants={{
                         hover: { y: -6, scale: 1.02 }
                       }}
                       transition={{ duration: 0.25, ease: "easeOut" }}
                       className="w-full flex flex-col items-center"
                    >
                      <motion.div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mb-4 relative"
                        style={{ background: "#f5a623" }}
                        variants={{
                          hover: {
                            scale: 1.15,
                            rotate: 10,
                          }
                        }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                      >
                        {/* Pulse ring heartbeat */}
                        <motion.div
                          className="absolute inset-0 rounded-full border border-[#f5a623]"
                          animate={{
                            scale: [1, 1.4, 1],
                            opacity: [0.4, 0, 0.4],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        <span className="material-symbols-outlined text-white" style={{ fontSize: "20px" }}>{card.icon}</span>
                      </motion.div>
                      <h4 className="text-white text-sm font-bold mb-2">{card.title}</h4>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider leading-relaxed">
                        {card.desc}
                      </p>
                    </motion.div>
                  </motion.div>
               ))}
            </div>

            {/* Buttons Row */}
            <div className="flex flex-row gap-2 sm:gap-4 pt-1">
              <Link
                to="/contact-us#quote-form"
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 bg-[#f5a623] hover:bg-orange-700 text-white px-3 py-3.5 sm:px-8 sm:py-4 rounded-lg font-semibold text-sm sm:text-lg shadow-xl shadow-orange-900/20 hover:shadow-orange-500/40 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl sm:text-2xl">description</span>
                <span className="whitespace-nowrap">Request Quote</span>
              </Link>
              <a
                href={hrefs.whatsapp || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 bg-transparent hover:bg-white/10 border-2 border-slate-400 hover:border-white text-white px-3 py-3.5 sm:px-8 sm:py-4 rounded-lg font-semibold text-sm sm:text-lg transition-all duration-300 cursor-pointer"
              >
                <svg
                  className="w-6 h-6 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.89 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* CENTER DIVIDER */}
          <motion.div 
            className="cta-catalogue-divider-vert mx-14 self-center"
            style={{
              width: "1px",
              height: "180px",
              background: "linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.2) 30%, rgba(245, 166, 35, 0.5) 50%, rgba(255, 255, 255, 0.2) 70%, transparent)",
              transformOrigin: "top center",
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={viewportConfig}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          ></motion.div>

          {/* Mobile Horizontal Divider */}
          <div className="cta-catalogue-divider-horiz hidden"></div>

          {/* RIGHT COLUMN */}
          <div className="flex items-center gap-6 relative z-[2]">
            <div className="flex flex-col flex-1">
              <motion.span 
                className="cta-catalogue-label mb-2"
                style={{
                  fontSize: "11px",
                  letterSpacing: "3px",
                  color: "#f5a623",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  display: "inline-block",
                }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportConfig}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {/* FREE DOWNLOAD */}
              </motion.span>

              <motion.h2 
                className="cta-catalogue-title-right mb-2"
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "#ffffff",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Download Company Profile
              </motion.h2>

              <motion.p 
                className="cta-catalogue-desc mb-5"
                style={{
                  fontSize: "13px",
                  color: "rgba(255, 255, 255, 0.6)",
                  lineHeight: "1.6",
                  maxWidth: "300px",
                }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                We recommend downloading the latest catalog from our website for the
                most recent product updates and all information regarding our company.
              </motion.p>

              <motion.button
                onClick={() => openLeadModal("company_profile")}
                className="group flex items-center gap-2 w-fit relative"
                style={{
                  background: "transparent",
                  color: "#f5a623",
                  fontSize: "13px",
                  fontWeight: "700",
                  letterSpacing: "1.5px",
                  padding: "10px 0",
                  border: "none",
                  cursor: "pointer",
                }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ duration: 0.5, delay: 0.7 }}
                whileHover="hover"
              >
                COMPANY PROFILE
                <motion.span 
                  className="material-symbols-outlined" 
                  style={{ fontSize: "16px" }}
                  variants={{ hover: { x: 5 } }}
                  transition={{ duration: 0.2 }}
                >
                  download
                </motion.span>
                {/* Underline animation */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] bg-[#f5a623] w-full"
                  style={{ transformOrigin: "left" }}
                  initial={{ scaleX: 0.6 }}
                  variants={{ hover: { scaleX: 1 } }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
              
              {downloadNotice && (
                <p className={`mt-4 text-[11px] font-bold uppercase tracking-widest ${
                  downloadNoticeType === "error" ? "text-red-400" : "text-[#f5a623] animate-pulse"
                }`}>
                  {downloadNotice}
                </p>
              )}
            </div>

            <motion.div 
              className="catalogue-image-wrapper relative flex-shrink-0"
              initial={{ opacity: 0, x: 40, rotate: 0 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={viewportConfig}
              transition={{ 
                duration: 0.8, 
                ease: [0.34, 1.56, 0.64, 1],
                delay: 0.6 
              }}
              animate={{
                y: [0, -6, 0],
                rotate: [0, 0, 0],
              }}
              whileHover={{
                rotate: 0,
                scale: 1.1,
                y: -8,
                filter: "drop-shadow(0 24px 40px rgba(0,0,0,0.6))",
              }}
            >
              <img
                src="/company_profile.png"
                alt="Nexturn Catalogue"
                onClick={() => openLeadModal("company_profile")}
                style={{
                  width: "160px",
                  filter: "drop-shadow(0 16px 32px rgba(0, 0, 0, 0.4))",
                  zIndex: 2,
                  position: "relative",
                  transform: "inherit",
                  cursor: "pointer",
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* BOTTOM ACCENT BAR */}
        <motion.div 
          className="mt-8"
          style={{
            height: "3px",
            background: "linear-gradient(to right, transparent, #f5a623 20%, #f5a623 80%, transparent)",
            width: "60%",
            margin: "40px auto 0",
            transformOrigin: "center",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={viewportConfig}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
        />
      </div>

      <LeadCaptureModal
        key={leadModal.token || "lead-modal"}
        isOpen={leadModal.open}
        title={leadModal.asset === "company_profile" ? "Download Company Profile" : "Download Catalogue"}
        onClose={() => setLeadModal({ open: false, asset: "" })}
        onConfirm={handleLeadConfirm}
        isSubmitting={isLeadSubmitting}
      />

      <BookPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        pdfUrl={hrefs.companyProfile || "/api/download-leads/file?asset=company_profile"}
      />
    </section>
  );
};

export default CTACatalogueSection;
