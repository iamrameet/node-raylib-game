const raylib = require("raylib");
const { Vector2 } = require("./physics");
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

class Trapizum extends Entity{
  constructor(x, y, topWidth, bottomWidth, height, isCenter = true){
    super(x, y);
    this.topWidth = topWidth;
    this.bottomWidth = bottomWidth;
    this.height = height;
    this.color = raylib.GetColor(0xe69301ff);
    this.points={
      triangleL:[
        new Vector2(x - bottomWidth/2, y + height/2),
        new Vector2(x - topWidth/2, y + height/2),
        new Vector2(x - topWidth/2, y - height/2)
      ],
      triangleR:[
        new Vector2(x + bottomWidth/2, y + height/2),
        new Vector2(x + topWidth/2, y + height/2),
        new Vector2(x + topWidth/2, y - height/2)
      ],
      rectangle:[x - topWidth/2, y - height/2]
    };
    console.log(this.points.triangleR)
  }
  draw(){
    raylib.DrawTriangle(this.points.triangleL[0], this.points.triangleL[1], this.points.triangleL[2], raylib.RED);
    raylib.DrawTriangle(this.points.triangleR[0], this.points.triangleR[1], this.points.triangleR[2], raylib.RED);
    raylib.DrawRectangle(this.points.rectangle[0], this.points.rectangle[1], this.topWidth, this.height, this.color);
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

class Platform extends Entity{
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

module.exports = {Obstacle, Trapizum, Platform};