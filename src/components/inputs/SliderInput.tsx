import React from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  suffix?: string;
  required?: boolean;
}

export function SliderInput({ label, value, min, max, step, onChange, suffix, required }: SliderInputProps) {
  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    }
  };

  return (
    <div className="calc-field">
      <label className="calc-field-label">
        {label}
        {required && <span className="calc-required"> *</span>}
      </label>
      <div className="calc-slider-row">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSlider}
          className="calc-slider"
        />
        <div className="calc-slider-value">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={handleText}
            className="calc-number-input"
          />
          {suffix && <span className="calc-suffix">{suffix}</span>}
        </div>
      </div>
    </div>
  );
}
