const raylib = require("raylib");

class InputHandler{
  static movement = {
    left: false,
    right: false,
    jump: false,
    crouch: false
  };
  static controls(){
    InputHandler.movement.left = raylib.IsKeyDown(raylib.KEY_A);
    InputHandler.movement.right = raylib.IsKeyDown(raylib.KEY_D);
    InputHandler.movement.jump = raylib.IsKeyDown(raylib.KEY_SPACE) || raylib.IsKeyDown(raylib.KEY_W);
    InputHandler.movement.crouch = raylib.IsKeyDown(raylib.KEY_LEFT_CONTROL) || raylib.IsKeyDown(raylib.KEY_S);
  }
}

module.exports = { InputHandler };