export const titleIcons = {
    youtube: [
        {
            title: "🔴 LIVE: Cute Puppies Playing 24/7 Stream",
            icon: "favicons/youtube.ico"
        },
        {
            title: "Never Gonna Give You Up - Rick Astley ▶ 2:45",
            icon: "favicons/youtube.ico"
        }
    ],
    twitch: [
        {
            title: "🔴 xQc | GAMBLING $500K WITH YOUR COLLEGE FUNDS 🎰 | !gamble !stake [74.2K viewers]",
            icon: "favicons/twitch.ico"
        }
    ],
    funny: [
        {
            title: "System32 Deletion Progress",
            icon: "favicons/windows.ico"
        },
        {
            title: "Your Boss Behind You!",
            icon: "favicons/warning.ico"
        }
    ]
};
export function randomProgress() {
    const minutes = Math.floor(Math.random() * 15);
    const seconds = Math.floor(Math.random() * 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
export function randomViewerCount() {
    const base = Math.floor(Math.random() * 100);
    const decimal = Math.floor(Math.random() * 10);
    return `${base}.${decimal}K viewers`;
}
export function randomTitleAndIcon() {
    const rand = Math.random();
    let category;
    if (rand < 0.3) {
        category = "youtube";
    }
    else if (rand < 0.5) {
        category = "twitch";
    }
    else {
        category = "funny";
    }
    const entry = titleIcons[category][Math.floor(Math.random() * titleIcons[category].length)];
    if (category === "youtube" && entry.title.includes("▶")) {
        return {
            ...entry,
            title: entry.title.replace(/▶.*$/, `▶ ${randomProgress()}`),
        };
    }
    if (category === "twitch") {
        return {
            ...entry,
            title: entry.title.replace(/\[\d+\.?\d*K viewers\]/, `[${randomViewerCount()}]`),
        };
    }
    return entry;
}
