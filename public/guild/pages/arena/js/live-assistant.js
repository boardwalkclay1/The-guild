// Arena Assistant: observes patterns per sector / watchlist
const GuildAssistant = (() => {
  const modeSelect = document.getElementById('assistant-mode-select');
  const feedEl = document.getElementById('assistant-feed');

  function init() {
    if (!modeSelect || !feedEl) return;
    modeSelect.addEventListener('change', () => render(modeSelect.value));
    render('btc');
  }

  function render(mode) {
    feedEl.innerHTML = '';

    const box = document.createElement('div');
    box.className = 'placeholder-box small';

    if (mode === 'btc') {
      box.innerHTML = `
        Watching <strong>BTC & Followers</strong> for momentum shifts, correlation breaks, and volatility spikes.
        <br><br>Later: pattern modules will scan each chart and flag potential moves.
      `;
    } else if (mode === 'tech') {
      box.innerHTML = `
        Tracking <strong>Tech leaders</strong> for breakouts, failed highs, and rotation in/out of risk.
      `;
    } else if (mode === 'war') {
      box.innerHTML = `
        Monitoring <strong>Defense / War</strong> names for news‑driven gaps, volume surges, and trend continuation.
      `;
    } else if (mode === 'energy') {
      box.innerHTML = `
        Watching <strong>Energy</strong> for commodity‑linked moves, range breaks, and macro headlines.
      `;
    }

    feedEl.appendChild(box);
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', GuildAssistant.init);
