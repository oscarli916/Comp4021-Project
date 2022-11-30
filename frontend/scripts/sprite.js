const Sprite = (function () {
  let canvas;
  let ctx;

  const initialize = () => {
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');

    loadImage();

  }

  const SCALE = 2;
  const WIDTH = 16;
  const HEIGHT = 18;
  const SCALED_WIDTH = SCALE * WIDTH;
  const SCALED_HEIGHT = SCALE * HEIGHT;
  const CYCLE_LOOP = [0, 1, 0, 2];
  const FACING_DOWN = 0;
  const FACING_UP = 1;
  const FACING_LEFT = 2;
  const FACING_RIGHT = 3;
  const FRAME_LIMIT = 12;
  const MOVEMENT_SPEED = 1;

  let keyPresses = {};
  let currentDirection = FACING_DOWN;
  let currentLoopIndex = 0;
  let frameCount = 0;
  let positionX = 0;
  let positionY = 0;
  let img = new Image();

  window.addEventListener('keydown', keyDownListener);
  function keyDownListener(event) {
      keyPresses[event.key] = true;
  }

  window.addEventListener('keyup', keyUpListener);
  function keyUpListener(event) {
      keyPresses[event.key] = false;
  }

  function loadImage() {
    img.src = 'https://opengameart.org/sites/default/files/Green-Cap-Character-16x18.png';
    img.onload = function() {
      window.requestAnimationFrame(gameLoop);
    };
  }

  function drawFrame(frameX, frameY, canvasX, canvasY) {
    ctx.drawImage(img,
                  frameX * WIDTH, frameY * HEIGHT, WIDTH, HEIGHT,
                  canvasX, canvasY, SCALED_WIDTH, SCALED_HEIGHT);
  }


  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let hasMoved = false;

    if (keyPresses.ArrowUp) {
      moveCharacter(0, -MOVEMENT_SPEED, FACING_UP);
      hasMoved = true;
    } else if (keyPresses.ArrowDown) {
      moveCharacter(0, MOVEMENT_SPEED, FACING_DOWN);
      hasMoved = true;
    }

    if (keyPresses.ArrowLeft) {
      moveCharacter(-MOVEMENT_SPEED, 0, FACING_LEFT);
      hasMoved = true;
    } else if (keyPresses.ArrowRight) {
      moveCharacter(MOVEMENT_SPEED, 0, FACING_RIGHT);
      hasMoved = true;
    }

    if (hasMoved) {
      frameCount++;
      if (frameCount >= FRAME_LIMIT) {
        frameCount = 0;
        currentLoopIndex++;
        if (currentLoopIndex >= CYCLE_LOOP.length) {
          currentLoopIndex = 0;
        }
      }
    }
    
    if (!hasMoved) {
      currentLoopIndex = 0;
    }

    drawFrame(CYCLE_LOOP[currentLoopIndex], currentDirection, positionX, positionY);
    window.requestAnimationFrame(gameLoop);
  }

  function moveCharacter(deltaX, deltaY, direction) {
    if (positionX + deltaX > 0 && positionX + SCALED_WIDTH + deltaX < canvas.width) {
      positionX += deltaX;
    }
    if (positionY + deltaY > 0 && positionY + SCALED_HEIGHT + deltaY < canvas.height) {
      positionY += deltaY;
    }
    currentDirection = direction;
  }

  return {initialize}
})()

