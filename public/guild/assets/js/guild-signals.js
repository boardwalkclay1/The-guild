// ===============================
// API KEYS (INSERT YOURS)
// ===============================
const FINNHUB_KEY = "YOUR_FINNHUB_KEY";
const ALPHA_KEY = "YOUR_ALPHA_VANTAGE_KEY";
const TWELVE_KEY = "YOUR_TWELVE_DATA_KEY";

// ===============================
// MAIN SIGNAL FUNCTION
// ===============================
async function runGuildSignals() {
  const ticker = document.getElementById("tickerInput").value.trim().toUpperCase();
  if (!ticker) return;

  const output = document.getElementById("signalOutput");
  output.style.display = "block";
  output.innerHTML = `<div class="signal-title">Loading signals for ${ticker}...</div>`;

  // Fetch data from all 3 APIs
  const [finnhub, alpha, twelve] = await Promise.all([
    fetchFinnhub(ticker),
    fetchAlpha(ticker),
    fetchTwelve(ticker)
  ]);

  // Generate Guild signals
  const signals = generateGuildSignals({ finnhub, alpha, twelve });

  // Render
  output.innerHTML = `
    <div class="signal-title">Guild Signals for ${ticker}</div>
    ${signals.map(s => `<div class="signal-item">• ${s}</div>`).join("")}
  `;
}

// ===============================
// API FETCHERS
// ===============================
async function fetchFinnhub(ticker) {
  try {
    const url = `https://finnhub.io/api/v1/scan/technical-indicator?symbol=${ticker}&resolution=5&token=${FINNHUB_KEY}`;
    const res = await fetch(url);
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchAlpha(ticker) {
  try {
    const url = `https://www.alphavantage.co/query?function=SMA&symbol=${ticker}&interval=5min&time_period=20&apikey=${ALPHA_KEY}`;
    const res = await fetch(url);
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchTwelve(ticker) {
  try {
    const url = `https://api.twelvedata.com/sma?symbol=${ticker}&interval=5min&time_period=50&apikey=${TWELVE_KEY}`;
    const res = await fetch(url);
    return await res.json();
  } catch {
    return null;
  }
}

// ===============================
// GUILD SIGNAL LOGIC
// ===============================
function generateGuildSignals({ finnhub, alpha, twelve }) {
  const signals = [];

  // Trend signal (Finnhub)
  if (finnhub?.technicalAnalysis?.trend) {
    const trend = finnhub.technicalAnalysis.trend;
    if (trend === "up") signals.push("Bullish Trend — follow the commander.");
    if (trend === "down") signals.push("Bearish Trend — do not fight the river.");
  }

  // MA20 (Alpha Vantage)
  const ma20 = parseFloat(alpha?.TechnicalAnalysis?.SMA?.SMA || 0);
  if (ma20) signals.push(`MA20: ${ma20.toFixed(2)} — short‑term trend anchor.`);

  // MA50 (Twelve Data)
  const ma50 = parseFloat(twelve?.value || 0);
  if (ma50) signals.push(`MA50: ${ma50.toFixed(2)} — mid‑trend structure.`);

  // Guild logic
  if (ma20 && ma50) {
    if (ma20 > ma50) signals.push("MA Stack Bullish — Guild green light.");
    if (ma20 < ma50) signals.push("MA Stack Bearish — caution required.");
  }

  // Even number magnet
  if (ma20) {
    const nearestEven = Math.round(ma20 / 1) * 1;
    signals.push(`Nearest Even Number: ${nearestEven} — watch for reaction.`);
  }

  // If no signals
  if (signals.length === 0) signals.push("No signals available — check ticker or API limits.");

  return signals;
}
