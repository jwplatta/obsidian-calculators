import React, { useState, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { SliderInput } from './inputs/SliderInput';
import { ToggleInput } from './inputs/ToggleInput';
import { calculateCompoundInterest, formatCurrency } from '../calculators/compoundInterest';
import type { CompoundInterestParams, SavedCalculator } from '../types';
import { DEFAULT_COMPOUND_INTEREST_PARAMS } from '../types';

interface CompoundInterestCalculatorProps {
  initialParams?: CompoundInterestParams;
  savedCalc?: SavedCalculator | null;
  onSave: (params: CompoundInterestParams) => void;
}

export function CompoundInterestCalculator({
  initialParams,
  savedCalc,
  onSave,
}: CompoundInterestCalculatorProps) {
  const [params, setParams] = useState<CompoundInterestParams>(
    initialParams ?? DEFAULT_COMPOUND_INTEREST_PARAMS
  );

  const update = useCallback(<K extends keyof CompoundInterestParams>(key: K, value: CompoundInterestParams[K]) => {
    setParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const data = calculateCompoundInterest(params);
  const finalBalance = data[data.length - 1]?.balance ?? 0;
  const totalContributions = data[data.length - 1]?.contributions ?? 0;
  const totalInterest = data[data.length - 1]?.interest ?? 0;

  const compoundingOptions = [
    { value: 1, label: 'Annually' },
    { value: 4, label: 'Quarterly' },
    { value: 12, label: 'Monthly' },
    { value: 365, label: 'Daily' },
  ];

  return (
    <div className="calc-container">
      <h2 className="calc-title">Compound Interest Calculator</h2>

      <div className="calc-form">
        <SliderInput
          label="Initial Principal"
          value={params.principal}
          min={0}
          max={1000000}
          step={1000}
          onChange={v => update('principal', v)}
          suffix="$"
          required
        />

        <SliderInput
          label="Annual Interest Rate"
          value={params.annualRate}
          min={0}
          max={100}
          step={0.1}
          onChange={v => update('annualRate', v)}
          suffix="%"
          required
        />

        <SliderInput
          label="Time Period"
          value={params.years}
          min={1}
          max={100}
          step={1}
          onChange={v => update('years', v)}
          suffix="yrs"
          required
        />

        <div className="calc-field">
          <label className="calc-field-label">Compounding Frequency</label>
          <select
            value={params.compoundingFrequency}
            onChange={e => update('compoundingFrequency', parseInt(e.target.value))}
            className="calc-select"
          >
            {compoundingOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <SliderInput
          label="Monthly Contribution"
          value={params.monthlyContribution}
          min={0}
          max={10000}
          step={100}
          onChange={v => update('monthlyContribution', v)}
          suffix="$/mo"
        />

        <ToggleInput
          label="Adjust for Inflation"
          value={params.inflationAdjusted}
          onChange={v => update('inflationAdjusted', v)}
        />

        {params.inflationAdjusted && (
          <SliderInput
            label="Inflation Rate"
            value={params.inflationRate}
            min={0}
            max={15}
            step={0.1}
            onChange={v => update('inflationRate', v)}
            suffix="%"
          />
        )}
      </div>

      <div className="calc-summary">
        <div className="calc-summary-item">
          <span className="calc-summary-label">Final Balance</span>
          <span className="calc-summary-value calc-summary-total">{formatCurrency(finalBalance)}</span>
        </div>
        <div className="calc-summary-item">
          <span className="calc-summary-label">Total Contributions</span>
          <span className="calc-summary-value">{formatCurrency(totalContributions)}</span>
        </div>
        <div className="calc-summary-item">
          <span className="calc-summary-label">Total Interest</span>
          <span className="calc-summary-value calc-summary-interest">{formatCurrency(totalInterest)}</span>
        </div>
      </div>

      <div className="calc-chart">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -2 }} />
            <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Line type="monotone" dataKey="balance" name="Balance" stroke="#7c3aed" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="contributions" name="Contributions" stroke="#059669" dot={false} strokeWidth={2} />
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
