export interface TokenPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

export interface Portfolio {
  id: string;
  tokens: PortfolioToken[];
  totalValue: number;
  totalValueChange: number;
  lastUpdated: Date;
}

export interface PortfolioToken {
  symbol: string;
  amount: number;
  currentPrice: number;
  totalValue: number;
  costBasis: number;
  percentageChange: number;
}

export interface MarginPosition {
  id: string;
  token: string;
  collateral: number;
  borrowed: number;
  healthRatio: number;
  liquidationPrice: number;
  isProtected: boolean;
  protectionLevel: 'safe' | 'warning' | 'critical';
}

export interface LiquidationProtection {
  isActive: boolean;
  startedAt?: Date;
  stopLossPrice?: number;
  autoRepayEnabled: boolean;
  emergencyWithdrawEnabled: boolean;
  healthRatioThreshold: number;
}
