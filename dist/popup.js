import { logger } from './logger';
document.addEventListener('DOMContentLoaded', async () => {
    const toggle = document.getElementById('attackToggle');
    const status = document.getElementById('status');
    const { isAttacking, loggerConfig } = await chrome.storage.local.get(['isAttacking', 'loggerConfig']);
    // Configure logger based on stored settings
    if (loggerConfig) {
        logger.configure(loggerConfig);
    }
    toggle.checked = isAttacking;
    toggle.addEventListener('change', async () => {
        await chrome.storage.local.set({ isAttacking: toggle.checked });
        status.textContent = toggle.checked ? 'Attacking tabs...' : 'Attack stopped';
        chrome.runtime.sendMessage({ command: 'toggleAttack', value: toggle.checked });
    });
});
