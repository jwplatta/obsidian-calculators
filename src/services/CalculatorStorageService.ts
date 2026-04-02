import { App, normalizePath, TFile } from 'obsidian';
import type { SavedCalculator } from '../types';

export class CalculatorStorageService {
  private app: App;
  private getDir: () => string;

  constructor(app: App, getDir: () => string) {
    this.app = app;
    this.getDir = getDir;
  }

  private get dir(): string {
    return normalizePath(this.getDir());
  }

  async ensureDir(): Promise<void> {
    const exists = await this.app.vault.adapter.exists(this.dir);
    if (!exists) {
      await this.app.vault.createFolder(this.dir);
    }
  }

  private filePath(id: string): string {
    return normalizePath(`${this.dir}/${id}.json`);
  }

  async listCalculators(): Promise<SavedCalculator[]> {
    await this.ensureDir();
    const dirExists = await this.app.vault.adapter.exists(this.dir);
    if (!dirExists) return [];

    const listed = await this.app.vault.adapter.list(this.dir);
    const results: SavedCalculator[] = [];

    for (const filePath of listed.files) {
      if (!filePath.endsWith('.json')) continue;
      try {
        const content = await this.app.vault.adapter.read(filePath);
        results.push(JSON.parse(content) as SavedCalculator);
      } catch {
        // skip malformed files
      }
    }

    return results.sort((a, b) => b.editedAt.localeCompare(a.editedAt));
  }

  async saveCalculator(calc: SavedCalculator): Promise<void> {
    await this.ensureDir();
    const path = this.filePath(calc.id);
    const content = JSON.stringify(calc, null, 2);
    const exists = await this.app.vault.adapter.exists(path);
    if (exists) {
      await this.app.vault.adapter.write(path, content);
    } else {
      await this.app.vault.create(path, content);
    }
  }

  async loadCalculator(id: string): Promise<SavedCalculator | null> {
    const path = this.filePath(id);
    const exists = await this.app.vault.adapter.exists(path);
    if (!exists) return null;
    const content = await this.app.vault.adapter.read(path);
    return JSON.parse(content) as SavedCalculator;
  }

  async deleteCalculator(id: string): Promise<void> {
    const path = this.filePath(id);
    const file = this.app.vault.getAbstractFileByPath(path);
    if (file instanceof TFile) {
      await this.app.vault.delete(file);
    }
  }
}
