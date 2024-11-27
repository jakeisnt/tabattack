const titleIcons = {
    youtube: [
        {
            title: "🔴 LIVE: Cute Puppies Playing 24/7 Stream",
            favicon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjgiIGZpbGw9InJlZCIvPjwvc3ZnPg=="
        },
        {
            title: "Never Gonna Give You Up - Rick Astley ▶ 2:45",
            favicon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBvbHlnb24gcG9pbnRzPSI2LDQgMTIsMTAgNiw4IiBmaWxsPSJyZWQiLz48L3N2Zz4="
        }
    ],
    twitch: [
        {
            title: "🔴 xQc | GAMBLING $500K WITH YOUR COLLEGE FUNDS 🎰 | !gamble !stake [74.2K viewers]",
            favicon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjNjQ0MUE1Ii8+PC9zdmc+"
        }
    ],
    funny: [
        {
            title: "System32 Deletion Progress",
            favicon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMDA3N2ZmIi8+PC9zdmc+"
        },
        {
            title: "Your Boss Behind You!",
            favicon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjgiIGZpbGw9InJlZCIvPjwvc3ZnPg=="
        }
    ]
};

let isAttacking = false;
let attackInterval;

function getRandomTitle() {
    const categories = Object.keys(titleIcons);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const titles = titleIcons[category];
    return titles[Math.floor(Math.random() * titles.length)];
}

function attackTabs() {
    const tabs = document.querySelectorAll('.tab:not(.active)');
    tabs.forEach(tab => {
        const newTitle = getRandomTitle();
        tab.textContent = newTitle.title;
        tab.style.backgroundImage = `url(${newTitle.favicon})`;
    });
}

function restoreTab(tab) {
    tab.textContent = tab.dataset.original;
    tab.style.backgroundImage = `url(${tab.dataset.favicon})`;
}

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleAttack');
    const tabs = document.querySelectorAll('.tab');

    // Initialize tabs with favicons
    tabs.forEach(tab => {
        tab.style.backgroundImage = `url(${tab.dataset.favicon})`;
    });

    toggleBtn.addEventListener('click', () => {
        isAttacking = !isAttacking;
        toggleBtn.textContent = isAttacking ? 'Stop Attack' : 'Start Attack';
        
        if (isAttacking) {
            attackInterval = setInterval(attackTabs, 3000);
            attackTabs(); // Initial attack
        } else {
            clearInterval(attackInterval);
            // Restore all tabs
            tabs.forEach(tab => restoreTab(tab));
        }
    });

    // Handle tab clicking
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => {
                t.classList.remove('active');
                if (isAttacking) {
                    restoreTab(t);
                }
            });
            
            // Add active class to clicked tab
            tab.classList.add('active');
            restoreTab(tab);
        });
    });
}); 