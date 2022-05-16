const { Vector2 } = require("./physics");

class Entity{
  constructor(x, y){
    this.position = new Vector2(x, y);
  }
  get x(){
    return this.position.x;
  }
  get y(){
    return this.position.y;
  }
  draw(){}
  update(){}
}

module.exports = { Entity };