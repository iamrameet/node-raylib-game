/** @typedef {import("./player").Player} Player */

const raylib = require("raylib");
const { Vector2 } = require('./physics');
const { Bullet } = require('./bullet');
const { Entity } = require("./entity");

class Gun extends Entity {
  reloadSpeed = 100;
  attackSpeed = 20;
  fireRate;
  /** Bullet capacity */
  bulletCapacity = 10;
  /** Bullets left */
  ammo = 8;
  fireCooldown = 0;
  reloadCooldown = 0;
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    super(x, y);
  }
  /** @param {Player} player */
  draw(player){
    // const {ammo, reloadCooldown, fireCooldown}=this;
    // console.log({ammo, reloadCooldown, fireCooldown});
    let offset = 0;
    if(player.facingDirection.x<0){
      offset = - player.mass;
      raylib.DrawRectangle(this.x + offset + 16, this.y + 6, 8, 6, raylib.RED);
    }else{
      raylib.DrawRectangle(this.x, this.y + 6, 8, 6, raylib.RED);
    }
    raylib.DrawRectangle(this.x + offset, this.y, 24, 6, raylib.RED);
    const ammoRadius = 3,
      ammoMargin = 1;
    for(let b = 0; b < this.ammo; b++){
      const row = Math.floor(b/3);
      const column = b % 3;
      const x = this.x + ammoRadius + ammoMargin + 2 * column * (ammoRadius + ammoMargin) + offset;
      const y = this.y - ammoRadius - 2 * ammoMargin - 2 * row * (ammoRadius + ammoMargin);
      raylib.DrawCircle(x, y, ammoRadius, raylib.GOLD);
    }
  }
  /**
   * @param {Player} player
   * @param {Bullet[]} bullets */
  update(player, bullets){
    if(this.reloadCooldown>0){
      this.reloadCooldown--;
      this.fireCooldown = 0;
      if(this.reloadCooldown===0)
        this.ammo = this.bulletCapacity;
    }else if(this.fireCooldown>0)
      this.fireCooldown--;
    else if(raylib.IsKeyPressed(raylib.KEY_R)){
      const bullet=this.fire(player.facingDirection);
      bullets.push(bullet);
    }
  }
  /** @param {Vector2} target */
  fire(target) {
    const bullet = new Bullet(this.x, this.y);
    const unitVector = Vector2.from(target);
    unitVector.scale(bullet.movementSpeed);
    bullet.movementForce=(unitVector);
    // bullet.move(Vector2.subtract(target, this));
    this.fireCooldown = this.attackSpeed;
    this.ammo--;
    if(this.ammo===0)
      this.reload();
    return bullet;
  }
  reload() {
    const loadedRatio = 1 - this.ammo / this.bulletCapacity;
    this.reloadCooldown = Math.floor(this.reloadSpeed * loadedRatio);
  }
}

class Shield {
  cooldown = 0;
  constructor() {
    this.blockCooldown = 5;
  }
  block() {
    this.cooldown = this.blockCooldown;
    return () => this.cooldown--;
  }
}

module.exports = {Gun, Shield};