// XP.JS

function getXP() {
  return parseInt(localStorage.getItem("guildXP") || "0");
}

function addXP(amount) {
  const current = getXP();
  const updated = current + amount;
  localStorage.setItem("guildXP", updated);
  return updated;
}
