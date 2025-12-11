import React from 'react';
import { Shield, TrendingUp, Activity, Target, BookOpen, Zap, PlusCircle, Maximize2 } from 'lucide-react';

const RiskManagementSystem: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-cyan-400" />
            Strategy Rules
        </h2>
        <p className="text-slate-400">
          Reference guide for <a href="https://x.com/jfsrev" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">Jeff Sun's</a> systematic approach to stops, profit taking, and management.
        </p>
      </div>

      {/* TOP SECTION: VISUALIZATION */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 overflow-hidden shadow-lg">
         <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Strategy Timeline</h3>
            <span className="text-xs text-slate-500">Day 0 to Day 4+</span>
         </div>
         <div className="w-full overflow-x-auto pb-2 custom-scrollbar">
           <svg viewBox="0 0 800 160" className="w-full min-w-[700px] h-auto font-sans">
              {/* Arrow Lines */}
              <line x1="160" y1="70" x2="220" y2="70" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow)" />
              <line x1="380" y1="70" x2="440" y2="70" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow)" />
              <line x1="600" y1="70" x2="660" y2="70" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow)" />
              
              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#475569" />
                </marker>
              </defs>

              {/* Node 1: Day 0 */}
              <g transform="translate(0, 10)">
                 <rect width="160" height="120" rx="8" fill="#10b981" fillOpacity="0.1" stroke="#10b981" strokeWidth="2" />
                 <text x="80" y="25" textAnchor="middle" fill="#10b981" fontWeight="bold" fontSize="14">Day 0: ENTRY</text>
                 <line x1="10" y1="35" x2="150" y2="35" stroke="#10b981" strokeOpacity="0.3" />
                 <text x="80" y="60" textAnchor="middle" fill="#cbd5e1" fontSize="11">3 Stops (33% ea)</text>
                 <text x="80" y="80" textAnchor="middle" fill="#94a3b8" fontSize="10">at 33%, 66%</text>
                 <text x="80" y="95" textAnchor="middle" fill="#94a3b8" fontSize="10">&amp; Final (LoD)</text>
              </g>

              {/* Node 2: Day 0-2 */}
              <g transform="translate(220, 10)">
                 <rect width="160" height="120" rx="8" fill="#3b82f6" fillOpacity="0.1" stroke="#3b82f6" strokeWidth="2" />
                 <text x="80" y="25" textAnchor="middle" fill="#3b82f6" fontWeight="bold" fontSize="14">Day 0-2</text>
                 <line x1="10" y1="35" x2="150" y2="35" stroke="#3b82f6" strokeOpacity="0.3" />
                 <text x="80" y="60" textAnchor="middle" fill="#cbd5e1" fontSize="11">Profit Taking</text>
                 <text x="80" y="80" textAnchor="middle" fill="#94a3b8" fontSize="10">If &gt;2R Profit:</text>
                 <text x="80" y="95" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="11">Sell 33%</text>
              </g>

              {/* Node 3: Day 3 */}
              <g transform="translate(440, 10)">
                 <rect width="160" height="120" rx="8" fill="#f97316" fillOpacity="0.1" stroke="#f97316" strokeWidth="2" />
                 <text x="80" y="25" textAnchor="middle" fill="#f97316" fontWeight="bold" fontSize="14">Day 3</text>
                 <line x1="10" y1="35" x2="150" y2="35" stroke="#f97316" strokeOpacity="0.3" />
                 <text x="80" y="60" textAnchor="middle" fill="#cbd5e1" fontSize="11">Adjustment</text>
                 <text x="80" y="80" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="11">Sell 33%</text>
                 <text x="80" y="95" textAnchor="middle" fill="#94a3b8" fontSize="10">Move Stops to</text>
                 <text x="80" y="110" textAnchor="middle" fill="#94a3b8" fontSize="10">Breakeven</text>
              </g>

               {/* Node 4: Day 4+ */}
               <g transform="translate(660, 10)">
                 <rect width="140" height="120" rx="8" fill="#a855f7" fillOpacity="0.1" stroke="#a855f7" strokeWidth="2" />
                 <text x="70" y="25" textAnchor="middle" fill="#a855f7" fontWeight="bold" fontSize="14">Day 4+</text>
                 <line x1="10" y1="35" x2="130" y2="35" stroke="#a855f7" strokeOpacity="0.3" />
                 <text x="70" y="60" textAnchor="middle" fill="#cbd5e1" fontSize="11">Trend Follow</text>
                 <text x="70" y="80" textAnchor="middle" fill="#94a3b8" fontSize="10">Mental Stop:</text>
                 <text x="70" y="95" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="11">10-MA</text>
              </g>
           </svg>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Day 0 */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="bg-cyan-900/20 p-4 border-b border-slate-700 flex items-center gap-3">
                    <div className="bg-cyan-500 text-white font-bold px-2 py-1 rounded text-xs">DAY 0</div>
                    <h3 className="font-bold text-white">Entry & Initial Stops</h3>
                </div>
                <div className="p-5 space-y-3">
                    <div className="flex gap-3">
                        <Shield className="h-5 w-5 text-rose-400 shrink-0" />
                        <div>
                            <p className="text-sm text-slate-300 font-medium">Establish 3 Stops</p>
                            <p className="text-xs text-slate-400 mt-1">
                                Split position into 3 equal parts (33% each). Set stops at 33%, 66%, and 100% of the distance to your Final Stop (LoD).
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Day 0-2 */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="bg-blue-900/20 p-4 border-b border-slate-700 flex items-center gap-3">
                    <div className="bg-blue-500 text-white font-bold px-2 py-1 rounded text-xs">DAY 0-2</div>
                    <h3 className="font-bold text-white">Profit Taking</h3>
                </div>
                <div className="p-5 space-y-3">
                    <div className="flex gap-3">
                        <TrendingUp className="h-5 w-5 text-emerald-400 shrink-0" />
                        <div>
                            <p className="text-sm text-slate-300 font-medium">The 2R Rule</p>
                            <p className="text-xs text-slate-400 mt-1">
                                If profit exceeds <strong>2R</strong> (2x Risk), immediately sell <strong>33%</strong> of the position. 
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Activity className="h-5 w-5 text-slate-400 shrink-0" />
                        <div>
                            <p className="text-sm text-slate-300 font-medium">Adjustment</p>
                            <p className="text-xs text-slate-400 mt-1">
                                Maintain all 3 stop levels but adjust their sizes to match the remaining net balance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Day 3 */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="bg-orange-900/20 p-4 border-b border-slate-700 flex items-center gap-3">
                    <div className="bg-orange-500 text-white font-bold px-2 py-1 rounded text-xs">DAY 3</div>
                    <h3 className="font-bold text-white">Adjustment</h3>
                </div>
                <div className="p-5 space-y-3">
                    <div className="flex gap-3">
                        <Target className="h-5 w-5 text-orange-400 shrink-0" />
                        <div>
                            <p className="text-sm text-slate-300 font-medium">Size Down</p>
                            <p className="text-xs text-slate-400 mt-1">
                                Sell <strong>33%</strong> of position size (if not already taken). 
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Shield className="h-5 w-5 text-emerald-400 shrink-0" />
                        <div>
                            <p className="text-sm text-slate-300 font-medium">Breakeven</p>
                            <p className="text-xs text-slate-400 mt-1">
                                Consolidate ALL remaining stops to a single stop at <strong>Breakeven</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Day 4+ */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="bg-purple-900/20 p-4 border-b border-slate-700 flex items-center gap-3">
                    <div className="bg-purple-500 text-white font-bold px-2 py-1 rounded text-xs">DAY 4+</div>
                    <h3 className="font-bold text-white">Trend Following (10-MA)</h3>
                </div>
                <div className="p-5 space-y-3">
                    <div className="flex gap-3">
                        <Activity className="h-5 w-5 text-purple-400 shrink-0" />
                        <div>
                            <p className="text-sm text-slate-300 font-medium">Mental Stop</p>
                            <p className="text-xs text-slate-400 mt-1">
                                Use the <strong>10-Day Moving Average</strong> as a mental stop. Do not exit unless price closes below it.
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-700/50 mt-2">
                         <p className="text-xs font-bold text-slate-400 mb-2">IF CLOSE &lt; 10-MA (e.g. Day 8):</p>
                         <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside">
                             <li>Stop remains at Breakeven for Day 9.</li>
                             <li>Wait for first 5 mins of Day 9 open.</li>
                             <li>Move stop to <strong>ORL (Opening Range Low)</strong> of those 5 mins.</li>
                             <li>If not hit by EOD, reset to Breakeven for Day 10. Repeat.</li>
                         </ol>
                    </div>
                </div>
            </div>
      </div>

      {/* NUANCES SECTION */}
      <div className="pt-8 border-t border-slate-800">
         <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Maximize2 className="h-5 w-5 text-purple-400" />
            Profit System Nuances
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {/* Card 1 */}
             <div className="bg-slate-800 rounded-lg p-5 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center gap-2 mb-3 text-emerald-400">
                    <Zap size={18} />
                    <h3 className="font-bold text-sm uppercase">Powerful Catalysts</h3>
                </div>
                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                    <li><span className="text-white font-medium">1/3 profit at 2R</span></li>
                    <li><span className="text-white font-medium">1/3 profit at 10x ATR%</span> from 50-MA</li>
                    <li className="text-slate-400 italic">Sizing: 33% each</li>
                </ul>
             </div>

             {/* Card 2 */}
             <div className="bg-slate-800 rounded-lg p-5 border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                <div className="flex items-center gap-2 mb-3 text-blue-400">
                    <Target size={18} />
                    <h3 className="font-bold text-sm uppercase">Reaching 4R</h3>
                </div>
                <div className="inline-block bg-slate-900 text-slate-500 text-[10px] px-1.5 py-0.5 rounded mb-2 border border-slate-700">Before Day 4</div>
                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                    <li>If profit &gt; 4R, consolidate all stops to <span className="text-white font-medium">Breakeven</span> immediately.</li>
                </ul>
             </div>

             {/* Card 3 */}
             <div className="bg-slate-800 rounded-lg p-5 border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                <div className="flex items-center gap-2 mb-3 text-orange-400">
                    <TrendingUp size={18} />
                    <h3 className="font-bold text-sm uppercase">Follow-Up</h3>
                </div>
                <div className="inline-block bg-slate-900 text-slate-500 text-[10px] px-1.5 py-0.5 rounded mb-2 border border-slate-700">After Day 4</div>
                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                    <li>If trend at <span className="text-white">8-10x ATR%</span> from 50-MA, close 1/3.</li>
                    <li>If <span className="text-white">sideways consolidation</span> below 4x ATR% from 50-MA, add 50% size.</li>
                </ul>
             </div>

             {/* Card 4 */}
             <div className="bg-slate-800 rounded-lg p-5 border border-pink-500/20 hover:border-pink-500/40 transition-colors">
                <div className="flex items-center gap-2 mb-3 text-pink-400">
                    <PlusCircle size={18} />
                    <h3 className="font-bold text-sm uppercase">Sizing Up</h3>
                </div>
                <div className="inline-block bg-slate-900 text-slate-500 text-[10px] px-1.5 py-0.5 rounded mb-2 border border-slate-700">After Early Stops</div>
                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                    <li>If 33/66% stops hit before Day 4, <span className="text-white">set alert at Prev Day High</span>.</li>
                    <li>If triggered, <span className="text-white font-medium">add 50%</span> of remaining size.</li>
                </ul>
             </div>
         </div>
         
         <div className="mt-8 text-center border-t border-slate-800 pt-4 flex flex-col gap-2">
             <p className="text-slate-500 text-xs">
                 Core 3-Stop Strategy by <a href="https://x.com/jfsrev" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-400 hover:underline">Jeff Sun (@jfsrev)</a>.
             </p>
             <p className="text-slate-500 text-xs">
                 Visual representation and nuances adapted from <a href="https://x.com/RomanBreakouts" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-400 hover:underline">@RomanBreakouts</a> on X.
             </p>
         </div>
      </div>
    </div>
  );
};

export default RiskManagementSystem;