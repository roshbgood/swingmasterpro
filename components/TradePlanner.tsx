import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Plus, Trash2, ArrowRight } from 'lucide-react';
import { PositionSizeResult, PositionSizeInputs, TradeTarget } from '../types';

interface Props {
  positionData: PositionSizeResult;
  inputData: PositionSizeInputs;
}

const TradePlanner: React.FC<Props> = ({ positionData, inputData }) => {
  const [targets, setTargets] = useState<TradeTarget[]>([
    { id: '1', price: 0, percentageExit: 50 },
    { id: '2', price: 0, percentageExit: 50 }
  ]);

  const [metrics, setMetrics] = useState({
    totalProfit: 0,
    avgR: 0,
    riskReward: 0,
  });

  // Initialize target prices based on R-multiples when inputs change
  useEffect(() => {
    if (positionData.isValid && inputData.entryPrice > 0) {
      const risk = Math.abs(inputData.entryPrice - inputData.stopLossPrice);
      // Default to 2R and 3R if prices are 0
      setTargets(prev => prev.map((t, idx) => {
        if (t.price === 0) {
           return { ...t, price: inputData.entryPrice + (risk * (idx + 2)) }; 
        }
        return t;
      }));
    }
  }, [positionData.isValid, inputData.entryPrice, inputData.stopLossPrice]);

  useEffect(() => {
    calculateMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targets, positionData, inputData]);

  const calculateMetrics = () => {
    if (!positionData.isValid) return;

    let remainingShares = positionData.shares;
    let realizedProfit = 0;
    
    // Normalize percentages to ensure they sum to 100% physically if needed, 
    // but here we treat them as "% of ORIGINAL position size" for simplicity of UI
    // or "% of REMAINING". Let's use "% of ORIGINAL position" to be clearer for scaling out.
    
    // Actually, usually traders say "Sell 1/2 at T1". 
    // Let's assume the user inputs % of Total Position Size.
    
    let totalExitPercent = 0;
    
    targets.forEach(t => {
      const sharesToSell = Math.floor(positionData.shares * (t.percentageExit / 100));
      const profitPerShare = t.price - inputData.entryPrice;
      realizedProfit += sharesToSell * profitPerShare;
      totalExitPercent += t.percentageExit;
    });

    // If total exit < 100%, assume remainder runs or is closed at last target? 
    // For calculation safety, we only calc realized profit on defined exits.
    
    const risk = positionData.riskAmount;
    const rMultiple = risk > 0 ? realizedProfit / risk : 0;

    setMetrics({
      totalProfit: realizedProfit,
      avgR: rMultiple,
      riskReward: rMultiple // Simplified 1:X ratio
    });
  };

  const updateTarget = (id: string, field: keyof TradeTarget, value: number) => {
    setTargets(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const addTarget = () => {
    if (targets.length >= 4) return;
    const risk = Math.abs(inputData.entryPrice - inputData.stopLossPrice);
    const lastPrice = targets[targets.length - 1]?.price || inputData.entryPrice;
    setTargets([...targets, { 
      id: Math.random().toString(), 
      price: lastPrice + risk, 
      percentageExit: 0 
    }]);
  };

  const removeTarget = (id: string) => {
    setTargets(prev => prev.filter(t => t.id !== id));
  };

  const getRMultiple = (targetPrice: number) => {
    if (!positionData.isValid || inputData.entryPrice === inputData.stopLossPrice) return 0;
    const riskUnit = Math.abs(inputData.entryPrice - inputData.stopLossPrice);
    const rewardUnit = targetPrice - inputData.entryPrice;
    return (rewardUnit / riskUnit).toFixed(1);
  };

  if (!positionData.isValid) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 h-full flex items-center justify-center opacity-75">
        <div className="text-center">
          <Target className="mx-auto text-slate-600 mb-2" size={48} />
          <p className="text-slate-400">Calculate position size first to plan targets</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-blue-400">
          <TrendingUp size={24} />
          <h2 className="text-xl font-bold text-white">Strategy Planner</h2>
        </div>
        <div className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">
          {targets.length}-Target Strategy
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {targets.map((target, index) => (
          <div key={target.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 relative group">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-bold text-blue-400">Target {index + 1}</span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                {getRMultiple(target.price)}R
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Exit Price</label>
                <input
                  type="number"
                  value={target.price}
                  onChange={(e) => updateTarget(target.id, 'price', parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Sell %</label>
                <div className="relative">
                  <input
                    type="number"
                    value={target.percentageExit}
                    onChange={(e) => updateTarget(target.id, 'percentageExit', parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none pr-6"
                  />
                  <span className="absolute right-2 top-1.5 text-xs text-slate-500">%</span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2">
              <span>Exit: {Math.floor(positionData.shares * (target.percentageExit/100))} shares</span>
              <span className="text-emerald-400">
                +${((target.price - inputData.entryPrice) * (positionData.shares * (target.percentageExit/100))).toFixed(2)}
              </span>
            </div>

            {targets.length > 1 && (
              <button 
                onClick={() => removeTarget(target.id)}
                className="absolute -right-2 -top-2 bg-slate-800 p-1 rounded-full text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity border border-slate-700"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        ))}
        
        {targets.length < 4 && (
          <button 
            onClick={addTarget}
            className="w-full py-2 border border-dashed border-slate-700 rounded-lg text-slate-500 hover:text-blue-400 hover:border-blue-500/50 hover:bg-slate-900/50 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Plus size={16} /> Add Profit Target
          </button>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-400 text-sm">Combined R-Multiple</span>
          <span className={`text-xl font-bold ${metrics.avgR >= 2 ? 'text-emerald-400' : 'text-yellow-400'}`}>
            1 : {metrics.avgR.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Total Projected Profit</span>
          <span className="text-lg font-bold text-emerald-400">
            ${metrics.totalProfit.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TradePlanner;
