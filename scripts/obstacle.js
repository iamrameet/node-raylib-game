const raylib = require("raylib");
const { Vector2 } = require("./physics");
const { Entity } = require("./entity");
const { Player } = require("./player");
const { GameScreen } = require("./constatnts");

class Obstacle extends Entity{
  constructor(x, y, width, height){
    super(x, y);
    this.width = width;
    this.height = height;
    this.color = raylib.GetColor(0xe69301ff);
  }
  draw(){
    raylib.DrawRectangle(this.position.x, this.position.y, this.width, this.height, this.color);
  }
  update(){}
  /** @param {Player} player */
  isCollidingPlayer(player){
    return raylib.CheckCollisionCircleRec(player.position, player.mass, this);
  }
  /** @param {Bullet} bullet */
  isCollidingBullet(bullet){
    return raylib.CheckCollisionCircleRec(bullet.position, bullet.size, this);
  }
}

class Platform extends Obstacle{
  constructor(cx, cy, width = 400, height = 40){
    super(cx - width/2, cy - height/2, width, height);
  }
}

Platform.preset = {
  FullWidth: y => new Platform(GameScreen.width/2, y, GameScreen.width, 1),
  FullHeight: x => new Platform(x, GameScreen.height, 1, GameScreen.height)
};

class Box extends Obstacle{
  constructor(x, y, size){
    super(x, y, size, size);
    this.color = raylib.GetColor(0x93e601ff);
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
        new Vector2(x + topWidth/2, y - height/2),
        new Vector2(x + topWidth/2, y + height/2),
        new Vector2(x + bottomWidth/2, y + height/2)
      ],
      rectangle:[x - topWidth/2, y - height/2]
    };
  }
  draw(){
    raylib.DrawTriangle(this.points.triangleL[0], this.points.triangleL[1], this.points.triangleL[2], this.color);
    raylib.DrawTriangle(this.points.triangleR[0], this.points.triangleR[1], this.points.triangleR[2], this.color);
    raylib.DrawRectangle(this.points.rectangle[0], this.points.rectangle[1], this.topWidth, this.height, this.color);
  }
  update(){}
  /** @param {Player} player */
  isCollidingPlayer(player){
    const collidingT1 = raylib.CheckCollisionPointTriangle(player, ...this.points.triangleL);
    const collidingT2 = raylib.CheckCollisionPointTriangle(player, ...this.points.triangleR);
    const collidingR = raylib.CheckCollisionPointRec(player, {
      x: this.points.rectangle[0],
      y: this.points.rectangle[1],
      width: this.topWidth,
      height: this.height
    });
    return collidingT1 || collidingT2 || collidingR;
  }
  /** @param {Bullet} bullet */
  isCollidingBullet(bullet){
    return false;
  }
}

class PolyPlatform extends Entity{
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

module.exports = {Obstacle, Trapizum, Platform, Box};