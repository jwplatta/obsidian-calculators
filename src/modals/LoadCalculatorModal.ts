import { App, FuzzySuggestModal } from 'obsidian';
import type { SavedCalculator } from '../types';

export class LoadCalculatorModal extends FuzzySuggestModal<SavedCalculator> {
  private calculators: SavedCalculator[];
  private onChoose: (calc: SavedCalculator) => void;

  constructor(app: App, calculators: SavedCalculator[], onChoose: (calc: SavedCalculator) => void) {
    super(app);
    this.calculators = calculators;
    this.onChoose = onChoose;
    this.setPlaceholder('Search saved calculators...');
  }

  getItems(): SavedCalculator[] {
    return this.calculators;
  }

  getItemText(item: SavedCalculator): string {
    return item.title;
  }

  onChooseItem(item: SavedCalculator): void {
    this.onChoose(item);
  }
}
