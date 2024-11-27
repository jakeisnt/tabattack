import { ExtensionAttacker } from "./extension-attacker";
import { logger } from "../logger";

const attacker = new ExtensionAttacker();

chrome.runtime.onInstalled.addListener(() => {
  logger.info("Extension installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "toggleAttack") {
    if (message.value) {
      attacker.startAttack();
    } else {
      attacker.stopAttack();
    }
    sendResponse({ success: true });
  }
  return true;
});
