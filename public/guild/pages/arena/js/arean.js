// ARENA OS — Guild Trading Platform Shell Logic

document.addEventListener("DOMContentLoaded", () => {
  const screens = document.querySelectorAll(".arena-screen");
  const navButtons = document.querySelectorAll(".arena-nav button");

  // Cache loaded screens
  const loadedScreens = {};

  function loadScreen(screenName) {
    const screen = document.getElementById(`screen-${screenName}`);
    const src = screen.getAttribute("data-src");

    // If already loaded, just show it
    if (loadedScreens[screenName]) {
      activateScreen(screenName);
      return;
    }

    // Fetch HTML file
    fetch(src)
      .then(res => res.text())
      .then(html => {
        screen.innerHTML = html;
        loadedScreens[screenName] = true;
        activateScreen(screenName);
      })
      .catch(err => {
        screen.innerHTML = `<p style="color:red;">Failed to load ${src}</p>`;
        console.error(err);
      });
  }

  function activateScreen(screenName) {
    screens.forEach(s => s.classList.remove("active"));
    navButtons.forEach(b => b.classList.remove("active"));

    document.getElementById(`screen-${screenName}`).classList.add("active");
    document.querySelector(`button[data-screen="${screenName}"]`).classList.add("active");
  }

  // Bind nav buttons
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const screenName = btn.getAttribute("data-screen");
      loadScreen(screenName);
    });
  });

  // Load default screen
  loadScreen("live");
});
