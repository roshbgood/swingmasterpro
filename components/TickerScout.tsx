import React, { useState } from 'react';
import { Search, Loader2, Newspaper, TrendingUp, AlertTriangle } from 'lucide-react';
import { analyzeTicker } from '../services/gemini';
import { AnalysisResult } from '../types';

const TickerScout: React.FC = () => {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      // In a real scenario, this would check if apiKey is present
      if (!process.env.API_KEY) {
         // Simulate demo data if no key for UI preview
         /* 
         setTimeout(() => {
           setData({
             summary: "Demo Mode: TSLA showing strength above 200 SMA. Earnings expected in 10 days.",
             sentiment: 'bullish',
             catalysts: ['Q3 Earnings Report (Est. 10/18)', 'Robotaxi Event follow-up'],
             newsLinks: [{title: 'Tesla stock jumps on upgrades', url: '#', source: 'FinanceNews'}]
           });
           setLoading(false);
         }, 1500);
         return; 
         */
      }

      const result = await analyzeTicker(ticker, 'daily');
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to analyze ticker. Check API Key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 text-purple-400">
        <Search size={24} />
        <h2 className="text-xl font-bold text-white">Ticker Scout AI</h2>
      </div>

      <form onSubmit={handleSearch} className="relative mb-6">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="Enter Symbol (e.g. NVDA)"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none uppercase font-bold tracking-wider"
        />
        <button
          type="submit"
          disabled={loading || !ticker}
          className="absolute right-2 top-2 bg-purple-600 hover:bg-purple-700 text-white p-1.5 rounded-md transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
        </button>
      </form>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-300 p-4 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {data && (
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
          <div className={`p-3 rounded-lg border ${
            data.sentiment === 'bullish' ? 'bg-emerald-900/20 border-emerald-500/30' : 
            data.sentiment === 'bearish' ? 'bg-red-900/20 border-red-500/30' : 
            'bg-slate-700/30 border-slate-600'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className={data.sentiment === 'bullish' ? 'text-emerald-400' : 'text-slate-400'} />
              <span className="font-bold text-sm text-slate-200 uppercase">{data.sentiment} Sentiment</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {data.summary}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <AlertTriangle size={12} /> Upcoming Catalysts
            </h3>
            <ul className="space-y-2">
              {data.catalysts.map((cat, i) => (
                <li key={i} className="text-sm text-slate-300 bg-slate-900/50 p-2 rounded border-l-2 border-purple-500">
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Newspaper size={12} /> Recent Sources
            </h3>
            <ul className="space-y-2">
              {data.newsLinks.map((link, i) => (
                <li key={i}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="block p-2 rounded hover:bg-slate-700/50 transition-colors group"
                  >
                    <p className="text-sm text-blue-400 group-hover:underline truncate">{link.title}</p>
                    <p className="text-xs text-slate-500">{link.source || 'Web Source'}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!data && !loading && !error && (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-600 p-8 border-2 border-dashed border-slate-800 rounded-lg">
          <Search size={48} className="mb-4 opacity-50" />
          <p className="text-sm text-center">Enter a ticker to scan for catalysts and sentiment.</p>
        </div>
      )}
    </div>
  );
};

const ArrowRight = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export default TickerScout;
