const { Vector2 } = require("./physics");

module.exports = {
  GameScreen: {
    width: 1280,
    height: 720
  },
  Constant: {
    gravity: new Vector2(0, 0.25),
    airResistance: new Vector2(0.05, 0)
  }
};