
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Props {
  name: string;
  score: number;
  description: string;
}

const MetricGauge: React.FC<Props> = ({ name, score, description }) => {
  const data = [
    { value: score },
    { value: 100 - score }
  ];

  const getColor = (val: number) => {
    if (val > 80) return "#10b981"; // Emerald
    if (val > 50) return "#06b6d4"; // Cyan
    return "#f43f5e"; // Rose
  };

  return (
    <div className="glass-panel p-5 rounded-xl flex flex-col items-center text-center transition-transform hover:scale-[1.02] duration-300">
      <div className="w-20 h-20 mb-3 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={28}
              outerRadius={38}
              startAngle={90}
              endAngle={450}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={getColor(score)} className="drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]" />
              <Cell fill="#1e293b" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-slate-100 font-mono tracking-tighter">{score}%</span>
        </div>
      </div>
      <h4 className="text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">{name}</h4>
      <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">{description}</p>
    </div>
  );
};

export default MetricGauge;
