import { TabAttacker } from "@/core";
import { TABS, type Tab } from "@/web/browser-sim";

/**
 * Demo implementation of TabAttacker.
 * Handles attacking and restoring tabs in the browser demo interface.
 *
 * @extends TabAttacker
 */
export class DemoAttacker extends TabAttacker {
  private tabs: Map<HTMLElement, Tab> = new Map();

  constructor() {
    super();
    this.initializeTabs();
    this.setupAttackButtons();
  }

  /**
   * Initializes the tabs with their original state
   */
  private initializeTabs(): void {
    document.querySelectorAll<HTMLElement>(".tab").forEach((tab) => {
      const original = tab.dataset.original;
      if (!original) return;

      const tabInfo = TABS.find((t) => t.title === original);
      if (tabInfo) {
        this.tabs.set(tab, tabInfo);
      }

      // on tab switch, restore the current tab
      // and attack all of the others, if attacking.
      tab.addEventListener("click", () => {
        this.restoreTab(tab);
        if (this.isCurrentlyAttacking()) {
          this.attackTabs();
        }
      });
    });
  }

  /**
   * Sets up event listeners for attack buttons
   */
  private setupAttackButtons(): void {
    document.querySelectorAll<HTMLElement>('[id^="toggleAttack-"]').forEach((button) => {
      button.addEventListener("click", () => {
        if (this.isCurrentlyAttacking()) {
          this.stopAttack();
          document.querySelectorAll<HTMLElement>('[id^="toggleAttack-"]').forEach(btn => {
            btn.textContent = "Start Attack";
          });
        } else {
          this.startAttack();
          document.querySelectorAll<HTMLElement>('[id^="toggleAttack-"]').forEach(btn => {
            btn.textContent = "Stop Attack";
          });
        }
      });
    });
  }

  /**
   * Restores a tab to its original state
   * @param element - The tab element to restore
   */
  protected restoreTab(element: HTMLElement): void {
    const originalTab = this.tabs.get(element);
    if (originalTab) {
      element.textContent = originalTab.title;
      element.style.setProperty("--favicon", `url('${originalTab.icon}')`);
    }
  }

  /**
   * Attacks a tab with a random title and icon
   * @param element - The tab element to attack
   */
  protected attackTab(element: HTMLElement): void {
    const newTitle = this.getRandomTitleIcon();
    element.textContent = newTitle.title;
    element.style.setProperty("--favicon", `url('${newTitle.icon}')`);
  }

  /**
   * Attacks all inactive tabs in the demo interface
   * - Updates tab titles
   * - Updates tab URLs
   * - Updates address bar if needed
   */
  protected async attackTabs(): Promise<void> {
    this.tabs.forEach((originalTab, element) => {
      if (element.classList.contains("active")) {
        this.restoreTab(element);
      } else {
        this.attackTab(element);
      }
    });
  }

  /**
   * Restores all tabs to their original state
   * Uses original titles and URLs from tabUrls mapping
   */
  protected restoreAllTabs(): void {
    this.tabs.forEach((_, element) => {
      this.restoreTab(element);
    });
  }
}
