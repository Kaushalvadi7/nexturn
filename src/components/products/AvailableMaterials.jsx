import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCategories } from "../../lib/api";

const getCategoryImage = (category) => {
  const images = Array.isArray(category.images) ? category.images : [];
  return (
    images.find((img) => img.is_primary)?.image_url ||
    images[0]?.image_url ||
    "https://images.unsplash.com/photo-1699791914755-78826dec1c40"
  );
};

const AvailableMaterials = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();
        const items = Array.isArray(response?.data) ? response.data : [];
        setCategories(items);
      } catch (error) {
        console.error("Failed to load categories", error);
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  return (
    <section
      id="available-materials"
      className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto pt-20 md:pt-12 mb-20"
    >
      <div className="flex justify-between items-end mb-12 gap-4">
        <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight
">
          Available Category
        </h2>
        {/* <span className="text-slate-400 text-sm font-medium">
          Showing {categories.length} of {categories.length} categories
        </span> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {categories.map((category) => {
    const image = getCategoryImage(category);
    return (
      <div
        key={category.id}
        onClick={() => navigate("/product-list", { 
          state: { categoryId: category.id, categoryName: category.name } 
        })}
        className="cursor-pointer bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col h-full"
      >
        <div className="relative h-64 overflow-hidden">
          <img
            src={image}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-4 right-4 bg-[#1b365d] text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest">
            {category.name}
          </div>
        </div>

        <div className="p-8 space-y-6 flex-1 flex flex-col min-w-0">
          <div className="space-y-3">
            <h3 className="text-xl font-black text-[#1b365d] break-words">
              {category.name}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium break-words whitespace-pre-wrap">
              {category.description || "Custom machined products built for industrial applications."}
            </p>
          </div>

          <div className="flex gap-4 pt-4 mt-auto">
            <Link
              to="/gallery"
              onClick={(e) => e.stopPropagation()}
              state={{ material: { id: category.id, name: category.name, image } }}
              className="flex-1 bg-white border-2 border-[#1b365d] hover:bg-[#1b365d] hover:text-white text-[#1b365d] py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer text-center"
            >
              Gallery
            </Link>
            <Link
              to="/product-list"
              onClick={(e) => e.stopPropagation()}
              state={{ categoryId: category.id, categoryName: category.name }}
              className="flex-1 bg-[#e17000] hover:bg-[#ff8c00] text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#e17000]/20 cursor-pointer text-center flex items-center justify-center"
            >
              View All Product
            </Link>
          </div>
        </div>
      </div>
    );
        })}
      </div>

      {/* <div className="bg-gradient-to-r from-[#1b365d] via-[#12243d] to-[#1b365d] rounded-[2.5rem] p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#e17000]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Need a Custom Material Solution?
          </h2>
          <p className="text-slate-300 text-base md:text-lg font-medium leading-relaxed">
            Our engineering team can help you select the optimal metal alloy for
            your specific application requirements. Get expert consultation and
            detailed technical specifications.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <button className="w-full sm:w-auto px-10 py-4 bg-[#e17000] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#ff8c00] transition-all hover:scale-105 shadow-lg shadow-[#e17000]/20 cursor-pointer flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-sm">chat</span>
              Contact Engineering Team
            </button>
            <button className="w-full sm:w-auto px-10 py-4 bg-white text-[#1b365d] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all hover:scale-105 shadow-lg cursor-pointer flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-sm">
                visibility
              </span>
              View Capabilities
            </button>
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default AvailableMaterials;
