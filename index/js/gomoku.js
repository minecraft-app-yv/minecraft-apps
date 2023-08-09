/*++reserve functions++*/
obj = {};
//Gomoku game
let boardSize = 19; // 19路盤
let gridSize;
let board = [];
let currentPlayer = 1; // 1: 黒石, -1: 白石
let flag = true;
let cpuFlag = false;
let stoneFlag = false;
let images = {};
let isTouched = false;
let selectedCell = { i: 0, j: 0 };

function tintGrayToRed(amount, img) {
  img.loadPixels();
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      let index = (i + j * img.width) * 4;
      let grayValue = (img.pixels[index] + img.pixels[index + 1] + img.pixels[index + 2]) / 3;
      img.pixels[index] = grayValue + amount; // 赤成分を増加
      img.pixels[index + 1] = grayValue;
      img.pixels[index + 2] = grayValue;
    }
  }
  img.updatePixels();
  return img;
}
function preload() {
  images['skeleton'] = loadImage('../index/img/Skeleton_Skull.png');
  images['creeper'] = loadImage('../index/img/Creeper_Head.png');
  images['skeleton_red'] = loadImage('../index/img/Skeleton_Skull.png');
  images['creeper_red'] = loadImage('../index/img/Creeper_Head.png');
  images['board'] = loadImage('../index/img/board_creeper.jpg');
}
function setup() {
  images['skeleton_red'] = tintGrayToRed(100, images['skeleton_red']);
  images['creeper_red'] = tintGrayToRed(100, images['creeper_red']);
  let windowWidth = window.innerWidth;
  let canvas_size = 400;
  windowWidth -= 10 * 2;
  if (windowWidth <= canvas_size) {
    canvas_size = windowWidth;
  }
  let gomokuDiv = createDiv();
  gomokuDiv.id('gomoku_canvas');
  gomokuDiv.style('width', canvas_size + 'px');
  gomokuDiv.style('height', canvas_size + 'px');
  gomokuDiv.parent('gomoku');
  let gomokuDivB = createDiv();
  gomokuDivB.id('gomoku_button');
  gomokuDivB.style('width', canvas_size + 'px');
  gomokuDivB.parent('gomoku');
  let gomokuDivC = createDiv();
  gomokuDivC.id('gomoku_control');
  gomokuDivC.style('width', canvas_size + 'px');
  gomokuDivC.parent('gomoku');
  let canvas = createCanvas(canvas_size, canvas_size);
  canvas.parent('gomoku_canvas');
  gridSize = width / boardSize;
  for (let j = 0; j < boardSize; j++) {
    board[j] = [];
    for (let i = 0; i < boardSize; i++) {
      board[j][i] = 0; // 初期化: 0は石が置かれていないことを示す
    }
  }

  let resetButton = createButton('<i class="fa-solid fa-trash"></i>');
  resetButton.parent('gomoku_button');
  resetButton.mousePressed(resetBoard);

  let changeImgButton = createButton('<i class="fa-solid fa-circle"></i>');
  changeImgButton.id('gomoku_img');
  changeImgButton.parent('gomoku_button');
  changeImgButton.mousePressed(toggleStone);

  let cpuModeButton = createButton('<i class="fa-solid fa-user"></i>');
  cpuModeButton.id('gomoku_cpu');
  cpuModeButton.parent('gomoku_button');
  cpuModeButton.mousePressed(toggleCPU);

  let difficultySlider = createSlider(0, 30, 10);
  difficultySlider.id('gomoku_diff');
  difficultySlider.style('display', 'inline-block');
  difficultySlider.parent('gomoku_button');
  difficultySlider.input(changeDifficulty);

  let leftButton = createButton('<i class="fa-solid fa-left-long"></i>');
  leftButton.parent('gomoku_control');
  leftButton.mousePressed(leftAction);
  let upButton = createButton('<i class="fa-solid fa-up-long"></i>');
  upButton.parent('gomoku_control');
  upButton.mousePressed(upAction);
  let downButton = createButton('<i class="fa-solid fa-down-long"></i>');
  downButton.parent('gomoku_control');
  downButton.mousePressed(downAction);
  let rightButton = createButton('<i class="fa-solid fa-right-long"></i>');
  rightButton.parent('gomoku_control');
  rightButton.mousePressed(rightAction);
  let checkedButton = createButton('<i class="fa-solid fa-circle-check"></i>');
  checkedButton.style('margin-left', '25px');
  checkedButton.parent('gomoku_control');
  checkedButton.mousePressed(checkedAction);
}

