/*++reserve functions++*/
obj = {flag: 0, flag_l1: 0, flag_l2: 0, failed: false};
//BG_change_fun
$(document).scroll(function () {
  let h = $(this).scrollTop();
  if (h < 400) {
    $('body').css('background-image', 'radial-gradient(ellipse at center, rgba(10,5,0,0.8) 40%,rgba(0,0,0,0.9) 60%,rgba(0,0,0,1) 100%) , url("./img/BG.jpg")');
  }
  if (h >= 400) {
    $('body').css('background-image', 'radial-gradient(ellipse at center, rgba(10,5,0,0.8) 40%,rgba(0,0,0,0.9) 60%,rgba(0,0,0,1) 100%) , url("../chunk_checker/img/codePen_Minecraft_1.jpg")');
  }
  if (h >= 1000) {
    $('body').css('background-image', 'radial-gradient(ellipse at center, rgba(10,5,0,0.8) 40%,rgba(0,0,0,0.9) 60%,rgba(0,0,0,1) 100%) , url("../art/img/codePen_MineBK31.jpg")');
  }
  if (h >= 1600) {
    $('body').css('background-image', 'radial-gradient(ellipse at center, rgba(10,5,0,0.8) 40%,rgba(0,0,0,0.9) 60%,rgba(0,0,0,1) 100%) , url("../3d_art/img/codePen_MineBK4.jpg")');
  }
  if (h >= 2200) {
    $('body').css('background-image', 'radial-gradient(ellipse at center, rgba(10,5,0,0.8) 40%,rgba(0,0,0,0.9) 60%,rgba(0,0,0,1) 100%) , url("./img/BG.jpg")');
  }
});
//close_button
$('.close_button').click((e) => {
  let close_target_id = $('.close_button:hover').attr('data-close-id');
  $('#' + close_target_id).css('display', 'none');
});
/*share_buttons*/
/*https://www.javadrive.jp/javascript/webpage/index10.html*/
$('header .header_form nav ul li.share_buttons ,header .header_2windows nav ul li.share_buttons').click((e) => {
  $('#share_buttons').css('display', 'flex');
  $('#share_buttons a.facebook').attr('href', 'http://www.facebook.com/share.php?u=' + location.href);
  $('#share_buttons a.twitter').attr('href', 'https://twitter.com/share?url=' + location.href + '&hashtags=Minecraft&text=' + $('head title').text());
  $('#share_buttons a.hatena').attr('href', 'http://b.hatena.ne.jp/add?mode=confirm&url=' + location.href + '&title=' + $('head title').text());
  $('#share_buttons a.line').attr('href', 'http://line.me/R/msg/text/?' + location.href + '%0a' + $('head title').text());
  $('#share_buttons a.getpocket').attr('href', 'http://getpocket.com/edit?url=' + location.href + '&title=' + $('head title').text());
});
//accordion
//https://syncer.jp/accordion-content
$(".syncer-acdn").click(function () {
  let target = $(this).data("target");
  $("#" + target).slideToggle("fast");
  if ($(this).attr('class') !== 'syncer-acdn open') {
    $(this).addClass('open');
  } else {
    $(this).removeClass('open');
  }
});
//Sudoku game
let grid = [];
let gridAns = [];
let gridHole = [];
let cellSize;
let numberButtons = [];
let eraseButton;
let restartButton;
let showAnswerButton;
let showAnswerText;
let difficultySlider;
let showingAnswer = false;
let showingText = false;
let images = [];
let img_name = ['Block_of_Diamond', 'Block_of_Emerald', 'Block_of_Gold', 'Block_of_Amethyst', 'Copper_Block',
'Shroomlight', 'Jack_o_lantern', 'Sea_Lantern', 'Glowstone'];

