import type { OptionsStrategyParams, OptionsDataPoint, OptionsSummary, FrequencyUnit } from '../types';

function tradesPerYearFor(value: number, unit: FrequencyUnit): number {
  switch (unit) {
    case 'day':   return value * 252;
    case 'week':  return value * 52;
    case 'month': return value * 12;
    case 'year':  return value;
  }
}

function evComponents(params: OptionsStrategyParams): {
  evPerTrade: number;
  profitPerWin: number;
  lossPerLoss: number;
  totalPremium: number;
} {
  const wr = params.winRate / 100;
  const ptPct = params.profitTargetPct / 100;

  const premiumPerContract = params.premiumPerShare * params.multiplier;
  const totalPremium = premiumPerContract * params.contracts;

  const profitPerWin = totalPremium * ptPct;
  const lossPerLoss = totalPremium * params.maxLossMultiple;

  const evPerTrade = (wr * profitPerWin) - ((1 - wr) * lossPerLoss);

  return { evPerTrade, profitPerWin, lossPerLoss, totalPremium };
}

export function calculateOptionsStrategy(params: OptionsStrategyParams): OptionsDataPoint[] {
  const { evPerTrade } = evComponents(params);
  const tradesPerYear = tradesPerYearFor(params.frequencyValue, params.frequencyUnit);

  const dataPoints: OptionsDataPoint[] = [];
  for (let year = 0; year <= params.years; year++) {
    const portfolio = params.startingPortfolio + evPerTrade * tradesPerYear * year;
    dataPoints.push({ year, portfolio: Math.round(portfolio * 100) / 100 });
  }

  return dataPoints;
}

export function calculateOptionsSummary(params: OptionsStrategyParams): OptionsSummary {
  const { evPerTrade } = evComponents(params);
  const tradesPerYear = tradesPerYearFor(params.frequencyValue, params.frequencyUnit);
  const totalTrades = Math.round(tradesPerYear * params.years);
  const totalExpectedGain = evPerTrade * tradesPerYear * params.years;
  const capitalDeployed = params.capitalPerContract * params.contracts;

  return {
    evPerTrade,
    evPerYear: evPerTrade * tradesPerYear,
    tradesPerYear,
    totalTrades,
    capitalDeployed,
    capitalPct: (capitalDeployed / params.startingPortfolio) * 100,
    totalExpectedGain,
    finalPortfolio: params.startingPortfolio + totalExpectedGain,
  };
}
