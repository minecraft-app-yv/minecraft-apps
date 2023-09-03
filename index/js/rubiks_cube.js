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
let maxZ = cubeDiagonal * 1000 / (wSize - 60);
if (maxZ <= 1000) {
  maxZ = 1000;
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
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff]; // 各面の色
const materials = colors.map(color => new THREE.MeshBasicMaterial({
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
let controls = new OrbitControls(camera, canvasElement);
// マウス座標からのレイキャスティング
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let intersectedObject = null;
let canvasWidth = canvasElement.clientWidth; // キャンバスの幅
let canvasHeight = canvasElement.clientHeight; // キャンバスの高さ
// mousemove fun
let obj = {
  start_x: '', start_y: '', end_x: '', end_y: '',
  targetCube: '', moveCube: '', select_cube: '', cubes: '', changeKey: 'x'
};
// ボタン要素を取得
const upButton = document.getElementById('up-button');
const downButton = document.getElementById('down-button');
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
function highlightAxis(axis) {
  obj.changeKey = axis;
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
function keydown_event(event) {
  scene.traverse((object) => {
    if (object.isLineSegments) {
      object.material = lineMaterial;
    }
  });
  const keyMapping = {
    'ArrowUp': { 'x': 'y', 'y': 'z', 'z': 'x' },
    'ArrowDown': { 'x': 'z', 'y': 'x', 'z': 'y' }
  };
  if (keyMapping[event.code]) {
    event.preventDefault();
    const nextAxis = keyMapping[event.code][obj.changeKey];
    highlightAxis(nextAxis);
    return false;
  }
}
// ボタンにクリックイベントリスナーを追加
upButton.addEventListener('click', function() {
  triggerKeyDownEvent('ArrowUp');
});
downButton.addEventListener('click', function() {
  triggerKeyDownEvent('ArrowDown');
});
// キーダウンイベントをトリガーする関数
function triggerKeyDownEvent(keyCode) {
  const event = new KeyboardEvent('keydown', { 'code': keyCode });
  keydown_event(event);
}
function removeEvent(e) {
  window.removeEventListener('keydown', keydown_event, false);
  window.removeEventListener('mousemove', onMouseMove, false);
  window.removeEventListener('mouseup', removeEvent, false);
  window.removeEventListener('touchmove', onTouchMove, false);
  window.removeEventListener('touchend', removeEvent, false);
  const movedPosition = obj.moveCube.point;
  if (movedPosition === undefined) {
    return false;
  }
  const clickedPosition = obj.targetCube.point;
  if (obj.changeKey === 'y') {
    const x1 = clickedPosition.x;
    const z1 = clickedPosition.z;
    const x2 = movedPosition.x;
    const z2 = movedPosition.z;
    let angleChange = calculateDistanceAndAngleChange(x1, z1, x2, z2).ang;
    if (angleChange < Math.PI / 4 && angleChange >= -Math.PI / 4) {
      angleChange = 0;
    }
    if (angleChange >= Math.PI / 4 && angleChange < Math.PI * 3 / 4) {
      angleChange = Math.PI / 2;
    }
    if (angleChange >= Math.PI * 3 / 4 || angleChange < -Math.PI * 3 / 4) {
      angleChange = Math.PI;
    }
    if (angleChange >= -Math.PI * 3 / 4 && angleChange < -Math.PI / 4) {
      angleChange = -Math.PI / 2;
    }
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
  if (obj.changeKey === 'x') {
    const y1 = clickedPosition.y;
    const z1 = clickedPosition.z;
    const y2 = movedPosition.y;
    const z2 = movedPosition.z;
    let angleChange = calculateDistanceAndAngleChange(y1, z1, y2, z2).ang;
    if (angleChange < Math.PI / 4 && angleChange >= -Math.PI / 4) {
      angleChange = 0;
    }
    if (angleChange >= Math.PI / 4 && angleChange < Math.PI * 3 / 4) {
      angleChange = Math.PI / 2;
    }
    if (angleChange >= Math.PI * 3 / 4 || angleChange < -Math.PI * 3 / 4) {
      angleChange = Math.PI;
    }
    if (angleChange >= -Math.PI * 3 / 4 && angleChange < -Math.PI / 4) {
      angleChange = -Math.PI / 2;
    }
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
  if (obj.changeKey === 'z') {
    const x1 = clickedPosition.x;
    const y1 = clickedPosition.y;
    const x2 = movedPosition.x;
    const y2 = movedPosition.y;
    let angleChange = calculateDistanceAndAngleChange(x1, y1, x2, y2).ang;
    if (angleChange < Math.PI / 4 && angleChange >= -Math.PI / 4) {
      angleChange = 0;
    }
    if (angleChange >= Math.PI / 4 && angleChange < Math.PI * 3 / 4) {
      angleChange = Math.PI / 2;
    }
    if (angleChange >= Math.PI * 3 / 4 || angleChange < -Math.PI * 3 / 4) {
      angleChange = Math.PI;
    }
    if (angleChange >= -Math.PI * 3 / 4 && angleChange < -Math.PI / 4) {
      angleChange = -Math.PI / 2;
    }
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
function moveFunc(event) {
  // マウス座標を正規化
  mouse.x = ((obj.end_x + window.scrollX) / canvasWidth) * 2 - 1;
  mouse.y = -((obj.end_y +  window.scrollY) / canvasHeight) * 2 + 1;
  // レイキャスティング
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    obj.moveCube = intersects[0];
    const movedPosition = obj.moveCube.point;
    const clickedPosition = obj.targetCube.point;
    if (obj.changeKey === 'y') {
      const x1 = clickedPosition.x;
      const z1 = clickedPosition.z;
      const x2 = movedPosition.x;
      const z2 = movedPosition.z;
      let angleChange = calculateDistanceAndAngleChange(x1, z1, x2, z2).ang;
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
    if (obj.changeKey === 'x') {
      const y1 = clickedPosition.y;
      const z1 = clickedPosition.z;
      const y2 = movedPosition.y;
      const z2 = movedPosition.z;
      let angleChange = calculateDistanceAndAngleChange(y1, z1, y2, z2).ang;
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
    if (obj.changeKey === 'z') {
      const x1 = clickedPosition.x;
      const y1 = clickedPosition.y;
      const x2 = movedPosition.x;
      const y2 = movedPosition.y;
      let angleChange = calculateDistanceAndAngleChange(x1, y1, x2, y2).ang;
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
function onMouseMove(event) {
  obj.end_x = event.clientX;
  obj.end_y = event.clientY;
  moveFunc(event);
}
function onTouchMove(event) {
  obj.end_x = event.touches[0].clientX;
  obj.end_y = event.touches[0].clientY;
  moveFunc(event);
}
// マウスダウン時の処理
function startFunc(event) {
  // マウス座標を正規化
  mouse.x = ((obj.start_x + window.scrollX) / canvasWidth) * 2 - 1;
  mouse.y = -((obj.start_y + window.scrollY) / canvasHeight) * 2 + 1;
  // レイキャスティング
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  // 全てのキューブの線を元の色に戻す
  scene.traverse((object) => {
    if (object.isLineSegments) {
      object.material = lineMaterial;
    }
  });
  if (intersects.length <= 0) {
    document.body.style.cursor = "pointer";
    // カメラコントローラーを有効
    controls.enabled = true;
  } else {
    // キューブ内をクリックした場合の処理
    document.body.style.cursor = "default";
    // カメラコントローラーの停止
    controls.enabled = false;
    // 触ったキューブの座標
    obj.targetCube = intersects[0];
    const touchedCubePosition = obj.targetCube.object.position.clone();
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
        Math.round(touchedCubePosition.x) + cubeSpacing * item.x,
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
        Math.round(touchedCubePosition.y) + cubeSpacing * item.y,
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
        Math.round(touchedCubePosition.z) + cubeSpacing * item.z
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
    // hilight & action
    obj.changeKey = 'y';
    window.addEventListener('keydown', keydown_event, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mouseup', removeEvent, false);
    window.addEventListener('touchmove', onTouchMove, false);
    window.addEventListener('touchend', removeEvent, false);
  }
}
function onMouseDown(event) {
  obj.start_x = event.clientX;
  obj.start_y = event.clientY;
  startFunc(event);
}
function onTouchStart(event) {
  obj.start_x = event.touches[0].clientX;
  obj.start_y = event.touches[0].clientY;
  startFunc(event);
}
// マウスイベントリスナーを追加
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('touchstart', onTouchStart, false);
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
