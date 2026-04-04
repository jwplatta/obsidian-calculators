import React, { useCallback, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { SliderInput } from './inputs/SliderInput';
import { calculateKellyGrowth, calculateKellyGrowthSummary } from '../calculators/kellyGrowth';
import { formatCurrency } from '../calculators/compoundInterest';
import { DEFAULT_KELLY_GROWTH_PARAMS } from '../types';
import type { KellyGrowthParams, SavedCalculator } from '../types';

interface KellyGrowthCalculatorProps {
  initialParams?: KellyGrowthParams;
  savedCalc?: SavedCalculator | null;
  onSave: (params: KellyGrowthParams) => void;
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function KellyGrowthCalculator({
  initialParams,
  savedCalc,
  onSave,
}: KellyGrowthCalculatorProps) {
  const [params, setParams] = useState<KellyGrowthParams>(
    initialParams ?? DEFAULT_KELLY_GROWTH_PARAMS
  );

  const update = useCallback(<K extends keyof KellyGrowthParams>(key: K, value: KellyGrowthParams[K]) => {
    setParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const data = calculateKellyGrowth(params);
  const summary = calculateKellyGrowthSummary(params);
  const growthPositive = summary.growthRate >= 0;

  return (
    <div className="calc-container">
      <h2 className="calc-title">Kelly Growth Calculator</h2>

      <div className="calc-note">
        <p className="calc-note-title">What this models</p>
        <p>
          This view links Sharpe ratio, leverage, and Kelly sizing to expected long-run compounding.
          It uses a continuous-growth approximation:
          <code> g ≈ r_f + L(μ − r_f) − 0.5L²σ² </code>
          where <code>L</code> is leverage and <code>σ</code> is annual volatility.
        </p>
      </div>

      <div className="calc-form">
        <SliderInput
          label="Starting Portfolio"
          value={params.startingPortfolio}
          min={1000}
          max={5000000}
          step={1000}
          onChange={v => update('startingPortfolio', v)}
          suffix="$"
          required
        />

        <SliderInput
          label="Sharpe Ratio"
          value={params.sharpeRatio}
          min={0}
          max={3}
          step={0.05}
          onChange={v => update('sharpeRatio', v)}
          required
        />

        <SliderInput
          label="Annual Volatility"
          value={params.annualVolatility}
          min={1}
          max={80}
          step={0.5}
          onChange={v => update('annualVolatility', v)}
          suffix="%"
          required
        />

        <SliderInput
          label="Risk-Free Rate"
          value={params.riskFreeRate}
          min={0}
          max={10}
          step={0.1}
          onChange={v => update('riskFreeRate', v)}
          suffix="%"
        />

        <SliderInput
          label="Leverage"
          value={params.leverage}
          min={0}
          max={5}
          step={0.05}
          onChange={v => update('leverage', v)}
          suffix="x"
          required
        />

        <SliderInput
          label="Years"
          value={params.years}
          min={1}
          max={50}
          step={1}
          onChange={v => update('years', v)}
          suffix="yrs"
          required
        />
      </div>

      <div className="calc-note calc-note--subtle">
        <p className="calc-note-title">How to interpret the inputs</p>
        <p>
          Sharpe ratio measures return per unit of risk. Volatility is the annualized standard deviation
          of returns. Kelly leverage is the leverage that maximizes expected log-growth under these
          assumptions. Running below full Kelly usually lowers growth a bit but reduces path risk.
        </p>
      </div>

      <div className="calc-summary calc-summary--options">
        <div className="calc-summary-item">
          <span className="calc-summary-label">Implied Expected Return</span>
          <span className="calc-summary-value">{formatPercent(summary.expectedReturn * 100)}</span>
        </div>
        <div className="calc-summary-item">
          <span className="calc-summary-label">Expected Excess Return</span>
          <span className="calc-summary-value">{formatPercent(summary.excessReturn * 100)}</span>
        </div>
        <div className="calc-summary-item">
          <span className="calc-summary-label">Full Kelly Leverage</span>
          <span className="calc-summary-value">{summary.kellyLeverage.toFixed(2)}x</span>
        </div>
        <div className="calc-summary-item">
          <span className="calc-summary-label">Selected Leverage</span>
          <span className="calc-summary-value">
            {params.leverage.toFixed(2)}x
            <span className="calc-summary-sub"> ({summary.leveragePctOfKelly.toFixed(0)}% of Kelly)</span>
          </span>
        </div>
        <div className="calc-summary-item">
          <span className="calc-summary-label">Expected CAGR at Selected Leverage</span>
          <span className={`calc-summary-value ${growthPositive ? 'calc-ev-positive' : 'calc-ev-negative'}`}>
            {formatPercent(summary.growthRate * 100)}
          </span>
        </div>
        <div className="calc-summary-item">
          <span className="calc-summary-label">Expected CAGR at 1.0x</span>
          <span className="calc-summary-value">{formatPercent(summary.unleveredGrowthRate * 100)}</span>
        </div>
        <div className="calc-summary-item">
          <span className="calc-summary-label">Projected Portfolio at Selected Leverage</span>
          <span className="calc-summary-value calc-summary-total">
            {formatCurrency(summary.finalLeveragedPortfolio)}
          </span>
        </div>
        <div className="calc-summary-item">
          <span className="calc-summary-label">Projected Portfolio at 1.0x</span>
          <span className="calc-summary-value">{formatCurrency(summary.finalUnleveredPortfolio)}</span>
        </div>
      </div>

      <div className="calc-chart">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -2 }} />
            <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Line
              type="monotone"
              dataKey="leveragedPortfolio"
              name={`Portfolio (${params.leverage.toFixed(2)}x)`}
              stroke={growthPositive ? '#7c3aed' : '#dc2626'}
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="unleveredPortfolio"
              name="Portfolio (1.0x)"
              stroke="#059669"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="calc-note calc-note--subtle">
        <p className="calc-note-title">Model caveats</p>
        <p>
          This is an expectation model, not a Monte Carlo path simulator. It assumes a stable Sharpe
          ratio, constant volatility, frictionless leverage, and no large drawdown constraints, taxes,
          or financing spreads. It is most useful for comparing scenarios, not forecasting realized
          outcomes.
        </p>
      </div>

      <div className="calc-actions">
        <button className="calc-save-btn mod-cta" onClick={() => onSave(params)}>
          {savedCalc ? 'Save Changes' : 'Save Calculator'}
        </button>
      </div>
    </div>
  );
}
