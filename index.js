const raylib = require('raylib');
const { gameLoop } = require('./scripts/test.js');
const { GameScreen, GameColor } = require('./scripts/constatnts');

raylib.InitWindow(GameScreen.width, GameScreen.height, "raylib [core] example - basic window");
raylib.SetTargetFPS(60);

// const physicsWorld = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 9.8));

const white_opacity = raylib.ColorAlpha(raylib.WHITE, 0.1);
while (!raylib.WindowShouldClose()) {
  raylib.BeginDrawing();
  raylib.ClearBackground(GameColor.background);
  raylib.DrawCircleGradient(0, 0, GameScreen.width/2, white_opacity, raylib.BLANK);
  raylib.DrawCircleGradient(GameScreen.width*1.2, GameScreen.height/2, GameScreen.width/2, white_opacity, raylib.BLANK);

  gameLoop();

  raylib.EndDrawing();
}
raylib.CloseWindow();