const raylib = require('raylib');
const { Vector2 } = require('./physics');
const { Entity } = require('./entity');
const { Gun, Shield } = require('./weapon');
const { ParticleSystem } = require('./particle');

class Player extends Entity {
  maxHealth = 100;
  health = 100;
  movementSpeed = 16;
  jumpFactor = -6;
  /** Damage taken per second */
  damageTaken = 0;
  isAlive = true;
  color = raylib.LIME;
  facingDirection = Vector2.zero();
  shield = new Shield();
  velocity = Vector2.zero();
  movementForce = new Vector2(this.movementSpeed, 0);
  jumpForce = new Vector2(0, this.jumpFactor);
  /**
   * @param {number} x
   * @param {number} y
  */
  constructor(x, y, mass = 26) {
    super(x, y);
    this.mass = mass;
    this.gun = new Gun(x + mass, y - mass/2);
  }
  draw(){
    raylib.DrawCircle(this.x, this.y, this.mass, this.color);
    this.drawHealthBar();
    this.gun.draw(this);
  }
  drawHealthBar(){
    const width = this.mass*2,
      height = 8;
    const x = this.x - this.mass,
      y = this.y - this.mass - height - 4;
    raylib.DrawRectangleLines(x, y, width, height, raylib.SKYBLUE);
    raylib.DrawRectangle(x, y, this.health/this.maxHealth * width, height, raylib.SKYBLUE);
  }
  /**
   * @param {Bullet[]} bullets
   * @param {Particle[]} particles
   * */
  update(bullets, particles){
    if(this.isAlive){
      if(this.health <= 0){
        this.isAlive = false;
        particles.push(new ParticleSystem(this.x, this.y, Vector2.random(), this.color, 20));
        return;
      }
    }else return;
    const mousePos = raylib.GetMousePosition();
    // this.facingDirection = Math.tanh((this.y - mousePos.y)/(this.x - mousePos.x));
    this.facingDirection = Vector2.subtract(mousePos, this);
    this.facingDirection.normalise();
    if(raylib.IsKeyDown(raylib.KEY_A)){
      this.add(new Vector2(-5, 0));
    }else if(raylib.IsKeyDown(raylib.KEY_D)){
      this.add(new Vector2(5, 0));
    }
    this.add(this.velocity);
    this.gun.set(this.x + this.mass * this.facingDirection.x, this.y + this.mass * this.facingDirection.y);
    this.gun.update(this, bullets);
  }
}

module.exports = {Player};