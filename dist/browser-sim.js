import { randomTitleAndIcon } from "./shared.js";
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
    setupEventListeners() {
        // Tab click listeners
        document.querySelectorAll(".tab").forEach((tab) => {
            tab.addEventListener("click", () => {
                if (tab instanceof HTMLElement) {
                    this.activateTab(tab);
                }
            });
        });
        // Attack button listeners
        ["gmail", "github", "google docs", "reddit"].forEach((tabId) => {
            const button = document.querySelector(`#toggleAttack-${tabId.replace(" ", "-")}`);
            button?.addEventListener("click", () => this.toggleAttack());
        });
    }
    activateTab(clickedTab) {
        const tabState = this.tabs.get(clickedTab);
        if (!tabState)
            return;
        this.activeTabId = tabState.id;
        // Update URL bar
        const urlInput = document.querySelector(".browser-address input");
        if (urlInput && tabState.current.icon) {
            try {
                const domain = new URL(tabState.current.icon).hostname;
                urlInput.value = `https://${domain}`;
            }
            catch (e) {
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
        const contentMap = {
            gmail: ".gmail-content",
            github: ".github-content",
            "google docs": ".gdocs-content",
            reddit: ".reddit-content",
        };
        const contentSelector = contentMap[tabState.id];
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
    toggleAttack() {
        this.isAttacking = !this.isAttacking;
        if (this.isAttacking) {
            this.startAttack();
        }
        else {
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
    startAttack() {
        this.attackInterval = window.setInterval(() => this.attackTabs(), 3000);
        this.attackTabs(); // Initial attack
    }
    stopAttack() {
        if (this.attackInterval) {
            window.clearInterval(this.attackInterval);
            this.attackInterval = null;
        }
        this.restoreAllTabs();
    }
    attackTabs() {
        this.tabs.forEach((state, tab) => {
            if (!tab.classList.contains("active")) {
                const newTitle = randomTitleAndIcon();
                this.updateTab(tab, newTitle);
            }
        });
    }
    updateTab(tab, titleIcon) {
        const tabState = this.tabs.get(tab);
        if (!tabState)
            return;
        tabState.current = titleIcon;
        tab.textContent = titleIcon.title;
        // Update favicon
        tab.style.backgroundImage = `url(${titleIcon.icon})`;
    }
    initializeActiveTab() {
        const activeTab = document.querySelector(".tab.active");
        if (activeTab instanceof HTMLElement) {
            this.activateTab(activeTab);
        }
    }
    restoreTab(tab) {
        const tabState = this.tabs.get(tab);
        if (!tabState)
            return;
        this.updateTab(tab, tabState.original);
    }
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
console.log("browser-sim.ts loaded");
