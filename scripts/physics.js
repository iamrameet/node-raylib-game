class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  /**
   * @param {number} x
   * @param {number} y
   */
  set(x, y) {
    this.x = x;
    this.y = y;
  }
  /** @param {Vector2} vector */
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }
  /** @param {Vector2} vector */
  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  }
  /** @param {Vector2} vector */
  scalar(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
  }
  /** @param {Vector2} vector */
  divide(vector) {
    this.x /= vector.x;
    this.y /= vector.y;
  }
  mag() {
    return Math.sqrt(this.magSq());
  }
  magSq() {
    return this.x ** 2 + this.y ** 2;
  }
  normalise(){
    const magnitude = this.mag();
    this.scale(1/magnitude, 1/magnitude);
  }
  /** @param {number} value */
  scale(value) {
    this.x *= value;
    this.y *= value;
    return this;
  }
  signVector(){
    return new Vector2(Math.sign(this.x), Math.sign(this.y));
  }
  /** @param {Vector2} vector */
  static from(vector) {
    return new Vector2(vector.x, vector.y);
  }
  static zero(){
    return new Vector2();
  }
  static unit(){
    return new Vector2(1, 1);
  }
  static random(){
    const dirX = Math.floor(Math.random()*2)===0 ? 1 : -1;
    const dirY = Math.floor(Math.random()*2)===0 ? 1 : -1;
    return new Vector2(Math.random() * dirX, Math.random() * dirY);
  }
  /**
   * @param {Vector2} v1
   * @param {Vector2} v2
   */
  static distanceSq(v1, v2) {
    const dy = v1.y - v2.y;
    const dx = v1.x - v2.x;
    return dy ** 2 + dx ** 2;
  }
  /**
   * @param {Vector2} v1
   * @param {Vector2} v2
   */
  static distance(v1, v2) {
    return Math.sqrt(Vector2.distanceSq(v1, v2));
  }
  /**
   * @param {Vector2} vector
   * @param {number} value
   */
  static scale(vector, value) {
    const vec = Vector2.from(vector);
    vec.scale(value);
    return vec;
  }
  /** @param {Vector2} vector */
  static normalise(vector){
    const vec = Vector2.from(vector);
    vec.normalise();
    return vec;
  }
  /**
   * @param {Vector2} v1
   * @param {Vector2} v2
   */
  static add(v1, v2) {
    return new Vector2(v1.x + v2.x, v1.y + v2.y);
  }
  /**
   * @param {Vector2} v1
   * @param {Vector2} v2
   */
  static subtract(v1, v2) {
    return new Vector2(v1.x - v2.x, v1.y - v2.y);
  }
  /**
   * @param {Vectro2} vector
   * @param {Vectro2} target
   * @param {number} maxDistance
  */
  static moveTowards(vector, target, maxDistance){
    let result = Vector2.zero();
    const dx = target.x - vector.x;
    const dy = target.y - vector.y;
    const value = (dx*dx) + (dy*dy);

    if ((value == 0) || ((maxDistance >= 0) && (value <= maxDistance*maxDistance)))
      result = target;

    const dist = Math.sqrt(value);

    result.x = vector.x + dx/dist*maxDistance;
    result.y = vector.y + dy/dist*maxDistance;
    return result;
  }
}

module.exports = {Vector2};