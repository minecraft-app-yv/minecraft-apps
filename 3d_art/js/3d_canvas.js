import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
const memory_obj = window.parent.sharedData.memory_obj;
const cp_obj = window.parent.sharedData.cp_obj;
const focus_point = window.parent.sharedData.focus_point;
const roll_back_obj = window.parent.sharedData.roll_back_obj;
for (let alt in cp_obj) {
  if (cp_obj.hasOwnProperty(alt)) {
    if (cp_obj[alt].tex) {
      continue;
    }
    let img = cp_obj[alt].img;
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(img.src);
    cp_obj[alt].tex = texture;
  }
}
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
function rgb_to_return_array_rgb (rgb) {
  rgb = rgb.replace("rgb(", "");
  rgb = rgb.replace("rgba(", "");
  rgb = rgb.replace(")", "");
  rgb = rgb.replaceAll(" ", "");
  rgb = rgb.split(",");
  return rgb;
}
function return_img_html_arry_rgb (palette_color_box_id) {
  let img = window.parent.$("#" + palette_color_box_id + " .CPimg").find('img.mImg');
  let color = img.css('backgroundColor');
  let html = jQuery("<div>").append(img.clone(true)).html();
  let arry_rgb = rgb_to_return_array_rgb (color);
  return {html: html, rgb: arry_rgb};
}
function add_canvas_to_roll_back_obj (value) {
  if (value === undefined) {
    return false;
  }
  let memory_amount = 1000;
  while (roll_back_obj.c_art > 0) {
    roll_back_obj.art.pop();
    roll_back_obj.c_art --;
  }
  if (roll_back_obj.art.length >= memory_amount) {
    roll_back_obj.art.shift();
  }
  roll_back_obj.c_art = 0;
  roll_back_obj.art.push(value);
}
function add_new_obj_to_memory_obj (key,value) {
  memory_obj[key] = value;
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
// URL パラメーターから値を取得
const params = new URLSearchParams(window.location.search);
const currentOrigin = params.get("currentOrigin");
let block_count = window.parent.document.querySelector('#art_size').value;
let layer_id = window.parent.document.querySelector('.layer_selector select.appear').id;
let select_layer = window.parent.document.querySelector('#' + layer_id).value;
select_layer = Number(select_layer);
const layer_slice = {select_vertical_layers: 'z', select_horizon_layers: 'y', select_side_layers: 'x'};
//canvas
const canvasElement = document.querySelector('#myCanvas');
canvasElement.setAttribute('willReadFrequently', 'true');
const renderer = new THREE.WebGLRenderer({
  canvas: canvasElement
});
const width = window.innerWidth;
const height = window.innerHeight;
renderer.setSize(width, height);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000011);
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
// キューブが画面内に収まる最大のZ位置を計算
let cubeSize = Math.round(300 / block_count);
camera.position.set(0, 0, 600);
window.parent.document.querySelector("#art_scale").value = 100;
// キューブの作成
let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const transparency = 0.1;
const cubes = []; // キューブの配列を作成
let materials = new THREE.MeshBasicMaterial({transparent: true, opacity: transparency});
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xf5f5f5
});
let lange = Math.floor(block_count / 2);
for (let x = -lange; x < lange; x++) {
  for (let y = -lange; y < lange; y++) {
    for (let z = -lange; z < lange; z++) {
      const cube = new THREE.Mesh(cubeGeometry, materials);
      cube.position.set(x * cubeSize, y * cubeSize, z * cubeSize);
      if (
        (layer_slice[layer_id] === 'x' && x == select_layer - lange) ||
        (layer_slice[layer_id] === 'y' && y == select_layer - lange) ||
        (layer_slice[layer_id] === 'z' && z == select_layer - lange)
      ) {
        scene.add(cube);
      }
      cubes.push(cube);
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
// メッセージを受信
let animationActive = true;
function resize_canvas (e) {
  const newWidth = window.parent.document.querySelector('#editing_areas').getBoundingClientRect().width;
  const newHeight = window.parent.document.querySelector('#editing_areas').getBoundingClientRect().height;
  renderer.setSize(newWidth, newHeight);
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  canvasWidth = canvasElement.clientWidth; // キャンバスの幅
  canvasHeight = canvasElement.clientHeight; // キャンバスの高さ
  startAnimation();
  animationActive = false;
}
async function restart_canvas (step) {
  if (roll_back_obj.art.length - roll_back_obj.c_art - 1 < 0) {
    roll_back_obj.c_art = roll_back_obj.art.length - 1;
  }
  obj.once_memory = deepCopyArray(roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1]);
  if (block_count != obj.once_memory.length || step === 'new') {
    window.parent.document.querySelector('#art_size').value = obj.once_memory.length;
    block_count = obj.once_memory.length;
    await change_cube_size ('resize');
    return false;
  }
  let value_arry = obj.once_memory;
  for (let z = 0; z < value_arry.length; z++) {
    for (let y = 0; y < value_arry[z].length; y++) {
      for (let x = 0; x < value_arry[z][y].length; x++) {
        if (value_arry[z][y][x] != 0) {
          let alt = value_arry[z][y][x];
          const targetX = x - lange;
          const targetY = y - lange;
          const targetZ = z - lange;
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
              materials = new THREE.MeshBasicMaterial({ map: cp_obj[alt].tex, transparent: true, opacity: 1});
            }
            const newCube = new THREE.Mesh(cubeGeometry, materials);
            newCube.position.copy(selectedCube.position);
            scene.add(newCube);
            cubes[cubeIndex] = newCube;
            startAnimation();
            animationActive = false;
          }
        }
      }
    }
  }
  const iframeVariable = 'check_view';
  window.parent.postMessage({ iframeVariable }, '*');
}
window.addEventListener("message", event => {
  if (event.origin === currentOrigin) {
    const inputValue = event.data;
    if (inputValue.task === 'resize') {
      resize_canvas ();
    }
    if (inputValue.task === 'restart') {
      window.parent.$('#wait').removeClass('hidden');
      if (inputValue.step === 'new') {
        restart_canvas ('new');
      }
      else {
        restart_canvas ();
      }
      setTimeout((e) => {
        window.parent.$('#wait').addClass('hidden');
      }, 5);
    }
    if (inputValue.task === 'textureLoader') {
      if (inputValue.alt === 'all') {
        for (let alt in cp_obj) {
          if (cp_obj.hasOwnProperty(alt)) {
            if (cp_obj[alt].tex) {
              continue;
            }
            let img = cp_obj[alt].img;
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load(img.src);
            cp_obj[alt].tex = texture;
          }
        }
      }
      else {
        let img = cp_obj[inputValue.alt].img;
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(img.src);
        cp_obj[alt].tex = texture;
      }
    }
  }
});
/* ++aside++ */
//change_cube_size
async function change_cube_size (pattern) {
  window.parent.$('#wait').removeClass('hidden');
  cubeSize = Math.round(300 / block_count);
  cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  materials = new THREE.MeshBasicMaterial({transparent: true, opacity: transparency});
  lange = Math.floor(block_count / 2);
  layer_id = window.parent.document.querySelector('.layer_selector select.appear').id;
  select_layer = Math.floor(block_count / 2);
  //change select list
  let vertical_layer_html = '';
  for (let k = 0; k < block_count; k++) {
    let reverse_c = block_count - k - 1;
    if (reverse_c == select_layer) {
      vertical_layer_html += '<option value="' + reverse_c + '" autofocus selected class="selected">' + reverse_c + '</option>';
    }
    else {
      vertical_layer_html += '<option value="' + reverse_c + '">' + reverse_c + '</option>';
    }
  }
  window.parent.$('#select_vertical_layers').html(vertical_layer_html);
  window.parent.$('#select_side_layers').html(vertical_layer_html);
  window.parent.$('#select_horizon_layers').html(vertical_layer_html);
  focus_point.forEach((item, i) => {
    focus_point[i] = select_layer;
  });
  // 古いルービックキューブを削除
  scene.children.length = 0;
  cubes.length = 0;
  for (let x = -lange; x < lange; x++) {
    for (let y = -lange; y < lange; y++) {
      for (let z = -lange; z < lange; z++) {
        const cube = new THREE.Mesh(cubeGeometry, materials);
        cube.position.set(x * cubeSize, y * cubeSize, z * cubeSize);
        if (
          (layer_slice[layer_id] === 'x' && x == select_layer - lange) ||
          (layer_slice[layer_id] === 'y' && y == select_layer - lange) ||
          (layer_slice[layer_id] === 'z' && z == select_layer - lange)
        ) {
          scene.add(cube);
        }
        cubes.push(cube);
      }
    }
  }
  const newArry = [];
  let length_gap = block_count - obj.once_memory.length;
  for (let z = 0; z < block_count; z++) {
    if (!newArry[z]) {
      newArry[z] = [];
    }
    for (let y = 0; y < block_count; y++) {
      if (!newArry[z][y]) {
        newArry[z][y] = [];
      }
      for (let x = 0; x < block_count; x++) {
        let alt = 0;
        if (
          (x >= Math.floor(length_gap / 2) && x < obj.once_memory.length + Math.floor(length_gap / 2)) &&
          (y >= Math.floor(length_gap / 2) && y < obj.once_memory.length + Math.floor(length_gap / 2)) &&
          (z >= Math.floor(length_gap / 2) && z < obj.once_memory.length + Math.floor(length_gap / 2))
        ) {
          alt = obj.once_memory[z - Math.floor(length_gap / 2)][y - Math.floor(length_gap / 2)][x - Math.floor(length_gap / 2)];
        }
        if (alt != 0) {
          const targetX = x - lange;
          const targetY = y - lange;
          const targetZ = z - lange;
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
            materials = new THREE.MeshBasicMaterial({ map: cp_obj[alt].tex, transparent: true, opacity: 1});
            const newCube = new THREE.Mesh(cubeGeometry, materials);
            newCube.position.copy(selectedCube.position);
            scene.add(newCube);
            cubes[cubeIndex] = newCube;

          }
        }
        newArry[z][y][x] = alt;
      }
    }
  }
  startAnimation();
  animationActive = false;
  if (pattern === 'resize') {
    add_canvas_to_roll_back_obj (newArry);
  }
  const iframeVariable = 'change_cube_size';
  window.parent.postMessage({ iframeVariable }, '*');
  do_flag = true;
  setTimeout((e) => {
    window.parent.$('#wait').addClass('hidden');
  }, 5);
}
window.parent.document.querySelector('#resize_button').addEventListener('click', async (e) => {
  if (!do_flag) {
    let str;
    if (window.parent.$('header .header_form p.language').text() === 'Japanese') {
      str = "処理が正しく完了できませんでした。ページの更新をお願い致します。";
    }
    if (window.parent.$('header .header_form p.language').text() === '英語') {
      str = "The process could not be completed correctly. Please reload the page.";
    }
    window.parent.alert(str);
    return false;
  }
  do_flag = false;
  if (roll_back_obj.art.length - roll_back_obj.c_art - 1 < 0) {
    roll_back_obj.c_art = roll_back_obj.art.length - 1;
  }
  obj.once_memory = deepCopyArray(roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1]);
  block_count = window.parent.document.querySelector('#art_size').value;
  if (block_count === '') {
    window.parent.document.querySelector('#art_size').value = obj.once_memory.length;
    block_count = obj.once_memory.length;
  }
  if (block_count < obj.once_memory.length) {
    let result;
    if (window.parent.$('header .header_form p.language').text() === 'Japanese') {
      result = window.parent.confirm('アートが消えますが続けますか？');
    }
    if (window.parent.$('header .header_form p.language').text() === '英語') {
      result = window.parent.confirm('The Art maybe be disappeared, will you continue?');
    }
    if (result) {
      await change_cube_size ('resize');
      return false;
    }
    else {
      window.parent.document.querySelector('#art_size').value = obj.once_memory.length;
      do_flag = true;
      return false;
    }
  }
  if (block_count >= obj.once_memory.length) {
    await change_cube_size ('resize');
    return false;
  }
});
/* ++mousemove fun++ */
const editingElement = document.querySelector('#editing_3d');
const slc = document.querySelector('#selectCanvas');
slc.setAttribute('willReadFrequently', 'true');
const slctx = slc.getContext("2d");
let obj = {
  use: '', once_memory: '', want_if: '', change_cubes: '', start_img: '', copy_img: '',
  start_x: '', start_y: '', start_z: '', end_x: '', end_y: '', end_z: ''
};
let do_flag = true;
let end_flag = false;
let isDragging = false;
let array_match_cell = [];
let count = 0;
function roundToNearest45(angle) {
    const angleInRadians = angle % (2 * Math.PI);
    const nearest45Index = Math.round(angleInRadians / (Math.PI / 4)) % 8;
    return nearest45Index * (Math.PI / 4);
}
async function make_canvas (value_arry) {
  let bef_arry = obj.once_memory;
  for (let z = 0; z < value_arry.length; z++) {
    for (let y = 0; y < value_arry[z].length; y++) {
      for (let x = 0; x < value_arry[z][y].length; x++) {
        if (value_arry[z][y][x] !== bef_arry[z][y][x]) {
          let alt = value_arry[z][y][x];
          const targetX = x - lange;
          const targetY = y - lange;
          const targetZ = z - lange;
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
              materials = new THREE.MeshBasicMaterial({ map: cp_obj[alt].tex, transparent: true, opacity: 1});
            }
            else {
              materials = new THREE.MeshBasicMaterial({transparent: true, opacity: transparency});
            }
            const newCube = new THREE.Mesh(cubeGeometry, materials);
            newCube.position.copy(selectedCube.position);
            if (alt == 0) {
              if (
                (layer_slice[layer_id] === 'x' && x == select_layer) ||
                (layer_slice[layer_id] === 'y' && y == select_layer) ||
                (layer_slice[layer_id] === 'z' && z == select_layer)
              ) {
                scene.add(newCube);
              }
            } else {
              scene.add(newCube);
            }
            cubes[cubeIndex] = newCube;
            startAnimation();
            animationActive = false;
          }
        }
      }
    }
  }
}
function all_removeEventListener (e) {
  window.removeEventListener('mousemove', handleTouchMove, { passive: false });
  window.removeEventListener('mousemove', choose_fun, false);
  window.removeEventListener('mouseup', end_fun, false);
  window.removeEventListener('mouseup', rect_FirstUp);
  window.removeEventListener('mouseup', all_removeEventListener, false);
  window.removeEventListener('touchstart', handleTouchMove, { passive: false });
  window.removeEventListener('touchmove', handleTouchMove, { passive: false });
  window.removeEventListener('touchmove', choose_fun, false);
  window.removeEventListener('touchend', end_fun, false);
  window.removeEventListener('touchend', rect_FirstUp);
  window.removeEventListener('touchend', all_removeEventListener, false);
  animationActive = false;
  do_flag = true;
}
function get_picked_colorBox_from_id(id) {
  window.parent.$("#CP *").removeClass("check");
  window.parent.$("#" + id).addClass("check");
  //pick color display
  let obj_data = return_img_html_arry_rgb (id);
  window.parent.$('.palette .palette_button .selected_block_img, #CP_icons .selected_block_img').html(obj_data.html);
  window.parent.$('#CP_icons .rgb span.rgbR').text(obj_data.rgb[0]);
  window.parent.$('#CP_icons .rgb span.rgbG').text(obj_data.rgb[1]);
  window.parent.$('#CP_icons .rgb span.rgbB').text(obj_data.rgb[2]);
}
function color_dropper_icon(e) {
  all_removeEventListener ();
  if (isNaN(obj.start_x) || isNaN(obj.start_y) || isNaN(obj.start_z)) {
    return false;
  }
  let alt = obj.once_memory[obj.start_z][obj.start_y][obj.start_x];
  obj.once_memory = '';
  if (alt != 0) {
    let id = window.parent.$('#CP .CPimg img[alt="' + alt + '"]').parent().parent().attr('id');
    window.parent.$('#' + id + ' .CPimg img.mImg').removeClass('mImg');
    window.parent.$('#' + id + ' .CPimg img[alt="' + alt + '"]').addClass('mImg');
    get_picked_colorBox_from_id(id);
  }
}
function jump_to_this_layer(e) {
  all_removeEventListener ();
  if (isNaN(obj.start_x) || isNaN(obj.start_y) || isNaN(obj.start_z)) {
    return false;
  }
  // 線を消す
  cubes.forEach(cube => {
    cube.children.forEach(child => {
      if (child instanceof THREE.LineSegments) {
        cube.remove(child); // 赤い線を選択されたキューブから削除
      }
    });
  });

  // 選択キューブを検索
  const targetX = obj.start_x - lange;
  const targetY = obj.start_y - lange;
  const targetZ = obj.start_z - lange;
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
    // 境界線の描画
    const edges = new THREE.EdgesGeometry(cubeGeometry);
    const lineMaterialHighlight = new THREE.LineBasicMaterial({
      color: 0xff0000
    });
    const lineSegments = new THREE.LineSegments(edges, lineMaterialHighlight);
    lineSegments.position.set(0, 0, 0); //境界線のずれなし
    selectedCube.add(lineSegments); // cube の子要素として追加する

    focus_point[0] = obj.start_x;
    focus_point[1] = obj.start_y;
    focus_point[2] = obj.start_z;
    startAnimation();
    animationActive = false;
  }
}
function end_fun (e) {
  if (
    typeof obj.end_x === 'number' &&
    typeof obj.end_y === 'number' &&
    typeof obj.end_z === 'number'
  ) {
    if (obj.want_if === 'stroke_path_with_line') {
      if (roll_back_obj.tableP.length <= 0) {
        roll_back_obj.tableP.push({x: obj.start_x, y: obj.start_y, z: obj.start_z});
      }
      roll_back_obj.tableP.push({x: obj.end_x, y: obj.end_y, z: obj.end_z});
      roll_back_obj.c_one_time = 0;
    }
    add_canvas_to_roll_back_obj (obj.change_cubes);
    const iframeVariable = 'check_view';
    window.parent.postMessage({ iframeVariable }, '*');
  }
  else if (obj.want_if === 'fill_tool_of_paint_roller' || obj.want_if === 'area_cut_tool_of_scissors') {
    add_canvas_to_roll_back_obj (obj.change_cubes);
    const iframeVariable = 'check_view';
    window.parent.postMessage({ iframeVariable }, '*');
  }
  $.each(obj, function(index, value) {
    obj[index] = '';
  });
  all_removeEventListener ();
}
function pen_tool (e) {
  let alt = window.parent.$("#CP label.check .CPimg").find('img.mImg').attr('alt');
  let mx,my;
  if (obj.use === 'mouse') {
    mx = e.clientX;
    my = e.clientY;
  }
  if (obj.use === 'touch') {
    mx = e.touches[0].clientX;
    my = e.touches[0].clientY;
  }
  mouse.x = ((mx + window.scrollX) / canvasWidth) * 2 - 1;
  mouse.y = -((my + window.scrollY) / canvasHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    const selectedCube = intersects[0].object;
    const cubeIndex = cubes.indexOf(selectedCube);
    if (cubeIndex !== -1 && alt !== undefined) {
      obj.end_x = Math.round(selectedCube.position.x) / cubeSize + lange;
      obj.end_y = Math.round(selectedCube.position.y) / cubeSize + lange;
      obj.end_z = Math.round(selectedCube.position.z) / cubeSize + lange;
      if (
        (layer_slice[layer_id] === 'x' && obj.end_x == select_layer) ||
        (layer_slice[layer_id] === 'y' && obj.end_y == select_layer) ||
        (layer_slice[layer_id] === 'z' && obj.end_z == select_layer)
      ){
        scene.remove(selectedCube);
        if (obj.want_if === 'pen_tool') {
          materials = new THREE.MeshBasicMaterial({map: cp_obj[alt].tex, transparent: true, opacity: 1});
        }
        if (obj.want_if === 'eraser_points_tool') {
          alt = 0;
          materials = new THREE.MeshBasicMaterial({transparent: true, opacity: transparency});
        }
        const newCube = new THREE.Mesh(cubeGeometry, materials);
        newCube.position.copy(selectedCube.position);
        scene.add(newCube);
        cubes[cubeIndex] = newCube;
        obj.change_cubes[obj.end_z][obj.end_y][obj.end_x] = alt;
      }
    }
  }
}
function same_area_search (x, y, z, change_alt, base_alt) {
  return new Promise((resolve, reject) => {
    count++
    if (count >= 1500) {
      array_match_cell = [];
      resolve(true);
    }
    let number = 1;
    let next_cell = [];
    if (layer_slice[layer_id] === 'x') {
      next_cell = [
        {x: x, y: y - number, z: z},
        {x: x, y: y, z: z - number},
        {x: x, y: y + number, z: z},
        {x: x, y: y, z: z + number},
      ];
    }
    if (layer_slice[layer_id] === 'y') {
      next_cell = [
        {x: x, y: y, z: z - number},
        {x: x - number, y: y, z: z},
        {x: x, y: y, z: z + number},
        {x: x + number, y: y, z: z},
      ];
    }
    if (layer_slice[layer_id] === 'z') {
      next_cell = [
        {x: x, y: y - number, z: z},
        {x: x - number, y: y, z: z},
        {x: x, y: y + number, z: z},
        {x: x + number, y: y, z: z},
      ];
    }
    obj.change_cubes[z][y][x] = change_alt;
    let xy_obj = {x: x, y: y, z: z};
    let key = array_match_cell.findIndex(obj => obj.x === xy_obj.x && obj.y === xy_obj.y && obj.z === xy_obj.z);
    while (key >= 0) {
      array_match_cell.splice(key, 1);
      key = array_match_cell.indexOf(xy_obj);
    }
    let next = 0;
    for (let i = 0; i < next_cell.length; i++) {
      if (
        obj.change_cubes[next_cell[i].z] === undefined ||
        obj.change_cubes[next_cell[i].z][next_cell[i].y] === undefined ||
        obj.change_cubes[next_cell[i].z][next_cell[i].y][next_cell[i].x] === undefined
      ) {
        continue;
      }
      let target_alt = obj.change_cubes[next_cell[i].z][next_cell[i].y][next_cell[i].x];
      if (next > 2) {
        break;
      }
      if (target_alt === base_alt) {
        let new_obj = next_cell[i];
        if (array_match_cell.findIndex(obj => obj.x === new_obj.x && obj.y === new_obj.y && obj.z === new_obj.z) < 0) {
          array_match_cell.push(new_obj);
        }
        next++;
        continue;
      }
      if (target_alt !== base_alt) {
        continue;
      }
    }
    if (array_match_cell.length) {
      let next_xy_obj = array_match_cell.pop();
      same_area_search (next_xy_obj.x, next_xy_obj.y, next_xy_obj.z, change_alt, base_alt);
    }
    if (!array_match_cell.length) {
      resolve(true);
    }
  });
}
async function fill_tool_of_paint_roller(e) {
  if (
    isNaN(obj.start_x) ||
    isNaN(obj.start_y) ||
    isNaN(obj.start_z) ||
    (layer_slice[layer_id] === 'x' && obj.start_x != select_layer) ||
    (layer_slice[layer_id] === 'y' && obj.start_y != select_layer) ||
    (layer_slice[layer_id] === 'z' && obj.start_z != select_layer)
  ){
    all_removeEventListener ();
    $('html').css('cursor', 'default');
    return false;
  }
  let change_alt = window.parent.$("#CP label.check .CPimg").find('img.mImg').attr('alt');
  if (obj.want_if === 'area_cut_tool_of_scissors') {
    change_alt = 0;
  }
  let base_alt = obj.once_memory[obj.start_z][obj.start_y][obj.start_x];
  count = 0;
  try {
    const result = await same_area_search (obj.start_x, obj.start_y, obj.start_z, change_alt, base_alt);
    if (result) {
      await make_canvas (obj.change_cubes);
      end_fun();
    }
    all_removeEventListener ();
    $('html').css('cursor', 'default');
  } catch (error) {
    all_removeEventListener ();
    $('html').css('cursor', 'default');
  }
}
function calculateDistanceAngle(x1, y1, z1, x2, y2, z2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let dz = z2 - z1;
  // 距離を計算
  let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  let distanceXY = Math.sqrt(dx * dx + dy * dy);
  let distanceXZ = Math.sqrt(dx * dx + dz * dz);
  let distanceYZ = Math.sqrt(dy * dy + dz * dz);
  // 角度を計算
  let angleRadiansXY = Math.atan2(dy, dx);
  if (angleRadiansXY < 0) {
    angleRadiansXY += 2 * Math.PI;
  }
  let angleRadiansXZ = Math.atan2(dz, dx);
  if (angleRadiansXZ < 0) {
    angleRadiansXZ += 2 * Math.PI;
  }
  let angleRadiansYZ = Math.atan2(dz, dy);
  if (angleRadiansYZ < 0) {
    angleRadiansYZ += 2 * Math.PI;
  }
  return {
    dis: distance,
    disXY: distanceXY,
    disXZ: distanceXZ,
    disYZ: distanceYZ,
    angleXY: angleRadiansXY,
    angleXZ: angleRadiansXZ,
    angleYZ: angleRadiansYZ
  };
}
function fix_to_startImg(e) {
  for (let z = 0; z < obj.once_memory.length; z++) {
    for (let y = 0; y < obj.once_memory[z].length; y++) {
      for (let x = 0; x < obj.once_memory[z][y].length; x++) {
        const baseEle = obj.once_memory[z][y][x];
        const targetEle = obj.change_cubes[z][y][x];
        if (baseEle !== targetEle) {
          const targetX = x - lange;
          const targetY = y - lange;
          const targetZ = z - lange;
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
            if (baseEle != 0) {
              materials = new THREE.MeshBasicMaterial({ map: cp_obj[baseEle].tex, transparent: true, opacity: 1});
            }
            else {
              materials = new THREE.MeshBasicMaterial({transparent: true, opacity: transparency});
            }
            const newCube = new THREE.Mesh(cubeGeometry, materials);
            newCube.position.copy(selectedCube.position);
            if (baseEle == 0) {
              if (
                (layer_slice[layer_id] === 'x' && x == select_layer) ||
                (layer_slice[layer_id] === 'y' && y == select_layer) ||
                (layer_slice[layer_id] === 'z' && z == select_layer)
              ) {
                scene.add(newCube);
              }
            }
            else {
              scene.add(newCube);
            }
            cubes[cubeIndex] = newCube;
            obj.change_cubes[z][y][x] = baseEle;
          }
        }
      }
    }
  }
}
function change_to_drawImg (x,y,z,alt) {
  if (
    obj.once_memory[z] !== undefined &&
    obj.once_memory[z][y] !== undefined &&
    obj.once_memory[z][y][x] !== undefined
  ) {
    const targetX = x - lange;
    const targetY = y - lange;
    const targetZ = z - lange;
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
      if (alt == 0) {
        materials = new THREE.MeshBasicMaterial({transparent: true, opacity: transparency});
      }
      else {
        materials = new THREE.MeshBasicMaterial({ map: cp_obj[alt].tex, transparent: true, opacity: 1});
      }
      if (
        (layer_slice[layer_id] === 'x' && x == select_layer) ||
        (layer_slice[layer_id] === 'y' && y == select_layer) ||
        (layer_slice[layer_id] === 'z' && z == select_layer)
      ) {
        scene.remove(selectedCube);
        const newCube = new THREE.Mesh(cubeGeometry, materials);
        newCube.position.copy(selectedCube.position);
        scene.add(newCube);
        cubes[cubeIndex] = newCube;
        obj.change_cubes[z][y][x] = alt;
      }
    }
  }
}
function stroke_straight_path_with_line(e) {
  if (roll_back_obj.tableP.length > 0) {
    let xy_obj = roll_back_obj.tableP[roll_back_obj.tableP.length - 1];
    obj.start_x = xy_obj.x;
    obj.start_y = xy_obj.y;
    obj.start_z = xy_obj.z;
  }
  let mx,my;
  if (obj.use === 'mouse') {
    mx = e.clientX;
    my = e.clientY;
  }
  if (obj.use === 'touch') {
    mx = e.touches[0].clientX;
    my = e.touches[0].clientY;
  }
  mouse.x = ((mx + window.scrollX) / canvasWidth) * 2 - 1;
  mouse.y = -((my + window.scrollY) / canvasHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    const selectedCube = intersects[0].object;
    const cubeIndex = cubes.indexOf(selectedCube);
    if (cubeIndex !== -1) {
      obj.end_x = Math.round(selectedCube.position.x) / cubeSize + lange;
      obj.end_y = Math.round(selectedCube.position.y) / cubeSize + lange;
      obj.end_z = Math.round(selectedCube.position.z) / cubeSize + lange;
      let data = calculateDistanceAngle(obj.start_x, obj.start_y, obj.start_z, obj.end_x, obj.end_y, obj.end_z);
      let alt = window.parent.$("#CP label.check .CPimg").find('img.mImg').attr('alt');
      fix_to_startImg();
      if (
        (layer_slice[layer_id] === 'x' && obj.end_x == select_layer) ||
        (layer_slice[layer_id] === 'y' && obj.end_y == select_layer) ||
        (layer_slice[layer_id] === 'z' && obj.end_z == select_layer)
      ) {
        if (window.parent.$('#for_cut_area').prop('checked') || alt === undefined) {
          alt = 0;
        }
        if (!event.ctrlKey && event.shiftKey) {
          data.angleXY = roundToNearest45(data.angleXY);
          data.angleYZ = roundToNearest45(data.angleYZ);
          data.angleXZ = roundToNearest45(data.angleXZ);
          if (layer_slice[layer_id] === 'x') {
            obj.end_y = obj.start_y + Math.round((data.disYZ / data.dis) * data.dis * Math.cos(data.angleYZ));
            obj.end_z = obj.start_z + Math.round((data.disYZ / data.dis) * data.dis * Math.sin(data.angleYZ));
          }
          if (layer_slice[layer_id] === 'y') {
            obj.end_x = obj.start_x + Math.round((data.disXZ / data.dis) * data.dis * Math.cos(data.angleXZ));
            obj.end_z = obj.start_z + Math.round((data.disXZ / data.dis) * data.dis * Math.sin(data.angleXZ));
          }
          if (layer_slice[layer_id] === 'z') {
            obj.end_x = obj.start_x + Math.round((data.disXY / data.dis) * data.dis * Math.cos(data.angleXY));
            obj.end_y = obj.start_y + Math.round((data.disXY / data.dis) * data.dis * Math.sin(data.angleXY));
          }
        }
        for (let i = 0; i < data.dis; i++) {
          let x = obj.start_x + Math.round((data.disXY / data.dis) * i * Math.cos(data.angleXY));
          let y = obj.start_y + Math.round((data.disXY / data.dis) * i * Math.sin(data.angleXY));
          let z = obj.start_z + Math.round((data.disXZ / data.dis) * i * Math.sin(data.angleXZ));
          if (!event.ctrlKey && event.shiftKey) {
            if (layer_slice[layer_id] === 'x') {
              y = obj.start_y + Math.round((data.disYZ / data.dis) * i * Math.cos(data.angleYZ));
              z = obj.start_z + Math.round((data.disYZ / data.dis) * i * Math.sin(data.angleYZ));
            }
            if (layer_slice[layer_id] === 'y') {
              x = obj.start_x + Math.round((data.disXZ / data.dis) * i * Math.cos(data.angleXZ));
              z = obj.start_z + Math.round((data.disXZ / data.dis) * i * Math.sin(data.angleXZ));
            }
            if (layer_slice[layer_id] === 'z') {
              x = obj.start_x + Math.round((data.disXY / data.dis) * i * Math.cos(data.angleXY));
              y = obj.start_y + Math.round((data.disXY / data.dis) * i * Math.sin(data.angleXY));
            }
          }
          change_to_drawImg(x, y, z, alt);
        }
      }
    }
  }
}
function stroke_path_with_rect(e) {
  let mx,my;
  if (obj.use === 'mouse') {
    mx = e.clientX;
    my = e.clientY;
  }
  if (obj.use === 'touch') {
    mx = e.touches[0].clientX;
    my = e.touches[0].clientY;
  }
  mouse.x = ((mx + window.scrollX) / canvasWidth) * 2 - 1;
  mouse.y = -((my + window.scrollY) / canvasHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    const selectedCube = intersects[0].object;
    const cubeIndex = cubes.indexOf(selectedCube);
    if (cubeIndex !== -1) {
      obj.end_x = Math.round(selectedCube.position.x) / cubeSize + lange;
      obj.end_y = Math.round(selectedCube.position.y) / cubeSize + lange;
      obj.end_z = Math.round(selectedCube.position.z) / cubeSize + lange;
      let data = calculateDistanceAngle(obj.start_x, obj.start_y, obj.start_z, obj.end_x, obj.end_y, obj.end_z);
      let alt = window.parent.$("#CP label.check .CPimg").find('img.mImg').attr('alt');
      fix_to_startImg();
      if (window.parent.$('#for_cut_area').prop('checked') || alt === undefined) {
        alt = 0;
      }
      for (let i = 0; i < data.dis; i++) {
        let x = obj.start_x + Math.round((data.disXY / data.dis) * i * Math.cos(data.angleXY));
        let y = obj.start_y + Math.round((data.disXY / data.dis) * i * Math.sin(data.angleXY));
        let z = obj.start_z + Math.round((data.disXZ / data.dis) * i * Math.sin(data.angleXZ));
        if (layer_slice[layer_id] === 'x') {
          x = select_layer;
          for (let j = 0; j < data.dis; j++) {
            y = obj.start_y + Math.round((data.disXY / data.dis) * j * Math.sin(data.angleXY));
            if (window.parent.$('#for_path_area').prop('checked')) {
              if (i > 0 && i < data.dis - 1 && j > 0 && j < data.dis - 1) {
                continue;
              }
              change_to_drawImg (x,y,z,alt);
            } else {
              change_to_drawImg (x,y,z,alt);
            }
          }
        }
        if (layer_slice[layer_id] === 'y') {
          y = select_layer;
          for (let j = 0; j < data.dis; j++) {
            z = obj.start_z + Math.round((data.disXZ / data.dis) * j * Math.sin(data.angleXZ));
            if (window.parent.$('#for_path_area').prop('checked')) {
              if (i > 0 && i < data.dis - 1 && j > 0 && j < data.dis - 1) {
                continue;
              }
              change_to_drawImg (x,y,z,alt);
            } else {
              change_to_drawImg (x,y,z,alt);
            }
          }
        }
        if (layer_slice[layer_id] === 'z') {
          z = select_layer;
          for (let j = 0; j < data.dis; j++) {
            y = obj.start_y + Math.round((data.disXY / data.dis) * j * Math.sin(data.angleXY));
            if (window.parent.$('#for_path_area').prop('checked')) {
              if (i > 0 && i < data.dis - 1 && j > 0 && j < data.dis - 1) {
                continue;
              }
              change_to_drawImg (x,y,z,alt);
            } else {
              change_to_drawImg (x,y,z,alt);
            }
          }
        }
      }
    }
  }
}
function stroke_path_with_arc(e) {
  let mx,my;
  if (obj.use === 'mouse') {
    mx = e.clientX;
    my = e.clientY;
  }
  if (obj.use === 'touch') {
    mx = e.touches[0].clientX;
    my = e.touches[0].clientY;
  }
  mouse.x = ((mx + window.scrollX) / canvasWidth) * 2 - 1;
  mouse.y = -((my + window.scrollY) / canvasHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    const selectedCube = intersects[0].object;
    const cubeIndex = cubes.indexOf(selectedCube);
    if (cubeIndex !== -1) {
      obj.end_x = Math.round(selectedCube.position.x) / cubeSize + lange;
      obj.end_y = Math.round(selectedCube.position.y) / cubeSize + lange;
      obj.end_z = Math.round(selectedCube.position.z) / cubeSize + lange;
      let data = calculateDistanceAngle(obj.start_x, obj.start_y, obj.start_z, obj.end_x, obj.end_y, obj.end_z);
      let alt = window.parent.$("#CP label.check .CPimg").find('img.mImg').attr('alt');
      fix_to_startImg();
      if (window.parent.$('#for_cut_area').prop('checked') || alt === undefined) {
        alt = 0;
      }
      const numPoints = 8;
      if (!window.parent.$('#for_path_area').prop('checked')) {
        change_to_drawImg (obj.start_x, obj.start_y, obj.start_z,alt);
      }
      for (let i = 0; i < data.dis; i++) {
        let x = obj.start_x + Math.round((data.disXY / data.dis) * i * Math.cos(data.angleXY));
        let y = obj.start_y + Math.round((data.disXY / data.dis) * i * Math.sin(data.angleXY));
        let z = obj.start_z + Math.round((data.disXZ / data.dis) * i * Math.sin(data.angleXZ));
        if (layer_slice[layer_id] === 'x') {
          x = select_layer;
          for (let j = 0; j < numPoints * 2 * i; j++) {
            const angle = (j / (numPoints * 2 * i)) * 2 * Math.PI;
            y = obj.start_y + Math.round((data.disYZ / data.dis) * i * Math.sin(angle));
            z = obj.start_z + Math.round((data.disYZ / data.dis) * i * Math.cos(angle));
            if (window.parent.$('#for_path_area').prop('checked')) {
              if (i >= 0 && i < data.dis - 1) {
                continue;
              }
              change_to_drawImg (x,y,z,alt);
            } else {
              change_to_drawImg (x,y,z,alt);
            }
          }
        }
        if (layer_slice[layer_id] === 'y') {
          y = select_layer;
          for (let j = 0; j < numPoints * 2 * i; j++) {
            const angle = (j / (numPoints * 2 * i)) * 2 * Math.PI;
            x = obj.start_x + Math.round((data.disXZ / data.dis) * i * Math.cos(angle));
            z = obj.start_z + Math.round((data.disXZ / data.dis) * i * Math.sin(angle));
            if (window.parent.$('#for_path_area').prop('checked')) {
              if (i >= 0 && i < data.dis - 1) {
                continue;
              }
              change_to_drawImg (x,y,z,alt);
            } else {
              change_to_drawImg (x,y,z,alt);
            }
          }
        }
        if (layer_slice[layer_id] === 'z') {
          z = select_layer;
          for (let j = 0; j < numPoints * 2 * i; j++) {
            const angle = (j / (numPoints * 2 * i)) * 2 * Math.PI;
            x = obj.start_x + Math.round((data.disXY / data.dis) * i * Math.cos(angle));
            y = obj.start_y + Math.round((data.disXY / data.dis) * i * Math.sin(angle));
            if (window.parent.$('#for_path_area').prop('checked')) {
              if (i >= 0 && i < data.dis - 1) {
                continue;
              }
              change_to_drawImg (x,y,z,alt);
            } else {
              change_to_drawImg (x,y,z,alt);
            }
          }
        }
      }
    }
  }
}
function rect_FirstUp(e) {
  slc.classList.add('hidden');
  if (typeof obj.end_x === 'number' && typeof obj.end_y === 'number') {
    let top = Math.min(obj.start_y, obj.end_y);
    let left = Math.min(obj.start_x, obj.end_x);
    let w = Math.abs(obj.start_x - obj.end_x);
    let h = Math.abs(obj.start_y - obj.end_y);
    let center_top = top + Math.round(h / 2);
    let center_left = left + Math.round(w / 2);
    obj.copy_img = {arry: [], basis: [0, 0]};
    let done = [];
    for (let i = 0; i <= h; i++) {
      for (let j = 0; j <= w; j++) {
        mouse.x = ((left + j + window.scrollX) / canvasWidth) * 2 - 1;
        mouse.y = -((top + i + window.scrollY) / canvasHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length > 0) {
          for (let k = 0; k < intersects.length; k++) {
            const selectedCube = intersects[k].object;
            const cubeIndex = cubes.indexOf(selectedCube);
            const doneIndex = done.indexOf(selectedCube);
            done.push(selectedCube);
            if (cubeIndex !== -1 && doneIndex == -1) {
              const targetCube = cubes[cubeIndex];
              let x = Math.round(targetCube.position.x) / cubeSize + lange;
              let y = Math.round(targetCube.position.y) / cubeSize + lange;
              let z = Math.round(targetCube.position.z) / cubeSize + lange;
              let alt = obj.once_memory[z][y][x];
              if (layer_slice[layer_id] === 'x' && x == select_layer) {
                if (!obj.copy_img.arry[z]) {
                  obj.copy_img.arry[z] = [];
                }
                obj.copy_img.arry[z][y] = alt;
                obj.copy_img.basis[0] = Math.max(obj.copy_img.basis[0], y);
                obj.copy_img.basis[1] = Math.max(obj.copy_img.basis[1], z);
                if (window.parent.$('#for_cut_area').prop('checked')) {
                  obj.change_cubes[z][y][x] = 0;
                }
              }
              if (layer_slice[layer_id] === 'y' && y == select_layer) {
                if (!obj.copy_img.arry[z]) {
                  obj.copy_img.arry[z] = [];
                }
                obj.copy_img.arry[z][x] = alt;
                obj.copy_img.basis[0] = Math.max(obj.copy_img.basis[0], x);
                obj.copy_img.basis[1] = Math.max(obj.copy_img.basis[1], z);
                if (window.parent.$('#for_cut_area').prop('checked')) {
                  obj.change_cubes[z][y][x] = 0;
                }
              }
              if (layer_slice[layer_id] === 'z' && z == select_layer) {
                if (!obj.copy_img.arry[y]) {
                  obj.copy_img.arry[y] = [];
                }
                obj.copy_img.arry[y][x] = alt;
                obj.copy_img.basis[0] = Math.max(obj.copy_img.basis[0], x);
                obj.copy_img.basis[1] = Math.max(obj.copy_img.basis[1], y);
                if (window.parent.$('#for_cut_area').prop('checked')) {
                  obj.change_cubes[z][y][x] = 0;
                }
              }
            }
          }
        }
      }
    }
    if (window.parent.$('#for_cut_area').prop('checked')) {
      make_canvas (obj.change_cubes);
      add_canvas_to_roll_back_obj (obj.change_cubes);
      const iframeVariable = 'check_view';
      window.parent.postMessage({ iframeVariable }, '*');
    }
    obj.copy_img.arry = obj.copy_img.arry.filter(row => row.some(val => val !== undefined));
    let columnStart = obj.copy_img.arry[0].length;
    let columnEnd = obj.copy_img.arry[0].length;
    for (let i = 0; i < obj.copy_img.arry.length; i++) {
      columnEnd = Math.max(columnEnd, obj.copy_img.arry[i].length);
      columnStart = Math.min(columnStart, obj.copy_img.arry[i].findIndex(val => val !== undefined) || columnStart);
    }
    for (let i = 0; i < obj.copy_img.arry.length; i++) {
      while (obj.copy_img.arry[i].length < columnEnd) {
        obj.copy_img.arry[i].push(undefined);
      }
      obj.copy_img.arry[i] = obj.copy_img.arry[i].slice(columnStart);
    }
    all_removeEventListener ();
  }
}
function copy_area_with_rect(e) {
  if (obj.use === 'mouse') {
    obj.end_x = e.clientX;
    obj.end_y = e.clientY;
  }
  if (obj.use === 'touch') {
    obj.end_x = e.touches[0].clientX;
    obj.end_y = e.touches[0].clientY;
  }
  if (obj.copy_img === '') {
    let top = Math.min(obj.start_y, obj.end_y);
    let left = Math.min(obj.start_x, obj.end_x);
    let w = Math.abs(obj.start_x - obj.end_x);
    let h = Math.abs(obj.start_y - obj.end_y);
    slctx.putImageData(obj.start_img, 0, 0);
    slctx.strokeRect(left, top, w, h);
    window.addEventListener('mouseup', rect_FirstUp);
    window.addEventListener('touchend', rect_FirstUp);
    return false;
  }
  if (obj.copy_img !== '') {
    let mx,my;
    if (obj.use === 'mouse') {
      mx = e.clientX;
      my = e.clientY;
    }
    if (obj.use === 'touch') {
      mx = e.touches[0].clientX;
      my = e.touches[0].clientY;
    }
    mouse.x = ((mx + window.scrollX) / canvasWidth) * 2 - 1;
    mouse.y = -((my + window.scrollY) / canvasHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      const selectedCube = intersects[0].object;
      const cubeIndex = cubes.indexOf(selectedCube);
      if (cubeIndex !== -1) {
        obj.end_x = Math.round(selectedCube.position.x) / cubeSize + lange;
        obj.end_y = Math.round(selectedCube.position.y) / cubeSize + lange;
        obj.end_z = Math.round(selectedCube.position.z) / cubeSize + lange;
        fix_to_startImg();
        count = 0;
        let w = obj.copy_img.arry[0].length;
        let h = obj.copy_img.arry.length;
        if (obj.want_if === 'copy_area_with_rect') {
          if (layer_slice[layer_id] === 'x') {
            if (!event.ctrlKey && event.shiftKey) {
              let centerY = obj.copy_img.basis[0] - w / 2;
              let centerZ = obj.copy_img.basis[1] - h / 2;
              let gapY = Math.abs(obj.end_y - centerY);
              let gapZ = Math.abs(obj.end_z - centerZ);
              if (gapY < gapZ) {
                obj.end_y = centerY;
              }
              else {
                obj.end_z = centerZ;
              }
            }
            for (let z = 0; z < obj.copy_img.arry.length; z++) {
              for (let y = 0; y < obj.copy_img.arry[z].length; y++) {
                if (obj.copy_img.arry[z][y] === undefined) {
                  continue;
                }
                count++;
                if (count >= 17000) {
                  break;
                }
                let alt = obj.copy_img.arry[z][y];
                let cubeX = select_layer;
                let cubeY = Math.round(y + obj.end_y - w / 2);
                let cubeZ = Math.round(z + obj.end_z - h / 2);
                if (window.parent.$('#for_horizontal_flip').prop('checked')) {
                  cubeZ = Math.round(-z + obj.end_z + h / 2);
                }
                if (window.parent.$('#for_vertical_flip').prop('checked')) {
                  cubeY = Math.round(-y + obj.end_y + w / 2);
                }
                change_to_drawImg (cubeX,cubeY,cubeZ,alt);
              }
            }
          }
          if (layer_slice[layer_id] === 'y') {
            if (!event.ctrlKey && event.shiftKey) {
              let centerX = obj.copy_img.basis[0] - w / 2;
              let centerZ = obj.copy_img.basis[1] - h / 2;
              let gapX = Math.abs(obj.end_x - centerX);
              let gapZ = Math.abs(obj.end_z - centerZ);
              if (gapX < gapZ) {
                obj.end_x = centerX;
              }
              else {
                obj.end_z = centerZ;
              }
            }
            for (let z = 0; z < obj.copy_img.arry.length; z++) {
              for (let x = 0; x < obj.copy_img.arry[z].length; x++) {
                if (obj.copy_img.arry[z][x] === undefined) {
                  continue;
                }
                count++;
                if (count >= 17000) {
                  break;
                }
                let alt = obj.copy_img.arry[z][x];
                let cubeX = Math.round(x + obj.end_x - w / 2);
                let cubeY = select_layer;
                let cubeZ = Math.round(z + obj.end_z - h / 2);
                if (window.parent.$('#for_horizontal_flip').prop('checked')) {
                  cubeX = Math.round(-x + obj.end_x + w / 2);
                }
                if (window.parent.$('#for_vertical_flip').prop('checked')) {
                  cubeZ = Math.round(-z + obj.end_z + h / 2);
                }
                change_to_drawImg (cubeX,cubeY,cubeZ,alt);
              }
            }
          }
          if (layer_slice[layer_id] === 'z') {
            if (!event.ctrlKey && event.shiftKey) {
              let centerX = obj.copy_img.basis[0] - w / 2;
              let centerY = obj.copy_img.basis[1] - h / 2;
              let gapX = Math.abs(obj.end_x - centerX);
              let gapY = Math.abs(obj.end_y - centerY);
              if (gapX < gapY) {
                obj.end_x = centerX;
              }
              else {
                obj.end_y = centerY;
              }
            }
            for (let y = 0; y < obj.copy_img.arry.length; y++) {
              for (let x = 0; x < obj.copy_img.arry[y].length; x++) {
                if (obj.copy_img.arry[y][x] === undefined) {
                  continue;
                }
                count++;
                if (count >= 17000) {
                  break;
                }
                let alt = obj.copy_img.arry[y][x];
                let cubeX = Math.round(x + obj.end_x - w / 2);
                let cubeY = Math.round(y + obj.end_y - h / 2);
                let cubeZ = select_layer;
                if (window.parent.$('#for_horizontal_flip').prop('checked')) {
                  cubeX = Math.round(-x + obj.end_x + w / 2);
                }
                if (window.parent.$('#for_vertical_flip').prop('checked')) {
                  cubeY = Math.round(-y + obj.end_y + h / 2);
                }
                change_to_drawImg (cubeX,cubeY,cubeZ,alt);
              }
            }
          }
        }
        if (obj.want_if === 'resize_area_with_rect') {
          if (layer_slice[layer_id] === 'x') {
            let cubeX = select_layer;
            let centerY = obj.copy_img.basis[0] - w / 2;
            let centerZ = obj.copy_img.basis[1] - h / 2;
            let data = calculateDistanceAngle(cubeX, centerY, centerZ, cubeX, obj.end_y, obj.end_z);
            let baseData = calculateDistanceAngle(0, centerY, centerZ, 0, obj.copy_img.basis[0] - w, obj.copy_img.basis[1]);
            for (let i = -data.dis; i <= data.dis; i++) {
              let cubeZ = Math.round(centerZ + (data.disYZ / data.dis) * i * Math.sin(data.angleYZ));
              if (!event.ctrlKey && event.shiftKey) {
                cubeZ = Math.round(centerZ + (data.disYZ / data.dis) * i * Math.sin(baseData.angleYZ) * Math.sign(Math.sin(data.angleYZ)));
              }
              let z = Math.round(h / 2 + (baseData.disYZ / data.dis) * i * Math.sin(baseData.angleYZ));
              for (let j = -data.dis; j <= data.dis; j++) {
                let cubeY = Math.round(centerY + (data.disYZ / data.dis) * j * Math.cos(data.angleYZ));
                if (!event.ctrlKey && event.shiftKey) {
                  cubeY = Math.round(centerY - (data.disYZ / data.dis) * j * Math.cos(baseData.angleYZ) * Math.sign(Math.cos(data.angleYZ)));
                }
                let y = Math.round(w / 2 + (baseData.disYZ / data.dis) * j * Math.cos(baseData.angleYZ));
                let alt = 0;
                if (y >= 0 && y < w && z >= 0 && z < h) {
                  if (obj.copy_img.arry[z][y] === undefined) {
                    continue;
                  }
                  count++;
                  if (count >= 17000) {
                    break;
                  }
                  alt = obj.copy_img.arry[z][y];
                }
                else {
                  continue;
                }
                change_to_drawImg (cubeX,cubeY,cubeZ,alt);
              }
            }
          }
          if (layer_slice[layer_id] === 'y') {
            let centerX = obj.copy_img.basis[0] - w / 2;
            let cubeY = select_layer;
            let centerZ = obj.copy_img.basis[1] - h / 2;
            let data = calculateDistanceAngle(centerX, cubeY, centerZ, obj.end_x, cubeY, obj.end_z);
            let baseData = calculateDistanceAngle(centerX, 0, centerZ, obj.copy_img.basis[0], 0, obj.copy_img.basis[1]);
            for (let i = -data.dis; i <= data.dis; i++) {
              let cubeZ = Math.round(centerZ + (data.disXZ / data.dis) * i * Math.sin(data.angleXZ));
              if (!event.ctrlKey && event.shiftKey) {
                cubeZ = Math.round(centerZ + (data.disXZ / data.dis) * i * Math.sin(baseData.angleXZ) * Math.sign(Math.sin(data.angleXZ)));
              }
              let z = Math.round(h / 2 + (baseData.disXZ / data.dis) * i * Math.sin(baseData.angleXZ));
              for (let j = -data.dis; j <= data.dis; j++) {
                let cubeX = Math.round(centerX + (data.disXZ / data.dis) * j * Math.cos(data.angleXZ));
                if (!event.ctrlKey && event.shiftKey) {
                  cubeX = Math.round(centerX + (data.disXZ / data.dis) * j * Math.cos(baseData.angleXZ) * Math.sign(Math.cos(data.angleXZ)));
                }
                let x = Math.round(w / 2 + (baseData.disXZ / data.dis) * j * Math.cos(baseData.angleXZ));
                let alt = 0;
                if (x >= 0 && x < w && z >= 0 && z < h) {
                  if (obj.copy_img.arry[z][x] === undefined) {
                    continue;
                  }
                  count++;
                  if (count >= 17000) {
                    break;
                  }
                  alt = obj.copy_img.arry[z][x];
                }
                else {
                  continue;
                }
                change_to_drawImg (cubeX,cubeY,cubeZ,alt);
              }
            }
          }
          if (layer_slice[layer_id] === 'z') {
            let centerX = obj.copy_img.basis[0] - w / 2;
            let centerY = obj.copy_img.basis[1] - h / 2;
            let cubeZ = select_layer;
            let data = calculateDistanceAngle(centerX, centerY, cubeZ, obj.end_x, obj.end_y, cubeZ);
            let baseData = calculateDistanceAngle(centerX, centerY, 0, obj.copy_img.basis[0], obj.copy_img.basis[1] - h, 0);
            for (let i = -data.dis; i <= data.dis; i++) {
              let cubeX = Math.round(centerX + (data.disXY / data.dis) * i * Math.cos(data.angleXY));
              if (!event.ctrlKey && event.shiftKey) {
                cubeX = Math.round(centerX + (data.disXY / data.dis) * i * Math.cos(baseData.angleXY) * Math.sign(Math.cos(data.angleXY)));
              }
              let x = Math.round(w / 2 + (baseData.disXY / data.dis) * i * Math.cos(baseData.angleXY));
              for (let j = -data.dis; j <= data.dis; j++) {
                let cubeY = Math.round(centerY + (data.disXY / data.dis) * j * Math.sin(data.angleXY));
                if (!event.ctrlKey && event.shiftKey) {
                  cubeY = Math.round(centerY - (data.disXY / data.dis) * j * Math.sin(baseData.angleXY) * Math.sign(Math.sin(data.angleXY)));
                }
                let y = Math.round(h / 2 + (baseData.disXY / data.dis) * j * Math.sin(baseData.angleXY));
                let alt = 0;
                if (x >= 0 && x < w && y >= 0 && y < h) {
                  if (obj.copy_img.arry[y][x] === undefined) {
                    continue;
                  }
                  count++;
                  if (count >= 17000) {
                    break;
                  }
                  alt = obj.copy_img.arry[y][x];
                }
                else {
                  continue;
                }
                change_to_drawImg (cubeX,cubeY,cubeZ,alt);
              }
            }
          }
        }
        if (obj.want_if === 'roll_area_with_rect') {
          const numPoints = 8;
          if (layer_slice[layer_id] === 'x') {
            let cubeX = select_layer;
            let centerY = obj.copy_img.basis[0] - w / 2;
            let centerZ = obj.copy_img.basis[1] - h / 2;
            let data = calculateDistanceAngle(cubeX, centerY, centerZ, cubeX, obj.end_y, obj.end_z);
            let baseData = calculateDistanceAngle(0, centerY, centerZ, 0, obj.copy_img.basis[0] - w, obj.copy_img.basis[1]);
            for (let i = 0; i < baseData.dis; i++) {
              for (let j = 0; j < numPoints * 2 * i; j++) {
                const angle = (j / (numPoints * 2 * i)) * 2 * Math.PI;
                let y = Math.round(w / 2 + i * Math.cos(angle));
                let z = Math.round(h / 2 + i * Math.sin(angle));
                let rollAngle = data.angleYZ - baseData.angleYZ;
                if (!event.ctrlKey && event.shiftKey) {
                  rollAngle = roundToNearest45(rollAngle);
                }
                let cubeY = Math.round(centerY + i * Math.cos(angle + rollAngle));
                let cubeZ = Math.round(centerZ + i * Math.sin(angle + rollAngle));
                let alt = 0;
                if (y >= 0 && y < w && z >= 0 && z < h) {
                  if (obj.copy_img.arry[z][y] === undefined) {
                    continue;
                  }
                  count++;
                  if (count >= 17000) {
                    break;
                  }
                  alt = obj.copy_img.arry[z][y];
                }
                else {
                  continue;
                }
                change_to_drawImg (cubeX,cubeY,cubeZ,alt);
              }
            }
          }
          if (layer_slice[layer_id] === 'y') {
            let centerX = obj.copy_img.basis[0] - w / 2;
            let cubeY = select_layer;
            let centerZ = obj.copy_img.basis[1] - h / 2;
            let data = calculateDistanceAngle(centerX, cubeY, centerZ, obj.end_x, cubeY, obj.end_z);
            let baseData = calculateDistanceAngle(centerX, 0, centerZ, obj.copy_img.basis[0], 0, obj.copy_img.basis[1]);
            for (let i = 0; i < baseData.dis; i++) {
              for (let j = 0; j < numPoints * 2 * i; j++) {
                const angle = (j / (numPoints * 2 * i)) * 2 * Math.PI;
                let x = Math.round(w / 2 + i * Math.cos(angle));
                let z = Math.round(h / 2 + i * Math.sin(angle));
                let rollAngle = data.angleXZ - baseData.angleXZ;
                if (!event.ctrlKey && event.shiftKey) {
                  rollAngle = roundToNearest45(rollAngle);
                }
                let cubeX = Math.round(centerX + i * Math.cos(angle + rollAngle));
                let cubeZ = Math.round(centerZ + i * Math.sin(angle + rollAngle));
                let alt = 0;
                if (x >= 0 && x < w && z >= 0 && z < h) {
                  if (obj.copy_img.arry[z][x] === undefined) {
                    continue;
                  }
                  count++;
                  if (count >= 17000) {
                    break;
                  }
                  alt = obj.copy_img.arry[z][x];
                }
                else {
                  continue;
                }
                change_to_drawImg (cubeX,cubeY,cubeZ,alt);
              }
            }
          }
          if (layer_slice[layer_id] === 'z') {
            let centerX = obj.copy_img.basis[0] - w / 2;
            let centerY = obj.copy_img.basis[1] - h / 2;
            let cubeZ = select_layer;
            let data = calculateDistanceAngle(centerX, centerY, cubeZ, obj.end_x, obj.end_y, cubeZ);
            let baseData = calculateDistanceAngle(centerX, centerY, 0, obj.copy_img.basis[0], obj.copy_img.basis[1] - h, 0);
            for (let i = 0; i < baseData.dis; i++) {
              for (let j = 0; j < numPoints * 2 * i; j++) {
                const angle = (j / (numPoints * 2 * i)) * 2 * Math.PI;
                let x = Math.round(w / 2 + i * Math.cos(angle));
                let y = Math.round(h / 2 + i * Math.sin(angle));
                let rollAngle = data.angleXY - baseData.angleXY;
                if (!event.ctrlKey && event.shiftKey) {
                  rollAngle = roundToNearest45(rollAngle);
                }
                let cubeX = Math.round(centerX + i * Math.cos(angle + rollAngle));
                let cubeY = Math.round(centerY + i * Math.sin(angle + rollAngle));
                let alt = 0;
                if (x >= 0 && x < w && y >= 0 && y < h) {
                  if (obj.copy_img.arry[y][x] === undefined) {
                    continue;
                  }
                  count++;
                  if (count >= 17000) {
                    break;
                  }
                  alt = obj.copy_img.arry[y][x];
                }
                else {
                  continue;
                }
                change_to_drawImg (cubeX,cubeY,cubeZ,alt);
              }
            }
          }
        }
      }
    }
    window.addEventListener('mouseup', end_fun);
    window.addEventListener('touchend', end_fun);
    return false;
  }
}
function return_want_if_at_tool (e) {
  let want_if = 'false';
  if (window.parent.$('#zoom_scope_button').prop('checked')) {
    want_if = 'zoom_scope_button';
    return want_if;
  }
  else if (window.parent.$('#color_dropper_icon').prop('checked')) {
    want_if = 'color_dropper_icon';
    return want_if;
  }
  else if (window.parent.$('#jump_to_this_layer').prop('checked')) {
    want_if = 'jump_to_this_layer';
    return want_if;
  }
  else {
    if (window.parent.$('#no_set_action').prop('checked')) {
      want_if = 'no_set_action';
    }
    if (window.parent.$('#pen_tool').prop('checked')) {
      want_if = 'pen_tool';
    }
    if (window.parent.$('#fill_tool_of_paint_roller').prop('checked')) {
      want_if = 'fill_tool_of_paint_roller';
    }
    if (window.parent.$('#eraser_points_tool').prop('checked')) {
      want_if = 'eraser_points_tool';
    }
    if (window.parent.$('#area_cut_tool_of_scissors').prop('checked')) {
      want_if = 'area_cut_tool_of_scissors';
    }
    if (window.parent.$('#stroke_path_with_line').prop('checked')) {
      want_if = 'stroke_path_with_line';
    }
    if (window.parent.$('#stroke_path_with_rect').prop('checked')) {
      want_if = 'stroke_path_with_rect';
    }
    if (window.parent.$('#stroke_path_with_arc').prop('checked')) {
      want_if = 'stroke_path_with_arc';
    }
    if (window.parent.$('#copy_area_with_rect').prop('checked')) {
      want_if = 'copy_area_with_rect';
    }
    if (window.parent.$('#resize_area_with_rect').prop('checked')) {
      want_if = 'resize_area_with_rect';
    }
    if (window.parent.$('#roll_area_with_rect').prop('checked')) {
      want_if = 'roll_area_with_rect';
    }
    return want_if;
  }
}
function startAnimation() {
  if (animationActive) {
    return false;
  }
  animationActive = true;
  animate();
}
function choose_fun (e) {
  if (obj.want_if === 'pen_tool' || obj.want_if === 'eraser_points_tool') {
    pen_tool(e);
  }
  if (obj.want_if === 'stroke_path_with_line') {
    stroke_straight_path_with_line(e);
  }
  if (obj.want_if === 'stroke_path_with_rect') {
    stroke_path_with_rect(e);
  }
  if (obj.want_if === 'stroke_path_with_arc') {
    stroke_path_with_arc(e);
  }
  if (obj.want_if === 'copy_area_with_rect' || obj.want_if === 'resize_area_with_rect' || obj.want_if === 'roll_area_with_rect') {
    copy_area_with_rect(e);
  }
  startAnimation();
}
// マウスイベントリスナーを追加
editingElement.addEventListener('wheel', (e) => {
  const zoomAmount = Math.round(100 * 600 / camera.position.z);
  window.parent.$('#art_scale').val(zoomAmount);
  startAnimation();
  animationActive = false;
});
editingElement.addEventListener('mousedown', (e) => {
  cubes.forEach(cube => {
    cube.children.forEach(child => {
      if (child instanceof THREE.LineSegments) {
        cube.remove(child); // 赤い線を選択されたキューブから削除
      }
    });
  }); // 線を消す
  if (controls.enabled && window.parent.$('#no_set_action').prop('checked')) {
    obj.want_if = 'grab';
    window.addEventListener('mousemove', handleTouchMove, { passive: false });
    window.addEventListener('mousemove', choose_fun, false);
    window.addEventListener('mouseup', all_removeEventListener, false);
    return false;
  }
  if (!do_flag) {
    let str;
    if (window.parent.$('header .header_form p.language').text() === 'Japanese') {
      str = "処理が正しく完了できませんでした。ページの更新をお願い致します。";
    }
    if (window.parent.$('header .header_form p.language').text() === '英語') {
      str = "The process could not be completed correctly. Please reload the page.";
    }
    window.parent.alert(str);
    return false;
  }
  if (!window.parent.$('#editing_layer').prop('checked')) {
    return true;
  }
  do_flag = false;
  obj.use = 'mouse';
  obj.want_if = return_want_if_at_tool ();
  if (obj.want_if === 'false') {
    do_flag = true;
    all_removeEventListener ();
    return false;
  }
  if (obj.want_if === 'zoom_scope_button') {
    do_flag = true;
    all_removeEventListener ();
    return false;
  }
  if (roll_back_obj.art.length - roll_back_obj.c_art - 1 < 0) {
    roll_back_obj.c_art = roll_back_obj.art.length - 1;
  }
  obj.once_memory = deepCopyArray(roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1]);
  // マウス座標を正規化
  mouse.x = ((event.clientX + window.scrollX) / canvasWidth) * 2 - 1;
  mouse.y = -((event.clientY + window.scrollY) / canvasHeight) * 2 + 1;
  // レイキャスティング
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length <= 0) {
    obj.want_if = 'grab';
    document.body.style.cursor = "grab";
    controls.enabled = true;
    $.each(obj, function(index, value) {
      obj[index] = '';
    });
    window.parent.$('#no_set_action').prop('checked', true);
    window.addEventListener('mousemove', handleTouchMove, { passive: false });
    window.addEventListener('mousemove', choose_fun, false);
    window.addEventListener('mouseup', all_removeEventListener, false);
    return false;
  }
  else {
    obj.change_cubes = deepCopyArray(obj.once_memory);
    const selectedCube = intersects[0].object;
    const cubeIndex = cubes.indexOf(selectedCube);
    if (cubeIndex !== -1) {
      obj.start_x = Math.round(selectedCube.position.x) / cubeSize + lange;
      obj.start_y = Math.round(selectedCube.position.y) / cubeSize + lange;
      obj.start_z = Math.round(selectedCube.position.z) / cubeSize + lange;
    }
    if (obj.want_if === 'fill_tool_of_paint_roller' || obj.want_if === 'area_cut_tool_of_scissors') {
      window.addEventListener('mousemove', handleTouchMove, { passive: false });
      $('html').css('cursor', 'wait');
      setTimeout(() => {
        fill_tool_of_paint_roller();
      }, "1")
    }
    else if (obj.want_if === 'jump_to_this_layer') {
      jump_to_this_layer();
    }
    else if (obj.want_if === 'color_dropper_icon') {
      color_dropper_icon();
    }
    else if (obj.want_if === 'stroke_path_with_line') {
      while (window.parent.sharedData.roll_back_obj.c_one_time > 0) {
        window.parent.sharedData.roll_back_obj.tableP.pop();
        window.parent.sharedData.roll_back_obj.c_one_time--;
      }
      window.addEventListener('mousemove', handleTouchMove, { passive: false });
      window.addEventListener('mousemove', choose_fun, false);
      window.addEventListener('mouseup', end_fun, false);
    }
    else if (obj.want_if === 'copy_area_with_rect' || obj.want_if === 'resize_area_with_rect' || obj.want_if === 'roll_area_with_rect') {
      if (obj.copy_img === '') {
        obj.start_x = event.clientX;
        obj.start_y = event.clientY;
        slc.width = canvasWidth;
        slc.height = canvasHeight;
        slc.classList.remove('hidden');
        obj.start_img = slctx.getImageData(0, 0, slc.width, slc.height);
        slctx.lineWidth = 0.5;
        slctx.strokeStyle = '#00ff00';
      }
      window.addEventListener('mousemove', handleTouchMove, { passive: false });
      window.addEventListener('mousemove', choose_fun, false);
    }
    else {
      window.addEventListener('mousemove', handleTouchMove, { passive: false });
      window.addEventListener('mousemove', choose_fun, false);
      window.addEventListener('mouseup', end_fun, false);
    }
  }
});
editingElement.addEventListener('mouseover', (e) => {
  obj.want_if = return_want_if_at_tool ();
  if (obj.want_if === 'no_set_action') {
    document.body.style.cursor = "grab";
    controls.enabled = true;
  }
  else {
    document.body.style.cursor = "default";
    controls.enabled = false;
  }
});
editingElement.addEventListener('touchstart', (e) => {
  cubes.forEach(cube => {
    cube.children.forEach(child => {
      if (child instanceof THREE.LineSegments) {
        cube.remove(child); // 赤い線を選択されたキューブから削除
      }
    });
  }); // 線を消す
  if (controls.enabled && window.parent.$('#no_set_action').prop('checked')) {
    obj.want_if = 'grab';
    window.addEventListener('touchstart', handleTouchMove, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchmove', choose_fun, false);
    window.addEventListener('touchend', all_removeEventListener, false);
    return false;
  }
  if (!do_flag) {
    let str;
    if (window.parent.$('header .header_form p.language').text() === 'Japanese') {
      str = "処理が正しく完了できませんでした。ページの更新をお願い致します。";
    }
    if (window.parent.$('header .header_form p.language').text() === '英語') {
      str = "The process could not be completed correctly. Please reload the page.";
    }
    window.parent.alert(str);
    return false;
  }
  if (!window.parent.$('#editing_layer').prop('checked')) {
    return true;
  }
  do_flag = false;
  obj.use = 'touch';
  obj.want_if = return_want_if_at_tool ();
  if (obj.want_if === 'false') {
    do_flag = true;
    all_removeEventListener ();
    return false;
  }
  if (obj.want_if === 'zoom_scope_button') {
    do_flag = true;
    all_removeEventListener ();
    return false;
  }
  if (roll_back_obj.art.length - roll_back_obj.c_art - 1 < 0) {
    roll_back_obj.c_art = roll_back_obj.art.length - 1;
  }
  obj.once_memory = deepCopyArray(roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1]);
  // マウス座標を正規化
  mouse.x = ((event.touches[0].clientX + window.scrollX) / canvasWidth) * 2 - 1;
  mouse.y = -((event.touches[0].clientY + window.scrollY) / canvasHeight) * 2 + 1;
  // レイキャスティング
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length <= 0) {
    obj.want_if = 'grab';
    document.body.style.cursor = "grab";
    controls.enabled = true;
    $.each(obj, function(index, value) {
      obj[index] = '';
    });
    window.parent.$('#no_set_action').prop('checked', true);
    window.addEventListener('touchstart', handleTouchMove, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchmove', choose_fun, false);
    window.addEventListener('touchend', all_removeEventListener, false);
    return false;
  }
  else {
    document.body.style.cursor = "default";
    controls.enabled = false;
    obj.change_cubes = deepCopyArray(obj.once_memory);
    const selectedCube = intersects[0].object;
    const cubeIndex = cubes.indexOf(selectedCube);
    if (cubeIndex !== -1) {
      obj.start_x = Math.round(selectedCube.position.x) / cubeSize + lange;
      obj.start_y = Math.round(selectedCube.position.y) / cubeSize + lange;
      obj.start_z = Math.round(selectedCube.position.z) / cubeSize + lange;
    }
    if (obj.want_if === 'fill_tool_of_paint_roller' || obj.want_if === 'area_cut_tool_of_scissors') {
      window.addEventListener('touchstart', handleTouchMove, { passive: false });
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      $('html').css('cursor', 'wait');
      setTimeout(() => {
        fill_tool_of_paint_roller();
      }, "1")
    }
    else if (obj.want_if === 'jump_to_this_layer') {
      jump_to_this_layer();
    }
    else if (obj.want_if === 'color_dropper_icon') {
      color_dropper_icon();
    }
    else if (obj.want_if === 'stroke_path_with_line') {
      while (window.parent.sharedData.roll_back_obj.c_one_time > 0) {
        window.parent.sharedData.roll_back_obj.tableP.pop();
        window.parent.sharedData.roll_back_obj.c_one_time--;
      }
      window.addEventListener('touchstart', handleTouchMove, { passive: false });
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchmove', choose_fun, false);
      window.addEventListener('touchend', end_fun, false);
    }
    else if (obj.want_if === 'copy_area_with_rect' || obj.want_if === 'resize_area_with_rect' || obj.want_if === 'roll_area_with_rect') {
      if (obj.copy_img === '') {
        obj.start_x = event.touches[0].clientX;
        obj.start_y = event.touches[0].clientY;
        slc.width = canvasWidth;
        slc.height = canvasHeight;
        slc.classList.remove('hidden');
        obj.start_img = slctx.getImageData(0, 0, slc.width, slc.height);
        slctx.lineWidth = 0.5;
        slctx.strokeStyle = '#00ff00';
      }
      window.addEventListener('touchstart', handleTouchMove, { passive: false });
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchmove', choose_fun, false);
    }
    else {
      window.addEventListener('touchstart', handleTouchMove, { passive: false });
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchmove', choose_fun, false);
      window.addEventListener('touchend', end_fun, false);
    }
  }
});
/*all removeEventListener at window remove*/
window.parent.document.addEventListener('beforeunload', all_removeEventListener);
window.parent.document.addEventListener('mouseleave', all_removeEventListener);
/* ++button action++ */
//canvas clear action
async function clear_canvas(e) {
  let str = '';
  if (window.parent.$('header .header_form p.language').text() === 'Japanese') {
    str = "キャンバスを消去します。";
  }
  if (window.parent.$('header .header_form p.language').text() === '英語') {
    str = "Clear the canvas.";
  }
  let result = window.parent.confirm(str);
  if (!result) {
    do_flag = true;
    return false;
  }
  if (window.parent.$('#art_size').val() === '') {
    window.parent.$('#art_size').val(30);
  }
  block_count = window.parent.$('#art_size').val();
  window.parent.$('#wait').removeClass('hidden');
  cubeSize = Math.round(300 / block_count);
  cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  materials = new THREE.MeshBasicMaterial({transparent: true, opacity: transparency});
  lange = Math.floor(block_count / 2);
  layer_id = window.parent.document.querySelector('.layer_selector select.appear').id;
  select_layer = Math.floor(block_count / 2);
  //change select list
  let vertical_layer_html = '';
  for (let k = 0; k < block_count; k++) {
    let reverse_c = block_count - k - 1;
    if (reverse_c == select_layer) {
      vertical_layer_html += '<option value="' + reverse_c + '" autofocus selected class="selected">' + reverse_c + '</option>';
    }
    else {
      vertical_layer_html += '<option value="' + reverse_c + '">' + reverse_c + '</option>';
    }
  }
  window.parent.$('#select_vertical_layers').html(vertical_layer_html);
  window.parent.$('#select_side_layers').html(vertical_layer_html);
  window.parent.$('#select_horizon_layers').html(vertical_layer_html);
  focus_point.forEach((item, i) => {
    focus_point[i] = select_layer;
  });
  // 古いルービックキューブを削除
  scene.children.length = 0;
  cubes.length = 0;
  for (let x = -lange; x < lange; x++) {
    for (let y = -lange; y < lange; y++) {
      for (let z = -lange; z < lange; z++) {
        const cube = new THREE.Mesh(cubeGeometry, materials);
        cube.position.set(x * cubeSize, y * cubeSize, z * cubeSize);
        if (
          (layer_slice[layer_id] === 'x' && x == select_layer - lange) ||
          (layer_slice[layer_id] === 'y' && y == select_layer - lange) ||
          (layer_slice[layer_id] === 'z' && z == select_layer - lange)
        ) {
          scene.add(cube);
        }
        cubes.push(cube);
      }
    }
  }
  const newArry = [];
  let length_gap = block_count - obj.once_memory.length;
  for (let z = 0; z < block_count; z++) {
    if (!newArry[z]) {
      newArry[z] = [];
    }
    for (let y = 0; y < block_count; y++) {
      if (!newArry[z][y]) {
        newArry[z][y] = [];
      }
      for (let x = 0; x < block_count; x++) {
        newArry[z][y][x] = 0;
      }
    }
  }
  startAnimation();
  animationActive = false;
  add_canvas_to_roll_back_obj (newArry);
  const iframeVariable = 'change_cube_size';
  window.parent.postMessage({ iframeVariable }, '*');
  do_flag = true;
  setTimeout((e) => {
    window.parent.$('#wait').addClass('hidden');
  }, 5);
}
window.parent.document.querySelector('#clear_canvas').addEventListener('click', async (e) => {
  if (!do_flag) {
    let str;
    if (window.parent.$('header .header_form p.language').text() === 'Japanese') {
      str = "処理が正しく完了できませんでした。ページの更新をお願い致します。";
    }
    if (window.parent.$('header .header_form p.language').text() === '英語') {
      str = "The process could not be completed correctly. Please reload the page.";
    }
    window.parent.alert(str);
    return false;
  }
  do_flag = false;
  await clear_canvas (e);
});
//ZoomUpDown action
function scope_action(scope) {
  let scale = window.parent.$("#art_scale").val();
  scale = Number(scale);
  if (scope === 'plus') {
    scale = scale * 1.1;
  }
  if (scope === 'minus') {
    scale = scale * 0.9;
  }
  scale = Math.round(scale);
  window.parent.$("#art_scale").val(scale);
  const zoomAmount = scale / 100;
  camera.position.z = 600 / zoomAmount;
  startAnimation();
  animationActive = false;
}
window.parent.document.querySelector('.zoom_in_out_scope .plus_scope_icon').addEventListener('click', (e) => {
  scope_action('plus');
});
window.parent.document.querySelector('.zoom_in_out_scope .minus_scope_icon').addEventListener('click', (e) => {
  scope_action('minus');
});
window.parent.document.querySelector('#art_scale').addEventListener('change', (e) => {
  const zoomAmount = $(e.target).val() / 100;
  camera.position.z = 600 / zoomAmount;
  startAnimation();
  animationActive = false;
});
//stroke_straight_path_with_line
function check_fill (i, edge, alt) {
  obj.start_x = roll_back_obj.tableP[i].x;
  obj.start_y = roll_back_obj.tableP[i].y;
  obj.start_z = roll_back_obj.tableP[i].z;
  for (let eZ = 0; eZ < edge.length; eZ++) {
    if (edge[eZ]) {
      for (let eY = 0; eY < edge[eZ].length; eY++) {
        if (edge[eZ][eY]) {
          for (let eX = 0; eX < edge[eZ][eY].length; eX++) {
            if (edge[eZ][eY][eX] === 'edge') {
              obj.end_x = eX;
              obj.end_y = eY;
              obj.end_z = eZ;
              let data = calculateDistanceAngle(obj.start_x, obj.start_y, obj.start_z, obj.end_x, obj.end_y, obj.end_z);
              for (let i = 0; i < data.dis; i++) {
                let x = obj.start_x + Math.round((data.disXY / data.dis) * i * Math.cos(data.angleXY));
                let y = obj.start_y + Math.round((data.disXY / data.dis) * i * Math.sin(data.angleXY));
                let z = obj.start_z + Math.round((data.disXZ / data.dis) * i * Math.sin(data.angleXZ));
                if (
                  obj.change_cubes[z] !== undefined &&
                  obj.change_cubes[z][y] !== undefined &&
                  obj.change_cubes[z][y][x] !== undefined &&
                  obj.change_cubes[z][y][x] !== alt
                ) {
                  obj.change_cubes[z][y][x] = alt;
                }
              }
            }
          }
        }
      }
    }
  }
}
function to_close_path (e) {
  while (roll_back_obj.c_one_time > 0) {
    roll_back_obj.tableP.pop();
    roll_back_obj.c_one_time --;
  }
  if (roll_back_obj.tableP.length <= 0) {
    roll_back_obj.one_time_img = [];
    roll_back_obj.c_one_time = 0;
    return false;
  }
  let edge = [];
  roll_back_obj.tableP.forEach((item, n) => {
    if (n >= roll_back_obj.tableP.length - 1) {
      return false;
    }
    let data = calculateDistanceAngle(item.x, item.y, item.z, roll_back_obj.tableP[n + 1].x, roll_back_obj.tableP[n + 1].y, roll_back_obj.tableP[n + 1].z);
    for (let i = 0; i < data.dis; i++) {
      let x = item.x + Math.round((data.disXY / data.dis) * i * Math.cos(data.angleXY));
      let y = item.y + Math.round((data.disXY / data.dis) * i * Math.sin(data.angleXY));
      let z = item.z + Math.round((data.disXZ / data.dis) * i * Math.sin(data.angleXZ));
      if (x >= 0 && x < block_count && y >= 0 && y < block_count && z >= 0 && z < block_count ) {
        if (!edge[z]) {
          edge[z] = [];
        }
        if (!edge[z][y]) {
          edge[z][y] = [];
        }
        edge[z][y][x] = 'edge';
      }
    }
  });
  obj.once_memory = deepCopyArray(roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1]);
  obj.change_cubes = deepCopyArray(obj.once_memory);
  let alt = window.parent.$("#CP label.check .CPimg").find('img.mImg').attr('alt');
  if (window.parent.$('#for_path_area').prop('checked')) {
    obj.start_x = roll_back_obj.tableP[roll_back_obj.tableP.length - 1].x;
    obj.start_y = roll_back_obj.tableP[roll_back_obj.tableP.length - 1].y;
    obj.start_z = roll_back_obj.tableP[roll_back_obj.tableP.length - 1].z;
    obj.end_x = roll_back_obj.tableP[0].x;
    obj.end_y = roll_back_obj.tableP[0].y;
    obj.end_z = roll_back_obj.tableP[0].z;
    let data = calculateDistanceAngle(obj.start_x, obj.start_y, obj.start_z, obj.end_x, obj.end_y, obj.end_z);
    for (let i = 0; i < data.dis; i++) {
      let x = obj.start_x + Math.round((data.disXY / data.dis) * i * Math.cos(data.angleXY));
      let y = obj.start_y + Math.round((data.disXY / data.dis) * i * Math.sin(data.angleXY));
      let z = obj.start_z + Math.round((data.disXZ / data.dis) * i * Math.sin(data.angleXZ));
      if (
        obj.change_cubes[z] !== undefined &&
        obj.change_cubes[z][y] !== undefined &&
        obj.change_cubes[z][y][x] !== undefined &&
        obj.change_cubes[z][y][x] !== alt
      ) {
        obj.change_cubes[z][y][x] = alt;
      }
    }
  }
  if (window.parent.$('#for_fill_area').prop('checked')) {
    for (let i = 0; i < roll_back_obj.tableP.length; i++) {
      check_fill (i, edge, alt);
    }
  }
  if (window.parent.$('#for_cut_area').prop('checked')) {
    alt = 0;
    for (let i = 0; i < roll_back_obj.tableP.length; i++) {
      check_fill (i, edge, alt);
    }
  }
  for (let z = 0; z < obj.once_memory.length; z++) {
    for (let y = 0; y < obj.once_memory[z].length; y++) {
      for (let x = 0; x < obj.once_memory[z][y].length; x++) {
        const baseEle = obj.once_memory[z][y][x];
        const targetEle = obj.change_cubes[z][y][x];
        if (baseEle !== targetEle) {
          const targetX = x - lange;
          const targetY = y - lange;
          const targetZ = z - lange;
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
            if (targetEle != 0) {
              materials = new THREE.MeshBasicMaterial({ map: cp_obj[targetEle].tex, transparent: true, opacity: 1});
            }
            else {
              materials = new THREE.MeshBasicMaterial({transparent: true, opacity: transparency});
            }
            const newCube = new THREE.Mesh(cubeGeometry, materials);
            newCube.position.copy(selectedCube.position);
            scene.add(newCube);
            cubes[cubeIndex] = newCube;
            obj.once_memory[z][y][x] = targetEle;
          }
        }
      }
    }
  }
  roll_back_obj.tableP = [];
  roll_back_obj.one_time_img = [];
  roll_back_obj.c_one_time = 0;
  add_canvas_to_roll_back_obj (obj.once_memory);
  animationActive = true;
  animate();
  animationActive = false;
  const iframeVariable = 'check_view';
  window.parent.postMessage({ iframeVariable }, '*');
}
function to_open_path (e) {
  if (window.parent.$('#for_path_area').prop('checked') || window.parent.$('#for_cut_area').prop('checked')) {
    roll_back_obj.tableP = [];
    roll_back_obj.one_time_img = [];
    roll_back_obj.c_one_time = 0;
    return false;
  }
  to_close_path (e);
}
window.parent.document.querySelector('.normal_tool .sub_normal_tool .to_close_path').addEventListener('click', (e) => {
  to_close_path (e);
});
window.parent.document.querySelector('.normal_tool .sub_normal_tool .to_open_path').addEventListener('click', (e) => {
  to_open_path (e);
});
//do undo
async function roll_back (e) {
  if (!do_flag) {
    let str;
    if (window.parent.$('header .header_form p.language').text() === 'Japanese') {
      str = "処理が正しく完了できませんでした。ページの更新をお願い致します。";
    }
    if (window.parent.$('header .header_form p.language').text() === '英語') {
      str = "The process could not be completed correctly. Please reload the page.";
    }
    window.parent.alert(str);
    return false;
  }
  do_flag = false;
  if (roll_back_obj.art.length - roll_back_obj.c_art - 1 < 0) {
    roll_back_obj.c_art = roll_back_obj.art.length - 1;
  }
  obj.once_memory = deepCopyArray(roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1]);
  roll_back_obj.c_one_time++;
  roll_back_obj.c_art++;
  if (roll_back_obj.c_art >= roll_back_obj.art.length) {
    roll_back_obj.c_art--;
    roll_back_obj.c_one_time = roll_back_obj.c_art;
    do_flag = true;
    return false;
  }
  let arry = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
  block_count = arry.length;
  if (block_count == window.parent.document.querySelector('#art_size').value) {
    window.parent.$('#wait').removeClass('hidden');
    await make_canvas (arry);
    const iframeVariable = 'check_view';
    window.parent.postMessage({ iframeVariable }, '*');
    do_flag = true;
    setTimeout((e) => {
      window.parent.$('#wait').addClass('hidden');
    }, 5);
  }
  else {
    window.parent.document.querySelector('#art_size').value = block_count;
    window.parent.$('#wait').removeClass('hidden');
    change_cube_size ('do_undo');
    setTimeout((e) => {
      window.parent.$('#wait').addClass('hidden');
    }, 5);
  }
}
async function roll_forward (e) {
  if (!do_flag) {
    let str;
    if (window.parent.$('header .header_form p.language').text() === 'Japanese') {
      str = "処理が正しく完了できませんでした。ページの更新をお願い致します。";
    }
    if (window.parent.$('header .header_form p.language').text() === '英語') {
      str = "The process could not be completed correctly. Please reload the page.";
    }
    window.parent.alert(str);
    return false;
  }
  do_flag = false;
  if (roll_back_obj.art.length - roll_back_obj.c_art - 1 < 0) {
    roll_back_obj.c_art = roll_back_obj.art.length - 1;
  }
  obj.once_memory = deepCopyArray(roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1]);
  roll_back_obj.c_one_time--;
  if (roll_back_obj.c_one_time < 0) {
    roll_back_obj.c_one_time = 0;
  }
  roll_back_obj.c_art--;
  if (roll_back_obj.c_art < 0) {
    roll_back_obj.c_art = 0;
    do_flag = true;
    return false;
  }
  let arry = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
  block_count = arry.length;
  if (block_count == window.parent.document.querySelector('#art_size').value) {
    window.parent.$('#wait').removeClass('hidden');
    await make_canvas (arry);
    const iframeVariable = 'check_view';
    window.parent.postMessage({ iframeVariable }, '*');
    do_flag = true;
    setTimeout((e) => {
      window.parent.$('#wait').addClass('hidden');
    }, 5);
  }
  else {
    window.parent.document.querySelector('#art_size').value = block_count;
    window.parent.$('#wait').removeClass('hidden');
    change_cube_size ('do_undo');
    setTimeout((e) => {
      window.parent.$('#wait').addClass('hidden');
    }, 5);
  }
}
window.parent.document.querySelector('.roll_back_and_forward .roll_back').addEventListener('click', (e) => {
  roll_back (e);
});
window.parent.document.querySelector('.roll_back_and_forward .roll_forward').addEventListener('click', (e) => {
  roll_forward (e);
});
//layer_change
window.parent.document.querySelector('#jump_to_this_layer').addEventListener('change', (e) => {
  cubes.forEach(cube => {
    cube.children.forEach(child => {
      if (child instanceof THREE.LineSegments) {
        cube.remove(child); // 赤い線を選択されたキューブから削除
      }
    });
  }); // 線を消す
  if (window.parent.$('#jump_to_this_layer').prop('checked')) {
    // 選択キューブを検索
    const targetX = focus_point[0] - lange;
    const targetY = focus_point[1] - lange;
    const targetZ = focus_point[2] - lange;
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
      // 境界線の描画
      const edges = new THREE.EdgesGeometry(cubeGeometry);
      const lineMaterialHighlight = new THREE.LineBasicMaterial({
        color: 0xff0000
      });
      const lineSegments = new THREE.LineSegments(edges, lineMaterialHighlight);
      lineSegments.position.set(0, 0, 0); //境界線のずれなし
      selectedCube.add(lineSegments); // cube の子要素として追加する

      startAnimation();
      animationActive = false;
    }
  }
});
function layer_change (old_layer_id, old_select_layer) {
  if (roll_back_obj.art.length - roll_back_obj.c_art - 1 < 0) {
    roll_back_obj.c_art = roll_back_obj.art.length - 1;
  }
  obj.once_memory = deepCopyArray(roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1]);
  materials = new THREE.MeshBasicMaterial({transparent: true, opacity: transparency});
  for (let z = 0; z < obj.once_memory.length; z++) {
    for (let y = 0; y < obj.once_memory[z].length; y++) {
      for (let x = 0; x < obj.once_memory[z][y].length; x++) {
        let alt = obj.once_memory[z][y][x];
        const targetX = x - lange;
        const targetY = y - lange;
        const targetZ = z - lange;
        if (
          (layer_slice[old_layer_id] === 'x' && x == old_select_layer) ||
          (layer_slice[old_layer_id] === 'y' && y == old_select_layer) ||
          (layer_slice[old_layer_id] === 'z' && z == old_select_layer)
        ) {
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
            if (alt == 0) {
              scene.remove(selectedCube);
            }
          }
        }
        if (
          (layer_slice[layer_id] === 'x' && x == select_layer) ||
          (layer_slice[layer_id] === 'y' && y == select_layer) ||
          (layer_slice[layer_id] === 'z' && z == select_layer)
        ) {
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
            if (alt == 0) {
              scene.add(selectedCube);
            }
          }
        }
      }
    }
  }
  startAnimation();
  animationActive = false;
}
window.parent.document.querySelector('.layer_selector .layer_change').addEventListener('click', (e) => {
  let old_layer_id = window.parent.$('.layer_selector select.appear').attr('id');
  let old_select_layer = window.parent.$('#' + old_layer_id).val();
  old_select_layer = Number(old_select_layer);
  window.parent.$('#' + old_layer_id).removeClass('appear');
  window.parent.$('label[for="' + old_layer_id + '"]').removeClass('appear');
  switch (old_layer_id) {
    case 'select_side_layers':
    layer_id = 'select_horizon_layers';
    select_layer = focus_point[1];
    break;
    case 'select_horizon_layers':
    layer_id = 'select_vertical_layers';
    select_layer = focus_point[2];
    break;
    case 'select_vertical_layers':
    layer_id = 'select_side_layers';
    select_layer = focus_point[0];
    break;
    default:
    // もし想定外の場合の処理を書く
    break;
  }
  window.parent.$('#' + layer_id).addClass('appear');
  window.parent.$('label[for="' + layer_id + '"]').addClass('appear');
  window.parent.$('#' + layer_id).val(select_layer);
  window.parent.$('#' + layer_id + ' option.selected').removeClass('selected');
  window.parent.$('#' + layer_id + ' option[value="' + select_layer + '"]').addClass('selected');
  layer_change (old_layer_id, old_select_layer);
});
window.parent.document.querySelectorAll('.layer_selector select').forEach(select => {
  select.addEventListener('change', (e) => {
    let old_layer_id = window.parent.$('.layer_selector select.appear').attr('id');
    layer_id = old_layer_id;
    select_layer = window.parent.$('#' + layer_id).val();
    select_layer = Number(select_layer);
    let old_select_layer = 15;
    switch (old_layer_id) {
      case 'select_side_layers':
      old_select_layer = focus_point[0];
      focus_point[0] = select_layer;
      break;
      case 'select_horizon_layers':
      old_select_layer = focus_point[1];
      focus_point[1] = select_layer;
      break;
      case 'select_vertical_layers':
      old_select_layer = focus_point[2];
      focus_point[2] = select_layer;
      break;
      default:
      // もし想定外の場合の処理を書く
      break;
    }
    layer_change (old_layer_id, old_select_layer);
  });
});
//layer copy paste
function layer_copy (pattern) {
  obj.copy_img = [];
  layer_id = window.parent.document.querySelector('.layer_selector select.appear').id;
  select_layer = window.parent.document.querySelector('#' + layer_id).value;
  select_layer = Number(select_layer);
  if (roll_back_obj.art.length - roll_back_obj.c_art - 1 < 0) {
    roll_back_obj.c_art = roll_back_obj.art.length - 1;
  }
  obj.once_memory = deepCopyArray(roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1]);
  obj.change_cubes = deepCopyArray(obj.once_memory);
  if (layer_slice[layer_id] === 'x') {
    let x = select_layer;
    for (let z = 0; z < obj.once_memory.length; z++) {
      if (!obj.copy_img[z]) {
        obj.copy_img[z] = [];
      }
      for (let y = 0; y < obj.once_memory[z].length; y++) {
        obj.copy_img[z][y] = obj.once_memory[z][y][x];
        obj.change_cubes[z][y][x] = 0;
      }
    }
  }
  if (layer_slice[layer_id] === 'y') {
    let y = select_layer;
    for (let z = 0; z < obj.once_memory.length; z++) {
      if (!obj.copy_img[z]) {
        obj.copy_img[z] = [];
      }
      for (let x = 0; x < obj.once_memory[z][y].length; x++) {
        obj.copy_img[z][x] = obj.once_memory[z][y][x];
        obj.change_cubes[z][y][x] = 0;
      }
    }
  }
  if (layer_slice[layer_id] === 'z') {
    let z = select_layer;
    for (let y = 0; y < obj.once_memory[z].length; y++) {
      if (!obj.copy_img[y]) {
        obj.copy_img[y] = [];
      }
      for (let x = 0; x < obj.once_memory[z][y].length; x++) {
        obj.copy_img[y][x] = obj.once_memory[z][y][x];
        obj.change_cubes[z][y][x] = 0;
      }
    }
  }
  if (pattern === 'copy') {
    window.parent.$('.layer_selector .layer_copy').addClass('copyed');
  }
  else if (pattern === 'cut') {
    make_canvas (obj.change_cubes);
    add_canvas_to_roll_back_obj (obj.change_cubes);
    const iframeVariable = 'check_view';
    window.parent.postMessage({ iframeVariable }, '*');
    window.parent.$('.layer_selector .layer_cut').addClass('copyed');
  }
}
async function layer_paste (e) {
  if (!do_flag) {
    let str;
    if (window.parent.$('header .header_form p.language').text() === 'Japanese') {
      str = "処理が正しく完了できませんでした。ページの更新をお願い致します。";
    }
    if (window.parent.$('header .header_form p.language').text() === '英語') {
      str = "The process could not be completed correctly. Please reload the page.";
    }
    window.parent.alert(str);
    return false;
  }
  do_flag = false;
  layer_id = window.parent.document.querySelector('.layer_selector select.appear').id;
  select_layer = window.parent.document.querySelector('#' + layer_id).value;
  select_layer = Number(select_layer);
  if (roll_back_obj.art.length - roll_back_obj.c_art - 1 < 0) {
    roll_back_obj.c_art = roll_back_obj.art.length - 1;
  }
  obj.once_memory = deepCopyArray(roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1]);
  obj.change_cubes = deepCopyArray(obj.once_memory);
  if (layer_slice[layer_id] === 'x') {
    let x = select_layer;
    for (let z = 0; z < obj.copy_img.length; z++) {
      for (let y = 0; y < obj.copy_img[z].length; y++) {
        obj.change_cubes[z][y][x] = obj.copy_img[z][y];
      }
    }
  }
  if (layer_slice[layer_id] === 'y') {
    let y = select_layer;
    for (let z = 0; z < obj.copy_img.length; z++) {
      for (let x = 0; x < obj.copy_img[z].length; x++) {
        obj.change_cubes[z][y][x] = obj.copy_img[z][x];
      }
    }
  }
  if (layer_slice[layer_id] === 'z') {
    let z = select_layer;
    for (let y = 0; y < obj.copy_img.length; y++) {
      for (let x = 0; x < obj.copy_img[y].length; x++) {
        obj.change_cubes[z][y][x] = obj.copy_img[y][x];
      }
    }
  }
  await make_canvas (obj.change_cubes);
  add_canvas_to_roll_back_obj (obj.change_cubes);
  const iframeVariable = 'check_view';
  window.parent.postMessage({ iframeVariable }, '*');
  window.parent.$('.layer_selector .layer_copy').removeClass('copyed');
  window.parent.$('.layer_selector .layer_cut').removeClass('copyed');
  $.each(obj, function(index, value) {
    obj[index] = '';
  });
  do_flag = true;
}
window.parent.document.querySelector('.layer_selector .layer_copy').addEventListener('click', (e) => {
  layer_copy ('copy');
});
window.parent.document.querySelector('.layer_selector .layer_cut').addEventListener('click', (e) => {
  layer_copy ('cut');
});
window.parent.document.querySelector('.layer_selector .layer_paste').addEventListener('click', (e) => {
  layer_paste (e);
});
//shortcuts
function keydown_event(e){
  //ctrl only
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyZ") {
    event.preventDefault();
    window.parent.document.querySelector('.roll_back_and_forward .roll_back').click();
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyC") {
    event.preventDefault();
    window.parent.$('.layer_selector .layer_copy').click();
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyX") {
    event.preventDefault();
    window.parent.$('.layer_selector .layer_cut').click();
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyV") {
    event.preventDefault();
    window.parent.$('.layer_selector .layer_paste').click();
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "NumpadAdd") {
    event.preventDefault();
    window.parent.$('.zoom_in_out_scope .plus_scope_icon').click();
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "NumpadSubtract") {
    event.preventDefault();
    window.parent.$('.zoom_in_out_scope .minus_scope_icon').click();
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyS") {
    event.preventDefault();
    if (window.parent.$('#syncer-acdn-03 li[data-target="target_memorys"] p.target').length) {
      let target_id = window.parent.$('#syncer-acdn-03 li[data-target="target_memorys"] p.target').parent().attr('id');
      if (window.parent.$('#' + target_id).attr('data-check') === undefined || !window.parent.$('#' + target_id).attr('data-check').length) {
        window.parent.$('#' + target_id).children('i[onclick="otm_save(this)"]').click();
      }
      else {
        let key = target_id;
        if (roll_back_obj.art.length - roll_back_obj.c_art - 1 < 0) {
          roll_back_obj.c_art = roll_back_obj.art.length - 1;
        }
        let value = deepCopyArray(roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1]);
        add_new_obj_to_memory_obj (key,value);
      }
    }
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyR") {
    event.preventDefault();
    window.parent.$('.layer_selector .layer_change').click();
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyE") {
    event.preventDefault();
    window.parent.$('.normal_tool .sub_normal_tool .to_close_path').click();
  }
  //shift + ctrl
  if(event.ctrlKey && event.shiftKey && event.code === "KeyZ") {
    event.preventDefault();
    window.parent.document.querySelector('.roll_back_and_forward .roll_forward').click();
  }
  if(event.ctrlKey && event.shiftKey && event.code === "KeyE") {
    event.preventDefault();
    window.parent.$('.normal_tool .sub_normal_tool .to_open_path').click();
  }
}
document.addEventListener('keydown', keydown_event,false);

function animate() {
  if (animationActive) {
    //console.log('e');
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
}
animate();
animationActive = false;
