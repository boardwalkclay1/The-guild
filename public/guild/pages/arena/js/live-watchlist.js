// Handles curated watchlists (BTC, Tech, War, etc.) and ties them to options chains
const GuildWatchlists = (() => {
  const selectEl = document.getElementById('watchlist-select');
  const listEl = document.getElementById('watchlist-list');
  const leadTitle = document.getElementById('lead-symbol-title');

  const WATCHLISTS = {
    btc: { name: 'Bitcoin & Followers', symbols: ['BTCUSD', 'MSTR', 'MARA', 'RIOT'] },
    tech: { name: 'Tech Leaders', symbols: ['AAPL', 'MSFT', 'NVDA', 'META', 'TSLA'] },
    war: { name: 'War / Defense', symbols: ['LMT', 'NOC', 'RTX', 'GD'] },
    energy: { name: 'Energy', symbols: ['XOM', 'CVX', 'SLB', 'HAL'] }
  };

  function init() {
    if (!selectEl || !listEl) return;

    // populate dropdown
    Object.entries(WATCHLISTS).forEach(([key, wl]) => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = wl.name;
      selectEl.appendChild(opt);
    });

    selectEl.addEventListener('change', () => render(selectEl.value));
    render('btc');
  }

  function render(key) {
    const wl = WATCHLISTS[key];
    if (!wl) return;

    listEl.innerHTML = '';
    wl.symbols.forEach(sym => {
      const row = document.createElement('div');
      row.className = 'watchlist-row';
      row.innerHTML = `
        <div class="wl-symbol">${sym}</div>
        <button class="wl-btn" data-symbol="${sym}">Chain</button>
      `;
      listEl.appendChild(row);
    });

    leadTitle.textContent = wl.name;
    listEl.querySelectorAll('.wl-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const symbol = btn.dataset.symbol;
        leadTitle.textContent = symbol;
        // later: call options module + chart module
        if (window.GuildOptions) {
          window.GuildOptions.loadChain(symbol);
        }
      });
    });
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', GuildWatchlists.init);
