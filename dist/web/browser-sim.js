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
];
export class BrowserSimulation {
    constructor() {
        this.activeTabId = null;
        this.setupTabListeners();
        this.activateInitialTab();
    }
    setupTabListeners() {
        document.querySelectorAll(".tab").forEach((tab) => {
            tab.addEventListener("click", () => {
                if (tab instanceof HTMLElement) {
                    this.activateTab(tab);
                }
            });
        });
    }
    activateTab(clickedTab) {
        const tabId = clickedTab.dataset.original?.toLowerCase();
        if (!tabId)
            return;
        this.activeTabId = tabId;
        const tabInfo = TABS.find((t) => t.title.toLowerCase() === tabId);
        if (!tabInfo)
            return;
        // Update URL bar
        const urlInput = document.querySelector(".browser-address input");
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
    activateInitialTab() {
        const activeTab = document.querySelector(".tab.active");
        if (activeTab) {
            this.activateTab(activeTab);
        }
    }
}
// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    new BrowserSimulation();
});
