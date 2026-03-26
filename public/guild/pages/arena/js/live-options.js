// Handles options chain display for the selected symbol
window.GuildOptions = (() => {
  const chainEl = document.getElementById('options-chain');

  function loadChain(symbol) {
    if (!chainEl) return;
    chainEl.innerHTML = `
      <div class="placeholder-box">
        Options chain for <strong>${symbol}</strong> will load here.
        <br>Later: Alpaca options data, strikes, expirations, calls/puts, quick trade buttons.
      </div>
    `;
  }

  return { loadChain };
})();
