import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getCategories, getProducts } from "../lib/api";

const getCategoryImage = (category) => {
  const images = Array.isArray(category?.images) ? category.images : [];
  return (
    images.find((img) => img.is_primary)?.image_url ||
    images[0]?.image_url ||
    "https://img.rocket.new/generatedImages/rocket_gen_img_1fb013e2c-1764847584655.png"
  );
};

const getProductImage = (product) => {
  const images = Array.isArray(product?.images) ? product.images : [];
  return (
    images.find((img) => img.is_primary)?.image_url ||
    images[0]?.image_url ||
    "https://images.unsplash.com/photo-1581092162384-8987c1794ed9?auto=format&fit=crop&q=80&w=800"
  );
};

const parseTextListField = (value) => {
  if (!value) {
    return [];
  }

  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => {
        if (typeof item === "string") return item.trim();
        if (item && typeof item === "object") {
          const key = String(item.key || "").trim();
          const itemValue = String(item.value || "").trim();
          if (key && itemValue) return `${key}: ${itemValue}`;
          return key || itemValue;
        }
        return "";
      })
      .filter(Boolean);
  } catch {
    return [];
  }
};

const ViewAllProduct = () => {
  const location = useLocation();
  const selectedCategoryId = location.state?.categoryId ?? null;
  const selectedCategoryName = location.state?.categoryName ?? "";
  const [activeTab, setActiveTab] = useState("applications");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoryRes, productRes] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);

        setCategories(Array.isArray(categoryRes?.data) ? categoryRes.data : []);
        setProducts(Array.isArray(productRes?.data) ? productRes.data : []);
      } catch (error) {
        console.error("Failed to load product listing data", error);
        setCategories([]);
        setProducts([]);
      }
    };

    loadData();
  }, []);

  const fallbackCategory = categories[0] || null;
  const category =
    categories.find((item) => item.id === selectedCategoryId) ||
    categories.find((item) => item.name === selectedCategoryName) ||
    fallbackCategory;

  const filteredProducts = category
    ? products.filter((product) => {
        const productCategoryId =
          product.category_id ?? product.category?.id ?? null;
        const productCategoryName = product.category?.name ?? "";
        return (
          productCategoryId === category.id ||
          productCategoryName === category.name
        );
      })
    : products;
  const applications = Array.isArray(category?.applications)
    ? category.applications
        .map((item) => {
          if (typeof item === "string") return item.trim();
          if (item && typeof item === "object") {
            return String(
              item.text || item.title || item.description || "",
            ).trim();
          }
          return "";
        })
        .filter(Boolean)
    : [];
  const materialGrades = Array.isArray(category?.material_grades)
    ? category.material_grades.filter((grade) =>
        String(grade?.grade || "").trim(),
      )
    : [];
  const processDetails = parseTextListField(category?.process);
  const surfaceFinishes = parseTextListField(category?.surface_finish);
  const tabs = [
    { id: "process", label: "Process" },
    { id: "material_grades", label: "Material Grades" },
    { id: "applications", label: "Applications" },
    { id: "surface_finish", label: "Surface Finish" },
  ];

  const renderTextListTable = (items, emptyMessage, showIcon = true) => (
    <div className="flex flex-col gap-4">
      {items.length > 0 ? (
        items.map((item, index) => (
          <div 
            key={`${item}-${index}`}
            className="flex items-start gap-4 p-1 bg-white border border-slate-100 rounded-2xl hover:border-[#e17000] hover:shadow-lg hover:shadow-[#e17000]/5 transition-all group"
          >
            {showIcon && (
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-[#e17000]/10 transition-colors">
                <span className="material-symbols-outlined text-[#e17000] text-lg">
                  check_circle
                </span>
              </div>
            )}
            <p className="text-[#1b365d] text-[13px] font-bold leading-relaxed pt-1 break-words whitespace-pre-wrap flex-1 min-w-0">
              {item}
            </p>
          </div>
        ))
      ) : (
        <div className="py-12 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
          <p className="text-slate-400 text-sm font-medium">
            {emptyMessage}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-[#fafbfc] min-h-screen pt-16 pb-20 font-['Source_Sans_3',sans-serif]">
      <section className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 items-start">
            <Link
              to="/products#available-materials"
              className="w-fit flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-[#1b365d] rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm group cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
                arrow_back
              </span>
              Back to Products
            </Link>
            <div className="h-10 w-[1px] bg-slate-200 hidden sm:block"></div>
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1b365d] tracking-tight">
                {category?.name || "Industrial Products"}
              </h2>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-slate-500">
                <span className="w-3 sm:w-4 h-[1.5px] sm:h-[2px] bg-[#e17000]"></span>
                Showing {filteredProducts.length} products
                {category ? ` in ${category.name}` : ""}
              </p>
            </div>
          </div>
        </div>

        {category && (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden mb-20">
            <div className="flex flex-col lg:flex-row min-h-[700px]">
              <div className="lg:w-[45%] relative group">
                <img
                  src={getCategoryImage(category)}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10"></div>

                <div className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/20 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[#e17000]"></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">
                    {category.name}
                  </span>
                </div>
              </div>

              <div className="lg:w-[55%] p-8 lg:p-14 flex flex-col min-w-0">
                <div className="space-y-6 flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[#e17000]">
                    <div className="w-2 h-2 rounded-full bg-[#e17000]"></div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                      Custom Machined Export Grade
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-4xl lg:text-5xl font-black text-[#1b365d] tracking-tight break-words">
                      {category.name}
                    </h1>
                    <p className="text-slate-500 text-[15px] leading-relaxed font-medium max-w-2xl break-words whitespace-pre-wrap">
                      {category.description ||
                        "Custom machined industrial components manufactured to customer drawings and application requirements."}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 md:gap-12 pt-6 border-b border-slate-100 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-4 text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all relative cursor-pointer ${activeTab === tab.id ? "text-[#e17000]" : "text-slate-400 hover:text-slate-600"}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="min-h-[300px]">
                    {activeTab === "applications" ? (
                      <div className="space-y-8">
                        {applications.map((item, i) => (
                          <div key={i} className="space-y-2">
                            <h3 className="text-lg font-black text-[#1b365d]">
                              Application {i + 1}
                            </h3>
                            <p className="text-slate-500 text-[15px] font-medium leading-relaxed break-words whitespace-pre-wrap">
                              {item}
                            </p>
                          </div>
                        ))}
                        {applications.length === 0 && (
                          <p className="text-slate-500 text-sm font-medium py-10 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                            No applications configured for this category yet.
                          </p>
                        )}
                      </div>
                    ) : activeTab === "material_grades" ? (
                      <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-[#12243d]">
                              <th className="px-5 py-4 text-[10px] font-black text-white uppercase tracking-widest">
                                Grade
                              </th>
                              <th className="px-5 py-4 text-[10px] font-black text-white uppercase tracking-widest">
                                Standard
                              </th>
                              <th className="px-5 py-4 text-[10px] font-black text-white uppercase tracking-widest">
                                Notes
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-slate-600">
                            {materialGrades.map((grade, index) => (
                              <tr
                                key={grade.id || index}
                                className={
                                  index % 2 === 0
                                    ? "bg-white hover:bg-slate-50 border-b border-slate-50"
                                    : "bg-slate-50/50 hover:bg-slate-100 border-b border-slate-50"
                                }
                              >
                                <td className="px-5 py-4 text-[11px] font-black text-[#1b365d]">
                                  {grade.grade}
                                </td>
                                <td className="px-5 py-4 text-[11px] font-bold text-slate-500 italic">
                                  {grade.standard || "-"}
                                </td>
                                <td className="px-5 py-4 text-[11px] font-medium text-slate-400">
                                  {grade.notes || "-"}
                                </td>
                              </tr>
                            ))}
                            {materialGrades.length === 0 && (
                              <tr className="bg-white">
                                <td
                                  colSpan="3"
                                  className="px-5 py-6 text-sm text-slate-500 font-medium"
                                >
                                  No material grades configured for this
                                  category yet.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    ) : activeTab === "process" ? (
                      renderTextListTable(
                        processDetails,
                        "No process details configured for this category yet.",
                      )
                    ) : (
                      renderTextListTable(
                        surfaceFinishes,
                        "No surface finish details configured for this category yet.",
                      )
                    )}
                  </div>
                </div>

                <div className="pt-10 flex flex-col sm:flex-row items-center gap-8">
                  <Link
                    to="/contact-us#quote-form"
                    className="w-full sm:w-auto flex items-center justify-between gap-12 pl-10 pr-6 py-5 bg-[#e17000] hover:bg-[#ff8c00] text-white rounded-xl transition-all shadow-xl shadow-[#e17000]/20 group cursor-pointer"
                  >
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                      Request Quote
                    </span>
                    <span className="material-symbols-outlined text-xl group-hover:translate-x-2 transition-transform">
                      arrow_right_alt
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredProducts.map((product) => {
            const image = getProductImage(product);
            const specifications = product.specifications || {};

            return (
              <div
                key={product.id}
                className="bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col h-full"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-[#1b365d] text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest">
                    {product.name}
                  </div>
                </div>

                <div className="p-8 space-y-6 flex-1 flex flex-col">
                  <div className="space-y-3">
                    <h3 className="text-xl font-black text-[#1b365d] break-words">
                      {product.name}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium break-words whitespace-pre-wrap">
                      {product.description ||
                        "Custom machined component for industrial applications."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#1b365d]">
                      <span className="material-symbols-outlined text-lg">
                        science
                      </span>
                      <span className="text-xs font-black uppercase tracking-widest">
                        Key Specifications
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                      {Object.entries(specifications)
                        .slice(0, 4)
                        .map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                              {key}
                            </span>
                            <p className="text-xs font-black text-[#1b365d] break-words">
                              {String(value)}
                            </p>
                          </div>
                        ))}
                      {Object.keys(specifications).length === 0 && (
                        <div className="col-span-2 text-sm text-slate-500 font-medium">
                          Specifications will be available soon.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-auto">
                    <Link
                      to="/product-details"
                      state={{ material: product }}
                      className="w-full bg-[#1b365d] hover:bg-[#12243d] text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">
                        visibility
                      </span>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ViewAllProduct;
