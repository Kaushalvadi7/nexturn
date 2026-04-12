import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../lib/api";

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Home Page",
      path: "/admin/home",
      children: [
        { name: "Hero-section", path: "/admin/home" },
        {
          name: "Manufacturing-Capabilities",
          path: "/admin/manufacturing-capabilities",
        },
        { name: "Material-Specialization", path: "/admin/materials" },
        { name: "Client-Review", path: "/admin/client-review" },
        { name: "Regions", path: "/admin/regions" },
      ],
    },
    {
      name: "About Us",
      path: "/admin/aboutus",
      children: [
        { name: "Export-Journey", path: "/admin/aboutus" },
        { name: "Manufacturing-Infrastructure", path: "/admin/infrastructure" },
        { name: "Expertise-Leadership", path: "/admin/expertise-leadership" },
        { name: "Manufacturing-Facalities", path: "/admin/manufacturing-facalities" },
        { name: "Client-Success-Stories", path: "/admin/success-stories" },
      ],
    },
    {
      name: "Category & Product",
      path: "/admin/category",
      children: [
        { name: "Category", path: "/admin/category" },
        { name: "Product", path: "/admin/product" },
      ],
    },
    { name: "Contact Info", path: "/admin/contact-info" },
    { name: "Quality Inspection", path: "/admin/inspection-equipment" },
    { name: "Inquiry", path: "/admin/inquiry" },
    // { name: "Review", path: "/admin/review" },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logoutAdmin();
    } catch {
      // Redirect to login regardless of API response.
    } finally {
      setIsLoggingOut(false);
      navigate("/admin/login", { replace: true });
    }
  };

  return (
    <>
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-[110]">
        <div className="max-w-[1490px] mx-auto px-2 h-16 flex items-center justify-between">
          {/* Left: Branding & Search */}
          <div className="flex items-center gap-3">
            <Link to="/admin/aboutus" className="flex items-center gap-3 cursor-pointer">
              <div className="home-hero-bg-premium w-12 sm:w-16 h-12 sm:h-14 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-white/10 shadow-lg">
                <img 
                  src="/images/Screenshot_2026-03-18_182531-removebg-preview.png" 
                  alt="Nexturn Logo" 
                  className="h-8 sm:h-10 w-auto object-contain transform scale-[1.5]"
                />
              </div>
              <div className="flex flex-col items-center justify-center">
              <span className="text-[23px] sm:text-[27px] font-extrabold uppercase text-[#1B365D] leading-none tracking-normal inline-block transform scale-x-[0.95]" style={{ fontFamily: "'Syne', sans-serif" }}>
                NEXTURN
              </span>
              <span className="text-[10px] sm:text-[12.5px] font-bold text-[#1B365D]/85 uppercase tracking-[0.12em] whitespace-nowrap mt-1 pl-2">
                Componentcraft Pvt. Ltd.
              </span>
            </div>
            </Link>
          </div>


          {/* Center: Main Nav (Desktop) */}
          <div className="hidden lg:flex items-center gap-8 h-full">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.children &&
                  item.children.some(
                    (child) => location.pathname === child.path,
                  ));
              return (
                <div key={item.name} className="relative group h-full">
                  <Link
                    to={item.path}
                    className={`text-xs font-black uppercase tracking-[0.2em] h-full flex items-center gap-1 border-b-2 transition-all cursor-pointer ${isActive ? "border-black text-black" : "border-transparent text-black/50 hover:text-black"}`}
                  >
                    {item.name}
                    {item.children && (
                      <span className="material-symbols-outlined text-sm transition-transform group-hover:rotate-180">
                        expand_more
                      </span>
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.children && (
                    <div className="absolute top-16 left-0 w-56 bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                      <div className="space-y-1">
                        {item.children.map((child) => {
                          const isChildActive =
                            location.pathname === child.path;
                          return (
                            <Link
                              key={child.name}
                              to={child.path}
                              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isChildActive ? "bg-slate-900 text-white shadow-lg" : "text-slate-600 hover:bg-slate-50 hover:text-black"}`}
                            >
                              <span className="text-xs font-bold uppercase tracking-widest">
                                {child.name}
                              </span>
                              <span className="material-symbols-outlined text-sm">
                                arrow_forward
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Icons & Profile & Mobile Toggle */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* <button className="p-2 text-black/50 hover:bg-slate-100 rounded-full transition-colors relative cursor-pointer hidden sm:block">
              <span className="material-symbols-outlined">notifications</span>
              <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></div>
            </button> */}
            {/* <button className="p-2 text-black/50 hover:bg-slate-100 rounded-full transition-colors cursor-pointer hidden sm:block">
              <span className="material-symbols-outlined">account_circle</span>
            </button> */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-sm cursor-pointer">logout</span>
              {isLoggingOut ? "Signing out..." : "Sign Out"}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => {
                const nextState = !isMenuOpen;
                setIsMenuOpen(nextState);
                if (!nextState) setOpenMobileSubmenu(null);
              }}
              className="lg:hidden p-2 text-black hover:bg-slate-100 rounded-xl transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">
                {isMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[105] transition-opacity duration-300 lg:hidden ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-16 left-0 right-0 bg-white border-b border-slate-200 z-[106] lg:hidden transform transition-all duration-500 ease-in-out shadow-2xl ${isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 pointer-events-none"}`}
      >
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            const isAnyChildActive = item.children && item.children.some(child => location.pathname === child.path);
            const isSubmenuOpen = openMobileSubmenu === item.name;
            const isHighlighted = isActive || isAnyChildActive;

            return (
              <div key={item.name} className="space-y-1">
                <div 
                  className={`flex items-center justify-between rounded-2xl transition-all ${
                    isHighlighted ? "bg-slate-900 text-white shadow-xl" : "bg-slate-50 text-black/60 hover:bg-slate-100 hover:text-black"
                  }`}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 p-4"
                  >
                    <span className="text-xs font-black uppercase tracking-[0.2em]">
                      {item.name}
                    </span>
                  </Link>
                  {item.children && (
                    <button
                      onClick={() => setOpenMobileSubmenu(isSubmenuOpen ? null : item.name)}
                      className={`p-4 transition-all focus:outline-none ${
                        isHighlighted ? "text-white/40 hover:text-white" : "text-black/20 hover:text-black"
                      }`}
                    >
                      <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${isSubmenuOpen ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>
                  )}
                </div>

                {item.children && isSubmenuOpen && (
                  <div className="pl-6 space-y-2 py-2 border-l-2 border-slate-100 ml-4 animate-fade-in">
                    {item.children.map((child) => {
                      const isChildActive = location.pathname === child.path;
                      return (
                        <Link
                          key={child.name}
                          to={child.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                            isChildActive ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50 hover:text-black"
                          }`}
                        >
                          <span className="text-xs font-bold uppercase tracking-widest">
                            {child.name}
                          </span>
                          <span className="material-symbols-outlined text-base">
                            east
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-4 grid grid-cols-2 gap-4 border-t border-slate-100">
            <button className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-black/60 font-black text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-base">
                notifications
              </span>
              Alerts
            </button>
            <button className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-black/60 font-black text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-base">
                account_circle
              </span>
              Profile
            </button>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-3 p-4 bg-slate-900 rounded-2xl text-white font-black text-xs uppercase tracking-widest disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            {isLoggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminNavbar;
