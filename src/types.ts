export interface PositionSizeInputs {
  accountSize: number;
  riskPercentage: number;
  entryPrice: number;
  stopLossPrice: number;
}

export interface PositionSizeResult {
  shares: number;
  positionValue: number;
  riskAmount: number;
  riskPerShare: number;
  isValid: boolean;
}

export interface TradeTarget {
  id: string;
  price: number;
  percentageExit: number; // 0-100
}

export interface StrategyResult {
  totalProfit: number;
  totalRisk: number;
  rMultiple: number;
  breakEvenPrice: number;
  riskRewardRatio: number;
}