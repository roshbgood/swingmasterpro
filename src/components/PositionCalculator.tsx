import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Percent, AlertCircle, Shield, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { PositionSizeInputs, PositionSizeResult } from '../types';

interface Props {
  onCalculationChange: (result: PositionSizeResult, inputs: PositionSizeInputs) => void;
}

interface StopBatch {
  id: number;
  label: string;
  shares: number;
  price: number;
  riskAmount: number;
  riskPercentR: number;
}

const PositionCalculator: React.FC<Props> = ({ onCalculationChange }) => {
  const [inputs, setInputs] = useState<PositionSizeInputs>({
    accountSize: 10000,
    riskPercentage: 1.0,
    entryPrice: 0,
    stopLossPrice: 0,
  });

  const [result, setResult] = useState<PositionSizeResult>({
    shares: 0,
    positionValue: 0,
    riskAmount: 0,
    riskPerShare: 0,
    isValid: false
  });

  const [strategyData, setStrategyData] = useState<{
    batches: StopBatch[];
    blendedStop: number;
    effectiveRisk: number;
    direction: 'LONG' | 'SHORT';
  } | null>(null);

  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  const calculate = () => {
    const { accountSize, riskPercentage, entryPrice, stopLossPrice } = inputs;
    
    if (entryPrice <= 0 || stopLossPrice <= 0 || entryPrice === stopLossPrice) {
      const invalid = { shares: 0, positionValue: 0, riskAmount: 0, riskPerShare: 0, isValid: false };
      setResult(invalid);
      setStrategyData(null);
      onCalculationChange(invalid, inputs);
      return;
    }

    const riskAmount = accountSize * (riskPercentage / 100);
    const riskPerShare = Math.abs(entryPrice - stopLossPrice);
    const shares = Math.floor(riskAmount / riskPerShare);
    const positionValue = shares * entryPrice;

    const newResult = {
      shares,
      positionValue,
      riskAmount,
      riskPerShare,
      isValid: true
    };

    setResult(newResult);
    
    // --- INTEGRATED 3-STOP STRATEGY CALCULATION ---
    if (shares > 0) {
      const isLong = entryPrice > stopLossPrice;
      const direction = isLong ? 'LONG' : 'SHORT';
      const riskDist = riskPerShare;

      // Batch sizes
      const batchSize = Math.floor(shares / 3);
      const remainder = shares - (batchSize * 2);

      // Stop Prices
      // Long: Entry - Dist. Short: Entry + Dist.
      const dirMult = isLong ? -1 : 1;
      
      const stop1Price = entryPrice + (dirMult * (riskDist * (1/3)));
      const stop2Price = entryPrice + (dirMult * (riskDist * (2/3)));
      const stop3Price = stopLossPrice; // Full 1R

      // Risk per batch
      const loss1 = Math.abs(entryPrice - stop1Price) * batchSize;
      const loss2 = Math.abs(entryPrice - stop2Price) * batchSize;
      const loss3 = Math.abs(entryPrice - stop3Price) * remainder;
      
      const totalPotentialLoss = loss1 + loss2 + loss3;
      const avgLossPerShare = totalPotentialLoss / shares;
      const blendedStop = entryPrice + (dirMult * avgLossPerShare);

      setStrategyData({
        direction,
        blendedStop,
        effectiveRisk: totalPotentialLoss,
        batches: [
          { id: 1, label: 'Early Stop (33%)', shares: batchSize, price: stop1Price, riskAmount: loss1, riskPercentR: loss1/riskAmount },
          { id: 2, label: 'Mid Stop (66%)', shares: batchSize, price: stop2Price, riskAmount: loss2, riskPercentR: loss2/riskAmount },
          { id: 3, label: 'Final Stop (LoD)', shares: remainder, price: stop3Price, riskAmount: loss3, riskPercentR: loss3/riskAmount },
        ]
      });
    } else {
      setStrategyData(null);
    }

    onCalculationChange(newResult, inputs);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  // Helper to generate scenario data
  const getScenario = (riskPct: number) => {
    if (!result.isValid || inputs.entryPrice <= 0) return null;
    
    const riskAmount = inputs.accountSize * (riskPct / 100);
    const riskPerShare = Math.abs(inputs.entryPrice - inputs.stopLossPrice);
    const shares = Math.floor(riskAmount / riskPerShare);
    const positionValue = shares * inputs.entryPrice;
    
    return {
      riskPct,
      shares,
      positionValue,
      riskAmount
    };
  };

  // Generate scenarios
  const baseScenarios = [0.25, 0.33, 0.5, 0.66, 0.75, 1.0, 1.5];
  const scenarios = [...new Set([...baseScenarios, inputs.riskPercentage])]
    .sort((a, b) => a - b)
    .filter(p => p > 0);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
        <div className="flex items-center gap-2 mb-6 text-emerald-400">
          <Calculator size={24} />
          <h2 className="text-xl font-bold text-white">Position Calculator</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Account Size ($)</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-3 text-slate-500" />
                <input
                  type="number"
                  name="accountSize"
                  value={inputs.accountSize || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-9 pr-4 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  placeholder="10000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Risk per Trade (%)</label>
              <div className="relative">
                <Percent size={16} className="absolute left-3 top-3 text-slate-500" />
                <input
                  type="number"
                  name="riskPercentage"
                  value={inputs.riskPercentage || ''}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-9 pr-4 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  placeholder="1.0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Entry Price ($)</label>
                    <input
                    type="number"
                    name="entryPrice"
                    value={inputs.entryPrice || ''}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-4 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                    placeholder="150.00"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Stop Loss ($)</label>
                    <input
                    type="number"
                    name="stopLossPrice"
                    value={inputs.stopLossPrice || ''}
                    onChange={handleChange}
                    step="0.01"
                    className={`w-full bg-slate-900 border rounded-lg py-2.5 px-4 text-white focus:ring-2 focus:outline-none transition-all ${
                        inputs.entryPrice > 0 && inputs.stopLossPrice === inputs.entryPrice 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-slate-700 focus:ring-emerald-500'
                    }`}
                    placeholder="145.00"
                    />
                </div>
            </div>
            {strategyData && (
                <div className={`flex items-center gap-2 text-xs font-bold px-2 py-1 rounded ${strategyData.direction === 'LONG' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-rose-900/30 text-rose-400'} w-fit`}>
                    {strategyData.direction === 'LONG' ? <ArrowUpCircle size={14}/> : <ArrowDownCircle size={14}/>}
                    {strategyData.direction} SETUP DETECTED
                </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="bg-slate-900 rounded-lg p-5 border border-slate-700 flex flex-col justify-center">
            {!result.isValid ? (
              <div className="text-center text-slate-500 py-8">
                <AlertCircle className="mx-auto mb-2 opacity-50" size={32} />
                <p>Enter valid price data to see results</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Position Size</p>
                  <p className="text-4xl font-bold text-emerald-400 mt-1">{result.shares.toLocaleString()}</p>
                  <p className="text-sm text-slate-500">shares / units</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div>
                    <p className="text-slate-500 text-xs">Total Value</p>
                    <p className="text-lg font-medium text-white">${result.positionValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Risk Amount (1R)</p>
                    <p className="text-lg font-medium text-red-400">-${result.riskAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Risk Per Share</p>
                    <p className="text-lg font-medium text-slate-300">${result.riskPerShare.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">% Stop Width</p>
                    <p className="text-lg font-medium text-slate-300">
                      {((Math.abs(inputs.entryPrice - inputs.stopLossPrice) / inputs.entryPrice) * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* INTEGRATED STRATEGY EXECUTION PANEL */}
        {strategyData && result.isValid && (
            <div className="mt-8 pt-6 border-t border-slate-700">
                 <div className="flex items-center gap-2 mb-4">
                    <Shield className="text-cyan-400" size={20} />
                    <h3 className="text-md font-bold text-white uppercase tracking-wider">Strategy Execution Plan</h3>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Stats Box */}
                    <div className="space-y-3">
                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-4 border border-slate-700 shadow-inner flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Blended Stop Price</p>
                                <p className="text-[10px] text-slate-500">Weighted avg of all stops</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-mono font-bold text-white">${strategyData.blendedStop.toFixed(2)}</div>
                            </div>
                        </div>
                        
                        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 flex justify-between items-center">
                            <div>
                                <span className="text-sm text-slate-400 block">Expected Loss (Effective Risk)</span>
                                <span className="text-xs text-slate-500">If all stops hit sequentially</span>
                            </div>
                            <div className="text-right">
                                <span className="text-emerald-400 font-mono font-bold block">-${strategyData.effectiveRisk.toFixed(2)}</span>
                                <span className="text-xs text-emerald-500/70 font-mono">
                                    Reduced to {(strategyData.effectiveRisk / result.riskAmount).toFixed(2)}R
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Batches List */}
                    <div className="space-y-2">
                        {strategyData.batches.map((batch) => (
                            <div key={batch.id} className="flex justify-between items-center bg-slate-700/30 p-3 rounded border border-slate-600/50 relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500/30" />
                                <div className="pl-2">
                                    <div className="text-sm font-bold text-white">{batch.label}</div>
                                    <div className="text-xs text-slate-400 font-mono">Sell {batch.shares} shares</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-cyan-400 font-mono font-bold text-lg">${batch.price.toFixed(2)}</div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-rose-400 font-medium">-${batch.riskAmount.toFixed(2)}</span>
                                        <span className="text-[10px] text-slate-500">{batch.riskPercentR.toFixed(2)}R</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
        )}

        {/* Scenarios Table */}
        {result.isValid && (
          <div className="mt-8 border-t border-slate-700 pt-6">
            <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2">
              Risk Scenarios Comparison
            </h3>
            <div className="overflow-x-auto rounded-lg border border-slate-700">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-900/80 text-xs uppercase text-slate-500 font-semibold">
                  <tr>
                    <th className="px-4 py-3">Risk %</th>
                    <th className="px-4 py-3 text-red-400/80">Risk (1R)</th>
                    <th className="px-4 py-3">Shares</th>
                    <th className="px-4 py-3">Position Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {scenarios.map(pct => {
                    const s = getScenario(pct);
                    if (!s) return null;
                    const isCurrent = inputs.riskPercentage === pct;
                    
                    return (
                      <tr key={pct} className={`transition-colors ${isCurrent ? 'bg-emerald-500/10' : 'hover:bg-slate-700/30'}`}>
                        <td className="px-4 py-3 font-medium text-slate-200 flex items-center gap-2">
                          {pct.toFixed(2)}%
                          {isCurrent && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30 font-bold">CURRENT</span>}
                        </td>
                        <td className="px-4 py-3 text-red-400 font-mono">-${s.riskAmount.toFixed(0)}</td>
                        <td className={`px-4 py-3 font-mono font-bold ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                          {s.shares.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-slate-400 font-mono">
                          ${s.positionValue.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PositionCalculator;