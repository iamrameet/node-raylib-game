const raylib = require('raylib');
const { Vector2 } = require('./physics');
const { Entity } = require('./entity');
const { Gun, Shield } = require('./weapon');
const { ParticleSystem } = require('./particle');

class Player extends Entity {
  maxHealth = 100;
  health = 100;
  movementSpeed = 6;
  jumpFactor = -14;
  /** Damage taken per second */
  damageTaken = 0;
  isAlive = true;
  color = raylib.GetColor(0xd35713ff);
  facingDirection = Vector2.zero();
  shield = new Shield();
  velocity = Vector2.zero();
  movementForce = new Vector2(this.movementSpeed, 0);
  jumpForce = new Vector2(0, this.jumpFactor);
  allowMovement = {left: true, right: true};
  /**
   * @param {number} x
   * @param {number} y
  */
  constructor(x, y, mass = 20) {
    super(x, y);
    this.mass = mass;
    this.gun = new Gun(x + mass, y - mass/2);
  }
  draw(){
    raylib.DrawCircle(this.position.x, this.position.y, this.mass, this.color);
    this.drawHealthBar();
    this.gun.draw(this);
  }
  drawHealthBar(){
    const width = this.mass*3,
      height = 4;
    const x = this.position.x - this.mass*3/2,
      y = this.position.y - this.mass - height - 4;
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
        particles.push(new ParticleSystem(this.position.x, this.position.y, Vector2.random(), this.color, 20));
        return;
      }
    }else return;
    this.move();
    this.position.add(this.velocity);
    this.gun.position.set(this.position.x + this.mass * this.facingDirection.x, this.position.y + this.mass * this.facingDirection.y);
    this.gun.update(this, bullets);
  }
  move(){
    const mousePos = raylib.GetMousePosition();
    // this.facingDirection = Math.tanh((this.position.y - mousePos.y)/(this.position.x - mousePos.x));
    this.facingDirection = Vector2.subtract(mousePos, this.position);
    this.facingDirection.normalise();
    if(this.allowMovement.right && raylib.IsKeyDown(raylib.KEY_A)){
      const movementVector = Vector2.from(this.movementForce);
      movementVector.scale(-1);
      this.position.add(movementVector);
    }else if(this.allowMovement.left && raylib.IsKeyDown(raylib.KEY_D)){
      this.position.add(this.movementForce);
    }
  }
}

module.exports = {Player};