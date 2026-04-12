import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCertificates, getCategories, getProducts } from "../../lib/api";
import { useContactInfo } from "./contactInfo";
import CTACatalogueSection from "./CTACatalogueSection";

const Footer = () => {
  const [certifications, setCertifications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoadingCerts, setIsLoadingCerts] = useState(true);
  const [isLoadingCats, setIsLoadingCats] = useState(true);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const { info, hrefs } = useContactInfo();
  const location = useLocation();
  const navigate = useNavigate();

  const socialLinks = [
    {
      key: "facebook",
      href: hrefs.facebook || "https://facebook.com",
      label: "Facebook",
    },
    {
      key: "instagram",
      href: hrefs.instagram || "https://instagram.com",
      label: "Instagram",
    },
    {
      key: "linkedin",
      href: hrefs.linkedin || "https://linkedin.com",
      label: "LinkedIn",
    },
    { key: "x", href: hrefs.x || "https://x.com", label: "X (Twitter)" },
    {
      key: "youtube",
      href: hrefs.youtube || "https://youtube.com",
      label: "YouTube",
    },
    { key: "whatsapp", href: hrefs.whatsapp || "#", label: "WhatsApp" },
  ];

  useEffect(() => {
    let isActive = true;
    const fetchCatalog = async () => {
      setIsLoadingCats(true);
      try {
        const [categoryRes, productRes] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);
        if (isActive) {
          setCategories(
            Array.isArray(categoryRes) ? categoryRes : categoryRes?.data || [],
          );
          setProducts(
            Array.isArray(productRes) ? productRes : productRes?.data || [],
          );
        }
      } catch {
        if (isActive) {
          setCategories([]);
          setProducts([]);
        }
      } finally {
        if (isActive) setIsLoadingCats(false);
      }
    };
    fetchCatalog();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    const fetchCerts = async () => {
      setIsLoadingCerts(true);
      try {
        const data = await getCertificates();
        if (isActive) {
          setCertifications(Array.isArray(data) ? data : []);
        }
      } catch {
        if (isActive) {
          setCertifications([]);
        }
      } finally {
        if (isActive) setIsLoadingCerts(false);
      }
    };

    fetchCerts();
    return () => {
      isActive = false;
    };
  }, []);

  const getProductsByCategory = (category) =>
    products.filter((product) => {
      const productCategoryId =
        product.category_id ?? product.category?.id ?? null;
      const productCategoryName = product.category?.name ?? "";
      return (
        productCategoryId === category.id ||
        productCategoryName === category.name
      );
    });

  const scrollToTop = () => {
    if (window.smoother && typeof window.smoother.scrollTo === "function") {
      window.smoother.scrollTo(0, true);
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBrandClick = (event) => {
    event.preventDefault();

    if (location.pathname !== "/" || location.hash) {
      navigate("/");
      requestAnimationFrame(scrollToTop);
      return;
    }

    scrollToTop();
  };

  return (
    <>
      <CTACatalogueSection />

      <footer className="bg-[#0A1628] text-white pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Section: 4-Column Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-10 mb-16">
            {/* Column 1: Branding */}
            <div className="col-span-2 lg:col-span-3 space-y-6">
              <Link
                to="/"
                onClick={handleBrandClick}
                className="flex items-center gap-2 sm:gap-3 shrink-0"
              >
                <div className="bg-slate-800 w-12 sm:w-16 h-12 sm:h-14 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                  <img
                    src="/images/Screenshot_2026-03-18_182531-removebg-preview.png"
                    alt="Nexturn Logo"
                    className="h-8 sm:h-10 w-auto object-contain transform scale-[1.5]"
                  />
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span
                    className="text-[23px] sm:text-[27px] font-extrabold uppercase text-white leading-none tracking-normal inline-block transform scale-x-[0.95]"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    NEXTURN
                  </span>
                  <span className="text-[10px] sm:text-[12.5px] font-bold text-white/85 uppercase tracking-[0.12em] whitespace-nowrap mt-1 pl-2">
                    Componentcraft Pvt. Ltd.
                  </span>
                </div>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed lg:max-w-xs transition-all">
                {info.companyDescription}
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="col-span-1 lg:col-span-2">
              <h4 className="text-lg font-extrabold mb-4 lg:mb-6">
                Quick Links
              </h4>
              <ul className="space-y-4">
                {[
                  "Home",
                  "About Us",
                  "Products",
                  "Quality Inspection",
                  "Contact Us",
                ].map((link) => (
                  <li key={link}>
                    <Link
                      to={
                        link === "Home"
                          ? "/"
                          : link === "About Us"
                            ? "/about-us"
                            : `/${link.toLowerCase().replace(/ /g, "-")}`
                      }
                      className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group text-sm font-medium"
                    >
                      <span className="material-symbols-outlined text-[14px] text-secondary group-hover:translate-x-1 transition-transform">
                        chevron_right
                      </span>
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column: Dynamic Categories */}
            <div className="col-span-1 lg:col-span-2">
              <h4 className="text-lg font-extrabold mb-4 lg:mb-6">
                Categories
              </h4>
              <ul className="space-y-3">
                {isLoadingCats && (
                  <li className="text-slate-500 text-xs font-semibold">
                    Loading...
                  </li>
                )}
                {!isLoadingCats && categories.length === 0 && (
                  <li className="text-slate-500 text-xs font-semibold italic">
                    Stay Tuned!
                  </li>
                )}
                {!isLoadingCats &&
                  categories.map((cat) => {
                    const categoryId = cat.id || cat.name || cat.title;
                    const categoryName = cat.name || cat.title || "Category";
                    const productsInCategory = getProductsByCategory(cat);
                    const isExpanded = expandedCategoryId === categoryId;

                    return (
                      <li key={categoryId} className="space-y-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedCategoryId(
                                isExpanded ? null : categoryId,
                              )
                            }
                            className="text-slate-500 hover:text-white transition-colors p-0.5 rounded cursor-pointer flex-shrink-0"
                            aria-label={`Toggle products for ${categoryName}`}
                          >
                            <span
                              className={`material-symbols-outlined text-[14px] transition-transform ${isExpanded ? "rotate-90" : ""}`}
                            >
                              chevron_right
                            </span>
                          </button>

                          <Link
                            to="/product-list"
                            state={{ categoryId: cat.id, categoryName }}
                            className="text-slate-400 hover:text-white transition-colors group text-sm font-medium min-w-0"
                          >
                            <span className="truncate">{categoryName}</span>
                          </Link>
                        </div>

                        {isExpanded && (
                          <ul className="ml-6 space-y-2 border-l border-slate-700 pl-3">
                            {productsInCategory.length > 0 ? (
                              productsInCategory.map((product) => (
                                <li key={product.id || product.name}>
                                  <Link
                                    to="/product-details"
                                    state={{ material: product }}
                                    className="text-slate-500 hover:text-white transition-colors text-xs font-medium flex items-center gap-2"
                                  >
                                    <span className="material-symbols-outlined text-[12px]">
                                      subdirectory_arrow_right
                                    </span>
                                    <span className="truncate">
                                      {product.name}
                                    </span>
                                  </Link>
                                </li>
                              ))
                            ) : (
                              <li className="text-slate-600 text-xs italic">
                                No products in this category.
                              </li>
                            )}
                          </ul>
                        )}
                      </li>
                    );
                  })}
              </ul>
            </div>

            {/* Column 3: Contact Information */}
            <div className="col-span-2 lg:col-span-3">
              <h4 className="text-lg font-extrabold mb-4 lg:mb-6">
                Contact Information
              </h4>
              <div className="space-y-6">
                <div className="flex items-start gap-3 group">
                  <span className="material-symbols-outlined text-orange-500 text-xl font-bold">
                    mail
                  </span>
                  <div>
                    <a
                      href={hrefs.mailto || "mailto:info@nexturnprecision.com"}
                      className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
                    >
                      {info.email || "info@nexturnprecision.com"}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 group">
                  <span className="material-symbols-outlined text-orange-500 text-xl font-bold">
                    call
                  </span>
                  <div>
                    <a
                      href={hrefs.tel || "tel:+919876543210"}
                      className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
                    >
                      {info.phone || "+91 98765 43210"}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 group">
                  <span className="material-symbols-outlined text-orange-500 text-xl font-bold">
                    location_on
                  </span>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    {info.location ||
                      "Industrial Area, Jamnagar, Gujarat, India"}
                  </p>
                </div>
              </div>

              {/* Follow Us Section */}
              <div className="mt-3 pt-4 border-t border-slate-800/50">
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-6">
                  Follow Us
                </h4>
                <div className="flex items-center gap-5">
                  {socialLinks.map((social) => (
                    <a
                      key={social.key}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      title={social.label}
                      className="text-slate-400 hover:text-white transition-all transform hover:-translate-y-1"
                    >
                      {social.key === "facebook" && (
                        <svg
                          className="w-5 h-5 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      )}
                      {social.key === "instagram" && (
                        <svg
                          className="w-5 h-5 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                      )}
                      {social.key === "linkedin" && (
                        <svg
                          className="w-5 h-5 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      )}
                      {social.key === "x" && (
                        <svg
                          className="w-5 h-5 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      )}
                      {social.key === "youtube" && (
                        <svg
                          className="w-6 h-6 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      )}
                      {social.key === "whatsapp" && (
                        <svg
                          className="w-5 h-5 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.57 0-3.11-.42-4.47-1.21l-.32-.19-3.15.83.84-3.04-.2-.33c-.87-1.39-1.34-3.01-1.34-4.67 0-4.73 3.85-8.58 8.58-8.58 2.29 0 4.44.89 6.06 2.51 1.62 1.62 2.51 3.77 2.51 6.06.01 4.73-3.84 8.59-8.57 8.59zm4.75-6.5c-.26-.13-1.53-.75-1.77-.84-.23-.09-.4-.13-.57.13-.17.26-.65.84-.79.97-.15.15-.3.17-.55.04-.25-.13-1.07-.39-2.03-1.25-.74-.66-1.25-1.48-1.39-1.73-.14-.26-.01-.39.12-.52.12-.11.26-.3.39-.45s.17-.26.26-.43c.09-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.88-.2-.5-.41-.43-.57-.44h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09s.9 2.42 1.03 2.59c.13.17 1.77 2.7 4.28 3.78.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.48-.6 1.68-1.19.2-.58.2-1.08.15-1.19-.06-.1-.21-.17-.47-.3z" />
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 4: Certifications & Connect */}
            <div className="col-span-2 lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-8">
              <div className="col-span-1">
                <h4 className="text-lg font-extrabold mb-4 lg:mb-6">
                  Certifications
                </h4>
                <ul className="space-y-3 lg:space-y-4">
                  {isLoadingCerts && (
                    <li className="text-slate-400 text-xs font-medium">
                      Loading...
                    </li>
                  )}
                  {!isLoadingCerts && certifications.length === 0 && (
                    <li className="text-slate-400 text-xs font-medium">
                      No certifications listed.
                    </li>
                  )}
                  {!isLoadingCerts &&
                    certifications.slice(0, 10).map((cert) => (
                      <li
                        key={cert.id || cert.name || cert.title}
                        className="flex items-center gap-2 text-slate-400 text-xs font-medium"
                      >
                        <span className="material-symbols-outlined text-orange-500 text-[16px] font-bold">
                          workspace_premium
                        </span>
                        {cert.name || cert.title}
                      </li>
                    ))}
                </ul>
              </div>

              <div className="col-span-1">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4 lg:mb-6">
                  Connect
                </h4>
                <a
                  href={hrefs.whatsapp || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-accent hover:bg-orange-700 text-white font-black text-[10px] sm:text-sm px-4 sm:px-6 py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all hover:-translate-y-1 active:scale-95 group w-fit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 sm:w-5 sm:h-5 fill-current transition-transform group-hover:scale-110"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.57 0-3.11-.42-4.47-1.21l-.32-.19-3.15.83.84-3.04-.2-.33c-.87-1.39-1.34-3.01-1.34-4.67 0-4.73 3.85-8.58 8.58-8.58 2.29 0 4.44.89 6.06 2.51 1.62 1.62 2.51 3.77 2.51 6.06.01 4.73-3.84 8.59-8.57 8.59zm4.75-6.5c-.26-.13-1.53-.75-1.77-.84-.23-.09-.4-.13-.57.13-.17.26-.65.84-.79.97-.15.15-.3.17-.55.04-.25-.13-1.07-.39-2.03-1.25-.74-.66-1.25-1.48-1.39-1.73-.14-.26-.01-.39.12-.52.12-.11.26-.3.39-.45s.17-.26.26-.43c.09-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.88-.2-.5-.41-.43-.57-.44h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09s.9 2.42 1.03 2.59c.13.17 1.77 2.7 4.28 3.78.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.48-.6 1.68-1.19.2-.58.2-1.08.15-1.19-.06-.1-.21-.17-.47-.3z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section: Divider & Copyright */}
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-[13px] font-medium">
              Â© {new Date().getFullYear()} nexturn precision Pvt. Ltd. All
              rights reserved.
            </p>
            <div className="flex items-center gap-8">
              <Link
                to="/privacy-policy"
                className="text-slate-500 hover:text-white text-[13px] font-medium transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-slate-500 hover:text-white text-[13px] font-medium transition-colors"
              >
                Terms of Service
              </Link>
              {/* <Link to="/admin/login" className="text-slate-500 hover:text-white text-[13px] font-medium transition-colors flex items-center gap-1 group">
                <span className="material-symbols-outlined text-[14px] group-hover:rotate-12 transition-transform">lock</span>
                Admin Access
              </Link> */}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
