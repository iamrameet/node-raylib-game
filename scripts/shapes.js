const raylib = require("raylib");
const { Constant } = require("./constatnts");
const { InputHandler } = require("./input-handler");
const { Vector2, Matrix } = require("./physics");

class Circle{
  /** @type {number} */
  #mass;
  color = raylib.RED;
  isPlayer = false;
  velocityFactor = 12;
  accelerationFactor = 1;
  constructor(x, y, r){
    this.position = new Vector2(x, y);
    this.velocity = Vector2.zero();
    this.acceleration = Vector2.zero();
    this.radius = r;
    this.mass = r/20;
    this.elasticity = Constant.elasticity;
  }
  get mass(){
    return this.#mass;
  }
  /** @param {number} value */
  set mass(value){
    this.#mass = value;
    this.invertedMass = this.#mass === 0 ? 0 : 1/this.#mass;
  }
  draw(){
    raylib.DrawCircleLines(this.position.x, this.position.y, this.radius, this.color);
    this.drawVector();
  }
  drawVector(){
    Vector2.normalise(this.acceleration).draw(this.position.x, this.position.y, this.radius, raylib.WHITE);
    this.velocity.draw(this.position.x, this.position.y, 10, raylib.BLACK);
    return;
    const acc_vec = Vector2.from(this.acceleration).normalise().scale(100).add(this.position);
    const vel_vec = Vector2.from(this.velocity).normalise().scale(this.radius).add(this.position);
    raylib.DrawLine(this.position.x, this.position.y, acc_vec.x, acc_vec.y, raylib.WHITE);
    raylib.DrawLine(this.position.x, this.position.y, vel_vec.x, vel_vec.y, raylib.BLACK);
    // raylib.DrawLine(this.position.x, this.position.y, this.position.x + this.acceleration.x, this.position.y + this.acceleration.y, raylib.WHITE);
    // raylib.DrawLine(this.position.x, this.position.y, this.position.x + this.velocity.x, this.position.y + this.velocity.y, raylib.BLACK);
  }
  update(){
    if(this.isPlayer){
      this.move();
    }
    this.acceleration.normalise().scale(this.accelerationFactor);
    this.velocity.add(this.acceleration);
    this.velocity.scale(1 - Constant.frictionFactor);
    this.position.add(this.velocity);
  }
  move(){
    if(InputHandler.movement.left)
      this.acceleration.x = -this.accelerationFactor;
    else if(InputHandler.movement.right)
      this.acceleration.x = this.accelerationFactor;
    if(InputHandler.movement.jump)
      this.acceleration.y = -this.accelerationFactor;
    else if(InputHandler.movement.crouch)
      this.acceleration.y = this.accelerationFactor;
    if(!InputHandler.movement.left && !InputHandler.movement.right)
      this.acceleration.x = 0;
    if(!InputHandler.movement.jump && !InputHandler.movement.crouch)
      this.acceleration.y = 0;
  }
  /**
   * @param {Circle} circleA
   * @param {Circle} circleB
   */
  static areCirclesColliding(circleA, circleB){
    return raylib.CheckCollisionCircles(circleA.position, circleA.radius, circleB.position, circleB.radius);
  }
  /**
   * @param {Circle} circleA
   * @param {Circle} circleB
   */
  static penetrationResolution(circleA, circleB){
    const distance = Vector2.subtract(circleA.position, circleB.position);
    const depth = circleA.radius + circleB.radius - distance.mag();
    const resolution = distance.normalise().scale(depth / (circleA.invertedMass + circleB.invertedMass));
    circleA.position.add(resolution.scale(circleA.invertedMass));
    circleB.position.add(resolution.scale(-circleB.invertedMass));
  }
  /**
   * @param {Circle} circleA
   * @param {Circle} circleB
   */
  static collisionResponse(circleA, circleB){
    const normal = Vector2.subtract(circleA.position, circleB.position).normalise();
    const relative_velocity = Vector2.subtract(circleA.velocity, circleB.velocity);
    const seperation_velocity = relative_velocity.dot(normal);
    const new_sep_velocity = -seperation_velocity * Math.min(circleA.elasticity, circleB.elasticity);

    const sep_vel_diff = new_sep_velocity - seperation_velocity;
    const impulse = sep_vel_diff / (circleA.invertedMass + circleB.invertedMass);
    const impulse_vector = normal.scale(impulse);

    circleA.velocity.add(impulse_vector.scale(circleA.invertedMass));
    circleB.velocity.add(impulse_vector.scale(-circleB.invertedMass));
  }
}

