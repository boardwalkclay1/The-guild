document.addEventListener("DOMContentLoaded", loadLosers);

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

async function loadLosers() {
  const container = document.getElementById("losersList");
  if (!container) return;

  container.innerHTML = `<div class="loading">Loading losers...</div>`;

  try {
    const url = "https://scanner.tradingview.com/america/scan";

    const body = {
      symbols: { tickers: [] },
      columns: [
        "logoid",
        "name",
        "close",
        "change",
        "change_percent",
        "high",
        "low",
        "volume"
      ],
      filter: [
        { left: "change_percent", operation: "ne", right: null }
      ],
      options: {
        lang: "en",
        range: [0, 200],
        sort: {
          sortBy: "change_percent",
          sortOrder: "asc"
        }
      }
    };

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body)
    });

    const json = await res.json();

    if (!json.data) {
      container.innerHTML = `<div class="error">No data returned.</div>`;
      return;
    }

    const filtered = json.data.filter(r => GUILD_UNIVERSE.includes(r.s));
    const losers = filtered.slice(0, 5);

    container.innerHTML = losers.map(l => {
      const symbol = l.s;
      const price = l.d[2];
      const change = l.d[4];
      const high = l.d[5];
      const low = l.d[6];
      const volume = l.d[7];

      return `
        <div class="info-panel" onclick="go('signals-full.html?ticker=${symbol}')">
          <div><strong>${symbol}</strong> — ${change.toFixed(2)}%</div>
          <div>Price: ${price.toFixed(2)}</div>
          <div>High: ${high.toFixed(2)} | Low: ${low.toFixed(2)}</div>
          <div>Volume: ${volume.toLocaleString()}</div>
        </div>
      `;
    }).join("");

  } catch (err) {
    console.error(err);
    container.innerHTML = `<div class="error">Failed to load losers.</div>`;
  }
}
