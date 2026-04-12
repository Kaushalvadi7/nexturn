import { useState, useEffect } from "react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", flag: "🇮🇳" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "zh-CN", name: "Chinese", flag: "🇨🇳" },
];

const LanguageSelector = () => {
  const [selectedLang, setSelectedLang] = useState("en");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check for existing cookie on mount
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const currentTrans = getCookie('googtrans');
    if (currentTrans) {
      const lang = currentTrans.split('/').pop();
      setSelectedLang(lang);
    } else {
      // Browser language detection
      const browserLang = navigator.language.split('-')[0];
      const isSupported = languages.some(l => l.code === browserLang);
      if (isSupported && browserLang !== 'en') {
        // We don't auto-set it immediately to avoid sudden jumps, 
        // but we could if the user wanted. Let's just track it for now.
      }
    }
  }, []);

  const changeLanguage = (langCode) => {
    setSelectedLang(langCode);
    setIsOpen(false);
    
    // Google Translate cookie logic
    // Format: /source/target (source is usually 'en' for this site)
    const cookieValue = `/en/${langCode}`;
    document.cookie = `googtrans=${cookieValue}; path=/`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=.${window.location.hostname}`;
    
    // Persistence in localStorage as requested
    localStorage.setItem("selectedLanguage", langCode);
    
    // Refresh to apply
    window.location.reload();
  };

  const currentLanguage = languages.find(l => l.code === selectedLang) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-slate-200"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-[11px] font-bold text-black/70 uppercase tracking-tight hidden sm:block">
          {currentLanguage.name}
        </span>
        <span className={`material-symbols-outlined text-base transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[60]" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full mt-2 right-0 w-48 bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all text-left group ${
                    selectedLang === lang.code 
                      ? "bg-orange-50 text-accent" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-black"
                  }`}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">{lang.flag}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {lang.name}
                  </span>
                  {selectedLang === lang.code && (
                    <span className="material-symbols-outlined text-sm ml-auto">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
