// Simple router helper
function go(url) {
  window.location.href = url;
}

// Init dashboard pieces
document.addEventListener("DOMContentLoaded", () => {
  loadHighLow();
  loadGuildMeter();
  loadSavedTimeframes();
});
function go(url) {
  window.location.href = url;
}

// High/Low mock
function loadHighLow() {
  const panel = document.getElementById("highLowPanel");
  if (!panel) return;

  // Replace with real API later
  const data = {
    dayHigh: 450.12,
    dayLow: 430.55,
    w52High: 480.00,
    w52Low: 320.10
  };

  panel.innerHTML = `
    <div>Day High: ${data.dayHigh}</div>
    <div>Day Low: ${data.dayLow}</div>
    <div>52W High: ${data.w52High}</div>
    <div>52W Low: ${data.w52Low}</div>
  `;
}

// Guild meter
function loadGuildMeter() {
  const xp = parseInt(localStorage.getItem("guild_xp") || "0");
  const fill = document.getElementById("guildMeterFill");
  const label = document.getElementById("guildRankLabel");
  if (!fill || !label) return;

  let rank = "Initiate";
  let pct = xp / 200 * 100;

  if (xp >= 200 && xp < 500) {
    rank = "Adept";
    pct = (xp - 200) / 300 * 100;
  } else if (xp >= 500 && xp < 1000) {
    rank = "Master";
    pct = (xp - 500) / 500 * 100;
  } else if (xp >= 1000) {
    rank = "Grandmaster";
    pct = 100;
  }

  fill.style.width = Math.min(100, Math.max(0, pct)) + "%";
  label.textContent = `${rank} — ${xp} XP`;
}

document.addEventListener("DOMContentLoaded", () => {
  loadHighLow();
  loadGuildMeter();
  loadSavedTimeframes();
});
