
import React from 'react';
import { Verdict } from '../types';

interface Props {
  verdict: Verdict;
}

const VerdictBadge: React.FC<Props> = ({ verdict }) => {
  const getColors = () => {
    switch (verdict) {
      case Verdict.REAL:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]";
      case Verdict.LIKELY_REAL:
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]";
      case Verdict.MIXED:
        return "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]";
      case Verdict.LIKELY_FAKE:
        return "bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]";
      case Verdict.FAKE:
        return "bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <span className={`px-4 py-1.5 rounded-md text-xs font-bold border uppercase tracking-widest ${getColors()}`}>
      {verdict}
    </span>
  );
};

export default VerdictBadge;