function draw() {
  background(255);
  image(images.board, 0, 0, width, height);
  drawBoard();
  drawStones();
  highlightHover();
  drawTarget();
}
function drawBoard() {
  stroke(0);
  for (let i = 0; i < boardSize; i++) {
    line((i + 1 / 2) * gridSize,(1 / 2) * gridSize,(i + 1 / 2) * gridSize,height - (1 / 2) * gridSize);
    line((1 / 2) * gridSize,(i + 1 / 2) * gridSize,width - (1 / 2) * gridSize,(i + 1 / 2) * gridSize);
  }
}
function drawStones() {
  for (let j = 0; j < boardSize; j++) {
    for (let i = 0; i < boardSize; i++) {
      stroke(0);
      let creeper = images.creeper;
      let skeleton = images.skeleton;
      if (floor(Math.abs(board[j][i]) / 10) > 0) {
        flag = false;
        stroke(255, 0, 0);
        creeper = images.creeper_red;
        skeleton = images.skeleton_red;
      }
      if (board[j][i] % 10 == 1) {
        fill(0, 150, 0);
        if (stoneFlag) {
          image(creeper, i * gridSize, j * gridSize, gridSize, gridSize);
        } else {
          ellipse((i + 1 / 2) * gridSize, (j + 1 / 2) * gridSize, gridSize * 0.8);
        }
      } else if (board[j][i] % 10 == -1) {
        fill(255);
        if (stoneFlag) {
          image(skeleton, i * gridSize, j * gridSize, gridSize, gridSize);
        } else {
          ellipse((i + 1 / 2) * gridSize, (j + 1 / 2) * gridSize, gridSize * 0.8);
        }
      }
    }
  }
}

