import { TabAttacker } from "@/core";
import { TABS } from "@/web/browser-sim";

/**
 * Demo implementation of TabAttacker.
 * Handles attacking and restoring tabs in the browser demo interface.
 *
 * @extends TabAttacker
 */
export class DemoAttacker extends TabAttacker {
  /**
   * Mapping of tab names to their original URLs
   * Used for restoring tabs to their initial state
   */
  private readonly tabUrls: { [key: string]: string } = Object.fromEntries(
    TABS.map((tab) => [tab.title, tab.url])
  );

  /**
   * Attacks all inactive tabs in the demo interface
   * - Updates tab titles
   * - Updates tab URLs
   * - Updates address bar if needed
   */
  protected async attackTabs(): Promise<void> {
    const tabs = document.querySelectorAll<HTMLElement>(".tab:not(.active)");
    const addressInput = document.querySelector<HTMLInputElement>(
      ".browser-address input"
    );

    tabs.forEach((tab) => {
      const newTitle = this.getRandomTitleIcon();
      const newUrl = this.getRandomUrl();

      tab.textContent = newTitle.title;
      tab.setAttribute("data-url", newUrl);

      if (tab.classList.contains("active") && addressInput) {
        addressInput.value = newUrl;
      }
    });
  }

  /**
   * Restores all tabs to their original state
   * Uses original titles and URLs from tabUrls mapping
   */
  protected restoreAllTabs(): void {
    document.querySelectorAll<HTMLElement>(".tab").forEach((tab) => {
      const originalTitle = tab.dataset.original;
      if (originalTitle) {
        tab.textContent = originalTitle;
        tab.setAttribute("data-url", this.tabUrls[originalTitle] || "");
      }
    });
  }

  /**
   * Generates a random URL for attacked tabs
   * @returns Random URL from predefined list
   */
  private getRandomUrl(): string {
    const urls = [
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://twitch.tv/xqc",
      "https://reddit.com/r/ProgrammerHumor/comments/...",
      "https://twitter.com/elonmusk/status/...",
      "https://stackoverflow.com/questions/...",
    ];
    return urls[Math.floor(Math.random() * urls.length)];
  }
}
