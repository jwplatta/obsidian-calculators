import React, { useState, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { SliderInput } from './inputs/SliderInput';
import { calculateOptionsStrategy, calculateOptionsSummary } from '../calculators/optionsStrategy';
import type { OptionsStrategyParams, SavedCalculator, FrequencyUnit } from '../types';
import { DEFAULT_OPTIONS_STRATEGY_PARAMS } from '../types';
import { formatCurrency } from '../calculators/compoundInterest';

interface OptionsStrategyCalculatorProps {
  initialParams?: OptionsStrategyParams;
  savedCalc?: SavedCalculator | null;
  onSave: (params: OptionsStrategyParams) => void;
}

const FREQUENCY_UNITS: { value: FrequencyUnit; label: string }[] = [
  { value: 'day', label: 'per trading day' },
  { value: 'week', label: 'per week' },
  { value: 'month', label: 'per month' },
  { value: 'year', label: 'per year' },
];

export function OptionsStrategyCalculator({
  initialParams,
  savedCalc,
  onSave,
}: OptionsStrategyCalculatorProps) {
  const [params, setParams] = useState<OptionsStrategyParams>(
    initialParams ?? DEFAULT_OPTIONS_STRATEGY_PARAMS
  );

  const update = useCallback(<K extends keyof OptionsStrategyParams>(key: K, value: OptionsStrategyParams[K]) => {
    setParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateNumber = useCallback((key: keyof OptionsStrategyParams) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= 0) update(key, val as OptionsStrategyParams[typeof key]);
  }, [update]);

  const data = calculateOptionsStrategy(params);
  const summary = calculateOptionsSummary(params);

  const evPositive = summary.evPerTrade >= 0;

  return (
    <div className="calc-container">
      <h2 className="calc-title">Options Strategy Calculator</h2>

      <div className="calc-form">
        <div className="calc-field">
          <label className="calc-field-label">Starting Portfolio Value <span className="calc-required">*</span></label>
          <div className="calc-number-row">
            <span className="calc-prefix">$</span>
            <input
              type="number"
              value={params.startingPortfolio}
              min={0}
              step={1000}
              onChange={updateNumber('startingPortfolio')}
              className="calc-number-input calc-number-input--wide"
            />
          </div>
        </div>

        <div className="calc-form-row">
          <div className="calc-field calc-field--grow">
            <label className="calc-field-label">Premium per Share <span className="calc-required">*</span></label>
            <div className="calc-number-row">
              <span className="calc-prefix">$</span>
              <input
                type="number"
                value={params.premiumPerShare}
                min={0}
                step={0.01}
                onChange={updateNumber('premiumPerShare')}
                className="calc-number-input calc-number-input--wide"
              />
            </div>
          </div>

          <div className="calc-field">
            <label className="calc-field-label">Multiplier</label>
            <input
              type="number"
              value={params.multiplier}
              min={1}
              step={1}
              onChange={updateNumber('multiplier')}
              className="calc-number-input"
            />
          </div>

          <div className="calc-field">
            <label className="calc-field-label">Contracts</label>
            <input
              type="number"
              value={params.contracts}
              min={1}
              step={1}
              onChange={updateNumber('contracts')}
              className="calc-number-input"
            />
          </div>
        </div>

        <div className="calc-field">
          <label className="calc-field-label">Capital per Contract</label>
          <div className="calc-number-row">
            <span className="calc-prefix">$</span>
            <input
              type="number"
              value={params.capitalPerContract}
              min={0}
              step={100}
              onChange={updateNumber('capitalPerContract')}
              className="calc-number-input calc-number-input--wide"
            />
          </div>
        </div>

        <SliderInput
          label="Win Rate"
          value={params.winRate}
          min={0}
          max={100}
          step={1}
          onChange={v => update('winRate', v)}
          suffix="%"
          required
        />

        <SliderInput
          label="Profit Target"
          value={params.profitTargetPct}
          min={0}
          max={100}
          step={5}
          onChange={v => update('profitTargetPct', v)}
          suffix="% of premium"
        />

        <SliderInput
          label="Max Loss"
          value={params.maxLossMultiple}
          min={0.5}
          max={10}
          step={0.5}
          onChange={v => update('maxLossMultiple', v)}
          suffix="× premium"
        />

        <div className="calc-field">
          <label className="calc-field-label">Trade Frequency</label>
          <div className="calc-frequency-row">
            <input
              type="number"
              value={params.frequencyValue}
              min={1}
              step={1}
              onChange={updateNumber('frequencyValue')}
              className="calc-number-input"
            />
            <select
              value={params.frequencyUnit}
              onChange={e => update('frequencyUnit', e.target.value as FrequencyUnit)}
              className="calc-select"
            >
              {FREQUENCY_UNITS.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
          <span className="calc-field-hint">{Math.round(summary.tradesPerYear)} trades/year</span>
        </div>

        <SliderInput
          label="Years"
          value={params.years}
          min={1}
          max={20}
          step={1}
          onChange={v => update('years', v)}
          suffix="yrs"
          required
        />
      </div>

      {/* Summary Stats */}
      <div className="calc-summary calc-summary--options">
        <div className="calc-summary-item">
          <span className="calc-summary-label">EV per Trade</span>
          <span className={`calc-summary-value ${evPositive ? 'calc-ev-positive' : 'calc-ev-negative'}`}>
            {evPositive ? '+' : ''}{formatCurrency(summary.evPerTrade)}
          </span>
        </div>
        <div className="calc-summary-item">
          <span className="calc-summary-label">EV per Year</span>
          <span className={`calc-summary-value ${evPositive ? 'calc-ev-positive' : 'calc-ev-negative'}`}>
            {evPositive ? '+' : ''}{formatCurrency(summary.evPerYear)}
          </span>
        </div>
        <div className="calc-summary-item">
          <span className="calc-summary-label">Total Trades</span>
          <span className="calc-summary-value">{summary.totalTrades.toLocaleString()}</span>
        </div>
        <div className="calc-summary-item">
          <span className="calc-summary-label">Capital Deployed</span>
          <span className="calc-summary-value">
            {formatCurrency(summary.capitalDeployed)}
            <span className="calc-summary-sub"> ({summary.capitalPct.toFixed(1)}% of portfolio)</span>
          </span>
        </div>
        <div className="calc-summary-item">
          <span className="calc-summary-label">Total Expected Gain</span>
          <span className={`calc-summary-value ${evPositive ? 'calc-ev-positive' : 'calc-ev-negative'}`}>
            {evPositive ? '+' : ''}{formatCurrency(summary.totalExpectedGain)}
          </span>
        </div>
        <div className="calc-summary-item">
          <span className="calc-summary-label">Final Portfolio</span>
          <span className="calc-summary-value calc-summary-total">{formatCurrency(summary.finalPortfolio)}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="calc-chart">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              label={{ value: 'Year', position: 'insideBottom', offset: -2 }}
            />
            <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value: number) => [formatCurrency(value), 'Portfolio Value']} />
            <Line
              type="linear"
              dataKey="portfolio"
              name="Portfolio Value"
              stroke={evPositive ? '#7c3aed' : '#dc2626'}
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="calc-actions">
        <button className="calc-save-btn mod-cta" onClick={() => onSave(params)}>
          {savedCalc ? 'Save Changes' : 'Save Calculator'}
        </button>
      </div>
    </div>
  );
}
