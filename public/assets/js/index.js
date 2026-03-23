function go(page) {
  window.location.href = page;
}

// SHA-256 helper
async function sha256(str) {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// REAL MASTER LOGIN HASHES
const MASTER_USER_HASH = "4720e4a4f3f8f5e9c6b7e3d5b1a9f4c2e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3";
const MASTER_PASS_HASH = "f6c3b2a1d9e8c7b6a5f4e3d2c1b0a9988776655443322110ffeeddccbbaa9988";

async function login() {
  const username = document.getElementById("loginUser").value.trim();
  const password = document.getElementById("loginPass").value.trim();

  if (!username || !password) {
    alert("Enter username and password.");
    return;
  }

  const userHash = await sha256(username);
  const passHash = await sha256(password);

  // MASTER LOGIN CHECK
  if (userHash === MASTER_USER_HASH && passHash === MASTER_PASS_HASH) {
    localStorage.setItem("guild_member", "paid");
    localStorage.setItem("guild_username", "Guild Master");
    localStorage.setItem("guild_role", "guild_master");

    go("/guild/pages/guild.html");
    return;
  }

  alert("Invalid username or password.");
}
