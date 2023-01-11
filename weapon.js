const CHAIN_BONUS = 0.25;
const ULT_CHAIN_BONUS = 0.50;
const STATUS_BONUS = 0.35;
const FORTIFICATION_BONUS = 0.25;

const weapons = {
  Rare: {
    dmg: 19,
    difference: 5
  },
  Epic: {
    dmg: 34,
    difference: 6
  },
  Legendary: {
    dmg: 45,
    difference: 7
  },
  Unique: {
    dmg: 56,
    difference: 8
  },
  Mythic: {
    dmg: 1576,
    difference: 9
  },
}

function getGauntletBonus(totalNodes) {
  // return 6 + (3 * totalNodes);
  return +$("#gauntlet-bonus").val() / 100;
}

function getStrongVsBonus(chainType) {
  const attackerBonus = +$("#attacker-bonus").val();
  const defenderBonus = +$("#defender-bonus").val();
  return attackerBonus + defenderBonus + 1 + getTotalDamageCharms(chainType);
}

function getTotalDamageCharms(chainType) {
  const damageBonus = chainType === "ult" ? 30 : 10;
  const common = +$("#common-status").val();
  const rare = +$("#rare-status").val();
  const epic = +$("#epic-status").val();
  const legendary = +$("#legendary-status").val();
  const unique = +$("#unique-status").val();

  const totalCharms = +((common * 1 * damageBonus + rare * 2 * damageBonus + epic * 3 * damageBonus + legendary * 4 * damageBonus + unique * 5 * damageBonus) / 100).toFixed(2);
  return totalCharms;
}

function getTotalCritCharms(chainType) {
  let critBonus = 0;
  if (chainType === "chain") critBonus = 20;
  if (chainType === "ult") critBonus = 30;

  const common = +$("#common-crit").val();
  const rare = +$("#rare-crit").val();
  const epic = +$("#epic-crit").val();
  const legendary = +$("#legendary-crit").val();
  const unique = +$("#unique-crit").val();

  const totalCharms = +((common * 1 * critBonus + rare * 2 * critBonus + epic * 3 * critBonus + legendary * 4 * critBonus + unique * 5 * critBonus) / 100).toFixed(2);
  return totalCharms;
}

function getCritBonus(chainType) {
  return 1.5 + getTotalCritCharms(chainType);
}

function getBaseDmg(rarity, level) {
  const difference = weapons[rarity].difference;
  let baseDmg = weapons[rarity].dmg;

  const startLevel = rarity === "Mythic" ? 41 : 1;
  for (let i = startLevel + 1; i <= level; i++) {
    let multiplier;

    switch (true) {

      case i <= 10:
        multiplier = 1;
        break;

      case i <= 20:
        multiplier = 2;
        break;

      case i <= 30:
        multiplier = 4;
        break;

      case i <= 40:
        multiplier = 8;
        break;

      case i <= 45:
        multiplier = 16;
        break;

      case i <= 50:
        multiplier = 32;
        break;

      case i <= 55:
        multiplier = 64;
        break;

      case i <= 60:
        multiplier = 128;
        break;
    }
    baseDmg += (difference * multiplier);
  }
  return (baseDmg); // round
}

function getFortificationBonus() {
  const fortificationLevel = +$("#fortification").val();
  return fortificationLevel * FORTIFICATION_BONUS + 1;
}

// console.log(getBaseDmg("Mythic", 60));


function calculateTotalDmg() {
  const baseDmg = getBaseDmg($("#weapon-rarity").val(), $("#weapon-level").val());

  let output = [];

  for (chainType of ["base", "chain", "ult"]) {
    let chainBonus = 0;
    if (chainType === "chain") chainBonus = CHAIN_BONUS;
    if (chainType === "ult") chainBonus = ULT_CHAIN_BONUS;

    const result = baseDmg * (1 + getGauntletBonus() + chainBonus) * getStrongVsBonus(chainType) * getFortificationBonus();
    const critResult = result * getCritBonus(chainType);

    output.push(`${chainType}:\t ${Math.floor(result)} (crit: ${Math.floor(critResult)})`);
  }

  $("#result").val(output.join("\n"));
}


$("#weapon-rarity").each(function () {
  $(this).on("change", function () {
    const rarity = $(this).children("option:selected").val();
    $(this).removeClass("border-rare border-epic border-legendary border-unique border-mythic");
    switch (rarity) {
      case "Mythic":
        $(this).addClass("border-mythic");
        break;

      case "Unique":
        $(this).addClass("border-unique");
        break;

      case "Legendary":
        $(this).addClass("border-legendary");
        break;

      case "Epic":
        $(this).addClass("border-epic");
        break;

      case "Rare":
        $(this).addClass("border-rare");
        break;
    }
  }).trigger("change");
});
