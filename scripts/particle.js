const raylib = require("raylib");
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
    this.velocity.scale(8);
  }
  draw(){
    this.color.a = this.opacity;
    raylib.DrawCircle(this.x, this.y, this.radius, this.color);
  }
  update(){
    this.add(this.velocity);
    this.opacity -= 2;
  }
}

module.exports = { ParticleSystem, Particle };