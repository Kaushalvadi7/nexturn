import { useEffect, useRef, useState } from "react";
import { getCertificates, getCompanyEmployees } from "../../lib/api";

const ExpertiseLeadership = () => {
  const sectionRef = useRef(null);
  const observerRef = useRef(null);
  const [certifications, setCertifications] = useState([]);
  const [isLoadingCerts, setIsLoadingCerts] = useState(true);
  const [certError, setCertError] = useState("");
  const [leaders, setLeaders] = useState([]);
  const [isLoadingLeaders, setIsLoadingLeaders] = useState(true);
  const [leaderError, setLeaderError] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;

    if (sectionRef.current) {
      const elements = sectionRef.current.querySelectorAll(".reveal-on-scroll");
      elements.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let isActive = true;
    const fetchCerts = async () => {
      setIsLoadingCerts(true);
      setCertError("");
      try {
        const data = await getCertificates();
        if (isActive) {
          setCertifications(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (isActive) {
          setCertError(error?.message || "Failed to load certifications.");
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

  useEffect(() => {
    let isActive = true;
    const fetchLeaders = async () => {
      setIsLoadingLeaders(true);
      setLeaderError("");
      try {
        const data = await getCompanyEmployees();
        if (!isActive) return;
        const normalized = (Array.isArray(data) ? data : []).map((row) => ({
          id: row.id,
          name: row.name || "",
          role: row.role || "",
          education: row.education || "",
          experience: row.experience || "",
          image: row.image || null,
        }));
        setLeaders(normalized);
      } catch (error) {
        if (!isActive) return;
        console.error("Failed to load leadership profiles", error);
        setLeaders([]);
        setLeaderError(error?.message || "Failed to load leadership profiles.");
      } finally {
        if (isActive) setIsLoadingLeaders(false);
      }
    };

    fetchLeaders();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const observer = observerRef.current;
    if (!observer || !sectionRef.current) return;
    const elements = sectionRef.current.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));
  }, [leaders.length, isLoadingLeaders]);

  return (
    <section ref={sectionRef} className="pt-8 pb-5 bg-white overflow-hidden font-['Source_Sans_3',sans-serif]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Leadership Header */}
        <div className=" scroll-mt-24 reveal-on-scroll reveal-hidden text-center mb-8 lg:mb-10 max-w-7xl mx-auto ">
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight
">
            Engineering Expertise & Leadership
          </h2>
          <p className="text-[18px] text-slate-600 leading-relaxed">
            Our team combines decades of precision manufacturing experience with deep understanding of 
            international quality standards. Every member is committed to delivering engineering excellence.
          </p>
        </div>

        {/* Leadership Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {leaderError && (
            <div className="md:col-span-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-bold text-red-600">
              {leaderError}
            </div>
          )}
          {isLoadingLeaders && (
            <div className="md:col-span-3 rounded-xl bg-white border border-slate-200 px-4 py-3 text-xs font-bold text-slate-500">
              Loading leadership profiles...
            </div>
          )}
          {!isLoadingLeaders && leaders.length === 0 && !leaderError && (
            <div className="md:col-span-3 text-center text-sm font-semibold text-slate-500">
              No leadership profiles available.
            </div>
          )}

          {leaders.map((leader, index) => (
            <div 
              key={leader.id || index}
              className="reveal-on-scroll reveal-hidden flex flex-col bg-[#f4f6f8] rounded-[1.5rem] overflow-hidden hover:shadow-2xl hover:shadow-[#1b365d]/5 hover:border-[#1b365d] border border-transparent transition-all duration-500 group"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden bg-slate-200">
                {leader.image ? (
                  <img 
                    src={leader.image} 
                    alt={leader.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-6xl">account_circle</span>
                  </div>
                )}
              </div>
              <div className="px-6 py-3 space-y-2">
                <div className="min-w-0">
                  <h3 className="text-2xl font-black text-[#1b365d] mb-2 break-words">{leader.name}</h3>
                  <p className="text-[#e17000] font-black text-sm uppercase tracking-wider break-words">{leader.role}</p>
                </div>
                <div className="space-y-4 min-w-0">
                  {leader.education && (
                    <div className="flex gap-4 items-start">
                      <span className="material-symbols-outlined text-[#1b365d] text-xl font-light">
                        engineering
                      </span>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed break-words whitespace-pre-wrap flex-1 min-w-0">
                        {leader.education}
                      </p>
                    </div>
                  )}
                  {leader.experience && (
                    <div className="flex gap-4 items-start">
                      <span className="material-symbols-outlined text-[#1b365d] text-xl font-light">
                        work_history
                      </span>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed break-words whitespace-pre-wrap flex-1 min-w-0">
                        {leader.experience}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Structure */}
        {/* <div className="text-center mb-16 reveal-on-scroll reveal-hidden">
          <h3 className="text-3xl md:text-4xl font-black text-[#1b365d] tracking-tight">
            Our Team Structure
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {teams.map((team, index) => (
            <div 
              key={index}
              className="reveal-on-scroll reveal-hidden bg-[#f4f6f8] p-10 rounded-[1.5rem] flex flex-col items-center text-center hover:bg-white hover:shadow-xl hover:border-[#1b365d] border border-transparent transition-all duration-500 group"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 border border-slate-100 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[#1b365d] text-3xl font-light">
                  {team.icon}
                </span>
              </div>
              <h4 className="text-xl font-black text-[#1b365d] mb-2">{team.name}</h4>
              <p className="text-[#e17000] font-black text-sm mb-4">{team.count}</p>
              <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed">
                {team.description}
              </p>
            </div>
          ))}
        </div> */}

        {/* Certifications Section */}
        <div className="reveal-on-scroll reveal-hidden bg-[#f4f6f8] rounded-[2rem] p-6 md:p-10 border border-slate-100">
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight
">
              Certifications & Compliance
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto mb-8">
            {certError && (
              <div className="md:col-span-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-bold text-red-600">
                {certError}
              </div>
            )}
            {isLoadingCerts && (
              <div className="md:col-span-2 rounded-xl bg-white border border-slate-200 px-4 py-3 text-xs font-bold text-slate-500">
                Loading certifications...
              </div>
            )}
            {!isLoadingCerts && certifications.length === 0 && !certError && (
              <div className="md:col-span-2 text-center text-sm font-semibold text-slate-500">
                No certifications available.
              </div>
            )}
            {certifications.map((cert, index) => (
              <div key={index} className="bg-white py-3 px-6 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                 <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-green-600 text-2xl">
                    workspace_premium
                  </span>
                </div>
                <p className="text-[#1b365d] font-bold text-sm md:text-base leading-tight">
                  {cert.name || cert.title}
                </p>
              </div>
            ))}
          </div>

          <p className="max-w-3xl mx-auto text-slate-400 text-sm font-medium leading-relaxed text-center">
            Our commitment to quality and compliance ensures that every component meets international standards and customer specifications. 
            Regular audits and continuous improvement initiatives maintain our certification status.
          </p>
        </div>

      </div>
    </section>
  );
};

export default ExpertiseLeadership;
