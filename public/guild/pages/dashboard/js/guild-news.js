// Optional: used if you want news in ticker or a news page later

async function fetchGuildNews(limit = 5) {
  // Stub for now; wire to Finnhub/NewsAPI later
  return [
    { id: "n1", headline: "Market opens higher on tech strength" },
    { id: "n2", headline: "Guild members spot pattern on SPY" }
  ].slice(0, limit);
}
