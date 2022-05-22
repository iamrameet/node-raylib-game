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
    this.drawBackground();
    for(const index in this.platforms){
      const platform = this.platforms[index];
      platform.draw();
    }
  }
  update(){
    this.updateBackground();
    for(const index in this.platforms){
      const platform = this.platforms[index];
      platform.update();
    }
  }
  /** @abstract */
  drawBackground(){}
  /** @abstract */
  updateBackground(){}
}

module.exports = { Level };