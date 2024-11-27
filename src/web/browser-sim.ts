import { randomTitleAndIcon } from "@/shared";

const TABS = [
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
    icon: "favicons/gdocs.ico",
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

type Tab = {
  title: string;
  // path to a favicon in the favicons/ dir
  icon: string;
  url: string;
  className: string;
};

interface TabState {
  id: string;
  original: Tab;
  current: Tab;
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
      const tabInfo = TABS.find((t) => t.title.toLowerCase() === tabId);

      if (!tabInfo) return;

      this.tabs.set(tab, {
        id: tabId,
        original: tabInfo,
        current: tabInfo,
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
    TABS.forEach((tab) => {
      const button = document.querySelector(`#toggleAttack-${tab.className}`);
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
    if (urlInput) {
      urlInput.value = tabState.current.url;
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
    const contentSelector = `.${tabState.current.className}-content`;
    const content = document.querySelector(contentSelector);
    if (content) {
      content.classList.remove("hidden");
      content.classList.add("active");
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
        this.updateTab(tab, {
          title: newTitle.title,
          icon: newTitle.icon,
          url: state.original.url,
          className: state.original.className,
        });
      }
    });
  }

  private updateTab(tab: HTMLElement, newTab: Tab): void {
    const tabState = this.tabs.get(tab);
    if (!tabState) return;

    tabState.current = {
      ...newTab,
      url: tabState.original.url,
    };

    tab.textContent = newTab.title;
    tab.style.backgroundImage = `url(${newTab.icon})`;
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

export { TABS };
