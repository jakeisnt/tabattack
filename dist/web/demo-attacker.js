import { TabAttacker } from "@/core";
import { TABS } from "@/web/browser-sim";
/**
 * Demo implementation of TabAttacker.
 * Handles attacking and restoring tabs in the browser demo interface.
 *
 * @extends TabAttacker
 */
export class DemoAttacker extends TabAttacker {
    constructor() {
        super();
        this.tabs = new Map();
        this.initializeTabs();
        this.setupAttackButtons();
    }
    initializeTabs() {
        document.querySelectorAll(".tab").forEach((tab) => {
            const original = tab.dataset.original;
            if (!original)
                return;
            const tabInfo = TABS.find((t) => t.title === original);
            if (tabInfo) {
                this.tabs.set(tab, tabInfo);
            }
        });
    }
    setupAttackButtons() {
        document.querySelectorAll('[id^="toggleAttack-"]').forEach((button) => {
            button.addEventListener("click", () => {
                if (this.isCurrentlyAttacking()) {
                    this.stopAttack();
                    button.textContent = "Start Attack";
                }
                else {
                    this.startAttack();
                    button.textContent = "Stop Attack";
                }
            });
        });
    }
    /**
     * Attacks all inactive tabs in the demo interface
     * - Updates tab titles
     * - Updates tab URLs
     * - Updates address bar if needed
     */
    async attackTabs() {
        this.tabs.forEach((originalTab, element) => {
            if (!element.classList.contains("active")) {
                const newTitle = this.getRandomTitleIcon();
                element.textContent = newTitle.title;
                element.style.setProperty("--favicon", `url('${newTitle.icon}')`);
            }
        });
    }
    /**
     * Restores all tabs to their original state
     * Uses original titles and URLs from tabUrls mapping
     */
    restoreAllTabs() {
        this.tabs.forEach((originalTab, element) => {
            element.textContent = originalTab.title;
            element.style.setProperty("--favicon", `url('${originalTab.icon}')`);
        });
    }
    /**
     * Generates a random URL for attacked tabs
     * @returns Random URL from predefined list
     */
    getRandomUrl() {
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
