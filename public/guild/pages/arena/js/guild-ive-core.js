// CORE NAV BETWEEN MAIN ARENA + MARKET + ACCOUNT + SETTINGS + TOOLS
document.addEventListener('DOMContentLoaded', () => {
  const navButtons = document.querySelectorAll('.live-bottom-nav .nav-btn');

  const mainArena = document.querySelector('.live-main');
  const marketSection = document.getElementById('live-market-section');
  const accountSection = document.getElementById('live-account-section');
  const settingsSection = document.getElementById('live-settings-section');
  const toolsSection = document.getElementById('live-tools-section');

  function showSection(name) {
    // reset
    mainArena.style.display = 'none';
    marketSection.classList.add('hidden');
    accountSection.classList.add('hidden');
    settingsSection.classList.add('hidden');
    toolsSection.classList.add('hidden');

    if (name === 'watchlists' || name === 'arena') {
      mainArena.style.display = 'grid';
    } else if (name === 'market') {
      marketSection.classList.remove('hidden');
    } else if (name === 'account') {
      accountSection.classList.remove('hidden');
    } else if (name === 'settings') {
      settingsSection.classList.remove('hidden');
    } else if (name === 'tools') {
      toolsSection.classList.remove('hidden');
    }
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showSection(btn.dataset.nav);
    });
  });

  // default
  showSection('watchlists');

  // center tab switching (chart / options)
  const centerTabs = document.querySelectorAll('.live-tab-btn');
  const centerChart = document.getElementById('center-chart');
  const centerOptions = document.getElementById('center-options');

  centerTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      centerTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.centerTab;
      if (target === 'chart') {
        centerChart.classList.remove('hidden');
        centerOptions.classList.add('hidden');
      } else {
        centerOptions.classList.remove('hidden');
        centerChart.classList.add('hidden');
      }
    });
  });
});
