export const titleIcons = {
    youtube: [
        {
            title: "🔴 LIVE: Cute Puppies Playing 24/7 Stream",
            icon: "data:image/svg+xml;base64,..."
        },
        // ... rest of your icons
    ],
    // ... rest of categories
};

export function randomTitleAndIcon() {
    const categories = Object.keys(titleIcons);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const titles = titleIcons[category];
    return titles[Math.floor(Math.random() * titles.length)];
}

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