class Wall{
  color = raylib.GRAY;
  isPlayer = false;
  /**
   * @param {number} x1
   * @param {number} x2
   * @param {number} y1
   * @param {number} y2
   */
  constructor(x1, y1, x2, y2){
    this.start = new Vector2(x1, y1);
    this.end = new Vector2(x2, y2);
    this.center = Vector2.add(this.start, this.end).scale(0.5);
    this.length = Vector2.subtract(this.end, this.start).mag();
    this.refStart = Vector2.from(this.start);
    this.refEnd = Vector2.from(this.end);
    this.refUnit = this.unitVector;
    this.angle = 0;
    this.angularVelocity = 0;
  }
  get unitVector(){
    return Vector2.subtract(this.end, this.start).normalise();
  }
  draw(){
    raylib.DrawLine(this.start.x, this.start.y, this.end.x, this.end.y, this.color);
  }
  update(){
    if(this.isPlayer)
      this.move();
    const rotationMatrix = Matrix.rotationMatrix(this.angle);
    const newDirection = rotationMatrix.multiplyVector(this.refUnit);
    this.start = Vector2.from(newDirection).scale(-this.length/2).add(this.center);
    this.end = Vector2.from(newDirection).scale(this.length/2).add(this.center);
    this.angle += this.angularVelocity;
    this.angle *= 0.99;
  }
  move(){
    if(InputHandler.movement.left)
      this.angularVelocity = -0.3;
    else if(InputHandler.movement.right)
    this.angularVelocity = 0.3;
  }
}

class Capsule{
  /**
   * @param {number} x1
   * @param {number} x2
   * @param {number} y1
   * @param {number} y2
   * @param {number} radius
   */
  constructor(x1, y1, x2, y2, radius){
    this.start = new Vector2(x1, y1);
    this.end = new Vector2(x2, y2);
    this.radius = radius;
    this.refDirection = Vector2.subtract(this.end, this.start).normalise();
    this.refAngle = Math.acos(this.refDirection.dot(new Vector2(1, 0)));
    if(Vector2.from(this.refDirection).cross(new Vector2(1, 0)) > 0)
      this.refAngle *= -1;
  }
  draw(){
    raylib.DrawCircleSectorLines(this.start, this.radius, this.refAngle, this.refAngle - 180, 1000, raylib.GREEN);
    raylib.DrawCircleSectorLines(this.end, this.radius, this.refAngle, this.refAngle + 180, 0.1, raylib.GREEN);
  }
  update(){}
}

class CollisionSystem{
  /**
   * @param {Circle} circle
   * @param {Wall} wall
   */
  static closestPointCircleWall(circle, wall){
    const c_to_w_start = Vector2.subtract(wall.start, circle.position);
    if(wall.unitVector.dot(c_to_w_start) > 0)
      return Vector2.from(wall.start);
    const c_to_w_end = Vector2.subtract(circle.position, wall.end);
    if(wall.unitVector.dot(c_to_w_end) > 0)
      return Vector2.from(wall.end);
    const closest_distance = wall.unitVector.dot(c_to_w_start);
    const closest_vector = wall.unitVector.scale(closest_distance);
    return Vector2.subtract(wall.start, closest_vector);
  }
  /**
   * @param {Circle} circle
   * @param {Wall} wall
   */
  static collisionCircleWall(circle, wall){
    const closest_point = CollisionSystem.closestPointCircleWall(circle, wall).subtract(circle.position);
    return closest_point.mag() <= circle.radius;
  }
  /**
   * @param {Circle} circle
   * @param {Wall} wall
   */
  static penResCircleWall(circle, wall){
    const penetration_vector = Vector2.subtract(circle.position, CollisionSystem.closestPointCircleWall(circle, wall));
    const penetration_mag = penetration_vector.mag();
    penetration_vector.normalise();
    penetration_vector.scale(circle.radius - penetration_mag)
    circle.position.add(penetration_vector);
  }
  /**
   * @param {Circle} circle
   * @param {Wall} wall
   */
  static colResCircleWall(circle, wall){
    const normal = Vector2.subtract(circle.position, CollisionSystem.closestPointCircleWall(circle, wall)).normalise();
    const sep_velocity = Vector2.from(circle.velocity).dot(normal);
    const new_sep_velocity = -sep_velocity * circle.elasticity;
    const vsep_diff = sep_velocity - new_sep_velocity;
    normal.scale(-vsep_diff);
    circle.velocity.add(normal);
  }
}

module.exports = { Circle, Wall, Capsule, CollisionSystem };