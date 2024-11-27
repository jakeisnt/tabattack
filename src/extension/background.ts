import { ExtensionAttacker } from "@/extension/extension-attacker";
import { logger } from "@/logger";

const attacker = new ExtensionAttacker();

// Log when extension is installed or updated
chrome.runtime.onInstalled.addListener(async () => {
  logger.info("Extension installed");
  // Initialize popup checkbox state
  await chrome.storage.local.set({ attackEnabled: false });
});

// Log when browser starts
chrome.runtime.onStartup.addListener(async () => {
  logger.info("Browser started");
  // Reset attack state on browser start
  await chrome.storage.local.set({ attackEnabled: false });
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "toggleAttack") {
    (async () => {
      await chrome.storage.local.set({ attackEnabled: message.value });
      if (message.value) {
        await attacker.startAttack();
      } else {
        attacker.stopAttack();
      }
      sendResponse({ success: true });
    })();
    return true; // Keep message channel open for async response
  }
  return true;
});

// Re-attack when new tabs are created
chrome.tabs.onCreated.addListener(async () => {
  if (attacker.isCurrentlyAttacking()) {
    await attacker.attackTabs();
  }
});

// Re-attack when tabs are updated
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status === "complete" && attacker.isCurrentlyAttacking()) {
    await attacker.attackTabs();
  }
});