function drawTarget() {
  let i = selectedCell.i;
  let j = selectedCell.j;
  noStroke();
  fill(0, 255, 255);
  if (currentPlayer == -1) {
    fill(255, 0, 0);
  }
  triangle((i + 0.2) * gridSize,(j + 0.2) * gridSize,(i + 0.4) * gridSize,(j + 0.2) * gridSize,(i + 0.2) * gridSize,(j + 0.4) * gridSize);
  triangle((i + 0.8) * gridSize,(j + 0.2) * gridSize,(i + 0.8) * gridSize,(j + 0.4) * gridSize,(i + 0.6) * gridSize,(j + 0.2) * gridSize);
  triangle((i + 0.2) * gridSize,(j + 0.8) * gridSize,(i + 0.4) * gridSize,(j + 0.8) * gridSize,(i + 0.2) * gridSize,(j + 0.6) * gridSize);
  triangle((i + 0.8) * gridSize,(j + 0.8) * gridSize,(i + 0.6) * gridSize,(j + 0.8) * gridSize,(i + 0.8) * gridSize,(j + 0.6) * gridSize);
}
function highlightHover() {
  if (!flag || isTouched) {
    return false;
  }
  let i = Math.round((mouseX - (gridSize * 1) / 2) / gridSize);
  let j = Math.round((mouseY - (gridSize * 1) / 2) / gridSize);

  if (i >= 0 && i < boardSize && j >= 0 && j < boardSize) {
    selectedCell = { i, j };
    drawTarget();
  }
}
async function judgmentVictory(x, y) {
  let arry_x = [];
  let arry_y = [];
  let arry_xy = [];
  let arry_xyNega = [];
  let answer = true;
  const somePromise = new Promise((resolve, reject) => {
    for (let n = -4; n <= 4; n++) {
      if (x + n >= 0 && x + n < boardSize) {
        if (board[y][x + n] == 1) {
          if (arry_x[0] == -1) {
            arry_x = [];
          }
          arry_x.push(1);
        }
        if (board[y][x + n] == -1) {
          if (arry_x[0] == 1) {
            arry_x = [];
          }
          arry_x.push(-1);
        }
        if (board[y][x + n] == 0) {
          arry_x = [];
        }
      }
      if (y + n >= 0 && y + n < boardSize) {
        if (board[y + n][x] == 1) {
          if (arry_y[0] == -1) {
            arry_y = [];
          }
          arry_y.push(1);
        }
        if (board[y + n][x] == -1) {
          if (arry_y[0] == 1) {
            arry_y = [];
          }
          arry_y.push(-1);
        }
        if (board[y + n][x] == 0) {
          arry_y = [];
        }
      }
      if (x + n >= 0 && x + n < boardSize && y + n >= 0 && y + n < boardSize) {
        if (board[y + n][x + n] == 1) {
          if (arry_xy[0] == -1) {
            arry_xy = [];
          }
          arry_xy.push(1);
        }
        if (board[y + n][x + n] == -1) {
          if (arry_xy[0] == 1) {
            arry_xy = [];
          }
          arry_xy.push(-1);
        }
        if (board[y + n][x + n] == 0) {
          arry_xy = [];
        }
      }
      if (x + n >= 0 && x + n < boardSize && y - n >= 0 && y - n < boardSize) {
        if (board[y - n][x + n] == 1) {
          if (arry_xyNega[0] == -1) {
            arry_xyNega = [];
          }
          arry_xyNega.push(1);
        }
        if (board[y - n][x + n] == -1) {
          if (arry_xyNega[0] == 1) {
            arry_xyNega = [];
          }
          arry_xyNega.push(-1);
        }
        if (board[y - n][x + n] == 0) {
          arry_xyNega = [];
        }
      }
      if (arry_x.length >= 5) {
        for (let i = 0; i < 5; i++) {
          board[y][x + n - i] *= 11;
        }
        answer = false;
        break;
      }
      if (arry_y.length >= 5) {
        for (let i = 0; i < 5; i++) {
          board[y + n - i][x] *= 11;
        }
        answer = false;
        break;
      }
      if (arry_xy.length >= 5) {
        for (let i = 0; i < 5; i++) {
          board[y + n - i][x + n - i] *= 11;
        }
        answer = false;
        break;
      }
      if (arry_xyNega.length >= 5) {
        for (let i = 0; i < 5; i++) {
          board[y - n + i][x + n - i] *= 11;
        }
        answer = false;
        break;
      }
    }
    resolve(answer);
  });
  return somePromise;
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function getMapData(x, y, pos) {
  let c = 0;
  let obj = {};
  let targetAmount = currentPlayer;
  if (pos == 'user') {
    targetAmount *= -1;
  }
  for (let n = -2; n <= 2; n++) {
    if (x + n < 0 || x + n >= boardSize) {
      c = 0;
      break;
    }
    if (board[y][x + n] == targetAmount) {
      c++;
    }
    if (board[y][x + n] == targetAmount * -1) {
      c = 0;
      break;
    }
  }
  obj['x'] = c;
  c = 0;
  for (let n = -2; n <= 2; n++) {
    if (y + n < 0 || y + n >= boardSize) {
      c = 0;
      break;
    }
    if (board[y + n][x] == targetAmount) {
      c++;
    }
    if (board[y + n][x] == targetAmount * -1) {
      c = 0;
      break;
    }
  }
  obj['y'] = c;
  c = 0;
  for (let n = -2; n <= 2; n++) {
    if (x + n < 0 || x + n >= boardSize || y + n < 0 || y + n >= boardSize) {
      c = 0;
      break;
    }
    if (board[y + n][x + n] == targetAmount) {
      c++;
    }
    if (board[y + n][x + n] == targetAmount * -1) {
      c = 0;
      break;
    }
  }
  obj['xy'] = c;
  c = 0;
  for (let n = -2; n <= 2; n++) {
    if (x + n < 0 || x + n >= boardSize || y - n < 0 || y - n >= boardSize) {
      c = 0;
      break;
    }
    if (board[y - n][x + n] == targetAmount) {
      c++;
    }
    if (board[y - n][x + n] == targetAmount * -1) {
      c = 0;
      break;
    }
  }
  obj['xyNega'] = c;
  return obj;
}
function cpuMovement() {
  let cpuMap = [];
  let userMap = [];
  let diff = $('#gomoku_diff').val() / 10;
  diff = 2 ** (diff);
  for (let i = 0; i < boardSize * boardSize; i++) {
    cpuMap[i] = 0;
    userMap[i] = 0;
  }
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      let cpuObj = getMapData(x, y, 'cpu');
      let userObj = getMapData(x, y, 'user');
      for (let n = -2; n <= 2; n++) {
        if (x + n >= 0 && x + n < boardSize && board[y][x + n] == 0) {
          cpuMap[y * boardSize + (x + n)] += (cpuObj.x ** diff);
          userMap[y * boardSize + (x + n)] += (userObj.x ** diff);
        }
        if (y + n >= 0 && y + n < boardSize && board[y + n][x] == 0) {
          cpuMap[(y + n) * boardSize + x] += (cpuObj.y ** diff);
          userMap[(y + n) * boardSize + x] += (userObj.y ** diff);
        }
        if (x + n >= 0 && x + n < boardSize && y + n >= 0 && y + n < boardSize && board[y + n][x + n] == 0) {
          cpuMap[(y + n) * boardSize + (x + n)] += (cpuObj.xy ** diff);
          userMap[(y + n) * boardSize + (x + n)] += (userObj.xy ** diff);
        }
        if (x + n >= 0 && x + n < boardSize && y - n >= 0 && y - n < boardSize && board[y - n][x + n] == 0) {
          cpuMap[(y - n) * boardSize + (x + n)] += (cpuObj.xyNega ** diff);
          userMap[(y - n) * boardSize + (x + n)] += (userObj.xyNega ** diff);
        }
      }
    }
  }
  const cpuMax = Math.max(...cpuMap);
  const userMax = Math.max(...userMap);
  let cpuMaxIndex = [];
  let userMaxIndex = [];
  cpuMap.forEach((item, i) => {
    if (item == cpuMax) {
      cpuMaxIndex.push(i);
    }
  });
  userMap.forEach((item, i) => {
    if (item == userMax) {
      userMaxIndex.push(i);
    }
  });
  shuffleArray(cpuMaxIndex);
  shuffleArray(userMaxIndex);
  let x, y;
  if (userMax > cpuMax) {
    y = floor(userMaxIndex[0] / 19);
    x = userMaxIndex[0] % 19;
  } else {
    y = floor(cpuMaxIndex[0] / 19);
    x = cpuMaxIndex[0] % 19;
  }
  board[y][x] = currentPlayer;
  judgmentVictory(x, y);
  currentPlayer *= -1;
  $('#gomoku_cpu').toggleClass('white');
}
async function mousePressed() {
  if (!flag) {
    return false;
  }
  let i = Math.round((mouseX - (gridSize * 1) / 2) / gridSize);
  let j = Math.round((mouseY - (gridSize * 1) / 2) / gridSize);

  if (i >= 0 && i < boardSize && j >= 0 && j < boardSize && board[j][i] === 0) {
    board[j][i] = currentPlayer;
    try {
      const result = await judgmentVictory(i, j);
      if (result) {
        currentPlayer *= -1; // プレイヤーを切り替える
        $('#gomoku_cpu').toggleClass('white');
        if (cpuFlag && result) {
          cpuMovement();
        }
      }
    } catch (error) {
      board[j][i] = 0;
    }
  }
}
function touchStarted() {
  isTouched = true;
}

