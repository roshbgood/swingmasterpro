import React, { useState } from 'react';
import { Activity, ShieldCheck } from 'lucide-react';
import PositionCalculator from './components/PositionCalculator';
import RiskManagementSystem from './components/RiskManagementSystem';
import { PositionSizeInputs, PositionSizeResult } from './types';

const App: React.FC = () => {
  // Lifted state kept for future extensibility
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [calcInputs, setCalcInputs] = useState<PositionSizeInputs>({
    accountSize: 10000,
    riskPercentage: 1.0,
    entryPrice: 0,
    stopLossPrice: 0,
  });
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
              <div className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-slate-800 text-white border border-slate-700">
                <ShieldCheck size={18} />
                <span>Risk Management</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-12">
          {/* Top Section: Calculator */}
          <div className="max-w-3xl mx-auto space-y-8">
              <PositionCalculator onCalculationChange={handleCalcChange} />
          </div>

          <div className="w-full h-px bg-slate-800" />

          {/* Bottom Section: Strategy Reference */}
          <div>
             <RiskManagementSystem />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;