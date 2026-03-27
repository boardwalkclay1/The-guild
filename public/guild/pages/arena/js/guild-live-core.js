// GUILD LIVE – ARENA CORE
// Handles: screen switching + center tab switching

document.addEventListener("DOMContentLoaded", () => {

  // -----------------------------
  // SCREEN SWITCHING (BOTTOM NAV)
  // -----------------------------
  const navButtons = document.querySelectorAll(".arena-nav button");
  const screens = document.querySelectorAll(".arena-screen");

  function showScreen(name) {
    screens.forEach(screen => {
      screen.style.display = "none";
    });

    const target = document.getElementById(`screen-${name}`);
    if (target) target.style.display = "block";
  }

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const screenName = btn.dataset.screen;
      showScreen(screenName);
    });
  });

  // Default screen
  showScreen("watchlist");

  // -----------------------------------
  // CENTER TAB SWITCHING (CHART/CHAIN)
  // -----------------------------------
  const centerTabs = document.querySelectorAll("[data-center-tab]");
  const centerChart = document.getElementById("center-chart");
  const centerOptions = document.getElementById("center-options");

  if (centerTabs.length > 0) {
    centerTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        centerTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const target = tab.dataset.centerTab;

        if (target === "chart") {
          centerChart?.classList.remove("hidden");
          centerOptions?.classList.add("hidden");
        } else {
          centerOptions?.classList.remove("hidden");
          centerChart?.classList.add("hidden");
        }
      });
    });
  }

});
