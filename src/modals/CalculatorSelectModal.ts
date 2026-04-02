import { App, FuzzySuggestModal } from 'obsidian';
import { CALCULATOR_TYPES, CalculatorType } from '../types';

interface CalculatorOption {
  id: CalculatorType;
  name: string;
}

export class CalculatorSelectModal extends FuzzySuggestModal<CalculatorOption> {
  private onChoose: (type: CalculatorType) => void;

  constructor(app: App, onChoose: (type: CalculatorType) => void) {
    super(app);
    this.onChoose = onChoose;
    this.setPlaceholder('Select a calculator...');
  }

  getItems(): CalculatorOption[] {
    return CALCULATOR_TYPES;
  }

  getItemText(item: CalculatorOption): string {
    return item.name;
  }

  onChooseItem(item: CalculatorOption): void {
    this.onChoose(item.id);
  }
}
