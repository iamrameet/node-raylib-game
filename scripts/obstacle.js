const raylib = require("raylib");
const { Entity } = require("./entity");

class Obstacle extends Entity{
  constructor(x, y, width, height){
    super(x, y);
    this.width = width;
    this.height = height;
    this.color = raylib.GetColor(0xe69301ff);
  }
  draw(){
    raylib.DrawRectangle(this.x, this.y, this.width, this.height, this.color);
  }
  update(){}
  /** @param {Player} player */
  isCollidingPlayer(player){
    return raylib.CheckCollisionCircleRec(player, player.mass, this);
  }
  /** @param {Bullet} bullet */
  isCollidingBullet(bullet){
    return raylib.CheckCollisionCircleRec(bullet, bullet.size, this);
  }
}

class PolyObstacle extends Entity{
  constructor(x, y, sides, radius){
    super(x, y);
    this.sides = sides;
    this.radius = radius;
    this.color = raylib.GetColor(0xe69301ff);
  }
  draw(){
    raylib.DrawPoly(this, this.sides, this.radius, 0, this.color);
  }
  update(){}
  /** @param {Player} player */
  isCollidingPlayer(player){
    return false;
  }
  /** @param {Bullet} bullet */
  isCollidingBullet(bullet){
    return false;
  }
}

module.exports = {Obstacle, PolyObstacle};