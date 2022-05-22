const raylib = require("raylib");
const { Constant } = require("./constatnts");
const { Entity } = require("./entity");
const { Vector2 } = require("./physics");

class ParticleSystem extends Entity{
  size = 10;
  /** @type {Particle[]} */
  particles = [];
  /**
   * @param {number} x
   * @param {number} y
   * @param {Vector2} ref
   * @param {raylib.Color} color
   * @param {number} count Particles count
   * @param {number} minSize Particle minimum size
   * @param {number} maxSize Particle maximum size
   */
  constructor(x, y, ref, color = raylib.PINK, count = 10, minSize = 1, maxSize = 5){
    super(x, y);
    for(let p = 0; p < count; p++){
      const dir = ref.signVector();
      dir.x *= Math.random();
      dir.y *= Math.random();
      const particle = new Particle(x, y, dir, minSize, maxSize, color ?? raylib.PINK);
      // particle.velocity.scalar(Vector2.normalise(ref).scale(-1));
      this.particles.push(particle);
    }
  }
  draw(){
    for(const particle of this.particles)
      particle.draw();
  }
  update(){
    for(const [index, particle] of this.particles.entries()){
      particle.update();
      if(particle.opacity <= 0)
        this.particles.splice(index, 1);
    }
  }
}

class Particle extends Entity{
  opacity = 255;
  /**
   * @param {number} x
   * @param {number} y
   * @param {Vector2} direction
   * @param {number} minSize
   * @param {number} maxSize
   * @param {raylib.Color} color Particles count
   */
  constructor(x, y, direction, minSize = 1, maxSize = 5, color = raylib.PINK){
    super(x, y);
    this.color = color;
    this.radius = Math.floor(Math.random() * (maxSize - minSize)) + minSize;
    this.velocity = direction;
    this.velocity.scale(14);
  }
  draw(){
    this.color.a = this.opacity;
    // raylib.DrawCircle(this.position.x, this.position.y, this.radius, this.color);
    raylib.DrawRectangle(this.position.x - this.radius/2, this.position.y - this.radius/2, this.radius, this.radius, this.color);
  }
  update(){
    this.velocity.scale(.93);
    this.position.add(this.velocity);
    this.opacity -= 10;
  }
}

class GravityParticleSystem{
  size = 10;
  /** @type {GravityParticle[]} */
  particles = [];
  /**
   * @param {Vector2} startPos
   * @param {Vector2} endPos
   */
  constructor(startPos, endPos){
    this.startPos = startPos;
    this.position = Vector2.subtract(endPos, startPos);
  }
  createParticle(){
    const dir = Constant.gravity.signVector();
    const randomVec = Vector2.random();
    randomVec.x = Math.sign(randomVec.x) * randomVec.x;
    randomVec.y = Math.sign(randomVec.y) * randomVec.y;
    randomVec.scalar(this.position);
    randomVec.add(this.startPos);
    const particle = new GravityParticle(randomVec.x, randomVec.y, dir, 2, this.size);
    // particle.velocity.scalar(Vector2.normalise(ref).scale(-1));
    this.particles.push(particle);
  }
  draw(){
    for(const particle of this.particles)
      particle.draw();
  }
  update(){
    if(Math.floor(raylib.GetTime()*100) % 100 === 0)
      this.createParticle();
    for(const [index, particle] of this.particles.entries()){
      particle.update();
      if(particle.opacity <= 0){
        this.particles.splice(index, 1);
      }
    }
  }
}

class GravityParticle extends Particle{
  /**
   * @param {number} x
   * @param {number} y
   * @param {Vector2} direction
   * @param {number} minSize
   * @param {number} maxSize
   * @param {raylib.Color} color Particles count
   */
  constructor(x, y, direction, minSize = 1, maxSize = 5, color = raylib.GetColor(0x22084fff)){
    super(x, y, direction, minSize, maxSize, color);
    this.velocity.scale(0.1);
  }
  draw(){
    this.color.a = this.opacity;
    // raylib.DrawCircle(this.position.x, this.position.y, this.radius, this.color);
    raylib.DrawRectangle(this.position.x - this.radius/2, this.position.y - this.radius/2, this.radius, this.radius, this.color);
  }
  update(){
    // this.velocity.scale(.93);
    this.position.add(this.velocity);
    this.opacity -= 0.5;
  }
}

module.exports = { ParticleSystem, Particle, GravityParticleSystem };