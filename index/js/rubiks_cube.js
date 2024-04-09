import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
const width = window.innerWidth;
const height = window.innerHeight;
const canvasElement = document.querySelector('#myCanvas');
const renderer = new THREE.WebGLRenderer({
  canvas: canvasElement
});
renderer.setSize(width, height);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
const cubeSize = 100;
let cubeDiagonal = Math.sqrt(2) * 3 * cubeSize; // キューブの対角線の長さ
let wSize = width;
if (width > height) {
  wSize = height;
}
// キューブが画面内に収まる最大のZ位置を計算
let maxZ = cubeDiagonal * 1000 / (wSize);
if (maxZ <= 500) {
  maxZ = 500;
}
camera.position.set(0, 0, maxZ);
// ウィンドウのリサイズ時にキャンバスのサイズを調整する
window.addEventListener("resize", () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  // キャンバスのサイズをウィンドウのサイズに合わせる
  renderer.setSize(newWidth, newHeight);

  // カメラのアスペクト比を更新
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  // キャンバスのサイズも更新
  canvasWidth = canvasElement.clientWidth;
  canvasHeight = canvasElement.clientHeight;

  // ルービックキューブがはみ出ないようにカメラ位置を調整
  wSize = newWidth;
  if (newWidth > newHeight) {
    wSize = newHeight;
  }
  // キューブが画面内に収まる最大のZ位置を計算
  maxZ = cubeDiagonal * 1000 / (wSize - 60);
  if (maxZ <= 1000) {
    maxZ = 1000;
  }
  // カメラの位置を調整
  camera.position.set(0, 0, maxZ);
});
// キューブの作成
const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const textureUrls = [
  '../art/img/blocks/Block_of_Diamond.jpg',
  '../art/img/blocks/Block_of_Emerald.jpg',
  '../art/img/blocks/Block_of_Gold.jpg',
  '../art/img/blocks/Block_of_Amethyst.jpg',
  '../art/img/blocks/Copper_Block.jpg',
  '../art/img/blocks/Sea_Lantern.jpg',
];
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff]; // 各面の色
let materials = colors.map(color => new THREE.MeshBasicMaterial({
  color
}));
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0x000000
});
for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      const cube = new THREE.Mesh(cubeGeometry, materials);
      cube.position.set(x * cubeSize, y * cubeSize, z * cubeSize);
      scene.add(cube);
      // 境界線の描画
      const edges = new THREE.EdgesGeometry(cubeGeometry);
      const lineSegments = new THREE.LineSegments(edges, lineMaterial);
      lineSegments.position.set(0, 0, 0); //境界線のずれなし
      cube.add(lineSegments); // cube の子要素として追加する
    }
  }
}
//change image
// ルービックキューブの初期化関数
function initializeRubiksCube() {
  // 古いルービックキューブを削除
  scene.children.length = 0;
  // 新しいルービックキューブを生成
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const cube = new THREE.Mesh(cubeGeometry, materials);
        cube.position.set(x * cubeSize, y * cubeSize, z * cubeSize);
        scene.add(cube);
        // 境界線の描画
        const edges = new THREE.EdgesGeometry(cubeGeometry);
        const lineSegments = new THREE.LineSegments(edges, lineMaterial);
        lineSegments.position.set(0, 0, 0); // 境界線のずれなし
        cube.add(lineSegments); // cube の子要素として追加する
      }
    }
  }
}
$('#change_image').change((e) => {
  if ($('#change_image').prop('checked')) {
    materials = colors.map((color, index) => {
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(textureUrls[index]);
      return new THREE.MeshBasicMaterial({ map: texture });
    });
  }
  if (!$('#change_image').prop('checked')) {
    materials = colors.map(color => new THREE.MeshBasicMaterial({
      color
    }));
  }
  initializeRubiksCube();
});
let controls = new OrbitControls(camera, canvasElement);
// マウス座標からのレイキャスティング
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let intersectedObject = null;
let canvasWidth = canvasElement.clientWidth; // キャンバスの幅
let canvasHeight = canvasElement.clientHeight; // キャンバスの高さ
//shuffle
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomAxis() {
  const axes = ['x', 'y', 'z'];
  const randomIndex = getRandomInt(0, 2);
  return axes[randomIndex];
}
function getRandomDirection() {
  return Math.random() < 0.5 ? 1 : -1;
}
function shuffle() {
  let shuffleCount = $("#shuffle-value").val();
  for (let i = 0; i < shuffleCount; i++) {
    const selectedCube = scene.children[getRandomInt(0, scene.children.length - 1)];
    if (selectedCube instanceof THREE.Mesh) {
      const cubeSpacing = cubeSize;
      const randomAxes = getRandomAxis();
      const angleChange = (Math.PI / 2) * getRandomDirection();
      if (randomAxes[0] === 'x') {
        let select_x_axis = [
          {x: 0, y: -1, z: -1}, {x: 0, y: 0, z: -1}, {x: 0, y: 1, z: -1},
          {x: 0, y: -1, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 1, z: 0},
          {x: 0, y: -1, z: 1}, {x: 0, y: 0, z: 1}, {x: 0, y: 1, z: 1}
        ];
        select_x_axis.forEach(function(item, index) {
          // 選択キューブの座標を計算
          const cubeNextPosition = new THREE.Vector3(
            Math.round(selectedCube.position.x) + cubeSpacing * item.x,
            cubeSpacing * item.y,
            cubeSpacing * item.z
          );
          // 選択キューブを検索
          const cubeNext = scene.children.find(child => {
            if (child instanceof THREE.Mesh) {
              const position = child.position.clone();
              position.x = Math.round(position.x); // x座標にMath.floorを適用
              position.y = Math.round(position.y); // y座標にMath.floorを適用
              position.z = Math.round(position.z); // z座標にMath.floorを適用
              return cubeNextPosition.equals(position);
            }
          });
          // 選択キューブをハイライト
          if (cubeNext) {
            select_x_axis[index] = cubeNext;
          }
        });
        select_x_axis.forEach((cube, index) => {
          const offsetY = cube.position.y / 100;
          const offsetZ = cube.position.z / 100;
          const calc = calculateDistanceAndAngleChange(0, 0, offsetY, offsetZ);
          cube.position.y -= cubeSize * offsetY;
          cube.position.z -= cubeSize * offsetZ;
          const rotationAxis = new THREE.Vector3(1, 0, 0); // y軸回転
          rotateObjectByAxisAngle(cube, rotationAxis, angleChange); // -angleChangeで逆方向に回転
          cube.position.y += cubeSize * calc.dis * Math.cos(calc.ang + angleChange);
          cube.position.z += cubeSize * calc.dis * Math.sin(calc.ang + angleChange);
        });
      }
      if (randomAxes[0] === 'y') {
        let select_y_axis = [
          {x: -1, y: 0, z: -1}, {x: 0, y: 0, z: -1}, {x: 1, y: 0, z: -1},
          {x: -1, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0},
          {x: -1, y: 0, z: 1}, {x: 0, y: 0, z: 1}, {x: 1, y: 0, z: 1}
        ];
        select_y_axis.forEach(function(item, index) {
          // 選択キューブの座標を計算
          const cubeNextPosition = new THREE.Vector3(
            cubeSpacing * item.x,
            Math.round(selectedCube.position.y) + cubeSpacing * item.y,
            cubeSpacing * item.z
          );
          // 選択キューブを検索
          const cubeNext = scene.children.find(child => {
            if (child instanceof THREE.Mesh) {
              const position = child.position.clone();
              position.x = Math.round(position.x); // x座標にMath.floorを適用
              position.y = Math.round(position.y); // y座標にMath.floorを適用
              position.z = Math.round(position.z); // z座標にMath.floorを適用
              return cubeNextPosition.equals(position);
            }
          });
          // 選択キューブをハイライト
          if (cubeNext) {
            select_y_axis[index] = cubeNext;
          }
        });
        select_y_axis.forEach((cube, index) => {
          const offsetX = cube.position.x / 100;
          const offsetZ = cube.position.z / 100;
          const calc = calculateDistanceAndAngleChange(0, 0, offsetX, offsetZ);
          cube.position.x -= cubeSize * offsetX;
          cube.position.z -= cubeSize * offsetZ;
          const rotationAxis = new THREE.Vector3(0, 1, 0); // y軸回転
          rotateObjectByAxisAngle(cube, rotationAxis, -angleChange); // -angleChangeで逆方向に回転
          cube.position.x += cubeSize * calc.dis * Math.cos(calc.ang + angleChange);
          cube.position.z += cubeSize * calc.dis * Math.sin(calc.ang + angleChange);
        });
      }
      if (randomAxes[0] === 'z') {
        let select_z_axis = [
          {x: -1, y: -1, z: 0}, {x: 0, y: -1, z: 0}, {x: 1, y: -1, z: 0},
          {x: -1, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0},
          {x: -1, y: 1, z: 0}, {x: 0, y: 1, z: 0}, {x: 1, y: 1, z: 0}
        ];
        select_z_axis.forEach(function(item, index) {
          // 選択キューブの座標を計算
          const cubeNextPosition = new THREE.Vector3(
            cubeSpacing * item.x,
            cubeSpacing * item.y,
            Math.round(selectedCube.position.z) + cubeSpacing * item.z
          );
          // 選択キューブを検索
          const cubeNext = scene.children.find(child => {
            if (child instanceof THREE.Mesh) {
              const position = child.position.clone();
              position.x = Math.round(position.x); // x座標にMath.floorを適用
              position.y = Math.round(position.y); // y座標にMath.floorを適用
              position.z = Math.round(position.z); // z座標にMath.floorを適用
              return cubeNextPosition.equals(position);
            }
          });
          // 選択キューブをハイライト
          if (cubeNext) {
            select_z_axis[index] = cubeNext;
          }
        });
        select_z_axis.forEach((cube, index) => {
          const offsetX = cube.position.x / 100;
          const offsetY = cube.position.y / 100;
          const calc = calculateDistanceAndAngleChange(0, 0, offsetX, offsetY);
          cube.position.x -= cubeSize * offsetX;
          cube.position.y -= cubeSize * offsetY;
          const rotationAxis = new THREE.Vector3(0, 0, 1); // y軸回転
          rotateObjectByAxisAngle(cube, rotationAxis, angleChange); // -angleChangeで逆方向に回転
          cube.position.x += cubeSize * calc.dis * Math.cos(calc.ang + angleChange);
          cube.position.y += cubeSize * calc.dis * Math.sin(calc.ang + angleChange);
        });
      }
    }
  }
}
document.getElementById('shuffle-button').addEventListener('click', shuffle);
//button action
let obj = {
  p: [0, 0, 0], select_cube: '', cubes: '', changeKey: 'y', vector: ''
};
let animationActive = true;
function rotateObjectByAxisAngle(object, axis, angle) {
  const rotationMatrix = new THREE.Matrix4().makeRotationAxis(axis, angle);
  object.applyMatrix4(rotationMatrix);
}
function calculateDistanceAndAngleChange(x1, y1, x2, y2) {
  const distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  const angle1 = Math.atan2(y1, x1);
  const angle2 = Math.atan2(y2, x2);
  let angleChange = angle2 - angle1;

  // 角度を正規化して -π から π の範囲にする
  if (angleChange > Math.PI) {
    angleChange -= 2 * Math.PI;
  } else if (angleChange < -Math.PI) {
    angleChange += 2 * Math.PI;
  }
  return { dis: distance, ang: angleChange };
}
function findMaxAbsValueKey(obj) {
  let maxKey = null;
  let maxValue = -Infinity;

  for (const key in obj) {
    if (key === 'isVector3') {
      continue;
    }
    const absValue = Math.abs(obj[key]);
    if (absValue > maxValue) {
      maxKey = key;
      maxValue = absValue;
    }
  }

  return maxKey;
}
function startFunc(p) {
  // 全てのキューブの線を元の色に戻す
  scene.traverse((object) => {
    if (object.isLineSegments) {
      object.material = lineMaterial;
    }
  });
  const centerCubePosition = new THREE.Vector3(p[0], p[1], p[2]);
  // キューブの間隔
  const cubeSpacing = cubeSize;
  let select_x_axis = [
    {x: 0, y: -1, z: -1}, {x: 0, y: 0, z: -1}, {x: 0, y: 1, z: -1},
    {x: 0, y: -1, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 1, z: 0},
    {x: 0, y: -1, z: 1}, {x: 0, y: 0, z: 1}, {x: 0, y: 1, z: 1}
  ];
  let select_y_axis = [
    {x: -1, y: 0, z: -1}, {x: 0, y: 0, z: -1}, {x: 1, y: 0, z: -1},
    {x: -1, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0},
    {x: -1, y: 0, z: 1}, {x: 0, y: 0, z: 1}, {x: 1, y: 0, z: 1}
  ];
  let select_z_axis = [
    {x: -1, y: -1, z: 0}, {x: 0, y: -1, z: 0}, {x: 1, y: -1, z: 0},
    {x: -1, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0},
    {x: -1, y: 1, z: 0}, {x: 0, y: 1, z: 0}, {x: 1, y: 1, z: 0}
  ];
  obj.cubes = {x: [], y: [], z: []};
  select_x_axis.forEach(function(item, index) {
    // 選択キューブの座標を計算
    const cubeNextPosition = new THREE.Vector3(
      Math.round(centerCubePosition.x) + cubeSpacing * item.x,
      cubeSpacing * item.y,
      cubeSpacing * item.z
    );
    // 選択キューブを検索
    const cubeNext = scene.children.find(child => {
      if (child instanceof THREE.Mesh) {
        const position = child.position.clone();
        position.x = Math.round(position.x); // x座標にMath.floorを適用
        position.y = Math.round(position.y); // y座標にMath.floorを適用
        position.z = Math.round(position.z); // z座標にMath.floorを適用
        return cubeNextPosition.equals(position);
      }
    });
    // 選択キューブをハイライト
    if (cubeNext) {
      select_x_axis[index] = cubeNext;
      obj.cubes.x.push({
        position: cubeNext.position.clone(),
        rotation: cubeNext.rotation.clone(),
        scale: cubeNext.scale.clone()
      });
    }
  });
  select_y_axis.forEach(function(item, index) {
    // 選択キューブの座標を計算
    const cubeNextPosition = new THREE.Vector3(
      cubeSpacing * item.x,
      Math.round(centerCubePosition.y) + cubeSpacing * item.y,
      cubeSpacing * item.z
    );
    // 選択キューブを検索
    const cubeNext = scene.children.find(child => {
      if (child instanceof THREE.Mesh) {
        const position = child.position.clone();
        position.x = Math.round(position.x); // x座標にMath.floorを適用
        position.y = Math.round(position.y); // y座標にMath.floorを適用
        position.z = Math.round(position.z); // z座標にMath.floorを適用
        return cubeNextPosition.equals(position);
      }
    });
    // 選択キューブをハイライト
    if (cubeNext) {
      cubeNext.children.forEach(child => {
        if (child.isLineSegments) {
          const lineMaterialHighlight = new THREE.LineBasicMaterial({
            color: 0xffffff // ハイライト用の色（白）
          });
          child.material = lineMaterialHighlight;
        }
      });
      select_y_axis[index] = cubeNext;
      obj.cubes.y.push({
        position: cubeNext.position.clone(),
        rotation: cubeNext.rotation.clone(),
        scale: cubeNext.scale.clone()
      });
    }
  });
  select_z_axis.forEach(function(item, index) {
    // 選択キューブの座標を計算
    const cubeNextPosition = new THREE.Vector3(
      cubeSpacing * item.x,
      cubeSpacing * item.y,
      Math.round(centerCubePosition.z) + cubeSpacing * item.z
    );
    // 選択キューブを検索
    const cubeNext = scene.children.find(child => {
      if (child instanceof THREE.Mesh) {
        const position = child.position.clone();
        position.x = Math.round(position.x); // x座標にMath.floorを適用
        position.y = Math.round(position.y); // y座標にMath.floorを適用
        position.z = Math.round(position.z); // z座標にMath.floorを適用
        return cubeNextPosition.equals(position);
      }
    });
    // 選択キューブをハイライト
    if (cubeNext) {
      select_z_axis[index] = cubeNext;
      obj.cubes.z.push({
        position: cubeNext.position.clone(),
        rotation: cubeNext.rotation.clone(),
        scale: cubeNext.scale.clone()
      });
    }
  });
  obj.select_cube = {x: select_x_axis, y: select_y_axis, z: select_z_axis};
  // カメラの現在の方向（クォータニオンからオイラー角に変換）
  const cameraRotation = new THREE.Euler().setFromQuaternion(camera.quaternion);
  // カメラのローカル座標系におけるXYZ軸
  const cameraForward = new THREE.Vector3(0, 0, -1); // カメラの前方（奥行き方向）
  const cameraUp = new THREE.Vector3(0, 1, 0); // カメラの上方（Y軸）
  const cameraRight = new THREE.Vector3(1, 0, 0); // カメラの右方（X軸）
  // カメラの方向に基づいて座標軸を回転
  cameraForward.applyEuler(cameraRotation);
  cameraUp.applyEuler(cameraRotation);
  cameraRight.applyEuler(cameraRotation);
  // 結果をログに出力
  const cameraForwardKey = findMaxAbsValueKey(cameraForward);
  const cameraUpKey = findMaxAbsValueKey(cameraUp);
  const cameraRightKey = findMaxAbsValueKey(cameraRight);
  obj.vector = [cameraRightKey, cameraUpKey, cameraForwardKey];
}
function highlightAxis(axis) {
  obj.changeKey = axis;
  scene.traverse((object) => {
    if (object.isLineSegments) {
      object.material = lineMaterial;
    }
  });
  const targetAxis = obj.select_cube[axis];
  if (targetAxis) {
    targetAxis.forEach(function(cubeNext, index) {
      cubeNext.children.forEach(child => {
        if (child.isLineSegments) {
          const lineMaterialHighlight = new THREE.LineBasicMaterial({
            color: 0xffffff // ハイライト用の色（白）
          });
          child.material = lineMaterialHighlight;
        }
      });
    });
  }
}
function moveFunc(angleChange) {
  if (obj.changeKey === 'y') {
    obj.select_cube.x.forEach(function(cube, index) {
      const savedState = obj.cubes.x[index];
      cube.position.copy(savedState.position);
      cube.rotation.copy(savedState.rotation);
      cube.scale.copy(savedState.scale);
    });
    obj.select_cube.z.forEach(function(cube, index) {
      const savedState = obj.cubes.z[index];
      cube.position.copy(savedState.position);
      cube.rotation.copy(savedState.rotation);
      cube.scale.copy(savedState.scale);
    });
    obj.select_cube.y.forEach(function(cube, index) {
      const savedState = obj.cubes.y[index];
      cube.position.copy(savedState.position);
      cube.rotation.copy(savedState.rotation);
      cube.scale.copy(savedState.scale);
      const offsetX = cube.position.x / cubeSize;
      const offsetZ = cube.position.z / cubeSize;
      const calc = calculateDistanceAndAngleChange(0, 0, offsetX, offsetZ);
      cube.position.x -= cubeSize * offsetX;
      cube.position.z -= cubeSize * offsetZ;
      const rotationAxis = new THREE.Vector3(0, 1, 0); // y軸回転
      rotateObjectByAxisAngle(cube, rotationAxis, -angleChange); // -angleChangeで逆方向に回転
      cube.position.x += cubeSize * calc.dis * Math.cos(calc.ang + angleChange);
      cube.position.z += cubeSize * calc.dis * Math.sin(calc.ang + angleChange);
    });
  }
  if (obj.changeKey === 'x') {
    obj.select_cube.y.forEach(function(cube, index) {
      const savedState = obj.cubes.y[index];
      cube.position.copy(savedState.position);
      cube.rotation.copy(savedState.rotation);
      cube.scale.copy(savedState.scale);
    });
    obj.select_cube.z.forEach(function(cube, index) {
      const savedState = obj.cubes.z[index];
      cube.position.copy(savedState.position);
      cube.rotation.copy(savedState.rotation);
      cube.scale.copy(savedState.scale);
    });
    obj.select_cube.x.forEach(function(cube, index) {
      const savedState = obj.cubes.x[index];
      cube.position.copy(savedState.position);
      cube.rotation.copy(savedState.rotation);
      cube.scale.copy(savedState.scale);
      const offsetY = cube.position.y / cubeSize;
      const offsetZ = cube.position.z / cubeSize;
      const calc = calculateDistanceAndAngleChange(0, 0, offsetY, offsetZ);
      cube.position.y -= cubeSize * offsetY;
      cube.position.z -= cubeSize * offsetZ;
      const rotationAxis = new THREE.Vector3(1, 0, 0); // y軸回転
      rotateObjectByAxisAngle(cube, rotationAxis, angleChange); // -angleChangeで逆方向に回転
      cube.position.y += cubeSize * calc.dis * Math.cos(calc.ang + angleChange);
      cube.position.z += cubeSize * calc.dis * Math.sin(calc.ang + angleChange);
    });
  }
  if (obj.changeKey === 'z') {
    obj.select_cube.x.forEach(function(cube, index) {
      const savedState = obj.cubes.x[index];
      cube.position.copy(savedState.position);
      cube.rotation.copy(savedState.rotation);
      cube.scale.copy(savedState.scale);
    });
    obj.select_cube.y.forEach(function(cube, index) {
      const savedState = obj.cubes.y[index];
      cube.position.copy(savedState.position);
      cube.rotation.copy(savedState.rotation);
      cube.scale.copy(savedState.scale);
    });
    obj.select_cube.z.forEach(function(cube, index) {
      const savedState = obj.cubes.z[index];
      cube.position.copy(savedState.position);
      cube.rotation.copy(savedState.rotation);
      cube.scale.copy(savedState.scale);
      const offsetX = cube.position.x / cubeSize;
      const offsetY = cube.position.y / cubeSize;
      const calc = calculateDistanceAndAngleChange(0, 0, offsetX, offsetY);
      cube.position.x -= cubeSize * offsetX;
      cube.position.y -= cubeSize * offsetY;
      const rotationAxis = new THREE.Vector3(0, 0, 1); // y軸回転
      rotateObjectByAxisAngle(cube, rotationAxis, angleChange); // -angleChangeで逆方向に回転
      cube.position.x += cubeSize * calc.dis * Math.cos(calc.ang + angleChange);
      cube.position.y += cubeSize * calc.dis * Math.sin(calc.ang + angleChange);
    });
  }
}
function animateMoveFunc(initialAngle, finalAngle, duration) {
  const startTime = Date.now();
  const endTime = startTime + duration;
  function animateRoll() {
    const now = Date.now();
    const progress = Math.min((now - startTime) / duration, 1); // アニメーションの進行度を計算する
    const angleChange = initialAngle + (finalAngle - initialAngle) * progress; // 初期角度から最終角度までの間を進む
    moveFunc(angleChange); // moveFunc を呼び出す
    if (now < endTime) {
      requestAnimationFrame(animateRoll); // 次のフレームを要求してアニメーションを継続する
      animate();
    } else {
      animate();
      animationActive = false;
    }
  }
  animateRoll(); // アニメーションを開始する
}
$('#axis_change').click((e) => {
  animationActive = true;
  obj.p = [0, 0, 0];
  startFunc(obj.p);
  let arry = ['x', 'y', 'z'];
  let axis = obj.changeKey;
  axis = arry[(arry.indexOf(axis) + 1) % arry.length];
  highlightAxis(axis);
  animate();
  animationActive = false;
});
$('#layer_change').click((e) => {
  animationActive = true;
  let arry = ['x', 'y', 'z'];
  let axis = obj.changeKey;
  let n = obj.p[arry.indexOf(axis)] / cubeSize + 1;
  n = (n + 1) % 3 - 1;
  obj.p[arry.indexOf(axis)] = n * cubeSize;
  startFunc(obj.p);
  highlightAxis(axis);
  animate();
  animationActive = false;
});
$('#cube_right_roll').click((e) => {
  animationActive = true;
  let angleChange = -Math.PI / 2;
  if (obj.changeKey === 'y') {
    angleChange = Math.PI / 2
  }
  startFunc(obj.p);
  highlightAxis(obj.changeKey);
  animateMoveFunc(0, angleChange, 300);
});
$('#cube_left_roll').click((e) => {
  animationActive = true;
  let angleChange = Math.PI / 2;
  if (obj.changeKey === 'y') {
    angleChange = -Math.PI / 2
  }
  startFunc(obj.p);
  highlightAxis(obj.changeKey);
  animateMoveFunc(0, angleChange, 300);
});
//animation
function clickFunc() {
  document.addEventListener('mousemove', startAnimation);
  document.addEventListener('mouseup', stopAnimation);
  document.addEventListener('touchmove', startAnimation);
  document.addEventListener('touchend', stopAnimation);
}
function startAnimation() {
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
document.addEventListener('mousedown', clickFunc);
document.addEventListener('touchstart', clickFunc);
function animate() {
  if (animationActive) {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
}
animate();
animationActive = false;
//pop pop_text
function changeDifficulty() {
  let value = $('#shuffle-value').val();
  let diff_text = $('<div>').attr('id', 'pop_text').text(value);
  $('body').append(diff_text);
  let p = $('#shuffle-value')[0].getBoundingClientRect();
  let d = diff_text[0].getBoundingClientRect();
  let scrollTop = window.scrollY;
  let left = p.left - (d.width - p.width) / 2;
  let top = p.top + scrollTop + p.height + 5;
  diff_text.css({ 'position': 'absolute', 'left': left, 'top': top });
  setTimeout(() => {
    diff_text.remove();
  }, 1000);
}
$("#shuffle-value").on("input", changeDifficulty);
