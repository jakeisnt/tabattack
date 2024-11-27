const TABS = ["gmail", "github", "google docs", "reddit"] as const;
type TabId = typeof TABS[number];

import { titleIcons, randomTitleAndIcon } from "./shared.js";

interface TabState {
  id: string;
  original: {
    title: string;
    icon: string;
  };
  current: {
    title: string;
    icon: string;
  };
}

class BrowserSimulation {
  private isAttacking: boolean = false;
  private attackInterval: number | null = null;
  private tabs: Map<HTMLElement, TabState> = new Map();
  private activeTabId: string | null = null;

  constructor() {
    this.initializeTabs();
    this.setupEventListeners();
    this.initializeActiveTab();
  }

  private initializeTabs(): void {
    document.querySelectorAll(".tab").forEach((tab: Element) => {
      if (!(tab instanceof HTMLElement)) return;

      const original = tab.dataset.original;
      const icon = tab.dataset.favicon;

      if (!original || !icon) return;

      const tabId = original.toLowerCase();
      this.tabs.set(tab, {
        id: tabId,
        original: {
          title: original,
          icon: icon,
        },
        current: {
          title: original,
          icon: icon,
        },
      });

      if (tab.classList.contains("active")) {
        this.activeTabId = tabId;
      }
    });
  }

  private setupEventListeners(): void {
    // Tab click listeners
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        if (tab instanceof HTMLElement) {
          this.activateTab(tab);
        }
      });
    });

    // Attack button listeners
    TABS.forEach((tabId) => {
      const button = document.querySelector(
        `#toggleAttack-${tabId.replace(" ", "-")}`
      );
      button?.addEventListener("click", () => this.toggleAttack());
    });
  }

  private activateTab(clickedTab: HTMLElement): void {
    const tabState = this.tabs.get(clickedTab);
    if (!tabState) return;

    this.activeTabId = tabState.id;

    // Update URL bar
    const urlInput = document.querySelector(
      ".browser-address input"
    ) as HTMLInputElement;
    if (urlInput && tabState.current.icon) {
      try {
        const domain = new URL(tabState.current.icon).hostname;
        urlInput.value = `https://${domain}`;
      } catch (e) {
        console.error("Invalid favicon URL:", tabState.current.icon);
      }
    }

    // Update tab states
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.classList.remove("active");
    });
    clickedTab.classList.add("active");

    // Hide all content first
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.add("hidden");
      content.classList.remove("active");
    });

    // Show the correct content
    const contentMap: Record<TabId, string> = {
      gmail: ".gmail-content",
      github: ".github-content",
      "google docs": ".gdocs-content",
      reddit: ".reddit-content",
    };

    const contentSelector = contentMap[tabState.id as TabId];
    if (contentSelector) {
      const content = document.querySelector(contentSelector);
      if (content) {
        content.classList.remove("hidden");
        content.classList.add("active");
      }
    }

    // Update attack button states
    document.querySelectorAll('[id^="toggleAttack-"]').forEach((button) => {
      if (button instanceof HTMLElement) {
        button.textContent = this.isAttacking ? "Stop Attack" : "Start Attack";
      }
    });
  }

  private toggleAttack(): void {
    this.isAttacking = !this.isAttacking;

    if (this.isAttacking) {
      this.startAttack();
    } else {
      this.stopAttack();
    }

    // Update all attack buttons
    document.querySelectorAll('[id^="toggleAttack-"]').forEach((button) => {
      if (button instanceof HTMLElement) {
        button.textContent = this.isAttacking ? "Stop Attack" : "Start Attack";
        button.classList.toggle("active", this.isAttacking);
      }
    });
  }

  private startAttack(): void {
    this.attackInterval = window.setInterval(() => this.attackTabs(), 3000);
    this.attackTabs(); // Initial attack
  }

  private stopAttack(): void {
    if (this.attackInterval) {
      window.clearInterval(this.attackInterval);
      this.attackInterval = null;
    }
    this.restoreAllTabs();
  }

  private attackTabs(): void {
    this.tabs.forEach((state, tab) => {
      if (!tab.classList.contains("active")) {
        const newTitle = randomTitleAndIcon();
        this.updateTab(tab, newTitle);
      }
    });
  }

  private updateTab(
    tab: HTMLElement,
    titleIcon: { title: string; icon: string }
  ): void {
    const tabState = this.tabs.get(tab);
    if (!tabState) return;

    tabState.current = titleIcon;
    tab.textContent = titleIcon.title;
    // Update favicon
    tab.style.backgroundImage = `url(${titleIcon.icon})`;
  }

  private initializeActiveTab(): void {
    const activeTab = document.querySelector(".tab.active");
    if (activeTab instanceof HTMLElement) {
      this.activateTab(activeTab);
    }
  }

  private restoreTab(tab: HTMLElement): void {
    const tabState = this.tabs.get(tab);
    if (!tabState) return;

    this.updateTab(tab, tabState.original);
  }

  private restoreAllTabs(): void {
    this.tabs.forEach((state, tab) => {
      this.restoreTab(tab);
    });
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new BrowserSimulation();
});

console.log("browser-sim.ts loaded");
