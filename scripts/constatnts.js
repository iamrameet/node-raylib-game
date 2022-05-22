const { Vector2 } = require("./physics");
const raylib = require("raylib");

module.exports = {
  GameScreen: {
    width: 1900,
    height: 1000
  },
  Constant: {
    gravity: new Vector2(0, 0.5),
    airResistance: new Vector2(0.05, 0),
    frictionFactor: 0.1,
    elasticity: 1
  },
  GameColor: {
    background: raylib.GetColor(0x050428ff)
  }
};