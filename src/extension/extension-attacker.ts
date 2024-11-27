import { TabAttacker } from "../core";
import { logger } from "../logger";

export class ExtensionAttacker extends TabAttacker {
  protected async attackTabs(): Promise<void> {
    const tabs = await chrome.tabs.query({ active: false });

    for (const tab of tabs) {
      if (!tab.id) continue;

      try {
        if (!this.getOriginalState(tab.id)) {
          this.storeOriginalState(tab.id, {
            title: tab.title || "",
            icon: await this.getTabIcon(tab.id),
          });
        }

        const titleIcon = this.getRandomTitleIcon();
        await this.updateTab(tab.id, titleIcon);
      } catch (e) {
        logger.error(`Failed to attack tab ${tab.id}`, e as Error);
      }
    }
  }

  private async getTabIcon(tabId: number): Promise<string> {
    const [iconResult] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const iconLink = document.querySelector(
          'link[rel*="icon"]'
        ) as HTMLLinkElement;
        return iconLink?.href || "";
      },
    });
    return iconResult?.result || "";
  }

  private async updateTab(
    tabId: number,
    titleIcon: { title: string; icon: string }
  ): Promise<void> {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: (title: string, icon: string) => {
        document.title = title;
        let link =
          (document.querySelector('link[rel*="icon"]') as HTMLLinkElement) ||
          document.createElement("link");
        link.type = "image/x-icon";
        link.rel = "shortcut icon";
        link.href = icon;
        document.head.appendChild(link);
      },
      args: [titleIcon.title, titleIcon.icon],
    });
  }

  protected restoreAllTabs(): void {
    this.originalStates.forEach((state, tabId) => {
      if (typeof tabId === "number") {
        this.updateTab(tabId, state);
      }
    });
  }
}
