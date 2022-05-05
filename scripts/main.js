const { Vector2 } = require("./physics");
const { GameScreen, Constant } = require("./constatnts");
const { Player } = require('./player');
const { Obstacle } = require('./obstacle');
const { Bullet } = require('./bullet');
const { ParticleSystem } = require("./particle");

const player = new Player(GameScreen.width/2, GameScreen.height/4 - 300);
const obstacles = [
  new Obstacle(GameScreen.width/4, GameScreen.height/4, 20, GameScreen.height/2),
  new Obstacle(GameScreen.width/4, GameScreen.height/2 + 340, GameScreen.width/2, 20),
  new Obstacle(GameScreen.width/4, GameScreen.height/2 + 40, GameScreen.width/2, 20)
];

/** @type {Bullet[]} */
const bullets = [];
/** @type {ParticleSystem[]} */
const particles = [];

/** @param {number} index */
function removeBullet(index){
  const [deletedBullet] = bullets.splice(index, 1);
  deletedBullet.velocity.scale(-1);
  particles.push(new ParticleSystem(deletedBullet.x, deletedBullet.y, deletedBullet.velocity, null, 5, 4, 6));
}

/** @param {import("raylib")} raylib */
function main(raylib) {
  if(player.isAlive){
    player.velocity.add(Constant.gravity);
    for(const obstacle of obstacles){
      const colliding = obstacle.isCollidingPlayer(player);
      if (colliding) {
        // player.y = obstacle.y - player.mass;
        player.velocity.y = 0;
        if (raylib.IsKeyPressed(raylib.KEY_SPACE)) {
          player.velocity.add(player.jumpForce);
        }
        break;
      }
    }
  }
  player.update(bullets, particles);

  for(const [index, bullet] of bullets.entries()){
    bullet.update();
    if(raylib.CheckCollisionCircles(player, player.mass, bullet, bullet.size)){
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
}

module.exports = {main};