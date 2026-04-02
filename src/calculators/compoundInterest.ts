import type { CompoundInterestParams, YearlyDataPoint } from '../types';

export function calculateCompoundInterest(params: CompoundInterestParams): YearlyDataPoint[] {
  const { principal, annualRate, compoundingFrequency, years, monthlyContribution, inflationAdjusted, inflationRate } = params;

  const r = annualRate / 100;
  const n = compoundingFrequency;
  const pmt = monthlyContribution * 12;
  const inflationFactor = inflationRate / 100;

  const dataPoints: YearlyDataPoint[] = [];

  for (let t = 0; t <= years; t++) {
    let balance: number;
    let contributions: number;

    if (r === 0) {
      balance = principal + pmt * t;
      contributions = principal + pmt * t;
    } else {
      const growthFactor = Math.pow(1 + r / n, n * t);
      // FV of lump sum
      const fvPrincipal = principal * growthFactor;
      // FV of periodic contributions (annual PMT paid monthly approximated as annual)
      const fvContributions = pmt > 0
        ? pmt * (growthFactor - 1) / (r / n) / n * (1 + r / n)
        : 0;
      balance = fvPrincipal + fvContributions;
      contributions = principal + pmt * t;
    }

    if (inflationAdjusted && t > 0) {
      const deflator = Math.pow(1 + inflationFactor, t);
      balance = balance / deflator;
      contributions = contributions / deflator;
    }

    const interest = Math.max(0, balance - contributions);

    dataPoints.push({
      year: t,
      balance: Math.round(balance * 100) / 100,
      contributions: Math.round(contributions * 100) / 100,
      interest: Math.round(interest * 100) / 100,
    });
  }

  return dataPoints;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}
