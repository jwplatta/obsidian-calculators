import { Notice, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, CalculatorPluginSettings, CalculatorSettingTab } from './settings';
import { CalculatorStorageService } from './services/CalculatorStorageService';
import { CALCULATOR_VIEW_TYPE, CalculatorView } from './views/CalculatorView';
import { SAVED_CALCULATORS_VIEW_TYPE, SavedCalculatorsView } from './views/SavedCalculatorsView';
import { CalculatorSelectModal } from './modals/CalculatorSelectModal';
import { LoadCalculatorModal } from './modals/LoadCalculatorModal';
import { SaveCalculatorModal } from './modals/SaveCalculatorModal';
import { ConfirmOverwriteModal } from './modals/ConfirmOverwriteModal';
import type { CalculatorParams, CalculatorType, SavedCalculator } from './types';

export default class CalculatorsPlugin extends Plugin {
  settings: CalculatorPluginSettings;
  storage: CalculatorStorageService;

  async onload(): Promise<void> {
    await this.loadSettings();

    this.storage = new CalculatorStorageService(
      this.app,
      () => this.settings.calculatorsDir
    );

    await this.storage.ensureDir();

    this.registerView(
      CALCULATOR_VIEW_TYPE,
      leaf => new CalculatorView(leaf, this)
    );

    this.registerView(
      SAVED_CALCULATORS_VIEW_TYPE,
      leaf => new SavedCalculatorsView(leaf, this)
    );

    this.addCommand({
      id: 'open-calculator',
      name: 'Open calculator',
      callback: () => {
        new CalculatorSelectModal(this.app, type => {
          this.openCalculatorView(null, type);
        }).open();
      },
    });

    this.addCommand({
      id: 'load-calculator',
      name: 'Load saved calculator',
      callback: async () => {
        const calculators = await this.storage.listCalculators();
        if (calculators.length === 0) {
          new Notice('No saved calculators found.');
          return;
        }
        new LoadCalculatorModal(this.app, calculators, calc => {
          this.openCalculatorView(calc);
        }).open();
      },
    });

    this.addCommand({
      id: 'view-calculators',
      name: 'View saved calculators',
      callback: () => {
        this.openSavedCalculatorsView();
      },
    });

    this.addSettingTab(new CalculatorSettingTab(this.app, this));
  }

  async onunload(): Promise<void> {
    this.app.workspace.detachLeavesOfType(CALCULATOR_VIEW_TYPE);
    this.app.workspace.detachLeavesOfType(SAVED_CALCULATORS_VIEW_TYPE);
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  async openCalculatorView(
    savedCalc: SavedCalculator | null,
    type: CalculatorType = 'compound-interest'
  ): Promise<void> {
    const { workspace } = this.app;

    // Reuse an existing calculator leaf if one is open, otherwise create a new tab
    let leaf = workspace.getLeavesOfType(CALCULATOR_VIEW_TYPE)[0];
    if (!leaf) {
      leaf = workspace.getLeaf('tab');
      await leaf.setViewState({ type: CALCULATOR_VIEW_TYPE, active: true });
    }
    workspace.revealLeaf(leaf);

    const view = leaf.view as CalculatorView;
    if (!(view instanceof CalculatorView)) {
      console.error('obsidian-calculators: expected CalculatorView, got', leaf.view);
      return;
    }

    if (savedCalc) {
      view.loadCalculator(savedCalc);
    } else {
      view.openWithType(type);
    }
  }

  async openSavedCalculator(id: string): Promise<void> {
    const calc = await this.storage.loadCalculator(id);
    if (!calc) {
      new Notice('Calculator not found.');
      return;
    }
    await this.openCalculatorView(calc);
  }

  private async openSavedCalculatorsView(): Promise<void> {
    const { workspace } = this.app;
    workspace.detachLeavesOfType(SAVED_CALCULATORS_VIEW_TYPE);
    const leaf = workspace.getLeaf(false);
    await leaf.setViewState({ type: SAVED_CALCULATORS_VIEW_TYPE, active: true });
    workspace.revealLeaf(leaf);
  }

  async handleSave(view: CalculatorView, params: CalculatorParams): Promise<void> {
    const existingCalc = view.loadedCalc;
    const calcType = view.activeType;

    const doSave = async (title: string): Promise<void> => {
      const now = new Date().toISOString();
      const calc: SavedCalculator = existingCalc
        ? { ...existingCalc, params, editedAt: now }
        : {
            id: `calc-${Date.now()}`,
            title,
            type: calcType,
            params,
            savedAt: now,
            editedAt: now,
          };
      calc.title = title;
      await this.storage.saveCalculator(calc);
      view.loadCalculator(calc);
      new Notice(`Saved "${title}"`);
    };

    if (existingCalc) {
      new ConfirmOverwriteModal(this.app, existingCalc.title, () => {
        doSave(existingCalc.title);
      }).open();
    } else {
      new SaveCalculatorModal(this.app, '', title => {
        doSave(title);
      }).open();
    }
  }
}
