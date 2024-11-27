import { TabAttacker } from './core';
import { logger } from './logger';

export class DemoAttacker extends TabAttacker {
  private readonly tabUrls: { [key: string]: string } = {
    "Gmail": "https://mail.google.com",
    "GitHub": "https://github.com/jakeisnt/tabattack",
    "Google Docs": "https://docs.google.com/document/d/1...",
    "Reddit": "https://reddit.com/r/ProgrammerHumor"
  };

  protected attackTabs(): void {
    const tabs = document.querySelectorAll<HTMLElement>('.tab:not(.active)');
    const addressInput = document.querySelector<HTMLInputElement>('.browser-address input');

    tabs.forEach(tab => {
      const newTitle = this.getRandomTitleIcon();
      const newUrl = this.getRandomUrl();
      
      tab.textContent = newTitle.title;
      tab.setAttribute('data-url', newUrl);

      if (tab.classList.contains('active') && addressInput) {
        addressInput.value = newUrl;
      }
    });
  }

  protected restoreAllTabs(): void {
    document.querySelectorAll<HTMLElement>('.tab').forEach(tab => {
      const originalTitle = tab.dataset.original;
      if (originalTitle) {
        tab.textContent = originalTitle;
        tab.setAttribute('data-url', this.tabUrls[originalTitle] || '');
      }
    });
  }

  private getRandomUrl(): string {
    const urls = [
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://twitch.tv/xqc",
      "https://reddit.com/r/ProgrammerHumor/comments/...",
      "https://twitter.com/elonmusk/status/...",
      "https://stackoverflow.com/questions/..."
    ];
    return urls[Math.floor(Math.random() * urls.length)];
  }
} 