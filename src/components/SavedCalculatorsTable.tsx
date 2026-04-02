import React from 'react';
import type { SavedCalculator } from '../types';

interface SavedCalculatorsTableProps {
  calculators: SavedCalculator[];
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function typeLabel(type: SavedCalculator['type']): string {
  if (type === 'compound-interest') return 'Compound Interest';
  return type;
}

export function SavedCalculatorsTable({ calculators, onOpen, onDelete }: SavedCalculatorsTableProps) {
  if (calculators.length === 0) {
    return (
      <div className="calc-table-empty">
        <p>No saved calculators yet. Open a calculator and save it to see it here.</p>
      </div>
    );
  }

  return (
    <div className="calc-table-container">
      <table className="calc-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Saved</th>
            <th>Last Edited</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {calculators.map(calc => (
            <tr key={calc.id}>
              <td>
                <button className="calc-table-link" onClick={() => onOpen(calc.id)}>
                  {calc.title}
                </button>
              </td>
              <td>{typeLabel(calc.type)}</td>
              <td>{formatDate(calc.savedAt)}</td>
              <td>{formatDate(calc.editedAt)}</td>
              <td>
                <button className="calc-table-delete" onClick={() => onDelete(calc.id)} title="Delete">
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
