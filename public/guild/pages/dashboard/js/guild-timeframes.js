// DASHBOARD SIDE (cards only)
let timeframes = [];

function addTimeframe() {
  if (timeframes.length >= 4) return alert("Max 4 timeframes.");
  const tf = prompt("Enter timeframe (1m, 5m, 15m, 1h, 4h, 1d):");
  if (!tf) return;
  timeframes.push(tf);
  saveTimeframes();
  renderTimeframes();
}

function renderTimeframes() {
  const grid = document.getElementById("timeframeGrid");
  if (!grid) return;
  grid.innerHTML = "";

  timeframes.forEach((tf, idx) => {
    grid.innerHTML += `
      <div class="timeframe-card">
        <h3>${tf} Timeframe</h3>
        <p>Click to open full chart</p>
        <button onclick="openTimeframe('${tf}')">Open</button>
        <button onclick="removeTimeframe(${idx})">Remove</button>
      </div>
    `;
  });
}

function openTimeframe(tf) {
  const ticker = prompt("Enter ticker (e.g., AAPL):", "AAPL");
  if (!ticker) return;
  go(`timeframe-full.html?ticker=${encodeURIComponent(ticker)}&tf=${encodeURIComponent(tf)}`);
}

function removeTimeframe(index) {
  timeframes.splice(index, 1);
  saveTimeframes();
  renderTimeframes();
}

function saveTimeframes() {
  localStorage.setItem("guild_timeframes", JSON.stringify(timeframes));
}

function loadSavedTimeframes() {
  const saved = localStorage.getItem("guild_timeframes");
  if (saved) timeframes = JSON.parse(saved);
  renderTimeframes();
}

// FULL PAGE SIDE (iframe/chart)
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("timeframeChart");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const ticker = params.get("ticker") || "AAPL";
  const tf = params.get("tf") || "1h";

  container.innerHTML = `
    <div class="info-panel">
      <h2>${ticker} — ${tf} Chart</h2>
      <iframe
        src="https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(ticker)}&interval=${encodeURIComponent(tf)}"
        style="width:100%;height:500px;border:none;border-radius:12px;"
        loading="lazy"
      ></iframe>
      <div class="info-panel" style="margin-top:20px;">
        <div><strong>Guild Data Box</strong></div>
        <div>Trend: loading...</div>
        <div>MA Stack: loading...</div>
        <div>Even Number Zone: loading...</div>
        <div>Volume Strength: loading...</div>
        <div>Candle Pattern: loading...</div>
      </div>
    </div>
  `;
});
