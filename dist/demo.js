"use strict";
const titleIcons = {
    youtube: [
        {
            title: "🔴 LIVE: Cute Puppies Playing 24/7 Stream",
            favicon: "favicons/youtube.ico"
        },
        {
            title: "Never Gonna Give You Up - Rick Astley ▶ 2:45",
            favicon: "favicons/youtube.ico"
        }
    ],
    twitch: [
        {
            title: "🔴 xQc | GAMBLING $500K WITH YOUR COLLEGE FUNDS 🎰 | !gamble !stake [74.2K viewers]",
            favicon: "favicons/twitch.ico"
        }
    ],
    funny: [
        {
            title: "System32 Deletion Progress",
            favicon: "favicons/windows.ico"
        },
        {
            title: "Your Boss Behind You!",
            favicon: "favicons/warning.ico"
        }
    ]
};
let isAttacking = false;
let attackInterval = null;
function getRandomTitle() {
    const categories = Object.keys(titleIcons);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const titles = titleIcons[category];
    return titles[Math.floor(Math.random() * titles.length)];
}
function attackTabs() {
    const tabs = document.querySelectorAll(".tab:not(.active)");
    tabs.forEach((tab) => {
        const newTitle = getRandomTitle();
        tab.textContent = newTitle.title;
    });
}
function restoreTab(tab) {
    const originalTitle = tab.dataset.original;
    if (originalTitle) {
        tab.textContent = originalTitle;
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("toggleAttack");
    const tabs = document.querySelectorAll(".tab");
    if (!toggleBtn)
        return;
    toggleBtn.addEventListener("click", () => {
        isAttacking = !isAttacking;
        toggleBtn.textContent = isAttacking ? "Stop Attack" : "Start Attack";
        if (isAttacking) {
            attackInterval = window.setInterval(attackTabs, 3000);
            attackTabs(); // Initial attack
        }
        else {
            if (attackInterval) {
                clearInterval(attackInterval);
                attackInterval = null;
            }
            // Restore all tabs
            tabs.forEach((tab) => restoreTab(tab));
        }
    });
    // Handle tab clicking
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            // Remove active class from all tabs
            tabs.forEach((t) => {
                t.classList.remove("active");
                if (isAttacking) {
                    restoreTab(t);
                }
            });
            // Add active class to clicked tab
            tab.classList.add("active");
            restoreTab(tab);
        });
    });
});
