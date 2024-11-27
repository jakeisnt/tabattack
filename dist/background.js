import { logger } from './logger';
const titleIcons = {
    youtube: [
        {
            title: "🔴 LIVE: Cute Puppies Playing 24/7 Stream",
            icon: "data:image/svg+xml;base64,..." // existing base64
        },
        // ... rest of your icons
    ],
    twitch: [
    // ... your twitch icons
    ],
    funny: [
    // ... your funny icons
    ]
};
const originalStates = new Map();
let attackInterval = null;
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
    let category;
    let entry;
    if (rand < 0.3) {
        category = 'youtube';
    }
    else if (rand < 0.5) {
        category = 'twitch';
    }
    else {
        category = 'funny';
    }
    entry = titleIcons[category][Math.floor(Math.random() * titleIcons[category].length)];
    if (category === 'youtube' && entry.title.includes('▶')) {
        return { ...entry, title: entry.title.replace(/▶.*$/, `▶ ${randomProgress()}`) };
    }
    if (category === 'twitch') {
        return { ...entry, title: entry.title.replace(/\[\d+\.?\d*K viewers\]/, `[${randomViewerCount()}]`) };
    }
    return entry;
}
async function attackTab(tabId) {
    try {
        if (!originalStates.has(tabId)) {
            const [tab] = await chrome.tabs.query({ tabId });
            if (!tab)
                throw new Error(`Tab ${tabId} not found`);
            originalStates.set(tabId, { title: tab.title || '', icon: '' });
            logger.debug(`Stored original title for tab ${tabId}: "${tab.title}"`);
            const [iconResult] = await chrome.scripting.executeScript({
                target: { tabId },
                func: () => document.querySelector("link[rel*='icon']")?.href || ''
            });
            if (iconResult?.result) {
                originalStates.get(tabId).icon = iconResult.result;
                logger.debug(`Stored original icon for tab ${tabId}`);
            }
        }
        const titleIcon = randomTitleAndIcon();
        logger.info(`Attacking tab ${tabId} with new title: "${titleIcon.title}"`);
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
    }
    catch (e) {
        logger.error(`Failed to attack tab ${tabId}`, e);
    }
}
// ... rest of your functions with TypeScript types ... 
