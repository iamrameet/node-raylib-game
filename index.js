const raylib = require('raylib');
const { main } = require('./scripts/main');
const { GameScreen } = require('./scripts/constatnts');

raylib.InitWindow(GameScreen.width, GameScreen.height, "raylib [core] example - basic window");
raylib.SetTargetFPS(60);

while (!raylib.WindowShouldClose()) {
  raylib.BeginDrawing();
  raylib.ClearBackground(raylib.RAYWHITE);

  main(raylib);

  raylib.EndDrawing();
}
raylib.CloseWindow();