function resetBoard() {
  flag = true;
  for (let j = 0; j < boardSize; j++) {
    for (let i = 0; i < boardSize; i++) {
      board[j][i] = 0; // 石を取り除く
    }
  }
}
function toggleStone() {
  stoneFlag = !stoneFlag;
  if (stoneFlag) {
    $('#gomoku_img').html('<i class="fa-solid fa-file-image"></i>');
  } else {
    $('#gomoku_img').html('<i class="fa-solid fa-circle"></i>');
  }
}
function toggleCPU() {
  cpuFlag = !cpuFlag;
  if (cpuFlag) {
    $('#gomoku_cpu').html('<i class="fa-solid fa-robot"></i>');
    $('#gomoku_cpu').toggleClass('white');
  }
  else {
    $('#gomoku_cpu').html('<i class="fa-solid fa-user"></i>');
    $('#gomoku_cpu').toggleClass('white');
  }
}
function changeDifficulty() {
  let difficultySlider = select('#gomoku_diff');
  let value = difficultySlider.value() / 10;
  let diff_text = createDiv(value);
  diff_text.id('pop_text');
  let p = difficultySlider.elt.getBoundingClientRect();
  let d = diff_text.elt.getBoundingClientRect();
  let scrollTop = window.scrollY;
  diff_text.position(p.left - (d.width - p.width) / 2 , p.top + scrollTop + p.height + 10);
  setTimeout(() => {
    diff_text.elt.remove();
  }, 1000)
}
function leftAction() {
  if (selectedCell.i >= 1 && selectedCell.i < boardSize && selectedCell.j >= 0 && selectedCell.j < boardSize) {
    selectedCell.i--;
    drawTarget();
  }
}
function upAction() {
  if (selectedCell.i >= 0 && selectedCell.i < boardSize && selectedCell.j >= 1 && selectedCell.j < boardSize) {
    selectedCell.j--;
    drawTarget();
  }
}
function downAction() {
  if (selectedCell.i >= 0 && selectedCell.i < boardSize && selectedCell.j >= 0 && selectedCell.j < boardSize - 1) {
    selectedCell.j++;
    drawTarget();
  }
}
function rightAction() {
  if (selectedCell.i >= 0 && selectedCell.i < boardSize - 1 && selectedCell.j >= 0 && selectedCell.j < boardSize) {
    selectedCell.i++;
    drawTarget();
  }
}
async function checkedAction() {
  if (!flag) {
    return false;
  }
  let i = selectedCell.i;
  let j = selectedCell.j;
  if (i >= 0 && i < boardSize && j >= 0 && j < boardSize && board[j][i] === 0) {
    board[j][i] = currentPlayer;
    try {
      const result = await judgmentVictory(i, j);
      if (result) {
        currentPlayer *= -1; // プレイヤーを切り替える
        $('#gomoku_cpu').toggleClass('white');
        if (cpuFlag && result) {
          cpuMovement();
        }
      }
    } catch (error) {
      board[j][i] = 0;
    }
  }
}
