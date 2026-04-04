import type { KellyGrowthDataPoint, KellyGrowthParams, KellyGrowthSummary } from '../types';

function roundTo(value: number, decimals: number = 4): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function calculateKellyGrowthSummary(params: KellyGrowthParams): KellyGrowthSummary {
  const volatility = params.annualVolatility / 100;
  const riskFreeRate = params.riskFreeRate / 100;
  const excessReturn = params.sharpeRatio * volatility;
  const expectedReturn = riskFreeRate + excessReturn;

  const kellyLeverage = volatility === 0 ? 0 : excessReturn / Math.pow(volatility, 2);
  const growthRate = riskFreeRate + (params.leverage * excessReturn) - (0.5 * Math.pow(params.leverage, 2) * Math.pow(volatility, 2));
  const unleveredGrowthRate = riskFreeRate + excessReturn - (0.5 * Math.pow(volatility, 2));

  const finalLeveragedPortfolio = params.startingPortfolio * Math.exp(growthRate * params.years);
  const finalUnleveredPortfolio = params.startingPortfolio * Math.exp(unleveredGrowthRate * params.years);

  return {
    expectedReturn: roundTo(expectedReturn),
    excessReturn: roundTo(excessReturn),
    kellyLeverage: roundTo(kellyLeverage),
    growthRate: roundTo(growthRate),
    unleveredGrowthRate: roundTo(unleveredGrowthRate),
    leveragePctOfKelly: kellyLeverage === 0 ? 0 : roundTo((params.leverage / kellyLeverage) * 100, 1),
    finalLeveragedPortfolio: roundTo(finalLeveragedPortfolio, 2),
    finalUnleveredPortfolio: roundTo(finalUnleveredPortfolio, 2),
  };
}

export function calculateKellyGrowth(params: KellyGrowthParams): KellyGrowthDataPoint[] {
  const summary = calculateKellyGrowthSummary(params);
  const dataPoints: KellyGrowthDataPoint[] = [];

  for (let year = 0; year <= params.years; year++) {
    dataPoints.push({
      year,
      leveragedPortfolio: roundTo(params.startingPortfolio * Math.exp(summary.growthRate * year), 2),
      unleveredPortfolio: roundTo(params.startingPortfolio * Math.exp(summary.unleveredGrowthRate * year), 2),
    });
  }

  return dataPoints;
}
