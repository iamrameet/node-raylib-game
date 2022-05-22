const raylib = require("raylib");

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
    return this;
  }
  /** @param {Vector2} vector */
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }
  /** @param {Vector2} vector */
  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }
  /** @param {Vector2} vector */
  scalar(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
    return this;
  }
  /** @param {Vector2} vector */
  divide(vector) {
    this.x /= vector.x;
    this.y /= vector.y;
    return this;
  }
  /** @param {Vector2} vector */
  dot(vector){
    return this.x * vector.x + this.y * vector.y;
  }
  /** @param {Vector2} vector */
  cross(vector){
    return this.x * vector.y - this.y * vector.x;
  }
  mag() {
    return Math.sqrt(this.magSq());
  }
  magSq() {
    return this.x ** 2 + this.y ** 2;
  }
  normalise(){
    const magnitude = this.mag();
    return this.scale(magnitude === 0 ? 0 : 1/magnitude);
  }
  /** @param {number} value */
  scale(value) {
    this.x *= value;
    this.y *= value;
    return this;
  }
  invert(){
    return this.scale(-1);
  }
  signVector(){
    return new Vector2(Math.sign(this.x), Math.sign(this.y));
  }
  normalVector(){
    return new Vector2(-this.y, this.x).normalise();
  }
  /** @abstract */
  draw(x, y, scale = 1, color = raylib.YELLOW){
    const vec = new Vector2(x, y).add(Vector2.from(this).scale(scale));
    // raylib.DrawLine(x, y, x + this.x * scale, y + this.y * scale, color);
    raylib.DrawLine(x, y, vec.x, vec.y, color);
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
    return Vector2.from(vector).scale(value);
  }
  /** @param {Vector2} vector */
  static normalise(vector){
    return Vector2.from(vector).normalise();
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
   * @param {Vector2} vector
   * @param {Vector2} target
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

class Matrix{
  /** @type {number[][]} */
  #data = [];
  /**
   * @param {number} rows
   * @param {number} columns
  */
  constructor(rows, columns){
    this.rows = rows;
    this.columns = columns;
    this.#data = Array.from({length: rows}, ()=>new Array(columns).fill(0));
  }
  /**
   * @param {number} row
   * @param {number} column
   * @param {number} value
  */
  set(row, column, value){
    this.#data[row][column] = value;
    return value;
  }
  /**
   * @param {number} row
   * @param {number} column
  */
  get(row, column){
    return this.#data[row][column];
  }
  /** @param {Vector2} vector */
  multiplyVector(vector){
    const result = Vector2.zero();
    result.x = this.#data[0][0] * vector.x + this.#data[0][1] * vector.y;
    result.y = this.#data[1][0] * vector.x + this.#data[1][1] * vector.y;
    return result;
  }
  /** @param {number} angle */
  static rotationMatrix(angle){
    const matrix = new Matrix(2, 2);
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    matrix.set(0, 0, cos);
    matrix.set(0, 1, -sin);
    matrix.set(1, 0, sin);
    matrix.set(1, 1, cos);
    return matrix;
  }
}

module.exports = { Vector2, Matrix };