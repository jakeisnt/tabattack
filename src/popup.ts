import { logger } from './logger';
import { StorageState } from './types';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const toggle = document.getElementById('attackToggle') as HTMLInputElement;
    if (!toggle) throw new Error('Toggle element not found');
    
    const status = document.getElementById('status');
    if (!status) throw new Error('Status element not found');
    
    const { isAttacking, loggerConfig } = await chrome.storage.local.get(['isAttacking', 'loggerConfig']) as StorageState;
    
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
  } catch (error) {
    console.error('Popup initialization failed:', error);
  }
}); 