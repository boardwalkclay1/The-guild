document.addEventListener("DOMContentLoaded", loadLosers);

// Full Guild universe
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

async function loadLosers() {
  const container = document.getElementById("losersList");
  if (!container) return;

  container.innerHTML = `<div class="loading">Loading losers...</div>`;

  try {
    // TradingView Screener API
    const url = "https://scanner.tradingview.com/america/scan";
    const body = {
      filter: [],
      options: { lang: "en" },
      symbols: { query: { types: [] }, tickers: [] },
      columns: [
        "name",
        "close",
        "change",
        "change_percent",
        "high",
        "low",
        "volume"
      ],
      sort: { sortBy: "change_percent", sortOrder: "asc" },
      range: [0, 200]
    };

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body)
    });

    const data = await res.json();

    // Filter to your universe
    const filtered = data.data.filter(r => GUILD_UNIVERSE.includes(r.s));

    // Top 5 losers
    const losers = filtered.slice(0, 5);

    container.innerHTML = losers.map(l => {
      const symbol = l.s;
      const price = l.d[1];
      const change = l.d[3];
      const high = l.d[4];
      const low = l.d[5];
      const volume = l.d[6];

      return `
        <div class="info-panel" onclick="go('signals-full.html?ticker=${symbol}')">
          <div><strong>${symbol}</strong> — ${change.toFixed(2)}%</div>
          <div>Price: ${price.toFixed(2)}</div>
          <div>High: ${high.toFixed(2)} | Low: ${low.toFixed(2)}</div>
          <div>Volume: ${volume.toLocaleString()}</div>
        </div>
      `;
    }).join("");

  } catch (e) {
    container.innerHTML = `<div class="error">Failed to load losers.</div>`;
  }
}
