const raylib = require('raylib');
const { Constant } = require('./constatnts');
const { Entity } = require('./entity');
const { Vector2 } = require('./physics');

class Bullet extends Entity {
  size = 5;
  damage = 20;
  movementSpeed = 20;
  color = raylib.VIOLET;
  movementForce = new Vector2(this.movementSpeed, 0);
  velocity = Vector2.zero();
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
    this.movementForce.add(Vector2.scale(Constant.gravity, this.size/2));
    // this.velocity.add(this.movementForce);
    this.position.add(this.movementForce);
  }
  /** @param {Vector2} direction */
  move(direction) {}
}

module.exports = {Bullet};