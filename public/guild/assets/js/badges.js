// BADGES.JS — localStorage badge engine

function getBadges() {
  return JSON.parse(localStorage.getItem("guildBadges") || "{}");
}

function unlockBadge(badgeName) {
  const badges = getBadges();
  badges[badgeName] = true;
  localStorage.setItem("guildBadges", JSON.stringify(badges));
}

function hasBadge(badgeName) {
  const badges = getBadges();
  return badges[badgeName] === true;
}

function resetBadges() {
  localStorage.setItem("guildBadges", "{}");
}
