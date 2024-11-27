import { TabAttacker } from "@/core";
import { logger } from "@/logger";
export class ExtensionAttacker extends TabAttacker {
    async attackTabs() {
        const tabs = await chrome.tabs.query({ active: false });
        for (const tab of tabs) {
            if (!tab.id)
                continue;
            try {
                if (!this.getOriginalState(tab.id)) {
                    this.storeOriginalState(tab.id, {
                        title: tab.title || "",
                        icon: await this.getTabIcon(tab.id),
                    });
                }
                const titleIcon = this.getRandomTitleIcon();
                await this.updateTab(tab.id, titleIcon);
            }
            catch (e) {
                logger.error(`Failed to attack tab ${tab.id}`, e);
            }
        }
    }
    async getTabIcon(tabId) {
        const [iconResult] = await chrome.scripting.executeScript({
            target: { tabId },
            func: () => {
                const iconLink = document.querySelector('link[rel*="icon"]');
                return iconLink?.href || "";
            },
        });
        return iconResult?.result || "";
    }
    async updateTab(tabId, titleIcon) {
        await chrome.scripting.executeScript({
            target: { tabId },
            func: (title, icon) => {
                document.title = title;
                let link = document.querySelector('link[rel*="icon"]') ||
                    document.createElement("link");
                link.type = "image/x-icon";
                link.rel = "shortcut icon";
                link.href = icon;
                document.head.appendChild(link);
            },
            args: [titleIcon.title, titleIcon.icon],
        });
    }
    restoreAllTabs() {
        this.originalStates.forEach((state, tabId) => {
            if (typeof tabId === "number") {
                this.updateTab(tabId, state);
            }
        });
    }
}
