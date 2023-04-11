/*++reserve objects++*/
let obj = { start_x: '', start_y: '', start_img: '', copy_img: '',
td_x: '', tr_y: '', td_bgColor: '', target_id: '', bef_x: '', bef_y: '', start_td_x: '', start_tr_y: '',
$target: '', target_w: '', target_h: '',
$icon: '', icon_top: '', icon_left: '',
use: '', want_if: '', once_memory: '', range: '', focus_layer: '',
pop_text: '', parent_class: '',
dl_name: '', dl_img: '', dl_c: '', area_top: '', area_left: '', area_w: '', area_h: ''};
let memory_obj = {};
let roll_back_obj = {art: [], c_art: 0, check_view: ''};
/*++reserve functions++*/
function handleTouchMove(event) {
  event.preventDefault();
}
function pop_text_at_hover (e) {
  let x,y;
  if (obj.use === 'mouse') {
    x = e.clientX;
    y = e.clientY;
  }
  if (obj.use === 'touch') {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  }
  $('body').append('<p id="CP_img_explanation">' + obj.pop_text + '</p>');
  let left = x;
  left = left + 10;
  let top = y;
  $('#CP_img_explanation').css('top', top);
  $('#CP_img_explanation').css('left', left);
}
function toggle_radio_checked (id) {
  //memory reset
  $.each(obj, function(index, value) {
    obj[index] = '';
  });
  array_match_cell = [];
  count = 0;
  cancel_jump_layer_point();
  //toggle_action
  if ($('#' + id).prop('checked')) {
    setTimeout(() => {
      $('#' + id).prop('checked', false);
      $('#no_set_action').prop('checked', true);
    }, "1")
  }
  if (!$('#' + id).prop('checked')) {
    return true;
  }
}
function return_img_html_arry_rgb (palette_color_box_id) {
  let img = $("#" + palette_color_box_id + " .CPimg").find('img.mImg');
  let html = jQuery("<div>").append(img.clone(true)).html();
  let color = img.css('backgroundColor');
  let arry_rgb = rgb_to_return_array_rgb (color);
  return {html: html, rgb: arry_rgb};
}
function add_new_obj_to_memory_obj (key,value) {
  memory_obj[key] = value;
}
function delete_memory_from_memory_obj (key) {
  delete memory_obj[key];
}
function add_canvas_to_roll_back_obj (value) {
  let memory_amount = 100;
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
function change_to_vertical_layer (e) {
  $('#no_set_action').click();
  $('#select_vertical_layers').addClass('appear');
  $('#select_vertical_layers ~ label[for="select_vertical_layers"]').addClass('appear');
  $('#select_horizon_layers').removeClass('appear');
  $('#select_horizon_layers ~ label[for="select_horizon_layers"]').removeClass('appear');
  $('#select_side_layers').removeClass('appear');
  $('#select_side_layers ~ label[for="select_side_layers"]').removeClass('appear');
}
function change_to_side_layer (e) {
  $('#no_set_action').click();
  $('#select_side_layers').addClass('appear');
  $('#select_side_layers ~ label[for="select_side_layers"]').addClass('appear');
  $('#select_vertical_layers').removeClass('appear');
  $('#select_vertical_layers ~ label[for="select_vertical_layers"]').removeClass('appear');
  $('#select_horizon_layers').removeClass('appear');
  $('#select_horizon_layers ~ label[for="select_horizon_layers"]').removeClass('appear');
}
function change_to_horizon_layers (e) {
  $('#no_set_action').click();
  $('#select_horizon_layers').addClass('appear');
  $('#select_horizon_layers ~ label[for="select_horizon_layers"]').addClass('appear');
  $('#select_vertical_layers').removeClass('appear');
  $('#select_vertical_layers ~ label[for="select_vertical_layers"]').removeClass('appear');
  $('#select_side_layers').removeClass('appear');
  $('#select_side_layers ~ label[for="select_side_layers"]').removeClass('appear');
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
/*https://qiita.com/Tatamo/items/444969a7ff2fbba30479*/
function copyMatrix(base) {
  const result = [];
  base.forEach((layer_z, z) => {
    if (!result[z]) {
      result[z] = [];
    }
    layer_z.forEach((layer_y, y) => {
      if (!result[z][y]) {
        result[z][y] = [];
      }
      layer_y.forEach((layer_x, x) => {
        result[z][y][x] = base[z][y][x];
      });
    });
  });
  return result;
}
/*https://www.htmq.com/canvas/transform.shtml*/
function display_3d_blocks (
  ctx, block_size, sin_10deg, face_size,
  left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
  left_hori_begin_layer_minus, left_verti_begin_layer_minus,
  top_hori_begin_zero, top_verti_begin_zero,
  front_hori_begin_zero, front_verti_begin_layer_minus
) {
  ctx.setTransform(sin_10deg, -sin_10deg, 0, 1, block_size * left_p_begin_one, 0);
  ctx.fillRect(block_size * left_hori_begin_layer_minus, face_size * sin_10deg + block_size * left_verti_begin_layer_minus, block_size, block_size);
  ctx.setTransform(1, 0, -sin_10deg, sin_10deg, 0, block_size * top_p_begin_layer_minus);
  ctx.fillRect(face_size * sin_10deg + block_size * top_hori_begin_zero, block_size * top_verti_begin_zero, block_size, block_size);
  ctx.setTransform(1, 0, 0, 1, (face_size - block_size * front_p_begin_one) * sin_10deg, block_size * front_p_begin_one * sin_10deg);
  ctx.fillRect(block_size * front_hori_begin_zero, block_size * front_verti_begin_layer_minus, block_size, block_size);
}
function arry_into_check_view (e) {
  $('#check_view_button').css('display', 'none');
  let arry = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
  roll_back_obj.check_view = copyMatrix(arry);
  let layer_count = arry.length;
  let block_size = 10;
  $('#art_size').val(layer_count);
  let jump_layer_x = null;
  let jump_layer_y = null;
  let jump_layer_z = null;
  if (obj.focus_layer !== '') {
    if ($('#vertical_layer').prop('checked')) {
      jump_layer_x = obj.focus_layer.x;
      jump_layer_y = obj.focus_layer.y;
    }
    if ($('#side_layer').prop('checked')) {
      jump_layer_z = obj.focus_layer.x;
      jump_layer_y = obj.focus_layer.y;
    }
    if ($('#horizontal_layer').prop('checked')) {
      jump_layer_x = obj.focus_layer.x;
      jump_layer_z = obj.focus_layer.y;
    }
  }
  let sin_10deg = Math.sin(10 * Math.PI / 180);
  let face_size = layer_count * block_size;
  let canvas_size = Math.floor(face_size * (1 + sin_10deg)) + 1;
  let c = document.createElement("canvas");
  let ctx = c.getContext("2d");
  c.width = canvas_size;
  c.height = canvas_size;
  const cv = document.getElementById('check_view');
  const cvtx = cv.getContext('2d');
  cvtx.clearRect(0, 0, cv.width, cv.height);
  if ($('#cube_front.front').length && $('#cube_top.top').length) {
    for (let z = 0; z < layer_count; z++) {
      for (let y = layer_count - 1; y >= 0; y--) {
        for (let x = 0; x < layer_count; x++) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = x + 1;
          let top_p_begin_layer_minus = y;
          let front_p_begin_one = z + 1;
          let left_hori_begin_layer_minus = layer_count - (z + 1);
          let left_verti_begin_layer_minus = y;
          let top_hori_begin_zero = x;
          let top_verti_begin_zero = z;
          let front_hori_begin_zero = x;
          let front_verti_begin_layer_minus = y;
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_front.front').length && $('#cube_right.top').length) {
    for (let z = 0; z < layer_count; z++) {
      for (let y = layer_count - 1; y >= 0; y--) {
        for (let x = layer_count - 1; x >= 0; x--) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = layer_count - y;
          let top_p_begin_layer_minus = x;
          let front_p_begin_one = z + 1;
          let left_hori_begin_layer_minus = layer_count - (z + 1);
          let left_verti_begin_layer_minus = x;
          let top_hori_begin_zero = layer_count - (y + 1);
          let top_verti_begin_zero = z;
          let front_hori_begin_zero = layer_count - (y + 1);
          let front_verti_begin_layer_minus = x;
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_front.front').length && $('#cube_left.top').length) {
    for (let z = 0; z < layer_count; z++) {
      for (let y = 0; y < layer_count; y++) {
        for (let x = 0; x < layer_count; x++) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = y + 1;
          let top_p_begin_layer_minus = layer_count - (x + 1);
          let front_p_begin_one = z + 1;
          let left_hori_begin_layer_minus = layer_count - (z + 1);
          let left_verti_begin_layer_minus = layer_count - (x + 1);
          let top_hori_begin_zero = y;
          let top_verti_begin_zero = z;
          let front_hori_begin_zero = y;
          let front_verti_begin_layer_minus = layer_count - (x + 1);
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_front.front').length && $('#cube_bottom.top').length) {
    for (let z = 0; z < layer_count; z++) {
      for (let y = 0; y < layer_count; y++) {
        for (let x = layer_count - 1; x >= 0; x--) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = layer_count - x;
          let top_p_begin_layer_minus = layer_count - (y + 1);
          let front_p_begin_one = z + 1;
          let left_hori_begin_layer_minus = layer_count - (z + 1);
          let left_verti_begin_layer_minus = layer_count - (y + 1);
          let top_hori_begin_zero = layer_count - (x + 1);
          let top_verti_begin_zero = z;
          let front_hori_begin_zero = layer_count - (x + 1);
          let front_verti_begin_layer_minus = layer_count - (y + 1);
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_top.front').length && $('#cube_back.top').length) {
    for (let z = layer_count - 1; z >= 0; z--) {
      for (let y = layer_count - 1; y >= 0; y--) {
        for (let x = 0; x < layer_count; x++) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = x + 1;
          let top_p_begin_layer_minus = z;
          let front_p_begin_one = layer_count - y;
          let left_hori_begin_layer_minus = y;
          let left_verti_begin_layer_minus = z;
          let top_hori_begin_zero = x;
          let top_verti_begin_zero = layer_count - (y + 1);
          let front_hori_begin_zero = x;
          let front_verti_begin_layer_minus = z;
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_top.front').length && $('#cube_left.top').length) {
    for (let z = 0; z < layer_count; z++) {
      for (let y = layer_count - 1; y >= 0; y--) {
        for (let x = 0; x < layer_count; x++) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = z + 1;
          let top_p_begin_layer_minus = layer_count - (x + 1);
          let front_p_begin_one = layer_count - y;
          let left_hori_begin_layer_minus = y;
          let left_verti_begin_layer_minus = layer_count - (x + 1);
          let top_hori_begin_zero = z;
          let top_verti_begin_zero = layer_count - (y + 1);
          let front_hori_begin_zero = z;
          let front_verti_begin_layer_minus = layer_count - (x + 1);
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_top.front').length && $('#cube_right.top').length) {
    for (let z = layer_count - 1; z >= 0; z--) {
      for (let y = layer_count - 1; y >= 0; y--) {
        for (let x = layer_count - 1; x >= 0; x--) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = layer_count - z;
          let top_p_begin_layer_minus = x;
          let front_p_begin_one = layer_count - y;
          let left_hori_begin_layer_minus = y;
          let left_verti_begin_layer_minus = x;
          let top_hori_begin_zero = layer_count - (z + 1);
          let top_verti_begin_zero = layer_count - (y + 1);
          let front_hori_begin_zero = layer_count - (z + 1);
          let front_verti_begin_layer_minus = x;
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_top.front').length && $('#cube_front.top').length) {
    for (let z = 0; z < layer_count; z++) {
      for (let y = layer_count - 1; y >= 0; y--) {
        for (let x = layer_count - 1; x >= 0; x--) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = layer_count - x;
          let top_p_begin_layer_minus = layer_count - (z + 1);
          let front_p_begin_one = layer_count - y;
          let left_hori_begin_layer_minus = y;
          let left_verti_begin_layer_minus = layer_count - (z + 1);
          let top_hori_begin_zero = layer_count - (x + 1);
          let top_verti_begin_zero = layer_count - (y + 1);
          let front_hori_begin_zero = layer_count - (x + 1);
          let front_verti_begin_layer_minus = layer_count - (z + 1);
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_bottom.front').length && $('#cube_front.top').length) {
    for (let z = 0; z < layer_count; z++) {
      for (let y = 0; y < layer_count; y++) {
        for (let x = 0; x < layer_count; x++) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = x + 1;
          let top_p_begin_layer_minus = layer_count - (z + 1);
          let front_p_begin_one = y + 1;
          let left_hori_begin_layer_minus = layer_count - (y + 1);
          let left_verti_begin_layer_minus = layer_count - (z + 1);
          let top_hori_begin_zero = x;
          let top_verti_begin_zero = y;
          let front_hori_begin_zero = x;
          let front_verti_begin_layer_minus = layer_count - (z + 1);
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_bottom.front').length && $('#cube_right.top').length) {
    for (let z = 0; z < layer_count; z++) {
      for (let y = 0; y < layer_count; y++) {
        for (let x = layer_count - 1; x >= 0; x--) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = z + 1;
          let top_p_begin_layer_minus = x;
          let front_p_begin_one = y + 1;
          let left_hori_begin_layer_minus = layer_count - (y + 1);
          let left_verti_begin_layer_minus = x;
          let top_hori_begin_zero = z;
          let top_verti_begin_zero = y;
          let front_hori_begin_zero = z;
          let front_verti_begin_layer_minus = x;
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_bottom.front').length && $('#cube_left.top').length) {
    for (let z = layer_count - 1; z >= 0; z--) {
      for (let y = 0; y < layer_count; y++) {
        for (let x = 0; x < layer_count; x++) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = layer_count - z;
          let top_p_begin_layer_minus = layer_count - (x + 1);
          let front_p_begin_one = y + 1;
          let left_hori_begin_layer_minus = layer_count - (y + 1);
          let left_verti_begin_layer_minus = layer_count - (x + 1);
          let top_hori_begin_zero = layer_count - (z + 1);
          let top_verti_begin_zero = y;
          let front_hori_begin_zero = layer_count - (z + 1);
          let front_verti_begin_layer_minus = layer_count - (x + 1);
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_bottom.front').length && $('#cube_back.top').length) {
    for (let z = layer_count - 1; z >= 0; z--) {
      for (let y = 0; y < layer_count; y++) {
        for (let x = layer_count - 1; x >= 0; x--) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = layer_count - x;
          let top_p_begin_layer_minus = z;
          let front_p_begin_one = y + 1;
          let left_hori_begin_layer_minus = layer_count - (y + 1);
          let left_verti_begin_layer_minus = z;
          let top_hori_begin_zero = layer_count - (x + 1);
          let top_verti_begin_zero = y;
          let front_hori_begin_zero = layer_count - (x + 1);
          let front_verti_begin_layer_minus = z;
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_back.front').length && $('#cube_top.top').length) {
    for (let z = layer_count - 1; z >= 0; z--) {
      for (let y = layer_count - 1; y >= 0; y--) {
        for (let x = layer_count - 1; x >= 0; x--) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = layer_count - x;
          let top_p_begin_layer_minus = y;
          let front_p_begin_one = layer_count - z;
          let left_hori_begin_layer_minus = z;
          let left_verti_begin_layer_minus = y;
          let top_hori_begin_zero = layer_count - (x + 1);
          let top_verti_begin_zero = layer_count - (z + 1);
          let front_hori_begin_zero = layer_count - (x + 1);
          let front_verti_begin_layer_minus = y;
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_back.front').length && $('#cube_right.top').length) {
    for (let z = layer_count - 1; z >= 0; z--) {
      for (let y = 0; y < layer_count; y++) {
        for (let x = layer_count - 1; x >= 0; x--) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = y + 1;
          let top_p_begin_layer_minus = x;
          let front_p_begin_one = layer_count - z;
          let left_hori_begin_layer_minus = z;
          let left_verti_begin_layer_minus = x;
          let top_hori_begin_zero = y;
          let top_verti_begin_zero = layer_count - (z + 1);
          let front_hori_begin_zero = y;
          let front_verti_begin_layer_minus = x;
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_back.front').length && $('#cube_left.top').length) {
    for (let z = layer_count - 1; z >= 0; z--) {
      for (let y = layer_count - 1; y >= 0; y--) {
        for (let x = 0; x < layer_count; x++) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = layer_count - y;
          let top_p_begin_layer_minus = layer_count - (x + 1);
          let front_p_begin_one = layer_count - z;
          let left_hori_begin_layer_minus = z;
          let left_verti_begin_layer_minus = layer_count - (x + 1);
          let top_hori_begin_zero = layer_count - (y + 1);
          let top_verti_begin_zero = layer_count - (z + 1);
          let front_hori_begin_zero = layer_count - (y + 1);
          let front_verti_begin_layer_minus = layer_count - (x + 1);
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_back.front').length && $('#cube_bottom.top').length) {
    for (let z = layer_count - 1; z >= 0; z--) {
      for (let y = 0; y < layer_count; y++) {
        for (let x = 0; x < layer_count; x++) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = x + 1;
          let top_p_begin_layer_minus = layer_count - (y + 1);
          let front_p_begin_one = layer_count - z;
          let left_hori_begin_layer_minus = z;
          let left_verti_begin_layer_minus = layer_count - (y + 1);
          let top_hori_begin_zero = x;
          let top_verti_begin_zero = layer_count - (z + 1);
          let front_hori_begin_zero = x;
          let front_verti_begin_layer_minus = layer_count - (y + 1);
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_left.front').length && $('#cube_top.top').length) {
    for (let z = layer_count - 1; z >= 0; z--) {
      for (let y = layer_count - 1; y >= 0; y--) {
        for (let x = 0; x < layer_count; x++) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = layer_count - z;
          let top_p_begin_layer_minus = y;
          let front_p_begin_one = x + 1;
          let left_hori_begin_layer_minus = layer_count - (x + 1);
          let left_verti_begin_layer_minus = y;
          let top_hori_begin_zero = layer_count - (z + 1);
          let top_verti_begin_zero = x;
          let front_hori_begin_zero = layer_count - (z + 1);
          let front_verti_begin_layer_minus = y;
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_left.front').length && $('#cube_back.top').length) {
    for (let z = layer_count - 1; z >= 0; z--) {
      for (let y = 0; y < layer_count; y++) {
        for (let x = 0; x < layer_count; x++) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = y + 1;
          let top_p_begin_layer_minus = z;
          let front_p_begin_one = x + 1;
          let left_hori_begin_layer_minus = layer_count - (x + 1);
          let left_verti_begin_layer_minus = z;
          let top_hori_begin_zero = y;
          let top_verti_begin_zero = x;
          let front_hori_begin_zero = y;
          let front_verti_begin_layer_minus = z;
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_left.front').length && $('#cube_front.top').length) {
    for (let z = 0; z < layer_count; z++) {
      for (let y = layer_count - 1; y >= 0; y--) {
        for (let x = 0; x < layer_count; x++) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = layer_count - y;
          let top_p_begin_layer_minus = layer_count - (z + 1);
          let front_p_begin_one = x + 1;
          let left_hori_begin_layer_minus = layer_count - (x + 1);
          let left_verti_begin_layer_minus = layer_count - (z + 1);
          let top_hori_begin_zero = layer_count - (y + 1);
          let top_verti_begin_zero = x;
          let front_hori_begin_zero = layer_count - (y + 1);
          let front_verti_begin_layer_minus = layer_count - (z + 1);
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_left.front').length && $('#cube_bottom.top').length) {
    for (let z = 0; z < layer_count; z++) {
      for (let y = 0; y < layer_count; y++) {
        for (let x = 0; x < layer_count; x++) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = z + 1;
          let top_p_begin_layer_minus = layer_count - (y + 1);
          let front_p_begin_one = x + 1;
          let left_hori_begin_layer_minus = layer_count - (x + 1);
          let left_verti_begin_layer_minus = layer_count - (y + 1);
          let top_hori_begin_zero = z;
          let top_verti_begin_zero = x;
          let front_hori_begin_zero = z;
          let front_verti_begin_layer_minus = layer_count - (y + 1);
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_right.front').length && $('#cube_top.top').length) {
    for (let z = 0; z < layer_count; z++) {
      for (let y = layer_count - 1; y >= 0; y--) {
        for (let x = layer_count - 1; x >= 0; x--) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = z + 1;
          let top_p_begin_layer_minus = y;
          let front_p_begin_one = layer_count - x;
          let left_hori_begin_layer_minus = x;
          let left_verti_begin_layer_minus = y;
          let top_hori_begin_zero = z;
          let top_verti_begin_zero = layer_count - (x + 1);
          let front_hori_begin_zero = z;
          let front_verti_begin_layer_minus = y;
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_right.front').length && $('#cube_back.top').length) {
    for (let z = layer_count - 1; z >= 0; z--) {
      for (let y = layer_count - 1; y >= 0; y--) {
        for (let x = layer_count - 1; x >= 0; x--) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = layer_count - y;
          let top_p_begin_layer_minus = z;
          let front_p_begin_one = layer_count - x;
          let left_hori_begin_layer_minus = x;
          let left_verti_begin_layer_minus = z;
          let top_hori_begin_zero = layer_count - (y + 1);
          let top_verti_begin_zero = layer_count - (x + 1);
          let front_hori_begin_zero = layer_count - (y + 1);
          let front_verti_begin_layer_minus = z;
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_right.front').length && $('#cube_front.top').length) {
    for (let z = 0; z < layer_count; z++) {
      for (let y = 0; y < layer_count; y++) {
        for (let x = layer_count - 1; x >= 0; x--) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = y + 1;
          let top_p_begin_layer_minus = layer_count - (z + 1);
          let front_p_begin_one = layer_count - x;
          let left_hori_begin_layer_minus = x;
          let left_verti_begin_layer_minus = layer_count - (z + 1);
          let top_hori_begin_zero = y;
          let top_verti_begin_zero = layer_count - (x + 1);
          let front_hori_begin_zero = y;
          let front_verti_begin_layer_minus = layer_count - (z + 1);
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
  if ($('#cube_right.front').length && $('#cube_bottom.top').length) {
    for (let z = layer_count - 1; z >= 0; z--) {
      for (let y = 0; y < layer_count; y++) {
        for (let x = layer_count - 1; x >= 0; x--) {
          let color = arry[z][y][x];
          if (color === '') {
            continue;
          }
          ctx.globalAlpha = 1;
          if (x == jump_layer_x || y == jump_layer_y || z == jump_layer_z) {
            ctx.globalAlpha = 0.5;
          }
          ctx.fillStyle = color;
          let left_p_begin_one = layer_count - z;
          let top_p_begin_layer_minus = layer_count - (y + 1);
          let front_p_begin_one = layer_count - x;
          let left_hori_begin_layer_minus = x;
          let left_verti_begin_layer_minus = layer_count - (y + 1);
          let top_hori_begin_zero = layer_count - (z + 1);
          let top_verti_begin_zero = layer_count - (x + 1);
          let front_hori_begin_zero = layer_count - (z + 1);
          let front_verti_begin_layer_minus = layer_count - (y + 1);
          display_3d_blocks (
            ctx, block_size, sin_10deg, face_size,
            left_p_begin_one, top_p_begin_layer_minus, front_p_begin_one,
            left_hori_begin_layer_minus, left_verti_begin_layer_minus,
            top_hori_begin_zero, top_verti_begin_zero,
            front_hori_begin_zero, front_verti_begin_layer_minus
          );
        }
      }
    }
    let put_img = new Image();
    put_img.crossOrigin = "anonymous";
    put_img.onload = function () {
      cvtx.drawImage(put_img, 0, 0, cv.width, cv.width);
    };
    put_img.src = c.toDataURL();
  }
}
function change_select_layer (e) {
  let palette_color = [];
  let palette_img = [];
  $('#CP .CPimg img').each(function(index) {
    let imgColor = $(this).css('background-color');
    let img = jQuery("<div>").append($(this).clone(true));
    img.children().addClass("mImg");
    img = img.html();
    palette_color.push(imgColor);
    palette_img.push(img);
  });
  if ($('#vertical_layer').prop('checked')) {
    let z = $('#select_vertical_layers').val();
    z = Number(z);
    let arry = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
    let colHead = '<tr><th class="FirstBlank"></th>';
    let table = '';
    arry[z].forEach((row, y) => {
      colHead += '<th class="headCol"></th>';
      let col_html = '';
      row.forEach((col, x) => {
        let imgColor = arry[z][y][x];
        let index = palette_color.indexOf(imgColor);
        if (index < 0) {
          col_html += '<td class="x' + x + '"></td>';
          return true;
        }
        let img = palette_img[index];
        col_html += '<td class="x' + x + '">' + img + '</td>';
      });
      table += '<tr class="y' + y + '"><th class="headRow"></th>' + col_html + "</tr>";
    });
    colHead += '</tr>';
    $('#art_canvas thead').html(colHead);
    $('#art_canvas tbody').html(table);
    if (obj.focus_layer !== '') {
      if (obj.focus_layer.layer === 'horizontal') {
        let bef_verti = $('#select_horizon_layers').val();
        const element = document.querySelector('#art_canvas tbody tr.y' + bef_verti + ' td.x' + obj.focus_layer.x);
        element.scrollIntoView({behavior: "auto", block: "center", inline: "center"});
      }
      if (obj.focus_layer.layer === 'side') {
        let bef_hori = $('#select_side_layers').val();
        const element = document.querySelector('#art_canvas tbody tr.y' + obj.focus_layer.y + ' td.x' + bef_hori);
        element.scrollIntoView({behavior: "auto", block: "center", inline: "center"});
      }
    }
  }
  if ($('#side_layer').prop('checked')) {
    let x = $('#select_side_layers').val();
    x = Number(x);
    let arry = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
    let colHead = '<tr><th class="FirstBlank"></th>';
    let table = '';
    for (let y = 0; y < arry[0].length; y++) {
      colHead += '<th class="headCol"></th>';
      let col_html = '';
      for (let z = 0; z < arry.length; z++) {
        let imgColor = arry[z][y][x];
        let index = palette_color.indexOf(imgColor);
        if (index < 0) {
          col_html += '<td class="x' + z + '"></td>';
          continue;
        }
        let img = palette_img[index];
        col_html += '<td class="x' + z + '">' + img + '</td>';
      }
      table += '<tr class="y' + y + '"><th class="headRow"></th>' + col_html + "</tr>";
    }
    colHead += '</tr>';
    $('#art_canvas thead').html(colHead);
    $('#art_canvas tbody').html(table);
    if (obj.focus_layer !== '') {
      if (obj.focus_layer.layer === 'vertical') {
        let bef_hori = $('#select_vertical_layers').val();
        const element = document.querySelector('#art_canvas tbody tr.y' + obj.focus_layer.y + ' td.x' + bef_hori);
        element.scrollIntoView({behavior: "auto", block: "center", inline: "center"});
      }
      if (obj.focus_layer.layer === 'horizontal') {
        let bef_verti = $('#select_horizon_layers').val();
        const element = document.querySelector('#art_canvas tbody tr.y' + bef_verti + ' td.x' + obj.focus_layer.y);
        element.scrollIntoView({behavior: "auto", block: "center", inline: "center"});
      }
    }
  }
  if ($('#horizontal_layer').prop('checked')) {
    let y = $('#select_horizon_layers').val();
    y = Number(y);
    let arry = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
    let colHead = '<tr><th class="FirstBlank"></th>';
    let table = '';
    arry.forEach((row, z) => {
      colHead += '<th class="headCol"></th>';
      let col_html = '';
      row[y].forEach((col, x) => {
        let imgColor = arry[z][y][x];
        let index = palette_color.indexOf(imgColor);
        if (index < 0) {
          col_html += '<td class="x' + x + '"></td>';
          return true;
        }
        let img = palette_img[index];
        col_html += '<td class="x' + x + '">' + img + '</td>';
      });
      table += '<tr class="y' + z + '"><th class="headRow"></th>' + col_html + "</tr>";
    });
    colHead += '</tr>';
    $('#art_canvas thead').html(colHead);
    $('#art_canvas tbody').html(table);
    if (obj.focus_layer !== '') {
      if (obj.focus_layer.layer === 'vertical') {
        let bef_verti = $('#select_vertical_layers').val();
        const element = document.querySelector('#art_canvas tbody tr.y' + bef_verti + ' td.x' + obj.focus_layer.x);
        element.scrollIntoView({behavior: "auto", block: "center", inline: "center"});
      }
      if (obj.focus_layer.layer === 'side') {
        let bef_hori = $('#select_side_layers').val();
        const element = document.querySelector('#art_canvas tbody tr.y' + obj.focus_layer.x + ' td.x' + bef_hori);
        element.scrollIntoView({behavior: "auto", block: "center", inline: "center"});
      }
    }
  }
}
/*https://lab.syncer.jp/Web/JavaScript/Snippet/66/*/
/*https://qiita.com/tao_s/items/ddde3a4a1a725106da2c*/
function rgb_to_return_array_rgb (rgb) {
  rgb = rgb.replace("rgb(", "");
  rgb = rgb.replace("rgba(", "");
  rgb = rgb.replace(")", "");
  rgb = rgb.replaceAll(" ", "");
  rgb = rgb.split(",");
  return rgb;
}
function rgb_to_return_array_hsv (array_rgb) {
  let r = array_rgb[0] / 255 ;
  let g = array_rgb[1] / 255 ;
  let b = array_rgb[2] / 255 ;
  let max = Math.max( r, g, b ) ;
  let min = Math.min( r, g, b ) ;
  let diff = max - min ;
  let h = 0 ;
  switch( min ) {
    case max :
    h = 0 ;
    break ;

    case r :
    h = (60 * ((b - g) / diff)) + 180 ;
    break ;

    case g :
    h = (60 * ((r - b) / diff)) + 300 ;
    break ;

    case b :
    h = (60 * ((g - r) / diff)) + 60 ;
    break ;
  }
  let s = max == 0 ? 0 : diff / max ;
  let v = max ;
  return [ h, s, v ] ;
}
function rgb_to_return_text_hex (array_rgb) {
  let R = ("0" + parseInt(array_rgb[0]).toString(16)).slice(-2);
  let G = ("0" + parseInt(array_rgb[1]).toString(16)).slice(-2);
  let B = ("0" + parseInt(array_rgb[2]).toString(16)).slice(-2);
  let text_hex = "#" + R + G + B;
  return text_hex;
}
function hex_to_return_obj_rgb (colorcode) {
  if (colorcode.split("")[0] === "#") {
    colorcode = colorcode.substring(1);
  }
  if (colorcode.length === 3) {
    let codeArr = colorcode.split("");
    colorcode = codeArr[0] + codeArr[0] + codeArr[1] + codeArr[1] + codeArr[2] + codeArr[2];
  }
  if (colorcode.length !== 6) {
    return false;
  }
  let r = parseInt(colorcode.substring(0, 2), 16);
  let g = parseInt(colorcode.substring(2, 4), 16);
  let b = parseInt(colorcode.substring(4, 6), 16);
  return {r: r, g: g, b: b};
}
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
/*++ready document++*/
$(document).ready(function () {
  //hide aside menu when using smartphone & 2 windows
  let ww = window.innerWidth;
  if (ww >= 1200) {
    $('#hanb').prop('checked', true);
  }
  //palette color img add crossorigin
  // WARNING: if can display img do -> crossorigin="anonymous
  $('#CP .CPimg').find('img').attr('crossorigin', 'anonymous');
  //make pixel table
  let layer_count = 30;
  let col = "";
  let colHead = '<th class="FirstBlank"></th>';
  for (let i = 0; i < layer_count; i++) {
    colHead = colHead + '<th class="headCol"></th>';
    col = col + '<td class="x' + i + '"></td>';
  }
  let table = "";
  for (let j = 0; j < layer_count; j++) {
    table = table + '<tr class="y' + j + '"><th class="headRow"></th>' + col + "</tr>";
  }
  $("#art_canvas thead").append('<tr></tr>');
  $("#art_canvas thead tr").html(colHead);
  $("#art_canvas tbody").html(table);
  //make select_layers options
  let vertical_layer_html = '';
  let horizontal_layer_html = '';
  for (let k = 0; k < layer_count; k++) {
    let reverse_c = layer_count - k - 1;
    if (k == Math.floor(layer_count / 2) - 1) {
      vertical_layer_html += '<option value="' + reverse_c + '" autofocus selected class="selected">' + reverse_c + '</option>';
      horizontal_layer_html += '<option value="' + k + '" autofocus selected class="selected">' + k + '</option>';
    }
    else {
      vertical_layer_html += '<option value="' + reverse_c + '">' + reverse_c + '</option>';
      horizontal_layer_html += '<option value="' + k + '">' + k + '</option>';
    }
  }
  $('#select_vertical_layers').html(vertical_layer_html);
  $('#select_side_layers').html(horizontal_layer_html);
  $('#select_horizon_layers').html(horizontal_layer_html);
  //create 3d arry
  let arry = [];
  for (let z = 0; z < layer_count; z++) {
    for (let y = 0; y < layer_count; y++) {
      if (!arry[z]) {
        arry[z] = [];
      }
      for (let x = 0; x < layer_count; x++) {
        if (!arry[z][y]) {
          arry[z][y] = [];
        }
        arry[z][y][x] = '';
      }
    }
  }
  roll_back_obj.art.push(arry);
});
/*++window resize++*/
$(window).resize(function() {
  //aside display at 1200px & hide less 1200px
  let ww = window.innerWidth;
  if (ww >= 1200) {
    if (!$('#hanb').prop('checked')) {
      $('#hanb').prop('checked', true);
    }
  }
  if (ww < 1200) {
    if ($('#hanb').prop('checked')) {
      $('#hanb').prop('checked', false);
    }
  }
});
/*++all action++*/
$('body').click((e) => {
  //++icon_button++
  //remove CPimg class appear
  if ($('#CP .CPimg img:hover').length) {
    return true;
  }
  if ($('#CP .CPimg img.appear').length) {
    $('#CP .CPimg img.appear').removeClass('appear');
  }
});
/*++header++*/
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
/*++top_menu++*/
//one time memory check action
function otm_check(e) {
  if ($(e).attr('class') === undefined || !$(e).attr('class').length) {
    $('#syncer-acdn-03 li[data-target="target_memorys"] p').removeClass('target');
    $(e).addClass('target');
  } else {
    $(e).removeClass('target');
  }
}
//one time memory save action
function otm_save(e) {
  let target_id = $(e).parent().attr('id');
  if ($('#' + target_id).attr('data-check') === undefined || !$('#' + target_id).attr('data-check').length) {
    $('#' + target_id).attr('data-check', 'checked');
    $(e).css('display', 'none');
    $('#' + target_id).children('i.fa-delete-left').css('display', 'inline-block');
    let key = target_id;
    let value = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
    value = copyMatrix(value);
    add_new_obj_to_memory_obj (key,value);
  } else {
    return true;
  }
}
//one time memory delete action
function otm_delete(e) {
  let target_id = $(e).parent().attr('id');
  if ($('#' + target_id).attr('data-check').length) {
    $('#' + target_id).removeAttr('data-check');
    $(e).css('display', 'none');
    $('#' + target_id).children('i.fa-bookmark').css('display', 'inline-block');
    let key = target_id;
    delete_memory_from_memory_obj (key);
    $('#' + target_id).children('span').removeClass('titled');
    let text_val = target_id.toString();
    text_val = text_val.replace("OTM_cell_","");
    $('#' + target_id).children('span').text(text_val);
  } else {
    return true;
  }
}
//one time memory load action
let add_load_title_name = function (e) {
  let name = $('#art_canvas').attr('data-fileName');
  let nL = name.length;
  if (nL <= 20) {
    nL = 20;
  }
  nL = 20 / nL + "em";
  if (name === '') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      name = 'ファイル名';
    }
    if ($('header .header_form p.language').text() === '英語') {
      name = 'File Name';
    }
  }
  $(".input_forms .load_title span").css("font-size", nL);
  $(".input_forms .load_title span").text(name);
};
function memory_value_into_canvas (key, name) {
  // change name
  $('#art_canvas').attr('data-fileName', '');
  if (name !== null) {
    $('#art_canvas').attr('data-fileName', name);
  }
  setTimeout((e) => {
    add_load_title_name();
  }, 1)
  // change values
  let value = copyMatrix(memory_obj[key]);
  $('#art_size').val(value.length);
  let layer_count = value.length;
  //make select_layers options
  let vertical_layer_html = '';
  let horizontal_layer_html = '';
  for (let k = 0; k < layer_count; k++) {
    let reverse_c = layer_count - k - 1;
    if (k == Math.floor(layer_count / 2) - 1) {
      vertical_layer_html += '<option value="' + reverse_c + '" autofocus selected class="selected">' + reverse_c + '</option>';
      horizontal_layer_html += '<option value="' + k + '" autofocus selected class="selected">' + k + '</option>';
    }
    else {
      vertical_layer_html += '<option value="' + reverse_c + '">' + reverse_c + '</option>';
      horizontal_layer_html += '<option value="' + k + '">' + k + '</option>';
    }
  }
  $('#select_vertical_layers').html(vertical_layer_html);
  $('#select_horizon_layers').html(horizontal_layer_html);
  add_canvas_to_roll_back_obj (value);
  //create memory into 3d check veiw
  arry_into_check_view ();
  //create memory into arts
  change_select_layer ();
}
function otm_load(e) {
  let target_id = $(e).parent().attr('id');
  if ($('#' + target_id).attr('data-check') === undefined || !$('#' + target_id).attr('data-check').length) {
    return true;
  }
  if ($('#' + target_id).attr('data-check').length) {
    let key = target_id;
    let name = null;
    if ($('#' + target_id).children('span.titled').length) {
      name = $('#' + target_id).children('span.titled').text();
    }
    memory_value_into_canvas (key, name);
  }
}
//add memorys to acdn
$('#add_memory').click((e) => {
  let mL = $('#syncer-acdn-03 li[data-target="target_memorys"]').length;
  mL++;
  let memory_str = '<li data-target="target_memorys" id="OTM_cell_' + mL + '">';
  memory_str += '<p onclick="otm_check(this)">&#9633;</p>';
  memory_str += '<span onclick="otm_load(this)">' + mL + '</span>';
  memory_str += '<i class="fa-solid fa-bookmark" onclick="otm_save(this)"></i>';
  memory_str += '<i class="fa-solid fa-delete-left" onclick="otm_delete(this)"></i>';
  memory_str += '</li>';
  $('#syncer-acdn-03').append(memory_str);
});
//remove memorys to acdn
$('#remove_memory').click((e) => {
  let target_id = $('#syncer-acdn-03 li[data-target="target_memorys"] p.target').parent().attr('id');
  $('#' + target_id).remove();
  let key = target_id;
  delete_memory_from_memory_obj (key);
  let i = 1;
  $('#syncer-acdn-03 li[data-target="target_memorys"]').each(function(index, element) {
    let target_key = $(element).attr('id');
    let value = memory_obj[target_key];
    delete_memory_from_memory_obj (target_key);
    let change_id = 'OTM_cell_' + i;
    add_new_obj_to_memory_obj (change_id,value);
    $(element).attr('id', change_id);
    if ($(element).children('span.titled').length <= 0) {
      $(element).children('span').text(i);
    }
    i++;
  });
});
//data download
/*https://techacademy.jp/magazine/21725*/
$('#download_memory').click((e) => {
  let target_id = $('#syncer-acdn-03 li[data-target="target_memorys"] p.target').parent().attr('id');
  if (target_id === undefined || target_id === '') {
    return false;
  }
  let value = memory_obj[target_id];
  let getStr = "";
  value.forEach((layer_z, z) => {
    layer_z.forEach((layer_y, y) => {
      layer_y.forEach((layer_x, x) => {
        let color = value[z][y][x];
        if (color === '') {
          getStr = getStr + "_layerX_";
          return true;
        }
        let rgb = color.split("rgb(").slice(1);
        rgb = rgb[0].replace(")", "");
        rgb = rgb.split(",");
        getStr = getStr + "_r_" + rgb[0] + "_r_" + "_g_" + rgb[1] + "_g_" + "_b_" + rgb[2] + "_b_";
        getStr = getStr + "_layerX_";
      });
      getStr = getStr + "_layerY_";
    });
    getStr = getStr + "_layerZ_";
  });
  let getTitle = $('#' + target_id).children("span").text();
  let blob = new Blob([getStr], { type: "text/plain" });
  let link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = getTitle + ".txt";
  link.click();
  link.remove();
});
//data upload
/*https://javascript.keicode.com/newjs/how-to-read-file-with-file-api.php*/
$('#upload_memory').change((e) => {
  let target_id = $('#syncer-acdn-03 li[data-target="target_memorys"] p.target').parent().attr('id');
  if (target_id === undefined || target_id === '') {
    $('#upload_memory').val("");
    return false;
  }
  $('#' + target_id + ' span').addClass('titled');
  const title_in_it = document.querySelector('#' + target_id + ' span.titled');
  const file = e.target.files[0];
  if (file === undefined) {
    return false;
  }
  let str1 = file.name;
  const reader = new FileReader();
  reader.onload = () => {
    let upText = reader.result;
    upText = return_str_escape_html(upText);
    let table = upText;
    table = table.split("_layerZ_");
    table.pop();
    table.forEach(function(value, index) {
      table[index] = table[index].split("_layerY_");
      table[index].pop();
    });
    table.forEach((layer_z, z) => {
      layer_z.forEach((layer_y, y) => {
        table[z][y] = table[z][y].split("_layerX_");
        table[z][y].pop();
        table[z][y].forEach((layer_x, x) => {
          if (table[z][y][x] === '') {
            return true;
          }
          table[z][y][x] = table[z][y][x].replaceAll(" ", "");
          let r = table[z][y][x].split("_r_").slice(1, 2);
          let g = table[z][y][x].split("_g_").slice(1, 2);
          let b = table[z][y][x].split("_b_").slice(1, 2);
          table[z][y][x] = 'rgb(' + r + ", " + g + ", " + b + ')';
        });
      });
    });
    $('#' + target_id).attr('data-check', 'checked');
    $('#' + target_id).children('i.fa-bookmark').css('display', 'none');
    $('#' + target_id).children('i.fa-delete-left').css('display', 'inline-block');
    let key = target_id;
    add_new_obj_to_memory_obj (key, table);
    str1 = str1.split(".").slice(0, 1);
    title_in_it.innerText = str1;
    $('#upload_memory').val("");
  };
  reader.readAsText(file);
});
//change_memory_text
function change_memory_text (e) {
  let text_val = $('#memory_text').val();
  $('#memory_text').remove();
  $('#memory_text').val('');
  let id = $('#syncer-acdn-03 li[data-target="target_memorys"] p.target').parent().attr('id');
  $('#' + id).children('span').removeClass('titled');
  if (text_val === '') {
    text_val = id.toString();
    text_val = text_val.replace("OTM_cell_","");
  }
  else if (text_val !== '') {
    $('#' + id).children('span').addClass('titled');
  }
  $('#' + id).children('span').text(text_val);
  $('#memory_text').off('change');
}
$('#change_memory_text').click((e) => {
  $('#memory_text').remove();
  $('#memory_text').val('');
  $('#memory_text').off('change');
  let html = '<input type="text" id="memory_text" required　minlength="0" size="22" spellcheck="true">';
  $('#syncer-acdn-03 li[data-target="target_memorys"] p.target').parent().prepend(html);
  let bef_text = $('#syncer-acdn-03 li[data-target="target_memorys"] p.target').parent().children('span').text();
  $('#memory_text').val(bef_text);
  $('#memory_text').css('left', 40);
  $('#memory_text').css('top', 2);
  $('#memory_text').select();
  $('#memory_text').on('change',change_memory_text);
});
//canvas clear action
$('#clear_canvas').click((e) => {
  if ($('#art_size').val() === '') {
    $('#art_size').val(30);
  }
  //make pixel table
  let layer_count = $('#art_size').val();
  let col = "";
  let colHead = '<tr><th class="FirstBlank"></th>';
  for (let i = 0; i < layer_count; i++) {
    colHead = colHead + '<th class="headCol"></th>';
    col = col + '<td class="x' + i + '"></td>';
  }
  colHead += '</tr>';
  let table = "";
  for (let j = 0; j < layer_count; j++) {
    table = table + '<tr class="y' + j + '"><th class="headRow"></th>' + col + "</tr>";
  }
  $("#art_canvas thead").html(colHead);
  $("#art_canvas tbody").html(table);
  //make select_layers options
  let vertical_layer_html = '';
  let horizontal_layer_html = '';
  for (let k = 0; k < layer_count; k++) {
    let reverse_c = layer_count - k - 1;
    if (k == Math.floor(layer_count / 2) - 1) {
      vertical_layer_html += '<option value="' + reverse_c + '" autofocus selected class="selected">' + reverse_c + '</option>';
      horizontal_layer_html += '<option value="' + k + '" autofocus selected class="selected">' + k + '</option>';
    }
    else {
      vertical_layer_html += '<option value="' + reverse_c + '">' + reverse_c + '</option>';
      horizontal_layer_html += '<option value="' + k + '">' + k + '</option>';
    }
  }
  $('#select_vertical_layers').html(vertical_layer_html);
  $('#select_horizon_layers').html(horizontal_layer_html);
  //create 3d view canvas
  let arry = [];
  for (let z = 0; z < layer_count; z++) {
    for (let y = 0; y < layer_count; y++) {
      if (!arry[z]) {
        arry[z] = [];
      }
      for (let x = 0; x < layer_count; x++) {
        if (!arry[z][y]) {
          arry[z][y] = [];
        }
        arry[z][y][x] = '';
      }
    }
  }
  add_canvas_to_roll_back_obj (arry);
  const cv = document.getElementById('check_view');
  const cvtx = cv.getContext('2d');
  cvtx.clearRect(0, 0, cv.width, cv.height);
});
/*change canvas layer*/
/*https://magazine.techacademy.jp/magazine/22795*/
function change_layer_select_options(e) {
  let arry = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
  if ($('#vertical_layer').prop('checked')) {
    let vertical_layer_html = '';
    arry.forEach((row, z) => {
      let reverse_c = arry.length - z - 1;
      if (z == Math.floor(arry.length / 2) - 1) {
        vertical_layer_html += '<option value="' + reverse_c + '" autofocus selected class="selected">' + reverse_c + '</option>';
      }
      else {
        vertical_layer_html += '<option value="' + reverse_c + '">' + reverse_c + '</option>';
      }
    });
    $('#select_vertical_layers').html(vertical_layer_html);
    if (obj.focus_layer !== '') {
      if (obj.focus_layer.layer === 'horizontal') {
        let select = document.getElementById("select_vertical_layers");
        select.options[arry.length - 1 - obj.focus_layer.y].selected = true;
        select.options[arry.length - 1 - obj.focus_layer.y].autofocus = true;
      }
      if (obj.focus_layer.layer === 'side') {
        let select = document.getElementById("select_vertical_layers");
        select.options[arry.length - 1 - obj.focus_layer.x].selected = true;
        select.options[arry.length - 1 - obj.focus_layer.x].autofocus = true;
      }
    }
  }
  if ($('#side_layer').prop('checked')) {
    let side_layer_html = '';
    arry[0][0].forEach((row, x) => {
      if (x == Math.floor(arry[0][0].length / 2) - 1) {
        side_layer_html += '<option value="' + x + '" autofocus selected class="selected">' + x + '</option>';
      }
      else {
        side_layer_html += '<option value="' + x + '">' + x + '</option>';
      }
    });
    $('#select_side_layers').html(side_layer_html);
    if (obj.focus_layer !== '') {
      if (obj.focus_layer.layer === 'vertical') {
        let select = document.getElementById("select_side_layers");
        select.options[obj.focus_layer.x].selected = true;
        select.options[obj.focus_layer.x].autofocus = true;
      }
      if (obj.focus_layer.layer === 'horizontal') {
        let select = document.getElementById("select_side_layers");
        select.options[obj.focus_layer.x].selected = true;
        select.options[obj.focus_layer.x].autofocus = true;
      }
    }
  }
  if ($('#horizontal_layer').prop('checked')) {
    let horizontal_layer_html = '';
    arry[0].forEach((row, y) => {
      if (y == Math.floor(arry[0].length / 2) - 1) {
        horizontal_layer_html += '<option value="' + y + '" autofocus selected class="selected">' + y + '</option>';
      }
      else {
        horizontal_layer_html += '<option value="' + y + '">' + y + '</option>';
      }
    });
    $('#select_horizon_layers').html(horizontal_layer_html);
    if (obj.focus_layer !== '') {
      if (obj.focus_layer.layer === 'vertical') {
        let select = document.getElementById("select_horizon_layers");
        select.options[obj.focus_layer.y].selected = true;
        select.options[obj.focus_layer.y].autofocus = true;
      }
      if (obj.focus_layer.layer === 'side') {
        let select = document.getElementById("select_horizon_layers");
        select.options[obj.focus_layer.y].selected = true;
        select.options[obj.focus_layer.y].autofocus = true;
      }
    }
  }
  setTimeout((e) => {
    change_select_layer (e);
    cancel_jump_layer_point(e);
  }, 1)
}
$('#vertical_layer ~ label[for="vertical_layer"]').click((e) => {
  change_to_vertical_layer (e);
  setTimeout((e) => {
    change_layer_select_options(e);
  }, 1)
});
$('#side_layer ~ label[for="side_layer"]').click((e) => {
  change_to_side_layer (e);
  setTimeout((e) => {
    change_layer_select_options(e);
  }, 1)
});
$('#horizontal_layer ~ label[for="horizontal_layer"]').click((e) => {
  change_to_horizon_layers (e);
  setTimeout((e) => {
    change_layer_select_options(e);
  }, 1)
});
/*++aside++*/
//check view
$('#check_view_button').click((e) => {
  $('#wait').removeClass('hidden');
  setTimeout(() => {
    arry_into_check_view (e);
    $('#wait').addClass('hidden');
  }, 1)
});
//change_view_face direction selector change action
function slide_to_right (e) {
  $('#change_view_face > .front').attr('data-face', 'left');
  $('#change_view_face > .back').attr('data-face', 'right');
  $('#change_view_face > .right').attr('data-face', 'front');
  $('#change_view_face > .left').attr('data-face', 'back');
}
function slide_to_left (e) {
  $('#change_view_face > .front').attr('data-face', 'right');
  $('#change_view_face > .back').attr('data-face', 'left');
  $('#change_view_face > .right').attr('data-face', 'back');
  $('#change_view_face > .left').attr('data-face', 'front');
}
function slide_to_upward (e) {
  $('#change_view_face > .front').attr('data-face', 'top');
  $('#change_view_face > .back').attr('data-face', 'bottom');
  $('#change_view_face > .top').attr('data-face', 'back');
  $('#change_view_face > .bottom').attr('data-face', 'front');
}
function slide_to_downward (e) {
  $('#change_view_face > .front').attr('data-face', 'bottom');
  $('#change_view_face > .back').attr('data-face', 'top');
  $('#change_view_face > .top').attr('data-face', 'front');
  $('#change_view_face > .bottom').attr('data-face', 'back');
}
$('#change_view_face span').click((e) => {
  let action_id = '';
  let tag = $(e.target).get(0).tagName;
  if (tag === 'I') {
    action_id = $(e.target).parent().attr('id');
  }
  if (tag === 'SPAN') {
    action_id = $(e.target).attr('id');
  }
  if (action_id === 'roll_cube_to_left') {
    slide_to_right ();
  }
  if (action_id === 'roll_cube_to_right') {
    slide_to_left ();
  }
  if (action_id === 'roll_cube_to_top') {
    slide_to_upward ();
  }
  if (action_id === 'roll_cube_to_bottom') {
    slide_to_downward ();
  }
  setTimeout((e) => {
    $('#change_view_face > p').each((index, value) => {
      let get_class = $(value).attr('data-face');
      $(value).attr('class', get_class);
    });
    arry_into_check_view (e);
  }, 1)
});
function select_face (arr) {
  $('#' + arr[0]).attr('class', 'front pull_down');
  $('#' + arr[0]).attr('data-face', 'front');
  $('#' + arr[1]).attr('class', 'right pull_down');
  $('#' + arr[1]).attr('data-face', 'right');
  $('#' + arr[2]).attr('class', 'left pull_down');
  $('#' + arr[2]).attr('data-face', 'left');
  $('#' + arr[3]).attr('class', 'top pull_down');
  $('#' + arr[3]).attr('data-face', 'top');
  $('#' + arr[4]).attr('class', 'bottom pull_down');
  $('#' + arr[4]).attr('data-face', 'bottom');
  $('#' + arr[5]).attr('class', 'back pull_down');
  $('#' + arr[5]).attr('data-face', 'back');
}
$('#change_view_face p').click((e) => {
  let arr = [];
  if ($('#cube_front.pull_down:hover').length) {
    arr.push('cube_front');
    arr.push('cube_right');
    arr.push('cube_left');
    arr.push('cube_top');
    arr.push('cube_bottom');
    arr.push('cube_back');
    select_face (arr);
  }
  if ($('#cube_top.pull_down:hover').length) {
    arr.push('cube_top');
    arr.push('cube_right');
    arr.push('cube_left');
    arr.push('cube_back');
    arr.push('cube_front');
    arr.push('cube_bottom');
    select_face (arr);
  }
  if ($('#cube_bottom.pull_down:hover').length) {
    arr.push('cube_bottom');
    arr.push('cube_right');
    arr.push('cube_left');
    arr.push('cube_front');
    arr.push('cube_back');
    arr.push('cube_top');
    select_face (arr);
  }
  if ($('#cube_back.pull_down:hover').length) {
    arr.push('cube_back');
    arr.push('cube_left');
    arr.push('cube_right');
    arr.push('cube_top');
    arr.push('cube_bottom');
    arr.push('cube_front');
    select_face (arr);
  }
  if ($('#cube_left.pull_down:hover').length) {
    arr.push('cube_left');
    arr.push('cube_front');
    arr.push('cube_back');
    arr.push('cube_top');
    arr.push('cube_bottom');
    arr.push('cube_right');
    select_face (arr);
  }
  if ($('#cube_right.pull_down:hover').length) {
    arr.push('cube_right');
    arr.push('cube_back');
    arr.push('cube_front');
    arr.push('cube_top');
    arr.push('cube_bottom');
    arr.push('cube_left');
    select_face (arr);
  }
  $('#change_view_face *').toggleClass('pull_down');
  arry_into_check_view (e);
});
//retouch 64 sizes for art_size
/*https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_Expressions*/
/*https://qiita.com/BlueSilverCat/items/f35f9b03169d0f70818b*/
/*https://qiita.com/HorikawaTokiya/items/42a027ed51018caa8575#:~:text=JavaScript%E3%81%A7%E6%AD%A3%E8%A6%8F%E8%A1%A8%E7%8F%BE%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E6%95%B0%E5%AD%97%E3%81%A0%E3%81%91%E5%8F%96%E3%82%8A%E5%87%BA%E3%81%99%E3%80%82.%20Copied%21%20const%20data%20%3D%20%27hoge123%27%3B%20const%20res,123.%20g%E3%80%80%20%E3%81%99%E3%81%B9%E3%81%A6%E3%81%AE%E4%B8%80%E8%87%B4%E3%81%AB%E5%AF%BE%E3%81%97%E3%81%A6%E7%BD%AE%E6%8F%9B%E3%82%92%E5%AE%9F%E6%96%BD%E3%80%82.%20g%E3%81%8C%E5%A4%A7%E4%BA%8B%E3%81%BF%E3%81%9F%E3%81%84%E3%81%A3%E3%81%99%E3%80%82.%20%E5%8F%82%E8%80%83.%20http%3A%2F%2Fmypaceprogram.blogspot.com%2F2017%2F11%2Fjavascript.html.%2031.%2019.*/
function change_max_size_limit (e) {
  let px = $(e.target).val();
  px = Number(String(px).replace(/[^0-9]/g, ''));
  if (px > 64) {
    px = 64;
  }
  $(e.target).val(px);
}
$('#art_size').change(function (e) {
  change_max_size_limit (e);
});
//open drag-and-drop-area from aside iocn
$('.aside_menu .change_to_pixel_art').click((e) => {
  $('#drag-and-drop-area').css('display', 'flex');
  $('#editing_areas').css('width', '600px');
  $('#editing_areas').css('height', '600px');
  const element = document.getElementById("drag-and-drop-area");
  element.scrollIntoView({behavior: "auto", block: "center", inline: "center"});
});
//resize canvas table
function build_new_board(layer_count) {
  let col = "";
  let colHead = '<tr><th class="FirstBlank"></th>';
  for (let i = 0; i < layer_count; i++) {
    colHead = colHead + '<th class="headCol"></th>';
    col = col + '<td class="x' + i + '"></td>';
  }
  colHead += '</tr>';
  let table = "";
  for (let j = 0; j < layer_count; j++) {
    table = table + '<tr class="y' + j + '"><th class="headRow"></th>' + col + "</tr>";
  }
  $("#art_canvas thead").html(colHead);
  $("#art_canvas tbody").html(table);
  //make select_layers options
  let vertical_layer_html = '';
  let horizontal_layer_html = '';
  for (let k = 0; k < layer_count; k++) {
    let reverse_c = layer_count - k - 1;
    if (k == Math.floor(layer_count / 2) - 1) {
      vertical_layer_html += '<option value="' + reverse_c + '" autofocus selected class="selected">' + reverse_c + '</option>';
      horizontal_layer_html += '<option value="' + k + '" autofocus selected class="selected">' + k + '</option>';
    }
    else {
      vertical_layer_html += '<option value="' + reverse_c + '">' + reverse_c + '</option>';
      horizontal_layer_html += '<option value="' + k + '">' + k + '</option>';
    }
  }
  $('#select_vertical_layers').html(vertical_layer_html);
  $('#select_side_layers').html(horizontal_layer_html);
  $('#select_horizon_layers').html(horizontal_layer_html);
  //create 3d arry
  let arry = [];
  for (let z = 0; z < layer_count; z++) {
    for (let y = 0; y < layer_count; y++) {
      if (!arry[z]) {
        arry[z] = [];
      }
      for (let x = 0; x < layer_count; x++) {
        if (!arry[z][y]) {
          arry[z][y] = [];
        }
        arry[z][y][x] = '';
      }
    }
  }
  //replace new arry into old arry for center bottom
  if (layer_count < obj.once_memory.length) {
    let layer_gap = obj.once_memory.length - layer_count;
    let half_count = Math.floor(layer_gap / 2);
    arry.forEach((layer_z, z) => {
      layer_z.forEach((layer_y, y) => {
        layer_y.forEach((layer_x, x) => {
          let target_z = z + half_count;
          let target_y = y + layer_gap;
          let target_x = x + half_count;
          if (obj.once_memory[target_z][target_y][target_x] === '') {
            return true;
          }
          arry[z][y][x] = obj.once_memory[target_z][target_y][target_x];
        });
      });
    });
  }
  if (layer_count >= obj.once_memory.length) {
    let layer_gap = layer_count - obj.once_memory.length;
    let half_count = Math.floor(layer_gap / 2);
    obj.once_memory.forEach((layer_z, z) => {
      layer_z.forEach((layer_y, y) => {
        layer_y.forEach((layer_x, x) => {
          let target_z = z + half_count;
          let target_y = y + layer_gap;
          let target_x = x + half_count;
          if (obj.once_memory[z][y][x] === '') {
            return true;
          }
          arry[target_z][target_y][target_x] = obj.once_memory[z][y][x];
        });
      });
    });
  }
  add_canvas_to_roll_back_obj (arry);
  //create memory into 3d check veiw
  arry_into_check_view ();
  //create memory into arts
  change_select_layer ();
}
$("#resize_button").click(function () {
  obj.once_memory = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
  obj.once_memory = copyMatrix(obj.once_memory);
  $('.layer_selector select option.copy_target').removeClass('copy_target');
  if ($('#art_size').val() === '') {
    $('#art_size').val(30);
  }
  let layer_count = $('#art_size').val();
  if (layer_count < obj.once_memory.length) {
    let result;
    if ($('header .header_form p.language').text() === 'Japanese') {
      result = confirm('アートが消えますが続けますか？');
    }
    if ($('header .header_form p.language').text() === '英語') {
      result = confirm('The Art maybe be disappeared, will you continue?');
    }
    if (result) {
      build_new_board(layer_count);
      return false;
    } else {
      return false;
    }
  }
  if (layer_count >= obj.once_memory.length) {
    build_new_board(layer_count);
    return false;
  }
});
//file download
/*https://blog.agektmr.com/2013/09/canvas-png-blob.html*/
/*https://symfoware.blog.fc2.com/blog-entry-2578.html*/
/*https://qiita.com/saka212/items/408bb17dddefc09004c8*/
/*https://r17n.page/2020/01/12/js-download-zipped-images-to-local/#jszip-%E3%82%92-CDN-%E3%81%8B%E3%82%89%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%81%BF-loadJSZipFromCDN*/
/*https://webfrontend.ninja/js-find/#:~:text=%E3%80%90JavaScript%E3%80%91%E9%85%8D%E5%88%97%E3%81%8B%E3%82%89%E8%A6%81%E7%B4%A0%E3%82%92%E6%A4%9C%E7%B4%A2%E3%81%99%E3%82%8B%206%20%E3%81%A4%E3%81%AE%E6%96%B9%E6%B3%95%201%20%E9%85%8D%E5%88%97%E3%81%8B%E3%82%89%E8%A6%81%E7%B4%A0%E3%82%92%E7%99%BA%E8%A6%8B%E3%81%99%E3%82%8B%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89%202%20indexOf%20%28%29,findIndex%20%28%29%207%20filter%20%28%29%208%20%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%81%AE%E9%85%8D%E5%88%97%E3%81%8B%E3%82%89%E6%A4%9C%E7%B4%A2%E3%81%99%E3%82%8B%20%E3%81%9D%E3%81%AE%E4%BB%96%E3%81%AE%E3%82%A2%E3%82%A4%E3%83%86%E3%83%A0*/
function return_arry_of_color_and_obj_src_alt (e) {
  let arry_color = [];
  let arry_obj = [];
  $('#CP .CPimg img').each(function(index) {
    let color = $(this).css('backgroundColor');
    let src = $(this).attr('src');
    let alt = $(this).attr('alt');
    arry_color.push(color);
    arry_obj.push({src: src, alt: alt});
  });
  return {color: arry_color, obj: arry_obj};
}
function return_arry_count_block_needed(arry_block_needed) {
  let count = {};
  arry_block_needed.forEach(function (i) {
    count[i] = (count[i] || 0) + 1;
  });
  delete count.none;
  let keyArray = Object.keys(count);
  let valArray = [];
  keyArray.forEach(function (element) {
    valArray.push(count[element]);
  });
  arry_block_needed = [2];
  arry_block_needed.push(keyArray);
  arry_block_needed.push(valArray);
  arry_block_needed.shift();
  return {name: 'items_needed', sheet: arry_block_needed};
}
/*https://teratail.com/questions/315143*/
/*https://qiita.com/FumioNonaka/items/678a1e74ab73e23d6f14*/
function return_obj_make_Blueprint_direction_horizon (arry, palette) {
  let arry_block_position = [1];
  let arry_block_needed = [2];
  let table_url_for_skins = [];
  let arry_url_for_rough = [];
  let count = 0;
  for (let l_y = 0; l_y < arry.length; l_y++) {
    let c = document.createElement("canvas");
    let ctx = c.getContext("2d");
    c.width = arry.length * 20;
    c.height = arry.length * 20;
    let arry_one_layer_p = [1];
    if (!table_url_for_skins[l_y]) {
      table_url_for_skins[l_y] = [];
    }
    arry.forEach((layer_z, z) => {
      let arrayCol = [];
      if (!table_url_for_skins[l_y][z]) {
        table_url_for_skins[l_y][z] = [];
      }
      layer_z[l_y].forEach((layer_x, x) => {
        let color = arry[z][l_y][x];
        let index = palette.color.indexOf(color);
        let alt, src;
        if (index < 0) {
          alt = 'none';
          src = 'none';
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 0.1;
          ctx.strokeRect(x * 20, z * 20, 20, 20);
        }
        else {
          alt = palette.obj[index].alt;
          src = palette.obj[index].src;
          //rough_Blueprint
          ctx.fillStyle = color;
          ctx.fillRect(x * 20, z * 20, 20, 20);
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 0.1;
          ctx.strokeRect(x * 20, z * 20, 20, 20);
        }
        //add arrys
        table_url_for_skins[l_y][z][x] = src;
        arrayCol.push(alt);
      });
      arry_block_needed = arry_block_needed.concat(arrayCol);
      arrayCol = arrayCol.reduce((resultArray, num, id) => {
        if (num === 'none') {
          resultArray[id] = '';
        }
        else {
          resultArray[id] = num;
        }
        return resultArray;
      }, []);
      arry_one_layer_p.push(arrayCol);
    });
    //if all x-y is none, do no action
    arry_one_layer_p.shift();
    for (let i = 0; i < arry_one_layer_p.length; i++) {
      if (arry_one_layer_p[i].filter(x => x !== '').length) {
        //delete unuse number
        arry_block_position.push({name: 'horizon_top_' + count, sheet: arry_one_layer_p});
        count++;
        //rough_Blueprint URL
        let type = "image/png";
        let dataurl = c.toDataURL(type);
        arry_url_for_rough.push(dataurl);
        break;
      }
    }
  }
  //delete unuse number
  arry_block_position.shift();
  arry_block_needed.shift();
  //count block needed
  if (arry_block_needed.length) {
    let obj = return_arry_count_block_needed(arry_block_needed);
    arry_block_needed = [];
    arry_block_needed.push(obj);
  }
  //remove none layer from table
  let new_table = [];
  table_url_for_skins.forEach((arry_xy, i) => {
    let this_layer = [];
    arry_xy.forEach((item, i) => {
      this_layer = this_layer.concat(item);
    });
    if (this_layer.filter(x => x !== 'none').length) {
      new_table.push(arry_xy);
    }
  });
  table_url_for_skins = new_table;
  return {p: arry_block_position, n: arry_block_needed, table: table_url_for_skins, r: arry_url_for_rough};
}
function return_obj_make_Blueprint_direction_vertical (arry, palette) {
  let arry_block_position = [1];
  let arry_block_needed = [2];
  let table_url_for_skins = [];
  let arry_url_for_rough = [];
  let count = 0;
  for (let l_z = arry.length - 1; l_z >= 0; l_z--) {
    let z = arry.length - (l_z + 1);
    let c = document.createElement("canvas");
    let ctx = c.getContext("2d");
    c.width = arry.length * 20;
    c.height = arry.length * 20;
    let arry_one_layer_p = [1];
    if (!table_url_for_skins[z]) {
      table_url_for_skins[z] = [];
    }
    arry[l_z].forEach((layer_y, y) => {
      let arrayCol = [];
      if (!table_url_for_skins[z][y]) {
        table_url_for_skins[z][y] = [];
      }
      layer_y.forEach((layer_x, x) => {
        let color = arry[l_z][y][x];
        let index = palette.color.indexOf(color);
        let alt, src;
        if (index < 0) {
          alt = 'none';
          src = 'none';
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 0.1;
          ctx.strokeRect(x * 20, y * 20, 20, 20);
        }
        else {
          alt = palette.obj[index].alt;
          src = palette.obj[index].src;
          //rough_Blueprint
          ctx.fillStyle = color;
          ctx.fillRect(x * 20, y * 20, 20, 20);
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 0.1;
          ctx.strokeRect(x * 20, y * 20, 20, 20);
        }
        //add arrys
        table_url_for_skins[z][y][x] = src;
        arrayCol.push(alt);
      });
      arry_block_needed = arry_block_needed.concat(arrayCol);
      arrayCol = arrayCol.reduce((resultArray, num, id) => {
        if (num === 'none') {
          resultArray[id] = '';
        }
        else {
          resultArray[id] = num;
        }
        return resultArray;
      }, []);
      arry_one_layer_p.push(arrayCol);
    });
    //if all x-y is none, do no action
    arry_one_layer_p.shift();
    for (let i = 0; i < arry_one_layer_p.length; i++) {
      if (arry_one_layer_p[i].filter(x => x !== '').length) {
        //delete unuse number
        arry_block_position.push({name: 'vertical_front_' + count, sheet: arry_one_layer_p});
        count++;
        //rough_Blueprint URL
        let type = "image/png";
        let dataurl = c.toDataURL(type);
        arry_url_for_rough.push(dataurl);
        break;
      }
    }
  }
  //delete unuse number
  arry_block_position.shift();
  arry_block_needed.shift();
  //count block needed
  if (arry_block_needed.length) {
    let obj = return_arry_count_block_needed(arry_block_needed);
    arry_block_needed = [];
    arry_block_needed.push(obj);
  }
  //remove none layer from table
  let new_table = [];
  table_url_for_skins.forEach((arry_xy, i) => {
    let this_layer = [];
    arry_xy.forEach((item, i) => {
      this_layer = this_layer.concat(item);
    });
    if (this_layer.filter(x => x !== 'none').length) {
      new_table.push(arry_xy);
    }
  });
  table_url_for_skins = new_table;
  return {p: arry_block_position, n: arry_block_needed, table: table_url_for_skins, r: arry_url_for_rough};
}
// WARNING: check crossorigin="anonymous" is active
function folder_into_skin_canvas (zip, direction, arry) {
  //new folder
  let folderName = 'block_layer_images';
  let skin_folder = zip.folder(folderName);
  arry.forEach((url, i) => {
    let c_Blob = imgblob(url);
    if (direction === 'horizon') {
      skin_folder.file('horizon_top_' + i, c_Blob);
    }
    if (direction === 'vertical') {
      skin_folder.file('vertical_front_' + i, c_Blob);
    }
  });
  //zipDownload
  zip.generateAsync({ type: "blob" }).then(function (content) {
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(content, "minecraft_blueprint.zip");
    } else {
      const url = (window.URL || window.webkitURL).createObjectURL(content);
      const download = document.createElement("a");
      download.href = url;
      download.download = "minecraft_blueprint.zip";
      download.click();
      (window.URL || window.webkitURL).revokeObjectURL(url);
    }
  });
}
function makeCanvas_url_arry (zip, direction, obj, folder_into_skin_canvas) {
  let arry = obj.table;
  if (obj.table === '' || obj.table === undefined) {
    return false;
  }
  let arry_url_for_skins = [];
  let border_arry = [];
  if (direction === 'horizon') {
    for (let l_y = 0; l_y < arry.length; l_y++) {
      if (!border_arry[l_y]) {
        border_arry[l_y] = [];
      }
      let c = document.createElement("canvas");
      let ctx = c.getContext("2d");
      c.width = arry[0].length * 20;
      c.height = arry[0].length * 20;
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 0.1;
      for (let z = 0; z < arry[l_y].length; z++) {
        for (let x = 0; x < arry[l_y][z].length; x++) {
          let src = arry[l_y][z][x];
          if (src === 'none') {
            ctx.strokeRect(x * 20, z * 20, 20, 20);
            border_arry[l_y].push(x);
            if (border_arry[l_y].length == Math.pow(arry[0].length, 2)) {
              if (l_z == arry.length - 1) {
                folder_into_skin_canvas(zip, direction, arry_url_for_skins);
                break;
              }
              continue;
            }
            continue;
          }
          let img = new Image();
          // WARNING: if can display img do -> crossorigin="anonymous ->html #Blueprint_with_skins_button toggle hidden
          img.crossOrigin = "anonymous";
          img.onload = function () {
            ctx.drawImage(img, x * 20, z * 20, 20, 20);
            ctx.strokeRect(x * 20, z * 20, 20, 20);
            border_arry[l_y].push(x);
            if (border_arry[l_y].length == Math.pow(arry[0].length, 2)) {
              //rough_Blueprint URL
              let type = "image/png";
              let dataurl = c.toDataURL(type);
              arry_url_for_skins.push(dataurl);
              if (l_y == arry.length - 1) {
                folder_into_skin_canvas(zip, direction, arry_url_for_skins);
                return false;
              }
            }
            return true;
          };
          img.src = src;
          continue;
        }
      }
    }
  }
  if (direction === 'vertical') {
    for (let l_z = 0; l_z < arry.length; l_z++) {
      if (!border_arry[l_z]) {
        border_arry[l_z] = [];
      }
      let c = document.createElement("canvas");
      let ctx = c.getContext("2d");
      c.width = arry[0].length * 20;
      c.height = arry[0].length * 20;
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 0.1;
      for (let y = 0; y < arry[l_z].length; y++) {
        for (let x = 0; x < arry[l_z][y].length; x++) {
          let src = arry[l_z][y][x];
          if (src === 'none') {
            ctx.strokeRect(x * 20, y * 20, 20, 20);
            border_arry[l_z].push(x);
            if (border_arry[l_z].length == Math.pow(arry[0].length, 2)) {
              if (l_z == arry.length - 1) {
                folder_into_skin_canvas(zip, direction, arry_url_for_skins);
                break;
              }
              continue;
            }
            continue;
          }
          let img = new Image();
          // WARNING: if can display img do -> crossorigin="anonymous ->html #Blueprint_with_skins_button toggle hidden
          img.crossOrigin = "anonymous";
          img.onload = function () {
            ctx.drawImage(img, x * 20, y * 20, 20, 20);
            ctx.strokeRect(x * 20, y * 20, 20, 20);
            border_arry[l_z].push(x);
            if (border_arry[l_z].length == Math.pow(arry[0].length, 2)) {
              //rough_Blueprint URL
              let type = "image/png";
              let dataurl = c.toDataURL(type);
              arry_url_for_skins.push(dataurl);
              if (l_z == arry.length - 1) {
                folder_into_skin_canvas(zip, direction, arry_url_for_skins);
                return false;
              }
            }
            return true;
          };
          img.src = src;
          continue;
        }
      }
    }
  }
}
//excel
/*https://docs.sheetjs.com/docs/api/utilities/*/
/*https://magazine.techacademy.jp/magazine/21073*/
/*https://learn.microsoft.com/ja-jp/office/dev/add-ins/excel/excel-add-ins-worksheets*/
/*https://yizm.work/editable-table/xlsx_download_try/*/
function s2ab(s) {
  let buf = new ArrayBuffer(s.length);
  let view = new Uint8Array(buf);
  for (let i = 0; i != s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF;
  }
  return buf;
}
function export_xlsx(arry) {
  let wopts = { bookType: 'xlsx', bookSST: false, type: 'binary'};
  let workbook = {SheetNames: [], Sheets: {}};
  arry.forEach((obj, i) => {
    //input sheetname
    let n = '';
    n = (n)?n:obj.name;
    workbook.SheetNames.push(n);
    workbook.Sheets[n] = XLSX.utils.aoa_to_sheet(obj.sheet);
  });
  let wbout = XLSX.write(workbook, wopts);
  let blob = new Blob([s2ab(wbout)], {type: 'application/octet-stream'});
  return blob;
}
//img
function imgblob(url) {
  let type = "image/png";
  let bin = atob(url.split(",")[1]);
  let buffer = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i);
  }
  return new Blob([buffer.buffer], { type: type });
}
//download actions
function download_Blueprint_data (direction, obj) {
  let zip = new JSZip();
  zip.file('items_needed.xlsx', export_xlsx(obj.n));
  zip.file('block_placement.xlsx', export_xlsx(obj.p));
  //new folder
  //rough img
  let folderName = 'rough_layer_images';
  let rough_folder = zip.folder(folderName);
  obj.r.forEach((url, i) => {
    let c_Blob = imgblob(url);
    if (direction === 'horizon') {
      rough_folder.file('horizon_top_' + i, c_Blob);
    }
    if (direction === 'vertical') {
      rough_folder.file('vertical_front_' + i, c_Blob);
    }
  });
  if ($('#not_need_block_skins').prop('checked')) {
    //zipDownload
    zip.generateAsync({ type: "blob" }).then(function (content) {
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(content, "minecraft_blueprint.zip");
      } else {
        const url = (window.URL || window.webkitURL).createObjectURL(content);
        const download = document.createElement("a");
        download.href = url;
        download.download = "minecraft_blueprint.zip";
        download.click();
        (window.URL || window.webkitURL).revokeObjectURL(url);
      }
    });
  }
  if ($('#need_block_skins').prop('checked')) {
    makeCanvas_url_arry (zip, direction, obj, folder_into_skin_canvas);
  }
}
function downBlueprint(e) {
  let arry = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
  if (arry.length <= 0) {
    return false;
  }
  const palette = return_arry_of_color_and_obj_src_alt (e);
  let direction = '';
  let obj = {};
  if ($('#Blueprint_direction_horizon').prop('checked')) {
    direction = 'horizon';
    obj = return_obj_make_Blueprint_direction_horizon (arry, palette);
  }
  if ($('#Blueprint_direction_vertical').prop('checked')) {
    direction = 'vertical';
    obj = return_obj_make_Blueprint_direction_vertical (arry, palette);
  }
  if (obj.n.length <= 0) {
    return false;
  }
  //add canvas
  let rough_c_id = '#plan_to_download_Blueprint .fourth.plan .frame .canvas';
  let rough_c_html = '<canvas data-id="dummy_before" width="400" height="400" class="before"></canvas>';
  for (let i = 0; i < obj.r.length; i++) {
    if (i == 0) {
      rough_c_html += '<canvas id="rough_c_0" width="400" height="400" class="present"></canvas>';
      continue;
    }
    if (i == 1) {
      rough_c_html += '<canvas id="rough_c_1" width="400" height="400" class="after"></canvas>';
      continue;
    }
    rough_c_html += '<canvas id="rough_c_' + i + '" width="400" height="400"></canvas>';
  }
  if (obj.r.length == 1) {
    rough_c_html += '<canvas data-id="dummy_after" width="400" height="400" class="after"></canvas>';
  }
  else {
    rough_c_html += '<canvas data-id="dummy_after" width="400" height="400"></canvas>';
  }
  $(rough_c_id).html(rough_c_html);
  //input url data
  setTimeout((e) =>{
    for (let i = 0; i < obj.r.length; i++) {
      let c = document.getElementById('rough_c_' + i);
      let ctx = c.getContext('2d');
      let put_img = new Image();
      // WARNING: if can display img do -> crossorigin="anonymous
      put_img.crossOrigin = "anonymous";
      put_img.onload = function () {
        ctx.drawImage(put_img, 0, 0, c.width, c.height);
        if (i == obj.r.length - 1) {
          $('#plan_to_download_Blueprint .fourth.plan').addClass('download');
          $('#plan_menu_3').prop('checked', true);
          $('#plan_to_download_Blueprint .plan_menu').scrollTop(0);
          $('#download_datas_button').on('click', (e) => {
            download_Blueprint_data (direction, obj);
          });
        }
      };
      put_img.src = obj.r[i];
    }
  }, 1)
}
$('#display_plan_of_Blueprint').click((e) => {
  $('#plan_menu_0').prop('checked', true);
  $('#plan_to_download_Blueprint').css('display', 'flex');
});
$('#check_datas_button').click((e) => {
  $('#download_datas_button').off('click');
  $('#plan_to_download_Blueprint .fourth.plan').removeClass('download');
  $('#wait').removeClass('hidden');
  downBlueprint(e);
  $('#wait').addClass('hidden');
});
$('#plan_to_download_Blueprint .plan_menu .back_plan').click((e) => {
  let plan_menu_length = $('input[name="plan_menu"]').length;
  let now_id = $('input[name="plan_menu"]:checked').attr('id');
  now_id = now_id.toString();
  now_id = now_id.replace('plan_menu_','');
  now_id = Number(now_id);
  if (now_id == 0) {
    if ($('#plan_to_download_Blueprint .fourth.plan.download').length) {
      now_id = plan_menu_length - 1;
    }
    if (!$('#plan_to_download_Blueprint .fourth.plan.download').length) {
      now_id = plan_menu_length - 2;
    }
  }
  else {
    now_id--;
  }
  $('#plan_menu_' + now_id).prop('checked', true);
  $('#plan_to_download_Blueprint .plan_menu').scrollTop(0);
});
$('#plan_to_download_Blueprint .plan_menu .forward_plan').click((e) => {
  let plan_menu_length = $('input[name="plan_menu"]').length;
  let now_id = $('input[name="plan_menu"]:checked').attr('id');
  now_id = now_id.toString();
  now_id = now_id.replace('plan_menu_','');
  now_id = Number(now_id);
  if (now_id == plan_menu_length - 1) {
    now_id = 0;
  }
  else if (!$('#plan_to_download_Blueprint .fourth.plan.download').length && now_id == plan_menu_length - 2) {
    now_id = 0;
  }
  else {
    now_id++;
  }
  $('#plan_menu_' + now_id).prop('checked', true);
  $('#plan_to_download_Blueprint .plan_menu').scrollTop(0);
});
$('input[name="plan_menu"]').change((e) => {
  $('#plan_to_download_Blueprint .plan_menu').scrollTop(0);
});
$('#plan_to_download_Blueprint .plan_menu label.slideshow[data-id="last_plan"]').click((e) => {
  if (!$('#plan_to_download_Blueprint .fourth.plan.download').length) {
    return false;
  }
});
$('#plan_to_download_Blueprint .fourth.plan i.fa-angles-right').click((e) => {
  let c_l = $('#plan_to_download_Blueprint .fourth.plan .frame canvas').length;
  let present_c_id = $('#plan_to_download_Blueprint .fourth.plan .frame canvas.present').attr('id');
  if (present_c_id === undefined || present_c_id === '') {
    return false;
  }
  present_c_id = present_c_id.toString();
  present_c_id = present_c_id.replace('rough_c_','');
  present_c_id = Number(present_c_id);
  if (present_c_id == c_l - 3) {
    return false;
  }
  $('#plan_to_download_Blueprint .fourth.plan .frame canvas').removeClass();
  present_c_id++;
  if (present_c_id == c_l - 3) {
    $('#plan_to_download_Blueprint .fourth.plan .frame canvas[data-id="dummy_after"]').addClass('after');
  }
  let bef_c_id = present_c_id - 1;
  let af_c_id = present_c_id + 1;
  $('#rough_c_' + bef_c_id).addClass('before');
  $('#rough_c_' + present_c_id).addClass('present');
  $('#rough_c_' + af_c_id ).addClass('after');
});
$('#plan_to_download_Blueprint .fourth.plan i.fa-angles-left').click((e) => {
  let present_c_id = $('#plan_to_download_Blueprint .fourth.plan .frame canvas.present').attr('id');
  if (present_c_id === undefined || present_c_id === '') {
    return false;
  }
  present_c_id = present_c_id.toString();
  present_c_id = present_c_id.replace('rough_c_','');
  present_c_id = Number(present_c_id);
  if (present_c_id == 0) {
    return false;
  }
  $('#plan_to_download_Blueprint .fourth.plan .frame canvas').removeClass();
  present_c_id--;
  if (present_c_id == 0) {
    $('#plan_to_download_Blueprint .fourth.plan .frame canvas[data-id="dummy_before"]').addClass('before');
  }
  let bef_c_id = present_c_id - 1;
  let af_c_id = present_c_id + 1;
  $('#rough_c_' + bef_c_id).addClass('before');
  $('#rough_c_' + present_c_id).addClass('present');
  $('#rough_c_' + af_c_id ).addClass('after');
});
$('#plan_to_download_Blueprint .close_button').click((e) => {
  $('#download_datas_button').off('click');
  $('#plan_to_download_Blueprint .fourth.plan').removeClass('download');
});
/*++icon_button++*/
//for_palette_resize
function resize_target (e) {
  let x,y;
  if (obj.use === 'mouse') {
    x = e.clientX;
    y = e.clientY;
  }
  if (obj.use === 'touch') {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  }
  let x_range = x - obj.start_x;
  let y_range = y - obj.start_y;
  obj.$target.css('width', obj.target_w + x_range + 'px');
  obj.$target.css('height', obj.target_h + y_range + 'px');
}
function move_icon (e) {
  let x,y;
  if (obj.use === 'mouse') {
    x = e.clientX;
    y = e.clientY;
  }
  if (obj.use === 'touch') {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  }
  let x_range = x - obj.start_x;
  let y_range = y - obj.start_y;
  obj.$icon.css('top', obj.icon_top + y_range + 'px');
  obj.$icon.css('left', obj.icon_left + x_range + 'px');
}
$("#for_palette_resize").mousedown(function (e) {
  e.preventDefault();
  obj.use = 'mouse';
  obj.$target = $(".palette .palette_board");
  obj.$icon = $("#for_palette_resize");
  obj.start_x = e.clientX;
  obj.start_y = e.clientY;
  obj.target_w = obj.$target.width();
  obj.target_h = obj.$target.height();
  obj.icon_top = obj.$icon.offset().top - obj.$target.offset().top;
  obj.icon_left = obj.$icon.offset().left - obj.$target.offset().left;
  document.addEventListener('mousemove', handleTouchMove, { passive: false });
  document.addEventListener('mousemove', resize_target);
  document.addEventListener('mousemove', move_icon);
});
$("#for_palette_resize").mouseup(function(e) {
  document.removeEventListener('mousemove', handleTouchMove, { passive: false });
  document.removeEventListener('mousemove', resize_target);
  document.removeEventListener('mousemove', move_icon);
});
$("#for_palette_resize").on('touchstart', function(e) {
  e.preventDefault();
  obj.use = 'touch';
  obj.$target = $(".palette .palette_board");
  obj.$icon = $("#for_palette_resize");
  obj.start_x = e.touches[0].clientX;
  obj.start_y = e.touches[0].clientY;
  obj.target_w = obj.$target.width();
  obj.target_h = obj.$target.height();
  obj.icon_top = obj.$icon.offset().top - obj.$target.offset().top;
  obj.icon_left = obj.$icon.offset().left - obj.$target.offset().left;
  document.addEventListener("touchmove", handleTouchMove, { passive: false });
  document.addEventListener("touchmove", resize_target);
  document.addEventListener("touchmove", move_icon);
});
$("#for_palette_resize").on('touchend', function(e) {
  document.removeEventListener("touchmove", handleTouchMove);
  document.removeEventListener("touchmove", resize_target);
  document.removeEventListener("touchmove", move_icon);
});
/*make_palette_board_compact*/
$('#CP_icons .CP_icons_form label[for="make_palette_board_compact"]').click(function (e) {
  if (!$('#make_palette_board_compact').prop('checked')) {
    $('#CP p.big_title').addClass('hidden');
    $('#CP input').each(function (e) {
      let id = $(this).attr('id');
      $('#' + id).prop('checked', false);
    });
    obj.$target = $(".palette .palette_board");
    obj.$icon = $("#for_palette_resize");
    obj.target_h = obj.$target.height();
    obj.icon_top = obj.$icon.offset().top - obj.$target.offset().top;
    let cp_icons_h = $('#CP_icons').height();
    let sum_h = cp_icons_h + 150;
    let difference_h = sum_h - obj.target_h;
    obj.$target.css('height', obj.target_h + difference_h + 'px');
    obj.$icon.css('top', obj.icon_top + difference_h + 'px');
  }
  if ($('#make_palette_board_compact').prop('checked')) {
    $('#CP p.big_title').removeClass('hidden');
    obj.$target = $(".palette .palette_board");
    obj.$icon = $("#for_palette_resize");
    obj.target_h = obj.$target.height();
    obj.icon_top = obj.$icon.offset().top - obj.$target.offset().top;
    let difference_h = 500 - obj.target_h;
    obj.$target.css('height', obj.target_h + difference_h + 'px');
    obj.$icon.css('top', obj.icon_top + difference_h + 'px');
  }
});
//palette color_boxes form download
/*https://techacademy.jp/magazine/21725*/
$(".palette .palette_download").click(function () {
  let getStr = "";
  $('#CP .CPimg').parent('label').each(function (index) {
    getStr = getStr + "_split_";
    let color_box_id = $(this).attr('id');
    getStr = getStr + "_id_" + color_box_id + "_id_";
    let parent_class = $(this).parent().attr('class');
    getStr = getStr + "_intoClass_" + parent_class + "_intoClass_";
    let children = $(this).children(".CPimg").children().clone(true);
    for (let j = 0; j < children.length; j++) {
      let alt = jQuery(children[j]).attr("alt");
      let cl = jQuery(children[j]).attr("class");
      let rgb = jQuery(children[j]).css("background-color");
      let src = jQuery(children[j]).attr("src");
      let tag = jQuery(children[j]).get(0).tagName;
      if (tag !== undefined) {
        getStr = getStr + "_tagF_" + tag + "_tag_";
      }
      if (cl !== undefined) {
        getStr = getStr + "_class_" + cl + "_class_";
      }
      if (src !== undefined) {
        getStr = getStr + "_src_" + src + "_src_";
      }
      if (alt !== undefined) {
        getStr = getStr + "_alt_" + alt + "_alt_";
      }
      if (rgb !== undefined) {
        getStr = getStr + "_rgb_" + rgb + "_rgb_";
      }
    }
  });
  let blob = new Blob([getStr], { type: "text/plain" });
  let link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "palette_data.txt";
  link.click();
  link.remove();
});
//palette color_boxes form upload
function return_array_doinput(alt_arr, src_arr, str) {
  let array_html = [];
  str = str.split("_split_").slice(1);
  for (let i = 0; i < str.length; i++) {
    let color_box_id = str[i].split("_id_").slice(1, 2);
    let html = '<label id="' + color_box_id + '">';
    html += '<div class="CPimg">';
    let img = str[i].split("_tagF_").slice(1);
    for (let j = 0; j < img.length; j++) {
      let cl = img[j].split("_class_").slice(1, 2);
      let src = img[j].split("_src_").slice(1, 2);
      let alt = img[j].split("_alt_").slice(1, 2);
      let rgb = img[j].split("_rgb_").slice(1, 2);
      let index = alt_arr.indexOf(alt[0]);
      if (index >= 0) {
        src = src_arr[index];
      }
      // WARNING: if can display img do -> crossorigin="anonymous
      html = html + '<img class="' + cl + '" src="' + src + '" alt="' + alt + '" style="background: ' + rgb + ';" crossorigin="anonymous">';
      //html += '<img class="' + cl + '" src="' + src + '" alt="' + alt + '" style="background: ' + rgb + ';">';
    }
    html += "</div></label>";
    let parent_class = str[i].split("_intoClass_").slice(1, 2);
    array_html.push({parent_class: parent_class, html: html});
  }
  return array_html;
}
$("#palette_upload").change(function (e) {
  e.preventDefault();
  const file = e.target.files[0];
  if (file === undefined) {
    $("#palette_upload").val('');
    return false;
  }
  $('html').css('cursor', 'wait');
  let alt_arr = [];
  let src_arr = [];
  $("#CP .CPimg").children("img").each(function (index) {
    let alt = $(this).attr("alt");
    let src = $(this).attr("src");
    alt_arr.push(alt);
    src_arr.push(src);
  });
  $('#CP .CPimg').parent().each(function (index) {
    $(this).remove();
  });
  const reader = new FileReader();
  reader.onload = () => {
    let str = reader.result;
    str = return_str_escape_html(str);
    let array_html = return_array_doinput(alt_arr, src_arr, str);
    for (let i = 0; i < array_html.length; i++) {
      let parent_class = array_html[i].parent_class;
      $('#CP .' + parent_class).append(array_html[i].html);
    }
    $("#palette_upload").val('');
    $('html').css('cursor', 'default');
  };
  reader.readAsText(file);
});
//remove_CP_boxes
$('#CP_icons .CP_icons_form button.remove_CP_box').click((e) => {
  let target_class = $('#CP label.check').parent().attr('class');
  if (target_class === 'color_named_blocks') {
    return false;
  }
  $('#CP label.check').remove();
  $("#CP .CPimg").parent().each(function (index) {
    let new_index = index + 1;
    $(this).attr('id', 'CP' + new_index);
  });
});
//++observer cp start++
//new_block_imgs
$('#CP .add_new_blocks button').on('click', (e) => {
  $('#new_block_img').click();
});
function upload_new_blocks (i, cp_L, files, callback) {
  let reader = new FileReader();
  let image = new Image();
  reader.onload = function (evt) {
    image.onload = function () {
      let c = document.createElement("canvas");
      let ctx = c.getContext("2d");
      c.width = 50;
      c.height = 50;
      ctx.drawImage(image, 0, 0, 50, 50);
      let img = document.createElement("img");
      img.crossOrigin = "anonymous";
      let alt = files[i].name;
      alt = alt.split(".");
      img.onload = function () {
        $("#CP label.check").removeClass("check");
        let str = '<label id="CP' + cp_L + '"><div class="CPimg"></div></label>';
        $("#CP .add_new_blocks").append(str);
        const cp = document.querySelector('#CP' + cp_L + ' .CPimg');
        cp.appendChild(img);
        c = document.createElement("canvas");
        ctx = c.getContext("2d");
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(0, 0, 1, 1);
        ctx.drawImage(image, 0, 0, 1, 1);
        let pixel = ctx.getImageData(0, 0, 1, 1);
        let data = pixel.data;
        const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
        setTimeout((e) => {
          $("#CP" + cp_L + " .CPimg img").css("background", rgb);
          i++;
          if (i >= files.length) {
            $('#new_block_img').val('');
            //$("#CP" + cp_L).addClass("check");
            return false;
          }
          cp_L ++;
          callback (i, cp_L, files, upload_new_blocks);
        }, 0)
      };
      img.src = c.toDataURL();
      img.alt = alt[0];
      img.className = "mImg";
    };
    image.src = evt.target.result;
  };
  reader.readAsDataURL(files[i]);
}
$('#new_block_img').on('change', (e) => {
  let cp_L = $("#CP .CPimg").length;
  cp_L = cp_L + 1;
  let files = e.target.files;
  if (files === undefined) {
    return false;
  }
  let i = 0;
  upload_new_blocks (i, cp_L, files, upload_new_blocks);
});
/*observe color boxes at #CP*/
//pop up img alt pc_text
function pop_text_cp_use_mouse (e) {
  obj.pop_text = $(this).attr('alt');
  obj.use = 'mouse';
  pop_text_at_hover (e);
}
function pop_text_cp_use_mouse_remove(e) {
  $('#CP_img_explanation').remove();
}
function pop_text_cp_use_touch (e) {
  obj.pop_text = $(this).attr('alt');
  obj.use = 'touch';
  pop_text_at_hover (e);
}
function pop_text_cp_use_touch_remove (e) {
  $('#CP_img_explanation').remove();
}
$('#CP .CPimg img').each(function (index) {
  $(this).on('mouseenter', pop_text_cp_use_mouse);
  $(this).on('mouseleave', pop_text_cp_use_mouse_remove);
  $(this).on('touchstart', pop_text_cp_use_touch);
  $(this).on('touchend', pop_text_cp_use_touch_remove);
});
//click action of palette color boxes
function click_palette_color_boxes(id,x,y) {
  let elem = document.elementFromPoint(x, y);
  if (elem === null) {
    return false;
  }
  let $elem = jQuery(elem);
  let tag = $elem.get(0).tagName;
  let active_class = $elem.attr('class');
  //change img
  if (tag === 'IMG') {
    for (let i = 1; i <= 4; i++) {
      if (active_class === 'dis' + i + ' appear') {
        $("#" + id + " *").removeClass("appear");
        $("#" + id + " *").removeClass("mImg");
        $elem.addClass("mImg");
        break;
      }
      else if (active_class === 'dis' + i + ' mImg') {
        $("#CP *").removeClass("appear");
        $("#" + id + " .CPimg").find("img").addClass("appear");
        break;
      }
      else {
        $("#CP *").removeClass("appear");
      }
    }
  }
  else {
    $("#CP *").removeClass("appear");
  }
  //palette color select
  $("#CP *").removeClass("check");
  $("#" + id).addClass("check");
  //pick color display
  let obj_data = return_img_html_arry_rgb (id);
  $('.palette .palette_button .selected_block_img, #CP_icons .selected_block_img').html(obj_data.html);
  $('#CP_icons .rgb span.rgbR').text(obj_data.rgb[0]);
  $('#CP_icons .rgb span.rgbG').text(obj_data.rgb[1]);
  $('#CP_icons .rgb span.rgbB').text(obj_data.rgb[2]);
}
//drag and drop into selected same types
function removeEvent_selected_color_box (e) {
  document.removeEventListener('mousemove', selected_color_box_move);
  document.removeEventListener('mouseup', selected_color_box_into_group);
  document.removeEventListener('touchmove', selected_color_box_move);
  document.removeEventListener('touchend', selected_color_box_into_group);
}
function selected_color_box_use_mouse (e) {
  e.preventDefault();
  let id = $(this).attr('id');
  let parent_class = $(this).parent().attr('class');
  let x = e.clientX;
  let y = e.clientY;
  click_palette_color_boxes(id,x,y);
  if (parent_class === 'color_named_blocks') {
    return false;
  }
  obj.use = 'mouse';
  obj.target_id = id;
  obj.parent_class = parent_class;
  let html = $(this).html();
  $('#selected_color_box').append(html);
  document.addEventListener('mousemove', selected_color_box_move);
  document.addEventListener('mouseup', selected_color_box_into_group);
}
function selected_color_box_use_touch (e) {
  e.preventDefault();
  let id = $(this).attr('id');
  let parent_class = $(this).parent().attr('class');
  let x = e.touches[0].clientX;
  let y = e.touches[0].clientY;
  click_palette_color_boxes(id,x,y);
  if (parent_class === 'color_named_blocks') {
    return false;
  }
  obj.use = 'touch';
  obj.target_id = id;
  obj.parent_class = parent_class;
  let html = $('#' + id).html();
  $('#selected_color_box').append(html);
  document.addEventListener('touchmove', selected_color_box_move);
  document.addEventListener('touchend', selected_color_box_into_group);
}
function selected_color_box_move (e) {
  $('#' + obj.target_id).css('opacity', '0.5');
  let x,y;
  if (obj.use === 'mouse') {
    x = e.clientX;
    y = e.clientY;
  }
  if (obj.use === 'touch') {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  }
  $('#selected_color_box').css('display', 'block');
  $('#selected_color_box').css('top', y);
  $('#selected_color_box').css('left', x);
  obj.bef_x = x;
  obj.bef_y = y;
  let elem = document.elementFromPoint(x, y);
  if (elem === null) {
    return true;
  }
  let $elem = jQuery(elem);
  let active_class = $elem.attr('class');
  if (active_class === 'easy_to_gather'
  || active_class === 'hard_in_overworld'
  || active_class === 'in_nether'
  || active_class === 'in_end'
  || active_class === 'small_title') {
    $('#CP .active').removeClass('active');
    $elem.addClass('active');
  }
  let cp_top = $(".palette .palette_board").offset().top + 116;
  let cp_bottom = $(".palette .palette_board").offset().top + $(".palette .palette_board").height();
  let palette_board_scroll_top = $('.palette .palette_board').scrollTop();
  if (y <= cp_top) {
    palette_board_scroll_top -= 20;
    $('.palette .palette_board').scrollTop(palette_board_scroll_top);
  }
  if (y >= cp_bottom) {
    palette_board_scroll_top += 20;
    $('.palette .palette_board').scrollTop(palette_board_scroll_top);
  }
}
function selected_color_box_reset (e) {
  $('#' + obj.target_id).css('opacity', '1');
  $('#selected_color_box').html('');
  $('#selected_color_box').css('display', 'none');
  obj.use = '';
  obj.target_id = '';
  obj.parent_class = '';
  obj.bef_x = '';
  obj.bef_y = '';
  return true;
}
function move_to_this_class(target_class) {
  $('#' + obj.target_id).remove();
  let html = $('#selected_color_box').html();
  html = jQuery('<label id="' + obj.target_id + '">').append(html);
  $(target_class).append(html);
  selected_color_box_reset();
}
function selected_color_box_into_group (e) {
  $('#CP .active').removeClass('active');
  let x = obj.bef_x;
  let y = obj.bef_y;
  let elem = document.elementFromPoint(x, y);
  if (elem === null) {
    selected_color_box_reset (e);
    removeEvent_selected_color_box (e);
    return false;
  }
  $elem = jQuery(elem);
  let active_class = $elem.attr('class');
  let active_for = $elem.attr('for');
  let want_if;
  if (active_class === 'easy_to_gather' || active_for === 'easy_to_gather') {
    want_if = 'easy_to_gather';
  }
  else if (active_class === 'hard_in_overworld' || active_for === 'hard_in_overworld') {
    want_if = 'hard_in_overworld';
  }
  else if (active_class === 'in_nether' || active_for === 'in_nether') {
    want_if = 'in_nether';
  }
  else if (active_class === 'in_end' || active_for === 'in_end') {
    want_if = 'in_end';
  }
  else {
    want_if = 'false';
  }
  removeEvent_selected_color_box (e);
  if (want_if === 'easy_to_gather') {
    if (obj.parent_class === 'easy_to_gather') {
      selected_color_box_reset (e);
    }
    if (obj.parent_class !== 'easy_to_gather') {
      let target_class = '#CP .easy_to_gather';
      move_to_this_class(target_class);
    }
  }
  else if (want_if === 'hard_in_overworld') {
    if (obj.parent_class === 'hard_in_overworld') {
      selected_color_box_reset (e);
    }
    if (obj.parent_class !== 'hard_in_overworld') {
      let target_class = '#CP .hard_in_overworld';
      move_to_this_class(target_class);
    }
  }
  else if (want_if === 'in_nether') {
    if (obj.parent_class === 'in_nether') {
      selected_color_box_reset (e);
    }
    if (obj.parent_class !== 'in_nether') {
      let target_class = '#CP .in_nether';
      move_to_this_class(target_class);
    }
  }
  else if (want_if === 'in_end') {
    if (obj.parent_class === 'in_end') {
      selected_color_box_reset (e);
    }
    if (obj.parent_class !== 'in_end') {
      let target_class = '#CP .in_end';
      move_to_this_class(target_class);
    }
  }
  else {
    selected_color_box_reset (e);
  }
}
$("#CP .CPimg").parent().each(function (index) {
  $(this).on('mousedown', selected_color_box_use_mouse);
  $(this).on('touchstart', selected_color_box_use_touch);
});
/*https://pisuke-code.com/mutation-observer-infinite-loop/*/
const palette_board_cp = document.querySelector('#CP');
const cp_config = { childList: true, subtree: true };
const cp_callback = function(e) {
  //reset
  $('#CP .add_new_blocks button').off('click');
  $('#new_block_img').off('change');
  $('#CP .CPimg img').each(function (index) {
    $(this).off('mouseenter mouseleave touchstart touchend');
  });
  $("#CP .CPimg").parent().each(function (index) {
    $(this).off('mousedown touchstart');
  });
  //input
  $('#CP .add_new_blocks button').on('click', (e) => {
    $('#new_block_img').click();
  });
  $('#new_block_img').on('change', (e) => {
    let cp_L = $("#CP .CPimg").length;
    cp_L = cp_L + 1;
    let files = e.target.files;
    if (files === undefined) {
      return false;
    }
    let i = 0;
    upload_new_blocks (i, cp_L, files, upload_new_blocks);
  });
  $('#CP .CPimg img').each(function (index) {
    $(this).on('mouseenter', pop_text_cp_use_mouse);
    $(this).on('mouseleave', pop_text_cp_use_mouse_remove);
    $(this).on('touchstart', pop_text_cp_use_touch);
    $(this).on('touchend', pop_text_cp_use_touch_remove);
  });
  $("#CP .CPimg").parent().each(function (index) {
    $(this).on('mousedown', selected_color_box_use_mouse);
    $(this).on('touchstart', selected_color_box_use_touch);
  });
};
const observer_cp = new MutationObserver(cp_callback);
observer_cp.observe(palette_board_cp, cp_config);
//^^^observer cp end^^^
//toggle radio checked action normal_tool
let toggle_normal_tool_selecter = '.normal_tool > label:not(label[for="normal_tool_button"])';
toggle_normal_tool_selecter += ', .layer_selector label[for="jump_to_this_layer"]';
$(toggle_normal_tool_selecter).click(function (e) {
  let id = $(this).attr('for');
  toggle_radio_checked (id);
});
//pop up explain of roll_back_and_forward
let pop_text_selecter = '.roll_back_and_forward .roll_back';
pop_text_selecter += ', .roll_back_and_forward .roll_forward';
pop_text_selecter += ', .layer_selector .layer_copy';
pop_text_selecter += ', .layer_selector .layer_paste';
pop_text_selecter += ', .zoom_in_out_scope label[for="plus_scope_icon"]';
pop_text_selecter += ', .zoom_in_out_scope label[for="minus_scope_icon"]';
$(pop_text_selecter).on('mouseenter', function(e) {
  obj.pop_text = $(this).children('span.shortcut').html();
  obj.use = 'mouse';
  pop_text_at_hover (e);
});
$(pop_text_selecter).on('mouseleave', function(e) {
  $('#CP_img_explanation').remove();
});
//change layers
let change_layers_selecter = '#select_vertical_layers';
change_layers_selecter += ', #select_side_layers';
change_layers_selecter += ', #select_horizon_layers';
$(change_layers_selecter).change((e) => {
  let id = $(e.target).attr('id');
  $('#' + id + ' option.selected').removeClass('selected');
  $('#' + id + ' option[value="' + $(e.target).val() + '"]').addClass('selected');
  change_select_layer (e);
});
/*button which has tool icons move*/
function palette_button_move (e) {
  let x,y;
  if (obj.use === 'mouse') {
    x = e.clientX;
    y = e.clientY;
  }
  if (obj.use === 'touch') {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  }
  let x_range = x - obj.start_x;
  let y_range = y - obj.start_y;
  obj.$icon.css('position', 'fixed');
  obj.$icon.css('z-index', '51');
  obj.$icon.css('top', obj.icon_top + y_range + 'px');
  obj.$icon.css('left', obj.icon_left + x_range + 'px');
}
let tool_icons_selecters = '.palette .palette_button > i';
tool_icons_selecters += ', .zoom_in_out_scope .zoom_scope_button > i';
tool_icons_selecters += ', .normal_tool .normal_tool_button > i';
tool_icons_selecters += ', .roll_back_and_forward .roll_both_button > i';
tool_icons_selecters += ', .layer_selector .layer_selector_button > i';
tool_icons_selecters += ', .palette .palette_button > .selected_block_img';
function choose_$icon_from_buttons_class (button_class) {
  let $icon;
  if (button_class === 'palette_button') {
    $icon = $('.palette');
  }
  if (button_class === 'zoom_scope_button') {
    $icon = $('.zoom_in_out_scope');
  }
  if (button_class === 'normal_tool_button') {
    $icon = $('.normal_tool');
  }
  if (button_class === 'roll_both_button') {
    $icon = $('.roll_back_and_forward');
  }
  if (button_class === 'layer_selector_button') {
    $icon = $('.layer_selector');
  }
  return $icon;
}
$(tool_icons_selecters).mousedown(function (e) {
  e.preventDefault();
  obj.use = 'mouse';
  let button_class = $(this).parent().attr('class');
  obj.$icon = choose_$icon_from_buttons_class (button_class);
  obj.start_x = e.clientX;
  obj.start_y = e.clientY;
  obj.icon_top = obj.$icon.offset().top;
  obj.icon_left = obj.$icon.offset().left;
  document.addEventListener('mousemove', handleTouchMove, { passive: false });
  document.addEventListener('mousemove', palette_button_move);
});
$(tool_icons_selecters).mouseup(function(e) {
  document.removeEventListener('mousemove', handleTouchMove, { passive: false });
  document.removeEventListener('mousemove', palette_button_move);
});
$(tool_icons_selecters).on('touchstart', function (e) {
  e.preventDefault();
  obj.use = 'touch';
  let button_class = $(this).parent().attr('class');
  obj.$icon = choose_$icon_from_buttons_class (button_class);
  obj.start_x = e.touches[0].clientX;
  obj.start_y = e.touches[0].clientY;
  obj.icon_top = obj.$icon.offset().top;
  obj.icon_left = obj.$icon.offset().left;
  document.addEventListener("touchmove", handleTouchMove, { passive: false });
  document.addEventListener("touchmove", palette_button_move);
});
$(tool_icons_selecters).on('touchend', function(e) {
  document.removeEventListener("touchmove", handleTouchMove);
  document.removeEventListener("touchmove", palette_button_move);
});
/*++main++*/
//add main height at resizing_canvas
/*https://qiita.com/morozumi_h/items/ba8c1e474e86ef7ef950*/
/*https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe*/
/*https://pisuke-code.com/mutation-observer-infinite-loop/*/
const editing_areas = document.querySelector('#editing_areas');
const observer_canvas = new MutationObserver(function() {
  const width = editing_areas.getBoundingClientRect().width;
  const height = editing_areas.getBoundingClientRect().height;
  if (height >= 900) {
    let h = height + 300;
    $('main').css('height', h);
  }
  if (height < 900) {
    $('main').css('height', 1000);
  }
});
observer_canvas.observe(editing_areas, {attributes: true});
//drag and drop images into web to change pixels
/*https://r17n.page/2020/10/24/html-js-drag-and-drop-file/*/
/*https://kuroeveryday.blogspot.com/2019/01/finding-nearest-colors-using-euclidean-distance.html*/
function return_arry_of_checked_color_and_obj_src_alt (e) {
  let arry_color = [];
  let arry_obj = [];
  $('#CP .CPimg img').each(function(index) {
    let target = $(this).parent().parent().parent().attr('class');
    if ($('#' + target).prop('checked')) {
      let color = $(this).css('backgroundColor');
      let src = $(this).attr('src');
      let alt = $(this).attr('alt');
      arry_color.push(color);
      arry_obj.push({src: src, alt: alt});
    }
  });
  return {color: arry_color, obj: arry_obj};
}
let convertToRGB = function (rgb) {
  rgb = rgb.replace("rgb(", "");
  rgb = rgb.replace(")", "");
  rgb = rgb.split(",");
  return { r: rgb[0], g: rgb[1], b: rgb[2]};
};
let chooseColor = function (calcDelta, palette, inrgb) {
  const rgb = convertToRGB(inrgb);
  let color;
  let delta = Number.MAX_SAFE_INTEGER;
  palette.color.forEach((p) => {
    // カラーパレットの色(RGB)
    const prgb = convertToRGB(p);
    const d = calcDelta(rgb, prgb);
    if (d < delta) {
      color = p;
      delta = d;
    }
  });
  return color;
};
let chooseImg = function (paletteId, palette, choosergb) {
  let img;
  let index = palette.indexOf(choosergb);
  let pId = paletteId[index];
  if (pId === undefined) {
    $('#wait').addClass('hidden');
    return false;
  }
  pId = pId.split("/");
  if (pId.length > 1) {
    img = $("#" + pId[0] + " .CPimg").find("img." + pId[1]);
    img = jQuery("<div>").append(img.clone(true));
    img.children().addClass("mImg");
    img = img.html();
  } else {
    img = $("#" + pId + " .CPimg").html();
  }
  return img;
};
//first make menu action
function for_sample_view_action(e) {
  let image = obj.dl_img;
  const svc0 = document.getElementById("sample_view_0");
  const svc0tx = svc0.getContext("2d");
  const svc1 = document.getElementById("sample_view_1");
  const svc1tx = svc1.getContext("2d");
  const svc2 = document.getElementById("sample_view_2");
  const svc2tx = svc2.getContext("2d");
  const svc3 = document.getElementById("sample_view_3");
  const svc3tx = svc3.getContext("2d");
  let sample_array = [svc0tx, svc1tx, svc2tx, svc3tx];
  sample_array.forEach(function(ele) {
    ele.clearRect(0, 0, ele.width, ele.height);
  });
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  let imgH = image.height;
  let imgW = image.width;
  let cx = 0;
  let cy = 0;
  c.width = 171;
  c.height = 171;
  if (imgH >= imgW) {
    cy = (imgH - imgW) / 2;
    imgH = imgW;
  } else {
    cx = (imgW - imgH) / 2;
    imgW = imgH;
  }
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(0, 0, 171, 171);
  ctx.drawImage(image, cx, cy, imgW, imgH, 0, 0, 171, 171);
  $('#CP .active').removeClass('active');
  const palette = return_arry_of_checked_color_and_obj_src_alt (e);
  let ratio_r = $('#sample_ratio_r').val();
  let ratio_g = $('#sample_ratio_g').val();
  let ratio_b = $('#sample_ratio_b').val();
  let sum_ratio = ratio_r + ratio_g + ratio_b;
  //fix amount
  if (sum_ratio > 1) {
    ratio_r = ratio_r / sum_ratio;
    ratio_r = Math.floor(ratio_r * 100) / 100;
    ratio_g = ratio_g / sum_ratio;
    ratio_g = Math.floor(ratio_g * 100) / 100;
    ratio_b = 1 - ratio_r - ratio_g;
    $('#sample_ratio_r').val(ratio_r);
    $('#sample_ratio_g').val(ratio_g);
    $('#sample_ratio_b').val(ratio_b);
  }
  for (let k = 0; k < sample_array.length; k++) {
    //change rgb ratio use randomizer
    if (k > 0) {
      let calc = Math.random();
      if (calc > 0.5) {
        ratio_r = ratio_r + Math.min(0.2, Math.random());
      }
      else {
        ratio_r = ratio_r - Math.min(0.2, Math.random());
        if (ratio_r < 0) {
          ratio_r = ratio_r + 1;
        }
      }
      calc = Math.random();
      if (calc > 0.5) {
        ratio_g = ratio_g + Math.min(0.2, Math.random());
      }
      else {
        ratio_g = ratio_g - Math.min(0.2, Math.random());
        if (ratio_g < 0) {
          ratio_g = ratio_g + 1;
        }
      }
      ratio_r = Math.floor(ratio_r * 100) / 100;
      ratio_g = Math.floor(ratio_g * 100) / 100;
      if (isNaN(ratio_r)) {
        ratio_r = 0.3;
      }
      if (isNaN(ratio_g)) {
        ratio_g = 0.59;
      }
      sum_ratio = ratio_r + ratio_g;
      if (sum_ratio > 1) {
        ratio_r = ratio_r / sum_ratio;
        ratio_r = Math.floor(ratio_r * 100) / 100;
        ratio_g = ratio_g / sum_ratio;
        ratio_g = Math.floor(ratio_g * 100) / 100;
      }
      ratio_b = 1 - ratio_r - ratio_g;
      ratio_b = Math.floor(ratio_b * 100) / 100;
      if (isNaN(ratio_b)) {
        ratio_b = 0.11;
      }
    }
    let target_id = 'sample_view_' + k;
    $('#' + target_id + ' ~ p span.r').text(ratio_r);
    $('#' + target_id + ' ~ p span.g').text(ratio_g);
    $('#' + target_id + ' ~ p span.b').text(ratio_b);
    let calcDelta = function ( t, p) {
      return ( Math.pow((p.r - t.r) * ratio_r, 2) + Math.pow((p.g - t.g) * ratio_g, 2) + Math.pow((p.b - t.b) * ratio_b, 2));
    };
    for (let i = 0; i < 171; i++) {
      for (let j = 0; j < 171; j++) {
        let pixel = ctx.getImageData(j, i, 1, 1);
        let data = pixel.data;
        const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
        if (rgb === 'rgb(255, 255, 255)') {
          continue;
        }
        sample_array[k].fillStyle = chooseColor(calcDelta, palette, rgb);
        sample_array[k].fillRect(j, i, 1, 1);
      }
    }
  }
  $('#wait').addClass('hidden');
  $('#for_sample_view').css('display', 'flex');
}
function change_to_blocks(e) {
  let image = obj.dl_img;
  let rough_c_size = 400;
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  let imgH = image.height;
  let imgW = image.width;
  let cx = 0;
  let cy = 0;
  c.width = rough_c_size;
  c.height = rough_c_size;
  if (imgH >= imgW) {
    cy = (imgH - imgW) / 2;
    imgH = imgW;
  } else {
    cx = (imgW - imgH) / 2;
    imgW = imgH;
  }
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(0, 0, rough_c_size, rough_c_size);
  ctx.drawImage(image, cx, cy, imgW, imgH, 0, 0, rough_c_size, rough_c_size);
  const palette = return_arry_of_checked_color_and_obj_src_alt (e);
  let ratio_r = $('#sample_ratio_r').val();
  let ratio_g = $('#sample_ratio_g').val();
  let ratio_b = $('#sample_ratio_b').val();
  let calcDelta = function ( t, p) {
    return ( Math.pow((p.r - t.r) * ratio_r, 2) + Math.pow((p.g - t.g) * ratio_g, 2) + Math.pow((p.b - t.b) * ratio_b, 2));
  };
  const cp = document.getElementById('check_photo');
  const cptx = cp.getContext("2d");
  cp.width = rough_c_size;
  cp.height = rough_c_size;
  cptx.fillStyle = "rgb(255, 255, 255)";
  cptx.fillRect(0, 0, rough_c_size, rough_c_size);
  for (let i = 0; i < rough_c_size; i++) {
    for (let j = 0; j < rough_c_size; j++) {
      let pixel = ctx.getImageData(j, i, 1, 1);
      let data = pixel.data;
      const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
      if (rgb === 'rgb(255, 255, 255)') {
        continue;
      }
      cptx.fillStyle = chooseColor(calcDelta, palette, rgb);
      cptx.fillRect(j, i, 1, 1);
    }
  }
  obj.dl_c = cptx.getImageData(0, 0, cp.width, cp.height);
  if (!$('#art_size').val()) {
    $('#art_size').val(30);
  }
  $('#art_size_in_make_plan').val($('#art_size').val());
  $('#make_menu_1').prop('checked', true);
  $('#for_sample_view .make_menu').scrollTop(0);
}
$('#for_sample_view .sub_selected_color_box label').click((e) => {
  let color_box_id = $(e.target).attr('for');
  setTimeout((e) => {
    if ($('#' + color_box_id).prop('checked')) {
      $('#for_sample_view .sub_selected_color_box label[for="' + color_box_id + '"]').addClass('box_selected');
    }
    if (!$('#' + color_box_id).prop('checked')) {
      $('#for_sample_view .sub_selected_color_box label[for="' + color_box_id + '"]').removeClass('box_selected');
    }
  }, 1)
});
$('#sample_view_default_ratio').click((e) => {
  $('#sample_ratio_r').val(0.30);
  $('#sample_ratio_g').val(0.59);
  $('#sample_ratio_b').val(0.11);
});
$('#for_sample_view input[name="sample_view"]').change((e) => {
  let target_id = $('#for_sample_view input[name="sample_view"]:checked').attr('id');
  let ratio_r = $('#' + target_id + ' ~ p span.r').text();
  let ratio_g = $('#' + target_id + ' ~ p span.g').text();
  let ratio_b = $('#' + target_id + ' ~ p span.b').text();
  ratio_r = Number(ratio_r);
  ratio_g = Number(ratio_g);
  ratio_b = Number(ratio_b);
  $('#sample_ratio_r').val(ratio_r);
  $('#sample_ratio_g').val(ratio_g);
  $('#sample_ratio_b').val(ratio_b);
});
$('#sample_view_retry').click((e) => {
  $('#wait').removeClass('hidden');
  $('#for_sample_view').css('display', 'none');
  setTimeout((e) => {
    for_sample_view_action();
    $('#wait').addClass('hidden');
  }, 1)
});
$('#sample_view_to_go').click((e) => {
  $('#wait').removeClass('hidden');
  setTimeout((e) => {
    change_to_blocks();
    $('#wait').addClass('hidden');
  }, 1)
});
//second make menu action
const make_menu_second = document.querySelector('#for_sample_view .second.plan');
function cursor_change_action(e) {
  const cp = document.getElementById('check_photo');
  const cptx = cp.getContext("2d");
  let c_top = $('#check_photo').offset().top;
  let c_left = $('#check_photo').offset().left;
  let c_w = $('#check_photo').width();
  let c_h = $('#check_photo').height();
  let c_scale = c_w / cp.width;
  if (obj.area_top === '') {
    obj.area_top = 0;
  }
  if (obj.area_left === '') {
    obj.area_left = 0;
  }
  if (obj.area_w === '') {
    obj.area_w = c_w / c_scale;
  }
  if (obj.area_h === '') {
    obj.area_h = c_h / c_scale;
  }
  let area_top = Math.round(obj.area_top * c_scale);
  let area_left = Math.round(obj.area_left * c_scale);
  let area_w = Math.round(obj.area_w * c_scale);
  let area_h = Math.round(obj.area_h * c_scale);
  if (e.clientY > (area_top + c_top) - 20 && e.clientY < (area_top + c_top) + 20 &&
  e.clientX > (area_left + c_left) - 20 && e.clientX < (area_left + c_left) + 20 ||
  e.clientY > ((area_top + c_top) + area_h) - 20 && e.clientY < ((area_top + c_top) + area_h) + 20 &&
  e.clientX > ((area_left + c_left) + area_w) - 20 && e.clientX < ((area_left + c_left) + area_w) + 20) {
    $('html').css('cursor', 'nwse-resize');
  }
  else if (e.clientY > ((area_top + c_top) + area_h) - 20 && e.clientY < ((area_top + c_top) + area_h) + 20 &&
  e.clientX > (area_left + c_left) - 20 && e.clientX < (area_left + c_left) + 20 ||
  e.clientY > (area_top + c_top) - 20 && e.clientY < (area_top + c_top) + 20 &&
  e.clientX > ((area_left + c_left) + area_w) - 20 && e.clientX < ((area_left + c_left) + area_w) + 20) {
    $('html').css('cursor', 'nesw-resize');
  }
  else if (e.clientY > (area_top + c_top) - 20 && e.clientY < (area_top + c_top) + 20 &&
  e.clientX >= (area_left + c_left) + 20 && e.clientX <= ((area_left + c_left) + area_w) - 20 ||
  e.clientY > ((area_top + c_top) + area_h) - 20 && e.clientY < ((area_top + c_top) + area_h) + 20 &&
  e.clientX >= (area_left + c_left) + 20 && e.clientX <= ((area_left + c_left) + area_w) - 20) {
    $('html').css('cursor', 'ns-resize');
  }
  else if (e.clientY >= (area_top + c_top) + 20 && e.clientY <= ((area_top + c_top) + area_h) - 20 &&
  e.clientX > (area_left + c_left) - 20 && e.clientX < (area_left + c_left) + 20 ||
  e.clientY >= (area_top + c_top) + 20 && e.clientY <= ((area_top + c_top) + area_h) - 20 &&
  e.clientX > ((area_left + c_left) + area_w) - 20 && e.clientX < ((area_left + c_left) + area_w) + 20) {
    $('html').css('cursor', 'ew-resize');
  }
  else {
    $('html').css('cursor', 'default');
  }
}
function end_trim(e) {
  make_menu_second.removeEventListener('mousemove', resize_area_trim);
  document.removeEventListener('mouseup', end_trim);
  make_menu_second.removeEventListener('touchmove', resize_area_trim);
  document.removeEventListener('touchend', end_trim);
  document.removeEventListener('mousemove', handleTouchMove, { passive: false });
  document.removeEventListener('touchmove', handleTouchMove, { passive: false });
}
function resize_area_trim(e) {
  if (obj.use === 'mouse') {
    obj.bef_x = e.clientX;
    obj.bef_y = e.clientY;
  }
  if (obj.use === 'touch') {
    obj.bef_x = e.touches[0].clientX;
    obj.bef_y = e.touches[0].clientY;
  }
  const cp = document.getElementById('check_photo');
  const cptx = cp.getContext("2d");
  let x_range = obj.bef_x - obj.start_x;
  let y_range = obj.bef_y - obj.start_y;
  let c_top = $('#check_photo').offset().top;
  let c_left = $('#check_photo').offset().left;
  let c_w = $('#check_photo').width();
  let c_h = $('#check_photo').height();
  let c_scale = c_w / cp.width;
  if (obj.area_top === '') {
    obj.area_top = 0;
  }
  if (obj.area_left === '') {
    obj.area_left = 0;
  }
  if (obj.area_w === '') {
    obj.area_w = c_w / c_scale;
  }
  if (obj.area_h === '') {
    obj.area_h = c_h / c_scale;
  }
  let area_top = Math.round(obj.area_top * c_scale);
  let area_left = Math.round(obj.area_left * c_scale);
  let area_w = Math.round(obj.area_w * c_scale);
  let area_h = Math.round(obj.area_h * c_scale);
  if (obj.bef_y > (area_top + c_top) - 20 && obj.bef_y < (area_top + c_top) + 20 &&
  obj.bef_x > (area_left + c_left) - 20 && obj.bef_x < (area_left + c_left) + 20) {
    if (area_top + y_range < 0) {
      return true;
    }
    if (area_h - y_range <= 40) {
      return true;
    }
    if (area_left + x_range < 0) {
      return true;
    }
    if (area_w - x_range <= 40) {
      return true;
    }
    obj.area_w = obj.area_w - x_range / c_scale;
    obj.area_left = obj.area_left + x_range / c_scale;
    obj.area_h = obj.area_h - y_range / c_scale;
    obj.area_top = obj.area_top + y_range / c_scale;
  }
  else if (obj.bef_y > ((area_top + c_top) + area_h) - 20 && obj.bef_y < ((area_top + c_top) + area_h) + 20 &&
  obj.bef_x > ((area_left + c_left) + area_w) - 20 && obj.bef_x < ((area_left + c_left) + area_w) + 20) {
    if (area_left + area_w + x_range > c_w) {
      return true;
    }
    if (area_w + x_range <= 40) {
      return true;
    }
    if (area_top + area_h + y_range > c_h) {
      return true;
    }
    if (area_h + y_range <= 40) {
      return true;
    }
    obj.area_h = obj.area_h + y_range / c_scale;
    obj.area_w = obj.area_w + x_range / c_scale;
  }
  else if (obj.bef_y > ((area_top + c_top) + area_h) - 20 && obj.bef_y < ((area_top + c_top) + area_h) + 20 &&
  obj.bef_x > (area_left + c_left) - 20 && obj.bef_x < (area_left + c_left) + 20) {
    if (area_top + area_h + y_range > c_h) {
      return true;
    }
    if (area_h + y_range <= 40) {
      return true;
    }
    if (area_left + x_range < 0) {
      return true;
    }
    if (area_w - x_range <= 40) {
      return true;
    }
    obj.area_w = obj.area_w - x_range / c_scale;
    obj.area_left = obj.area_left + x_range / c_scale;
    obj.area_h = obj.area_h + y_range / c_scale;
  }
  else if (obj.bef_y > (area_top + c_top) - 20 && obj.bef_y < (area_top + c_top) + 20 &&
  obj.bef_x > ((area_left + c_left) + area_w) - 20 && obj.bef_x < ((area_left + c_left) + area_w) + 20) {
    if (area_left + area_w + x_range > c_w) {
      return true;
    }
    if (area_w + x_range <= 40) {
      return true;
    }
    if (area_top + y_range < 0) {
      return true;
    }
    if (area_h - y_range <= 40) {
      return true;
    }
    obj.area_h = obj.area_h - y_range / c_scale;
    obj.area_top = obj.area_top + y_range / c_scale;
    obj.area_w = obj.area_w + x_range / c_scale;
  }
  else if (obj.bef_y > (area_top + c_top) - 20 && obj.bef_y < (area_top + c_top) + 20 &&
  obj.bef_x >= (area_left + c_left) + 20 && obj.bef_x <= ((area_left + c_left) + area_w) - 20) {
    if (area_top + y_range < 0) {
      return true;
    }
    if (area_h - y_range <= 40) {
      return true;
    }
    obj.area_h = obj.area_h - y_range / c_scale;
    obj.area_top = obj.area_top + y_range / c_scale;
  }
  else if (obj.bef_y > ((area_top + c_top) + area_h) - 20 && obj.bef_y < ((area_top + c_top) + area_h) + 20 &&
  obj.bef_x >= (area_left + c_left) + 20 && obj.bef_x <= ((area_left + c_left) + area_w) - 20) {
    if (area_top + area_h + y_range > c_h) {
      return true;
    }
    if (area_h + y_range <= 40) {
      return true;
    }
    obj.area_h = obj.area_h + y_range / c_scale;
  }
  else if (obj.bef_y >= (area_top + c_top) + 20 && obj.bef_y <= ((area_top + c_top) + area_h) - 20 &&
  obj.bef_x > (area_left + c_left) - 20 && obj.bef_x < (area_left + c_left) + 20) {
    if (area_left + x_range < 0) {
      return true;
    }
    if (area_w - x_range <= 40) {
      return true;
    }
    obj.area_w = obj.area_w - x_range / c_scale;
    obj.area_left = obj.area_left + x_range / c_scale;
  }
  else if (obj.bef_y >= (area_top + c_top) + 20 && obj.bef_y <= ((area_top + c_top) + area_h) - 20 &&
  obj.bef_x > ((area_left + c_left) + area_w) - 20 && obj.bef_x < ((area_left + c_left) + area_w) + 20) {
    if (area_left + area_w + x_range > c_w) {
      return true;
    }
    if (area_w + x_range <= 40) {
      return true;
    }
    obj.area_w = obj.area_w + x_range / c_scale;
  }
  obj.start_x = obj.bef_x;
  obj.start_y = obj.bef_y;
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  c.width = cp.width;
  c.height = cp.height;
  ctx.putImageData(obj.dl_c, 0, 0);
  let put_img = ctx.getImageData(0, 0, c.width, c.height);
  cptx.putImageData(put_img, 0, 0);
  cptx.globalAlpha = 0.5;
  cptx.fillStyle = 'black';
  cptx.fillRect(0, 0, cp.width, cp.height);
  cptx.globalAlpha = 1;
  put_img = ctx.getImageData(obj.area_left, obj.area_top, obj.area_w, obj.area_h);
  cptx.putImageData(put_img, obj.area_left, obj.area_top);
  cptx.strokeStyle = 'white';
  cptx.lineWidth = 2;
  cptx.strokeRect(obj.area_left, obj.area_top, obj.area_w, obj.area_h);
}
function make_trim_photo(e) {
  let layer_count = $('#art_size').val();
  const cp = document.getElementById('check_photo');
  const cptx = cp.getContext("2d");
  const cs = document.getElementById('change_to_pixel_sample');
  const cstx = cs.getContext("2d");
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  cs.width = cp.width;
  cs.height = cp.height;
  c.width = cp.width;
  c.height = cp.height;
  cstx.fillStyle = "rgb(255, 255, 255)";
  cstx.fillRect(0, 0, cs.width, cs.height);
  ctx.putImageData(obj.dl_c, 0, 0);
  let w_block_size = obj.area_w / layer_count;
  let h_block_size = obj.area_h / layer_count;
  let one_block_size = cs.width / layer_count;
  for (let h = 0; h < layer_count; h++) {
    for (let w = 0; w < layer_count; w++) {
      let h_half = (h * h_block_size) + (h_block_size / 2);
      let w_half = (w * w_block_size) + (w_block_size / 2);
      let pixel = ctx.getImageData(Math.round(obj.area_left + w_half), Math.round(obj.area_top + h_half), 1, 1);
      let data = pixel.data;
      const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
      if (rgb === 'rgb(255, 255, 255)') {
        continue;
      }
      cstx.fillStyle = rgb;
      cstx.fillRect(w * one_block_size, h * one_block_size, one_block_size, one_block_size);
    }
  }
  $('#make_menu_2').prop('checked', true);
  $('#for_sample_view .make_menu').scrollTop(0);
}
$('#check_photo_button').click((e) => {
  if(obj.area_top === '' || obj.area_left === '' || obj.area_w === '' || obj.area_h === '' || obj.dl_c === '') {
    return false;
  }
  $('#wait').removeClass('hidden');
  setTimeout((e) => {
    make_trim_photo();
    $('#wait').addClass('hidden');
  }, 1)
});
make_menu_second.addEventListener('mousemove', cursor_change_action);
make_menu_second.addEventListener('mousedown', function (e) {
  if (obj.dl_c === '') {
    return false;
  }
  obj.use = 'mouse';
  obj.start_x = e.clientX;
  obj.start_y = e.clientY;
  document.addEventListener('mousemove', handleTouchMove, { passive: false });
  make_menu_second.addEventListener('mousemove', resize_area_trim);
  document.addEventListener('mouseup', end_trim);
});
make_menu_second.addEventListener('touchstart', function (e) {
  if (obj.dl_c === '') {
    return false;
  }
  obj.use = 'touch';
  obj.start_x = e.touches[0].clientX;
  obj.start_y = e.touches[0].clientY;
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  make_menu_second.addEventListener('touchmove', resize_area_trim);
  document.addEventListener('touchend', end_trim);
});
$('#art_size_in_make_plan').change((e) => {
  change_max_size_limit (e);
  $('#art_size').val($('#art_size_in_make_plan').val());
});
//third make menu action
function build_new_board_at_sample (layer_count) {
  let col = "";
  let colHead = '<tr><th class="FirstBlank"></th>';
  for (let i = 0; i < layer_count; i++) {
    colHead = colHead + '<th class="headCol"></th>';
    col = col + '<td class="x' + i + '"></td>';
  }
  colHead += '</tr>';
  let table = "";
  for (let j = 0; j < layer_count; j++) {
    table = table + '<tr class="y' + j + '"><th class="headRow"></th>' + col + "</tr>";
  }
  $("#art_canvas thead").html(colHead);
  $("#art_canvas tbody").html(table);
  //make select_layers options
  let vertical_layer_html = '';
  let horizontal_layer_html = '';
  for (let k = 0; k < layer_count; k++) {
    let reverse_c = layer_count - k - 1;
    if (k == Math.floor(layer_count / 2) - 1) {
      vertical_layer_html += '<option value="' + reverse_c + '" autofocus selected class="selected">' + reverse_c + '</option>';
      horizontal_layer_html += '<option value="' + k + '" autofocus selected class="selected">' + k + '</option>';
    }
    else {
      vertical_layer_html += '<option value="' + reverse_c + '">' + reverse_c + '</option>';
      horizontal_layer_html += '<option value="' + k + '">' + k + '</option>';
    }
  }
  $('#select_vertical_layers').html(vertical_layer_html);
  $('#select_side_layers').html(horizontal_layer_html);
  $('#select_horizon_layers').html(horizontal_layer_html);
  //create 3d arry
  let arry = [];
  for (let z = 0; z < layer_count; z++) {
    for (let y = 0; y < layer_count; y++) {
      if (!arry[z]) {
        arry[z] = [];
      }
      for (let x = 0; x < layer_count; x++) {
        if (!arry[z][y]) {
          arry[z][y] = [];
        }
        arry[z][y][x] = '';
      }
    }
  }
  obj.once_memory = arry;
}
function rough_data_into_comp (e) {
  let image = obj.dl_img;
  let nL = obj.dl_name.length;
  if (nL <= 20) {
    nL = 20;
  }
  nL = 20 / nL + "em";
  $(".input_forms .load_title span").css("font-size", nL);
  $(".input_forms .load_title span").text(obj.dl_name);
  const palette = return_arry_of_checked_color_and_obj_src_alt (e);
  const cs = document.getElementById('change_to_pixel_sample');
  const cstx = cs.getContext("2d");
  let layer_count = $('#art_size').val();
  build_new_board_at_sample (layer_count);
  //into arry from sample_view
  let ratio_r = $('#sample_ratio_r').val();
  let ratio_g = $('#sample_ratio_g').val();
  let ratio_b = $('#sample_ratio_b').val();
  let calcDelta = function ( t, p) {
    return ( Math.pow((p.r - t.r) * ratio_r, 2) + Math.pow((p.g - t.g) * ratio_g, 2) + Math.pow((p.b - t.b) * ratio_b, 2));
  };
  let one_block_size = cs.width / layer_count;
  for (let h = 0; h < layer_count; h++) {
    for (let w = 0; w < layer_count; w++) {
      let h_half = (h * one_block_size) + (one_block_size / 2);
      let w_half = (w * one_block_size) + (one_block_size / 2);
      let pixel = cstx.getImageData(Math.round(w_half), Math.round(h_half), 1, 1);
      let data = pixel.data;
      const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
      if (rgb === 'rgb(255, 255, 255)') {
        continue;
      }
      let index = palette.color.indexOf(rgb);
      if (index < 0) {
        rgb = chooseColor(calcDelta, palette, rgb);
      }
      draw_3d_check_and_make_once_memory (w, h, rgb);
    }
  }
  add_canvas_to_roll_back_obj (obj.once_memory);
  //create memory into 3d check veiw
  arry_into_check_view ();
  //create memory into arts
  change_select_layer ();
}
$('#change_to_pixel_button').click((e) => {
  $('#wait').removeClass('hidden');
  $('#for_sample_view').css('display', 'none');
  $('#drag-and-drop-area').css('display', 'none');
  setTimeout((e) => {
    rough_data_into_comp ();
    $('#wait').addClass('hidden');
  }, 1)
});
$('#for_sample_view .for_sample_view_form .close_button').click((e) => {
  $.each(obj, function(index, value) {
    obj[index] = '';
  });
});
//change sample_view action
const previewAndInsert = (files) => {
  let file = files[0];
  if (file === undefined) {
    $('#wait').addClass('hidden');
    return false;
  }
  obj.dl_name = file.name;
  obj.dl_name = obj.dl_name.split(".").slice(0, 1);
  let reader = new FileReader();
  let image = new Image();
  image.crossOrigin = "anonymous";
  reader.onload = function (evt) {
    image.onload = function () {
      obj.dl_img = image;
      //do same group
      $('#for_sample_view .sub_selected_color_box label').each(function (index) {
        let color_box_id = $(this).attr('for');
        $(this).removeClass('box_selected');
        if ($('#' + color_box_id).prop('checked')) {
          $(this).addClass('box_selected');
        }
      });
      for_sample_view_action();
      $('#file-select-input').val('');
    };
    image.src = evt.target.result;
  };
  reader.readAsDataURL(file);
}
document.querySelector('#file-select-button').addEventListener('click', (ele) => {
  document.getElementById('file-select-input').click();
});
document.getElementById('file-select-input').addEventListener('change', (event) => {
  $('#wait').removeClass('hidden');
  const files = event.target.files;
  if (files.length > 0) {
    previewAndInsert(files);
  }
  event.target.files = null;
  event.target.value = null;
});
//drag and drop
const dragAndDropArea = document.getElementById('drag-and-drop-area');
dragAndDropArea.addEventListener('dragover', (event) => {
  dragAndDropArea.classList.add('active');
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
});
dragAndDropArea.addEventListener('dragleave', (event) => {
  dragAndDropArea.classList.remove('active');
});
dragAndDropArea.addEventListener('drop', (event) => {
  $('#wait').removeClass('hidden');
  event.preventDefault();
  dragAndDropArea.classList.remove('active');
  const files = event.dataTransfer.files;
  if (files.length === 0) {
    return false;
  }
  if (!files[0].type.match(/image\/*/)) {
    return false;
  }
  previewAndInsert(files);
});
//button action
$('#for_sample_view .make_menu .slideshow_icon .back_plan').click((e) => {
  let plan_menu_length = $('input[name="make_menu"]').length;
  let now_id = $('input[name="make_menu"]:checked').attr('id');
  now_id = now_id.toString();
  now_id = now_id.replace('make_menu_','');
  now_id = Number(now_id);
  if (now_id == 0) {
    now_id = plan_menu_length - 1;
  }
  else {
    now_id--;
  }
  $('#make_menu_' + now_id).prop('checked', true);
  $('#for_sample_view .make_menu').scrollTop(0);
});
$('#for_sample_view .make_menu .slideshow_icon .forward_plan').click((e) => {
  let plan_menu_length = $('input[name="make_menu"]').length;
  let now_id = $('input[name="make_menu"]:checked').attr('id');
  now_id = now_id.toString();
  now_id = now_id.replace('make_menu_','');
  now_id = Number(now_id);
  if (now_id == plan_menu_length - 1) {
    now_id = 0;
  }
  else {
    now_id++;
  }
  $('#make_menu_' + now_id).prop('checked', true);
  $('#for_sample_view .make_menu').scrollTop(0);
});
$('input[name="make_menu"]').change((e) => {
  $('#for_sample_view .make_menu').scrollTop(0);
});
//close_button
$('.close_button').click((e) => {
  let close_target_id = $('.close_button:hover').attr('data-close-id');
  $('#' + close_target_id).css('display', 'none');
});
/*map art editing*/
const ac = document.getElementById('art_canvas');
let array_match_cell = [];
let count = 0;
function all_removeEventListener (e) {
  document.removeEventListener('mousemove', handleTouchMove, { passive: false });
  document.removeEventListener("touchmove", handleTouchMove, { passive: false });
  document.removeEventListener("touchstart", handleTouchMove, { passive: false });
  ac.removeEventListener('mousemove', choose_fun);
  ac.removeEventListener("touchmove", choose_fun);
  document.removeEventListener('mouseup', rect_FirstUp);
  document.removeEventListener('touchend', rect_FirstUp);
  document.removeEventListener('mouseup', rect_SecondUp);
  document.removeEventListener('touchend', rect_SecondUp);
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
function td_xy_bgColor_in_obj (clientX,clientY) {
  let td_x,tr_y,td_bgColor;
  let elem = document.elementFromPoint(clientX, clientY);
  //https://pisuke-code.com/javascript-element-from-point/
  //https://www.javadrive.jp/javascript/dom/index28.html
  //https://www.codeflow.site/ja/article/jquery__jquery-how-to-get-the-tag-name
  if (elem === null) {
    return true;
  }
  let $element = jQuery(elem);
  if ($element.get(0).tagName !== "TD" && $element.parent().get(0).tagName !== "TD") {
    return false;
  }
  if ($element.get(0).tagName === "TD") {
    td_x = $element.attr('class');
    tr_y = $element.parent().attr('class');
    td_bgColor = $element.css('background-color');
  }
  if ($element.parent().get(0).tagName === "TD") {
    td_x = $element.parent().attr('class');
    tr_y = $element.parent().parent().attr('class');
    td_bgColor = $element.css('background-color');
  }
  td_x = td_x.substring(1);
  tr_y = tr_y.substring(1);
  obj.td_x = Number(td_x);
  obj.tr_y = Number(tr_y);
  obj.td_bgColor = td_bgColor;
}
function color_dropper_icon(e) {
  all_removeEventListener (e);
  obj.once_memory = '';
  td_xy_bgColor_in_obj (obj.start_x, obj.start_y);
  let catch_color = obj.td_bgColor;
  const palette = [];
  const palette_id = [];
  $('#CP .CPimg').parent().each(function (index) {
    let id = $(this).attr('id');
    let disL = $('#' + id + ' .CPimg').find("img").length;
    if (disL <= 0) {
      return true;
    }
    if (disL > 1) {
      for (let j = 1; j <= disL; j++) {
        let imgColor = $('#' + id + ' .CPimg').children("img.dis" + j).css("backgroundColor").toString();
        palette.push(imgColor);
        let pId = id + "/dis" + j;
        palette_id.push(pId);
      }
    }
    if (disL == 1) {
      let imgColor = $('#' + id + ' .CPimg').children("img").css("backgroundColor").toString();
      palette.push(imgColor);
      palette_id.push(id);
    }
  });
  let key = palette.indexOf(catch_color);
  if (key < 0) {
    return false;
  }
  if (key >= 0) {
    let id = palette_id[key];
    id = id.split("/");
    if (id.length >= 2) {
      $("#" + id[0] + " .CPimg").find("img").removeClass("mImg");
      $("#" + id[0] + " .CPimg").find("img." + id[1]).addClass("mImg");
      setTimeout((e) => {
        get_picked_colorBox_from_id(id[0]);
      }, 1)
    }
    else {
      get_picked_colorBox_from_id(id);
    }
  }
}
function cancel_jump_layer_point(e) {
  document.getElementById('jump_to_this_layer').removeEventListener('change', cancel_jump_layer_point);
  document.querySelectorAll('.layer_selector select').forEach((item, i) => {
    item.removeEventListener('change', cancel_jump_layer_point);
  });
  $('#art_canvas td.selected').removeClass('selected');
  obj.focus_layer = '';
  $('#jump_layer_explanation').remove();
}
function jump_to_this_layer(e) {
  all_removeEventListener (e);
  obj.once_memory = '';
  $('#jump_layer_explanation').remove();
  td_xy_bgColor_in_obj (obj.start_x, obj.start_y);
  if ($('#vertical_layer').prop('checked')) {
    let str = '<p id="jump_layer_explanation">';
    str += '<i class="fa-solid fa-layer-group" style="transform: rotateZ(90deg);"></i>&nbsp;' + obj.td_x + '&nbsp;';
    str += '<i class="fa-solid fa-layer-group"></i>&nbsp;' + obj.tr_y + '&nbsp;';
    str += '</p>';
    $('body').append(str);
    $('#art_canvas tbody tr.y' + obj.tr_y + ' td').addClass('selected');
    $('#art_canvas tbody tr td.x' + obj.td_x).addClass('selected');
    obj.focus_layer = {layer: 'vertical', x: obj.td_x, y: obj.tr_y};
  }
  if ($('#side_layer').prop('checked')) {
    let str = '<p id="jump_layer_explanation">';
    str += '<i class="fa-solid fa-layer-group" style="transform: rotateZ(-90deg);"></i>&nbsp;' + obj.td_x + '&nbsp;';
    str += '<i class="fa-solid fa-layer-group"></i>&nbsp;' + obj.tr_y + '&nbsp;';
    str += '</p>';
    $('body').append(str);
    $('#art_canvas tbody tr.y' + obj.tr_y + ' td').addClass('selected');
    $('#art_canvas tbody tr td.x' + obj.td_x).addClass('selected');
    obj.focus_layer = {layer: 'side', x: obj.td_x, y: obj.tr_y};
  }
  if ($('#horizontal_layer').prop('checked')) {
    let str = '<p id="jump_layer_explanation">';
    str += '<i class="fa-solid fa-layer-group" style="transform: rotateZ(-90deg);"></i>&nbsp;' + obj.tr_y + '&nbsp;';
    str += '<i class="fa-solid fa-layer-group" style="transform: rotateZ(90deg);"></i>&nbsp;' + obj.td_x + '&nbsp;';
    str += '</p>';
    $('body').append(str);
    $('#art_canvas tbody tr.y' + obj.tr_y + ' td').addClass('selected');
    $('#art_canvas tbody tr td.x' + obj.td_x).addClass('selected');
    obj.focus_layer = {layer: 'horizontal', x: obj.td_x, y: obj.tr_y};
  }
  let left = obj.start_x;
  left = left + 10;
  let top = obj.start_y;
  $('#jump_layer_explanation').css('top', top);
  $('#jump_layer_explanation').css('left', left);
  arry_into_check_view (e);
  document.getElementById('jump_to_this_layer').addEventListener('change', cancel_jump_layer_point);
  document.querySelectorAll('.layer_selector select').forEach((item, i) => {
    item.addEventListener('change', cancel_jump_layer_point);
  });
}
function draw_3d_check_and_make_once_memory (x, y, color) {
  let layer_c = obj.once_memory.length;
  if (x < 0 || y < 0 || x >= layer_c || y >= layer_c) {
    return true;
  }
  if ($('#vertical_layer').prop('checked')) {
    let layer_z = $('#select_vertical_layers').val();
    obj.once_memory[layer_z][y][x] = color;
  }
  if ($('#side_layer').prop('checked')) {
    let layer_x = $('#select_side_layers').val();
    obj.once_memory[x][y][layer_x] = color;
  }
  if ($('#horizontal_layer').prop('checked')) {
    let layer_y = $('#select_horizon_layers').val();
    obj.once_memory[y][layer_y][x] = color;
  }
}
function display_check_view_button(e) {
  if (obj.once_memory.length != roll_back_obj.check_view.length) {
    $('#check_view_button').css('display', 'block');
    return false;
  }
  if ($('#vertical_layer').prop('checked')) {
    let layer_z = $('#select_vertical_layers').val();
    obj.once_memory[layer_z].forEach((layer_y, y) => {
      layer_y.forEach((layer_x, x) => {
        let layer_c = obj.once_memory.length;
        if (x < 0 || y < 0 || x >= layer_c || y >= layer_c) {
          return true;
        }
        layer_c = roll_back_obj.check_view.length;
        if (x < 0 || y < 0 || x >= layer_c || y >= layer_c) {
          return true;
        }
        if (obj.once_memory[layer_z][y][x] !== roll_back_obj.check_view[layer_z][y][x]) {
          $('#check_view_button').css('display', 'block');
          obj.once_memory = '';
          return false;
        }
      });
    });
  }
  if ($('#side_layer').prop('checked')) {
    let layer_x = $('#select_side_layers').val();
    obj.once_memory.forEach((layer_z, z) => {
      layer_z.forEach((layer_y, y) => {
        let layer_c = obj.once_memory.length;
        if (z < 0 || y < 0 || z >= layer_c || y >= layer_c) {
          return true;
        }
        layer_c = roll_back_obj.check_view.length;
        if (z < 0 || y < 0 || z >= layer_c || y >= layer_c) {
          return true;
        }
        if (obj.once_memory[z][y][layer_x] !== roll_back_obj.check_view[z][y][layer_x]) {
          $('#check_view_button').css('display', 'block');
          obj.once_memory = '';
          return false;
        }
      });
    });
  }
  if ($('#horizontal_layer').prop('checked')) {
    let layer_y = $('#select_horizon_layers').val();
    obj.once_memory.forEach((layer_z, z) => {
      layer_z[layer_y].forEach((layer_x, x) => {
        let layer_c = obj.once_memory.length;
        if (x < 0 || z < 0 || x >= layer_c || z >= layer_c) {
          return true;
        }
        layer_c = roll_back_obj.check_view.length;
        if (x < 0 || z < 0 || x >= layer_c || z >= layer_c) {
          return true;
        }
        if (obj.once_memory[z][layer_y][x] !== roll_back_obj.check_view[z][layer_y][x]) {
          $('#check_view_button').css('display', 'block');
          obj.once_memory = '';
          return false;
        }
      });
    });
  }
}
function end_fun (e) {
  all_removeEventListener ();
  let color = $('.palette .palette_button .selected_block_img').find('img.mImg').css('background-color');
  if (obj.want_if === 'stroke_path_with_line') {
    td_xy_bgColor_in_obj (obj.bef_x, obj.bef_y);
    let next_x = obj.td_x;
    let next_y = obj.tr_y;
    let range_x = next_x - obj.start_td_x;
    let range_y = next_y - obj.start_tr_y;
    if (isNaN(range_x) || isNaN(range_y) || range_x == 0) {
      draw_3d_check_and_make_once_memory (obj.start_td_x, obj.start_tr_y, color);
      return true;
    }
    let radius = Math.sqrt(Math.pow(range_y,2) + Math.pow(range_x,2));
    let radians = Math.atan((range_y) / Math.abs(range_x));
    if (range_x < 0) {
      radians = Math.PI - radians;
    }
    for (let i = 0; i <= radius; i++) {
      let x = Math.floor(obj.start_td_x + i * Math.cos(radians));
      let y = Math.floor(obj.start_tr_y + i * Math.sin(radians));
      draw_3d_check_and_make_once_memory (x, y, color);
    }
  }
  if (obj.want_if === 'stroke_path_with_rect') {
    td_xy_bgColor_in_obj (obj.bef_x, obj.bef_y);
    let next_x = obj.td_x;
    let next_y = obj.tr_y;
    let left_x, top_y;
    if (obj.start_td_x <= next_x) {
      left_x = obj.start_td_x;
    } else {
      left_x = next_x;
    }
    if (obj.start_tr_y <= next_y) {
      top_y = obj.start_tr_y;
    } else {
      top_y = next_y;
    }
    let range_x = Math.abs(next_x - obj.start_td_x);
    let range_y = Math.abs(next_y - obj.start_tr_y);
    if (isNaN(range_x) || isNaN(range_y)) {
      draw_3d_check_and_make_once_memory (obj.start_td_x, obj.start_tr_y, color);
      return true;
    }
    for (let i = 0; i <= range_x; i++) {
      let x = left_x + i;
      let y = top_y;
      draw_3d_check_and_make_once_memory (x, y, color);
      y += range_y;
      draw_3d_check_and_make_once_memory (x, y, color);
    }
    for (let j = 0; j <= range_y; j++) {
      let x = left_x;
      let y = top_y + j;
      draw_3d_check_and_make_once_memory (x, y, color);
      x += range_x;
      draw_3d_check_and_make_once_memory (x, y, color);
    }
  }
  if (obj.want_if === 'stroke_path_with_arc') {
    td_xy_bgColor_in_obj (obj.bef_x, obj.bef_y);
    let next_x = obj.td_x;
    let next_y = obj.tr_y;
    let range_x = next_x - obj.start_td_x;
    let range_y = next_y - obj.start_tr_y;
    if (isNaN(range_x) || isNaN(range_y)) {
      draw_3d_check_and_make_once_memory (obj.start_td_x, obj.start_tr_y, color);
      return true;
    }
    let radius = Math.sqrt(Math.pow(range_y,2) + Math.pow(range_x,2));
    let circumference = 2 * Math.PI * radius;
    for (let i = 0; i <= circumference; i++) {
      let x =  Math.round(obj.start_td_x + Math.cos(i / radius) * radius);
      let y =  Math.round(obj.start_tr_y + Math.sin(i / radius) * radius);
      draw_3d_check_and_make_once_memory (x, y, color);
    }
  }
  if (obj.copy_img !== '') {
    obj.once_memory = '';
    return false;
  }
  $('.layer_selector select option.copy_target').removeClass('copy_target');
  add_canvas_to_roll_back_obj (obj.once_memory);
  document.removeEventListener('mouseup', end_fun);
  document.removeEventListener("touchend", end_fun);
  display_check_view_button(e);
};
function point_draw_action (e) {
  let x,y;
  if (obj.use === 'mouse_at_art') {
    x = e.clientX;
    y = e.clientY;
  }
  if (obj.use === 'touch_at_art') {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  }
  td_xy_bgColor_in_obj (x, y);
  let color = '';
  if (obj.want_if === 'pen_tool') {
    let img = $('.palette .palette_button .selected_block_img').find('img.mImg');
    if (img.length) {
      img = jQuery("<div>").append(img.clone(true)).html();
    }
    if (!img.length) {
      return false;
    }
    color = $('.palette .palette_button .selected_block_img').find('img.mImg').css('background-color');
    $('#art_canvas tr.y' + obj.tr_y + ' td.x' + obj.td_x).html(img);
  }
  if (obj.want_if === 'eraser_points_tool') {
    $('#art_canvas tr.y' + obj.tr_y + ' td.x' + obj.td_x).children().remove();
  }
  draw_3d_check_and_make_once_memory (obj.td_x, obj.tr_y, color);
}
function same_area_search (x, y, change_to_fun, search_fun) {
  count++
  if (count >= 2500) {
    return false;
  }
  let base_color = obj.td_bgColor;
  let number = 1;
  let array_xy_obj = [
    {x: x, y: y - number},
    {x: x - number, y: y},
    {x: x, y: y + number},
    {x: x + number, y: y},
  ];
  change_to_fun (x, y);
  let xy_obj = {x: x, y: y};
  let key = array_match_cell.indexOf(xy_obj);
  while (key.length > 0) {
    array_match_cell.splice(key, 1);
    key = array_match_cell.indexOf(xy_obj);
  }
  let next = 0;
  for (let i = 0; i < array_xy_obj.length; i++) {
    let target_color = search_fun(array_xy_obj[i].x, array_xy_obj[i].y);
    if (next > 2) {
      break;
    }
    if (target_color === undefined || target_color === '') {
      continue;
    }
    if (target_color === base_color) {
      let obj = array_xy_obj[i];
      if (array_match_cell.indexOf(obj) < 0) {
        array_match_cell.push(array_xy_obj[i]);
        next++;
      }
      continue;
    }
    if (target_color !== base_color) {
      continue;
    }
  }
  if (array_match_cell.length) {
    let next_xy_obj = array_match_cell.pop();
    same_area_search (next_xy_obj.x, next_xy_obj.y, change_to_fun, search_fun);
  }
  if (!array_match_cell.length) {
    return false;
  }
}
function area_action_fun (canvas_id,color,img,action_type) {
  let change_to_fun, search_fun;
  if (action_type === 'fill') {
    change_to_fun = function (pre_x, pre_y) {
      $('#' + canvas_id + ' tr.y' + pre_y + ' td.x' + pre_x).html(img);
      draw_3d_check_and_make_once_memory (pre_x, pre_y, color);
    };
    search_fun = function (pre_x, pre_y) {
      let target_color;
      let $target = $('#' + canvas_id + ' tr.y' + pre_y + ' td.x' + pre_x);
      if (!$target.length) {
        target_color = 'edge';
      }
      if ($target.length && $target.children('img.mImg').length <= 0) {
        target_color = $target.css('background-color');
      }
      if ($target.children('img.mImg').length > 0) {
        target_color = $target.children('img.mImg').css("background-color");
      }
      return target_color;
    };
    count = 0;
    same_area_search (obj.td_x, obj.tr_y, change_to_fun, search_fun);
  }
  if (action_type === 'cut') {
    change_to_fun = function (pre_x, pre_y) {
      $('#' + canvas_id + ' tr.y' + pre_y + ' td.x' + pre_x).children().remove();
      let color = '';
      draw_3d_check_and_make_once_memory (pre_x, pre_y, color);
    };
    search_fun = function (pre_x, pre_y) {
      let target_color;
      let $target = $('#' + canvas_id + ' tr.y' + pre_y + ' td.x' + pre_x);
      if (!$target.length) {
        target_color = 'edge';
      }
      if ($target.length && $target.children('img.mImg').length <= 0) {
        target_color = $target.css('background-color');
      }
      if ($target.children('img.mImg').length > 0) {
        target_color = $target.children('img.mImg').css("background-color");
      }
      return target_color;
    };
    count = 0;
    same_area_search (obj.td_x, obj.tr_y, change_to_fun, search_fun);
  }
}
function fill_tool_of_paint_roller(e) {
  all_removeEventListener (e);
  let canvas_id, color, img, action_type;
  canvas_id = 'art_canvas';
  img = $('.palette .palette_button .selected_block_img').find('img.mImg');
  if (img.length) {
    color = img.css('background-color');
    img = jQuery("<div>").append(img.clone(true)).html();
  }
  if (!img.length) {
    return false;
  }
  td_xy_bgColor_in_obj (obj.start_x, obj.start_y);
  action_type = 'fill';
  area_action_fun (canvas_id, color, img, action_type);
  $('html').css('cursor', 'default');
}
function area_cut_tool_of_scissors(e) {
  all_removeEventListener (e);
  let canvas_id,color,img,action_type;
  canvas_id = 'art_canvas';
  td_xy_bgColor_in_obj (obj.start_x, obj.start_y);
  action_type = 'cut';
  area_action_fun (canvas_id, color, img, action_type);
  $('html').css('cursor', 'default');
}
function input_arry_into_art_canvas_td (e) {
  let arry = obj.start_img;
  $('#art_canvas td.selected').removeClass('selected');
  $('#art_canvas td').each(function(index) {
    let tr_y = $(this).parent().attr('class');
    let td_x = $(this).attr('class');
    tr_y = tr_y.substring(1);
    td_x = td_x.substring(1);
    tr_y = Number(tr_y);
    td_x = Number(td_x);
    let img = arry[tr_y][td_x];
    let target_img = $(this).html();
    if (img === target_img) {
      return true;
    }
    $(this).html(img);
  });
}
function stroke_path_with_line(e) {
  let img = $('.palette .palette_button .selected_block_img').find('img.mImg');
  if (img.length) {
    img = jQuery("<div>").append(img.clone(true)).html();
  }
  if (!img.length) {
    return false;
  }
  if (obj.use === 'mouse_at_art') {
    obj.bef_x = e.clientX;
    obj.bef_y = e.clientY;
  }
  if (obj.use === 'touch_at_art') {
    obj.bef_x = e.touches[0].clientX;
    obj.bef_y = e.touches[0].clientY;
  }
  td_xy_bgColor_in_obj (obj.bef_x, obj.bef_y);
  let next_x = obj.td_x;
  let next_y = obj.tr_y;
  let range_x = next_x - obj.start_td_x;
  let range_y = next_y - obj.start_tr_y;
  input_arry_into_art_canvas_td (e);
  if (isNaN(range_x) || isNaN(range_y) || range_x == 0) {
    $('#art_canvas tr.y' + obj.start_tr_y + ' td.x' + obj.start_td_x).html(img);
    return true;
  }
  let radius = Math.sqrt(Math.pow(range_y,2) + Math.pow(range_x,2));
  let radians = Math.atan((range_y) / Math.abs(range_x));
  if (range_x < 0) {
    radians = Math.PI - radians;
  }
  for (let i = 0; i <= radius; i++) {
    let x = Math.floor(obj.start_td_x + i * Math.cos(radians));
    let y = Math.floor(obj.start_tr_y + i * Math.sin(radians));
    $('#art_canvas tr.y' + y + ' td.x' + x).html(img);
  }
}
function stroke_path_with_rect(e) {
  let img = $('.palette .palette_button .selected_block_img').find('img.mImg');
  if (img.length) {
    img = jQuery("<div>").append(img.clone(true)).html();
  }
  if (!img.length) {
    return false;
  }
  if (obj.use === 'mouse_at_art') {
    obj.bef_x = e.clientX;
    obj.bef_y = e.clientY;
  }
  if (obj.use === 'touch_at_art') {
    obj.bef_x = e.touches[0].clientX;
    obj.bef_y = e.touches[0].clientY;
  }
  td_xy_bgColor_in_obj (obj.bef_x, obj.bef_y);
  let next_x = obj.td_x;
  let next_y = obj.tr_y;
  let left_x, top_y;
  if (obj.start_td_x <= next_x) {
    left_x = obj.start_td_x;
  } else {
    left_x = next_x;
  }
  if (obj.start_tr_y <= next_y) {
    top_y = obj.start_tr_y;
  } else {
    top_y = next_y;
  }
  let range_x = Math.abs(next_x - obj.start_td_x);
  let range_y = Math.abs(next_y - obj.start_tr_y);
  input_arry_into_art_canvas_td (e);
  if (isNaN(range_x) || isNaN(range_y)) {
    $('#art_canvas tr.y' + obj.start_tr_y + ' td.x' + obj.start_td_x).html(img);
    return true;
  }
  for (let i = 0; i <= range_x; i++) {
    let x = left_x + i;
    let y = top_y;
    $('#art_canvas tr.y' + y + ' td.x' + x).html(img);
    y += range_y;
    $('#art_canvas tr.y' + y + ' td.x' + x).html(img);
  }
  for (let j = 0; j <= range_y; j++) {
    let x = left_x;
    let y = top_y + j;
    $('#art_canvas tr.y' + y + ' td.x' + x).html(img);
    x += range_x;
    $('#art_canvas tr.y' + y + ' td.x' + x).html(img);
  }
}
function stroke_path_with_arc(e) {
  let img = $('.palette .palette_button .selected_block_img').find('img.mImg');
  if (img.length) {
    img = jQuery("<div>").append(img.clone(true)).html();
  }
  if (!img.length) {
    return false;
  }
  if (obj.use === 'mouse_at_art') {
    obj.bef_x = e.clientX;
    obj.bef_y = e.clientY;
  }
  if (obj.use === 'touch_at_art') {
    obj.bef_x = e.touches[0].clientX;
    obj.bef_y = e.touches[0].clientY;
  }
  td_xy_bgColor_in_obj (obj.bef_x, obj.bef_y);
  let next_x = obj.td_x;
  let next_y = obj.tr_y;
  let range_x = next_x - obj.start_td_x;
  let range_y = next_y - obj.start_tr_y;
  input_arry_into_art_canvas_td (e);
  if (isNaN(range_x) || isNaN(range_y)) {
    $('#art_canvas tr.y' + obj.start_tr_y + ' td.x' + obj.start_td_x).html(img);
    return true;
  }
  let radius = Math.sqrt(Math.pow(range_y,2) + Math.pow(range_x,2));
  let circumference = 2 * Math.PI * radius;
  for (let i = 0; i <= circumference; i++) {
    let x =  Math.round(obj.start_td_x + Math.cos(i / radius) * radius);
    let y =  Math.round(obj.start_tr_y + Math.sin(i / radius) * radius);
    $('#art_canvas tr.y' + y + ' td.x' + x).html(img);
  }
}
function return_first_copyed_obj (e) {
  let x, y, w, h, put_img, xc, yc, piBase, piMove, radius;
  if (obj.want_if === 'copy_area_with_rect') {
    td_xy_bgColor_in_obj (obj.bef_x, obj.bef_y);
    put_img = obj.copy_img;
    w = put_img[0].length;
    h = put_img.length;
    x = obj.td_x - w;
    y = obj.tr_y - h;
  }
  if (obj.want_if === 'resize_area_with_rect') {
    td_xy_bgColor_in_obj (obj.bef_x, obj.bef_y);
    let next_x = obj.td_x;
    let next_y = obj.tr_y;
    put_img = obj.copy_img;
    x = obj.start_td_x - (put_img[0].length - 1);
    y = obj.start_tr_y - (put_img.length - 1);
    let range_x = next_x - obj.start_td_x;
    let range_y = next_y - obj.start_tr_y;
    if (isNaN(range_x) || isNaN(range_y)) {
      return true;
    }
    w = put_img[0].length + range_x;
    h = put_img.length + range_y;
  }
  if (obj.want_if === 'roll_area_with_rect') {
    td_xy_bgColor_in_obj (obj.bef_x, obj.bef_y);
    let next_x = obj.td_x;
    let next_y = obj.tr_y;
    put_img = obj.copy_img;
    w = put_img[0].length;
    h = put_img.length;
    xc = obj.start_td_x - w / 2;
    yc = obj.start_tr_y - h / 2;
    piBase = Math.atan(h / w);
    let range_x = next_x - xc;
    let range_y = next_y - yc;
    piMove = Math.atan(range_y / Math.abs(range_x));
    if (range_x < 0) {
      piMove = Math.PI - piMove;
    }
  }
  return {x: x, y: y, w: w, h: h, put_img: put_img, xc: xc, yc: yc, piMove: piMove, piBase: piBase};
}
/*https://gray-code.com/javascript/remove-empty-element-for-array/*/
function rect_FirstUp(e) {
  all_removeEventListener ();
  let arry = [];
  let i = -1;
  let j = 0;
  let bef_tr_y = -1;
  $('#art_canvas td.selected').each(function(index) {
    let tr_y = $(this).parent().attr('class');
    tr_y = tr_y.substring(1);
    tr_y = Number(tr_y);
    if (bef_tr_y != tr_y) {
      i++
      j = 0;
      arry[i] = [];
    }
    bef_tr_y = tr_y;
    let img = $(this).find('img.mImg');
    if (!img.length) {
      arry[i][j] = '';
      j++;
      return true;
    }
    if (img.length) {
      img = jQuery("<div>").append(img.clone(true)).html();
      arry[i][j] = img;
      j++;
      return true;
    }
  });
  obj.copy_img = arry;
  end_fun (e);
  return false;
}
function rect_SecondUp(e) {
  all_removeEventListener ();
  $('#art_canvas td.selected').removeClass('selected');
  let copyed_obj = return_first_copyed_obj (e);
  if (obj.want_if === 'copy_area_with_rect') {
    for (let j = 0; j < copyed_obj.h; j++) {
      for (let i = 0; i < copyed_obj.w; i++) {
        let x, y;
        if ($('#for_copy_normal_position').prop('checked')) {
          x =  copyed_obj.x + i;
          y =  copyed_obj.y + j;
        }
        if ($('#for_horizontal_flip').prop('checked')) {
          x =  obj.td_x - i;
          y =  copyed_obj.y + j;
        }
        if ($('#for_vertical_flip').prop('checked')) {
          x =  copyed_obj.x + i;
          y =  obj.tr_y - j;
        }
        let img = copyed_obj.put_img[j][i];
        let color = '';
        if (img !== '') {
          color = jQuery("<div>").html(img).children().css('backgroundColor');
        }
        draw_3d_check_and_make_once_memory (x, y, color);
      }
    }
  }
  if (obj.want_if === 'resize_area_with_rect') {
    let h_ratio = copyed_obj.put_img.length / Math.abs(copyed_obj.h);
    let w_ratio = copyed_obj.put_img[0].length / Math.abs(copyed_obj.w);
    if (isNaN(h_ratio) || isNaN(w_ratio)) {
      h_ratio = 1;
      w_ratio = 1;
    }
    for (let j = 0; j < Math.abs(copyed_obj.h); j++) {
      for (let i = 0; i < Math.abs(copyed_obj.w); i++) {
        let obj_h = Math.round(j * h_ratio);
        let obj_w = Math.round(i * w_ratio);
        if (isNaN(obj_h) || isNaN(obj_w) || obj_h > copyed_obj.put_img.length - 1 || obj_w > copyed_obj.put_img[0].length - 1) {
          continue;
        }
        let x, y;
        if (copyed_obj.w >= 0 && copyed_obj.h >= 0) {
          x =  copyed_obj.x + i;
          y =  copyed_obj.y + j;
        }
        if (copyed_obj.w < 0 && copyed_obj.h >= 0) {
          x =  copyed_obj.x - i;
          y =  copyed_obj.y + j;
        }
        if (copyed_obj.w >= 0 && copyed_obj.h < 0) {
          x =  copyed_obj.x + i;
          y =  copyed_obj.y - j;
        }
        if (copyed_obj.w < 0 && copyed_obj.h < 0) {
          x =  copyed_obj.x - i;
          y =  copyed_obj.y - j;
        }
        let img = copyed_obj.put_img[obj_h][obj_w];
        let color = '';
        if (img !== '') {
          color = jQuery("<div>").html(img).children().css('backgroundColor');
        }
        draw_3d_check_and_make_once_memory (x, y, color);
      }
    }
  }
  if (obj.want_if === 'roll_area_with_rect') {
    for (let h = 0; h < copyed_obj.h; h++) {
      for (let w = 0; w < copyed_obj.w; w++) {
        let move_point_x = (copyed_obj.w / 2) - (w + 0.5);
        let move_point_y = (copyed_obj.h / 2) - (h + 0.5);
        let radians = Math.atan(move_point_y / Math.abs(move_point_x));
        if (move_point_x < 0) {
          radians = Math.PI - radians;
        }
        let radius = Math.sqrt(Math.pow(move_point_y,2) + Math.pow(move_point_x,2));
        radians += copyed_obj.piMove - copyed_obj.piBase;
        let x =  Math.floor(copyed_obj.xc - radius * Math.cos(radians));
        let y =  Math.floor(copyed_obj.yc - radius * Math.sin(radians));
        if (isNaN(x) || isNaN(y)) {
          continue;
        }
        let img = copyed_obj.put_img[h][w];
        let color = '';
        if (img !== '') {
          color = jQuery("<div>").html(img).children().css('backgroundColor');
        }
        draw_3d_check_and_make_once_memory (x, y, color);
      }
    }
  }
  obj.copy_img = "";
  end_fun (e);
  return false;
}
function copy_area_with_rect(e) {
  if (obj.use === 'mouse_at_art') {
    obj.bef_x = e.clientX;
    obj.bef_y = e.clientY;
  }
  if (obj.use === 'touch_at_art') {
    obj.bef_x = e.touches[0].clientX;
    obj.bef_y = e.touches[0].clientY;
  }
  input_arry_into_art_canvas_td (e);
  if (obj.copy_img === '') {
    td_xy_bgColor_in_obj (obj.bef_x, obj.bef_y);
    let next_x = obj.td_x;
    let next_y = obj.tr_y;
    let left_x, top_y;
    if (obj.start_td_x <= next_x) {
      left_x = obj.start_td_x;
    } else {
      left_x = next_x;
    }
    if (obj.start_tr_y <= next_y) {
      top_y = obj.start_tr_y;
    } else {
      top_y = next_y;
    }
    let range_x = Math.abs(next_x - obj.start_td_x);
    let range_y = Math.abs(next_y - obj.start_tr_y);
    for (let h = 0; h <= range_y; h++) {
      for (let w = 0; w <= range_x; w++) {
        let x = left_x + w;
        let y = top_y + h;
        $('#art_canvas tr.y' + y + ' td.x' + x).addClass('selected');
      }
    }
    document.addEventListener('mouseup', rect_FirstUp);
    document.addEventListener('touchend', rect_FirstUp);
    return false;
  }
  if (obj.copy_img !== '') {
    let copyed_obj = return_first_copyed_obj (e);
    if (obj.want_if === 'copy_area_with_rect') {
      for (let j = 0; j < copyed_obj.h; j++) {
        for (let i = 0; i < copyed_obj.w; i++) {
          let x, y;
          if ($('#for_copy_normal_position').prop('checked')) {
            x =  copyed_obj.x + i;
            y =  copyed_obj.y + j;
          }
          if ($('#for_horizontal_flip').prop('checked')) {
            x =  obj.td_x - i;
            y =  copyed_obj.y + j;
          }
          if ($('#for_vertical_flip').prop('checked')) {
            x =  copyed_obj.x + i;
            y =  obj.tr_y - j;
          }
          let img = copyed_obj.put_img[j][i];
          $('#art_canvas tr.y' + y + ' td.x' + x).html(img);
          $('#art_canvas tr.y' + y + ' td.x' + x).addClass('selected');
        }
      }
    }
    if (obj.want_if === 'resize_area_with_rect') {
      let h_ratio = copyed_obj.put_img.length / Math.abs(copyed_obj.h);
      let w_ratio = copyed_obj.put_img[0].length / Math.abs(copyed_obj.w);
      if (isNaN(h_ratio) || isNaN(w_ratio)) {
        h_ratio = 1;
        w_ratio = 1;
      }
      for (let j = 0; j < Math.abs(copyed_obj.h); j++) {
        for (let i = 0; i < Math.abs(copyed_obj.w); i++) {
          let obj_h = Math.round(j * h_ratio);
          let obj_w = Math.round(i * w_ratio);
          if (isNaN(obj_h) || isNaN(obj_w) || obj_h > copyed_obj.put_img.length - 1 || obj_w > copyed_obj.put_img[0].length - 1) {
            continue;
          }
          let x, y;
          if (copyed_obj.w >= 0 && copyed_obj.h >= 0) {
            x =  copyed_obj.x + i;
            y =  copyed_obj.y + j;
          }
          if (copyed_obj.w < 0 && copyed_obj.h >= 0) {
            x =  copyed_obj.x - i;
            y =  copyed_obj.y + j;
          }
          if (copyed_obj.w >= 0 && copyed_obj.h < 0) {
            x =  copyed_obj.x + i;
            y =  copyed_obj.y - j;
          }
          if (copyed_obj.w < 0 && copyed_obj.h < 0) {
            x =  copyed_obj.x - i;
            y =  copyed_obj.y - j;
          }
          let img = copyed_obj.put_img[obj_h][obj_w];
          $('#art_canvas tr.y' + y + ' td.x' + x).html(img);
          $('#art_canvas tr.y' + y + ' td.x' + x).addClass('selected');
        }
      }
    }
    if (obj.want_if === 'roll_area_with_rect') {
      for (let h = 0; h < copyed_obj.h; h++) {
        for (let w = 0; w < copyed_obj.w; w++) {
          let move_point_x = (copyed_obj.w / 2) - (w + 0.5);
          let move_point_y = (copyed_obj.h / 2) - (h + 0.5);
          let radians = Math.atan(move_point_y / Math.abs(move_point_x));
          if (move_point_x < 0) {
            radians = Math.PI - radians;
          }
          let radius = Math.sqrt(Math.pow(move_point_y,2) + Math.pow(move_point_x,2));
          radians += copyed_obj.piMove - copyed_obj.piBase;
          let x =  Math.floor(copyed_obj.xc - radius * Math.cos(radians));
          let y =  Math.floor(copyed_obj.yc - radius * Math.sin(radians));
          if (isNaN(x) || isNaN(y)) {
            continue;
          }
          let img = copyed_obj.put_img[h][w];
          $('#art_canvas tr.y' + y + ' td.x' + x).html(img);
          $('#art_canvas tr.y' + y + ' td.x' + x).addClass('selected');
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
    want_if = 'true';
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
/*https://javascript.programmer-reference.com/js-getboundingclientrect/*/
function scroll_canvas_at_edge (e) {
  let element = document.querySelector('#editing_areas');
  let c_h = element.clientHeight;
  let c_t = element.getBoundingClientRect().top;
  let c_w = element.clientWidth;
  let c_l = element.getBoundingClientRect().left;
  let move_x, move_y;
  if (obj.use === 'mouse_at_art') {
    move_x = e.clientX;
    move_y = e.clientY;
  }
  if (obj.use === 'touch_at_art') {
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
    point_draw_action(e);
  }
  else {
    if (obj.want_if === 'stroke_path_with_line') {
      stroke_path_with_line(e);
    }
    if (obj.want_if === 'stroke_path_with_rect') {
      stroke_path_with_rect(e);
    }
    if (obj.want_if === 'stroke_path_with_arc') {
      stroke_path_with_arc(e);
    }
    if (obj.want_if === 'copy_area_with_rect' || obj.want_if === 'resize_area_with_rect' || obj.want_if === 'roll_area_with_rect') {
      document.removeEventListener('mouseup', end_fun);
      document.removeEventListener("touchend", end_fun);
      copy_area_with_rect(e);
    }
  }
}
function return_arry_of_art_canvas_td (e) {
  let arry = [];
  $('#art_canvas td').each(function(index) {
    let tr_y = $(this).parent().attr('class');
    let td_x = $(this).attr('class');
    tr_y = tr_y.substring(1);
    td_x = td_x.substring(1);
    tr_y = Number(tr_y);
    td_x = Number(td_x);
    if (!arry[tr_y]) {
      arry[tr_y] = [];
    }
    let img = $(this).find('img.mImg');
    if (!img.length) {
      arry[tr_y][td_x] = '';
      return true;
    }
    if (img.length) {
      arry[tr_y][td_x] = jQuery("<div>").append(img.clone(true)).html();
      return true;
    }
  });
  return arry;
}
function roll_back_to_correct_arry (e) {
  if (!obj.once_memory.length) {
    roll_back_obj.c_art++;
    if (roll_back_obj.art.length - 1 - roll_back_obj.c_art < 0) {
      roll_back_obj.c_art = 0;
      //make pixel table
      if (!$('#art_size').val()) {
        $('#art_size').val(30);
      }
      let layer_count = $('#art_size').val();
      let col = "";
      let colHead = '<th class="FirstBlank"></th>';
      for (let i = 0; i < layer_count; i++) {
        colHead = colHead + '<th class="headCol"></th>';
        col = col + '<td class="x' + i + '"></td>';
      }
      let table = "";
      for (let j = 0; j < layer_count; j++) {
        table = table + '<tr class="y' + j + '"><th class="headRow"></th>' + col + "</tr>";
      }
      $("#art_canvas thead").append('<tr></tr>');
      $("#art_canvas thead tr").html(colHead);
      $("#art_canvas tbody").html(table);
      //make select_layers options
      let vertical_layer_html = '';
      let horizontal_layer_html = '';
      for (let k = 0; k < layer_count; k++) {
        let reverse_c = layer_count - k - 1;
        if (k == Math.floor(layer_count / 2) - 1) {
          vertical_layer_html += '<option value="' + reverse_c + '" autofocus selected class="selected">' + reverse_c + '</option>';
          horizontal_layer_html += '<option value="' + k + '" autofocus selected class="selected">' + k + '</option>';
        }
        else {
          vertical_layer_html += '<option value="' + reverse_c + '">' + reverse_c + '</option>';
          horizontal_layer_html += '<option value="' + k + '">' + k + '</option>';
        }
      }
      $('#select_vertical_layers').html(vertical_layer_html);
      $('#select_side_layers').html(horizontal_layer_html);
      $('#select_horizon_layers').html(horizontal_layer_html);
      //create 3d arry
      let arry = [];
      for (let z = 0; z < layer_count; z++) {
        for (let y = 0; y < layer_count; y++) {
          if (!arry[z]) {
            arry[z] = [];
          }
          for (let x = 0; x < layer_count; x++) {
            if (!arry[z][y]) {
              arry[z][y] = [];
            }
            arry[z][y][x] = '';
          }
        }
      }
      add_canvas_to_roll_back_obj (arry);
      return true;
    }
    obj.once_memory = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
    if (!obj.once_memory.length) {
      roll_back_to_correct_arry();
    }
  }
}
/*escape for touch test*/
ac.onmousedown = function (e) {
  obj.use = 'mouse_at_art';
  obj.want_if = return_want_if_at_tool ();
  if (obj.want_if === 'false') {
    all_removeEventListener (e);
    return false;
  }
  if (obj.want_if === 'true') {
    all_removeEventListener (e);
    return true;
  }
  obj.once_memory = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
  if (!obj.once_memory.length) {
    roll_back_to_correct_arry();
  }
  obj.once_memory = copyMatrix(obj.once_memory);
  obj.start_x = e.clientX;
  obj.start_y = e.clientY;
  obj.range = 20 * Number($('#art_scale').val()) / 100;
  $('#art_canvas td.selected').removeClass('selected');
  document.addEventListener('mousemove', handleTouchMove, { passive: false });
  if (obj.want_if === 'fill_tool_of_paint_roller') {
    $('html').css('cursor', 'wait');
    setTimeout(() => {
      fill_tool_of_paint_roller(e);
      end_fun();
    }, "1")
  }
  else if (obj.want_if === 'area_cut_tool_of_scissors') {
    $('html').css('cursor', 'wait');
    setTimeout(() => {
      area_cut_tool_of_scissors(e);
      end_fun();
    }, "1")
  }
  else if (obj.want_if === 'color_dropper_icon') {
    color_dropper_icon(e);
  }
  else if (obj.want_if === 'jump_to_this_layer') {
    jump_to_this_layer(e);
  }
  else {
    obj.start_img = return_arry_of_art_canvas_td (e);
    td_xy_bgColor_in_obj (obj.start_x, obj.start_y);
    obj.start_td_x = obj.td_x;
    obj.start_tr_y = obj.tr_y;
    ac.addEventListener('mousemove', choose_fun);
    document.addEventListener('mouseup', end_fun);
  }
};
ac.addEventListener("touchstart", function (e) {
  obj.use = 'touch_at_art';
  obj.want_if = return_want_if_at_tool ();
  if (obj.want_if === 'false') {
    all_removeEventListener (e);
    return false;
  }
  if (obj.want_if === 'true') {
    all_removeEventListener (e);
    return true;
  }
  obj.once_memory = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
  if (!obj.once_memory.length) {
    roll_back_to_correct_arry();
  }
  obj.once_memory = copyMatrix(obj.once_memory);
  obj.start_x = e.touches[0].clientX;
  obj.start_y = e.touches[0].clientY;
  obj.range = 20 * Number($('#art_scale').val()) / 100;
  $('#art_canvas td.selected').removeClass('selected');
  document.addEventListener("touchstart", handleTouchMove, { passive: false });
  document.addEventListener("touchmove", handleTouchMove, { passive: false });
  if (obj.want_if === 'fill_tool_of_paint_roller') {
    $('html').css('cursor', 'wait');
    setTimeout(() => {
      fill_tool_of_paint_roller(e);
      end_fun();
    }, "1")
  }
  else if (obj.want_if === 'area_cut_tool_of_scissors') {
    $('html').css('cursor', 'wait');
    setTimeout(() => {
      area_cut_tool_of_scissors(e);
      end_fun();
    }, "1")
  }
  else if (obj.want_if === 'color_dropper_icon') {
    color_dropper_icon(e);
  }
  else if (obj.want_if === 'jump_to_this_layer') {
    jump_to_this_layer(e);
  }
  else {
    obj.start_img = return_arry_of_art_canvas_td (e);
    td_xy_bgColor_in_obj (obj.start_x, obj.start_y);
    obj.start_td_x = obj.td_x;
    obj.start_tr_y = obj.tr_y;
    ac.addEventListener("touchmove", choose_fun);
    document.addEventListener("touchend", end_fun);
  }
});
//all removeEventListener at window remove
document.addEventListener('beforeunload', all_removeEventListener);
document.addEventListener('mouseleave', all_removeEventListener);
//roll_back
function roll_back (e) {
  if (roll_back_obj.art.length == 0) {
    return false;
  }
  if (roll_back_obj.c_art >= roll_back_obj.art.length - 1) {
    roll_back_obj.c_art = roll_back_obj.art.length - 1;
    return false;
  }
  roll_back_obj.c_art ++;
  let layer_count = $('.layer_selector select.appear option').length;
  let arry = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
  $('#check_view_button').css('display', 'block');
  if (arry.length == layer_count) {
    change_select_layer(e);
  }
  if (arry.length != layer_count) {
    change_layer_select_options(e);
  }
}
$('.roll_back_and_forward .roll_back').click((e) => {
  if (obj.copy_img !== '') {
    obj.copy_img = '';
    $('#art_canvas td.selected').removeClass('selected');
    return false;
  }
  $.each(obj, function(index, value) {
    obj[index] = '';
  });
  $('.layer_selector select option.copy_target').removeClass('copy_target');
  cancel_jump_layer_point(e);
  roll_back (e);
});
//roll_forward
function roll_forward (e) {
  if (roll_back_obj.art.length == 0) {
    return false;
  }
  if (roll_back_obj.c_art <= 0) {
    roll_back_obj.c_art = 0;
    return false;
  }
  roll_back_obj.c_art --;
  let layer_count = $('.layer_selector select.appear option').length;
  let arry = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
  $('#check_view_button').css('display', 'block');
  if (arry.length == layer_count) {
    change_select_layer (e);
  }
  if (arry.length != layer_count) {
    change_layer_select_options(e);
  }
}
$('.roll_back_and_forward .roll_forward').click((e) => {
  if (obj.copy_img !== '') {
    obj.copy_img = '';
    $('#art_canvas td.selected').removeClass('selected');
    return false;
  }
  $.each(obj, function(index, value) {
    obj[index] = '';
  });
  $('.layer_selector select option.copy_target').removeClass('copy_target');
  cancel_jump_layer_point(e);
  roll_forward (e);
});
//shortcuts for roll_back_and_forward
document.addEventListener('keydown', ctrl_keydown_event,false);
document.addEventListener('keydown', ctrl_shift_keydown_event,false);
function ctrl_keydown_event(e){
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyZ") {
    event.preventDefault();
    $('.roll_back_and_forward .roll_back').click();
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyC") {
    event.preventDefault();
    $('.layer_selector .layer_copy').click();
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyV") {
    event.preventDefault();
    $('.layer_selector .layer_paste').click();
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "NumpadAdd") {
    event.preventDefault();
    obj.td_x = '';
    obj.tr_y = '';
    let scope = 'plus';
    scope_action(scope);
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "NumpadSubtract") {
    event.preventDefault();
    obj.td_x = '';
    obj.tr_y = '';
    let scope = 'minus';
    scope_action(scope);
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyS") {
    if ($('#syncer-acdn-03 li[data-target="target_memorys"] p.target').length) {
      let id = $('#syncer-acdn-03 li[data-target="target_memorys"] p.target').parent().attr('id');
      let file_name = $('#' + id + ' span').text();
      if (file_name === $('.input_forms .load_title span').text()) {
        event.preventDefault();
        let key = id;
        let value = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
        value = copyMatrix(value);
        add_new_obj_to_memory_obj (key,value);
      }
    }
  }
}
function ctrl_shift_keydown_event(e){
  if(event.ctrlKey && event.shiftKey && event.code === "KeyZ") {
    event.preventDefault();
    $('.roll_back_and_forward .roll_forward').click();
  }
}
/*layer_copy & paste*/
function layer_copy(e) {
  if ($('#vertical_layer').prop('checked')) {
    let val = $('#select_vertical_layers').val();
    $('#select_vertical_layers option[value="' + val + '"]').addClass('copy_target');
  }
  if ($('#side_layer').prop('checked')) {
    let val = $('#select_side_layers').val();
    $('#select_side_layers option[value="' + val + '"]').addClass('copy_target');
  }
  if ($('#horizontal_layer').prop('checked')) {
    let val = $('#select_horizon_layers').val();
    $('#select_horizon_layers option[value="' + val + '"]').addClass('copy_target');
  }
}
$('.layer_selector .layer_copy').click((e) => {
  $('.layer_selector select option.copy_target').removeClass('copy_target');
  layer_copy();
});
function layer_paste(e) {
  let direction_id = $('.layer_selector select option.copy_target').parent().attr('id');
  let val = $('.layer_selector select option.copy_target').attr('value');
  val = Number(val);
  let copy_x, copy_y, copy_z;
  if (direction_id === 'select_side_layers') {
    copy_x = val;
  }
  if (direction_id === 'select_vertical_layers') {
    copy_z = val;
  }
  if (direction_id === 'select_horizon_layers') {
    copy_y = val;
  }
  if ($('#vertical_layer').prop('checked')) {
    let layer_z = $('#select_vertical_layers').val();
    obj.once_memory = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
    let copy_arry = copyMatrix(obj.once_memory);
    obj.once_memory = copyMatrix(obj.once_memory);
    obj.once_memory[layer_z].forEach((layer_y, y) => {
      layer_y.forEach((layer_x, x) => {
        if (direction_id === 'select_vertical_layers') {
          obj.once_memory[layer_z][y][x] = copy_arry[copy_z][y][x];
        }
        if (direction_id === 'select_side_layers') {
          obj.once_memory[layer_z][y][x] = copy_arry[x][y][copy_x];
        }
        if (direction_id === 'select_horizon_layers') {
          obj.once_memory[layer_z][y][x] = copy_arry[y][copy_y][x];
        }
      });
    });
  }
  if ($('#side_layer').prop('checked')) {
    let layer_x = $('#select_side_layers').val();
    obj.once_memory = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
    let copy_arry = copyMatrix(obj.once_memory);
    obj.once_memory = copyMatrix(obj.once_memory);
    obj.once_memory.forEach((layer_z, z) => {
      layer_z.forEach((layer_y, y) => {
        if (direction_id === 'select_vertical_layers') {
          obj.once_memory[z][y][layer_x] = copy_arry[copy_z][y][z];
        }
        if (direction_id === 'select_side_layers') {
          obj.once_memory[z][y][layer_x] = copy_arry[z][y][copy_x];
        }
        if (direction_id === 'select_horizon_layers') {
          obj.once_memory[z][y][layer_x] = copy_arry[y][copy_y][z];
        }
      });
    });
  }
  if ($('#horizontal_layer').prop('checked')) {
    let layer_y = $('#select_horizon_layers').val();
    obj.once_memory = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
    let copy_arry = copyMatrix(obj.once_memory);
    obj.once_memory = copyMatrix(obj.once_memory);
    obj.once_memory.forEach((layer_z, z) => {
      layer_z[layer_y].forEach((layer_x, x) => {
        if (direction_id === 'select_vertical_layers') {
          obj.once_memory[z][layer_y][x] = copy_arry[copy_z][z][x];
        }
        if (direction_id === 'select_side_layers') {
          obj.once_memory[z][layer_y][x] = copy_arry[x][z][copy_x];
        }
        if (direction_id === 'select_horizon_layers') {
          obj.once_memory[z][layer_y][x] = copy_arry[z][copy_y][x];
        }
      });
    });
  }
  add_canvas_to_roll_back_obj (obj.once_memory);
  obj.once_memory = '';
  $('#check_view_button').css('display', 'block');
  change_select_layer (e);
}
$('.layer_selector .layer_paste').click((e) => {
  if (!$('.layer_selector select option.copy_target').length) {
    return false;
  }
  layer_paste(e);
});
/*ZoomUpDown action*/
//add shortcut
function scope_action(scope) {
  let scale = $("#art_scale").val();
  scale = Number(scale);
  if (scope === 'plus') {
    scale = scale * 1.1;
  }
  if (scope === 'minus') {
    scale = scale * 0.9;
  }
  scale = Math.round(scale);
  $("#art_scale").val(scale);
  scale = scale / 100;
  $("#art_canvas").css("transform", "scale(" + scale + ")");
  if (obj.tr_y !== '' && obj.td_x !== '') {
    const element = document.querySelector('#art_canvas tbody tr.y' + obj.tr_y + ' td.x' + obj.td_x);
    element.scrollIntoView({behavior: "auto", block: "center", inline: "center"});
  }
}
ac.addEventListener("mousedown", function (e) {
  let clientX = e.clientX;
  let clientY = e.clientY;
  td_xy_bgColor_in_obj (clientX,clientY);
  if ($('#zoom_scope_button').prop('checked') && $('#plus_scope_icon').prop('checked')) {
    let scope = 'plus';
    scope_action(scope);
  }
  if ($('#zoom_scope_button').prop('checked') && $('#minus_scope_icon').prop('checked')) {
    let scope = 'minus';
    scope_action(scope);
  }
});
ac.addEventListener("touchstart", function (e) {
  let clientX = e.touches[0].clientX;
  let clientY = e.touches[0].clientY;
  td_xy_bgColor_in_obj (clientX,clientY);
  if ($('#zoom_scope_button').prop('checked') && $('#plus_scope_icon').prop('checked')) {
    let scope = 'plus';
    scope_action(scope, x, y);
  }
  if ($('#zoom_scope_button').prop('checked') && $('#minus_scope_icon').prop('checked')) {
    let scope = 'minus';
    scope_action(scope, x, y);
  }
});
$('#editing_areas').on('mousemove', (e) => {
  if (!$('#zoom_scope_button').prop('checked')) {
    $('#editing_areas').css('cursor', 'default');
  }
  if ($('#zoom_scope_button').prop('checked') && $('#plus_scope_icon').prop('checked')) {
    $('#editing_areas').css('cursor', 'zoom-in');
  }
  if ($('#zoom_scope_button').prop('checked') && $('#minus_scope_icon').prop('checked')) {
    $('#editing_areas').css('cursor', 'zoom-out');
  }
});
$('#art_scale').change((e) => {
  let scale = $("#art_scale").val();
  scale = Number(scale);
  scale = scale / 100;
  $("#art_canvas").css("transform", "scale(" + scale + ")");
  $('#zoom_scope_button').prop('checked', false);
});
/*++footer++*/
/*question_to_use*/
/*++language change++*/
/*https://developer.mozilla.org/ja/docs/Web/API/Element/scrollHeight*/
/*https://developer.mozilla.org/ja/docs/Web/API/setInterval*/
/*https://qiita.com/lp0ql/items/90a1ece534fa933bbdbb*/
function scroll_top_bottom_infinite(element) {
  if (element.scrollHeight <= element.clientHeight) {
      return false;
  }
  if(element.scrollTop != 0) {
    element.scrollTop += 0.1;
    if (Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) < 2) {
      setTimeout(function() {
        element.scrollTop = 0;
        setTimeout(() => {
          scroll_top_bottom_infinite (element);
        }, 2000);
      }, 2000);
    }
    else {
      setTimeout(() => {
        scroll_top_bottom_infinite (element);
      }, 30);
    }
  }
  else {
    setTimeout(() => {
      element.scrollTop += 0.1;
      scroll_top_bottom_infinite (element);
    }, 2000);
  }
}
function answer_to_questions_text (str) {
  if (str === '') {
    return false;
  }
  if (str === $('#answer_to_questions ~ .dummy_text').val()) {
    return false;
  }
  $('#answer_to_questions').html(str);
  $('#answer_to_questions ~ .dummy_text').val(str);
  let element = document.querySelector('#answer_to_questions');
  element.scrollTop = 0;
  scroll_top_bottom_infinite(element);
}
function question_obj(x,y) {
  let elem = document.elementFromPoint(x, y);
  if (elem === null) {
    return false;
  }
  let $elem = jQuery(elem);
  let click_id = $elem.attr('id');
  let click_class = $elem.attr('class');
  let click_onclick = $elem.attr('onclick');
  let click_for = $elem.attr('for');
  let click_parent_id = $elem.parent().attr('id');
  let str = '';
  if (click_id === 'check_view_button') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "キャンバスチェック用の縮小ラフ画像になります。"
      + "<br>操作軽量化のため変更があればボタンが再表示されます。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "This is a reduced rough image of the canvas for checking."
      + "<br>Check button which is not shown for reduce operational lag, will be displayed when canvas has changed contents.";
    }
  }
  if (click_id === 'art_size') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "3D表示の重さを考慮して64x64x64を最大にしてあります。"
      + "<br>空白の場合は30×30x30を返します。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Input maximum amount is 64x64x64, that's limit is for 3D display lag reduction."
      + "<br>If input has no value, it's returns 30 x 30 x 30.";
    }
  }
  if (click_id === 'display_plan_of_Blueprint') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "作成した3Dアートの設計図を返します。"
      + "<br>設計図は、必要ブロック数とx,y座標が分かるエクセルと確認用のラフ画像を、各階層毎にしてダウンロード出来ます。"
      + "<br>また、ロードに時間がかかりますがブロックスキンありの確認用画像もダウンロード出来ます。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Returns a blueprint of the 3D art you have created."
      + "<br>The blueprints are available for download in Excels that showing the number of blocks required and their x-y coordinates, and rough images these are each layer for confirmation."
      + "<br>Also, it may take a while to load, but if you want, you can download the image with the skin of the block.";
    }
  }
  if (click_class === 'change_to_pixel_art') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "フォルダ内の画像をキャンバスに反映します。"
      + "<br>このボタンをクリックしてキャンバスに画像をドラッグ、もしくはアップロードして下さい。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "It can be reflect the images in the folder on the canvas."
      + "<br>Click this button, then to drag or upload an image to the canvas.";
    }
  }
  if (click_parent_id === 'change_view_face') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "3Dラフ画像を回転させます。"
      + "<br>横に加えて縦ロールも可能になっています。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "This can rotate 3D rough image."
      + "<br>And, can be rotate to not only horizontal direction but also vertical direction.";
    }
  }
  if (click_class === 'palette_download') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "Web Storage機能をご利用出来ない環境の方は、ここからtextデータの保存をお願いいたします。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "If you are unable to use the Web Storage function, please download your text data here.";
    }
  }
  if (click_class === 'palette_upload') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "ダウンロードしたデータをアップロードしてパレットを復元します。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Upload the downloaded data to restore the palette.";
    }
  }
  if (click_id === 'CP') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "使用する色玉を選択します。"
      + "<br>ピクセル変換処理は折りたたみを開いているグループのみを参照します。"
      + "<br>また、グループ分けされた色玉は「色の名前付きブロック」以外は好きなグループにドラッグして移動出来ます。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Select the colored boxes to be used."
      + "<br>The pixel conversion process refers only to the group that has opened."
      + '<br>Also, grouped colored boxes can be moved by dragging them to any group you like, except for the group of "Color named blocks".';
    }
  }
  if (click_class === 'layer_copy') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "表示しているレイヤーをコピーします。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Copy the displayed layer.";
    }
  }
  if (click_class === 'layer_paste') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "コピーしたレイヤーをペーストします。"
      + "<br>コピー元は青色でラベルされます。"
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Paste the copied layer."
      + "<br>The copy source is labeled in blue.";
    }
  }
  if (click_for === 'jump_to_this_layer') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "選択したポイントの他ベクトルの値を返します。"
      + "<br>キャンバスに目印を付けた状態で表示ベクトルを変更すると自動で選択したレイヤーに飛びます。"
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Returns the value of the other vector for the selected point."
      + "<br>Changing the display vector with checked a marker on the canvas, it's automatically jumps to the selected layer.";
    }
  }
  if (click_class === 'close_tools') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "全てのツールを閉じます。"
      + "<br>作業の邪魔になる場合に使用して下さい。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Close all tools."
      + "<br>Use when it interferes with work.";
    }
  }
  if (click_class === 'auto_download_storage') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "オンにするとメモリとパレットのデータを、画面を閉じる前の状態に自動で戻します。"
      + "<br>Web Storage機能を使用しているためご利用出来ない環境の方はtextデータの保存をお願いいたします。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "When button was on, memory and palette data are stored before closing the page and automatically upload."
      + "<br>Please save the text data if you cannot use the Web Storage function.";
    }
  }
  if (click_id === 'download_memory') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "Web Storage機能をご利用出来ない環境の方は、ここからtextデータの保存をお願いいたします。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "If you are unable to use the Web Storage function, please download your text data here.";
    }
  }
  if (click_class === 'upload_memory') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "ダウンロードしたデータをアップロードしてメモリを復元します。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Upload the downloaded data to restore the memory.";
    }
  }
  if (click_onclick === 'otm_check(this)') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "チェックの付いたメモリをターゲットします。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Function refers to the checked memory.";
    }
  }
  if (click_onclick === 'otm_load(this)') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "クリックすると保存されたデータをキャンバスに反映します。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Click to reflect the saved data on the canvas.";
    }
  }
  if (click_onclick === 'otm_save(this)') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "キャンバスのデータを一時保存します。"
      + "ファイル名とメモリ名が一致していればチェックしたメモリをCtrl + Sのショトカで保存出来ます。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Save canvas data temporarily."
      + "If the file name and the memory name were matched, you can save the checked memory with Ctrl + S shortcut.";
    }
  }
  if (click_onclick === 'otm_delete(this)') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "保存したデータを削除します。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Delete saved data.";
    }
  }
  answer_to_questions_text (str);
}
function question_obj_touch(e) {
  if (!$('#question_to_use').prop('checked')) {
    return true;
  }
  let x = e.touches[0].clientX;
  let y = e.touches[0].clientY;
  question_obj(x,y);
}
function question_obj_mouse(e) {
  if (!$('#question_to_use').prop('checked')) {
    return true;
  }
  let x = e.clientX;
  let y = e.clientY;
  question_obj(x,y);
}
document.addEventListener('mousemove', question_obj_mouse);
document.addEventListener('touchstart', question_obj_touch);
/*++localStorage++*/
/*https://qiita.com/mocha_xx/items/e0897e9f251da042af59*/
/*https://www.sejuku.net/blog/28696*/
/*https://atmarkit.itmedia.co.jp/ait/articles/1108/12/news093_2.html*/
/*https://javascript.programmer-reference.com/js-onunload/*/
/*https://qiita.com/niihara_megumu/items/be693500d42088027547*/
if (typeof sessionStorage === undefined) {
  if ($('header .header_form p.language').text() === 'Japanese') {
    str = "このブラウザはWeb Storage機能が実装されていません";
  }
  if ($('header .header_form p.language').text() === '英語') {
    str = "This browser does not been implemented Web Storage function";
  }
  $('#auto_download_storage').prop('checked', false);
  window.alert(str);
} else {
  if ($('header .header_form p.language').text() === 'Japanese') {
    str = "このページはWeb Storage機能を使用しています";
  }
  if ($('header .header_form p.language').text() === '英語') {
    str = "This page uses the Web Storage function";
  }
  //window.alert(str);
  let storage = localStorage;
  function remove_localStorage (storage,key) {
    storage.removeItem(key);
  }
  function all_remove_localStorage(storage) {
    storage.clear();
  }
  function setItem_in_localStorage (storage,key,value_obj) {
    storage.setItem(key, JSON.stringify(value_obj));
    //Key=>cat/Value=>{"name":"ねこ","color":"white","age":5}
  }
  function return_obj_from_localStorage (storage,key) {
    let getData = JSON.parse(storage.getItem(key));
    return getData;
  }
  let value_obj = {};
  //ページを離れる直前
  window.onbeforeunload = function(){
    //make input data for localStorage
    //storage button on or off
    if (!$('#auto_download_storage').prop('checked')) {
      value_obj['storage'] = 'off';
      //in storage
      let key = '3d_art_storage';
      setItem_in_localStorage (storage,key,value_obj);
      return false;
    }
    if ($('#auto_download_storage').prop('checked')) {
      value_obj['storage'] = 'on';
      //top menu memory
      let get_memorys_html = '';
      $('#syncer-acdn-03 li[data-target="target_memorys"]').each(function(ele) {
        let html = jQuery("<div>").append($(this).clone(true)).html();
        get_memorys_html = get_memorys_html + html;
      });
      value_obj['top_menu'] = get_memorys_html;
      //memory data obj
      let get_memorys_data = {};
      let i = 0;
      /*here cannot into strage 3d arry*/
      $.each(memory_obj, function(index, obj) {
        get_memorys_data['memoryObj_id' + i] = index;
        let getStr = '';
        obj.forEach((layer_z, z) => {
          layer_z.forEach((layer_y, y) => {
            layer_y.forEach((layer_x, x) => {
              let color = obj[z][y][x];
              if (color === '') {
                getStr = getStr + "_layerX_";
                return true;
              }
              getStr = getStr + color;
              getStr = getStr + "_layerX_";
            });
            getStr = getStr + "_layerY_";
          });
          getStr = getStr + "_layerZ_";
        });
        get_memorys_data['memoryObj_data' + i] = getStr;
        i++;
      })
      value_obj['top_menu_data'] = get_memorys_data;
      //color boxes of palette board cp
      let get_cp_data = {};
      i = 0;
      let arry_cp_class = ['add_new_blocks', 'color_named_blocks', 'easy_to_gather', 'hard_in_overworld', 'in_nether', 'in_end'];
      arry_cp_class.forEach(function(value, index) {
        get_cp_data['cpObj_data' + i] = $('#CP .' + arry_cp_class[i]).html();
        i++;
      });
      value_obj['cp_html'] = get_cp_data;
      //input sample_view rgb
      value_obj['ratio_r'] = $('#sample_ratio_r').val();
      value_obj['ratio_g'] = $('#sample_ratio_g').val();
      value_obj['ratio_b'] = $('#sample_ratio_b').val();
      //in storage
      let key = '3d_art_storage';
      setItem_in_localStorage (storage,key,value_obj);
    }
  }
  $('body').ready(function() {
    //load Storage
    let key = '3d_art_storage';
    let getData = return_obj_from_localStorage (storage, key);
    if (getData === '' || getData === null) {
      return false;
    }
    //saved storage memory in js obj untile unloading
    value_obj = getData;
    //storage button on or off
    if (getData['storage'] === 'off') {
      $('#auto_download_storage').prop('checked', false);
      remove_localStorage (storage, key);
      return false;
    }
    if (getData['storage'] === 'on') {
      remove_localStorage (storage,key);
      //top menu memory
      $('#syncer-acdn-03 li[data-target="target_memorys"]').each(function(ele) {
        $(this).remove();
      });
      $('#syncer-acdn-03').append(getData['top_menu']);
      //memory_obj in js
      let get_obj = getData['top_menu_data'];
      memory_obj = {};
      let i = 0;
      $.each(get_obj, function(index, obj) {
        let key = get_obj['memoryObj_id' + i];
        let table = get_obj['memoryObj_data' + i];
        if (table === undefined) {
          return true;
        }
        table = table.split("_layerZ_");
        table.pop();
        table.forEach(function(value, index) {
          table[index] = table[index].split("_layerY_");
          table[index].pop();
        });
        table.forEach((layer_z, z) => {
          layer_z.forEach((layer_y, y) => {
            table[z][y] = table[z][y].split("_layerX_");
            table[z][y].pop();
          });
        });
        memory_obj[key] = table;
        i++;
      })
      //color boxes of palette board cp
      let get_cp_obj = getData['cp_html'];
      let arry_cp_class = ['add_new_blocks', 'color_named_blocks', 'easy_to_gather', 'hard_in_overworld', 'in_nether', 'in_end'];
      for (let j = 0; j < arry_cp_class.length; j++) {
        let html = get_cp_obj['cpObj_data' + j];
        if (html === undefined || html === '') {
          if (getData['cp_html'] !== undefined || getData['cp_html'] !== '') {
            $('#CP').html('');
            $('#CP').append(getData['cp_html']);
            break;
          }
          continue;
        }
        $('#CP .' + arry_cp_class[j]).html(html);
      }
      //input sample_view rgb
      $('#sample_ratio_r').val(getData['ratio_r']);
      $('#sample_ratio_g').val(getData['ratio_g']);
      $('#sample_ratio_b').val(getData['ratio_b']);
    }
  });
  //upload load storage from button
  $('header .header_form nav ul li.roll_back').click((e) => {
    let key = 'unload_time';
    let getData = return_obj_from_localStorage (storage,key);
    if (getData === '') {
      return false;
    }
    //top menu memory
    $('#syncer-acdn-03 li[data-target="target_memorys"]').each(function(ele) {
      $(this).remove();
    });
    $('#syncer-acdn-03').append(getData['top_menu']);
    //memory_obj in js
    let get_obj = getData['top_menu_data'];
    memory_obj = {};
    let i = 0;
    $.each(get_obj, function(index, obj) {
      let key = get_obj['memoryObj_id' + i];
      let canvas = get_obj['memoryObj_canvas' + i];
      let data = get_obj['memoryObj_data' + i];
      let value = {canvas: canvas, data: data};
      memory_obj[key] = value;
      i++;
    })
    //color boxes of palette board cp
    $('#CP').html('');
    $('#CP').append(getData['cp_html']);
  });
  $('header .header_2windows nav ul li.roll_back').click((e) => {
    let key = 'unload_time';
    let getData = return_obj_from_localStorage (storage,key);
    if (getData === '') {
      return false;
    }
    //top menu memory
    $('#syncer-acdn-03 li[data-target="target_memorys"]').each(function(ele) {
      $(this).remove();
    });
    $('#syncer-acdn-03').append(getData['top_menu']);
    //memory_obj in js
    let get_obj = getData['top_menu_data'];
    memory_obj = {};
    let i = 0;
    $.each(get_obj, function(index, obj) {
      let key = get_obj['memoryObj_id' + i];
      let canvas = get_obj['memoryObj_canvas' + i];
      let data = get_obj['memoryObj_data' + i];
      let value = {canvas: canvas, data: data};
      memory_obj[key] = value;
      i++;
    })
    //color boxes of palette board cp
    $('#CP').html('');
    $('#CP').append(getData['cp_html']);
  });
}
