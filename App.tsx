import React, { useState } from 'react';
import { LayoutDashboard, Activity, ShieldCheck } from 'lucide-react';
import PositionCalculator from './components/PositionCalculator';
import TickerScout from './components/TickerScout';
import RiskManagementSystem from './components/RiskManagementSystem';
import TradePlanner from './components/TradePlanner';
import { PositionSizeInputs, PositionSizeResult } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'risk_management' | 'scout'>('risk_management');
  
  const [calcInputs, setCalcInputs] = useState<PositionSizeInputs>({
    accountSize: 10000,
    riskPercentage: 1.0,
    entryPrice: 0,
    stopLossPrice: 0,
  });
  
  const [calcResult, setCalcResult] = useState<PositionSizeResult>({
    shares: 0,
    positionValue: 0,
    riskAmount: 0,
    riskPerShare: 0,
    isValid: false
  });

  const handleCalcChange = (result: PositionSizeResult, inputs: PositionSizeInputs) => {
    setCalcResult(result);
    setCalcInputs(inputs);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                <Activity className="text-emerald-400" size={24} />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                SwingMaster Pro
              </h1>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => setActiveTab('risk_management')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'risk_management' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
              >
                <ShieldCheck size={18} />
                <span>Risk Management</span>
              </button>
              <button 
                onClick={() => setActiveTab('scout')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'scout' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
              >
                <LayoutDashboard size={18} className="rotate-180" />
                <span>Ticker Scout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'risk_management' && (
          <div className="space-y-12">
            {/* Top Section: Calculator & Planner */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Position Calculator (Sizing & Stops) */}
                <div className="lg:col-span-7 space-y-8">
                    <PositionCalculator onCalculationChange={handleCalcChange} />
                </div>
                
                {/* Right: Trade Planner (Profit Targets) */}
                <div className="lg:col-span-5">
                    <TradePlanner positionData={calcResult} inputData={calcInputs} />
                </div>
            </div>

            <div className="w-full h-px bg-slate-800" />

            {/* Bottom Section: Strategy Reference */}
            <div>
               <RiskManagementSystem />
            </div>
          </div>
        )}

        {activeTab === 'scout' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
             <div className="h-full">
                <TickerScout />
             </div>
             <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 flex flex-col justify-center items-center text-center">
                <div className="max-w-md">
                    <Activity size={64} className="mx-auto text-slate-700 mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-2">Market Intelligence</h3>
                    <p className="text-slate-400 mb-6">
                        Use the Ticker Scout to check for potential red flags before entering a trade. 
                        Earnings reports, FDA dates, or sector rotations can ruin a perfect technical setup.
                    </p>
                    <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-left text-sm text-slate-300">
                        <p className="font-bold text-purple-400 mb-2">Pro Tip:</p>
                        "Always check if the company reports earnings within your expected holding period. 
                        If yes, reduce position size or skip the trade."
                    </div>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;