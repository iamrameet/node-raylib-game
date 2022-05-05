class Ability {
  /**
   * @param {string} name
   * @param {string} rarity
   */
  constructor(name, rarity) {
    this.name = name;
    this.rarity = rarity;
  }
  static Rarity = class Rarity {
    static COMMON = new Rarity("Common", 1, "Sky Blue");
    static SCARCE = new Rarity("Scarce", .5, "Green");
    static RARE = new Rarity("Rare", .25, "Orange");
    static UNIQUE = new Rarity("Unique", .1, "Pink");
    /**
     * @param {string} name
     * @param {number} chance Chance between 0 and 1
     * @param {string} color
     */
    constructor(name, chance = 0.1, color) {
      this.name = name;
      this.chance = chance;
      this.color = color;
      Object.freeze(this);
    }
  };
}

class AbilityCard {
  /** @param {Ability} */
  constructor(ability) {
    this.ability = ability;
  }
}

module.exports = {Ability, AbilityCard};