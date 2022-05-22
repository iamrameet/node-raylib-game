/** @typedef {import("./player").Player} Player */

const raylib = require("raylib");
const { Vector2 } = require('./physics');
const { Bullet } = require('./bullet');
const { Entity } = require("./entity");

class Gun extends Entity {
  reloadSpeed = 20;
  attackSpeed = 10;
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
      raylib.DrawRectangle(this.position.x + offset + 16, this.position.y + 6, 8, 6, player.color);
    }else{
      raylib.DrawRectangle(this.position.x, this.position.y + 6, 8, 6, player.color);
    }
    raylib.DrawRectangle(this.position.x + offset, this.position.y, 24, 6, player.color);
    const ammoRadius = 2,
      ammoMargin = 1;
    for(let b = 0; b < this.ammo; b++){
      const row = Math.floor(b/3);
      const column = b % 3;
      const x = this.position.x + ammoRadius + ammoMargin + 2 * column * (ammoRadius + ammoMargin) + offset;
      const y = this.position.y - ammoRadius - 2 * ammoMargin - 2 * row * (ammoRadius + ammoMargin);
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
    else if(raylib.IsMouseButtonDown(raylib.MOUSE_BUTTON_LEFT)){
      const bullet=this.fire(player.facingDirection);
      bullets.push(bullet);
    }
  }
  /** @param {Vector2} target */
  fire(target) {
    const bullet = new Bullet(this.position.x, this.position.y);
    const unitVector = Vector2.from(target);
    unitVector.scale(bullet.movementSpeed);
    bullet.velocity=unitVector;
    // bullet.move(Vector2.subtract(target, this.position));
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