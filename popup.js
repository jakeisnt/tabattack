document.addEventListener('DOMContentLoaded', async () => {
  const toggle = document.getElementById('attackToggle');
  const status = document.getElementById('status');
  
  // Get current state
  const { isAttacking } = await chrome.storage.local.get('isAttacking');
  toggle.checked = isAttacking;
  
  toggle.addEventListener('change', async () => {
    await chrome.storage.local.set({ isAttacking: toggle.checked });
    status.textContent = toggle.checked ? 'Attacking tabs...' : 'Attack stopped';
    chrome.runtime.sendMessage({ command: 'toggleAttack', value: toggle.checked });
  });
}); 