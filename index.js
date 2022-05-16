const raylib = require('raylib');
const { gameLoop } = require('./scripts/main');
const { GameScreen } = require('./scripts/constatnts');

raylib.InitWindow(GameScreen.width, GameScreen.height, "raylib [core] example - basic window");
raylib.SetTargetFPS(60);

// const physicsWorld = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 9.8));

while (!raylib.WindowShouldClose()) {
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RAYWHITE);

  gameLoop();

  raylib.EndDrawing();
}
raylib.CloseWindow();