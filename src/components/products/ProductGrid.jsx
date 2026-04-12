import { useState } from "react";

const ProductGrid = () => {
  const [selectedMaterials, setSelectedMaterials] = useState(["CW617N"]);
  const [showTable, setShowTable] = useState(true);

  const materials = [
    {
      id: "CW617N",
      name: "CW617N Metal",
      density: "8.5 g/cm³",
      tensile: "380-450 MPa",
      hardness: "100-130 HB",
      machinability: "90% (Excellent)",
      corrosion: "Good",
    },
    {
      id: "C360",
      name: "C360 Free-Cutting",
      density: "8.5 g/cm³",
      tensile: "340-480 MPa",
      hardness: "110-150 HB",
      machinability: "100% (Standard)",
      corrosion: "Fair",
    },
    {
      id: "C385",
      name: "C385 Architectural",
      density: "8.47 g/cm³",
      tensile: "350-420 MPa",
      hardness: "90-120 HB",
      machinability: "90%",
      corrosion: "Good",
    },
    {
      id: "C464",
      name: "C464 Naval Metal",
      density: "8.41 g/cm³",
      tensile: "380-520 MPa",
      hardness: "100-140 HB",
      machinability: "30%",
      corrosion: "Excellent",
    },
    {
      id: "C272",
      name: "C272 Yellow Metal",
      density: "8.47 g/cm³",
      tensile: "340-420 MPa",
      hardness: "80-110 HB",
      machinability: "90%",
      corrosion: "Good",
    },
    {
      id: "C230",
      name: "C230 Red Metal",
      density: "8.75 g/cm³",
      tensile: "280-350 MPa",
      hardness: "70-100 HB",
      machinability: "30%",
      corrosion: "Excellent",
    },
  ];

  const toggleMaterial = (id) => {
    setSelectedMaterials((prev) => {
      if (prev.includes(id)) {
        return prev.filter((m) => m !== id);
      }
      if (prev.length < 3) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const selectedData = materials.filter((m) =>
    selectedMaterials.includes(m.id),
  );

  return (
    <section className="px-CNC o4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto mb-16">
      <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-sm space-y-10">
        {/* Grid Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-4 text-[#1b365d]">
              <span className="material-symbols-outlined font-black">
                balance
              </span>
              <h2 className="text-xl font-black tracking-tight">
                Compare Materials
              </h2>
            </div>
            <p className="text-slate-400 text-xs font-medium">
              Select up to 3 materials to compare their properties
            </p>
          </div>
          <button
            onClick={() => setSelectedMaterials([])}
            className="flex items-center gap-2 text-[#1b365d] text-[10px] font-black uppercase tracking-widest hover:text-[#e17000] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">cancel</span>
            Clear Selection
          </button>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {materials.map((item, index) => (
            <div
              key={index}
              onClick={() => toggleMaterial(item.id)}
              className={`p-6 rounded-2xl border transition-all duration-500 cursor-pointer group relative ${
                selectedMaterials.includes(item.id)
                  ? "bg-white border-cyan-600 shadow-xl scale-[1.02]"
                  : "bg-[#fafbfc] border-slate-100 shadow-sm hover:shadow-lg hover:border-[#1b365d]/20"
              }`}
            >
              <h3 className="text-base font-black text-[#1b365d] mb-1">
                {item.name}
              </h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                {item.id}
              </p>

              {selectedMaterials.includes(item.id) && (
                <div className="absolute top-6 right-6 w-5 h-5 bg-cyan-600 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[14px] font-black">
                    check
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Comparison Table Toggle */}
        {selectedMaterials.length > 0 && (
          <div className="space-y-10 pt-4">
            <button
              onClick={() => setShowTable(!showTable)}
              className="w-full bg-[#1b365d] hover:bg-[#12243d] text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 transition-all shadow-lg cursor-pointer"
            >
              {showTable ? "Hide Comparison Table" : "Show Comparison Table"}
              <span
                className={`material-symbols-outlined transition-transform duration-300 ${showTable ? "rotate-180" : ""}`}
              >
                expand_more
              </span>
            </button>

            {showTable && (
              <div className="overflow-x-auto animate-fade-in-down">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="py-6 px-4 text-sm font-black text-[#1b365d] border-b border-slate-100 w-1/4">
                        Property
                      </th>
                      {selectedData.map((m) => (
                        <th
                          key={m.id}
                          className="py-6 px-4 border-b border-slate-100"
                        >
                          <div className="space-y-1">
                            <span className="block text-sm font-black text-[#1b365d]">
                              {m.name}
                            </span>
                            <span className="block text-xs text-slate-400 font-bold uppercase tracking-widest">
                              {m.id}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { label: "Density", key: "density" },
                      { label: "Tensile Strength", key: "tensile" },
                      { label: "Hardness", key: "hardness" },
                      { label: "Machinability", key: "machinability" },
                      { label: "Corrosion Resistance", key: "corrosion" },
                    ].map((row) => (
                      <tr
                        key={row.key}
                        className="group hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-6 px-4 text-sm font-black text-[#1b365d]">
                          {row.label}
                        </td>
                        {selectedData.map((m) => (
                          <td
                            key={`${m.id}-${row.key}`}
                            className="py-6 px-4 text-sm text-slate-500 font-medium"
                          >
                            {m[row.key] || "N/A"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
