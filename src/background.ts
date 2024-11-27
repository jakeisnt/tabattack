import { logger } from "./logger";
import { TitleIcon, TabState, TitleCategory } from "./types";

const titleIcons: Record<TitleCategory, TitleIcon[]> = {
  youtube: [
    {
      title: "🔴 LIVE: Cute Puppies Playing 24/7 Stream",
      icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjgiIGZpbGw9InJlZCIvPjwvc3ZnPg==",
    },
    {
      title: "Never Gonna Give You Up - Rick Astley ▶ 2:45",
      icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBvbHlnb24gcG9pbnRzPSI2LDQgMTIsMTAgNiw4IiBmaWxsPSJyZWQiLz48L3N2Zz4=",
    },
  ],
  twitch: [
    {
      title:
        "🔴 xQc | GAMBLING $500K WITH YOUR COLLEGE FUNDS 🎰 | !gamble !stake [74.2K viewers]",
      icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjNjQ0MUE1Ii8+PC9zdmc+",
    },
    {
      title:
        "🔴 Ninja | FORTNITE VICTORY ROYALES ALL DAY | !prime !sub [52.1K viewers]",
      icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjNjQ0MUE1Ii8+PC9zdmc+",
    },
  ],
  funny: [
    {
      title: "System32 Deletion Progress",
      icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMDA3N2ZmIi8+PC9zdmc+",
    },
    {
      title: "Your Boss Behind You!",
      icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjgiIGZpbGw9InJlZCIvPjwvc3ZnPg==",
    },
    {
      title: "Not Responding",
      icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjY2NjIi8+PC9zdmc+",
    },
  ],
};

const originalStates = new Map<number, TabState>();
let attackInterval: number | null = null;

function randomProgress(): string {
  const minutes = Math.floor(Math.random() * 15);
  const seconds = Math.floor(Math.random() * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function randomViewerCount(): string {
  const base = Math.floor(Math.random() * 100);
  const decimal = Math.floor(Math.random() * 10);
  return `${base}.${decimal}K viewers`;
}

function randomTitleAndIcon(): TitleIcon {
  const rand = Math.random();
  let category: TitleCategory;
  let entry: TitleIcon;

  if (rand < 0.3) {
    category = "youtube";
  } else if (rand < 0.5) {
    category = "twitch";
  } else {
    category = "funny";
  }

  entry =
    titleIcons[category][
      Math.floor(Math.random() * titleIcons[category].length)
    ];

  if (category === "youtube" && entry.title.includes("▶")) {
    return {
      ...entry,
      title: entry.title.replace(/▶.*$/, `▶ ${randomProgress()}`),
    };
  }

  if (category === "twitch") {
    return {
      ...entry,
      title: entry.title.replace(
        /\[\d+\.?\d*K viewers\]/,
        `[${randomViewerCount()}]`
      ),
    };
  }

  return entry;
}

async function attackTab(tabId: number): Promise<void> {
  try {
    if (!originalStates.has(tabId)) {
      const tab = await chrome.tabs.get(tabId);
      if (!tab) throw new Error(`Tab ${tabId} not found`);

      originalStates.set(tabId, { title: tab.title || "", icon: "" });

      const [iconResult] = await chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: () => {
          const iconLink = document.querySelector(
            "link[rel*='icon']"
          ) as HTMLLinkElement;
          return iconLink?.href || "";
        },
      });

      if (iconResult?.result) {
        originalStates.get(tabId)!.icon = iconResult.result;
        logger.debug(`Stored original icon for tab ${tabId}`);
      }
    }

    const titleIcon = randomTitleAndIcon();
    logger.info(`Attacking tab ${tabId} with new title: "${titleIcon.title}"`);

    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: (title: string, icon: string) => {
        document.title = title;
        let link =
          (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
          (document.createElement("link") as HTMLLinkElement);
        link.type = "image/x-icon";
        link.rel = "shortcut icon";
        link.href = icon;
        document.head.appendChild(link);
      },
      args: [titleIcon.title, titleIcon.icon],
    });
  } catch (e) {
    logger.error(`Failed to attack tab ${tabId}`, e as Error);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  logger.info("Extension installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "toggleAttack") {
    // Your existing attack toggle logic
    sendResponse({ success: true });
  }
  return true;
});
