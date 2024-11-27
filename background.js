const titleIcons = {
  youtube: [
    {
      title: "🔴 LIVE: Cute Puppies Playing 24/7 Stream",
      icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjgiIGZpbGw9InJlZCIvPjwvc3ZnPg=="  // Red circle for live
    },
    {
      title: "Never Gonna Give You Up - Rick Astley ▶ 2:45",
      icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBvbHlnb24gcG9pbnRzPSI2LDQgMTIsMTAgNiw4IiBmaWxsPSJyZWQiLz48L3N2Zz4="  // Play button
    },
    // ... add more YouTube entries with matching icons
  ],
  twitch: [
    {
      title: "🔴 xQc | GAMBLING $500K WITH YOUR COLLEGE FUNDS 🎰 | !gamble !stake [74.2K viewers]",
      icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjNjQ0MUE1Ii8+PC9zdmc+"  // Twitch purple
    },
    // ... add more Twitch entries with matching icons
  ],
  funny: [
    {
      title: "System32 Deletion Progress",
      icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMDA3N2ZmIi8+PC9zdmc+"  // Blue screen of death
    },
    {
      title: "Your Boss Behind You!",
      icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjgiIGZpbGw9InJlZCIvPjwvc3ZnPg=="  // Warning red
    },
    {
      title: "Not Responding",
      icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjY2NjIi8+PC9zdmc+"  // Gray for frozen
    },
    // ... add more funny entries with matching icons
  ]
};

function randomProgress() {
  const minutes = Math.floor(Math.random() * 15);
  const seconds = Math.floor(Math.random() * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function randomViewerCount() {
  const base = Math.floor(Math.random() * 100);
  const decimal = Math.floor(Math.random() * 10);
  return `${base}.${decimal}K viewers`;
}

function randomTitleAndIcon() {
  const rand = Math.random();
  let category, entry;
  
  if (rand < 0.3) { // 30% YouTube
    category = titleIcons.youtube;
    entry = category[Math.floor(Math.random() * category.length)];
    if (entry.title.includes('▶')) {
      entry = {...entry, title: entry.title.replace(/▶.*$/, `▶ ${randomProgress()}`)};
    }
  } else if (rand < 0.5) { // 20% Twitch
    category = titleIcons.twitch;
    entry = category[Math.floor(Math.random() * category.length)];
    entry = {...entry, title: entry.title.replace(/\[\d+\.?\d*K viewers\]/, `[${randomViewerCount()}]`)};
  } else { // 50% Funny
    category = titleIcons.funny;
    entry = category[Math.floor(Math.random() * category.length)];
  }
  
  return entry;
}

// Store original tab titles
const originalTitles = new Map();
const originalIcons = new Map();

// Save original title and icon when attacking
async function attackTab(tabId) {
  try {
    // Store original title and icon if we haven't yet
    if (!originalTitles.has(tabId)) {
      const [tab] = await chrome.tabs.query({ tabId });
      originalTitles.set(tabId, tab.title);
      console.log(`📝 Stored original title for tab ${tabId}: "${tab.title}"`);
      
      await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const icon = document.querySelector("link[rel*='icon']")?.href;
          return icon || '';
        }
      }).then(result => {
        if (result?.[0]?.result) {
          originalIcons.set(tabId, result[0].result);
          console.log(`🎨 Stored original icon for tab ${tabId}`);
        }
      });
    }

    const titleIcon = randomTitleAndIcon();
    console.log(`🎯 Attacking tab ${tabId} with new title: "${titleIcon.title}"`);
    
    await chrome.scripting.executeScript({
      target: { tabId },
      func: (title, icon) => {
        document.title = title;
        let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = icon;
        document.head.appendChild(link);
      },
      args: [titleIcon.title, titleIcon.icon]
    });
  } catch (e) {
    console.error(`❌ Failed to attack tab ${tabId}:`, e);
  }
}

// Restore original title and icon when tab is activated
async function restoreTab(tabId) {
  if (originalTitles.has(tabId)) {
    try {
      console.log(`🔄 Restoring tab ${tabId} to "${originalTitles.get(tabId)}"`);
      await chrome.scripting.executeScript({
        target: { tabId },
        func: (title, icon) => {
          document.title = title;
          if (icon) {
            let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.href = icon;
            document.head.appendChild(link);
          }
        },
        args: [originalTitles.get(tabId), originalIcons.get(tabId)]
      });
    } catch (e) {
      console.error(`❌ Failed to restore tab ${tabId}:`, e);
    }
  }
}

// Listen for tab activation and deactivation
chrome.tabs.onActivated.addListener(async ({ tabId, previousTabId }) => {
  console.log(`👆 Tab activated: ${tabId}, previous: ${previousTabId}`);
  if (attackInterval) {
    await restoreTab(tabId);
    if (previousTabId) {
      console.log(`👋 Left tab ${previousTabId}, attacking it`);
      await attackTab(previousTabId);
    }
  }
});

// Also attack when window loses focus
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  console.log(`🪟 Window focus changed: ${windowId}`);
  if (attackInterval && windowId === chrome.windows.WINDOW_ID_NONE) {
    console.log('💻 Chrome lost focus, attacking all tabs');
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      await attackTab(tab.id);
    }
  }
});

// Clean up stored titles when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  console.log(`🗑️ Tab ${tabId} closed, cleaning up stored data`);
  originalTitles.delete(tabId);
  originalIcons.delete(tabId);
});

async function attackTabs() {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    await attackTab(tab.id);
  }
}

// Listen for new tabs
chrome.tabs.onCreated.addListener((tab) => {
  console.log(`✨ New tab created: ${tab.id}`);
  if (attackInterval) {
    console.log(`⏳ Waiting 500ms before attacking new tab ${tab.id}`);
    setTimeout(() => attackTab(tab.id), 500);
  }
});

let attackInterval = null;

function startAttack() {
  if (!attackInterval) {
    console.log('🚀 Starting tab attack');
    attackTabs();
    attackInterval = setInterval(attackTabs, 30000);
  }
}

function stopAttack() {
  if (attackInterval) {
    console.log('🛑 Stopping tab attack');
    clearInterval(attackInterval);
    attackInterval = null;
  }
}

// Initialize attack state
chrome.storage.local.get('isAttacking', ({ isAttacking }) => {
  if (isAttacking) startAttack();
});

// Listen for toggle commands from popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.command === 'toggleAttack') {
    message.value ? startAttack() : stopAttack();
  }
}); 