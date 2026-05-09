document.addEventListener("DOMContentLoaded", loadLosers);

async function loadLosers() {
  const container = document.getElementById("losersList");
  if (!container) return;

  container.innerHTML = "<div>Loading losers...</div>";

  try {
    // Replace with real API call
    const mock = [
      { symbol: "AMZN", price: 120.33, change: -3.1, high: 125, low: 118, volume: 15000000 },
      { symbol: "META", price: 380.22, change: -2.7, high: 392, low: 378, volume: 9000000 }
    ];

    container.innerHTML = mock.map(l => `
      <div class="info-panel" onclick="go('signals-full.html?ticker=${l.symbol}')">
        <div><strong>${l.symbol}</strong> — ${l.change}%</div>
        <div>Price: ${l.price}</div>
        <div>High: ${l.high} | Low: ${l.low}</div>
        <div>Volume: ${l.volume.toLocaleString()}</div>
      </div>
    `).join("");
  } catch (e) {
    container.innerHTML = "<div>Failed to load losers.</div>";
  }
}
