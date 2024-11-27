import { DemoAttacker } from "@/web/demo-attacker";
document.addEventListener("DOMContentLoaded", () => {
    const attacker = new DemoAttacker();
    // Set up attack toggle buttons
    document.querySelectorAll('[id^="toggleAttack-"]').forEach((button) => {
        button.addEventListener("click", () => {
            if (attacker.isCurrentlyAttacking()) {
                attacker.stopAttack();
                button.textContent = "Start Attack";
            }
            else {
                attacker.startAttack();
                button.textContent = "Stop Attack";
            }
        });
    });
    // Set up tab clicking
    document.querySelectorAll(".tab").forEach((tab) => {
        tab.addEventListener("click", () => {
            document
                .querySelectorAll(".tab")
                .forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            // Update content visibility
            document.querySelectorAll(".tab-content").forEach((content) => {
                content.classList.add("hidden");
                content.classList.remove("active");
            });
            const tabName = tab.getAttribute("data-original")?.toLowerCase();
            if (tabName) {
                const content = document.querySelector(`.${tabName}-content`);
                if (content) {
                    content.classList.remove("hidden");
                    content.classList.add("active");
                }
            }
        });
    });
});
