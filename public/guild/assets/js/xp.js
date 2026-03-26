// XP.JS — localStorage XP engine

function getXP() {
  return parseInt(localStorage.getItem("guildXP") || "0");
}

function addXP(amount) {
  const current = getXP();
  const updated = current + amount;
  localStorage.setItem("guildXP", updated);
  return updated;
}

function resetXP() {
  localStorage.setItem("guildXP", "0");
}
