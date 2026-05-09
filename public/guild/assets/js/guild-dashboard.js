function go(url) {
  window.location.href = url;
}

/* -----------------------------
   TICKER
----------------------------- */
document.addEventListener("DOMContentLoaded", loadTicker);

async function loadTicker() {
  const el = document.getElementById("guildTickerInner");
  if (!el) return;

  const items = [
    { text: "AAPL — Bullish Trend Strike", link: "/guild/pages/signals/guild-signals.html?ticker=AAPL" },
    { text: "TSLA — Even Number Reaction at 200", link: "/guild/pages/signals/guild-signals.html?ticker=TSLA" },
    { text: "SPY — 52W High Breakout", link: "/guild/pages/dashboard/timeframe-full.html?ticker=SPY" }
  ];

  el.innerHTML = items
    .map(i => `<span class="guild-ticker-item" onclick="go('${i.link}')">${i.text}</span>`)
    .join("");
}

/* -----------------------------
   HIGHS / LOWS
----------------------------- */
document.addEventListener("DOMContentLoaded", loadHighLow);

function loadHighLow() {
  const panel = document.getElementById("highLowPanel");
  panel.innerHTML = `
    <div>Day High: 0.00</div>
    <div>Day Low: 0.00</div>
    <div>52W High: 0.00</div>
    <div>52W Low: 0.00</div>
  `;
}

/* -----------------------------
   TIMEFRAMES
----------------------------- */
let timeframes = [];

function addTimeframe() {
  if (timeframes.length >= 4) return;

  const tf = prompt("Enter timeframe (1m, 5m, 15m, 1h, 4h, 1d):");
  if (!tf) return;

  timeframes.push(tf);
  renderTimeframes();
}

function renderTimeframes() {
  const grid = document.getElementById("timeframeGrid");
  grid.innerHTML = "";

  timeframes.forEach(tf => {
    grid.innerHTML += `
      <div class="timeframe-card" onclick="go('/guild/pages/dashboard/timeframe-full.html?tf=${tf}')">
        <h3>${tf} Timeframe</h3>
        <p>Click to open full chart</p>
      </div>
    `;
  });
}

/* -----------------------------
   GUILD METER
----------------------------- */
document.addEventListener("DOMContentLoaded", loadGuildMeter);

function loadGuildMeter() {
  const xp = parseInt(localStorage.getItem("guild_xp") || "0");
  const fill = document.getElementById("guildMeterFill");
  const label = document.getElementById("guildRankLabel");

  let rank = "Initiate";
  let pct = xp / 200 * 100;

  if (xp >= 200) { rank = "Adept"; pct = (xp - 200) / 300 * 100; }
  if (xp >= 500) { rank = "Master"; pct = (xp - 500) / 500 * 100; }
  if (xp >= 1000) { rank = "Grandmaster"; pct = 100; }

  fill.style.width = pct + "%";
  label.textContent = rank;
}
