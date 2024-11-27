import { logger } from "@/logger";
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
];
class BrowserSimulation {
    constructor() {
        this.isAttacking = false;
        this.attackInterval = null;
        this.tabs = new Map();
        this.activeTabId = null;
        this.initializeTabs();
        this.setupEventListeners();
        this.initializeActiveTab();
    }
    initializeTabs() {
        document.querySelectorAll(".tab").forEach((tab) => {
            if (!(tab instanceof HTMLElement))
                return;
            const original = tab.dataset.original;
            const icon = tab.dataset.favicon;
            if (!original || !icon)
                return;
            const tabId = original.toLowerCase();
            const tabInfo = TABS.find((t) => t.title.toLowerCase() === tabId);
            if (!tabInfo)
                return;
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
    setupEventListeners() {
        // Tab click listeners
        document.querySelectorAll(".tab").forEach((tab) => {
            tab.addEventListener("click", () => {
                if (tab instanceof HTMLElement) {
                    this.activateTab(tab);
                    if (this.isAttacking) {
                        this.restoreTab(tab);
                    }
                    else {
                        this.attackTabs();
                    }
                }
            });
        });
        // Attack button listeners
        TABS.forEach((tab) => {
            const button = document.querySelector(`#toggleAttack-${tab.className}`);
            button?.addEventListener("click", () => this.toggleAttack());
        });
    }
    /**
     * Update the text content of all attack buttons to reflect the current attack state.
     */
    updateAttackButtons() {
        document.querySelectorAll('[id^="toggleAttack-"]').forEach((button) => {
            if (button instanceof HTMLElement) {
                button.textContent = this.isAttacking ? "Stop Attack" : "Start Attack";
            }
        });
    }
    /**
     * Activate a tab.
     * A tab is activated by making it the active tab and updating the URL bar.
     */
    activateTab(clickedTab) {
        const tabState = this.tabs.get(clickedTab);
        if (!tabState)
            return;
        this.activeTabId = tabState.id;
        // Update URL bar
        const urlInput = document.querySelector(".browser-address input");
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
        console.log("Looking for content:", contentSelector); // Debug
        const content = document.querySelector(contentSelector);
        if (content) {
            content.classList.remove("hidden");
            content.classList.add("active");
        }
        else {
            console.warn("Content not found for selector:", contentSelector); // Debug
        }
        this.updateAttackButtons();
    }
    toggleAttack() {
        this.isAttacking = !this.isAttacking;
        if (this.isAttacking) {
            this.startAttack();
        }
        else {
            this.stopAttack();
        }
        this.updateAttackButtons();
    }
    /**
     * Start the attack and attack all tabs every 3 seconds.
     */
    startAttack() {
        this.attackInterval = window.setInterval(() => this.attackTabs(), 3000);
        this.attackTabs(); // Initial attack
    }
    /**
     * Stop the attack and restore all tabs.
     */
    stopAttack() {
        if (this.attackInterval) {
            window.clearInterval(this.attackInterval);
            this.attackInterval = null;
        }
        this.restoreAllTabs();
    }
    /**
     * Attack all tabs that are not the active tab.
     */
    attackTabs() {
        if (!this.isAttacking) {
            logger.error("Attacked tabs without attacking. Shouldn't get here. Fix this.");
            return;
        }
        this.tabs.forEach((state, tab) => {
            if (!tab.classList.contains("active")) {
                this.attackTab(tab);
            }
            else {
                this.restoreTab(tab);
            }
        });
    }
    /**
     * Update the tab to a new tab state.
     */
    updateTab(tab, newTab) {
        const tabState = this.tabs.get(tab);
        if (!tabState)
            return;
        tabState.current = {
            ...newTab,
            url: tabState.original.url,
        };
        tab.textContent = newTab.title;
        // Remove any existing favicon
        tab.style.removeProperty("--favicon");
        tab.setAttribute("data-original", newTab.title);
    }
    /**
     * Initialize the active tab.
     */
    initializeActiveTab() {
        const activeTab = document.querySelector(".tab.active");
        if (activeTab instanceof HTMLElement) {
            this.activateTab(activeTab);
        }
    }
    /**
     * Attack a tab.
     */
    attackTab(tab) {
        const tabState = this.tabs.get(tab);
        if (!tabState)
            return;
        this.updateTab(tab, tabState.current);
    }
    /**
     * Restore a tab to its original state.
     */
    restoreTab(tab) {
        const tabState = this.tabs.get(tab);
        if (!tabState)
            return;
        this.updateTab(tab, tabState.original);
    }
    /**
     * Restore all tabs to their original state.
     */
    restoreAllTabs() {
        this.tabs.forEach((state, tab) => {
            this.restoreTab(tab);
        });
    }
}
// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    new BrowserSimulation();
});
export { TABS };
