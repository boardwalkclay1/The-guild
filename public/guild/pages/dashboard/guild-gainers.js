document.addEventListener("DOMContentLoaded", loadGainers);

async function loadGainers() {
  const container = document.getElementById("gainersList");
  if (!container) return;

  container.innerHTML = "<div>Loading gainers...</div>";

  try {
    // Replace with real API call
    const mock = [
      { symbol: "NVDA", price: 950.12, change: 4.2, high: 960, low: 910, volume: 12000000 },
      { symbol: "TSLA", price: 210.45, change: 3.8, high: 215, low: 200, volume: 18000000 }
    ];

    container.innerHTML = mock.map(g => `
      <div class="info-panel" onclick="go('signals-full.html?ticker=${g.symbol}')">
        <div><strong>${g.symbol}</strong> — +${g.change}%</div>
        <div>Price: ${g.price}</div>
        <div>High: ${g.high} | Low: ${g.low}</div>
        <div>Volume: ${g.volume.toLocaleString()}</div>
      </div>
    `).join("");
  } catch (e) {
    container.innerHTML = "<div>Failed to load gainers.</div>";
  }
}
