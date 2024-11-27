// Import shared logic from extension
import { titleIcons, randomTitleAndIcon } from './shared.js';

class BrowserSimulation {
    constructor() {
        this.isAttacking = false;
        this.attackInterval = null;
        this.tabs = new Map();
        this.activeTabId = null;
        
        // Initialize tabs from DOM
        document.querySelectorAll('.tab').forEach(tab => {
            const tabId = tab.dataset.original.toLowerCase();
            this.tabs.set(tab, {
                id: tabId,
                original: {
                    title: tab.dataset.original,
                    favicon: tab.dataset.favicon
                },
                current: {
                    title: tab.dataset.original,
                    favicon: tab.dataset.favicon
                }
            });
            
            if (tab.classList.contains('active')) {
                this.activeTabId = tabId;
            }
        });
        
        this.setupEventListeners();
        this.initializeActiveTab();
    }
    
    setupEventListeners() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => this.activateTab(tab));
        });
        
        // Set up attack toggle listeners for each tab's button
        ['gmail', 'github', 'google docs', 'reddit'].forEach(tabId => {
            const button = document.querySelector(`#toggleAttack-${tabId}`);
            button?.addEventListener('click', () => this.toggleAttack());
        });
    }
    
    activateTab(clickedTab) {
        const tabState = this.tabs.get(clickedTab);
        if (!tabState) return;
        
        const tabId = tabState.id;
        this.activeTabId = tabId;
        
        // Update URL
        const urlInput = document.querySelector('.browser-address input');
        const favicon = clickedTab.dataset.favicon;
        const domain = new URL(favicon).hostname;
        urlInput.value = `https://${domain}`;
        
        // Update tab states
        document.querySelectorAll('.tab').forEach(tab => {
            const isActive = tab === clickedTab;
            tab.classList.toggle('active', isActive);
        });
        
        // Update content visibility
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
            content.classList.remove('active');
        });
        
        // Show the correct content
        const contentMap = {
            'gmail': '.gmail-content',
            'github': '.github-content',
            'google docs': '.gdocs-content',
            'reddit': '.reddit-content'
        };
        
        const contentSelector = contentMap[tabId];
        if (contentSelector) {
            const content = document.querySelector(contentSelector);
            content?.classList.remove('hidden');
            content?.classList.add('active');
        }
        
        // Update attack button states
        document.querySelectorAll('[id^="toggleAttack-"]').forEach(button => {
            button.textContent = this.isAttacking ? 'Stop Attack' : 'Start Attack';
        });
    }
    
    toggleAttack() {
        this.isAttacking = !this.isAttacking;
        const toggleBtn = document.getElementById('toggleAttack');
        
        if (toggleBtn) {
            toggleBtn.textContent = this.isAttacking ? 'Stop Attack' : 'Start Attack';
            toggleBtn.classList.toggle('active', this.isAttacking);
        }
        
        if (this.isAttacking) {
            this.startAttack();
        } else {
            this.stopAttack();
        }
    }
    
    startAttack() {
        this.attackInterval = setInterval(() => this.attackTabs(), 3000);
        this.attackTabs(); // Initial attack
    }
    
    stopAttack() {
        if (this.attackInterval) {
            clearInterval(this.attackInterval);
            this.attackInterval = null;
        }
        this.restoreAllTabs();
    }
    
    attackTabs() {
        const inactiveTabs = Array.from(this.tabs.keys())
            .filter(tab => !tab.classList.contains('active'));
            
        inactiveTabs.forEach(tab => {
            const newTitle = randomTitleAndIcon();
            this.updateTab(tab, newTitle);
        });
    }
    
    updateTab(tab, titleIcon) {
        const tabState = this.tabs.get(tab);
        if (!tabState) return;
        
        tabState.current = titleIcon;
        tab.textContent = titleIcon.title;
        tab.style.backgroundImage = `url(${titleIcon.icon})`;
    }
    
    initializeActiveTab() {
        const activeTab = document.querySelector('.tab.active');
        if (activeTab) {
            this.activateTab(activeTab);
        }
    }
    
    restoreTab(tab) {
        const tabState = this.tabs.get(tab);
        if (!tabState) return;
        
        this.updateTab(tab, tabState.original);
    }
    
    restoreAllTabs() {
        this.tabs.forEach((state, tab) => {
            this.restoreTab(tab);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BrowserSimulation();
}); 