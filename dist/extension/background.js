import { ExtensionAttacker } from "@/extension/extension-attacker";
import { logger } from "@/logger";
const attacker = new ExtensionAttacker();
// Start attack automatically when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    logger.info("Extension installed");
    attacker.startAttack();
});
// Start attack when browser starts
chrome.runtime.onStartup.addListener(() => {
    logger.info("Browser started");
    attacker.startAttack();
});
// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "toggleAttack") {
        if (message.value) {
            attacker.startAttack();
        }
        else {
            attacker.stopAttack();
        }
        sendResponse({ success: true });
    }
    return true;
});
// Re-attack when new tabs are created
chrome.tabs.onCreated.addListener(() => {
    if (attacker.isCurrentlyAttacking()) {
        attacker.attackTabs();
    }
});
// Re-attack when tabs are updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "complete" && attacker.isCurrentlyAttacking()) {
        attacker.attackTabs();
    }
});
