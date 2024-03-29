const Game = (function () {
  let grid;
  let squares;
  let opponentSquares;
  let scoreDisplay;
  let lineDisplay;
  let displaySquares;
  let opponentDisplaySquares;

  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  let winOrLose = "Waiting";
  let isPaused = false;

  const sounds = {
    signin: new Audio("signin.mp3"),
    background: new Audio("bg.mp3"),
    clear: new Audio("lineCleared.mp3"),
    gameover: new Audio("GameOver.mp3"),
  };
  sounds.background.loop = true;
  sounds.signin.loop = true;
  sounds.gameover.loop = true;

  const initialize = () => {
    grid = document.querySelector(".grid");
    squares = Array.from(document.querySelectorAll(".current div"));
    opponentSquares = Array.from(document.querySelectorAll(".opponent div"));
    scoreDisplay = document.querySelector("#score-left");
    lineDisplay = document.querySelector("#line-left");
    displaySquares = document.querySelectorAll(".current-mini div");
    opponentDisplaySquares = document.querySelectorAll(".opponent-mini div"); 
  };

  //The Tetrominoes
  const lTetromino = {
    name: "lTetromino",
    tile: [
      [1, width + 1, width * 2 + 1, 2],
      [width, width + 1, width + 2, width * 2 + 2],
      [1, width + 1, width * 2 + 1, width * 2],
      [width, width * 2, width * 2 + 1, width * 2 + 2],
    ],
  };

  const zTetromino = {
    name: "zTetromino",
    tile: [
      [0, width, width + 1, width * 2 + 1],
      [width + 1, width + 2, width * 2, width * 2 + 1],
      [0, width, width + 1, width * 2 + 1],
      [width + 1, width + 2, width * 2, width * 2 + 1],
    ],
  };

  const tTetromino = {
    name: "tTetromino",
    tile: [
      [1, width, width + 1, width + 2],
      [1, width + 1, width + 2, width * 2 + 1],
      [width, width + 1, width + 2, width * 2 + 1],
      [1, width, width + 1, width * 2 + 1],
    ],
  };

  const oTetromino = {
    name: "oTetromino",
    tile: [
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
    ],
  };

  const iTetromino = {
    name: "iTetromino",
    tile: [
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3],
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3],
    ],
  };

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;

  //randomly select a Tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let { name, tile } = theTetrominoes[random];
  tile = tile[currentRotation];

  //draw the Tetromino
  function draw() {
    tile.forEach((index) => {
      squares[currentPosition + index].classList.add(name);
    });
  }

  //undraw the Tetromino
  function undraw() {
    tile.forEach((index) => {
      squares[currentPosition + index].classList.remove(name);
    });
  }

  //assign functions to keyCodes
  function control(e) {
    if (winOrLose === "Playing") {
      if (e.keyCode === 37) {
        moveLeft();
      } else if (e.keyCode === 38) {
        rotate();
      } else if (e.keyCode === 39) {
        moveRight();
      } else if (e.keyCode === 40) {
        moveDown();
      }
    }
  }
  document.addEventListener("keydown", control);

  function onCheatHandler(e) {
    if (winOrLose === "Playing") {
      if (e.keyCode === 32) {
        cheating();
      }
    }
  }
  document.addEventListener("keyup", onCheatHandler);

  //move down function
  function moveDown() {
    if (timeRemaining < 1) {
      Socket.sendGameOver();
    } else {
      undraw();
      currentPosition += width;
      draw();
      freeze();
      Socket.sendBoard(
        getClassNameFromSquare(squares),
        score,
        getClassNameFromSquare(displaySquares)
      );
    }
  }

  const getClassNameFromSquare = (squares) => {
    let allClassNames = [];
    squares.forEach((square) => {
      allClassNames.push(square.classList.value.split(" "));
    });
    return allClassNames;
  };

  const updateOpponentBoard = (username, board, score, miniBoard) => {
    if ($("#username-left").text() !== username) {
      $("#score-right").text(`Score: ${score}`);
      $("#line-right").text(score / 10);
      for (let i = 0; i < opponentSquares.length; i++) {
        opponentSquares[i].className = "";
        board[i].forEach((element) => {
          if (element !== "") opponentSquares[i].classList.add(element);
        });
      }
      for (let i = 0; i < opponentDisplaySquares.length; i++) {
        opponentDisplaySquares[i].className = "";
        miniBoard[i].forEach((element) => {
          if (element !== "") opponentDisplaySquares[i].classList.add(element);
        });
      }
    }
  };

  //freeze function
  function freeze() {
    if (
      tile.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      tile.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      //start a new tetromino falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      tile = theTetrominoes[random].tile[currentRotation];
      name = theTetrominoes[random].name;
      currentPosition = 4;
      addScore();
      draw();
      displayShape();
      if (
        tile.some((index) =>
          squares[currentPosition + index].classList.contains("taken")
        )
      )
        Socket.sendGameOver();
    }
  }

  const cheating = () => {
    if (isPaused === true) {
      isPaused = false;
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
      timerId = setInterval(moveDown, 500);
    } else {
      isPaused = true;
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    }
  };

  //move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
    undraw();
    const isAtLeftEdge = tile.some(
      (index) => (currentPosition + index) % width === 0
    );
    if (!isAtLeftEdge) currentPosition -= 1;
    if (
      tile.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  //move the tetromino right, unless is at the edge or there is a blockage
  function moveRight() {
    undraw();
    const isAtRightEdge = tile.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    if (!isAtRightEdge) currentPosition += 1;
    if (
      tile.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  ///FIX ROTATION OF TETROMINOS A THE EDGE
  function isAtRight() {
    return tile.some((index) => (currentPosition + index + 1) % width === 0);
  }

  function isAtLeft() {
    return tile.some((index) => (currentPosition + index) % width === 0);
  }

  function checkRotatedPosition(P) {
    P = P || currentPosition; //get current position.  Then, check if the piece is near the left side.
    if ((P + 1) % width < 4) {
      //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
      if (isAtRight()) {
        //use actual position to check if it's flipped over to right side
        currentPosition += 1; //if so, add one to wrap it back around
        checkRotatedPosition(P); //check again.  Pass position from start, since long block might need to move more.
      }
    } else if (P % width > 5) {
      if (isAtLeft()) {
        currentPosition -= 1;
        checkRotatedPosition(P);
      }
    }
  }

  //rotate the tetromino
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === tile.length) {
      //if the current rotation gets to 4, make it go back to 0
      currentRotation = 0;
    }
    tile = theTetrominoes[random]["tile"][currentRotation];
    checkRotatedPosition();
    draw();
  }
  /////////

  //show up-next tetromino in mini-grid display
  const displayWidth = 4;
  const displayIndex = 0;

  //the Tetrominos without rotations
  const upNextTetrominoes = [
    {
      name: "lTetromino",
      tile: [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    },
    {
      name: "zTetromino",
      tile: [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    },
    {
      name: "tTetromino",
      tile: [1, displayWidth, displayWidth + 1, displayWidth + 2],
    },
    { name: "oTetromino", tile: [0, 1, displayWidth, displayWidth + 1] },
    {
      name: "iTetromino",
      tile: [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
    },
  ];

  //display the shape in the mini-grid display
  function displayShape() {
    //remove any trace of a tetromino form the entire grid
    displaySquares.forEach((square) => {
      square.classList.forEach((value) => {
        if (value.endsWith("Tetromino")) square.classList.remove(value);
      });
    });
    upNextTetrominoes[nextRandom].tile.forEach((index) => {
      displaySquares[displayIndex + index].classList.add(
        upNextTetrominoes[nextRandom].name
      );
    });
  }

  const gameStart = () => {
    document.getElementById("round-time-bar-left").style = "--duration: 180";
    document.getElementById("round-time-bar-right").style = "--duration: 180";
    const bars = document.querySelectorAll(".round-time-bar");
    bars.forEach((bar) => {
      bar.classList.remove("round-time-bar");
      bar.offsetWidth;
      bar.classList.add("round-time-bar");
    });
    
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      winOrLose = "Playing"
      sounds.signin.pause();
      sounds.background.play();
      draw();
      // speed of the block falling down 1000 = slowest
      remainingTimeId = setInterval(reduceTime, 1000);
      timerId = setInterval(moveDown, 500);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  };

  //add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        sounds.clear.currentTime = 0;
        sounds.clear.play();
        scoreDisplay.innerHTML = "Score:" + score;
        lineDisplay.innerHTML = score / 10;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.forEach((value) => {
            if (value.endsWith("Tetromino"))
              squares[index].classList.remove(value);
          });
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  //game over
  function gameOver() {
    winOrLose = "GameOver";
    sounds.background.pause();
    sounds.gameover.play();
    clearInterval(timerId);
    clearInterval(remainingTimeId);

    scoreDisplay.classList.add("color-red");
    scoreDisplay.innerHTML = "Score: " + score;

    $(".game-page").hide();
    $(".gameover-page").css("display", "flex");

    gameFinish();
  }

  let timeRemaining = 180;
  const reduceTime = () => {
    timeRemaining--;
    $(".timer").text(timeRemaining);
  };

  return { gameStart, initialize, updateOpponentBoard, gameOver };
})();
