"use strict";
const titleIcons = {
  youtube: [
    {
      title: "🔴 LIVE: Cute Puppies Playing 24/7 Stream",
      favicon: "favicons/youtube.ico",
    },
    {
      title: "Never Gonna Give You Up - Rick Astley ▶ 2:45",
      favicon: "favicons/youtube.ico",
    },
  ],
  twitch: [
    {
      title:
        "🔴 xQc | GAMBLING $500K WITH YOUR COLLEGE FUNDS 🎰 | !gamble !stake [74.2K viewers]",
      favicon: "favicons/twitch.ico",
    },
  ],
  funny: [
    {
      title: "System32 Deletion Progress",
      favicon: "favicons/windows.ico",
    },
    {
      title: "Your Boss Behind You!",
      favicon: "favicons/warning.ico",
    },
  ],
};
let isAttacking = false;
let attackInterval = null;
// Add URL mapping at the top
const tabUrls = {
  Gmail: "https://mail.google.com",
  GitHub: "https://github.com/jakeisnt/tabattack",
  "Google Docs": "https://docs.google.com/document/d/1...",
  Reddit: "https://reddit.com/r/ProgrammerHumor",
};
function getRandomTitle() {
  const categories = Object.keys(titleIcons);
  const category = categories[Math.floor(Math.random() * categories.length)];
  const titles = titleIcons[category];
  return titles[Math.floor(Math.random() * titles.length)];
}
function getRandomUrl() {
  const urls = [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://twitch.tv/xqc",
    "https://reddit.com/r/ProgrammerHumor/comments/...",
    "https://twitter.com/elonmusk/status/...",
    "https://stackoverflow.com/questions/...",
  ];
  return urls[Math.floor(Math.random() * urls.length)];
}
function attackTabs() {
  const tabs = document.querySelectorAll(".tab:not(.active)");
  const addressInput = document.querySelector(".browser-address input");
  tabs.forEach((tab) => {
    const newTitle = getRandomTitle();
    tab.textContent = newTitle.title;
    // Update data-url attribute with a random URL
    const newUrl = getRandomUrl();
    tab.setAttribute("data-url", newUrl);
    // If this tab becomes active, update the address bar
    if (tab.classList.contains("active") && addressInput) {
      addressInput.value = newUrl;
    }
  });
}
function restoreTab(tab) {
  const originalTitle = tab.dataset.original;
  const originalUrl = tabUrls[originalTitle || ""];
  if (originalTitle) {
    tab.textContent = originalTitle;
    tab.setAttribute("data-url", originalUrl);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleAttack");
  const tabs = document.querySelectorAll(".tab");
  const addressInput = document.querySelector(".browser-address input");
  if (!toggleBtn || !addressInput) return;
  toggleBtn.addEventListener("click", () => {
    isAttacking = !isAttacking;
    toggleBtn.textContent = isAttacking ? "Stop Attack" : "Start Attack";
    if (isAttacking) {
      attackInterval = window.setInterval(attackTabs, 3000);
      attackTabs(); // Initial attack
    } else {
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
      // Update address bar using data-url attribute
      const url = tab.getAttribute("data-url");
      if (url && addressInput) {
        addressInput.value = url;
      }
    });
  });
});
