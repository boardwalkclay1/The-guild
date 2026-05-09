document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("signalContainer");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const ticker = (params.get("ticker") || "AAPL").toUpperCase();

  container.innerHTML = `<div class="info-panel">Loading signals for ${ticker}...</div>`;

  // Replace with real API calls later
  setTimeout(() => {
    const signals = [
      `${ticker} — Bullish Trend — follow the commander.`,
      `${ticker} — MA20 > MA50 — Guild green light.`,
      `${ticker} — Even Number Magnet at 200.`,
      `${ticker} — Volume Surge Detected.`
    ];

    container.innerHTML = signals.map(s => `
      <div class="info-panel">${s}</div>
    `).join("");
  }, 500);
});
