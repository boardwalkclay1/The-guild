document.addEventListener("DOMContentLoaded", loadTicker);

async function loadTicker() {
  const el = document.getElementById("guildTickerInner");
  if (!el) return;

  // You can replace this with live API data later
  const items = [
    { text: "AAPL — Bullish Trend Strike", link: "signals-full.html?ticker=AAPL" },
    { text: "TSLA — Even Number Reaction at 200", link: "signals-full.html?ticker=TSLA" },
    { text: "SPY — 52W High Breakout", link: "timeframe-full.html?ticker=SPY&tf=1d" },
    { text: "NVDA — Top Gainer Alert", link: "gainers-full.html" },
    { text: "AMZN — Top Loser Alert", link: "losers-full.html" }
  ];

  el.innerHTML = items
    .map(i => `<span class="guild-ticker-item" onclick="go('${i.link}')">${i.text}</span>`)
    .join("");
}
