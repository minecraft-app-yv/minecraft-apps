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
  let img = $("#" + palette_color_box_id + " .CPimg").find('img.mImg');
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
//change editing
$('#editing_2d').change((e) => {
  if (!$('#editing_2d').prop('checked')) {
    return true;
  }
  //create canvas
  if (roll_back_obj.art.length - roll_back_obj.c_art - 1 < 0) {
    roll_back_obj.c_art = roll_back_obj.art.length - 1;
  }
  obj.once_memory = deepCopyArray(roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1]);
  layer_id = $('.layer_selector select.appear').attr('id');
  select_layer = Number($('#' + layer_id).val());
  $("#art_scale").val(100);
  pac.width = 600;
  pac.height = 600;
  block_count = obj.once_memory.length;
  $('#art_size').val(block_count);
  cell_size_pixel = pac.width / block_count;
  pactx.fillStyle = 'white';
  pactx.fillRect(0, 0, pac.width, pac.height);
  pactx.lineWidth = 0.5;
  pactx.strokeStyle = '#f5f5f5';
  for (let z = 0; z < obj.once_memory.length; z++) {
    for (let y = 0; y < obj.once_memory[z].length; y++) {
      for (let x = 0; x < obj.once_memory[z][y].length; x++) {
        let alt = obj.once_memory[z][y][x];
        let mapY = obj.once_memory[z].length - y - 1;
        if (alt != 0) {
          if (layer_slice[layer_id] === 'x' && x == select_layer) {
            const image = cp_obj[alt].img;
            pactx.drawImage(image, z * cell_size_pixel, mapY * cell_size_pixel, cell_size_pixel, cell_size_pixel);
          }
          if (layer_slice[layer_id] === 'y' && y == select_layer) {
            const image = cp_obj[alt].img;
            pactx.drawImage(image, x * cell_size_pixel, z * cell_size_pixel, cell_size_pixel, cell_size_pixel);
          }
          if (layer_slice[layer_id] === 'z' && z == select_layer) {
            const image = cp_obj[alt].img;
            pactx.drawImage(image, x * cell_size_pixel, mapY * cell_size_pixel, cell_size_pixel, cell_size_pixel);
          }
        }
      }
    }
  }
  for (let x = 0; x < block_count; x++) {
    pactx.beginPath();
    pactx.moveTo(x * cell_size_pixel, 0);
    pactx.lineTo(x * cell_size_pixel, pac.width);
    pactx.stroke();
  }
  for (let y = 0; y < block_count; y++) {
    pactx.beginPath();
    pactx.moveTo(0, y * cell_size_pixel);
    pactx.lineTo(pac.height, y * cell_size_pixel);
    pactx.stroke();
  }
});
// メッセージ受信時の処理を設定
window.addEventListener('message', event => {
  const data = event.data;
  if (data && data.iframeVariable === 'restart') {
    if (roll_back_obj.art.length - roll_back_obj.c_art - 1 < 0) {
      roll_back_obj.c_art = roll_back_obj.art.length - 1;
    }
    obj.once_memory = deepCopyArray(roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1]);
    block_count = obj.once_memory.length;
    $('#art_size').val(block_count);
    change_cube_size ('restart');
  }
});
/*map art editing*/
const pac = document.getElementById("my2DCanvas");
pac.setAttribute('willReadFrequently', 'true');
const pactx = pac.getContext("2d");
let block_count = $('#art_size').val();
let cell_size_pixel = pac.width / block_count;
let layer_id = $('.layer_selector select.appear').attr('id');
let select_layer = Number($('#' + layer_id).val());
let do_flag = true;
let array_match_cell = [];
let count = 0;
function roundToNearest45(angle) {
  const angleInRadians = angle % (2 * Math.PI);
  const nearest45Index = Math.round(angleInRadians / (Math.PI / 4)) % 8;
  return nearest45Index * (Math.PI / 4);
}
function make_canvas (arry) {
  pactx.fillStyle = 'white';
  pactx.fillRect(0, 0, pac.width, pac.height);
  pactx.lineWidth = 0.5;
  pactx.strokeStyle = '#f5f5f5';
  for (let z = 0; z < arry.length; z++) {
    for (let y = 0; y < arry[z].length; y++) {
      for (let x = 0; x < arry[z][y].length; x++) {
        let alt = arry[z][y][x];
        let mapY = arry[z].length - y - 1;
        if (alt != 0) {
          if (layer_slice[layer_id] === 'x' && x == select_layer) {
            const image = cp_obj[alt].img;
            pactx.drawImage(image, z * cell_size_pixel, mapY * cell_size_pixel, cell_size_pixel, cell_size_pixel);
          }
          if (layer_slice[layer_id] === 'y' && y == select_layer) {
            const image = cp_obj[alt].img;
            pactx.drawImage(image, x * cell_size_pixel, z * cell_size_pixel, cell_size_pixel, cell_size_pixel);
          }
          if (layer_slice[layer_id] === 'z' && z == select_layer) {
            const image = cp_obj[alt].img;
            pactx.drawImage(image, x * cell_size_pixel, mapY * cell_size_pixel, cell_size_pixel, cell_size_pixel);
          }
        }
      }
    }
  }
  for (let x = 0; x < block_count; x++) {
    pactx.beginPath();
    pactx.moveTo(x * cell_size_pixel, 0);
    pactx.lineTo(x * cell_size_pixel, pac.width);
    pactx.stroke();
  }
  for (let y = 0; y < block_count; y++) {
    pactx.beginPath();
    pactx.moveTo(0, y * cell_size_pixel);
    pactx.lineTo(pac.height, y * cell_size_pixel);
    pactx.stroke();
  }
}
function all_removeEventListener (e) {
  document.removeEventListener('mousemove', handleTouchMove, { passive: false });
  pac.removeEventListener('mousemove', choose_fun);
  pac.removeEventListener('mouseup', end_fun);
  document.removeEventListener('mouseup', rect_FirstUp);
  document.removeEventListener('mouseup', rect_SecondUp);
  document.removeEventListener('touchstart', handleTouchMove, { passive: false });
  document.removeEventListener('touchmove', handleTouchMove, { passive: false });
  pac.removeEventListener('touchmove', choose_fun);
  pac.removeEventListener('touchend', end_fun);
  document.removeEventListener('touchend', rect_FirstUp);
  document.removeEventListener('touchend', rect_SecondUp);
  do_flag = true;
}
function get_picked_colorBox_from_id(id) {
  $("#CP *").removeClass("check");
  $("#" + id).addClass("check");
  //pick color display
  let obj_data = return_img_html_arry_rgb (id);
  $('.palette .palette_button .selected_block_img, #CP_icons .selected_block_img').html(obj_data.html);
  $('#CP_icons .rgb span.rgbR').text(obj_data.rgb[0]);
  $('#CP_icons .rgb span.rgbG').text(obj_data.rgb[1]);
  $('#CP_icons .rgb span.rgbB').text(obj_data.rgb[2]);
}
function color_dropper_icon(e) {
  all_removeEventListener ();
  if (isNaN(obj.start_x) || isNaN(obj.start_y)) {
    return false;
  }
  let alt = obj.change_cubes[obj.start_y][obj.start_x];
  obj.once_memory = '';
  if (alt != 0) {
    let id = $('#CP .CPimg img[alt="' + alt + '"]').parent().parent().attr('id');
    $('#' + id + ' .CPimg img.mImg').removeClass('mImg');
    $('#' + id + ' .CPimg img[alt="' + alt + '"]').addClass('mImg');
    get_picked_colorBox_from_id(id);
  }
}
function jump_to_this_layer(e) {
  all_removeEventListener ();
  if (isNaN(obj.start_x) || isNaN(obj.start_y)) {
    return false;
  }
  // 線を消す
  pactx.lineWidth = 0.5;
  pactx.strokeStyle = '#f5f5f5';
  let c = 0;
  while (c < 10) {
    for (let x = 0; x < block_count; x++) {
      pactx.beginPath();
      pactx.moveTo(x * cell_size_pixel, 0);
      pactx.lineTo(x * cell_size_pixel, pac.width);
      pactx.stroke();
    }
    for (let y = 0; y < block_count; y++) {
      pactx.beginPath();
      pactx.moveTo(0, y * cell_size_pixel);
      pactx.lineTo(pac.height, y * cell_size_pixel);
      pactx.stroke();
    }
    c++;
  }
  // 選択キューブを検索
  pactx.strokeStyle = '#ff0000';
  pactx.strokeRect(obj.start_x * cell_size_pixel, obj.start_y * cell_size_pixel, cell_size_pixel, cell_size_pixel);
  if (layer_slice[layer_id] === 'x') {
    focus_point[0] = select_layer;
    focus_point[1] = obj.once_memory.length - (obj.start_y + 1);
    focus_point[2] = obj.start_x;
  }
  if (layer_slice[layer_id] === 'y') {
    focus_point[0] = obj.start_x;
    focus_point[1] = select_layer;
    focus_point[2] = obj.start_y;
  }
  if (layer_slice[layer_id] === 'z') {
    focus_point[0] = obj.start_x;
    focus_point[1] = obj.once_memory.length - (obj.start_y + 1);
    focus_point[2] = select_layer;
  }
}
function end_fun (e) {
  if (obj.want_if === 'stroke_path_with_line') {
    if (roll_back_obj.tableP.length <= 0) {
      roll_back_obj.tableP.push({x: obj.start_x, y: obj.start_y});
    }
    roll_back_obj.tableP.push({x: obj.end_x, y: obj.end_y});
    roll_back_obj.c_one_time = 0;
    let data = calculateDistanceAngle(obj.start_x, obj.start_y, obj.end_x, obj.end_y);
    let alt = $('#CP label.check .CPimg img.mImg').attr('alt');
    if ($('#for_cut_area').prop('checked')) {
      alt = 0;
    }
    for (let i = 0; i < data.dis; i++) {
      let x = obj.start_x + Math.round(i * Math.cos(data.ang));
      let y = obj.start_y + Math.round(i * Math.sin(data.ang));
      obj.change_cubes[y][x] = alt;
    }
    for (let z = 0; z < obj.once_memory.length; z++) {
      for (let y = 0; y < obj.once_memory[z].length; y++) {
        for (let x = 0; x < obj.once_memory[z][y].length; x++) {
          let mapY = obj.once_memory[z].length - y - 1;
          if (layer_slice[layer_id] === 'x' && x == select_layer) {
            obj.once_memory[z][y][x] = obj.change_cubes[mapY][z];
          }
          if (layer_slice[layer_id] === 'y' && y == select_layer) {
            obj.once_memory[z][y][x] = obj.change_cubes[z][x];
          }
          if (layer_slice[layer_id] === 'z' && z == select_layer) {
            obj.once_memory[z][y][x] = obj.change_cubes[mapY][x];
          }
        }
      }
    }
  }
  if (obj.want_if === 'stroke_path_with_rect') {
    let left = Math.min(obj.start_x, obj.end_x);
    let top = Math.min(obj.start_y, obj.end_y);
    let w = Math.abs(obj.start_x - obj.end_x);
    let h = Math.abs(obj.start_y - obj.end_y);
    let alt = $('#CP label.check .CPimg img.mImg').attr('alt');
    if ($('#for_cut_area').prop('checked')) {
      alt = 0;
    }
    for (let y = top; y < (top + h); y++) {
      for (let x = left; x < (left + w); x++) {
        if ($('#for_path_area').prop('checked')) {
          if (x > left && x < (left + w) - 1 && y > top && y < (top + h) - 1) {
            continue;
          }
        }
        obj.change_cubes[y][x] = alt;
      }
    }
    for (let z = 0; z < obj.once_memory.length; z++) {
      for (let y = 0; y < obj.once_memory[z].length; y++) {
        for (let x = 0; x < obj.once_memory[z][y].length; x++) {
          let mapY = obj.once_memory[z].length - y - 1;
          if (layer_slice[layer_id] === 'x' && x == select_layer) {
            obj.once_memory[z][y][x] = obj.change_cubes[mapY][z];
          }
          if (layer_slice[layer_id] === 'y' && y == select_layer) {
            obj.once_memory[z][y][x] = obj.change_cubes[z][x];
          }
          if (layer_slice[layer_id] === 'z' && z == select_layer) {
            obj.once_memory[z][y][x] = obj.change_cubes[mapY][x];
          }
        }
      }
    }
  }
  if (obj.want_if === 'stroke_path_with_arc') {
    let data = calculateDistanceAngle(obj.start_x, obj.start_y, obj.end_x, obj.end_y);
    let alt = $('#CP label.check .CPimg img.mImg').attr('alt');
    if ($('#for_cut_area').prop('checked')) {
      alt = 0;
    }
    const numPoints = 8;
    if (!$('#for_path_area').prop('checked')) {
      obj.change_cubes[obj.start_y][obj.start_x] = alt;
    }
    for (let i = 0; i < data.dis; i++) {
      for (let j = 0; j < numPoints * 2 * i; j++) {
        const angle = (j / (numPoints * 2 * i)) * 2 * Math.PI;
        let x = obj.start_x + Math.round(i * Math.cos(angle));
        let y = obj.start_y + Math.round(i * Math.sin(angle));
        if ($('#for_path_area').prop('checked')) {
          if (i >= 0 && i < data.dis - 1) {
            continue;
          }
        }
        obj.change_cubes[y][x] = alt;
      }
    }
    for (let z = 0; z < obj.once_memory.length; z++) {
      for (let y = 0; y < obj.once_memory[z].length; y++) {
        for (let x = 0; x < obj.once_memory[z][y].length; x++) {
          let mapY = obj.once_memory[z].length - y - 1;
          if (layer_slice[layer_id] === 'x' && x == select_layer) {
            obj.once_memory[z][y][x] = obj.change_cubes[mapY][z];
          }
          if (layer_slice[layer_id] === 'y' && y == select_layer) {
            obj.once_memory[z][y][x] = obj.change_cubes[z][x];
          }
          if (layer_slice[layer_id] === 'z' && z == select_layer) {
            obj.once_memory[z][y][x] = obj.change_cubes[mapY][x];
          }
        }
      }
    }
  }
  add_canvas_to_roll_back_obj (obj.once_memory);
  const iframeVariable = 'check_view';
  window.parent.postMessage({ iframeVariable }, '*');
  $.each(obj, function(index, value) {
    obj[index] = '';
  });
  all_removeEventListener ();
}
function pen_tool (e) {
  let mx,my
  let alt = $('#CP label.check .CPimg img.mImg').attr('alt');
  if (obj.use === 'mouse') {
    mx = e.clientX;
    my = e.clientY;
  }
  if (obj.use === 'touch') {
    mx = e.touches[0].clientX;
    my = e.touches[0].clientY;
  }
  mx -= pac.getBoundingClientRect().left;
  my -= pac.getBoundingClientRect().top;
  if (mx >= 0 && mx < pac.width && my >=0 && my < pac.height) {
    mx = Math.floor(mx / cell_size_pixel);
    my = Math.floor(my / cell_size_pixel);
  } else {
    return false;
  }
  pactx.lineWidth = 0.5;
  pactx.strokeStyle = '#f5f5f5';
  pactx.fillStyle = 'white';
  pactx.fillRect(mx * cell_size_pixel, my * cell_size_pixel, cell_size_pixel, cell_size_pixel);
  if (obj.want_if === 'pen_tool') {
    const image = cp_obj[alt].img;
    pactx.drawImage(image, mx * cell_size_pixel, my * cell_size_pixel, cell_size_pixel, cell_size_pixel);
  }
  else if (obj.want_if === 'eraser_points_tool') {
    alt = 0;
  }
  pactx.strokeRect(mx * cell_size_pixel, my * cell_size_pixel, cell_size_pixel, cell_size_pixel);
  if (layer_slice[layer_id] === 'x') {
    let x = select_layer;
    let cubeY = block_count - my - 1;
    let z = mx;
    obj.once_memory[z][cubeY][x] = alt;
  }
  if (layer_slice[layer_id] === 'y') {
    let x = mx;
    let z = my;
    let y = select_layer;
    obj.once_memory[z][y][x] = alt;
  }
  if (layer_slice[layer_id] === 'z') {
    let x = mx;
    let cubeY = block_count - my - 1;
    let z = select_layer;
    obj.once_memory[z][cubeY][x] = alt;
  }
}
function same_area_search (x, y, change_alt, base_alt) {
  return new Promise((resolve, reject) => {
    count++
    if (count >= 1500) {
      array_match_cell = [];
      resolve(true);
    }
    let number = 1;
    let array_xy_obj = [
      {x: x, y: y - number},
      {x: x - number, y: y},
      {x: x, y: y + number},
      {x: x + number, y: y},
    ];
    obj.change_cubes[y][x] = change_alt;
    let xy_obj = {x: x, y: y};
    let key = array_match_cell.findIndex(obj => obj.x === xy_obj.x && obj.y === xy_obj.y);
    while (key >= 0) {
      array_match_cell.splice(key, 1);
      key = array_match_cell.indexOf(xy_obj);
    }
    let next = 0;
    for (let i = 0; i < array_xy_obj.length; i++) {
      if (
        obj.change_cubes[array_xy_obj[i].y] === undefined ||
        obj.change_cubes[array_xy_obj[i].y][array_xy_obj[i].x] === undefined
      ) {
        continue;
      }
      let target_alt = obj.change_cubes[array_xy_obj[i].y][array_xy_obj[i].x];
      if (next > 2) {
        break;
      }
      if (target_alt === base_alt) {
        let new_obj = array_xy_obj[i];
        if (array_match_cell.findIndex(obj => obj.x === new_obj.x && obj.y === new_obj.y < 0)) {
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
      same_area_search (next_xy_obj.x, next_xy_obj.y, change_alt, base_alt);
    }
    if (!array_match_cell.length) {
      resolve(true);
    }
  });
}
async function fill_tool_of_paint_roller(e) {
  let mx = obj.start_x;
  let my = obj.start_y;
  let change_alt = $('#CP label.check .CPimg img.mImg').attr('alt');
  if (obj.want_if === 'area_cut_tool_of_scissors') {
    change_alt = 0;
  }
  let base_alt = 0;
  if (layer_slice[layer_id] === 'x') {
    let x = select_layer;
    let cubeY = block_count - my - 1;
    let z = mx;
    base_alt = obj.once_memory[z][cubeY][x];
  }
  if (layer_slice[layer_id] === 'y') {
    let x = mx;
    let y = select_layer;
    let z = my;
    base_alt = obj.once_memory[z][y][x];
  }
  if (layer_slice[layer_id] === 'z') {
    let x = mx;
    let cubeY = block_count - my - 1;
    let z = select_layer;
    base_alt = obj.once_memory[z][cubeY][x];
  }
  count = 0;
  try {
    const result = await same_area_search (mx, my, change_alt, base_alt);
    if (result) {
      for (let z = 0; z < obj.once_memory.length; z++) {
        for (let y = 0; y < obj.once_memory[z].length; y++) {
          for (let x = 0; x < obj.once_memory[z][y].length; x++) {
            let mapY = obj.once_memory[z].length - y - 1;
            if (layer_slice[layer_id] === 'x' && x == select_layer) {
              obj.once_memory[z][y][x] = obj.change_cubes[mapY][z];
            }
            if (layer_slice[layer_id] === 'y' && y == select_layer) {
              obj.once_memory[z][y][x] = obj.change_cubes[z][x];
            }
            if (layer_slice[layer_id] === 'z' && z == select_layer) {
              obj.once_memory[z][y][x] = obj.change_cubes[mapY][x];
            }
          }
        }
      }
      make_canvas (obj.once_memory);
      end_fun();
    }
    all_removeEventListener ();
    $('html').css('cursor', 'default');
  } catch (error) {
    all_removeEventListener ();
    $('html').css('cursor', 'default');
  }
}
function calculateDistanceAngle(x1, y1, x2, y2) {
  let angleRadians = Math.atan2(y2 - y1, x2 - x1);
  if (angleRadians < 0) {
    angleRadians += 2 * Math.PI;
  }
  let dx = x2 - x1;
  let dy = y2 - y1;
  let distance = Math.sqrt(dx * dx + dy * dy);
  return {ang: angleRadians, dis: distance};
}
function stroke_straight_path_with_line(e) {
  if (roll_back_obj.tableP.length > 0) {
    let xy_obj = roll_back_obj.tableP[roll_back_obj.tableP.length - 1];
    obj.start_x = xy_obj.x;
    obj.start_y = xy_obj.y;
  }
  if (obj.use === 'mouse') {
    obj.end_x = e.clientX;
    obj.end_y = e.clientY;
  }
  if (obj.use === 'touch') {
    obj.end_x = e.touches[0].clientX;
    obj.end_y = e.touches[0].clientY;
  }
  obj.end_x -= pac.getBoundingClientRect().left;
  obj.end_y -= pac.getBoundingClientRect().top;
  if (obj.end_x >= 0 && obj.end_x < pac.width && obj.end_y >=0 && obj.end_y < pac.height) {
    obj.end_x = Math.floor(obj.end_x / cell_size_pixel);
    obj.end_y = Math.floor(obj.end_y / cell_size_pixel);
  } else {
    return false;
  }
  let data = calculateDistanceAngle(obj.start_x, obj.start_y, obj.end_x, obj.end_y);
  let alt = $('#CP label.check .CPimg img.mImg').attr('alt');
  const image = cp_obj[alt].img;
  pactx.putImageData(obj.start_img, 0, 0);
  pactx.lineWidth = 0.5;
  pactx.strokeStyle = '#f5f5f5';
  pactx.fillStyle = 'white';
  if (!event.ctrlKey && event.shiftKey) {
    data.ang = roundToNearest45(data.ang);
    obj.end_x = obj.start_x + Math.round(data.dis * Math.cos(data.ang));
    obj.end_y = obj.start_y + Math.round(data.dis * Math.sin(data.ang));
  }
  for (let i = 0; i < data.dis; i++) {
    let x = obj.start_x + Math.round(i * Math.cos(data.ang));
    let y = obj.start_y + Math.round(i * Math.sin(data.ang));
    pactx.fillRect(x * cell_size_pixel, y * cell_size_pixel, cell_size_pixel, cell_size_pixel);
    if (!$('#for_cut_area').prop('checked')) {
      pactx.drawImage(image, x * cell_size_pixel, y * cell_size_pixel, cell_size_pixel, cell_size_pixel);
    }
    pactx.strokeRect(x * cell_size_pixel, y * cell_size_pixel, cell_size_pixel, cell_size_pixel);
  }
}
function stroke_path_with_rect(e) {
  if (obj.use === 'mouse') {
    obj.end_x = e.clientX;
    obj.end_y = e.clientY;
  }
  if (obj.use === 'touch') {
    obj.end_x = e.touches[0].clientX;
    obj.end_y = e.touches[0].clientY;
  }
  obj.end_x -= pac.getBoundingClientRect().left;
  obj.end_y -= pac.getBoundingClientRect().top;
  if (obj.end_x >= 0 && obj.end_x < pac.width && obj.end_y >=0 && obj.end_y < pac.height) {
    obj.end_x = Math.floor(obj.end_x / cell_size_pixel);
    obj.end_y = Math.floor(obj.end_y / cell_size_pixel);
  } else {
    return false;
  }
  let left = Math.min(obj.start_x, obj.end_x);
  let top = Math.min(obj.start_y, obj.end_y);
  let w = Math.abs(obj.start_x - obj.end_x);
  let h = Math.abs(obj.start_y - obj.end_y);
  let alt = $('#CP label.check .CPimg img.mImg').attr('alt');
  const image = cp_obj[alt].img;
  pactx.putImageData(obj.start_img, 0, 0);
  pactx.lineWidth = 0.5;
  pactx.strokeStyle = '#f5f5f5';
  pactx.fillStyle = 'white';
  if ($('#for_cut_area').prop('checked')) {
    alt = 0;
  }
  for (let y = top; y < (top + h); y++) {
    for (let x = left; x < (left + w); x++) {
      if ($('#for_path_area').prop('checked')) {
        if (x > left && x < (left + w) - 1 && y > top && y < (top + h) - 1) {
          continue;
        }
      }
      pactx.fillRect(x * cell_size_pixel, y * cell_size_pixel, cell_size_pixel, cell_size_pixel);
      if (alt != 0) {
        pactx.drawImage(image, x * cell_size_pixel, y * cell_size_pixel, cell_size_pixel, cell_size_pixel);
      }
      pactx.strokeRect(x * cell_size_pixel, y * cell_size_pixel, cell_size_pixel, cell_size_pixel);
    }
  }
}
function stroke_path_with_arc(e) {
  if (obj.use === 'mouse') {
    obj.end_x = e.clientX;
    obj.end_y = e.clientY;
  }
  if (obj.use === 'touch') {
    obj.end_x = e.touches[0].clientX;
    obj.end_y = e.touches[0].clientY;
  }
  obj.end_x -= pac.getBoundingClientRect().left;
  obj.end_y -= pac.getBoundingClientRect().top;
  if (obj.end_x >= 0 && obj.end_x < pac.width && obj.end_y >=0 && obj.end_y < pac.height) {
    obj.end_x = Math.floor(obj.end_x / cell_size_pixel);
    obj.end_y = Math.floor(obj.end_y / cell_size_pixel);
  } else {
    return false;
  }
  let data = calculateDistanceAngle(obj.start_x, obj.start_y, obj.end_x, obj.end_y);
  let alt = $('#CP label.check .CPimg img.mImg').attr('alt');
  const image = cp_obj[alt].img;
  pactx.putImageData(obj.start_img, 0, 0);
  pactx.lineWidth = 0.5;
  pactx.strokeStyle = '#f5f5f5';
  pactx.fillStyle = 'white';
  if ($('#for_cut_area').prop('checked')) {
    alt = 0;
  }
  const numPoints = 8;
  if (!$('#for_path_area').prop('checked')) {
    pactx.fillRect(obj.start_x * cell_size_pixel, obj.start_y * cell_size_pixel, cell_size_pixel, cell_size_pixel);
    if (alt != 0) {
      pactx.drawImage(image, obj.start_x * cell_size_pixel, obj.start_y * cell_size_pixel, cell_size_pixel, cell_size_pixel);
    }
    pactx.strokeRect(obj.start_x * cell_size_pixel, obj.start_y * cell_size_pixel, cell_size_pixel, cell_size_pixel);
  }
  for (let i = 0; i < data.dis; i++) {
    for (let j = 0; j < numPoints * 2 * i; j++) {
      const angle = (j / (numPoints * 2 * i)) * 2 * Math.PI;
      let x = obj.start_x + Math.round(i * Math.cos(angle));
      let y = obj.start_y + Math.round(i * Math.sin(angle));
      if ($('#for_path_area').prop('checked')) {
        if (i >= 0 && i < data.dis - 1) {
          continue;
        }
      }
      pactx.fillRect(x * cell_size_pixel, y * cell_size_pixel, cell_size_pixel, cell_size_pixel);
      if (alt != 0) {
        pactx.drawImage(image, x * cell_size_pixel, y * cell_size_pixel, cell_size_pixel, cell_size_pixel);
      }
      pactx.strokeRect(x * cell_size_pixel, y * cell_size_pixel, cell_size_pixel, cell_size_pixel);
    }
  }
}
function rect_FirstUp(e) {
  let left = Math.min(obj.start_x, obj.end_x);
  let top = Math.min(obj.start_y, obj.end_y);
  let w = Math.abs(obj.start_x - obj.end_x);
  let h = Math.abs(obj.start_y - obj.end_y);
  pactx.putImageData(obj.start_img, 0, 0);
  pactx.lineWidth = 0.5;
  pactx.strokeStyle = '#f5f5f5';
  pactx.fillStyle = 'white';
  obj.copy_img = {arry: [], basis: [left + w, top + h]};
  for (let y = 0; y < h; y++) {
    if (!obj.copy_img.arry[y]) {
      obj.copy_img.arry[y] = [];
    }
    for (let x = 0; x < w; x++) {
      obj.copy_img.arry[y][x] = obj.change_cubes[top + y][left + x];
      if ($('#for_cut_area').prop('checked')) {
        obj.change_cubes[top + y][left + x] = 0;
        pactx.fillRect((left + x) * cell_size_pixel, (top + y) * cell_size_pixel, cell_size_pixel, cell_size_pixel);
        pactx.strokeRect((left + x) * cell_size_pixel, (top + y) * cell_size_pixel, cell_size_pixel, cell_size_pixel);
      }
    }
  }
  if ($('#for_cut_area').prop('checked')) {
    for (let z = 0; z < obj.once_memory.length; z++) {
      for (let y = 0; y < obj.once_memory[z].length; y++) {
        for (let x = 0; x < obj.once_memory[z][y].length; x++) {
          let mapY = obj.once_memory[z].length - y - 1;
          if (layer_slice[layer_id] === 'x' && x == select_layer) {
            obj.once_memory[z][y][x] = obj.change_cubes[mapY][z];
          }
          if (layer_slice[layer_id] === 'y' && y == select_layer) {
            obj.once_memory[z][y][x] = obj.change_cubes[z][x];
          }
          if (layer_slice[layer_id] === 'z' && z == select_layer) {
            obj.once_memory[z][y][x] = obj.change_cubes[mapY][x];
          }
        }
      }
    }
    add_canvas_to_roll_back_obj (obj.once_memory);
    const iframeVariable = 'check_view';
    window.parent.postMessage({ iframeVariable }, '*');
  }
  all_removeEventListener ();
}
function rect_SecondUp(e) {
  count = 0;
  if (obj.want_if === 'copy_area_with_rect') {
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
        let mx = obj.end_x + x - (obj.copy_img.arry[y].length / 2);
        let my = obj.end_y + y - (obj.copy_img.arry.length / 2);
        if ($('#for_horizontal_flip').prop('checked')) {
          mx = obj.end_x - x + (obj.copy_img.arry[y].length / 2);
        }
        if ($('#for_vertical_flip').prop('checked')) {
          my = obj.end_y - y + (obj.copy_img.arry.length / 2);
        }
        mx = Math.round(mx);
        my = Math.round(my);
        if (mx >= 0 && mx < block_count && my >= 0 && my < block_count) {
          obj.change_cubes[my][mx] = alt;
        }
      }
    }
  }
  if (obj.want_if === 'resize_area_with_rect') {
    let w = obj.copy_img.arry[0].length;
    let h = obj.copy_img.arry.length;
    let centerX = obj.copy_img.basis[0] - w / 2;
    let centerY = obj.copy_img.basis[1] - h / 2;
    let data = calculateDistanceAngle(centerX, centerY, obj.end_x, obj.end_y);
    let baseData = calculateDistanceAngle(centerX, centerY, obj.copy_img.basis[0], obj.copy_img.basis[1]);
    for (let i = -data.dis; i <= data.dis; i++) {
      let cubeY = Math.round(centerY + i * Math.sin(data.ang));
      if (!event.ctrlKey && event.shiftKey) {
        cubeY = Math.round(centerY + i * Math.sin(baseData.ang) * Math.sign(Math.sin(data.ang)));
      }
      let y = Math.round(h / 2 + (baseData.dis / data.dis) * i * Math.sin(baseData.ang));
      for (let j = -data.dis; j <= data.dis; j++) {
        let cubeX = Math.round(centerX + j * Math.cos(data.ang));
        if (!event.ctrlKey && event.shiftKey) {
          cubeX = Math.round(centerX + j * Math.cos(baseData.ang) * Math.sign(Math.cos(data.ang)));
        }
        let x = Math.round(w / 2 + (baseData.dis / data.dis) * j * Math.cos(baseData.ang));
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
        obj.change_cubes[cubeY][cubeX] = alt;
      }
    }
  }
  if (obj.want_if === 'roll_area_with_rect') {
    const numPoints = 8;
    let w = obj.copy_img.arry[0].length;
    let h = obj.copy_img.arry.length;
    let centerX = obj.copy_img.basis[0] - w / 2;
    let centerY = obj.copy_img.basis[1] - h / 2;
    let data = calculateDistanceAngle(centerX, centerY, obj.end_x, obj.end_y);
    let baseData = calculateDistanceAngle(centerX, centerY, obj.copy_img.basis[0], obj.copy_img.basis[1]);
    for (let i = 0; i < baseData.dis; i++) {
      for (let j = 0; j < numPoints * 2 * i; j++) {
        const angle = (j / (numPoints * 2 * i)) * 2 * Math.PI;
        let x = Math.round(w / 2 + i * Math.cos(angle));
        let y = Math.round(h / 2 + i * Math.sin(angle));
        let rollAngle = data.ang - baseData.ang;
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
        obj.change_cubes[cubeY][cubeX] = alt;
      }
    }
  }
  for (let z = 0; z < obj.once_memory.length; z++) {
    for (let y = 0; y < obj.once_memory[z].length; y++) {
      for (let x = 0; x < obj.once_memory[z][y].length; x++) {
        let mapY = obj.once_memory[z].length - y - 1;
        if (layer_slice[layer_id] === 'x' && x == select_layer) {
          obj.once_memory[z][y][x] = obj.change_cubes[mapY][z];
        }
        if (layer_slice[layer_id] === 'y' && y == select_layer) {
          obj.once_memory[z][y][x] = obj.change_cubes[z][x];
        }
        if (layer_slice[layer_id] === 'z' && z == select_layer) {
          obj.once_memory[z][y][x] = obj.change_cubes[mapY][x];
        }
      }
    }
  }
  add_canvas_to_roll_back_obj (obj.once_memory);
  const iframeVariable = 'check_view';
  window.parent.postMessage({ iframeVariable }, '*');
  $.each(obj, function(index, value) {
    obj[index] = '';
  });
  all_removeEventListener ();
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
  obj.end_x -= pac.getBoundingClientRect().left;
  obj.end_y -= pac.getBoundingClientRect().top;
  if (obj.end_x >= 0 && obj.end_x < pac.width && obj.end_y >=0 && obj.end_y < pac.height) {
    obj.end_x = Math.floor(obj.end_x / cell_size_pixel);
    obj.end_y = Math.floor(obj.end_y / cell_size_pixel);
  } else {
    return false;
  }
  if (obj.copy_img === '') {
    let left = Math.min(obj.start_x, obj.end_x);
    let top = Math.min(obj.start_y, obj.end_y);
    let w = Math.abs(obj.start_x - obj.end_x);
    let h = Math.abs(obj.start_y - obj.end_y);
    pactx.putImageData(obj.start_img, 0, 0);
    pactx.strokeStyle = "black";
    pactx.lineWidth = 1;
    pactx.strokeRect(left * cell_size_pixel, top * cell_size_pixel, w * cell_size_pixel, h * cell_size_pixel);
    document.addEventListener('mouseup', rect_FirstUp);
    document.addEventListener('touchend', rect_FirstUp);
    return false;
  }
  if (obj.copy_img !== '') {
    count = 0;
    pactx.putImageData(obj.start_img, 0, 0);
    if (obj.want_if === 'copy_area_with_rect') {
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
          pactx.lineWidth = 0.5;
          pactx.strokeStyle = '#f5f5f5';
          pactx.fillStyle = 'white';
          let image = null;
          if (alt != 0) {
            image = cp_obj[alt].img;
          }
          if (!event.ctrlKey && event.shiftKey) {
            let centerX = obj.copy_img.basis[0] - obj.copy_img.arry[y].length / 2;
            let centerY = obj.copy_img.basis[1] - obj.copy_img.arry.length / 2;
            let gapX = Math.abs(obj.end_x - centerX);
            let gapY = Math.abs(obj.end_y - centerY);
            if (gapX < gapY) {
              obj.end_x = centerX;
            }
            else {
              obj.end_y = centerY;
            }
          }
          let mx = obj.end_x + x - (obj.copy_img.arry[y].length / 2);
          let my = obj.end_y + y - (obj.copy_img.arry.length / 2);
          if ($('#for_horizontal_flip').prop('checked')) {
            mx = obj.end_x - x + (obj.copy_img.arry[y].length / 2);
          }
          if ($('#for_vertical_flip').prop('checked')) {
            my = obj.end_y - y + (obj.copy_img.arry.length / 2);
          }
          mx = Math.round(mx);
          my = Math.round(my);
          if (mx >= 0 && mx < block_count && my >= 0 && my < block_count) {
            pactx.fillRect(mx * cell_size_pixel, my * cell_size_pixel, cell_size_pixel, cell_size_pixel);
            if (alt != 0) {
              pactx.drawImage(image, mx * cell_size_pixel, my * cell_size_pixel, cell_size_pixel, cell_size_pixel);
            }
            pactx.strokeRect(mx * cell_size_pixel, my * cell_size_pixel, cell_size_pixel, cell_size_pixel);
          }
        }
      }
    }
    if (obj.want_if === 'resize_area_with_rect') {
      let w = obj.copy_img.arry[0].length;
      let h = obj.copy_img.arry.length;
      let centerX = obj.copy_img.basis[0] - w / 2;
      let centerY = obj.copy_img.basis[1] - h / 2;
      let data = calculateDistanceAngle(centerX, centerY, obj.end_x, obj.end_y);
      let baseData = calculateDistanceAngle(centerX, centerY, obj.copy_img.basis[0], obj.copy_img.basis[1]);
      pactx.lineWidth = 0.5;
      pactx.strokeStyle = '#f5f5f5';
      pactx.fillStyle = 'white';
      for (let i = -data.dis; i <= data.dis; i++) {
        let cubeY = Math.round(centerY + i * Math.sin(data.ang));
        if (!event.ctrlKey && event.shiftKey) {
          cubeY = Math.round(centerY + i * Math.sin(baseData.ang) * Math.sign(Math.sin(data.ang)));
        }
        let y = Math.round(h / 2 + (baseData.dis / data.dis) * i * Math.sin(baseData.ang));
        for (let j = -data.dis; j <= data.dis; j++) {
          let cubeX = Math.round(centerX + j * Math.cos(data.ang));
          if (!event.ctrlKey && event.shiftKey) {
            cubeX = Math.round(centerX + j * Math.cos(baseData.ang) * Math.sign(Math.cos(data.ang)));
          }
          let x = Math.round(w / 2 + (baseData.dis / data.dis) * j * Math.cos(baseData.ang));
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
          let image = null;
          if (alt != 0) {
            image = cp_obj[alt].img;
          }
          pactx.fillRect(cubeX * cell_size_pixel, cubeY * cell_size_pixel, cell_size_pixel, cell_size_pixel);
          if (alt != 0) {
            pactx.drawImage(image, cubeX * cell_size_pixel, cubeY * cell_size_pixel, cell_size_pixel, cell_size_pixel);
          }
          pactx.strokeRect(cubeX * cell_size_pixel, cubeY * cell_size_pixel, cell_size_pixel, cell_size_pixel);
        }
      }
    }
    if (obj.want_if === 'roll_area_with_rect') {
      const numPoints = 8;
      let w = obj.copy_img.arry[0].length;
      let h = obj.copy_img.arry.length;
      let centerX = obj.copy_img.basis[0] - w / 2;
      let centerY = obj.copy_img.basis[1] - h / 2;
      let data = calculateDistanceAngle(centerX, centerY, obj.end_x, obj.end_y);
      let baseData = calculateDistanceAngle(centerX, centerY, obj.copy_img.basis[0], obj.copy_img.basis[1]);
      pactx.lineWidth = 0.5;
      pactx.strokeStyle = '#f5f5f5';
      pactx.fillStyle = 'white';
      for (let i = 0; i < baseData.dis; i++) {
        for (let j = 0; j < numPoints * 2 * i; j++) {
          const angle = (j / (numPoints * 2 * i)) * 2 * Math.PI;
          let x = Math.round(w / 2 + i * Math.cos(angle));
          let y = Math.round(h / 2 + i * Math.sin(angle));
          let rollAngle = data.ang - baseData.ang;
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
          let image = null;
          if (alt != 0) {
            image = cp_obj[alt].img;
          }
          pactx.fillRect(cubeX * cell_size_pixel, cubeY * cell_size_pixel, cell_size_pixel, cell_size_pixel);
          if (alt != 0) {
            pactx.drawImage(image, cubeX * cell_size_pixel, cubeY * cell_size_pixel, cell_size_pixel, cell_size_pixel);
          }
          pactx.strokeRect(cubeX * cell_size_pixel, cubeY * cell_size_pixel, cell_size_pixel, cell_size_pixel);
        }
      }
    }
    document.addEventListener('mouseup', rect_SecondUp);
    document.addEventListener('touchend', rect_SecondUp);
    return false;
  }
}
function return_want_if_at_tool (e) {
  let want_if = 'false';
  if ($('#zoom_scope_button').prop('checked')) {
    want_if = 'zoom_scope_button';
    return want_if;
  }
  else if ($('#color_dropper_icon').prop('checked')) {
    want_if = 'color_dropper_icon';
    return want_if;
  }
  else if ($('#jump_to_this_layer').prop('checked')) {
    want_if = 'jump_to_this_layer';
    return want_if;
  }
  else {
    if ($('#no_set_action').prop('checked')) {
      want_if = 'no_set_action';
    }
    if ($('#pen_tool').prop('checked')) {
      want_if = 'pen_tool';
    }
    if ($('#fill_tool_of_paint_roller').prop('checked')) {
      want_if = 'fill_tool_of_paint_roller';
    }
    if ($('#eraser_points_tool').prop('checked')) {
      want_if = 'eraser_points_tool';
    }
    if ($('#area_cut_tool_of_scissors').prop('checked')) {
      want_if = 'area_cut_tool_of_scissors';
    }
    if ($('#stroke_path_with_line').prop('checked')) {
      want_if = 'stroke_path_with_line';
    }
    if ($('#stroke_path_with_rect').prop('checked')) {
      want_if = 'stroke_path_with_rect';
    }
    if ($('#stroke_path_with_arc').prop('checked')) {
      want_if = 'stroke_path_with_arc';
    }
    if ($('#copy_area_with_rect').prop('checked')) {
      want_if = 'copy_area_with_rect';
    }
    if ($('#resize_area_with_rect').prop('checked')) {
      want_if = 'resize_area_with_rect';
    }
    if ($('#roll_area_with_rect').prop('checked')) {
      want_if = 'roll_area_with_rect';
    }
    return want_if;
  }
}
function scroll_canvas_at_edge (e) {
  let element = document.querySelector('#editing_areas');
  let c_h = element.clientHeight;
  let c_t = element.getBoundingClientRect().top;
  let c_w = element.clientWidth;
  let c_l = element.getBoundingClientRect().left;
  let move_x, move_y;
  if (obj.use === 'mouse') {
    move_x = e.clientX;
    move_y = e.clientY;
  }
  if (obj.use === 'touch') {
    move_x = e.touches[0].clientX;
    move_y = e.touches[0].clientY;
  }
  if (move_x <= c_l + 40) {
    element.scrollLeft -= 20;
  }
  if (move_y <= c_t + 40) {
    element.scrollTop -= 20;
  }
  if (move_x >= c_w + c_l - 40) {
    element.scrollLeft += 20;
  }
  if (move_y >= c_h + c_t - 40) {
    element.scrollTop += 20;
  }
}
function choose_fun (e) {
  scroll_canvas_at_edge (e);
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
}
/*escape for touch test*/
pac.onmousedown = function (e) {
  if (!do_flag) {
    let str;
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "処理が正しく完了できませんでした。ページの更新をお願い致します。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "The process could not be completed correctly. Please reload the page.";
    }
    window.alert(str);
    return false;
  }
  if (!$('#editing_2d').prop('checked')) {
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
  if (obj.want_if === 'zoom_scope_button' || obj.want_if === 'no_set_action') {
    do_flag = true;
    all_removeEventListener ();
    return false;
  }
  if (roll_back_obj.art.length - roll_back_obj.c_art - 1 < 0) {
    roll_back_obj.c_art = roll_back_obj.art.length - 1;
  }
  obj.once_memory = deepCopyArray(roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1]);
  obj.change_cubes = [];
  for (let z = 0; z < obj.once_memory.length; z++) {
    for (let y = 0; y < obj.once_memory[z].length; y++) {
      for (let x = 0; x < obj.once_memory[z][y].length; x++) {
        let mapY = obj.once_memory[z].length - y - 1;
        if (layer_slice[layer_id] === 'x' && x == select_layer) {
          if (!obj.change_cubes[mapY]) {
            obj.change_cubes[mapY] = [];
          }
          obj.change_cubes[mapY][z] = obj.once_memory[z][y][x];
        }
        if (layer_slice[layer_id] === 'y' && y == select_layer) {
          if (!obj.change_cubes[z]) {
            obj.change_cubes[z] = [];
          }
          obj.change_cubes[z][x] = obj.once_memory[z][y][x];
        }
        if (layer_slice[layer_id] === 'z' && z == select_layer) {
          if (!obj.change_cubes[mapY]) {
            obj.change_cubes[mapY] = [];
          }
          obj.change_cubes[mapY][x] = obj.once_memory[z][y][x];
        }
      }
    }
  }
  obj.start_x = e.clientX - pac.getBoundingClientRect().left;
  obj.start_y = e.clientY - pac.getBoundingClientRect().top;
  obj.start_img = pactx.getImageData(0, 0, pac.width, pac.height);
  if (obj.start_x >= 0 && obj.start_x < pac.width && obj.start_y >=0 && obj.start_y < pac.height) {
    obj.start_x = Math.floor(obj.start_x / cell_size_pixel);
    obj.start_y = Math.floor(obj.start_y / cell_size_pixel);
  }
  else {
    do_flag = true;
    all_removeEventListener (e);
    return false;
  }
  if (obj.want_if === 'fill_tool_of_paint_roller' || obj.want_if === 'area_cut_tool_of_scissors') {
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
    $('html').css('cursor', 'wait');
    setTimeout(() => {
      fill_tool_of_paint_roller(e);
    }, "1");
  }
  else if (obj.want_if === 'jump_to_this_layer') {
    jump_to_this_layer();
  }
  else if (obj.want_if === 'color_dropper_icon') {
    color_dropper_icon(e);
  }
  else if (obj.want_if === 'stroke_path_with_line') {
    while (roll_back_obj.c_one_time > 0) {
      roll_back_obj.tableP.pop();
      roll_back_obj.c_one_time--;
    }
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
    pac.addEventListener('mousemove', choose_fun);
    pac.addEventListener('mouseup', end_fun);
  }
  else if (obj.want_if === 'copy_area_with_rect' || obj.want_if === 'resize_area_with_rect' || obj.want_if === 'roll_area_with_rect') {
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
    pac.addEventListener('mousemove', choose_fun);
  }
  else {
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
    pac.addEventListener('mousemove', choose_fun);
    pac.addEventListener('mouseup', end_fun);
  }
};
pac.addEventListener('touchstart', (e) => {
  if (!do_flag) {
    let str;
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "処理が正しく完了できませんでした。ページの更新をお願い致します。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "The process could not be completed correctly. Please reload the page.";
    }
    window.alert(str);
    return false;
  }
  if (!$('#editing_2d').prop('checked')) {
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
  if (obj.want_if === 'zoom_scope_button' || obj.want_if === 'no_set_action') {
    do_flag = true;
    all_removeEventListener ();
    return false;
  }
  if (roll_back_obj.art.length - roll_back_obj.c_art - 1 < 0) {
    roll_back_obj.c_art = roll_back_obj.art.length - 1;
  }
  obj.once_memory = deepCopyArray(roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1]);
  obj.change_cubes = [];
  for (let z = 0; z < obj.once_memory.length; z++) {
    for (let y = 0; y < obj.once_memory[z].length; y++) {
      for (let x = 0; x < obj.once_memory[z][y].length; x++) {
        let mapY = obj.once_memory[z].length - y - 1;
        if (layer_slice[layer_id] === 'x' && x == select_layer) {
          if (!obj.change_cubes[mapY]) {
            obj.change_cubes[mapY] = [];
          }
          obj.change_cubes[mapY][z] = obj.once_memory[z][y][x];
        }
        if (layer_slice[layer_id] === 'y' && y == select_layer) {
          if (!obj.change_cubes[z]) {
            obj.change_cubes[z] = [];
          }
          obj.change_cubes[z][x] = obj.once_memory[z][y][x];
        }
        if (layer_slice[layer_id] === 'z' && z == select_layer) {
          if (!obj.change_cubes[mapY]) {
            obj.change_cubes[mapY] = [];
          }
          obj.change_cubes[mapY][x] = obj.once_memory[z][y][x];
        }
      }
    }
  }
  obj.start_x = e.touches[0].clientX - pac.getBoundingClientRect().left;
  obj.start_y = e.touches[0].clientY - pac.getBoundingClientRect().top;
  obj.start_img = pactx.getImageData(0, 0, pac.width, pac.height);
  if (obj.start_x >= 0 && obj.start_x < pac.width && obj.start_y >=0 && obj.start_y < pac.height) {
    obj.start_x = Math.floor(obj.start_x / cell_size_pixel);
    obj.start_y = Math.floor(obj.start_y / cell_size_pixel);
  }
  else {
    do_flag = true;
    all_removeEventListener (e);
    return false;
  }
  if (obj.want_if === 'fill_tool_of_paint_roller' || obj.want_if === 'area_cut_tool_of_scissors') {
    document.addEventListener('touchstart', handleTouchMove, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    $('html').css('cursor', 'wait');
    setTimeout(() => {
      fill_tool_of_paint_roller(e);
    }, "1");
  }
  else if (obj.want_if === 'jump_to_this_layer') {
    jump_to_this_layer();
  }
  else if (obj.want_if === 'color_dropper_icon') {
    color_dropper_icon(e);
  }
  else if (obj.want_if === 'stroke_path_with_line') {
    while (roll_back_obj.c_one_time > 0) {
      roll_back_obj.tableP.pop();
      roll_back_obj.c_one_time--;
    }
    document.addEventListener('touchstart', handleTouchMove, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    pac.addEventListener('touchmove', choose_fun);
    pac.addEventListener('touchend', end_fun);
  }
  else if (obj.want_if === 'copy_area_with_rect' || obj.want_if === 'resize_area_with_rect' || obj.want_if === 'roll_area_with_rect') {
    document.addEventListener('touchstart', handleTouchMove, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    pac.addEventListener('touchmove', choose_fun);
  }
  else {
    document.addEventListener('touchstart', handleTouchMove, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    pac.addEventListener('touchmove', choose_fun);
    pac.addEventListener('touchend', end_fun);
  }
});
/*all removeEventListener at window remove*/
document.addEventListener('beforeunload', all_removeEventListener);
document.addEventListener('mouseleave', all_removeEventListener);
/* ++button action++ */
//canvas clear action
$('#clear_canvas').click((e) => {
  if (!$('#editing_2d').prop('checked')) {
    return true;
  }
  let str = '';
  if ($('header .header_form p.language').text() === 'Japanese') {
    str = "キャンバスを消去します。";
  }
  if ($('header .header_form p.language').text() === '英語') {
    str = "Clear the canvas.";
  }
  let result = window.parent.confirm(str);
  if (!result) {
    return false;
  }
  //canvas
  pactx.fillStyle = 'white';
  pactx.fillRect(0, 0, pac.width, pac.height);
  pactx.lineWidth = 0.5;
  pactx.strokeStyle = '#f5f5f5';
  for (let x = 0; x < block_count; x++) {
    pactx.beginPath();
    pactx.moveTo(x * cell_size_pixel, 0);
    pactx.lineTo(x * cell_size_pixel, pac.width);
    pactx.stroke();
  }
  for (let y = 0; y < block_count; y++) {
    pactx.beginPath();
    pactx.moveTo(0, y * cell_size_pixel);
    pactx.lineTo(pac.height, y * cell_size_pixel);
    pactx.stroke();
  }
  let newArry = [];
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
  add_canvas_to_roll_back_obj (newArry);
  const iframeVariable = 'check_view';
  window.parent.postMessage({ iframeVariable }, '*');
  $.each(obj, function(index, value) {
    obj[index] = '';
  });
});
//change_cube_size
function change_cube_size (pattern) {
  //change select list
  cell_size_pixel = pac.width / block_count;
  layer_id = $('.layer_selector select.appear').attr('id');
  select_layer = Math.floor(block_count / 2);
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
  $('#select_vertical_layers').html(vertical_layer_html);
  $('#select_side_layers').html(vertical_layer_html);
  $('#select_horizon_layers').html(vertical_layer_html);
  focus_point.forEach((item, i) => {
    focus_point[i] = select_layer;
  });
  //arry
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
        newArry[z][y][x] = alt;
      }
    }
  }
  make_canvas (newArry);
  if (pattern === 'resize') {
    add_canvas_to_roll_back_obj (newArry);
  }
  const iframeVariable = 'change_cube_size';
  window.parent.postMessage({ iframeVariable }, '*');
}
$('#resize_button').click((e) => {
  if (!$('#editing_2d').prop('checked')) {
    return true;
  }
  if (roll_back_obj.art.length - roll_back_obj.c_art - 1 < 0) {
    roll_back_obj.c_art = roll_back_obj.art.length - 1;
  }
  obj.once_memory = deepCopyArray(roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1]);
  block_count = $('#art_size').val();
  if (block_count === '') {
    document.querySelector('#art_size').value = obj.once_memory.length;
    block_count = obj.once_memory.length;
  }
  if (block_count < obj.once_memory.length) {
    let result;
    if ($('header .header_form p.language').text() === 'Japanese') {
      result = confirm('アートが消えますが続けますか？');
    }
    if ($('header .header_form p.language').text() === '英語') {
      result = confirm('The Art maybe be disappeared, will you continue?');
    }
    if (result) {
      change_cube_size ('resize');
      return false;
    }
    else {
      document.querySelector('#art_size').value = obj.once_memory.length;
      return false;
    }
  }
  if (block_count >= obj.once_memory.length) {
    change_cube_size ('resize');
    return false;
  }
});
//ZoomUpDown action
function resize_canvas (scale, point) {
  let edit = document.getElementById('editing_areas');
  cell_size_pixel = pac.width / block_count;
  point.x = Math.floor(point.x / cell_size_pixel);
  point.y = Math.floor(point.y / cell_size_pixel);
  pac.width = Math.round(scale * 600);
  pac.height = Math.round(scale * 600);
  cell_size_pixel = pac.width / block_count;
  let value = roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1];
  make_canvas (value);
  point.x = point.x * cell_size_pixel - edit.clientWidth / 2;
  point.y = point.y * cell_size_pixel - edit.clientHeight / 2;
  edit.scrollLeft = point.x;
  edit.scrollTop = point.y;
}
function scope_action(scope) {
  let scale = $("#art_scale").val();
  scale = Number(scale);
  let edit = document.getElementById('editing_areas');
  let point = {x: edit.clientWidth / 2 + edit.scrollLeft, y: edit.clientHeight / 2 + edit.scrollTop};
  if (scope === 'plus') {
    scale = scale * 1.1;
  }
  if (scope === 'minus') {
    scale = scale * 0.9;
  }
  scale = Math.round(scale);
  $("#art_scale").val(scale);
  scale = scale / 100;
  resize_canvas (scale, point);
}
$('.zoom_in_out_scope .plus_scope_icon').click((e) => {
  if (!$('#editing_2d').prop('checked')) {
    return true;
  }
  scope_action('plus');
});
$('.zoom_in_out_scope .minus_scope_icon').click((e) => {
  if (!$('#editing_2d').prop('checked')) {
    return true;
  }
  scope_action('minus');
});
$('#art_scale').change((e) => {
  let scale = $("#art_scale").val();
  scale = Number(scale);
  scale = scale / 100;
  let edit = document.getElementById('editing_areas');
  let point = {x: edit.clientWidth / 2 + edit.scrollLeft, y: edit.clientHeight / 2 + edit.scrollTop};
  resize_canvas (scale, point);
});
//layer_change
document.querySelector('#jump_to_this_layer').addEventListener('change', (e) => {
  if (!$('#editing_2d').prop('checked')) {
    return true;
  }
  pactx.lineWidth = 0.5;
  pactx.strokeStyle = '#f5f5f5';
  for (let x = 0; x < block_count; x++) {
    pactx.beginPath();
    pactx.moveTo(x * cell_size_pixel, 0);
    pactx.lineTo(x * cell_size_pixel, pac.width);
    pactx.stroke();
  }
  for (let y = 0; y < block_count; y++) {
    pactx.beginPath();
    pactx.moveTo(0, y * cell_size_pixel);
    pactx.lineTo(pac.height, y * cell_size_pixel);
    pactx.stroke();
  }
  if (roll_back_obj.art.length - roll_back_obj.c_art - 1 < 0) {
    roll_back_obj.c_art = roll_back_obj.art.length - 1;
  }
  obj.once_memory = deepCopyArray(roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1]);
  pactx.strokeStyle = '#ff0000';
  let targetX = focus_point[0];
  let targetY = obj.once_memory.length - focus_point[1];
  let targetZ = focus_point[2];
  if (layer_slice[layer_id] === 'x') {
    pactx.strokeRect(targetZ * cell_size_pixel, (targetY - 1) * cell_size_pixel, cell_size_pixel, cell_size_pixel);
  }
  if (layer_slice[layer_id] === 'y') {
    pactx.strokeRect(targetX * cell_size_pixel, targetZ * cell_size_pixel, cell_size_pixel, cell_size_pixel);
  }
  if (layer_slice[layer_id] === 'z') {
    pactx.strokeRect(targetX * cell_size_pixel, (targetY - 1) * cell_size_pixel, cell_size_pixel, cell_size_pixel);
  }
});
document.querySelector('.layer_selector .layer_change').addEventListener('click', (e) => {
  if (!$('#editing_2d').prop('checked')) {
    return true;
  }
  layer_id = $('.layer_selector select.appear').attr('id');
  $('#' + layer_id).removeClass('appear');
  $('label[for="' + layer_id + '"]').removeClass('appear');
  switch (layer_id) {
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
  $('#' + layer_id).addClass('appear');
  $('label[for="' + layer_id + '"]').addClass('appear');
  $('#' + layer_id).val(select_layer);
  $('#' + layer_id + ' option.selected').removeClass('selected');
  $('#' + layer_id + ' option[value="' + select_layer + '"]').addClass('selected');
  if (roll_back_obj.art.length - roll_back_obj.c_art - 1 < 0) {
    roll_back_obj.c_art = roll_back_obj.art.length - 1;
  }
  make_canvas (roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1]);
});
document.querySelectorAll('.layer_selector select').forEach(select => {
  select.addEventListener('change', (e) => {
    if (!$('#editing_2d').prop('checked')) {
      return true;
    }
    layer_id = $('.layer_selector select.appear').attr('id');
    select_layer = Number($('#' + layer_id).val());
    switch (layer_id) {
      case 'select_side_layers':
      focus_point[0] = select_layer;
      break;
      case 'select_horizon_layers':
      focus_point[1] = select_layer;
      break;
      case 'select_vertical_layers':
      focus_point[2] = select_layer;
      break;
      default:
      // もし想定外の場合の処理を書く
      break;
    }
    if (roll_back_obj.art.length - roll_back_obj.c_art - 1 < 0) {
      roll_back_obj.c_art = roll_back_obj.art.length - 1;
    }
    make_canvas (roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1]);
  });
});
//do undo
function roll_back (e) {
  roll_back_obj.c_one_time++;
  roll_back_obj.c_art++;
  if (roll_back_obj.c_art >= roll_back_obj.art.length) {
    roll_back_obj.c_art--;
    roll_back_obj.c_one_time = roll_back_obj.c_art;
    return false;
  }
  let value = roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1];
  if (value.length == block_count) {
    make_canvas (value);
    const iframeVariable = 'check_view';
    window.parent.postMessage({ iframeVariable }, '*');
  }
  else {
    block_count = value.length;
    $('#art_size').val(value.length);
    change_cube_size ('do_undo');
  }
}
function roll_forward (e) {
  roll_back_obj.c_one_time--;
  if (roll_back_obj.c_one_time < 0) {
    roll_back_obj.c_one_time = 0;
  }
  roll_back_obj.c_art--;
  if (roll_back_obj.c_art < 0) {
    roll_back_obj.c_art = 0;
    return false;
  }
  let value = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
  if (value.length == block_count) {
    make_canvas (value);
    const iframeVariable = 'check_view';
    window.parent.postMessage({ iframeVariable }, '*');
  }
  else {
    block_count = value.length;
    $('#art_size').val(value.length);
    change_cube_size ('do_undo');
  }
}
$('.roll_back_and_forward .roll_back').click((e) => {
  if (!$('#editing_2d').prop('checked')) {
    return true;
  }
  roll_back (e);
});
$('.roll_back_and_forward .roll_forward').click((e) => {
  if (!$('#editing_2d').prop('checked')) {
    return true;
  }
  roll_forward (e);
});
//to_close_path
function check_fill (roll_back_obj, i, edge, alt) {
  obj.start_x = roll_back_obj.tableP[i].x;
  obj.start_y = roll_back_obj.tableP[i].y;
  for (let eY = 0; eY < edge.length; eY++) {
    if (edge[eY]) {
      for (let eX = 0; eX < edge[eY].length; eX++) {
        if (edge[eY][eX] === 'edge') {
          obj.end_x = eX;
          obj.end_y = eY;
          let data = calculateDistanceAngle(obj.start_x, obj.start_y, obj.end_x, obj.end_y);
          for (let i = 0; i < data.dis; i++) {
            let x = obj.start_x + Math.round(i * Math.cos(data.ang));
            let y = obj.start_y + Math.round(i * Math.sin(data.ang));
            if (
              obj.change_cubes[y] !== undefined &&
              obj.change_cubes[y][x] !== undefined &&
              obj.change_cubes[y][x] !== alt
            ) {
              obj.change_cubes[y][x] = alt;
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
  if (roll_back_obj.art.length - roll_back_obj.c_art - 1 < 0) {
    roll_back_obj.c_art = roll_back_obj.art.length - 1;
  }
  let edge = [];
  roll_back_obj.tableP.forEach((item, n) => {
    if (n >= roll_back_obj.tableP.length - 1) {
      return false;
    }
    let data = calculateDistanceAngle(item.x, item.y, roll_back_obj.tableP[n + 1].x, roll_back_obj.tableP[n + 1].y);
    for (let i = 0; i < data.dis; i++) {
      let x = item.x + Math.round(i * Math.cos(data.ang));
      let y = item.y + Math.round(i * Math.sin(data.ang));
      if (x >= 0 && x < block_count && y >= 0 && y < block_count) {
        if (!edge[y]) {
          edge[y] = [];
        }
        edge[y][x] = 'edge';
      }
    }
  });
  obj.once_memory = deepCopyArray(roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1]);
  obj.change_cubes = [];
  for (let z = 0; z < obj.once_memory.length; z++) {
    for (let y = 0; y < obj.once_memory[z].length; y++) {
      for (let x = 0; x < obj.once_memory[z][y].length; x++) {
        let mapY = obj.once_memory[z].length - y - 1;
        if (layer_slice[layer_id] === 'x' && x == select_layer) {
          if (!obj.change_cubes[mapY]) {
            obj.change_cubes[mapY] = [];
          }
          obj.change_cubes[mapY][z] = obj.once_memory[z][y][x];
        }
        if (layer_slice[layer_id] === 'y' && y == select_layer) {
          if (!obj.change_cubes[z]) {
            obj.change_cubes[z] = [];
          }
          obj.change_cubes[z][x] = obj.once_memory[z][y][x];
        }
        if (layer_slice[layer_id] === 'z' && z == select_layer) {
          if (!obj.change_cubes[mapY]) {
            obj.change_cubes[mapY] = [];
          }
          obj.change_cubes[mapY][x] = obj.once_memory[z][y][x];
        }
      }
    }
  }
  let alt = $('#CP label.check .CPimg img.mImg').attr('alt');
  if ($('#for_path_area').prop('checked')) {
    obj.start_x = roll_back_obj.tableP[roll_back_obj.tableP.length - 1].x;
    obj.start_y = roll_back_obj.tableP[roll_back_obj.tableP.length - 1].y;
    obj.end_x = roll_back_obj.tableP[0].x;
    obj.end_y = roll_back_obj.tableP[0].y;
    let data = calculateDistanceAngle(obj.start_x, obj.start_y, obj.end_x, obj.end_y);
    for (let i = 0; i < data.dis; i++) {
      let x = obj.start_x + Math.round(i * Math.cos(data.ang));
      let y = obj.start_y + Math.round(i * Math.sin(data.ang));
      if (
        obj.change_cubes[y] !== undefined &&
        obj.change_cubes[y][x] !== undefined &&
        obj.change_cubes[y][x] !== alt
      ) {
        obj.change_cubes[y][x] = alt;
      }
    }
  }
  if ($('#for_fill_area').prop('checked')) {
    for (let i = 0; i < roll_back_obj.tableP.length; i++) {
      check_fill (roll_back_obj, i, edge, alt);
    }
  }
  if ($('#for_cut_area').prop('checked')) {
    alt = 0;
    for (let i = 0; i < roll_back_obj.tableP.length; i++) {
      check_fill (roll_back_obj, i, edge, alt);
    }
  }
  for (let z = 0; z < obj.once_memory.length; z++) {
    for (let y = 0; y < obj.once_memory[z].length; y++) {
      for (let x = 0; x < obj.once_memory[z][y].length; x++) {
        let mapY = obj.once_memory[z].length - y - 1;
        if (layer_slice[layer_id] === 'x' && x == select_layer) {
          obj.once_memory[z][y][x] = obj.change_cubes[mapY][z];
        }
        if (layer_slice[layer_id] === 'y' && y == select_layer) {
          obj.once_memory[z][y][x] = obj.change_cubes[z][x];
        }
        if (layer_slice[layer_id] === 'z' && z == select_layer) {
          obj.once_memory[z][y][x] = obj.change_cubes[mapY][x];
        }
      }
    }
  }
  roll_back_obj.tableP = [];
  roll_back_obj.one_time_img = [];
  roll_back_obj.c_one_time = 0;
  make_canvas (obj.once_memory);
  add_canvas_to_roll_back_obj (obj.once_memory);
  const iframeVariable = 'check_view';
  window.parent.postMessage({ iframeVariable }, '*');
}
function to_open_path (e) {
  if ($('#for_path_area').prop('checked') || $('#for_cut_area').prop('checked')) {
    roll_back_obj.tableP = [];
    roll_back_obj.one_time_img = [];
    roll_back_obj.c_one_time = 0;
    return false;
  }
  to_close_path (e);
}
$('.normal_tool .sub_normal_tool .to_close_path').click((e) => {
  if (!$('#editing_2d').prop('checked')) {
    return true;
  }
  to_close_path (e);
});
$('.normal_tool .sub_normal_tool .to_open_path').click((e) => {
  if (!$('#editing_2d').prop('checked')) {
    return true;
  }
  to_open_path (e);
});
//layer copy paste
function layer_copy (pattern) {
  obj.copy_img = [];
  layer_id = document.querySelector('.layer_selector select.appear').id;
  select_layer = parent.document.querySelector('#' + layer_id).value;
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
    $('.layer_selector .layer_copy').addClass('copyed');
  }
  else if (pattern === 'cut') {
    make_canvas (obj.change_cubes);
    add_canvas_to_roll_back_obj (obj.change_cubes);
    const iframeVariable = 'check_view';
    window.parent.postMessage({ iframeVariable }, '*');
    $('.layer_selector .layer_cut').addClass('copyed');
  }
}
async function layer_paste (e) {
  layer_id = document.querySelector('.layer_selector select.appear').id;
  select_layer = document.querySelector('#' + layer_id).value;
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
  make_canvas (obj.change_cubes);
  add_canvas_to_roll_back_obj (obj.change_cubes);
  const iframeVariable = 'check_view';
  window.parent.postMessage({ iframeVariable }, '*');
  window.parent.$('.layer_selector .layer_copy').removeClass('copyed');
  window.parent.$('.layer_selector .layer_cut').removeClass('copyed');
  $.each(obj, function(index, value) {
    obj[index] = '';
  });
}
$('.layer_selector .layer_copy').click((e) => {
  if (!$('#editing_2d').prop('checked')) {
    return true;
  }
  layer_copy ('copy');
});
$('.layer_selector .layer_cut').click((e) => {
  if (!$('#editing_2d').prop('checked')) {
    return true;
  }
  layer_copy ('cut');
});
$('.layer_selector .layer_paste').click((e) => {
  if (!$('#editing_2d').prop('checked')) {
    return true;
  }
  layer_paste (e);
});
//shortcuts for roll_back_and_forward & ZoomUpDown
function keydown_event(e) {
  //ctrl only
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyZ") {
    event.preventDefault();
    $('.roll_back_and_forward .roll_back').click();
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyC") {
    event.preventDefault();
    $('.layer_selector .layer_copy').click();
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyX") {
    event.preventDefault();
    $('.layer_selector .layer_cut').click();
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyV") {
    event.preventDefault();
    $('.layer_selector .layer_paste').click();
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "NumpadAdd") {
    event.preventDefault();
    $('.zoom_in_out_scope .plus_scope_icon').click();
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "NumpadSubtract") {
    event.preventDefault();
    $('.zoom_in_out_scope .minus_scope_icon').click();
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyS") {
    event.preventDefault();
    if ($('#syncer-acdn-03 li[data-target="target_memorys"] p.target').length) {
      let target_id = $('#syncer-acdn-03 li[data-target="target_memorys"] p.target').parent().attr('id');
      if ($('#' + target_id).attr('data-check') === undefined || !$('#' + target_id).attr('data-check').length) {
        $('#' + target_id).children('i[onclick="otm_save(this)"]').click();
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
    $('.layer_selector .layer_change').click();
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyE") {
    event.preventDefault();
    $('.normal_tool .sub_normal_tool .to_close_path').click();
  }
  //shift + ctrl
  if(event.ctrlKey && event.shiftKey && event.code === "KeyZ") {
    event.preventDefault();
    $('.roll_back_and_forward .roll_forward').click();
  }
  if(event.ctrlKey && event.shiftKey && event.code === "KeyE") {
    event.preventDefault();
    $('.normal_tool .sub_normal_tool .to_open_path').click();
  }
}
document.addEventListener('keydown', keydown_event, false);
