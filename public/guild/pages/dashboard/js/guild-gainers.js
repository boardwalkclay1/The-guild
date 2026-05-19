document.addEventListener("DOMContentLoaded", loadGainers);

// Full Guild universe
const GUILD_UNIVERSE = [
  "NVDA","AMD","PLTR","AI","MSFT","GOOGL","META","SNOW","CRWD","PATH",
  "AAL","DAL","UAL","LUV","JBLU","ALK","RYAAY","BA","HA","CPA",
  "TSLA","F","GM","RIVN","LCID","TM","HMC","NIO","XPEV","BYDDF",
  "JPM","BAC","WFC","C","GS","MS","USB","PNC","TFC","SCHW",
  "LMT","RTX","NOC","GD","HII","LHX","TXT","BWXT","AXON",
  "XOM","CVX","XLE","VLO","PSX","MPC","ENB","EPD","OKE","KMI",
  "SLB","HAL","OXY","DVN","PXD","EOG",
  "JNJ","UNH","PFE","MRK","ABBV","LLY","ABT","TMO","BMY","CVS",
  "BRK.B","BX","KKR","CG","APO","BAM","ARCC","MAIN","HTGC","OWL",
  "GLD","SLV","NEM","GOLD","FCX","RIO","BHP","VALE","AA","CLF",
  "VNQ","SPG","PLD","O","AMT","DLR","EQIX","VTR","AVB","EQR",
  "WMT","TGT","COST","HD","LOW","AMZN","BBY","M","ROST","TJX",
  "TSM","INTC","QCOM","MU","AVGO","ASML","TXN","AMAT",
  "XLU","NEE","DUK","SO","D","AEP","EXC","SRE","ED","PEG"
];

// -------------------------------
// Fetch real earnings date
// -------------------------------
async function getEarningsDate(symbol) {
  try {
    const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=calendarEvents`;
    const res = await fetch(url);
    const json = await res.json();

    const ts = json.quoteSummary.result[0].calendarEvents.earnings.earningsDate[0].raw;
    return new Date(ts * 1000).toDateString();
  } catch {
    return null;
  }
}

// -------------------------------
// Load Top 5 Gainers (Yahoo Finance)
// -------------------------------
async function loadGainers() {
  const container = document.getElementById("gainersList");
  if (!container) return;

  container.innerHTML = `<div class="loading">Loading gainers...</div>`;

  try {
    const url =
      "https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?count=200&scrIds=day_gainers";

    const res = await fetch(url);
    const json = await res.json();

    const results = json.finance.result[0].quotes;

    // Filter to your universe
    const filtered = results.filter(q => GUILD_UNIVERSE.includes(q.symbol));

    // Top 5
    const top5 = filtered.slice(0, 5);

    container.innerHTML = "";

    for (const item of top5) {
      const symbol = item.symbol;
      const price = item.regularMarketPrice;
      const pct = item.regularMarketChangePercent;
      const high = item.regularMarketDayHigh;
      const low = item.regularMarketDayLow;
      const volume = item.regularMarketVolume;

      const earnings = await getEarningsDate(symbol);

      container.innerHTML += `
        <div class="fullpage-card">
          <h2>${symbol}</h2>
          <div class="metric green">+${pct.toFixed(2)}%</div>

          ${earnings ? `<div class="earnings-tag">Earnings: ${earnings}</div>` : ""}

          <iframe
            src="https://s.tradingview.com/widgetembed/?symbol=${symbol}&interval=15&theme=dark"
            class="fullpage-chart">
          </iframe>

          <div class="extra-stats">
            <div>Price: ${price.toFixed(2)}</div>
            <div>High: ${high.toFixed(2)} | Low: ${low.toFixed(2)}</div>
            <div>Volume: ${volume.toLocaleString()}</div>
          </div>
        </div>
      `;
    }

  } catch (err) {
    console.error(err);
    container.innerHTML = `<div class="error">Failed to load gainers.</div>`;
  }
}

// Run + auto-refresh every 60s
loadGainers();
setInterval(loadGainers, 60000);
