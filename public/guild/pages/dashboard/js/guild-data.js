// Simple watchlist + XP store

const GUILD_WATCHLIST_KEY = "guild_watchlist";
const GUILD_XP_KEY = "guild_xp";

function getWatchlist() {
  const raw = localStorage.getItem(GUILD_WATCHLIST_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveWatchlist(list) {
  localStorage.setItem(GUILD_WATCHLIST_KEY, JSON.stringify(list));
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("watchlistContainer");
  if (!container) return;

  renderWatchlist(container);

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Ticker";
  addBtn.className = "add-tf-btn";
  addBtn.onclick = () => {
    const symbol = prompt("Enter ticker (e.g., AAPL):");
    if (!symbol) return;
    const list = getWatchlist();
    if (!list.includes(symbol.toUpperCase())) {
      list.push(symbol.toUpperCase());
      saveWatchlist(list);
      renderWatchlist(container);
    }
  };
  container.before(addBtn);
});

function renderWatchlist(container) {
  const list = getWatchlist();
  if (!list.length) {
    container.innerHTML = "<div class='info-panel'>No tickers yet. Add one to start comparing patterns.</div>";
    return;
  }

  container.innerHTML = list.map(sym => `
    <div class="info-panel" onclick="go('timeframe-full.html?ticker=${sym}&tf=1h')">
      <strong>${sym}</strong> — tap to open multi‑timeframe view
    </div>
  `).join("");
}

// XP helpers used by meter
function addXP(amount) {
  const current = parseInt(localStorage.getItem(GUILD_XP_KEY) || "0");
  localStorage.setItem(GUILD_XP_KEY, current + amount);
}
