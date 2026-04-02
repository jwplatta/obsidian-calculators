export type CalculatorType = 'compound-interest' | 'options-strategy';

export interface CompoundInterestParams {
  principal: number;
  annualRate: number;
  compoundingFrequency: number;
  years: number;
  monthlyContribution: number;
  inflationAdjusted: boolean;
  inflationRate: number;
}

export type FrequencyUnit = 'day' | 'week' | 'month' | 'year';

export interface OptionsStrategyParams {
  startingPortfolio: number;
  premiumPerShare: number;
  multiplier: number;
  contracts: number;
  profitTargetPct: number;    // 0–100
  maxLossMultiple: number;    // e.g. 2 = 2× premium
  winRate: number;            // 0–100
  capitalPerContract: number;
  frequencyValue: number;
  frequencyUnit: FrequencyUnit;
  years: number;
}

export type CalculatorParams = CompoundInterestParams | OptionsStrategyParams;

export interface SavedCalculator {
  id: string;
  title: string;
  type: CalculatorType;
  params: CalculatorParams;
  savedAt: string;
  editedAt: string;
}

export interface YearlyDataPoint {
  year: number;
  balance: number;
  contributions: number;
  interest: number;
}

export interface OptionsDataPoint {
  year: number;
  portfolio: number;
}

export interface OptionsSummary {
  evPerTrade: number;
  evPerYear: number;
  tradesPerYear: number;
  totalTrades: number;
  capitalDeployed: number;
  capitalPct: number;
  totalExpectedGain: number;
  finalPortfolio: number;
}

export const CALCULATOR_TYPES: { id: CalculatorType; name: string }[] = [
  { id: 'compound-interest', name: 'Compound Interest Calculator' },
  { id: 'options-strategy', name: 'Options Strategy Calculator' },
];

export const DEFAULT_COMPOUND_INTEREST_PARAMS: CompoundInterestParams = {
  principal: 10000,
  annualRate: 7,
  compoundingFrequency: 12,
  years: 20,
  monthlyContribution: 0,
  inflationAdjusted: false,
  inflationRate: 3,
};

export const DEFAULT_OPTIONS_STRATEGY_PARAMS: OptionsStrategyParams = {
  startingPortfolio: 50000,
  premiumPerShare: 2.50,
  multiplier: 100,
  contracts: 1,
  profitTargetPct: 50,
  maxLossMultiple: 2,
  winRate: 70,
  capitalPerContract: 5000,
  frequencyValue: 1,
  frequencyUnit: 'week',
  years: 5,
};
