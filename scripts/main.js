const raylib = require("raylib");
const { Vector2 } = require("./physics");
const { GameScreen, Constant } = require("./constatnts");
const { Player } = require('./player');
const { Obstacle, Trapizum, Platform } = require('./obstacle');
const { Bullet } = require('./bullet');
const { ParticleSystem, GravityParticleSystem } = require("./particle");
const { Level } = require("./level");
const SimplexNoise = require("simplex-noise");

let level = new Level();
const noise = new SimplexNoise();

const particleSystem = new GravityParticleSystem(Vector2.zero(), new Vector2(GameScreen.width, 0));
let r=0;
level.drawBackground = function(){
  const size = 10;
  for(let i = 0; i < size; i++)
    for(let j = 0; j < size; j++){
      const number = noise.noise2D(i, j);
      const w = level.width / size;
      const h = level.height / size;
      raylib.DrawCircle(i*w, j*h, size/2, raylib.ColorAlpha(raylib.WHITE, number+1));
      r += 0.001;
    }
  particleSystem.draw();
};
level.updateBackground = function(){
  particleSystem.update();
}
level.platforms.push(new Trapizum(level.width/2, level.height, 200, 400, 100));

const percentValue = (maxValue, percent) => percent * maxValue / 100;

const player = new Player(GameScreen.width/2, GameScreen.height/4 - 300);
const obstacles = [
  new Platform(percentValue(GameScreen.width, 25), percentValue(GameScreen.height, 25)),
  new Platform(percentValue(GameScreen.width, 50), percentValue(GameScreen.height, 50)),
  new Platform(percentValue(GameScreen.width, 75), percentValue(GameScreen.height, 75)),
  new Platform(percentValue(GameScreen.width, 25), percentValue(GameScreen.height, 75)),
  new Platform(percentValue(GameScreen.width, 75), percentValue(GameScreen.height, 25)),
  // Platform.preset.FullWidth(0),
  Platform.preset.FullHeight(0),
  Platform.preset.FullWidth(GameScreen.height),
  Platform.preset.FullHeight(GameScreen.width)
];

/** @type {(() boolean) []} */
const drawMethods = [];

/** @param {number} index */
function removeDrawMethod(index){
  drawMethods.splice(index, 1);
}

/** @type {Bullet[]} */
const bullets = [];
/** @type {ParticleSystem[]} */
const particles = [];

/** @param {number} index */
function removeBullet(index){
  const [deletedBullet] = bullets.splice(index, 1);
  deletedBullet.velocity.scale(-1);
  particles.push(new ParticleSystem(deletedBullet.position.x, deletedBullet.position.y, deletedBullet.velocity, null, 5, 4, 6));
  drawMethods.push(deletedBullet.onHit());
}

function gameLoop() {
  level.update();
  level.draw();
  if(player.isAlive){
    player.allowMovement.left = true;
    player.allowMovement.right = true;
    player.velocity.add(Constant.gravity);
    const collidingObstacles = obstacles.filter(obstacle=>obstacle.isCollidingPlayer(player))
    const collidingPlatforms = level.platforms.filter(platform=>platform.isCollidingPlayer(player));
    const playerMovement = collidingObstacles.map(obstacle=>{
      const allowMovement = {left: true, right: true};
      const obstacleTop = new Vector2(obstacle.position.x + obstacle.width/2, obstacle.position.y);
      const direction = Vector2.subtract(obstacleTop, player.position);
      direction.normalise();
      if(direction.y < 0){
        allowMovement.left = false;
        allowMovement.right = false;
        if(direction.x > 0)
          allowMovement.right = true;
        else
          allowMovement.left = true;
      }else
        player.velocity.y = 0;
      if(raylib.IsKeyPressed(raylib.KEY_SPACE)) {
        player.velocity.add(player.jumpForce);
      }
      return allowMovement;
    });
    if(collidingObstacles.length > 0){
      player.allowMovement.left = playerMovement.reduce((a, b) => a.left && b.left);
      player.allowMovement.right = playerMovement.reduce((a, b) => a.right && b.right);
    }
  }
  player.update(bullets, particles);

  for(const obstacle of obstacles)
    obstacle.update();

  for(const [index, bullet] of bullets.entries()){
    bullet.update();
    if(raylib.CheckCollisionCircles(player.position, player.mass, bullet, bullet.size)){
      player.health -= bullet.damage;
      removeBullet(index);
      break;
    }
    for(const obstacle of obstacles){
      const colliding=obstacle.isCollidingBullet(bullet);
      if (colliding){
        removeBullet(index);
        break;
      }
    }
  }

  for(const [index, particle] of particles.entries()){
    if(particle.particles.length === 0)
      particles.splice(index, 1);
    else
      particle.update();
  }

  if(player.isAlive)
    player.draw();
  for(const obstacle of obstacles)
    obstacle.draw();
  for(const bullet of bullets)
    bullet.draw();
  for(const particle of particles)
    particle.draw();
  for(const [index, method] of drawMethods.entries())
    if(method())
      removeDrawMethod(index);
}

module.exports = { gameLoop };