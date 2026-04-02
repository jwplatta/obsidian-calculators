import { ItemView, WorkspaceLeaf } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';
import React from 'react';
import { SavedCalculatorsTable } from '../components/SavedCalculatorsTable';
import type CalculatorsPlugin from '../main';

export const SAVED_CALCULATORS_VIEW_TYPE = 'saved-calculators-view';

export class SavedCalculatorsView extends ItemView {
  private root: Root | null = null;
  private plugin: CalculatorsPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: CalculatorsPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return SAVED_CALCULATORS_VIEW_TYPE;
  }

  getDisplayText(): string {
    return 'Saved Calculators';
  }

  getIcon(): string {
    return 'library';
  }

  async onOpen(): Promise<void> {
    await this.render();
  }

  async onClose(): Promise<void> {
    this.root?.unmount();
    this.root = null;
  }

  async refresh(): Promise<void> {
    await this.render();
  }

  private async render(): Promise<void> {
    const calculators = await this.plugin.storage.listCalculators();

    // Unmount before touching the DOM
    this.root?.unmount();
    this.root = null;
    this.contentEl.empty();
    this.root = createRoot(this.contentEl);

    this.root.render(
      React.createElement(SavedCalculatorsTable, {
        calculators,
        onOpen: (id: string) => this.plugin.openSavedCalculator(id),
        onDelete: async (id: string) => {
          await this.plugin.storage.deleteCalculator(id);
          await this.render();
        },
      })
    );
  }
}
