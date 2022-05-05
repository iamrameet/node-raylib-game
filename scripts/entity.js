const { Vector2 } = require("./physics");

class Entity extends Vector2{
  constructor(x, y){
    super(x, y);
  }
  draw(){}
  update(){}
}

module.exports = {Entity};