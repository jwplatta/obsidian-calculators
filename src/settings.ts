import { App, PluginSettingTab, Setting } from 'obsidian';
import type CalculatorsPlugin from './main';

export interface CalculatorPluginSettings {
  calculatorsDir: string;
}

export const DEFAULT_SETTINGS: CalculatorPluginSettings = {
  calculatorsDir: 'calculators',
};

export class CalculatorSettingTab extends PluginSettingTab {
  plugin: CalculatorsPlugin;

  constructor(app: App, plugin: CalculatorsPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: 'Calculators Settings' });

    new Setting(containerEl)
      .setName('Calculators directory')
      .setDesc('Vault folder where saved calculators are stored (relative to vault root).')
      .addText(text =>
        text
          .setPlaceholder('calculators')
          .setValue(this.plugin.settings.calculatorsDir)
          .onChange(async value => {
            this.plugin.settings.calculatorsDir = value.trim() || 'calculators';
            await this.plugin.saveSettings();
          })
      );
  }
}