function preload() {
  for (let i = 0; i < 9; i++) {
    let img = loadImage('../art/img/blocks/' + img_name[i] + '.jpg');
    images.push(img);
  }
}
function setup() {
  let windowWidth = window.innerWidth;
  let canvas_size = 300;
  windowWidth -= (300 / 9 + 10 + 20) * 2;
  if (windowWidth <= canvas_size) {
    canvas_size = windowWidth;
  }
  let sudokuDivC = createDiv();
  sudokuDivC.id('sudoku_control');
  sudokuDivC.style('width', 0);
  sudokuDivC.style('top', '-' + canvas_size + 'px');
  sudokuDivC.style('right', '10px');
  sudokuDivC.style('display', 'inline-block');
  sudokuDivC.style('position', 'relative');
  sudokuDivC.parent('sudoku');
  let sudokuDiv = createDiv();
  sudokuDiv.id('sudoku_canvas');
  sudokuDiv.style('width', canvas_size + 'px');
  sudokuDiv.style('height', canvas_size + 'px');
  sudokuDiv.style('display', 'inline-block');
  sudokuDiv.parent('sudoku');
  let sudokuDivB = createDiv();
  sudokuDivB.id('sudoku_button');
  sudokuDivB.style('width', 0);
  sudokuDivB.style('top', '-' + canvas_size + 'px');
  sudokuDivB.style('left', '10px');
  sudokuDivB.style('display', 'inline-block');
  sudokuDivB.style('position', 'relative');
  sudokuDivB.parent('sudoku');
  let canvas = createCanvas(canvas_size, canvas_size);
  canvas.parent('sudoku_canvas');
  cellSize = width / 9;
  initializeGrid(40); // Initialize grid, gridAns, and gridHole
  createNumberButtons();
  createEraseButton();
  createRestartButton();
  createShowAnswerButton();
  createShowTextButton();
  createDifficultySlider();
  let buttonFirst = select('#sudoku_button button:first-child');
  buttonFirst.addClass('select');
  noLoop();
}

