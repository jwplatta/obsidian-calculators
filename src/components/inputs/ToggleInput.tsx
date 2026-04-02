import React from 'react';

interface ToggleInputProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function ToggleInput({ label, value, onChange }: ToggleInputProps) {
  return (
    <div className="calc-field calc-field-toggle">
      <label className="calc-field-label">{label}</label>
      <input
        type="checkbox"
        checked={value}
        onChange={e => onChange(e.target.checked)}
        className="calc-toggle"
      />
    </div>
  );
}
