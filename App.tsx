
import React, { useState, useCallback, useEffect } from 'react';
import { 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  History, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Info,
  Globe,
  Loader2,
  FileText,
  Activity,
  Zap,
  Cpu
} from 'lucide-react';
import { analyzeNews } from './services/geminiService';
import { AnalysisResult, HistoryItem, Verdict } from './types';
import VerdictBadge from './components/VerdictBadge';
import MetricGauge from './components/MetricGauge';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('verinews_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = useCallback((res: AnalysisResult, title: string) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      title: title.slice(0, 50) + (title.length > 50 ? '...' : ''),
      verdict: res.verdict
    };
    const updatedHistory = [newItem, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('verinews_history', JSON.stringify(updatedHistory));
  }, [history]);

  const handleAnalyze = async () => {
    if (!inputText.trim() || inputText.length < 20) {
      setError("Input insufficient. Provide a detailed news segment (min. 20 chars).");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeNews(inputText);
      setResult(analysis);
      saveToHistory(analysis, inputText);
    } catch (err: any) {
      setError(err.message || "System failure during deep scan.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('verinews_history');
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-blue-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tighter uppercase neon-text-cyan">
                VeriNews <span className="text-cyan-400">Core</span>
              </span>
              <div className="text-[10px] text-cyan-500 font-mono tracking-widest leading-none">AI INTEL UNIT</div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-8">
            <button className="text-slate-400 hover:text-cyan-400 text-xs font-bold tracking-widest uppercase transition-colors">Analyzer</button>
            <button className="text-slate-400 hover:text-cyan-400 text-xs font-bold tracking-widest uppercase transition-colors">Threat Map</button>
            <button className="text-slate-400 hover:text-cyan-400 text-xs font-bold tracking-widest uppercase transition-colors">Documentation</button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">System Active</span>
              <span className="text-[8px] text-slate-500 font-mono">LATENCY: 14ms</span>
            </div>
            <button className="bg-blue-600/10 border border-blue-500/50 text-blue-400 px-4 py-2 rounded-md font-bold text-xs hover:bg-blue-500/20 transition-all uppercase tracking-widest">
              Access Vault
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          <section className="glass-panel p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Activity className="w-24 h-24 text-blue-400" />
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Search className="w-4 h-4 text-blue-400" />
              </div>
              <h2 className="text-lg font-bold text-slate-100 uppercase tracking-widest">Input Stream</h2>
            </div>
            
            <div className="relative group">
              <textarea
                className="w-full h-56 p-6 rounded-xl border border-slate-800 bg-slate-950/50 focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all resize-none text-slate-200 font-mono text-sm placeholder:text-slate-700 leading-relaxed"
                placeholder="0x: Enter text block for linguistic authentication..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="absolute bottom-4 right-4 text-[10px] text-slate-600 font-mono">
                CHARS: {inputText.length}
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-400 text-xs font-bold uppercase tracking-wider animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !inputText.trim()}
                className="flex-[2] bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-4 px-8 rounded-xl neon-glow-blue hover:from-blue-500 hover:to-cyan-400 disabled:from-slate-800 disabled:to-slate-900 disabled:shadow-none transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Scanning Bit-Patterns...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-current" />
                    Execute Deep Scan
                  </>
                )}
              </button>
              <button 
                onClick={() => setInputText('')}
                className="flex-1 px-8 py-4 border border-slate-800 rounded-xl font-bold text-slate-400 hover:bg-slate-900 transition-colors uppercase tracking-widest text-sm"
              >
                Reset
              </button>
            </div>
          </section>

          {/* Result Hud */}
          {result && !isAnalyzing && (
            <section className="glass-panel p-8 rounded-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xl font-bold text-slate-100 uppercase tracking-tighter">Analysis Vector Result</h3>
                  </div>
                  <p className="text-slate-500 text-xs font-mono tracking-wider">REF_ID: #{(Math.random()*1000000).toFixed(0)} | VERIFIED_GEN_2.5</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Trust Index</div>
                    <div className="text-xl font-black text-cyan-400 font-mono leading-none">{result.confidence}%</div>
                  </div>
                  <VerdictBadge verdict={result.verdict} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {result.metrics.map((m, idx) => (
                  <MetricGauge key={idx} {...m} />
                ))}
              </div>

              <div className="bg-blue-500/5 p-6 rounded-xl border border-blue-500/10 mb-8 relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <h4 className="font-bold text-blue-400 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Intel Summary
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed font-medium">
                  {result.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-orange-500" />
                    TF-IDF Tokens Identified
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.linguisticPatterns.map((p, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-900 text-orange-400 text-[10px] font-mono font-bold rounded border border-orange-500/20 uppercase">
                        [{p.replace(/\s+/g, '_')}]
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    Logical Discrepancies
                  </h4>
                  <ul className="space-y-2">
                    {result.logicalFallacies.map((f, i) => (
                      <li key={i} className="text-xs text-slate-400 flex items-start gap-3 group">
                        <span className="text-blue-500 mt-0.5 group-hover:animate-pulse">▶</span>
                        <span className="font-mono">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {result.sources.length > 0 && (
                <div className="mt-10 pt-8 border-t border-slate-800">
                  <h4 className="font-bold text-slate-500 text-[10px] uppercase tracking-widest mb-5">Grounding Matrix (External)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.sources.map((source, idx) => (
                      <a 
                        key={idx}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-slate-950/40 border border-slate-800 rounded-lg hover:border-blue-500/40 hover:bg-blue-500/5 group flex items-center justify-between transition-all"
                      >
                        <div className="flex flex-col pr-4 overflow-hidden">
                          <span className="text-xs font-bold text-slate-200 line-clamp-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{source.title}</span>
                          <span className="text-[10px] text-slate-600 font-mono truncate">{source.uri}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-blue-400 flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {!result && !isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-2xl border-dashed border-slate-800">
              <div className="w-24 h-24 bg-blue-500/5 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ping"></div>
                <Globe className="w-10 h-10 text-blue-500/40" />
              </div>
              <h3 className="text-lg font-bold text-slate-300 uppercase tracking-widest mb-3">System Standby</h3>
              <p className="text-slate-600 max-w-sm text-sm font-medium">
                Deep neural parsing awaiting input buffer. Deploy news content to initiate veracity triangulation.
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <section className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-300 flex items-center gap-2 uppercase tracking-widest text-xs">
                <History className="w-4 h-4 text-blue-500" />
                Session History
              </h3>
              {history.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="text-slate-600 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="group cursor-pointer p-3 rounded-lg border border-transparent hover:border-slate-800 hover:bg-slate-900/40 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-grow overflow-hidden">
                        <p className="text-xs font-bold text-slate-400 line-clamp-1 mb-1.5 group-hover:text-cyan-400 transition-colors font-mono">
                          &gt; {item.title}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] text-slate-600 font-bold font-mono">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                            item.verdict === Verdict.REAL ? 'bg-emerald-500/10 text-emerald-500' : 
                            item.verdict === Verdict.FAKE ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {item.verdict}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-700 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Logs Empty</p>
              </div>
            )}
          </section>

          <section className="bg-gradient-to-br from-blue-900 to-indigo-950 p-6 rounded-2xl border border-blue-500/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-cyan-500/20 transition-all duration-1000"></div>
            <h3 className="font-bold text-white mb-3 flex items-center gap-2 text-sm uppercase tracking-widest">
              <Zap className="w-4 h-4 text-cyan-400" />
              Advanced Intel
            </h3>
            <p className="text-slate-400 text-xs mb-6 leading-relaxed font-medium">
              Access real-time global news monitoring and high-confidence sentiment mapping.
            </p>
            <button className="w-full bg-cyan-500 text-slate-950 font-black py-3 rounded-lg hover:bg-cyan-400 transition-all text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/20">
              Upgrade System
            </button>
          </section>

          <div className="p-5 border border-slate-800 rounded-xl bg-slate-950/30">
            <p className="text-[9px] text-cyan-500/50 leading-normal uppercase font-black tracking-widest mb-3">AI Architecture</p>
            <h4 className="text-[10px] font-bold text-slate-400 mb-2 uppercase">Neural Weighting (TF-IDF)</h4>
            <p className="text-[10px] text-slate-600 leading-relaxed font-mono">
              The system calculates Term Frequency-Inverse Document Frequency to isolate low-entropy linguistic anomalies typically absent in neutral reporting.
            </p>
          </div>
        </aside>
      </main>

      <footer className="border-t border-slate-900 py-10 mt-12 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-3 opacity-50">
            <ShieldCheck className="text-blue-500 w-5 h-5" />
            <span className="font-black text-slate-300 tracking-tighter uppercase text-sm">VeriNews <span className="text-blue-500">Node_71</span></span>
          </div>
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
            ST_001.2025 // ENCRYPTED ANALYTICS UNIT // ALL RIGHTS RESERVED
          </p>
          <div className="flex items-center space-x-8">
            <a href="#" className="text-slate-600 hover:text-cyan-500 text-[10px] font-bold uppercase tracking-widest transition-colors">Protocol</a>
            <a href="#" className="text-slate-600 hover:text-cyan-500 text-[10px] font-bold uppercase tracking-widest transition-colors">Security</a>
            <a href="#" className="text-slate-600 hover:text-cyan-500 text-[10px] font-bold uppercase tracking-widest transition-colors">API_v4</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
