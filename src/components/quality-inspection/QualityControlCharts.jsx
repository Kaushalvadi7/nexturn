import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';

const QualityControlCharts = () => {
  const [activeChart, setActiveChart] = useState('spc'); // 'spc' or 'defect'

  const spcData = [
    { name: 'B001', value: 10.02 },
    { name: 'B002', value: 9.98 },
    { name: 'B003', value: 10.01 },
    { name: 'B004', value: 10.03 },
    { name: 'B005', value: 9.99 },
    { name: 'B006', value: 10.00 },
    { name: 'B007', value: 10.02 },
    { name: 'B008', value: 9.97 },
  ];

  const lcl = 9.95;
  const target = 10.00;
  const ucl = 10.05;

  const defectData = [
    { name: 'Dimensional', count: 3 },
    { name: 'Surface', count: 7 },
    { name: 'Thread', count: 2 },
    { name: 'Material', count: 1 },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-8 md:p-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <h2 className="text-2xl font-bold text-primary font-display">
              Quality Control Charts
            </h2>
            <div className="flex p-1 rounded-xl gap-2">
              <div className="px-6 py-2.5 rounded-lg text-sm font-bold bg-[#203657] text-white shadow-sm">
                SPC Chart
              </div>
            </div>
          </div>

          {/* Chart Container */}
          <div className="h-[400px] w-full mb-12">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={spcData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    domain={[9.9, 10.1]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    dx={-10}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-xl outline-none">
                            <p className="text-sm font-bold text-primary mb-2">{label}</p>
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-red-500">
                                Upper Control Limit : <span className="font-medium">{ucl}</span>
                              </p>
                              <p className="text-xs font-bold text-green-600">
                                Target : <span className="font-medium">{target}</span>
                              </p>
                              <p className="text-xs font-bold text-red-500">
                                Lower Control Limit : <span className="font-medium">{lcl}</span>
                              </p>
                              <p className="text-xs font-bold text-[#203657] pt-1 border-t border-slate-100 mt-1">
                                Actual Measurement : <span className="font-medium">{payload[0].value}</span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  
                  {/* Reference Lines */}
                  <ReferenceLine y={ucl} stroke="#EF4444" strokeDasharray="5 5" label={{ position: 'right', value: 'UCL', fill: '#EF4444', fontSize: 10 }} />
                  <ReferenceLine y={target} stroke="#10B981" strokeDasharray="5 5" label={{ position: 'right', value: 'Target', fill: '#10B981', fontSize: 10 }} />
                  <ReferenceLine y={lcl} stroke="#EF4444" strokeDasharray="5 5" label={{ position: 'right', value: 'LCL', fill: '#EF4444', fontSize: 10 }} />

                  <Line
                    name="Actual Measurement"
                    type="monotone"
                    dataKey="value"
                    stroke="#203657"
                    strokeWidth={3}
                    dot={{ fill: '#203657', r: 6, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8 }}
                  />
                  
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    content={({ payload }) => (
                      <div className="flex justify-center flex-wrap gap-4 sm:gap-8 mt-8 text-[10px] sm:text-xs font-bold text-slate-600">
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-0.5 bg-red-500 border-t-2 border-dashed border-red-500"></div>
                           <span>Upper Control Limit</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-0.5 bg-green-500 border-t-2 border-dashed border-green-500"></div>
                           <span>Target</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-0.5 bg-red-500 border-t-2 border-dashed border-red-500"></div>
                           <span>Lower Control Limit</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-primary"></div>
                           <span>Actual Measurement</span>
                        </div>
                      </div>
                    )}
                  />
                </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Callout */}
          <div className="bg-[#F8FAFC] p-6 rounded-xl border border-slate-100 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
               <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
             <p className="text-slate-600 text-sm leading-relaxed">
                Control charts monitor dimensional stability across production batches. All measurements remain within control limits (±0.05mm tolerance), demonstrating consistent process capability.
             </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualityControlCharts;
