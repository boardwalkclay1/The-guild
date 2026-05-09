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
