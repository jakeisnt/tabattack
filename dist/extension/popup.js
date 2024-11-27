import { ExtensionAttacker } from "@/extension/extension-attacker";
import { logger } from "@/logger";
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const toggle = document.getElementById("attackToggle");
        const status = document.getElementById("status");
        if (!toggle || !status)
            throw new Error("Required elements not found");
        const attacker = new ExtensionAttacker();
        toggle.addEventListener("change", async () => {
            if (toggle.checked) {
                await attacker.startAttack();
                status.textContent = "Attacking tabs...";
            }
            else {
                attacker.stopAttack();
                status.textContent = "Attack stopped";
            }
        });
    }
    catch (error) {
        logger.error("Popup initialization failed:", error);
    }
});
