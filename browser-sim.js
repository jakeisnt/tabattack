// Import shared logic from extension
import { titleIcons, randomTitleAndIcon } from './shared.js';

class BrowserSimulation {
    constructor() {
        this.isAttacking = false;
        this.attackInterval = null;
        this.tabs = new Map();
        
        // Initialize tabs from DOM
        document.querySelectorAll('.tab').forEach(tab => {
            this.tabs.set(tab, {
                original: {
                    title: tab.dataset.original,
                    favicon: tab.dataset.favicon
                },
                current: {
                    title: tab.dataset.original,
                    favicon: tab.dataset.favicon
                }
            });
        });
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const toggleBtn = document.getElementById('toggleAttack');
        const tabs = document.querySelectorAll('.tab');
        const urlInput = document.querySelector('.browser-address input');
        
        toggleBtn?.addEventListener('click', () => this.toggleAttack());
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => this.activateTab(tab));
        });
        
        // Update URL bar when tab changes
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const favicon = tab.dataset.favicon;
                const domain = new URL(favicon).hostname;
                urlInput.value = `https://${domain}`;
            });
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
    
    activateTab(clickedTab) {
        const tabs = document.querySelectorAll('.tab');
        
        tabs.forEach(tab => {
            const isClickedTab = tab === clickedTab;
            tab.classList.toggle('active', isClickedTab);
            
            if (isClickedTab) {
                this.restoreTab(tab);
            } else if (this.isAttacking) {
                const newTitle = randomTitleAndIcon();
                this.updateTab(tab, newTitle);
            }
        });
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