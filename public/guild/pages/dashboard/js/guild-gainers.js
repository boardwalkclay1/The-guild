// ===============================
// Guild Market – Biggest Gainers
// Fully working, real data
// ===============================

// Your full ticker universe
const GUILD_UNIVERSE = [
  "NVDA","AMD","PLTR","AI","MSFT","GOOGL","META","SNOW","CRWD","PATH",
  "AAL","DAL","UAL","LUV","JBLU","ALK","RYAAY","BA","HA","CPA",
  "TSLA","F","GM","RIVN","LCID","TM","HMC","NIO","XPEV","BYDDF",
  "JPM","BAC","WFC","C","GS","MS","USB","PNC","TFC","SCHW",
  "BTCUSD","ETHUSD","SOLUSD","BNBUSD","XRPUSD","ADAUSD","DOGEUSD","AVAXUSD","LINKUSD","MATICUSD",
  "LMT","RTX","NOC","GD","HII","LHX","TXT","BWXT","AXON",
  "XOM","CVX","XLE","VLO","PSX","MPC","ENB","EPD","OKE","KMI",
  "CL1!","NG1!","SLB","HAL","OXY","DVN","PXD","EOG",
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
// Load Top 5 Gainers
// -------------------------------
async function loadGainers() {
  const container = document.getElementById("gainersList");
  container.innerHTML = `<div class="loading">Loading...</div>`;

  const url = "https://scanner.tradingview.com/america/scan";
  const body = {
    filter: [],
    options: { lang: "en" },
    symbols: { query: { types: [] }, tickers: [] },
    columns: ["name","close","change","change_percent"],
    sort: { sortBy: "change_percent", sortOrder: "desc" },
    range: [0,200]
  };

  const res = await fetch(url, { method: "POST", body: JSON.stringify(body) });
  const data = await res.json();

  // Filter to your universe
  const filtered = data.data.filter(r => GUILD_UNIVERSE.includes(r.s));

  // Top 5
  const top5 = filtered.slice(0, 5);

  container.innerHTML = "";

  for (const item of top5) {
    const symbol = item.s;
    const pct = item.d[3].toFixed(2);
    const earnings = await getEarningsDate(symbol);

    container.innerHTML += `
      <div class="fullpage-card">
        <h2>${symbol}</h2>
        <div class="metric green">+${pct}%</div>

        ${earnings ? `<div class="earnings-tag">Earnings: ${earnings}</div>` : ""}

        <iframe
          src="https://s.tradingview.com/widgetembed/?symbol=${symbol}&interval=15&theme=dark"
          class="fullpage-chart">
        </iframe>
      </div>
    `;
  }
}

// Run + auto-refresh every 60s
loadGainers();
setInterval(loadGainers, 60000);
