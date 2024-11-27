export const TABS = [
  {
    title: "Gmail",
    icon: "favicons/gmail.ico",
    url: "https://mail.google.com",
    className: "gmail",
  },
  {
    title: "GitHub",
    icon: "favicons/github.ico",
    url: "https://github.com/jakeisnt/tabattack",
    className: "github",
  },
  {
    title: "Google Docs",
    icon: "favicons/gdocs.png",
    url: "https://docs.google.com/document/d/1...",
    className: "gdocs",
  },
  {
    title: "Reddit",
    icon: "favicons/reddit.ico",
    url: "https://reddit.com/r/ProgrammerHumor",
    className: "reddit",
  },
] as const;

export type Tab = {
  title: string;
  icon: string;
  url: string;
  className: string;
};

export class BrowserSimulation {
  private activeTabId: string | null = null;

  constructor() {
    this.setupTabListeners();
    this.activateInitialTab();
  }

  private setupTabListeners(): void {
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        if (tab instanceof HTMLElement) {
          this.activateTab(tab);
        }
      });
    });
  }

  private activateTab(clickedTab: HTMLElement): void {
    const tabId = clickedTab.dataset.original?.toLowerCase();
    if (!tabId) return;

    this.activeTabId = tabId;
    const tabInfo = TABS.find((t) => t.title.toLowerCase() === tabId);
    if (!tabInfo) return;

    // Update URL bar
    const urlInput = document.querySelector<HTMLInputElement>(
      ".browser-address input"
    );
    if (urlInput) {
      urlInput.value = tabInfo.url;
    }

    // Update tab states
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    clickedTab.classList.add("active");

    // Update content visibility
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.add("hidden");
      content.classList.remove("active");
    });

    const content = document.querySelector(`.${tabInfo.className}-content`);
    if (content) {
      content.classList.remove("hidden");
      content.classList.add("active");
    }
  }

  private activateInitialTab(): void {
    const activeTab = document.querySelector<HTMLElement>(".tab.active");
    if (activeTab) {
      this.activateTab(activeTab);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new BrowserSimulation();
});
