function go(page) {
  window.location.href = page;
}

// LOGIN FUNCTION (JSON-POWERED)
async function login() {
  const username = document.getElementById("loginUser").value.trim();
  const password = document.getElementById("loginPass").value.trim();

  if (!username || !password) {
    alert("Enter username and password.");
    return;
  }

  try {
    // Load users.json from your repo
    const res = await fetch("/data/users.json");
    const data = await res.json();

    // Find matching user
    const user = data.users.find(
      u => u.email.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (user) {
      // Save session
      localStorage.setItem("guild_member", "paid");
      localStorage.setItem("guild_username", user.email);
      localStorage.setItem("guild_role", user.role || "guild_member");

      go("/guild/pages/guild.html");
      return;
    }

    alert("Invalid username or password.");
  } catch (err) {
    console.error(err);
    alert("Login system error.");
  }
}
