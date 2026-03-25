// BADGES.JS

function unlockBadge(badgeName) {
  let badges = JSON.parse(localStorage.getItem("guildBadges") || "{}");
  badges[badgeName] = true;
  localStorage.setItem("guildBadges", JSON.stringify(badges));
}

function hasBadge(badgeName) {
  let badges = JSON.parse(localStorage.getItem("guildBadges") || "{}");
  return badges[badgeName] === true;
}
