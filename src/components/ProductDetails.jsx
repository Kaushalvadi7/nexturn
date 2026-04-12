import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const getProductImages = (product) => {
  const images = Array.isArray(product?.images) ? product.images : [];
  const imageUrls = images
    .sort((a, b) => {
      if (a?.is_primary && !b?.is_primary) return -1;
      if (!a?.is_primary && b?.is_primary) return 1;
      return (a?.sort_order ?? 0) - (b?.sort_order ?? 0);
    })
    .map((img) => img?.image_url)
    .filter(Boolean);

  if (imageUrls.length > 0) {
    return imageUrls;
  }

  if (product?.image) {
    return [product.image];
  }

  return [];
};

const formatLabel = (value) =>
  String(value)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();

const ProductDetails = () => {
  const location = useLocation();
  const imageRef = useRef(null);
  const product = location.state?.material || null;

  const images = useMemo(() => getProductImages(product), [product]);
  const specifications = useMemo(() => {
    if (!product?.specifications || typeof product.specifications !== "object") {
      return [];
    }

    return Object.entries(product.specifications).filter(
      ([, value]) => value !== null && value !== undefined && String(value).trim() !== ""
    );
  }, [product]);
  const applications = Array.isArray(product?.applications)
    ? product.applications.filter((item) => item && String(item).trim() !== "")
    : [];
  const materialGrades = Array.isArray(product?.material_grades)
    ? product.material_grades.filter((item) => item?.grade)
    : [];

  const [mainImage, setMainImage] = useState(images[0] || "");
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });
  const [lensStyle, setLensStyle] = useState({ display: "none" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("applications");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setMainImage(images[0] || "");
  }, [images]);

  const handleMouseMove = (e) => {
    if (!imageRef.current || images.length === 0) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    const lensSize = 40;

    let lx = ((e.pageX - left - window.scrollX) / width) * 100 - lensSize / 2;
    let ly = ((e.pageY - top - window.scrollY) / height) * 100 - lensSize / 2;

    lx = Math.max(0, Math.min(lx, 100 - lensSize));
    ly = Math.max(0, Math.min(ly, 100 - lensSize));

    setLensStyle({
      display: "block",
      left: `${lx}%`,
      top: `${ly}%`,
      width: `${lensSize}%`,
      height: `${lensSize}%`,
    });

    setZoomStyle({
      display: "block",
      backgroundImage: `url(${mainImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "250%",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
    setLensStyle({ display: "none" });
  };

  if (!product) {
    return (
      <div className="bg-[#fafbfc] min-h-screen pt-20 md:pt-32 pb-20 font-['Source_Sans_3',sans-serif]">
        <section className="px-4 sm:px-6 lg:px-8 max-w-[960px] mx-auto">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 md:p-12 text-center space-y-4">
            <h1 className="text-2xl md:text-3xl font-black text-[#1E3A5F]">Product not available</h1>
            <p className="text-slate-500 text-sm md:text-base font-medium">
              Open this page from the product list to load the selected product details.
            </p>
            <div className="pt-2">
              <Link
                to="/product-list"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E3A5F] text-white rounded-xl font-black text-xs uppercase tracking-widest"
              >
                Back to Products
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-[#fafbfc] min-h-screen pt-20 md:pt-32 pb-20 font-['Source_Sans_3',sans-serif]">
      <section className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 md:mb-8 border-b border-slate-100 pb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link to="/" className="hover:text-[#1E3A5F] transition-colors flex-shrink-0">Home</Link>
          <span className="material-symbols-outlined text-[10px] flex-shrink-0">chevron_right</span>
          <Link to="/product-list" className="hover:text-[#1E3A5F] transition-colors flex-shrink-0">Products</Link>
          <span className="material-symbols-outlined text-[10px] flex-shrink-0">chevron_right</span>
          <span className="text-[#1E3A5F] flex-shrink-0">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-12 md:mb-16 relative">
          <div className="w-full lg:w-1/2 space-y-4">
            <div
              ref={imageRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => images.length > 0 && setIsModalOpen(true)}
              className={`bg-white rounded-2xl md:rounded-[2rem] overflow-hidden border border-slate-100 shadow-lg relative ${images.length > 0 ? "group cursor-zoom-in" : ""}`}
            >
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center bg-slate-100 text-slate-400 text-sm font-bold uppercase tracking-widest">
                  No image available
                </div>
              )}

              {images.length > 0 && (
                <div
                  className="absolute border border-white/30 bg-white/10 pointer-events-none hidden lg:block"
                  style={lensStyle}
                ></div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2 md:gap-4 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    onClick={() => setMainImage(img)}
                    className={`rounded-lg md:rounded-xl overflow-hidden border-2 transition-all p-0.5 md:p-1 bg-white shadow-sm flex-shrink-0 ${mainImage === img ? "border-[#e17000] scale-95 shadow-md" : "border-transparent hover:border-slate-200"}`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full aspect-square object-cover rounded-md md:rounded-lg" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/2 flex flex-col relative min-w-0">
            {images.length > 0 && (
              <div
                className="hidden lg:block absolute top-0 left-0 w-full aspect-square bg-white border border-slate-200 rounded-[2rem] shadow-2xl z-40 pointer-events-none overflow-hidden animate-in fade-in duration-200"
                style={zoomStyle}
              ></div>
            )}

            <div className="lg:sticky lg:top-32 space-y-6 md:space-y-8">
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-slate-400 text-[9px] md:text-[10px] font-bold tracking-widest">
                    Product ID: {product.id}
                  </span>
                  {product.category?.name && (
                    <span className="text-[#e17000] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                      {product.category.name}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl lg:text-5xl font-black text-[#1E3A5F] tracking-tight leading-tight break-words">
                  {product.name}
                </h1>

                {product.description && (
                  <p className="text-slate-500 text-sm md:text-[15px] leading-relaxed font-medium break-words whitespace-pre-wrap">
                    {product.description}
                  </p>
                )}
              </div>

              {(applications.length > 0 || specifications.length > 0 || materialGrades.length > 0) && (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-6 md:gap-12 border-b border-slate-100 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                      <button
                        onClick={() => setActiveTab("applications")}
                        className={`pb-4 text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all relative cursor-pointer ${activeTab === "applications" ? "text-[#e17000]" : "text-slate-400 hover:text-slate-600"}`}
                      >
                        Application
                      </button>
                      <button
                        onClick={() => setActiveTab("specifications")}
                        className={`pb-4 text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all relative cursor-pointer ${activeTab === "specifications" ? "text-[#e17000]" : "text-slate-400 hover:text-slate-600"}`}
                      >
                        Specification
                      </button>
                      <button
                        onClick={() => setActiveTab("material_grades")}
                        className={`pb-4 text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all relative cursor-pointer ${activeTab === "material_grades" ? "text-[#e17000]" : "text-slate-400 hover:text-slate-600"}`}
                      >
                        Material Grade
                      </button>
                    </div>

                    <div className="min-h-[300px]">
                      {activeTab === "applications" ? (
                        <div className="space-y-8">
                          {applications.length > 0 ? (
                            applications.map((app, i) => (
                              <div key={`${app}-${i}`} className="flex gap-6 group">
                                <div className="w-[3px] bg-[#e17000] h-full rounded-full transition-all group-hover:w-[5px]"></div>
                                <div className="space-y-1">
                                  <h3 className="text-sm font-black text-[#1b365d]">Application {i + 1}</h3>
                                  <p className="text-slate-500 text-[13px] font-medium leading-relaxed break-words whitespace-pre-wrap flex-1 min-w-0">{app}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-slate-500 text-sm font-medium">No applications available.</p>
                          )}
                        </div>
                      ) : activeTab === "specifications" ? (
                        <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#1E3A5F]">
                                <th className="px-5 py-4 text-[10px] font-black text-white uppercase tracking-widest">Parameter</th>
                                <th className="px-5 py-4 text-[10px] font-black text-white uppercase tracking-widest">Value</th>
                              </tr>
                            </thead>
                            <tbody className="text-slate-600">
                              {specifications.length > 0 ? (
                                specifications.map(([key, value], index) => (
                                  <tr key={key} className={index % 2 === 0 ? "bg-white hover:bg-slate-50 border-b border-slate-50" : "bg-slate-50/50 hover:bg-slate-100 border-b border-slate-50"}>
                                    <td className="px-5 py-4 text-[11px] font-black text-[#1b365d]">{formatLabel(key)}</td>
                                    <td className="px-5 py-4 text-[11px] font-bold text-slate-500 break-words">{String(value)}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr className="bg-white">
                                  <td colSpan="2" className="px-5 py-6 text-sm text-slate-500 font-medium">No specifications available.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#12243d]">
                                <th className="px-5 py-4 text-[10px] font-black text-white uppercase tracking-widest">Grade</th>
                                <th className="px-5 py-4 text-[10px] font-black text-white uppercase tracking-widest">Standard</th>
                                <th className="px-5 py-4 text-[10px] font-black text-white uppercase tracking-widest">Notes</th>
                              </tr>
                            </thead>
                            <tbody className="text-slate-600">
                              {materialGrades.length > 0 ? (
                                materialGrades.map((grade, index) => (
                                  <tr key={grade.id || index} className={index % 2 === 0 ? "bg-white hover:bg-slate-50 border-b border-slate-50" : "bg-slate-50/50 hover:bg-slate-100 border-b border-slate-50"}>
                                    <td className="px-5 py-4 text-[11px] font-black text-[#1b365d] break-words">{grade.grade}</td>
                                    <td className="px-5 py-4 text-[11px] font-bold text-slate-500 italic break-words">{grade.standard || "-"}</td>
                                    <td className="px-5 py-4 text-[11px] font-medium text-slate-400 break-words">{grade.notes || "-"}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr className="bg-white">
                                  <td colSpan="3" className="px-5 py-6 text-sm text-slate-500 font-medium">No material grades available.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/contact-us#quote-form"
                  className="flex-1 px-6 py-4 bg-[#1E3A5F] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#12243d] transition-all shadow-xl shadow-[#1E3A5F]/20 flex items-center justify-center gap-3 group"
                >
                  <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">send</span>
                  Request Quote
                </Link>
              </div>
            </div>
          </div>
        </div>

      </section>

      {isModalOpen && images.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in duration-300">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 bg-slate-100 hover:bg-slate-200 text-[#1E3A5F] rounded-full p-3 transition-all z-[110] shadow-md flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-2xl font-bold">close</span>
          </button>

          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl h-full flex items-center justify-center">
              <img
                src={mainImage}
                alt={product.name}
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg border border-slate-100"
              />
            </div>
          </div>

          {images.length > 1 && (
            <div className="w-full pb-8 md:pb-12 bg-white px-4">
              <div className="max-w-5xl mx-auto">
                <div className="flex gap-3 overflow-x-auto p-4 w-full justify-start md:justify-center scrollbar-hide mb-4">
                  {images.map((img, idx) => (
                    <button
                      key={`${img}-${idx}`}
                      onClick={() => setMainImage(img)}
                      className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-slate-50 ${mainImage === img ? "border-[#e17000] scale-105 shadow-md" : "border-slate-100 shadow-sm"}`}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
