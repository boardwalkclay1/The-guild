function go(page) {
  window.location.href = page;
}

async function login() {
  const username = document.getElementById("loginUser").value.trim();
  const password = document.getElementById("loginPass").value.trim();

  if (!username || !password) {
    alert("Enter username and password.");
    return;
  }

  let res;
  try {
    res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
  } catch {
    alert("Network error.");
    return;
  }

  let data;
  try {
    data = await res.json();
  } catch {
    alert("Server error.");
    return;
  }

  if (!data.ok) {
    alert("Invalid username or password.");
    return;
  }

  if (Date.now() > data.unlock_until && data.role !== "guild_master") {
    alert("Your access has expired.");
    return;
  }

  localStorage.setItem("guild_member", "paid");
  localStorage.setItem("guild_username", username);
  localStorage.setItem("guild_unlock_until", data.unlock_until);
  localStorage.setItem("guild_role", data.role);

  window.location.href = "/guild/pages/guild.html";
}
