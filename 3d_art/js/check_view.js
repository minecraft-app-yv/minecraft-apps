import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
/*++reserve functions++*/
function handleTouchMove(event) {
  event.preventDefault();
}
function return_str_escape_html(string) {
  if (typeof string !== "string") {
    return string;
  }
  return string.replace(/[&'`"<>]/g, function (match) {
    return {
      "&": "&amp;",
      "'": "&#x27;",
      "`": "&#x60;",
      '"': "&quot;",
      "<": "&lt;",
      ">": "&gt;"
    }[match];
  });
}
function deepCopyArray(array) {
  let copiedArray = [];
  for (let i = 0; i < array.length; i++) {
    if (Array.isArray(array[i])) {
      copiedArray[i] = deepCopyArray(array[i]);
    } else {
      copiedArray[i] = return_str_escape_html(array[i]);
    }
  }
  return copiedArray;
}
//canvas
const canvasElement = document.querySelector('#check_view');
canvasElement.style.cursor = "grab";
canvasElement.setAttribute('willReadFrequently', 'true');
const renderer = new THREE.WebGLRenderer({
  canvas: canvasElement
});
const width = canvasElement.clientWidth;
const height = canvasElement.clientHeight;
renderer.setSize(width, height);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
let block_count = $('#art_size').val();
let cubeSize = Math.round(300 / block_count);
camera.position.set(0, 0, 600);
//memory arry
let memory = [];
for (let z = 0; z < block_count; z++) {
  if (!memory[z]) {
    memory[z] = [];
  }
  for (let y = 0; y < block_count; y++) {
    if (!memory[z][y]) {
      memory[z][y] = [];
    }
    for (let x = 0; x < block_count; x++) {
      memory[z][y][x] = 0;
    }
  }
}
// switch theme
$('#theme_switch').click((e) => {
  const sunIcon = $('#theme_switch').children('i.fa-sun');
  const moonIcon = $('#theme_switch').children('i.fa-moon');
  switch (true) {
    case sunIcon.length > 0:
    $('#theme_switch').children('i').attr('class', 'fa-solid fa-moon');
    scene.background = new THREE.Color(0xffffff);
    startAnimation();
    animationActive = false;
    break;
    case moonIcon.length > 0:
    $('#theme_switch').children('i').attr('class', 'fa-solid fa-sun');
    scene.background = new THREE.Color(0x000022);
    startAnimation();
    animationActive = false;
    break;
    default:
    break;
  }
});
// キューブの作成
let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const transparency = 0;
const cubes = []; // キューブの配列を作成
let materials = new THREE.MeshBasicMaterial({
  transparent: true, // 透明に設定
  opacity: transparency // 透明度を設定
});
let lange = Math.floor(block_count / 2);
for (let x = -lange; x < lange; x++) {
  for (let y = -lange; y < lange; y++) {
    for (let z = -lange; z < lange; z++) {
      const cube = new THREE.Mesh(cubeGeometry, materials);
      cube.position.set(x * cubeSize, y * cubeSize, z * cubeSize);
      cubes.push(cube);
    }
  }
}
let controls = new OrbitControls(camera, canvasElement);
// メッセージ受信時の処理を設定
let animationActive = true;
function change_cube_size (e) {
  cubeSize = Math.round(300 / block_count);
  cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  materials = new THREE.MeshBasicMaterial({transparent: true, opacity: transparency});
  lange = Math.floor(block_count / 2);
  // 古いルービックキューブを削除
  scene.children.length = 0;
  cubes.length = 0;
  for (let x = -lange; x < lange; x++) {
    for (let y = -lange; y < lange; y++) {
      for (let z = -lange; z < lange; z++) {
        const cube = new THREE.Mesh(cubeGeometry, materials);
        cube.position.set(x * cubeSize, y * cubeSize, z * cubeSize);
        cubes.push(cube);
      }
    }
  }
  const newMemory = roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1];
  for (let z = 0; z < newMemory.length; z++) {
    for (let y = 0; y < newMemory[z].length; y++) {
      for (let x = 0; x < newMemory[z][y].length; x++) {
        let alt = newMemory[z][y][x];
        if (alt != 0) {
          // 特定の位置のx、y、z座標を指定
          const targetX = x - lange;
          const targetY = y - lange;
          const targetZ = z - lange;
          // cubes 配列内の特定の cube を探す
          const selectedCube = cubes.find(cube => {
            const position = cube.position;
            return (
              position.x === targetX * cubeSize &&
              position.y === targetY * cubeSize &&
              position.z === targetZ * cubeSize
            );
          });
          const cubeIndex = cubes.indexOf(selectedCube);
          if (cubeIndex !== -1) {
            const colorValue = cp_obj[alt].color;
            const colorArray = colorValue.match(/\d+/g).map(Number); // RGB文字列を数値の配列に変換
            const color = new THREE.Color(colorArray[0] / 255, colorArray[1] / 255, colorArray[2] / 255);
            // MeshBasicMaterial を作成し、color を設定
            materials = new THREE.MeshBasicMaterial({ color });
            const newCube = new THREE.Mesh(cubeGeometry, materials);
            newCube.position.copy(selectedCube.position);
            scene.add(newCube);
            cubes[cubeIndex] = newCube;
          }
        }
      }
    }
  }
  memory = deepCopyArray(newMemory);
  startAnimation();
  animationActive = false;
}
window.addEventListener('message', event => {
  const data = event.data;
  if (data && data.iframeVariable === 'check_view') {
    let newMemory = roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1];
    //make check veiw
    for (let z = 0; z < newMemory.length; z++) {
      for (let y = 0; y < newMemory[z].length; y++) {
        for (let x = 0; x < newMemory[z][y].length; x++) {
          if (memory[z][y][x] === undefined) {
            console.log('resize miss');
            break;
          }
          if (newMemory[z][y][x] !== memory[z][y][x]) {
            let alt = newMemory[z][y][x];
            // 特定の位置のx、y、z座標を指定
            const targetX = x - lange;
            const targetY = y - lange;
            const targetZ = z - lange;
            // cubes 配列内の特定の cube を探す
            const selectedCube = cubes.find(cube => {
              const position = cube.position;
              return (
                position.x === targetX * cubeSize &&
                position.y === targetY * cubeSize &&
                position.z === targetZ * cubeSize
              );
            });
            const cubeIndex = cubes.indexOf(selectedCube);
            if (cubeIndex !== -1) {
              scene.remove(selectedCube);
              if (alt != 0) {
                const colorValue = cp_obj[alt].color;
                const colorArray = colorValue.match(/\d+/g).map(Number); // RGB文字列を数値の配列に変換
                const color = new THREE.Color(colorArray[0] / 255, colorArray[1] / 255, colorArray[2] / 255);
                // MeshBasicMaterial を作成し、color を設定
                materials = new THREE.MeshBasicMaterial({ color });
              }
              if (alt == 0) {
                materials = new THREE.MeshBasicMaterial({
                  transparent: true, // 透明に設定
                  opacity: transparency // 透明度を設定
                });
              }
              const newCube = new THREE.Mesh(cubeGeometry, materials);
              newCube.position.copy(selectedCube.position);
              if (alt != 0) {
                scene.add(newCube);
              }
              cubes[cubeIndex] = newCube;
            }
          }
        }
      }
    }
    memory = deepCopyArray(newMemory);
    startAnimation();
    animationActive = false;
  }
  if (data && data.iframeVariable === 'change_cube_size') {
    block_count = $('#art_size').val();
    change_cube_size ();
  }
});
function onCubeClick(event) {
  document.addEventListener('mousemove', startAnimation);
  document.addEventListener('mouseup', stopAnimation);
  document.addEventListener('touchmove', startAnimation);
  document.addEventListener('touchend', stopAnimation);
}
function startAnimation() {
  if (animationActive) {
    return false;
  }
  animationActive = true;
  animate();
}
function stopAnimation() {
  animationActive = false;
  document.removeEventListener('mousemove', startAnimation);
  document.removeEventListener('mouseup', stopAnimation);
  document.removeEventListener('touchmove', startAnimation);
  document.removeEventListener('touchend', stopAnimation);
}
document.addEventListener('mousedown', onCubeClick);
document.addEventListener('touchstart', onCubeClick);
$('#check_view').on('wheel', (e) => {
  startAnimation();
  animationActive = false;
});
function animate() {
  if (animationActive) {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
}
animate();
animationActive = false;
