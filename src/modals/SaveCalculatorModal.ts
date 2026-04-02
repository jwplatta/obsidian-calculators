import { App, Modal, Setting } from 'obsidian';

export class SaveCalculatorModal extends Modal {
  private initialTitle: string;
  private onSave: (title: string) => void;
  private title = '';

  constructor(app: App, initialTitle: string, onSave: (title: string) => void) {
    super(app);
    this.initialTitle = initialTitle;
    this.onSave = onSave;
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('h3', { text: 'Save Calculator' });

    this.title = this.initialTitle;

    new Setting(contentEl)
      .setName('Title')
      .setDesc('Give this calculator a name.')
      .addText(text => {
        text.setValue(this.initialTitle).onChange(value => {
          this.title = value;
        });
        text.inputEl.focus();
        text.inputEl.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key === 'Enter') this.submit();
        });
      });

    new Setting(contentEl)
      .addButton(btn =>
        btn.setButtonText('Save').setCta().onClick(() => this.submit())
      )
      .addButton(btn =>
        btn.setButtonText('Cancel').onClick(() => this.close())
      );
  }

  onClose(): void {
    this.contentEl.empty();
  }

  private submit(): void {
    const trimmed = this.title.trim();
    if (!trimmed) return;
    this.close();
    this.onSave(trimmed);
  }
}
