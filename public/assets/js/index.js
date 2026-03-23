function go(page) {
  window.location.href = page;
}

// MASTER CREDENTIALS (PLAIN TEXT)
const MASTER_USER = "Master";
const MASTER_PASS = "Always/6";

async function login() {
  const username = document.getElementById("loginUser").value.trim();
  const password = document.getElementById("loginPass").value.trim();

  if (!username || !password) {
    alert("Enter username and password.");
    return;
  }

  // MASTER LOGIN CHECK (PLAIN TEXT)
  if (username === MASTER_USER && password === MASTER_PASS) {
    localStorage.setItem("guild_member", "paid");
    localStorage.setItem("guild_username", "Guild Master");
    localStorage.setItem("guild_role", "guild_master");

    go("/guild/pages/guild.html");
    return;
  }

  alert("Invalid username or password.");
}
