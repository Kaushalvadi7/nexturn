import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { getProducts } from "../lib/api";
import "./VerticalGallery.css";
import ForSeo from "../components/ForSeo";

const Gallery = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const material = location.state?.material || { name: "Materials", id: "All" };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedImage, setSelectedImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Disable scroll when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setLoadError("");
        const response = await getProducts();
        const items = Array.isArray(response?.data) ? response.data : [];
        setProducts(items);
      } catch (error) {
        console.error("Failed to load products for gallery", error);
        setProducts([]);
        setLoadError(error?.message || "Failed to load gallery images.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const materialId = material?.id ?? "All";
  const normalizedMaterialId =
    materialId === "All" || materialId === null || materialId === undefined
      ? "All"
      : Number(materialId);

  const filteredProducts =
    normalizedMaterialId === "All" || Number.isNaN(normalizedMaterialId)
      ? products
      : products.filter((product) => {
        const productCategoryId = product.category_id ?? product.category?.id ?? null;
        return Number(productCategoryId) === normalizedMaterialId;
      });

  const galleryItems = filteredProducts.flatMap((product) => {
    const images = Array.isArray(product?.images) ? product.images : [];

    return images
      .filter((img) => img && img.image_url)
      .slice()
      .sort((a, b) => {
        const aPrimary = a?.is_primary ? 1 : 0;
        const bPrimary = b?.is_primary ? 1 : 0;
        if (aPrimary !== bPrimary) return bPrimary - aPrimary;

        const aOrder = Number.isFinite(a?.sort_order) ? a.sort_order : 9999;
        const bOrder = Number.isFinite(b?.sort_order) ? b.sort_order : 9999;
        return aOrder - bOrder;
      })
      .map((img) => ({
        url: img.image_url,
        productId: product.id,
        productName: product.name,
      }));
  });

  const chunks = useMemo(() => {
    const items = [];
    const total = galleryItems.length;

    // Special case: if exactly 4 images, split into 2 rows of 2
    if (total === 4) {
      items.push(galleryItems.slice(0, 2));
      items.push(galleryItems.slice(2, 4));
      return items;
    }

    // Default: 3 images per row
    for (let i = 0; i < total; i += 3) {
      items.push(galleryItems.slice(i, i + 3));
    }
    return items;
  }, [galleryItems]);

  return (
    <>
      <ForSeo
        title="Product Gallery | Nexturn Component Craft"
        description="Browse our comprehensive gallery showcasing high-quality precision engineering products, custom metal components, and CNC machined parts."
        keywords="product gallery, precision engineering portfolio, CNC machining examples, custom metal components pictures, manufacturing gallery, Nexturn components gallery"
        path="/gallery"
        serviceSchema={{
          serviceName: "Precision Engineering Portfolio",
          serviceDescription: "Visual gallery showcasing our high-quality CNC machined and custom metal components.",
        }}
      />
      <div className="bg-[#fafbfc] min-h-screen pt-18 pb-20 font-['Source_Sans_3',sans-serif]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 items-start">
              <button
                onClick={() => navigate(-1)}
                className="w-fit flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-[#1b365d] rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm group cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                Back to Products
              </button>
              <div className="h-10 w-[1px] bg-slate-200 hidden sm:block"></div>
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1b365d] tracking-tight">
                  {material.name} Gallery
                </h1>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-slate-500">
                  <span className="w-3 sm:w-4 h-[1.5px] sm:h-[2px] bg-[#e17000]"></span>
                  {isLoading
                    ? "Loading images..."
                    : `Showing ${galleryItems.length} images from ${filteredProducts.length} products`}
                </p>
              </div>
            </div>
          </div>

          {loadError && (
            <div className="mb-10 bg-white rounded-[2rem] border border-slate-100 shadow-sm px-8 py-6 text-slate-600">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">Unable to load gallery</p>
              <p className="text-sm font-medium">{loadError}</p>
            </div>
          )}

          {/* Gallery Interactive Accordion Rows */}
          {!isLoading && chunks.length > 0 && (
            <div className="space-y-12 md:space-y-24 mb-20">
              {chunks.map((chunk, chunkIndex) => (
                <div
                  key={chunkIndex}
                  className="scroll-mt-24"
                  style={{ animationDelay: `${chunkIndex * 100}ms` }}
                >
                  {/* <div className="flex items-center gap-4 mb-6">
                   <div className="h-[1px] flex-1 bg-slate-200"></div>
                   <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest whitespace-nowrap">Collection {chunkIndex + 1}</span>
                   <div className="h-[1px] flex-1 bg-slate-200"></div>
                </div> */}

                  <div className="gallery-container !w-full !max-w-none h-auto md:!h-[550px]">
                    <div className={`gallery-wrap wrap-effect-${(chunkIndex % 4) + 1}`}>
                      {chunk.map((item, index) => (
                        <div
                          key={`${item.productId}-${chunkIndex}-${index}`}
                          className="gallery-item group/item !border-none"
                          style={{ backgroundImage: `url(${item.url})` }}
                          onClick={() => setSelectedImage(item)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="text-center py-32 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin mb-6"></div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Synchronizing Gallery Assets</p>
            </div>
          )}

          {!isLoading && galleryItems.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
              <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">image_not_supported</span>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No product images available for this category</p>
            </div>
          )}
        </div>

        {/* Lightbox Modal rendered via Portal to escape any parent CSS context */}
        {selectedImage && createPortal(
          <div
            className="fixed inset-0 z-[9999999] bg-black/98 flex flex-col items-center justify-center p-2 sm:p-10"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt="Enlarged"
                className="max-w-[95vw] max-h-[85vh] w-auto h-auto object-contain block shadow-2xl rounded-sm"
                style={{ filter: 'none', opacity: 1, visibility: 'visible' }}
              />

              <div className="mt-8 bg-white/5 backdrop-blur-md px-8 py-3 rounded-full border border-white/10 hidden md:block">
                <p className="text-white text-[11px] font-black uppercase tracking-[0.4em] opacity-80">
                  {selectedImage.productName}
                </p>
              </div>
            </div>

            <button
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-all cursor-pointer z-50 p-4"
              onClick={() => setSelectedImage(null)}
            >
              <span className="material-symbols-outlined text-5xl">close</span>
            </button>
          </div>,
          document.body
        )}
      </div>
    </>
  );
};

export default Gallery;