function draw() {
  background(255);
  if (obj.failed) {
    return false;
  }
  drawGrid(grid, 0); // Draw the user grid on the top
}
function drawGrid(targetGrid, yOffset) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let x = j * cellSize;
      let y = i * cellSize + yOffset;
      stroke(0);
      strokeWeight(1);
      fill(255);
      rect(x, y, cellSize, cellSize);

      let num = targetGrid[i][j] % 10;
      if (num !== 0) {
        textSize(cellSize * 0.6);
        textAlign(CENTER, CENTER);
        textStyle(BOLD);
        if (targetGrid[i][j] > 0) {
          let img = images[num - 1];
          if (targetGrid[i][j] <= 9) {
            fill(0, 0, 255); // Blue color for user-added numbers
            img.loadPixels(); // 画像のピクセルデータを読み込む
            // 画像のアルファチャンネルを変更して透明度を設定
            for (let y = 0; y < img.height; y++) {
              for (let x = 0; x < img.width; x++) {
                let index = (x + y * img.width) * 4;
                let alphaValue = 255; // 透明度を設定（0から255の範囲）
                img.pixels[index + 3] = alphaValue; // アルファチャンネルに透明度を設定
              }
            }
            img.updatePixels(); // 更新したピクセルデータを適用
            image(img, x, y, cellSize, cellSize);
          } else {
            fill(0); // Black color for pre-filled numbers
            img.loadPixels(); // 画像のピクセルデータを読み込む
            // 画像のアルファチャンネルを変更して透明度を設定
            for (let y = 0; y < img.height; y++) {
              for (let x = 0; x < img.width; x++) {
                let index = (x + y * img.width) * 4;
                let alphaValue = 100; // 透明度を設定（0から255の範囲）
                img.pixels[index + 3] = alphaValue; // アルファチャンネルに透明度を設定
              }
            }
            img.updatePixels(); // 更新したピクセルデータを適用
            image(img, x, y, cellSize, cellSize);
          }
        }
        if (showingText) {
          text(targetGrid[i][j] % 10, x + cellSize / 2, y + cellSize / 2);
        }
      }
    }
  }
  stroke(0);
  strokeWeight(4);
  noFill();
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      let left = j * 3 * cellSize;
      let top = i * 3 * cellSize + yOffset;
      rect(left, top, cellSize * 3, cellSize * 3);
    }
  }
}
function createNumberButtons() {
  for (let i = 1; i <= 9; i++) {
    let button = createButton(String(i));
    button.style('background-image', 'url("../art/img/blocks/' + img_name[i - 1] + '.jpg")');
    button.attribute('data-name', String(i));
    button.parent('sudoku_button');
    button.position(0, cellSize * (i - 1));
    button.size(cellSize, cellSize);
    button.mousePressed(() => {
      let buttonSelect = select('#sudoku button.select');
      buttonSelect.removeClass('select');
      button.addClass('select');
    });
    numberButtons.push(button);
  }
}
function createEraseButton() {
  eraseButton = createButton('<i class="fa-solid fa-eraser"></i>');
  eraseButton.position(-cellSize, 0);
  eraseButton.size(cellSize, cellSize);
  eraseButton.attribute('data-name', 'erase');
  eraseButton.parent('sudoku_control');
  eraseButton.mousePressed(() => {
    let buttonSelect = select('#sudoku button.select');
    buttonSelect.removeClass('select');
    eraseButton.addClass('select');
  });
}
function createRestartButton() {
  restartButton = createButton('<i class="fa-solid fa-arrow-rotate-right"></i>');
  restartButton.position(-cellSize, cellSize + 5);
  restartButton.size(cellSize, cellSize);
  restartButton.parent('sudoku_control');
  restartButton.mousePressed(() => {
    initializeGrid(difficultySlider.value());
    drawGrid(grid, 0);
  });
}
function createShowAnswerButton() {
  showAnswerButton = createButton('<i class="fa-solid fa-circle-check"></i>');
  showAnswerButton.position(-cellSize, 2 * (cellSize + 5));
  showAnswerButton.size(cellSize, cellSize);
  showAnswerButton.parent('sudoku_control');
  showAnswerButton.mousePressed(() => {
    showingAnswer = !showingAnswer; // Toggle the flag
    if (showingAnswer) {
      drawGrid(gridAns, 0); // Draw the answer grid on the bottom
    } else {
      background(255);
      drawGrid(grid, 0);
    }
  });
}
function createShowTextButton() {
  showAnswerText = createButton('T');
  showAnswerText.position(-cellSize, 3 * (cellSize + 5));
  showAnswerText.size(cellSize, cellSize);
  showAnswerText.parent('sudoku_control');
  showAnswerText.mousePressed(() => {
    showingText = !showingText; // Toggle the flag
    background(255);
    drawGrid(grid, 0);
  });
}
function createDifficultySlider() {
  let sliderContainer = createDiv();
  sliderContainer.position(-cellSize / 2, 4 * (cellSize + 5));
  sliderContainer.parent('sudoku_control');

  // スライダーを作成
  difficultySlider = createSlider(5, 75, 40);
  difficultySlider.parent(sliderContainer); // スライダーをコンテナ要素に追加

  // コンテナ要素を回転するためのCSSスタイルを適用
  sliderContainer.style('transform', 'rotate(90deg) translate(0, -50%');
  sliderContainer.style('transform-origin', '0 0');
  difficultySlider.input((e) => {
    let value = difficultySlider.value();
    let diff_text = createDiv(value);
    diff_text.id('pop_text');
    let p = sliderContainer.elt.getBoundingClientRect();
    let d = diff_text.elt.getBoundingClientRect();
    let scrollTop = window.scrollY;
    diff_text.position(p.left - (d.width - p.width) / 2 , p.top + scrollTop + p.height);
    setTimeout(() => {
      diff_text.elt.remove();
    }, 1000)
  });
}

