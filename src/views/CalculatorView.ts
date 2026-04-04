import { ItemView, WorkspaceLeaf } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';
import React from 'react';
import { CompoundInterestCalculator } from '../components/CompoundInterestCalculator';
import { OptionsStrategyCalculator } from '../components/OptionsStrategyCalculator';
import { KellyGrowthCalculator } from '../components/KellyGrowthCalculator';
import type { SavedCalculator, CalculatorType, CalculatorParams } from '../types';
import type CalculatorsPlugin from '../main';

export const CALCULATOR_VIEW_TYPE = 'calculator-view';

export class CalculatorView extends ItemView {
  private root: Root | null = null;
  private plugin: CalculatorsPlugin;
  loadedCalc: SavedCalculator | null = null;
  activeType: CalculatorType = 'compound-interest';

  constructor(leaf: WorkspaceLeaf, plugin: CalculatorsPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return CALCULATOR_VIEW_TYPE;
  }

  getDisplayText(): string {
    return this.loadedCalc ? this.loadedCalc.title : 'Calculator';
  }

  getIcon(): string {
    return 'calculator';
  }

  async onOpen(): Promise<void> {
    this.render();
  }

  async onClose(): Promise<void> {
    this.root?.unmount();
    this.root = null;
  }

  openWithType(type: CalculatorType): void {
    this.activeType = type;
    this.loadedCalc = null;
    this.render();
  }

  loadCalculator(calc: SavedCalculator): void {
    this.loadedCalc = calc;
    this.activeType = calc.type;
    this.render();
  }

  private render(): void {
    // Unmount before touching the DOM
    this.root?.unmount();
    this.root = null;
    this.contentEl.empty();
    this.root = createRoot(this.contentEl);

    const onSave = (params: CalculatorParams) => this.plugin.handleSave(this, params);

    if (this.activeType === 'options-strategy') {
      this.root.render(
        React.createElement(OptionsStrategyCalculator, {
          initialParams: this.loadedCalc?.params as any,
          savedCalc: this.loadedCalc,
          onSave: onSave as any,
        })
      );
    } else if (this.activeType === 'kelly-growth') {
      this.root.render(
        React.createElement(KellyGrowthCalculator, {
          initialParams: this.loadedCalc?.params as any,
          savedCalc: this.loadedCalc,
          onSave: onSave as any,
        })
      );
    } else {
      this.root.render(
        React.createElement(CompoundInterestCalculator, {
          initialParams: this.loadedCalc?.params as any,
          savedCalc: this.loadedCalc,
          onSave: onSave as any,
        })
      );
    }
  }
}
