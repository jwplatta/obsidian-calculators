import { App, Modal, Setting } from 'obsidian';

export class ConfirmOverwriteModal extends Modal {
  private title: string;
  private onConfirm: () => void;

  constructor(app: App, title: string, onConfirm: () => void) {
    super(app);
    this.title = title;
    this.onConfirm = onConfirm;
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('h3', { text: 'Overwrite Calculator?' });
    contentEl.createEl('p', {
      text: `"${this.title}" already exists. Do you want to overwrite it with the current values?`,
    });

    new Setting(contentEl)
      .addButton(btn =>
        btn.setButtonText('Overwrite').setCta().onClick(() => {
          this.close();
          this.onConfirm();
        })
      )
      .addButton(btn =>
        btn.setButtonText('Cancel').onClick(() => this.close())
      );
  }

  onClose(): void {
    this.contentEl.empty();
  }
}