let selectedCell = null;
function clickAction () {
  if (!selectedCell) {
    return false;
  }
  let num = $('#sudoku button.select').attr('data-name');
  if (num === 'erase') {
    if (selectedCell && grid[selectedCell.i][selectedCell.j] > 9) {
      grid[selectedCell.i][selectedCell.j] = 0;
      drawGrid(grid, 0);
    }
  } else {
    num = Number(num);
    if (grid[selectedCell.i][selectedCell.j] == 0 || grid[selectedCell.i][selectedCell.j] > 9) {
      grid[selectedCell.i][selectedCell.j] = num + 10;
      drawGrid(grid, 0);
    }
  }
}
function mouseClicked() {
  let j = floor(mouseX / cellSize);
  let i = floor(mouseY / cellSize);

  if (i < 9 && j < 9) {
    selectedCell = { i, j };
    clickAction ();
  } else {
    selectedCell = null;
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function copyMatrix(base) {
  const result = [];
  base.forEach((item, i) => {
    result[i] = base[i];
  });
  return result;
}
function setCellCrear (x, y, grid) {
  for (let k = 0; k < 9; k++) {
    grid[y + Math.floor(k / 3)][x + k % 3] = 0;
  }
}
function verticalOp(x, y, grid) {
  let lB_1 = [grid[y][x], grid[y + 1][x], grid[y + 2][x]];
  let lB_2 = [grid[y][x + 1], grid[y + 1][x + 1], grid[y + 2][x + 1]];
  let lB_3 = [grid[y][x + 2], grid[y + 1][x + 2], grid[y + 2][x + 2]];
  let table = [[lB_2, lB_3], [lB_3, lB_1], [lB_1, lB_2]];
  if (Math.random() < 0.5) {
    table = [[lB_3, lB_2], [lB_1, lB_3], [lB_2, lB_1]];
  }
  let arry;
  arry = [shuffleArray(table[0][0]), shuffleArray(table[0][1])];
  for (let i = 0; i < 3; i++) {
    grid[i][x] = arry[0][i];
    grid[i + 6][x] = arry[1][i];
  }
  arry = [shuffleArray(table[1][0]), shuffleArray(table[1][1])];
  for (let i = 0; i < 3; i++) {
    grid[i][x + 1] = arry[0][i];
    grid[i + 6][x + 1] = arry[1][i];
  }
  arry = [shuffleArray(table[2][0]), shuffleArray(table[2][1])];
  for (let i = 0; i < 3; i++) {
    grid[i][x + 2] = arry[0][i];
    grid[i + 6][x + 2] = arry[1][i];
  }
}
function horizontalOp(x, y, grid) {
  let lB_1 = [grid[y][x], grid[y][x + 1], grid[y][x + 2]];
  let lB_2 = [grid[y + 1][x], grid[y + 1][x + 1], grid[y + 1][x + 2]];
  let lB_3 = [grid[y + 2][x], grid[y + 2][x + 1], grid[y + 2][x + 2]];
  let table = [[lB_2, lB_3], [lB_3, lB_1], [lB_1, lB_2]];
  if (Math.random() < 0.5) {
    table = [[lB_3, lB_2], [lB_1, lB_3], [lB_2, lB_1]];
  }
  let arry = [];
  arry = [shuffleArray(table[0][0]), shuffleArray(table[0][1])];
  for (let i = 0; i < 3; i++) {
    grid[y][i] = arry[0][i];
    grid[y][i + 6] = arry[1][i];
  }
  arry = [shuffleArray(table[1][0]), shuffleArray(table[1][1])];
  for (let i = 0; i < 3; i++) {
    grid[y + 1][i] = arry[0][i];
    grid[y + 1][i + 6] = arry[1][i];
  }
  arry = [shuffleArray(table[2][0]), shuffleArray(table[2][1])];
  for (let i = 0; i < 3; i++) {
    grid[y + 2][i] = arry[0][i];
    grid[y + 2][i + 6] = arry[1][i];
  }
}
function boxOp (x, y, grid) {
  let randArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffleArray(randArray);
  let n = 0;
  let dammy_arry = [];
  while (n < 9) {
    if (obj.flag > 10) {
      obj.failed = true;
      break;
    }
    let num = [];
    for (let k = 0; k < 9; k++) {
      num.push(grid[k][x + n % 3]);
      num.push(grid[y + Math.floor(n / 3)][k]);
    }
    let index = num.indexOf(randArray[n]);
    if (index < 0) {
      randArray = randArray.concat(dammy_arry);
      dammy_arry = [];
      n++;
    } else if (randArray.length > n + 1) {
      let temp = randArray.splice(n, 1);
      dammy_arry.push(temp[0]);
    } else {
      randArray = randArray.concat(dammy_arry);
      randArray = [...randArray].reverse();
      dammy_arry = [];
      n = 0;
      obj.flag++;
    }
  }
  randArray.forEach((number, i) => {
    grid[y + Math.floor(i / 3)][x + i % 3] = number;
  });
}
function lastBoxOp (x, y, grid, cell) {
  let randArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let candidate = [];
  for (let n = 0; n < 9; n++) {
    let num = [];
    for (let k = 0; k < 9; k++) {
      num.push(grid[k][x + n % 3]);
      num.push(grid[y + Math.floor(n / 3)][k]);
    }
    if (!candidate[n]) {
      candidate[n] = [];
    }
    randArray.forEach((number, i) => {
      if (num.indexOf(number) < 0) {
        candidate[n].push(number);
      }
    });
  }
  let roopOut = false;
  let i = 0;
  while (i < candidate.length) {
    if (candidate[i].length <= 0) {
      roopOut = true;
      break;
    }
    else if (candidate[i].length == 1) {
      let confirm_num = candidate[i];
      candidate.forEach((layer, y) => {
        if (y == i) {
          return true;
        }
        let index = layer.indexOf(confirm_num);
        if (index >= 0) {
          layer.splice(index, 1);
          if (y < i) {
            i = 0;
            return false;
          }
        }
      });
      i++;
    }
    else {
      i++;
    }
  }
  if (!roopOut) {
    if (cell == 1) {
      obj.flag_l1 = 10;
    }
    if (cell == 2) {
      obj.flag_l2 = 10;
    }
    obj.failed = false;
  }
  return candidate;
}
function generateGrid() {
  let grid = [];
  for (let i = 0; i < 9; i++) {
    if (!grid[i]) {
      grid[i] = [];
    }
    for (let j = 0; j < 9; j++) {
      grid[i][j] = 0;
    }
  }
  let randArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffleArray(randArray);
  let y = 3;
  let x = 3;
  randArray.forEach((number, index) => {
    grid[y][x] = number;
    x++;
    if (x >= 6) {
      y++;
      x = 3;
    }
  });
  horizontalOp(3, 3, grid);
  verticalOp(3, 3, grid);
  obj.flag = 0;
  boxOp (0, 0, grid);
  obj.flag = 0;
  boxOp (6, 6, grid);
  let candidate_1, candidate_2;
  obj.flag_l1 = 0;
  obj.flag_l2 = 0;
  do {
    obj.failed = true;
    candidate_1 = lastBoxOp (6, 0, grid, 1);
    candidate_2 = lastBoxOp (0, 6, grid, 2);
    obj.flag_l1++;
    obj.flag_l2++;
    if (obj.flag_l1 < 10 || obj.flag_l2 < 10) {
      if (obj.flag_l1 < 10) {
        obj.flag_l2 = 0;
      }
      if (obj.flag_l2 < 10) {
        obj.flag_l1 = 0;
      }
      setCellCrear (0, 0, grid);
      obj.flag = 0;
      boxOp (0, 0, grid);
      setCellCrear (6, 6, grid);
      obj.flag = 0;
      boxOp (6, 6, grid);
    }
  } while (obj.flag_l1 < 10 || obj.flag_l2 < 10);
  if (obj.failed) {
    return false;
  }
  candidate_1.forEach((number, i) => {
    grid[0 + Math.floor(i / 3)][6 + i % 3] = number;
  });
  candidate_2.forEach((number, i) => {
    grid[6 + Math.floor(i / 3)][0 + i % 3] = number;
  });
  return grid;
}
function randHole(grid, diff) {
  let exit = 0;
  let gridHole = [];
  for (let j = 0; j < 9; j++) {
    if (!gridHole[j]) {
      gridHole[j] = [];
    }
    for (let i = 0; i < 9; i++) {
      if (exit >= diff) {
        gridHole[j][i] = 0;
      } else if (Math.random() < diff / 81) {
        gridHole[j][i] = grid[j][i];
        exit++;
      } else {
        gridHole[j][i] = 0;
      }
    }
  }
  return gridHole;
}

function initializeGrid(diff) {
  gridAns = generateGrid();
  if (obj.failed) {
    return false;
  }
  gridHole = randHole(gridAns, diff);
  grid = JSON.parse(JSON.stringify(gridHole)); // Copy gridHole to grid
  gridAns = JSON.parse(JSON.stringify(gridAns)); // Copy gridHole to gridAns
}
