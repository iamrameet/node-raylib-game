const raylib = require("raylib");
const { GameScreen } = require("./constatnts");
const { Trapizum } = require("./obstacle");

class Level{
  /** @type {Trapizum[]} */
  platforms = [];
  constructor(){
    this.width = GameScreen.width;
    this.height = GameScreen.height;
  }
  draw(){
    for(const index in this.platforms){
      const platform = this.platforms[index];
      platform.draw();
    }
  }
  update(){}
}

module.exports = { Level };