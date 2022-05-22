const raylib = require('raylib');
const { Constant, GameColor } = require('./constatnts');
const { Entity } = require('./entity');
const { Vector2 } = require('./physics');

class Bullet extends Entity {
  size = 5;
  damage = 20;
  movementSpeed = 30;
  color = raylib.GOLD;
  movementForce = new Vector2(this.movementSpeed, 0);
  velocity = new Vector2(this.movementSpeed, 0);
  /** @type {number} */
  range = null;
  /**
   * @param {number} x
   * @param {number} y
  */
  constructor(x, y) {
    super(x, y);
  }
  draw(){
    raylib.DrawCircle(this.position.x, this.position.y, this.size, this.color);
  }
  update(){
    // const resistance = Vector2.from(Constant.airResistance);
    // resistance.scale(-Math.sign());
    // this.movementForce.subtract(resistance);
    this.velocity.add(Vector2.scale(Constant.gravity, this.size/4));
    this.position.add(this.velocity);
  }
  /** @param {Vector2} direction */
  move(direction) {}
  onHit(){
    let opacity = 20;
    // let color = raylib.ColorAlphaBlend(GameColor.background, this.color, raylib.BLANK);
    return ()=>{
      if(opacity<=0)
        return true;
      opacity-=2;
      const color = raylib.ColorAlpha(this.color, opacity/40);
      raylib.DrawCircle(this.position.x, this.position.y, this.size + 20 - opacity, color);
      return false;
    };
  }
}

module.exports = {Bullet};