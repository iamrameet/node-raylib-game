const raylib = require("raylib");
const { Constant, GameScreen } = require("./constatnts");
const { InputHandler } = require("./input-handler");
const { Circle, Wall, CollisionSystem, Capsule } = require("./shapes");

/** @type {Circle[]} */
const circles = [
  new Circle(300, 300, 50),
  new Circle(700, 300, 20),
  new Circle(500, 300, 100),
  new Circle(200, 500, 60)
];

const walls = [
  new Wall(0, 0, GameScreen.width, 0),
  new Wall(0, 0, 0, GameScreen.height),
  new Wall(GameScreen.width, 0, GameScreen.width, GameScreen.height),
  new Wall(0, GameScreen.height, GameScreen.width, GameScreen.height),
  new Wall(200, 200, 400, 500),
  new Wall(),
];

const capsules = [
  new Capsule(400, 700, 800, 500, 40)
];

const player = new Circle(500, 500, 30);
player.elasticity = 2;
player.isPlayer = true;

circles.push(player);

function gameLoop(){
  InputHandler.controls();

  for(const [index, circle] of circles.entries()){
    circle.update();
    for(let i = index + 1; i < circles.length; i++){
      if(Circle.areCirclesColliding(circles[i], circle)){
        Circle.penetrationResolution(circles[i], circle);
        Circle.collisionResponse(circles[i], circle);
      }
    }
    for(const [i, wall] of walls.entries()){
      if(CollisionSystem.collisionCircleWall(circle, wall)){
        CollisionSystem.penResCircleWall(circle, wall);
        CollisionSystem.colResCircleWall(circle, wall);
      }
    }
    circle.draw();
  }

  for(const [index, wall] of walls.entries()){
    wall.update();
    wall.draw();
  }

  for(const [index, capsule] of capsules.entries()){
    capsule.update();
    capsule.draw();
  }

}

module.exports = { gameLoop };