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

  Punch: {
    dmg: 9,
    difference: 3
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

  const common = +$("#common-crit-" + chainType).val();
  const rare = +$("#rare-crit-" + chainType).val();
  const epic = +$("#epic-crit-" + chainType).val();
  const legendary = +$("#legendary-crit-" + chainType).val();
  const unique = +$("#unique-crit-" + chainType).val();

  const totalCharms = +((common * 1 * critBonus + rare * 2 * critBonus + epic * 3 * critBonus + legendary * 4 * critBonus + unique * 5 * critBonus) / 100).toFixed(2);
  return totalCharms;
}

function getCritBonus(chainType) {
  if (chainType === "base") return 1.5;
  return 1.5 + getTotalCritCharms(chainType);
}

function getBaseDmg(rarity, level) {
  const difference = weapons[rarity].difference;
  let baseDmg = weapons[rarity].dmg;

  const startLevel = rarity === "Mythic" ? 41 : 1;

  for (let i = startLevel + 1; i <= level; i++) {
    let multiplier;
    let factor;

    if (i <= 0) {
      return 0
    }
    else if (i <= 40) {
      factor = Math.floor((i - 1) / 10)
    }
    else {
      factor = Math.floor((i - 41) / 5) + 4
    }
    multiplier = 2 ** factor
    baseDmg += (difference * multiplier);
  }
  return (baseDmg); // round
}

function getFortificationBonus() {
  const fortificationLevel = +$("#fortification").val();
  return fortificationLevel * FORTIFICATION_BONUS;
}

// console.log(getBaseDmg("Mythic", 60));


function calculateTotalDmg() {
  const baseDmg = getBaseDmg($("#weapon-rarity").val(), $("#weapon-level").val());
  const basePunch = getBaseDmg("Punch", $("#knight-level").val());

  const status_bonus = +$("#attacker-bonus").val() + +$("#defender-bonus").val() + 1 + 0.5;

  let output = [];

  const punch = basePunch * (1 + 2.2 + getFortificationBonus()) * status_bonus;
  const crit_punch = punch * getCritBonus("base");

  output.push(`punch (vs armor):\t ${Math.floor(punch)} (crit: ${Math.floor(crit_punch)})`);

  for (chainType of ["base", "chain", "ult"]) {
    let chainBonus = 0;
    if (chainType === "chain") chainBonus = CHAIN_BONUS;
    if (chainType === "ult") chainBonus = ULT_CHAIN_BONUS;

    const result = baseDmg * (1 + getFortificationBonus() + getGauntletBonus() + chainBonus) * getStrongVsBonus(chainType);
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
