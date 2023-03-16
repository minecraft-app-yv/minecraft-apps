/*++reserve objects++*/
let obj = { start_x: '', start_y: '', start_img: '', copy_img: '', td_x: '', tr_y: '', td_bgColor: '', target_id: '', bef_x: '', bef_y: '',
use: '', want_if: '', once_memory: '', range: '',
pop_text: '', parent_class: ''};
let memory_obj = {};
let roll_back_obj = {art: [], c_art: 0};
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
function return_img_html (palette_color_box_id) {
  let img = $("#" + palette_color_box_id + " .CPimg").find('img.mImg');
  let html = jQuery("<div>").append(img.clone(true)).html();
  return html;
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
}
function change_to_horizon_layers (e) {
  $('#no_set_action').click();
  $('#select_vertical_layers').removeClass('appear');
  $('#select_vertical_layers ~ label[for="select_vertical_layers"]').removeClass('appear');
  $('#select_horizon_layers').addClass('appear');
  $('#select_horizon_layers ~ label[for="select_horizon_layers"]').addClass('appear');
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
/*https://www.htmq.com/canvas/transform.shtml*/
function layers_into_check_view (e) {
  let layer_count = $('#art_size').val();
  let sin_10deg = Math.sin(10 * Math.PI / 180);
  let cos_10deg = Math.cos(10 * Math.PI / 180);
  const cv = document.getElementById('check_view');
  const cvtx = cv.getContext('2d');
  if ($('#cube_front.front').length && $('#cube_top.top').length) {
    for (let i = 0; i < layer_count; i++) {
      let x = i;
      let y = layer_count - 1 - i;
      let z = i;
      let cube_arr = [['back_z'+ z], ['bottom_y'+ y], ['right_x'+ x], ['left_x'+ x], ['top_y'+ y], ['front_z'+ z]];
      for (let j = 0; j < cube_arr.length; j++) {
        let c = document.createElement("canvas");
        let ctx = c.getContext("2d");
        c.width = cv.width;
        c.height = cv.height;
        ctx.fillStyle = 'orange';
        ctx.transform(1, 0, -sin_10deg, sin_10deg, 0, 0);
        ctx.fillRect(0,0,50,50);
        let put_img = new Image();
        put_img.onload = function (e) {
          cvtx.drawImage(put_img, 0, 75);
        };
        put_img.src = c.toDataURL();
      }
    }
  }
  if ($('#cube_front.front').length && $('#cube_right.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-10deg) rotateY(-10deg) rotateZ(90deg)');
  }
  if ($('#cube_front.front').length && $('#cube_left.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-10deg) rotateY(-10deg) rotateZ(-90deg)');
  }
  if ($('#cube_front.front').length && $('#cube_bottom.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-10deg) rotateY(-10deg) rotateZ(180deg)');
  }
  if ($('#cube_top.front').length && $('#cube_back.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-100deg) rotateZ(-10deg) rotateY(0deg)');
  }
  if ($('#cube_top.front').length && $('#cube_left.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-100deg) rotateZ(-10deg) rotateY(90deg)');
  }
  if ($('#cube_top.front').length && $('#cube_right.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-100deg) rotateZ(-10deg) rotateY(-90deg)');
  }
  if ($('#cube_top.front').length && $('#cube_front.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-100deg) rotateZ(-10deg) rotateY(180deg)');
  }
  if ($('#cube_bottom.front').length && $('#cube_front.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(80deg) rotateZ(10deg) rotateY(0deg)');
  }
  if ($('#cube_bottom.front').length && $('#cube_right.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(80deg) rotateZ(10deg) rotateY(90deg)');
  }
  if ($('#cube_bottom.front').length && $('#cube_left.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(80deg) rotateZ(10deg) rotateY(-90deg)');
  }
  if ($('#cube_bottom.front').length && $('#cube_back.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(80deg) rotateZ(10deg) rotateY(180deg)');
  }
  if ($('#cube_back.front').length && $('#cube_top.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-10deg) rotateY(170deg) rotateZ(0deg)');
  }
  if ($('#cube_back.front').length && $('#cube_right.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-10deg) rotateY(170deg) rotateZ(90deg)');
  }
  if ($('#cube_back.front').length && $('#cube_left.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-10deg) rotateY(170deg) rotateZ(-90deg)');
  }
  if ($('#cube_back.front').length && $('#cube_bottom.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-10deg) rotateY(170deg) rotateZ(180deg)');
  }
  if ($('#cube_left.front').length && $('#cube_top.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-10deg) rotateY(-100deg) rotateZ(0deg)');
  }
  if ($('#cube_left.front').length && $('#cube_back.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-100deg) rotateY(0deg) rotateZ(-100deg)');
  }
  if ($('#cube_left.front').length && $('#cube_front.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(80deg) rotateY(0deg) rotateZ(100deg)');
  }
  if ($('#cube_left.front').length && $('#cube_bottom.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(170deg) rotateY(100deg) rotateZ(0deg)');
  }
  if ($('#cube_right.front').length && $('#cube_top.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-10deg) rotateY(80deg) rotateZ(0deg)');
  }
  if ($('#cube_right.front').length && $('#cube_back.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-100deg) rotateY(0deg) rotateZ(80deg)');
  }
  if ($('#cube_right.front').length && $('#cube_front.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(80deg) rotateY(0deg) rotateZ(-80deg)');
  }
  if ($('#cube_right.front').length && $('#cube_bottom.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(170deg) rotateY(-80deg) rotateZ(0deg)');
  }
}
function draw_3d_view(x,y,z,color) {
  if ($('#art_size').val() === '') {
    $('#art_size').val(30);
  }
  let one_block_size = 150 / $('#art_size').val();
  let cube_arr = [['front_z'+ z, x, y], ['back_z'+ z, x, y], ['top_y'+ y, x, z], ['bottom_y'+ y, x, z], ['right_x'+ x, z, y], ['left_x'+ x, z, y]];
  for (let i = 0; i < cube_arr.length; i++) {
    let vctx = document.getElementById(cube_arr[i][0]).getContext('2d');
    if (color === '') {
      vctx.clearRect(cube_arr[i][1] * one_block_size, cube_arr[i][2] * one_block_size, one_block_size, one_block_size);
    }
    else {
      vctx.fillStyle = color;
      vctx.fillRect(cube_arr[i][1] * one_block_size, cube_arr[i][2] * one_block_size, one_block_size, one_block_size);
    }
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
    let colHead = '<th class="FirstBlank"></th>';
    let table = '';
    arry[z].forEach((row, y) => {
      colHead = colHead + '<th class="headCol"></th>';
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
      table = table + '<tr class="y' + y + '"><th class="headRow"></th>' + col_html + "</tr>";
    });
    $("#art_canvas thead tr").html(colHead);
    $("#art_canvas tbody").html(table);
  }
  if ($('#horizontal_layer').prop('checked')) {
    let y = $('#select_horizon_layers').val();
    y = Number(y);
    let arry = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
    let colHead = '<th class="FirstBlank"></th>';
    let table = '';
    arry.forEach((row, z) => {
      colHead = colHead + '<th class="headCol"></th>';
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
      table = table + '<tr class="y' + z + '"><th class="headRow"></th>' + col_html + "</tr>";
    });
    $("#art_canvas thead tr").html(colHead);
    $("#art_canvas tbody").html(table);
  }
}
/*https://lab.syncer.jp/Web/JavaScript/Snippet/66/*/
/*https://qiita.com/tao_s/items/ddde3a4a1a725106da2c*/
function rgb_to_return_array_rgb (rgb) {
  rgb = rgb.replace("rgb(", "");
  rgb = rgb.replace("rgba(", "");
  rgb = rgb.replace(")", "");
  rgb = rgb.replace(" ", "");
  rgb = rgb.replace(" ", "");
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
  //$('#CP .CPimg').find('img').attr('crossorigin', 'anonymous');
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
      vertical_layer_html += '<option value="' + reverse_c + '" autofocus selected>' + reverse_c + '</option>';
      horizontal_layer_html += '<option value="' + k + '" autofocus selected>' + k + '</option>';
    }
    else {
      vertical_layer_html += '<option value="' + reverse_c + '">' + reverse_c + '</option>';
      horizontal_layer_html += '<option value="' + k + '">' + k + '</option>';
    }
  }
  $('#select_vertical_layers').html(vertical_layer_html);
  $('#select_horizon_layers').html(horizontal_layer_html);
  //create 3d view canvas
  let canvas_gap = Math.floor(150 / layer_count);
  let arry = [];
  let canvas_html = '';
  for (let z = 0; z < layer_count; z++) {
    let front = ((z + 1) * canvas_gap) -75;
    let left = ((z + 1) * canvas_gap) -75;
    let bottom = ((z + 1) * canvas_gap) -75;
    let back = (z * canvas_gap) -75;
    let right = (z * canvas_gap) -75;
    let top = (z * canvas_gap) -75;
    canvas_html += '<canvas id="front_z'+ z + '" width="150" height="150" style="transform: translateZ(' + front + 'px)"></canvas>';
    canvas_html += '<canvas id="back_z'+ z + '" width="150" height="150" style="transform: translateZ(' + back + 'px) scaleZ(-1)"></canvas>';
    canvas_html += '<canvas id="top_y'+ z + '" width="150" height="150" style="transform: translateY(' + top + 'px) rotateX(90deg)"></canvas>';
    canvas_html += '<canvas id="bottom_y'+ z + '" width="150" height="150" style="transform: translateY(' + bottom + 'px) rotateX(90deg) scaleZ(-1)"></canvas>';
    canvas_html += '<canvas id="right_x'+ z + '" width="150" height="150" style="transform: translateX(' + right + 'px) rotateY(-90deg)"></canvas>';
    canvas_html += '<canvas id="left_x'+ z + '" width="150" height="150" style="transform: translateX(' + left + 'px) rotateY(-90deg) scaleZ(-1)"></canvas>';
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
  $('#check_view_3d').html(canvas_html);
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
  //one_time_disappear 3d check view
  $('#check_view_3d').css('display', 'none');
  setTimeout((e) => {
    $('#check_view_3d').css('display', 'block');
  },500)
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
// WARNING: change to 3d arry value
function return_for_memory_value (e) {
  let value;
  if ($('#pixel_art').prop('checked')) {
    value = {canvas: 'pixel_art', data: $('#pixel_art_canvas').html()};
  }
  if ($('#map_art').prop('checked')) {
    value = {canvas: 'map_art', data: $('#map_art_canvas').html()};
  }
  if ($('#draw_art').prop('checked')) {
    let img = document.getElementById("draw_art_canvas").getContext("2d").getImageData(0, 0, dac.width, dac.height);
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    c.width = dac.width;
    c.height = dac.height;
    ctx.putImageData(img, 0, 0);
    data = c.toDataURL();
    value = {canvas: 'draw_art', data: data};
  }
  return value;
}
function otm_save(e) {
  let target_id = $(e).parent().attr('id');
  if ($('#' + target_id).attr('data-check') === undefined || !$('#' + target_id).attr('data-check').length) {
    $('#' + target_id).attr('data-check', 'checked');
    $(e).css('display', 'none');
    $('#' + target_id).children('i.fa-delete-left').css('display', 'inline-block');
    let key = target_id;
    let value = return_for_memory_value ();
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
function memory_value_into_canvas (key, name) {
  let value = memory_obj[key];
  if (value.canvas === 'pixel_art' && $('#pixel_art').prop('checked')) {
    $('#pixel_art_canvas').html(value.data);
    $('#pixel_art_canvas').attr('data-fileName', '');
    if (name !== null) {
      $('#pixel_art_canvas').attr('data-fileName', name);
    }
  }
  if (value.canvas === 'map_art' && $('#map_art').prop('checked')) {
    $('#map_art_canvas').html(value.data);
    $('#map_art_canvas').attr('data-fileName', '');
    if (name !== null) {
      $('#map_art_canvas').attr('data-fileName', name);
    }
    $('#map_art_canvas thead th.headCol').css('')
  }
  if (value.canvas === 'draw_art' && $('#draw_art').prop('checked')) {
    let url = value.data;
    let img = new Image();
    img.onload = function (e) {
      let dac = document.getElementById("draw_art_canvas");
      let dactx = dac.getContext("2d");
      dac.width = img.width;
      dac.width = img.height;
      dactx.drawImage(img, 0, 0, dac.width, dac.width);
    };
    img.src = url;
    $('#draw_art_canvas').attr('data-fileName', '');
    if (name !== null) {
      $('#draw_art_canvas').attr('data-fileName', name);
    }
  }
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
  let canvas_style = value.canvas;
  let getStr = "";
  getStr = getStr + "_canvas_" + canvas_style + "_canvas_";
  if (canvas_style === 'draw_art') {
    getStr = getStr + "_split_";
    let url = value.data;
    url = encodeURIComponent(url);
    getStr = getStr + "_drawUrl_" + url + "_drawUrl_";
  }
  else {
    let html = '<table id="download_memory_table" style="display:none"><tbody>';
    html += value.data;
    html += '</tbody></table>';
    $('body').append(html);
    let rowL = $('#download_memory_table').find("tr").length;
    let colL = $('#download_memory_table tbody').children('tr.y1').find("td").length;
    getStr = getStr + "_split_";
    for (let y = 0; y < rowL; y++) {
      for (let x = 0; x < colL; x++) {
        let $cell = $('#download_memory_table tbody').children('tr.y' + y).children('td.x' + x);
        let cell = $cell.clone(true);
        let children = $cell.children().clone(true);
        if (children.length) {
          let alt = jQuery(children).attr("alt");
          let cl = jQuery(children).attr("class");
          let style = jQuery(children).attr("style");
          let tag = jQuery(children).get(0).tagName;
          if (tag !== undefined) {
            getStr = getStr + "_tag_" + tag + "_tag_";
          }
          if (cl !== undefined) {
            getStr = getStr + "_class_" + cl + "_class_";
          }
          if (alt !== undefined) {
            getStr = getStr + "_alt_" + alt + "_alt_";
          }
          if (style !== undefined) {
            let rgb = style.split("rgb(").slice(1);
            rgb = rgb[0].replace(");", "");
            rgb = rgb.split(",");
            getStr = getStr + "_r_" + rgb[0] + "_r_" + "_g_" + rgb[1] + "_g_" + "_b_" + rgb[2] + "_b_";
          }
        } else {
          let style = jQuery(cell).attr("style");
          if (style !== undefined) {
            let rgb = style.split("rgb(").slice(1);
            rgb = rgb[0].replace(");", "");
            rgb = rgb.split(",");
            getStr = getStr + "_r_" + rgb[0] + "_r_" + "_g_" + rgb[1] + "_g_" + "_b_" + rgb[2] + "_b_";
          }
        }
        getStr = getStr + "_col_";
      }
      getStr = getStr + "_row_";
    }
  }
  let getTitle = $('#' + target_id).children("span").text();
  let blob = new Blob([getStr], { type: "text/plain" });
  let link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = getTitle + ".txt";
  link.click();
  link.remove();
  $('#download_memory_table').remove();
});
//data upload
/*https://javascript.keicode.com/newjs/how-to-read-file-with-file-api.php*/
function return_for_upload_memory (canvas_style, html) {
  let value;
  if (canvas_style === 'pixel_art') {
    value = {canvas: 'pixel_art', data: html};
  }
  if (canvas_style === 'map_art') {
    value = {canvas: 'map_art', data: html};
  }
  if (canvas_style === 'draw_art') {
    value = {canvas: 'draw_art', data: html};
  }
  return value;
}
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
  let alt_arr = [];
  let src_arr = [];
  $("#CP .CPimg").children("img").each(function (index) {
    let alt = $(this).attr("alt");
    let src = $(this).attr("src");
    alt_arr.push(alt);
    src_arr.push(src);
  });
  reader.onload = () => {
    let upText = reader.result;
    upText = return_str_escape_html(upText);
    upText = upText.split("_split_");
    let canvas_style = upText[0];
    canvas_style = canvas_style.split("_canvas_").slice(1, 2);
    canvas_style = canvas_style[0];
    let html = '';
    if (canvas_style === 'draw_art') {
      let url = upText[1].split("_drawUrl_").slice(1, 2);
      html = decodeURIComponent(url);
    }
    else {
      let table = upText[1];
      table = table.split("_row_");
      table.pop();
      for (let i = 0; i < table.length; i++) {
        table[i] = table[i].split("_col_");
      }
      table.forEach((row, y) => {
        html = html + '<tr class="y' + y + '"><th class="headRow"></th>';
        row.forEach((col, x) => {
          let tag = table[y][x].split("_tag_").slice(1, 2);
          if (tag.length) {
            let cl = table[y][x].split("_class_").slice(1, 2);
            let alt = table[y][x].split("_alt_").slice(1, 2);
            let r = table[y][x].split("_r_").slice(1, 2);
            let g = table[y][x].split("_g_").slice(1, 2);
            let b = table[y][x].split("_b_").slice(1, 2);
            let index = alt_arr.indexOf(alt[0]);
            if (index < 0) {
              html = html + '<td class="x' + x + '">';
              html = html + "</td>";
              return true;
            }
            let src = src_arr[index];
            html = html + '<td class="x' + x + '">';
            html = html + '<img class="' + cl + '" src="' + src + '" alt="' + alt + '" style="background: rgb(' + r + "," + g + "," + b + ');">';
            html = html + "</td>";
          } else {
            let r = table[y][x].split("_r_").slice(1, 2);
            let g = table[y][x].split("_g_").slice(1, 2);
            let b = table[y][x].split("_b_").slice(1, 2);
            if (r.length) {
              html = html + '<td class="x' + x + '" style="background: rgb(' + r + "," + g + "," + b + ');">';
              html = html + "</td>";
            } else {
              html = html + '<td class="x' + x + '"></td>';
            }
          }
        });
        html = html + "</tr>";
      });
    }
    $('#' + target_id).attr('data-check', 'checked');
    $('#' + target_id).children('i.fa-bookmark').css('display', 'none');
    $('#' + target_id).children('i.fa-delete-left').css('display', 'inline-block');
    let key = target_id;
    let value = return_for_upload_memory (canvas_style, html);
    add_new_obj_to_memory_obj (key,value);
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
  if($('#pixel_art').prop('checked') && !$('#map_canvas_open_icon').prop('checked')) {
    $('#pixel_art_canvas').attr('data-fileName', '');
    $("#pixel_art_canvas tbody td img").remove();
    add_canvas_to_roll_back_obj ('null');
  }
  if($('#map_art').prop('checked') && !$('#map_canvas_open_icon').prop('checked')) {
    $('#map_art_canvas').attr('data-fileName', '');
    $("#map_art_canvas tbody td").removeAttr("style");
    add_canvas_to_roll_back_obj ('null');
  }
  if($('#draw_art').prop('checked') && !$('#map_canvas_open_icon').prop('checked')) {
    $('#draw_art_canvas').attr('data-fileName', '');
    //memory reset
    $.each(obj, function(index, value) {
      obj[index] = '';
    });
    array_match_cell = [];
    count = 0;
    while (roll_back_obj.c_draw > 0) {
      roll_back_obj.draw.pop();
      roll_back_obj.c_draw --;
    }
    roll_back_obj.tableP = [];
    roll_back_obj.one_time_img = [];
    roll_back_obj.c_one_time = 0;
    roll_back_obj.c_draw = 0;
    //canvas reset
    all_removeEventListener (e);
    document.getElementById("draw_art_canvas").getContext("2d").fillStyle = "white";
    document.getElementById("draw_art_canvas").getContext("2d").fillRect(0, 0, dac.width, dac.height);
    let value = document.getElementById("draw_art_canvas").getContext("2d").getImageData(0, 0, dac.width, dac.height);
    roll_back_obj.draw.push(value);
  }
  if($('#map_canvas_open_icon').prop('checked')) {
    const cpc = document.getElementById("color_pick_map_canvas");
    const cpctx = cpc.getContext("2d");
    cpc.width = 600;
    cpc.height = 600;
    cpctx.clearRect(0, 0, cpc.width, cpc.height);
    $('#color_pick_map_drag-and-drop-area').css('display', 'flex');
  }
});
/*change canvas layer*/
function change_layer_select_options(e) {
  let arry = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
  if ($('#vertical_layer').prop('checked')) {
    let vertical_layer_html = '';
    arry.forEach((row, z) => {
      let reverse_c = arry.length - z - 1;
      if (z == Math.floor(arry.length / 2) - 1) {
        vertical_layer_html += '<option value="' + reverse_c + '" autofocus selected>' + reverse_c + '</option>';
      }
      else {
        vertical_layer_html += '<option value="' + reverse_c + '">' + reverse_c + '</option>';
      }
    });
    $('#select_vertical_layers').html(vertical_layer_html);
  }
  if ($('#horizontal_layer').prop('checked')) {
    let horizontal_layer_html = '';
    arry[0].forEach((row, y) => {
      if (y == Math.floor(arry[0].length / 2) - 1) {
        horizontal_layer_html += '<option value="' + y + '" autofocus selected>' + y + '</option>';
      }
      else {
        horizontal_layer_html += '<option value="' + y + '">' + y + '</option>';
      }
    });
    $('#select_horizon_layers').html(horizontal_layer_html);
  }
}
$('#vertical_layer ~ li').click((e) => {
  change_to_vertical_layer (e);
  setTimeout((e) => {
    change_layer_select_options(e);
    change_select_layer (e);
  }, 1)
});
$('#horizontal_layer ~ li').click((e) => {
  change_to_horizon_layers (e);
  setTimeout((e) => {
    change_layer_select_options(e);
    change_select_layer (e);
  }, 1)
});
/*++aside++*/
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
function check_view_rotate_to_front (e) {
  if ($('#cube_front.front').length && $('#cube_top.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-10deg) rotateY(-10deg) rotateZ(0deg)');
  }
  if ($('#cube_front.front').length && $('#cube_right.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-10deg) rotateY(-10deg) rotateZ(90deg)');
  }
  if ($('#cube_front.front').length && $('#cube_left.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-10deg) rotateY(-10deg) rotateZ(-90deg)');
  }
  if ($('#cube_front.front').length && $('#cube_bottom.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-10deg) rotateY(-10deg) rotateZ(180deg)');
  }
  if ($('#cube_top.front').length && $('#cube_back.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-100deg) rotateZ(-10deg) rotateY(0deg)');
  }
  if ($('#cube_top.front').length && $('#cube_left.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-100deg) rotateZ(-10deg) rotateY(90deg)');
  }
  if ($('#cube_top.front').length && $('#cube_right.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-100deg) rotateZ(-10deg) rotateY(-90deg)');
  }
  if ($('#cube_top.front').length && $('#cube_front.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-100deg) rotateZ(-10deg) rotateY(180deg)');
  }
  if ($('#cube_bottom.front').length && $('#cube_front.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(80deg) rotateZ(10deg) rotateY(0deg)');
  }
  if ($('#cube_bottom.front').length && $('#cube_right.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(80deg) rotateZ(10deg) rotateY(90deg)');
  }
  if ($('#cube_bottom.front').length && $('#cube_left.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(80deg) rotateZ(10deg) rotateY(-90deg)');
  }
  if ($('#cube_bottom.front').length && $('#cube_back.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(80deg) rotateZ(10deg) rotateY(180deg)');
  }
  if ($('#cube_back.front').length && $('#cube_top.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-10deg) rotateY(170deg) rotateZ(0deg)');
  }
  if ($('#cube_back.front').length && $('#cube_right.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-10deg) rotateY(170deg) rotateZ(90deg)');
  }
  if ($('#cube_back.front').length && $('#cube_left.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-10deg) rotateY(170deg) rotateZ(-90deg)');
  }
  if ($('#cube_back.front').length && $('#cube_bottom.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-10deg) rotateY(170deg) rotateZ(180deg)');
  }
  if ($('#cube_left.front').length && $('#cube_top.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-10deg) rotateY(-100deg) rotateZ(0deg)');
  }
  if ($('#cube_left.front').length && $('#cube_back.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-100deg) rotateY(0deg) rotateZ(-100deg)');
  }
  if ($('#cube_left.front').length && $('#cube_front.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(80deg) rotateY(0deg) rotateZ(100deg)');
  }
  if ($('#cube_left.front').length && $('#cube_bottom.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(170deg) rotateY(100deg) rotateZ(0deg)');
  }
  if ($('#cube_right.front').length && $('#cube_top.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-10deg) rotateY(80deg) rotateZ(0deg)');
  }
  if ($('#cube_right.front').length && $('#cube_back.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(-100deg) rotateY(0deg) rotateZ(80deg)');
  }
  if ($('#cube_right.front').length && $('#cube_front.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(80deg) rotateY(0deg) rotateZ(-80deg)');
  }
  if ($('#cube_right.front').length && $('#cube_bottom.top').length) {
    $('#check_view_3d').css('transform', 'rotateX(170deg) rotateY(-80deg) rotateZ(0deg)');
  }
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
      check_view_rotate_to_front (e);
    });
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
  check_view_rotate_to_front (e);
});
//retouch 50px sizes for pixel_art
$('aside .for_pixel_art_size input.get_bata').change(function () {
  let px = $(this).val();
  if (px > 50) {
    $(this).val("50");
  }
});
//open drag-and-drop-area from aside iocn
$('.aside_menu .change_to_pixel_art').click((e) => {
  if (!$('#map_canvas_open_icon').prop('checked')) {
    $('#drag-and-drop-area').css('display', 'flex');
    $('#editing_areas').css('width', '600px');
    $('#editing_areas').css('height', '600px');
    const element = document.getElementById("drag-and-drop-area");
    element.scrollIntoView({behavior: "auto", block: "center", inline: "center"});
  }
  if ($('#map_canvas_open_icon').prop('checked')) {
    $('#color_pick_map_drag-and-drop-area').css('display', 'flex');
    $('#color_pick_map').css('width', '600px');
    $('#color_pick_map').css('height', '600px');
    const element = document.getElementById("color_pick_map_drag-and-drop-area");
    element.scrollIntoView({behavior: "auto", block: "center", inline: "center"});
  }
});
//resize canvas table
function build_new_board(canvas_id, px, rowL, colL) {
  let j = rowL - 1;
  while (j >= px) {
    $('#' + canvas_id + ' tbody').find("tr.y" + j).remove();
    j = j - 1;
  }
  let i = colL - 1;
  while (i >= px) {
    $('#' + canvas_id + ' thead tr th:last-child').remove();
    $('#' + canvas_id + ' tbody').find("td.x" + i).remove();
    i = i - 1;
  }
}
$("#resize_button").click(function () {
  if ($('#draw_art').prop('checked'))  {
    return false;
  }
  let px, rowL, colL, canvas_id;
  if ($('#pixel_art').prop('checked')) {
    px = $('#pixel_art_size').val();
    if (px === '') {
      px = 30;
      $('#pixel_art_size').val('30');
    }
    if (px > 512) {
      px = 512;
      $('#pixel_art_size').val("512");
    }
    canvas_id = 'pixel_art_canvas';
  }
  if ($('#map_art').prop('checked')) {
    px = $('#map_art_size').val();
    canvas_id = 'map_art_canvas';
  }
  rowL = $('#' + canvas_id + ' tbody tr').length;
  colL = $('#' + canvas_id + ' thead th').length;
  colL = colL - 1;
  if (rowL >= px || colL >= px) {
    let result;
    if ($('header .header_form p.language').text() === 'Japanese') {
      result = confirm('アートが消えますが続けますか？');
    }
    if ($('header .header_form p.language').text() === '英語') {
      result = confirm('The Art maybe be disappeared, will you continue?');
    }
    if (result) {
      build_new_board(canvas_id, px, rowL, colL);
      return false;
    } else {
      return false;
    }
  }
  if (rowL < px || colL < px) {
    //addcol
    let ci = colL;
    while (ci < px) {
      let cj = 0;
      $('#' + canvas_id + ' thead tr').append('<th class="headCol"></th>');
      while (cj < rowL) {
        $('#' + canvas_id + ' tbody tr.y' + cj).append('<td class="x' + ci + '"></td>');
        cj = cj + 1;
      }
      ci = ci + 1;
    }
    //addrow
    let ri = 0;
    let col = "";
    while (ri < px) {
      col = col + '<td class="x' + ri + '"></td>';
      ri = ri + 1;
    }
    let rj = rowL;
    let table = "";
    while (rj < px) {
      table = table + '<tr class="y' + rj + '"><th class="headRow"></th>' + col + "</tr>";
      rj = rj + 1;
    }
    $('#' + canvas_id + ' tbody').append(table);
  }
});
//file download
/*https://magazine.techacademy.jp/magazine/21073*/
/*https://blog.agektmr.com/2013/09/canvas-png-blob.html*/
/*https://symfoware.blog.fc2.com/blog-entry-2578.html*/
/*https://qiita.com/saka212/items/408bb17dddefc09004c8*/
/*https://qiita.com/saka212/items/408bb17dddefc09004c8*/
const planEXE = document.querySelector("label.planEXE");
function return_src_chosen_imgRgb (paletteId, palette, choosergb) {
  let src;
  let index = palette.indexOf(choosergb);
  let id = paletteId[index];
  if (id === undefined) {
    src = "none";
  } else {
    id = id.split("/");
    if (id.length > 1) {
      src = $("#" + id[0] + " .CPimg").find("img." + id[1]).attr("src");
    } else {
      src = $("#" + id + " .CPimg").find('img.mImg').attr("src");
    }
  }
  return src;
}
function return_alt_chosen_imgRgb (paletteId, palette, choosergb) {
  let alt;
  let index = palette.indexOf(choosergb);
  let id = paletteId[index];
  if (id === undefined) {
    alt = "none";
  } else {
    id = id.split("/");
    if (id.length > 1) {
      alt = $("#" + id[0] + " .CPimg").find("img." + id[1]).attr("alt");
    } else {
      alt = $("#" + id + " .CPimg").find('img.mImg').attr("alt");
    }
  }
  return alt;
}
function return_AltArray_map_art_canvas(c, ctx, rowL, colL, array1, array2, palette, paletteId, table) {
  $('#CP .CPrgb').each(function(index) {
    let id = $(this).parent().attr('id');
    let imgColor = $(this).css("backgroundColor").toString();
    let result = imgColor.split(",");
    if (result >= 4) {
      return true;
    } else {
      palette.push(imgColor);
      paletteId.push(id);
    }
  });
  for (let y = 0; y < rowL; y++) {
    let arrayCol = [];
    for (let x = 0; x < colL; x++) {
      if (!table[y]) {
        table[y] = [];
      }
      let point = "#map_art_canvas tr.y" + y + " td.x" + x;
      let rgb = $(point).css("background-color");
      ctx.fillStyle = rgb;
      ctx.fillRect(x * 20, y * 20, 20, 20);
      ctx.strokeStyle = "rgb(245,245,245)";
      ctx.lineWidth = 0.1;
      ctx.strokeRect(x * 20, y * 20, 20, 20);
      let alt = return_alt_chosen_imgRgb(paletteId, palette, rgb);
      table[y][x] = return_src_chosen_imgRgb(paletteId, palette, rgb);
      arrayCol.push(alt);
    }
    array1.push(arrayCol);
    array2 = array2.concat(arrayCol);
  }
  array1.shift();
  array2.shift();

  let count = {};
  array2.forEach(function (i) {
    count[i] = (count[i] || 0) + 1;
  });
  delete count.none;
  let keyArray = Object.keys(count);
  let valArray = [];
  keyArray.forEach(function (element) {
    valArray.push(count[element]);
  });
  array2 = [2];
  array2.push(keyArray);
  array2.push(valArray);
  array2.shift();
  return {a: array1, b: array2, table: table, c: c};
}
function return_AltArray_pixel_art_canvas(c, ctx, rowL, colL, array1, array2, palette, paletteId, table) {
  $('#CP .CPrgb').each(function(index) {
    let id = $(this).parent().attr('id');
    let $imgC = $("#" + id + " .CPimg");
    let disL = $imgC.find("img").length;
    if (disL <= 0) {
      if ($('header .header_form p.language').text() === 'Japanese') {
        alert("パレットに画像がありません。");
      }
      if ($('header .header_form p.language').text() === '英語') {
        alert("Palette has no image.");
      }
      $('#wait').addClass('hidden');
      return false;
    }
    else if (disL > 1) {
      for (let j = 1; j <= disL; j++) {
        let imgColor = $imgC.children("img.dis" + j).css("backgroundColor").toString();
        palette.push(imgColor);
        let pId = id + "/dis" + j;
        paletteId.push(pId);
      }
    }
    else {
      let imgColor = $imgC.children("img").css("backgroundColor").toString();
      palette.push(imgColor);
      paletteId.push(id);
    }
  });
  for (let y = 0; y < rowL; y++) {
    let arrayCol = [];
    for (let x = 0; x < colL; x++) {
      if (!table[y]) {
        table[y] = [];
      }
      let point = "#pixel_art_canvas tr.y" + y + " td.x" + x;
      let rgb = $(point).find('img.mImg').css("background-color");
      let alt;
      if (rgb === undefined) {
        alt = "none";
        table[y][x] = "none";
      } else {
        ctx.fillStyle = rgb;
        ctx.fillRect(x * 20, y * 20, 20, 20);
        ctx.strokeStyle = "rgb(245,245,245)";
        ctx.lineWidth = 0.1;
        ctx.strokeRect(x * 20, y * 20, 20, 20);
        table[y][x] = return_src_chosen_imgRgb(paletteId, palette, rgb);
        alt = return_alt_chosen_imgRgb(paletteId, palette, rgb);
      }
      arrayCol.push(alt);
    }
    array1.push(arrayCol);
    array2 = array2.concat(arrayCol);
  }
  array1.shift();
  array2.shift();

  let count = {};
  array2.forEach(function (i) {
    count[i] = (count[i] || 0) + 1;
  });
  delete count.none;
  let keyArray = Object.keys(count);
  let valArray = [];
  keyArray.forEach(function (element) {
    valArray.push(count[element]);
  });
  array2 = [2];
  array2.push(keyArray);
  array2.push(valArray);
  array2.shift();
  return { a: array1, b: array2, table: table, c: c};
}
function makeCanvas(rowL, colL, table) {
  const bpc = document.getElementById("Blueprint_with_skins");
  const bpctx = bpc.getContext("2d");
  bpc.width = colL * 20;
  bpc.height = rowL * 20;
  bpctx.strokeStyle = "rgb(245,245,245)";
  bpctx.lineWidth = 0.1;
  table.forEach((row, y) => {
    row.forEach((col, x) => {
      let src = table[y][x];
      if (src === "none") {
        return true;
      }
      let img = new Image();
      // WARNING: if can display img do -> crossorigin="anonymous ->html #Blueprint_with_skins_button toggle hidden
      img.crossOrigin = "anonymous";
      img.onload = function () {
        bpctx.drawImage(img, x * 20, y * 20, 20, 20);
        bpctx.strokeRect(x * 20, y * 20, 20, 20);
        return true;
      };
      img.src = src;
    });
  });
  $('#for_save_Blueprint_with_skins').css('display', 'flex');
}
//excel
function sheet_to_workbook(sheet, opts) {
  let n = opts && opts.sheet ? opts.sheet : "Sheet1";
  let sheets = {};
  sheets[n] = sheet;
  return { SheetNames: [n], Sheets: sheets };
}
function aoa_to_workbook(data, opts) {
  return sheet_to_workbook(XLSX.utils.aoa_to_sheet(data, opts), opts);
}
function s2ab(s) {
  let buf = new ArrayBuffer(s.length);
  let view = new Uint8Array(buf);
  for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}
function func1(a) {
  let write_opts = { type: "binary" };
  let wb = aoa_to_workbook(a);
  let wb_out = XLSX.write(wb, write_opts);
  let blob = new Blob([s2ab(wb_out)], { type: "application/octet-stream" });
  return blob;
}
//img
function imgblob(c) {
  let type = "image/png";
  let dataurl = c.toDataURL(type);
  let bin = atob(dataurl.split(",")[1]);
  let buffer = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i);
  }
  return new Blob([buffer.buffer], { type: type });
}
//each download
function downloop(i, nameArr, blobArr, downloop) {
  let name = nameArr[i];
  let data = blobArr[i];
  const a = document.createElement("a");
  a.href = URL.createObjectURL(data);
  a.download = name;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    window.URL.revokeObjectURL(data);
    i = i + 1;
    if (i >= nameArr.length) {
      return false;
    }
    downloop();
  }, 1000);
}
//zipDownload
function zipDownloop(nameArr, blobArr) {
  let zip = new JSZip();
  for (let c = 0; c < nameArr.length; c++) {
    let name = nameArr[c];
    let data = blobArr[c];
    zip.file(name, data);
  }
  zip.generateAsync({ type: "blob" }).then(function (content) {
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(content, "minecraftPixelArt.zip");
    } else {
      const url = (window.URL || window.webkitURL).createObjectURL(content);
      const download = document.createElement("a");
      download.href = url;
      download.download = "minecraftPixelArt.zip";
      download.click();
      (window.URL || window.webkitURL).revokeObjectURL(url);
    }
  });
}
function downBlueprint(e) {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  let rowL, colL;
  if ($('#map_art').prop('checked')) {
    rowL = $("#map_art_canvas tbody tr").length;
    colL = $("#map_art_canvas thead th").length;
  }
  if ($('#pixel_art').prop('checked')) {
    rowL = $("#pixel_art_canvas tbody tr").length;
    colL = $("#pixel_art_canvas thead th").length;
  }
  colL = colL - 1;
  c.width = colL * 20;
  c.height = rowL * 20;
  let array1 = [1];
  let array2 = [2];
  const palette = [];
  const paletteId = [];
  let table = [];
  let obj = {};
  let PAExcelBlob, NIExcelBlob, CBlob, nameArr, blobArr;
  if ($('#want_block_skins').prop('checked')) {
    if ($('#map_art').prop('checked')) {
      obj = return_AltArray_map_art_canvas(c, ctx, rowL, colL, array1, array2, palette, paletteId, table);
      makeCanvas(rowL, colL, obj.table);
      PAExcelBlob = func1(obj.a);
      NIExcelBlob = func1(obj.b);
      CBlob = imgblob(obj.c);
      nameArr = ["block_placement.xlsx", "items_needed.xlsx", "art_image.png"];
      blobArr = [PAExcelBlob, NIExcelBlob, CBlob];
    }
    if ($('#pixel_art').prop('checked')) {
      obj = return_AltArray_pixel_art_canvas(c, ctx, rowL, colL, array1, array2, palette, paletteId, table);
      makeCanvas(rowL, colL, obj.table);
      PAExcelBlob = func1(obj.a);
      NIExcelBlob = func1(obj.b);
      CBlob = imgblob(obj.c);
      nameArr = ["block_placement.xlsx", "items_needed.xlsx", "art_image.png"];
      blobArr = [PAExcelBlob, NIExcelBlob, CBlob];
    }
    if ($('#draw_art').prop('checked')) {
      const dac = document.getElementById("draw_art_canvas");
      CBlob = imgblob(dac);
      nameArr = ["rough_sketch_image.png"];
      blobArr = [CBlob];
    }
  }
  if (!$('#want_block_skins').prop('checked')) {
    if ($('#map_art').prop('checked')) {
      obj = return_AltArray_map_art_canvas(c, ctx, rowL, colL, array1, array2, palette, paletteId, table);
      PAExcelBlob = func1(obj.a);
      NIExcelBlob = func1(obj.b);
      CBlob = imgblob(obj.c);
      nameArr = ["block_placement.xlsx", "items_needed.xlsx", "art_image.png"];
      blobArr = [PAExcelBlob, NIExcelBlob, CBlob];
    }
    if ($('#pixel_art').prop('checked')) {
      obj = return_AltArray_pixel_art_canvas(c, ctx, rowL, colL, array1, array2, palette, paletteId, table);
      PAExcelBlob = func1(obj.a);
      NIExcelBlob = func1(obj.b);
      CBlob = imgblob(obj.c);
      nameArr = ["block_placement.xlsx", "items_needed.xlsx", "art_image.png"];
      blobArr = [PAExcelBlob, NIExcelBlob, CBlob];
    }
    if ($('#draw_art').prop('checked')) {
      const dac = document.getElementById("draw_art_canvas");
      CBlob = imgblob(dac);
      nameArr = ["rough_sketch_image.png"];
      blobArr = [CBlob];
    }
  }
  zipDownloop(nameArr, blobArr);
}
$('#download_datas_button').click((e) => {
  $('#wait').removeClass('hidden');
  downBlueprint(e);
  $('#wait').addClass('hidden');
});
/*if makeCanvas action can done crossOrigin_anonymous, this is ok*/
// WARNING: if can display img do -> crossorigin="anonymous
function download(name, data) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(data);
  a.download = name;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    window.URL.revokeObjectURL(data);
  }, 1000);
}
$("#Blueprint_with_skins_button").click(function () {
  const c = document.getElementById("Blueprint_with_skins");
  let CBlob = imgblob(c);
  download("skin_image.png", CBlob);
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
  e.preventDefault;
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
  e.preventDefault;
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
    $('#CP label:not(label[for="add_new_blocks"], label.style_delete), #CP p.big_title').addClass('hidden');
    $('#CP input:not(#add_new_blocks, #new_block_img)').each(function (e) {
      let id = $(this).attr('id');
      $('#' + id).prop('checked', false);
    });
    obj.$target = $(".palette .palette_board");
    obj.$icon = $("#for_palette_resize");
    obj.target_h = obj.$target.height();
    obj.icon_top = obj.$icon.offset().top - obj.$target.offset().top;
    let cp_h = $('#CP').height();
    let cp_icons_h = $('#CP_icons').height();
    let sum_h = cp_h + cp_icons_h + 50;
    let difference_h = sum_h - obj.target_h;
    obj.$target.css('height', obj.target_h + difference_h + 'px');
    obj.$icon.css('top', obj.icon_top + difference_h + 'px');
  }
  if ($('#make_palette_board_compact').prop('checked')) {
    $('#CP label:not(label[for="add_new_blocks"], label.style_delete), #CP p.big_title').removeClass('hidden');
    obj.$target = $(".palette .palette_board");
    obj.$icon = $("#for_palette_resize");
    obj.target_h = obj.$target.height();
    obj.icon_top = obj.$icon.offset().top - obj.$target.offset().top;
    let difference_h = 500 - obj.target_h;
    obj.$target.css('height', obj.target_h + difference_h + 'px');
    obj.$icon.css('top', obj.icon_top + difference_h + 'px');
  }
});
$('#CP_icons .CP_icons_form label[for="map_canvas_open_icon"]').click(function (e) {
  if (!$('#map_canvas_open_icon').prop('checked')) {
    $('#CP label:not(label[for="add_new_blocks"], label.style_delete), #CP p.big_title').addClass('hidden');
    $('#CP input:not(#add_new_blocks, #new_block_img)').each(function (e) {
      let id = $(this).attr('id');
      $('#' + id).prop('checked', false);
    });
    $('#make_palette_board_compact').prop('checked', true);
    obj.$target = $(".palette .palette_board");
    obj.$icon = $("#for_palette_resize");
    obj.target_h = obj.$target.height();
    obj.icon_top = obj.$icon.offset().top - obj.$target.offset().top;
    let cp_h = $('#CP').height();
    let cp_icons_h = $('#CP_icons').height();
    let sum_h = cp_h + cp_icons_h + 50;
    let difference_h = sum_h - obj.target_h;
    obj.$target.css('height', obj.target_h + difference_h + 'px');
    obj.$icon.css('top', obj.icon_top + difference_h + 'px');
  }
});
//palette color_boxes form download
/*https://techacademy.jp/magazine/21725*/
$(".palette .palette_download").click(function () {
  let getStr = "";
  $('#CP .CPrgb').parent('label').each(function (index) {
    getStr = getStr + "_split_";
    let color_box_id = $(this).attr('id');
    getStr = getStr + "_id_" + color_box_id + "_id_";
    let parent_class = $(this).parent().attr('class');
    getStr = getStr + "_intoClass_" + parent_class + "_intoClass_";
    let cp_rgb = $(this).children(".CPrgb").css("background-color");
    getStr = getStr + "_CPrgb_" + cp_rgb + "_CPrgb_";
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
    let cp_rgb = str[i].split("_CPrgb_").slice(1, 2);
    html = html + '<div class="CPrgb" style="background: ' + cp_rgb + ';"></div><div class="CPimg">';
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
      //html = html + '<img class="' + cl + '" src="' + src + '" alt="' + alt + '" style="background: ' + rgb + ';">';
    }
    html = html + "</div></label>";
    let parent_class = str[i].split("_intoClass_").slice(1, 2);
    array_html.push({parent_class: parent_class, html: html});
  }
  return array_html;
}
$("#palette_upload").change(function (e) {
  e.preventDefault();
  $('html').css('cursor', 'wait');
  let alt_arr = [];
  let src_arr = [];
  $("#CP .CPimg").children("img").each(function (index) {
    let alt = $(this).attr("alt");
    let src = $(this).attr("src");
    alt_arr.push(alt);
    src_arr.push(src);
  });
  $('#CP .CPrgb').parent().each(function (index) {
    $(this).remove();
  });
  const file = e.target.files[0];
  if (file === undefined) {
    return false;
  }
  const reader = new FileReader();
  reader.onload = () => {
    let str = reader.result;
    str = return_str_escape_html(str);
    let array_html = return_array_doinput(alt_arr, src_arr, str);
    for (let i = 0; i < array_html.length; i++) {
      let parent_class = array_html[i].parent_class;
      $('#CP .' + parent_class).append(array_html[i].html);
    }
    $("#palette_upload").val("");
    $('html').css('cursor', 'default');
  };
  reader.readAsText(file);
});
//new color pickup action form map & canvas
$("#colorBox").click(function () {
  if (!$('#color_dropper_icon').prop('checked')) {
    return false;
  }
  if ($('#color_dropper_icon').prop('checked')) {
    return true;
  }
});
$('#map_canvas_open_icon').change((e) => {
  if ($('#map_canvas_open_icon').prop('checked')) {
    $('#editing_areas').addClass('hidden');
    $('#color_pick_map').removeClass('hidden');
  }
  if (!$('#map_canvas_open_icon').prop('checked')) {
    $('#editing_areas').removeClass('hidden');
    $('#color_pick_map').addClass('hidden');
  }
});
//remove_CP_boxes
$('#CP_icons .CP_icons_form button.remove_CP_box').click((e) => {
  let target_class = $('#CP label.check').parent().attr('class');
  if (target_class === 'color_named_blocks') {
    return false;
  }
  $('#CP label.check').remove();
  $("#CP .CPimg").parent().each(function (index) {
    index ++;
    $(this).attr('id', 'CP' + index);
  });
});
//++observer cp start++
//new_block_imgs
$('#CP .add_new_blocks button').on('click', (e) => {
  $('#new_block_img').click();
});
function upload_new_blocks (i, cp_L, files, callback) {
  let reader = new FileReader();
  let img = document.createElement("img");
  let image = new Image();
  img.crossOrigin = "anonymous";
  reader.onload = function (evt) {
    img.onload = function () {
      $("#CP label.check").removeClass("check");
      let str = '<label id="CP' + cp_L + '"><div class="CPimg"></div></label>';
      $("#CP .add_new_blocks").append(str);
      const cp = document.querySelector("#CP" + cp_L + " .CPimg");
      cp.appendChild(img);
      const c = document.createElement("canvas");
      const ctx = c.getContext("2d");
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
          $('#new_block_img').val("");
          $("#CP" + cp_L).addClass("check");
          return false;
        }
        cp_L ++;
        callback (i, cp_L, files, upload_new_blocks);
      },0);
    };
    let alt = files[i].name;
    alt = alt.split(".");
    img.src = evt.target.result;
    img.alt = alt[0];
    img.className = "mImg";
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
  let img_html = return_img_html (id);
  $('.palette .palette_button .selected_block_img, #CP_icons .selected_block_img').html(img_html);
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
$('.normal_tool > label:not(label[for="normal_tool_button"])').click(function (e) {
  let id = $(this).attr('for');
  toggle_radio_checked (id);
});
//pop up explain of roll_back_and_forward
$('.roll_back_and_forward .roll_back, .roll_back_and_forward .roll_forward').on('mouseenter', function(e) {
  obj.pop_text = $(this).children('span.shortcut').text();
  obj.use = 'mouse';
  pop_text_at_hover (e);
});
$('.roll_back_and_forward .roll_back, .roll_back_and_forward .roll_forward').on('mouseleave', function(e) {
  $('#CP_img_explanation').remove();
});
//change layers
$('#select_vertical_layers, #select_horizon_layers').change((e) => {
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
  e.preventDefault;
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
  e.preventDefault;
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
let convertToRGB = function (rgb) {
  rgb = rgb.replace("rgb(", "");
  rgb = rgb.replace(")", "");
  rgb = rgb.split(",");
  return { r: rgb[0], g: rgb[1], b: rgb[2]};
};
let convertToRGB_at_draw_to_pixels = function (rgb) {
  if (rgb === "rgb(255, 255, 255)") {
    return "empty";
  }
  rgb = rgb.replace("rgb(", "");
  rgb = rgb.replace(")", "");
  rgb = rgb.split(",");
  return { r: rgb[0], g: rgb[1], b: rgb[2]};
};
let calcDelta_original = function (t, p) {
  return ( Math.pow((p.r - t.r) * 0.3, 2) + Math.pow((p.g - t.g) * 0.59, 2) + Math.pow((p.b - t.b) * 0.11, 2));
};
let chooseColor_at_draw_to_pixels = function (palette, inrgb) {
  const rgb = convertToRGB_at_draw_to_pixels(inrgb);
  if (rgb === "empty") {
    return "empty";
  }
  let color;
  let result = palette.indexOf(inrgb);
  if (result >= 0) {
    color = inrgb;
  }
  if (result < 0) {
    let delta = Number.MAX_SAFE_INTEGER;
    palette.forEach((p) => {
      // カラーパレットの色(RGB)
      const prgb = convertToRGB_at_draw_to_pixels(p);
      const d = calcDelta(rgb, prgb);
      if (d < delta) {
        color = p;
        delta = d;
      }
    });
  }
  return color;
};
let chooseColor = function (calcDelta, palette, inrgb) {
  const rgb = convertToRGB(inrgb);
  let color;
  let delta = Number.MAX_SAFE_INTEGER;
  palette.forEach((p) => {
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
  const palette = [];
  const paletteId = [];
  $('#CP .active').removeClass('active');
  if ($("#change_to_map_art_data").prop('checked')) {
    $('#CP .CPrgb').each(function (index) {
      let target = $(this).parent().parent().attr('class');
      if ($('#' + target).prop('checked')) {
        let bgColor = $(this).css("backgroundColor").toString();
        let result = bgColor.split(",");
        if (result >= 4) {
          return true;
        } else {
          palette.push(bgColor);
        }
      }
    });
  }
  if ($("#change_to_pixel_art_data").prop('checked')) {
    $('#CP .CPrgb').each(function (index) {
      let target = $(this).parent().parent().attr('class');
      if ($('#' + target).prop('checked')) {
        let id = $(this).parent().attr('id');
        let disL = $('#' + id + ' .CPimg').find("img").length;
        if (disL <= 0) {
          if ($('header .header_form p.language').text() === 'Japanese') {
            alert("パレットに画像がありません。");
          }
          if ($('header .header_form p.language').text() === '英語') {
            alert("Palette has no image.");
          }
          $('html').css('cursor', 'default');
          return false;
        }
        if (disL > 1) {
          for (let j = 1; j <= disL; j++) {
            let imgColor = $('#' + id + ' .CPimg').children("img.dis" + j).css("backgroundColor").toString();
            palette.push(imgColor);
            let pId = id + "/dis" + j;
            paletteId.push(pId);
          }
        }
        if (disL == 1) {
          let imgColor = $('#' + id + ' .CPimg').children("img").css("backgroundColor").toString();
          palette.push(imgColor);
          paletteId.push(id);
        }
      }
    });
  }
  let ratio_r = $('#sample_ratio_r').val();
  let ratio_g = $('#sample_ratio_g').val();
  let ratio_b = $('#sample_ratio_b').val();
  let sum_ratio = ratio_r + ratio_g + ratio_b;
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
  let nL = obj.dl_name.length;
  if (nL <= 20) {
    nL = 20;
  }
  nL = 20 / nL + "em";
  $(".input_forms .load_title span").css("font-size", nL);
  $(".input_forms .load_title span").text(obj.dl_name);
  let px;
  if ($('#pixel_art').prop('checked')) {
    px = $('#pixel_art_size').val();
    if (px === '') {
      px = 30;
      $('#pixel_art_size').val('30');
    }
    if (px > 512) {
      px = 512;
      $('#pixel_art_size').val("512");
    }
  }
  if ($('#map_art').prop('checked')) {
    px = $('#map_art_size').val();
  }
  if ($('#draw_art').prop('checked')) {
    px = 600;
  }
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  let imgH = image.height;
  let imgW = image.width;
  let cx = 0;
  let cy = 0;
  c.width = px;
  c.height = px;
  if (imgH >= imgW) {
    cy = (imgH - imgW) / 2;
    imgH = imgW;
  } else {
    cx = (imgW - imgH) / 2;
    imgW = imgH;
  }
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(0, 0, px, px);
  ctx.drawImage(image, cx, cy, imgW, imgH, 0, 0, px, px);
  let i = 0;
  let col = "";
  let colHead = '<th class="FirstBlank"></th>';
  while (i < px) {
    colHead = colHead + '<th class="headCol"></th>';
    col = col + '<td class="x' + i + '"></td>';
    i = i + 1;
  }
  let j = 0;
  let table = "";
  let tableR = "";
  while (j < px) {
    table = table + '<tr class="y' + j + '"><th class="headRow"></th>' + col + "</tr>";
    tableR = tableR + '<tr class="y' + j + '">' + col + "</tr>";
    j = j + 1;
  }
  if ($('#map_art').prop('checked')) {
    $("#map_art_canvas thead tr").html(colHead);
    $("#map_art_canvas tbody").html(table);
  }
  if ($('#pixel_art').prop('checked')) {
    $("#pixel_art_canvas thead tr").html(colHead);
    $("#pixel_art_canvas tbody").html(table);
  }
  const palette = [];
  const paletteId = [];
  $('#CP .active').removeClass('active');
  if ($("#change_to_map_art_data").prop('checked')) {
    $('#CP .CPrgb').each(function (index) {
      let target = $(this).parent().parent().attr('class');
      if ($('#' + target).prop('checked')) {
        let bgColor = $(this).css("backgroundColor").toString();
        let result = bgColor.split(",");
        if (result >= 4) {
          return true;
        } else {
          palette.push(bgColor);
        }
      }
    });
  }
  if ($("#change_to_pixel_art_data").prop('checked')) {
    $('#CP .CPrgb').each(function (index) {
      let target = $(this).parent().parent().attr('class');
      if ($('#' + target).prop('checked')) {
        let id = $(this).parent().attr('id');
        let disL = $('#' + id + ' .CPimg').find("img").length;
        if (disL <= 0) {
          if ($('header .header_form p.language').text() === 'Japanese') {
            alert("パレットに画像がありません。");
          }
          if ($('header .header_form p.language').text() === '英語') {
            alert("Palette has no image.");
          }
          $('html').css('cursor', 'default');
          return false;
        }
        if (disL > 1) {
          for (let j = 1; j <= disL; j++) {
            let imgColor = $('#' + id + ' .CPimg').children("img.dis" + j).css("backgroundColor").toString();
            palette.push(imgColor);
            let pId = id + "/dis" + j;
            paletteId.push(pId);
          }
        }
        if (disL == 1) {
          let imgColor = $('#' + id + ' .CPimg').children("img").css("backgroundColor").toString();
          palette.push(imgColor);
          paletteId.push(id);
        }
      }
    });
  }
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
  let calcDelta = function ( t, p) {
    return ( Math.pow((p.r - t.r) * ratio_r, 2) + Math.pow((p.g - t.g) * ratio_g, 2) + Math.pow((p.b - t.b) * ratio_b, 2));
  };
  for (let i = 0; i < px; i++) {
    for (let j = 0; j < px; j++) {
      let pixel = ctx.getImageData(j, i, 1, 1);
      let data = pixel.data;
      const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
      if ($('#map_art').prop('checked')) {
        let choosergb = chooseColor(calcDelta, palette, rgb);
        $("#map_art_canvas tbody tr.y" + i + " td.x" + j).css("background", choosergb);
      }
      if ($('#pixel_art').prop('checked')) {
        let choosergb = chooseColor(calcDelta, palette, rgb);
        let chooseBlock = chooseImg(paletteId, palette, choosergb);
        $("#pixel_art_canvas tbody tr.y" + i + " td.x" + j).html(chooseBlock);
      }
      if ($('#draw_art').prop('checked')) {
        dactx.fillStyle = chooseColor(calcDelta, palette, rgb);
        dactx.fillRect(j, i, 1, 1);
      }
    }
  }
}
$('#for_sample_view .for_sample_view_form .close_button').click((e) => {
  obj.dl_img = '';
  obj.dl_name = '';
});
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
  $('#for_sample_view').css('display', 'none');
  $('#drag-and-drop-area').css('display', 'none');
  setTimeout((e) => {
    change_to_blocks();
    $('#wait').addClass('hidden');
  }, 1)
});
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
  let img_html = return_img_html (id);
  $('.palette .palette_button .selected_block_img, #CP_icons .selected_block_img').html(img_html);
}
function color_dropper_icon(e) {
  all_removeEventListener (e);
  let catch_color;
  td_xy_bgColor_in_obj (obj.start_x, obj.start_y);
  catch_color = obj.td_bgColor;
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
function draw_3d_check_and_make_once_memory (x, y, color) {
  if ($('#vertical_layer').prop('checked')) {
    let layer_z = $('#select_vertical_layers').val();
    draw_3d_view(x, y, layer_z, color);
    obj.once_memory[layer_z][y][x] = color;
  }
  if ($('#horizontal_layer').prop('checked')) {
    let layer_y = $('#select_horizon_layers').val();
    draw_3d_view(x, layer_y, y, color);
    obj.once_memory[y][layer_y][x] = color;
  }
}
function end_fun (e) {
  all_removeEventListener ();
  let color = $('.palette .palette_button .selected_block_img').find('img.mImg').css('background-color');
  if (obj.want_if === 'stroke_path_with_line') {
    td_xy_bgColor_in_obj (obj.start_x, obj.start_y);
    let range_x = obj.bef_x - obj.start_x;
    let range_y = obj.bef_y - obj.start_y;
    range_x = Math.floor(range_x / obj.range);
    range_y = Math.floor(range_y / obj.range);
    if (isNaN(range_x) || isNaN(range_y) || range_x == 0) {
      draw_3d_check_and_make_once_memory (obj.td_x, obj.tr_y, color);
      return true;
    }
    let radius = Math.sqrt(Math.pow(range_y,2) + Math.pow(range_x,2));
    let radians = Math.atan((range_y) / Math.abs(range_x));
    if (range_x < 0) {
      radians = Math.PI - radians;
    }
    for (let i = 0; i <= radius; i++) {
      let x = Math.floor(obj.td_x + i * Math.cos(radians));
      let y = Math.floor(obj.tr_y + i * Math.sin(radians));
      draw_3d_check_and_make_once_memory (x, y, color);
    }
  }
  if (obj.want_if === 'stroke_path_with_rect') {
    let left_x, top_y;
    if (obj.start_x <= obj.bef_x) {
      left_x = obj.start_x;
    } else {
      left_x = obj.bef_x;
    }
    if (obj.start_y <= obj.bef_y) {
      top_y = obj.start_y;
    } else {
      top_y = obj.bef_y;
    }
    td_xy_bgColor_in_obj (left_x, top_y);
    let range_x = Math.abs(obj.bef_x - obj.start_x);
    let range_y = Math.abs(obj.bef_y - obj.start_y);
    range_x = Math.floor(range_x / obj.range);
    range_y = Math.floor(range_y / obj.range);
    if (isNaN(range_x) || isNaN(range_y)) {
      draw_3d_check_and_make_once_memory (obj.td_x, obj.tr_y, color);
      return true;
    }
    for (let i = 0; i <= range_x; i++) {
      let x = obj.td_x + i;
      let y = obj.tr_y;
      draw_3d_check_and_make_once_memory (x, y, color);
      y += range_y;
      draw_3d_check_and_make_once_memory (x, y, color);
    }
    for (let j = 0; j <= range_y; j++) {
      let x = obj.td_x;
      let y = obj.tr_y + j;
      draw_3d_check_and_make_once_memory (x, y, color);
      x += range_x;
      draw_3d_check_and_make_once_memory (x, y, color);
    }
  }
  if (obj.want_if === 'stroke_path_with_arc') {
    td_xy_bgColor_in_obj (obj.start_x, obj.start_y);
    let range_x = obj.bef_x - obj.start_x;
    let range_y = obj.bef_y - obj.start_y;
    range_x = Math.floor(range_x / obj.range);
    range_y = Math.floor(range_y / obj.range);
    if (isNaN(range_x) || isNaN(range_y)) {
      draw_3d_check_and_make_once_memory (obj.td_x, obj.tr_y, color);
      return true;
    }
    let radius = Math.sqrt(Math.pow(range_y,2) + Math.pow(range_x,2));
    let circumference = 2 * Math.PI * radius;
    for (let i = 0; i <= circumference; i++) {
      let x =  Math.round(obj.td_x + Math.cos(i / radius) * radius);
      let y =  Math.round(obj.tr_y + Math.sin(i / radius) * radius);
      draw_3d_check_and_make_once_memory (x, y, color);
    }
  }
  if (obj.copy_img !== '') {
    obj.once_memory = '';
    return false;
  }
  add_canvas_to_roll_back_obj (obj.once_memory);
  ac.removeEventListener('mouseup', end_fun);
  ac.removeEventListener("touchend", end_fun);
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
  td_xy_bgColor_in_obj (obj.start_x, obj.start_y);
  let range_x = obj.bef_x - obj.start_x;
  let range_y = obj.bef_y - obj.start_y;
  range_x = Math.floor(range_x / obj.range);
  range_y = Math.floor(range_y / obj.range);
  $('#art_canvas').html(obj.start_img);
  if (isNaN(range_x) || isNaN(range_y) || range_x == 0) {
    $('#art_canvas tr.y' + obj.tr_y + ' td.x' + obj.td_x).html(img);
    return true;
  }
  let radius = Math.sqrt(Math.pow(range_y,2) + Math.pow(range_x,2));
  let radians = Math.atan((range_y) / Math.abs(range_x));
  if (range_x < 0) {
    radians = Math.PI - radians;
  }
  for (let i = 0; i <= radius; i++) {
    let x = Math.floor(obj.td_x + i * Math.cos(radians));
    let y = Math.floor(obj.tr_y + i * Math.sin(radians));
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
  let left_x, top_y;
  if (obj.start_x <= obj.bef_x) {
    left_x = obj.start_x;
  } else {
    left_x = obj.bef_x;
  }
  if (obj.start_y <= obj.bef_y) {
    top_y = obj.start_y;
  } else {
    top_y = obj.bef_y;
  }
  td_xy_bgColor_in_obj (left_x, top_y);
  let range_x = Math.abs(obj.bef_x - obj.start_x);
  let range_y = Math.abs(obj.bef_y - obj.start_y);
  range_x = Math.floor(range_x / obj.range);
  range_y = Math.floor(range_y / obj.range);
  $('#art_canvas').html(obj.start_img);
  if (isNaN(range_x) || isNaN(range_y)) {
    $('#art_canvas tr.y' + obj.tr_y + ' td.x' + obj.td_x).html(img);
    return true;
  }
  for (let i = 0; i <= range_x; i++) {
    let x = obj.td_x + i;
    let y = obj.tr_y;
    $('#art_canvas tr.y' + y + ' td.x' + x).html(img);
    y += range_y;
    $('#art_canvas tr.y' + y + ' td.x' + x).html(img);
  }
  for (let j = 0; j <= range_y; j++) {
    let x = obj.td_x;
    let y = obj.tr_y + j;
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
  td_xy_bgColor_in_obj (obj.start_x, obj.start_y);
  let range_x = obj.bef_x - obj.start_x;
  let range_y = obj.bef_y - obj.start_y;
  range_x = Math.floor(range_x / obj.range);
  range_y = Math.floor(range_y / obj.range);
  $('#art_canvas').html(obj.start_img);
  if (isNaN(range_x) || isNaN(range_y)) {
    $('#art_canvas tr.y' + obj.tr_y + ' td.x' + obj.td_x).html(img);
    return true;
  }
  let radius = Math.sqrt(Math.pow(range_y,2) + Math.pow(range_x,2));
  let circumference = 2 * Math.PI * radius;
  for (let i = 0; i <= circumference; i++) {
    let x =  Math.round(obj.td_x + Math.cos(i / radius) * radius);
    let y =  Math.round(obj.tr_y + Math.sin(i / radius) * radius);
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
    td_xy_bgColor_in_obj (obj.start_x, obj.start_y);
    put_img = obj.copy_img;
    x = obj.td_x - (put_img[0].length - 1);
    y = obj.tr_y - (put_img.length - 1);
    let range_x = obj.bef_x - obj.start_x;
    let range_y = obj.bef_y - obj.start_y;
    range_x = Math.floor(range_x / obj.range);
    range_y = Math.floor(range_y / obj.range);
    if (isNaN(range_x) || isNaN(range_y)) {
      return true;
    }
    w = put_img[0].length + range_x;
    h = put_img.length + range_y;
  }
  if (obj.want_if === 'roll_area_with_rect') {
    td_xy_bgColor_in_obj (obj.start_x, obj.start_y);
    put_img = obj.copy_img;
    w = put_img[0].length;
    h = put_img.length;
    xc = obj.td_x - w / 2;
    yc = obj.tr_y - h / 2;
    piBase = Math.atan(h / w);
    let center_X = obj.start_x - obj.range * w / 2;
    let center_Y = obj.start_y - obj.range * h / 2;
    let range_x = obj.bef_x - center_X;
    let range_y = obj.bef_y - center_Y;
    range_x = Math.floor(range_x / obj.range);
    range_y = Math.floor(range_y / obj.range);
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
  $('#art_canvas').html(obj.start_img);
  if (obj.copy_img === '') {
    let left_x, top_y;
    if (obj.start_x <= obj.bef_x) {
      left_x = obj.start_x;
    } else {
      left_x = obj.bef_x;
    }
    if (obj.start_y <= obj.bef_y) {
      top_y = obj.start_y;
    } else {
      top_y = obj.bef_y;
    }
    td_xy_bgColor_in_obj (left_x, top_y);
    let range_x = Math.abs(obj.bef_x - obj.start_x);
    let range_y = Math.abs(obj.bef_y - obj.start_y);
    range_x = Math.floor(range_x / obj.range);
    range_y = Math.floor(range_y / obj.range);
    for (let h = 0; h <= range_y; h++) {
      for (let w = 0; w <= range_x; w++) {
        let x = obj.td_x + w;
        let y = obj.tr_y + h;
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
  if ($('#no_set_action').prop('checked')) {
    want_if = 'false';
    return want_if;
  }
  else if ($('#zoom_scope_button').prop('checked')) {
    want_if = 'true';
    return want_if;
  }
  else if ($('#color_dropper_icon').prop('checked')) {
    want_if = 'color_dropper_icon';
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
function choose_fun (e) {
  if (obj.want_if === 'pen_tool' || obj.want_if === 'eraser_points_tool') {
    point_draw_action(e);
  }
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
    ac.removeEventListener('mouseup', end_fun);
    copy_area_with_rect(e);
  }
}
/*escape for touch test*/
ac.onmousedown = function (e) {
  obj.use = 'mouse_at_art';
  obj.want_if = return_want_if_at_tool ();
  obj.once_memory = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
  if (obj.want_if === 'false') {
    all_removeEventListener (e);
    return false;
  }
  if (obj.want_if === 'true') {
    all_removeEventListener (e);
    return true;
  }
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
  else {
    obj.start_img = $('#art_canvas').html();
    ac.addEventListener('mousemove', choose_fun);
    ac.addEventListener('mouseup', end_fun);
  }
};
ac.addEventListener("touchstart", function (e) {
  obj.use = 'touch_at_art';
  obj.want_if = return_want_if_at_tool ();
  obj.once_memory = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
  if (obj.want_if === 'false') {
    all_removeEventListener (e);
    return false;
  }
  if (obj.want_if === 'true') {
    all_removeEventListener (e);
    return true;
  }
  obj.start_x = e.touches[0].clientX;
  obj.start_y = e.touches[0].clientY;
  obj.range = 20 * Number($('#art_scale').val()) / 100;
  $('#art_canvas td.selected').removeClass('selected');
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
  else {
    obj.start_img = $('#art_canvas').html();
    ac.addEventListener("touchmove", choose_fun);
    ac.addEventListener("touchend", end_fun);
  }
});
//all removeEventListener at window remove
document.addEventListener('beforeunload', all_removeEventListener);
document.addEventListener('mouseleave', all_removeEventListener);
//roll_back
//add action of obj.once_memory = ''; and remove td.selected
function roll_back (e) {
  if ($('#map_art').prop('checked')) {
    if (roll_back_obj.c_map >= roll_back_obj.map.length - 1) {
      roll_back_obj.c_map = roll_back_obj.map.length - 1;
      if (roll_back_obj.map[0] === 'null') {
        $("#map_art_canvas tbody td").removeAttr("style");
      }
      return false;
    }
    let i = roll_back_obj.map.length - 1;
    let value = roll_back_obj.map[i - roll_back_obj.c_map - 1];
    if (value === 'null') {
      $("#map_art_canvas tbody td").removeAttr("style");
    }
    if (value !== 'null') {
      $('#map_art_canvas').html(value);
    }
    roll_back_obj.c_map ++;
  }
  if ($('#pixel_art').prop('checked')) {
    if (roll_back_obj.c_pixel >= roll_back_obj.pixel.length - 1) {
      roll_back_obj.c_pixel = roll_back_obj.pixel.length - 1;
      if (roll_back_obj.pixel[0] === 'null') {
        $("#pixel_art_canvas tbody td img").remove();
      }
      return false;
    }
    let i = roll_back_obj.pixel.length - 1;
    let value = roll_back_obj.pixel[i - roll_back_obj.c_pixel - 1];
    if (value === 'null') {
      $("#pixel_art_canvas tbody td img").remove();
    }
    if (value !== 'null') {
      $('#pixel_art_canvas').html(value);
    }
    roll_back_obj.c_pixel ++;
  }
  if ($('#draw_art').prop('checked')) {
    if (roll_back_obj.one_time_img.length) {
      if (roll_back_obj.c_one_time >= roll_back_obj.one_time_img.length - 1) {
        roll_back_obj.c_one_time = 0;
        roll_back_obj.tableP = [];
        roll_back_obj.one_time_img = [];
        let i = roll_back_obj.draw.length - 1;
        let value = roll_back_obj.draw[i - roll_back_obj.c_draw];
        if (value === 'null') {
          dactx.fillStyle = "white";
          dactx.fillRect(0, 0, dac.width, dac.height);
          return false;
        }
        if (value !== 'null') {
          let callback = function(){return true};
          roll_back_obj_url_value_into_canvas (value,callback);
          return false;
        }
      }
      let i = roll_back_obj.one_time_img.length - 1;
      let value = roll_back_obj.one_time_img[i - roll_back_obj.c_one_time - 1];
      dactx.putImageData(value, 0, 0);
      roll_back_obj.c_one_time ++;
    }
    if (!roll_back_obj.one_time_img.length) {
      if (roll_back_obj.c_draw >= roll_back_obj.draw.length - 1) {
        roll_back_obj.c_draw = roll_back_obj.draw.length - 1;
        if (roll_back_obj.draw[0] === 'null') {
          dactx.fillStyle = "white";
          dactx.fillRect(0, 0, dac.width, dac.height);
        }
        return false;
      }
      let i = roll_back_obj.draw.length - 1;
      let value = roll_back_obj.draw[i - roll_back_obj.c_draw - 1];
      if (value === 'null') {
        dactx.fillStyle = "white";
        dactx.fillRect(0, 0, dac.width, dac.height);
        roll_back_obj.c_draw ++;
      }
      if (value !== 'null') {
        let callback = function() {
          roll_back_obj.c_draw ++;
        };
        roll_back_obj_url_value_into_canvas (value,callback);
      }
    }
  }
}
$('.roll_back_and_forward .roll_back').click((e) => {
  roll_back (e);
});
//roll_forward
function roll_forward (e) {
  if ($('#map_art').prop('checked')) {
    if (roll_back_obj.c_map <= 0) {
      roll_back_obj.c_map = 0;
      return false;
    }
    let i = roll_back_obj.map.length - 1;
    let value = roll_back_obj.map[i - roll_back_obj.c_map + 1];
    if (value === 'null') {
      $("#map_art_canvas tbody td").removeAttr("style");
    }
    if (value !== 'null') {
      $('#map_art_canvas').html(value);
    }
    roll_back_obj.c_map --;
  }
  if ($('#pixel_art').prop('checked')) {
    if (roll_back_obj.c_pixel <= 0) {
      roll_back_obj.c_pixel = 0;
      return false;
    }
    let i = roll_back_obj.pixel.length - 1;
    let value = roll_back_obj.pixel[i - roll_back_obj.c_pixel + 1];
    if (value === 'null') {
      $("#pixel_art_canvas tbody td img").remove();
    }
    if (value !== 'null') {
      $('#pixel_art_canvas').html(value);
    }
    roll_back_obj.c_pixel --;
  }
  if ($('#draw_art').prop('checked')) {
    if (roll_back_obj.one_time_img.length) {
      if (roll_back_obj.c_one_time <= 0) {
        roll_back_obj.c_one_time = 0;
        return false;
      }
      let i = roll_back_obj.one_time_img.length - 1;
      let value = roll_back_obj.one_time_img[i - roll_back_obj.c_one_time + 1];
      dactx.putImageData(value, 0, 0);
      roll_back_obj.c_one_time --;
    }
    if (!roll_back_obj.one_time_img.length) {
      if (roll_back_obj.c_draw <= 0) {
        roll_back_obj.c_draw = 0;
        return false;
      }
      let i = roll_back_obj.draw.length - 1;
      let value = roll_back_obj.draw[i - roll_back_obj.c_draw + 1];
      if (value === 'null') {
        dactx.fillStyle = "white";
        dactx.fillRect(0, 0, dac.width, dac.height);
        roll_back_obj.c_draw --;
      }
      if (value !== 'null') {
        let callback = function () {
          roll_back_obj.c_draw --;
        }
        roll_back_obj_url_value_into_canvas (value,callback);
      }
    }
  }
}
$('.roll_back_and_forward .roll_forward').click((e) => {
  roll_forward (e);
});
//shortcuts for roll_back_and_forward
document.addEventListener('keydown', ctrl_keydown_event,false);
document.addEventListener('keydown', ctrl_shift_keydown_event,false);
function ctrl_keydown_event(e){
  e.preventDefault;
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyZ") {
    $('.roll_back_and_forward .roll_back').click();
  }
}
function ctrl_shift_keydown_event(e){
  e.preventDefault;
  if(event.ctrlKey && event.shiftKey && event.code === "KeyZ") {
    $('.roll_back_and_forward .roll_forward').click();
  }
}
//to_close_path
let close_path_finish = function(e) {
  prepare_ctx_data (e);
  dactx.beginPath();
  dactx.moveTo(roll_back_obj.tableP[0][0], roll_back_obj.tableP[0][1]);
  for (let i = 1; i < roll_back_obj.tableP.length; i++) {
    let cp2x = 2 * roll_back_obj.tableP[i][0] - roll_back_obj.tableP[i][2];
    let cp2y = 2 * roll_back_obj.tableP[i][1] - roll_back_obj.tableP[i][3];
    dactx.bezierCurveTo(
      roll_back_obj.tableP[i - 1][2], roll_back_obj.tableP[i - 1][3],
      cp2x, cp2y,
      roll_back_obj.tableP[i][0], roll_back_obj.tableP[i][1]
    );
  }
  dactx.closePath();
  if (obj.want_if === 'stroke_path_with_line') {
    dactx.stroke();
  }
  if (obj.want_if === 'fill_in_with_line') {
    dactx.fill();
  }
  roll_back_obj.tableP = [];
  roll_back_obj.one_time_img = [];
  roll_back_obj.c_one_time = 0;
  value = dactx.getImageData(0, 0, dac.width, dac.height);
  add_canvas_to_roll_back_obj (value);
  return false;
};
function to_close_path (e) {
  while (roll_back_obj.c_one_time > 0) {
    roll_back_obj.tableP.pop();
    roll_back_obj.one_time_img.pop();
    roll_back_obj.c_one_time --;
  }
  if (roll_back_obj.tableP.length <= 0) {
    roll_back_obj.one_time_img = [];
    roll_back_obj.c_one_time = 0;
    return false;
  }
  let i = roll_back_obj.draw.length - 1;
  let value = roll_back_obj.draw[i - roll_back_obj.c_draw];
  if (value === 'null') {
    dactx.fillStyle = "white";
    dactx.fillRect(0, 0, dac.width, dac.height);
    close_path_finish();
  }
  if (value !== 'null') {
    roll_back_obj_url_value_into_canvas (value,close_path_finish);
  }
}
let open_path_finish = function(e) {
  prepare_ctx_data (e);
  dactx.beginPath();
  dactx.moveTo(roll_back_obj.tableP[0][0], roll_back_obj.tableP[0][1]);
  for (let i = 1; i < roll_back_obj.tableP.length; i++) {
    let cp2x = 2 * roll_back_obj.tableP[i][0] - roll_back_obj.tableP[i][2];
    let cp2y = 2 * roll_back_obj.tableP[i][1] - roll_back_obj.tableP[i][3];
    dactx.bezierCurveTo(
      roll_back_obj.tableP[i - 1][2], roll_back_obj.tableP[i - 1][3],
      cp2x, cp2y,
      roll_back_obj.tableP[i][0], roll_back_obj.tableP[i][1]
    );
  }
  if (obj.want_if === 'stroke_path_with_line') {
    dactx.stroke();
  }
  if (obj.want_if === 'fill_in_with_line') {
    dactx.fill();
  }
  roll_back_obj.tableP = [];
  roll_back_obj.one_time_img = [];
  roll_back_obj.c_one_time = 0;
  value = dactx.getImageData(0, 0, dac.width, dac.height);
  add_canvas_to_roll_back_obj (value);
  return false;
};
function to_open_path (e) {
  while (roll_back_obj.c_one_time > 0) {
    roll_back_obj.tableP.pop();
    roll_back_obj.one_time_img.pop();
    roll_back_obj.c_one_time --;
  }
  if (roll_back_obj.tableP.length <= 0) {
    roll_back_obj.one_time_img = [];
    roll_back_obj.c_one_time = 0;
    return false;
  }
  let i = roll_back_obj.draw.length - 1;
  let value = roll_back_obj.draw[i - roll_back_obj.c_draw];
  if (value === 'null') {
    dactx.fillStyle = "white";
    dactx.fillRect(0, 0, dac.width, dac.height);
    open_path_finish();
  }
  if (value !== 'null') {
    roll_back_obj_url_value_into_canvas (value,open_path_finish);
  }
}
$('.advanced_tool .to_close_path').click((e) => {
  to_close_path (e);
});
$('.advanced_tool .to_open_path').click((e) => {
  to_open_path (e);
});
/*shortcuts for close_end_line_path & open_end_line_path
dac.addEventListener('click', shift_click_event,false);
dac.addEventListener('click', ctrl_click_event,false);
function shift_click_event(e){
  e.preventDefault;
  if ($('#stroke_path_with_line').prop('checked') || $('#fill_in_with_line').prop('checked')) {
    if(event.shiftKey) {
      $('.advanced_tool .to_close_path').click();
    }
  }
}
function ctrl_click_event(e){
  e.preventDefault;
  if ($('#stroke_path_with_line').prop('checked') || $('#fill_in_with_line').prop('checked')) {
    if(event.ctrlKey) {
      $('.advanced_tool .to_open_path').click();
    }
  }
}*/
/*ZoomUpDown action
function move_to_click_point(scale, left, top) {
  let target_html = '<div id="to_move_point" style="position:absolute;"></div>';
  if ($('#map_art').prop('checked')) {
    $('#map_art_canvas').append(target_html);
    $('#to_move_point').css('top', top);
    $('#to_move_point').css('left', left);
    $("#map_art_canvas").css("transform", "scale(" + scale + ")");
    let target = document.getElementById('to_move_point');
    target.scrollIntoView({ behavior: "auto", block: "center", inline: "center" });
  }
  if ($('#pixel_art').prop('checked')) {
    $('#pixel_art_canvas').append(target_html);
    $('#to_move_point').css('top', top);
    $('#to_move_point').css('left', left);
    $("#pixel_art_canvas").css("transform", "scale(" + scale + ")");
    let target = document.getElementById('to_move_point');
    target.scrollIntoView({ behavior: "auto", block: "center", inline: "center" });
  }
  if ($('#draw_art').prop('checked')) {
    $('#draw_art_canvas_frame').append(target_html);
    $('#to_move_point').css('top', top);
    $('#to_move_point').css('left', left);
    let target = document.getElementById('to_move_point');
    target.scrollIntoView({ behavior: "auto", block: "center", inline: "center" });
  }
  $('#to_move_point').remove();
}
function scope_action(scope, x, y) {
  let id = 'reset_stroke_path_with_line';
  toggle_radio_checked (id);
  let scale, left, top;
  if ($('#map_art').prop('checked')) {
    scale = $("#map_art_scale").val();
  }
  if ($('#pixel_art').prop('checked')) {
    scale = $("#pixel_art_scale").val();
  }
  if ($('#draw_art').prop('checked')) {
    scale = $("#draw_art_scale").val();
  }
  scale = Number(scale);
  if ($('#map_art').prop('checked') || $('#pixel_art').prop('checked')) {
    y = (100 * y) / scale;
    x = (100 * x) / scale;
  }
  if (scope === 'plus') {
    scale = scale * 1.1;
  }
  if (scope === 'minus') {
    scale = scale * 0.9;
  }
  scale = Math.round(scale);
  if ($('#map_art').prop('checked')) {
    $("#map_art_scale").val(scale);
  }
  if ($('#pixel_art').prop('checked')) {
    $("#pixel_art_scale").val(scale);
  }
  if ($('#draw_art').prop('checked')) {
    $("#draw_art_scale").val(scale);
  }
  scale = scale / 100;
  if ($('#map_art').prop('checked') || $('#pixel_art').prop('checked')) {
    move_to_click_point(scale, x, y);
  }
  if ($('#draw_art').prop('checked')) {
    let value = dactx.getImageData(0, 0, dac.width, dac.height);
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    c.width = dac.width;
    c.height = dac.height;
    ctx.putImageData(value, 0, 0);
    let url = c.toDataURL();
    img = new Image();
    img.src = url;
    img.onload = function (e) {
      dac.width = 600 * scale;
      dac.height = 600 * scale;
      dactx.drawImage(img, 0, 0, dac.width, dac.height);
      left = x - dac.getBoundingClientRect().left;
      top = y - dac.getBoundingClientRect().top;
      move_to_click_point(scale, left, top);
    };
  }
}
mac.addEventListener("mousedown", function (e) {
  if ($('#zoom_scope_button').prop('checked') && $('#plus_scope_icon').prop('checked')) {
    let x = e.clientX;
    let y = e.clientY;
    let scope = 'plus';
    scope_action(scope, x, y);
  }
  if ($('#zoom_scope_button').prop('checked') && $('#minus_scope_icon').prop('checked')) {
    let x = e.clientX;
    let y = e.clientY;
    let scope = 'minus';
    scope_action(scope, x, y);
  }
});
pac.addEventListener("mousedown", function (e) {
  if ($('#zoom_scope_button').prop('checked') && $('#plus_scope_icon').prop('checked')) {
    let x = e.clientX;
    let y = e.clientY;
    let scope = 'plus';
    scope_action(scope, x, y);
  }
  if ($('#zoom_scope_button').prop('checked') && $('#minus_scope_icon').prop('checked')) {
    let x = e.clientX;
    let y = e.clientY;
    let scope = 'minus';
    scope_action(scope, x, y);
  }
});
dac.addEventListener("mousedown", function (e) {
  if ($('#zoom_scope_button').prop('checked') && $('#plus_scope_icon').prop('checked')) {
    let x = e.clientX;
    let y = e.clientY;
    let scope = 'plus';
    scope_action(scope, x, y);
  }
  if ($('#zoom_scope_button').prop('checked') && $('#minus_scope_icon').prop('checked')) {
    let x = e.clientX;
    let y = e.clientY;
    let scope = 'minus';
    scope_action(scope, x, y);
  }
});
mac.addEventListener("touchstart", function (e) {
  if ($('#zoom_scope_button').prop('checked') && $('#plus_scope_icon').prop('checked')) {
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    let scope = 'plus';
    scope_action(scope, x, y);
  }
  if ($('#zoom_scope_button').prop('checked') && $('#minus_scope_icon').prop('checked')) {
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    let scope = 'minus';
    scope_action(scope, x, y);
  }
});
pac.addEventListener("touchstart", function (e) {
  if ($('#zoom_scope_button').prop('checked') && $('#plus_scope_icon').prop('checked')) {
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    let scope = 'plus';
    scope_action(scope, x, y);
  }
  if ($('#zoom_scope_button').prop('checked') && $('#minus_scope_icon').prop('checked')) {
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    let scope = 'minus';
    scope_action(scope, x, y);
  }
});
dac.addEventListener("touchstart", function (e) {
  if ($('#zoom_scope_button').prop('checked') && $('#plus_scope_icon').prop('checked')) {
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    let scope = 'plus';
    scope_action(scope, x, y);
  }
  if ($('#zoom_scope_button').prop('checked') && $('#minus_scope_icon').prop('checked')) {
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
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
$('#map_art_scale, #pixel_art_scale, #draw_art_scale').change((e) => {
  let id = 'reset_stroke_path_with_line';
  toggle_radio_checked (id);
  let scale, left, top;
  if ($('#map_art').prop('checked')) {
    scale = $("#map_art_scale").val();
  }
  if ($('#pixel_art').prop('checked')) {
    scale = $("#pixel_art_scale").val();
  }
  if ($('#draw_art').prop('checked')) {
    scale = $("#draw_art_scale").val();
  }
  scale = Number(scale);
  scale = scale / 100;
  if ($('#map_art').prop('checked')) {
    $("#map_art_canvas").css("transform", "scale(" + scale + ")");
    $('#zoom_scope_button').prop('checked', false);
  }
  if ($('#pixel_art').prop('checked')) {
    $("#pixel_art_canvas").css("transform", "scale(" + scale + ")");
    $('#zoom_scope_button').prop('checked', false);
  }
  if ($('#draw_art').prop('checked')) {
    let value = dactx.getImageData(0, 0, dac.width, dac.height);
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    c.width = dac.width;
    c.height = dac.height;
    ctx.putImageData(value, 0, 0);
    let url = c.toDataURL();
    img = new Image();
    img.src = url;
    img.onload = function (e) {
      dac.width = 600 * scale;
      dac.height = 600 * scale;
      dactx.drawImage(img, 0, 0, dac.width, dac.height);
      $('#zoom_scope_button').prop('checked', false);
    };
  }
});*/
/*++footer++*/
/*question_to_use*/
/*++language change++*/
function answer_to_questions_text (str) {
  $('#answer_to_questions').html(str);
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
  let str;
  if (click_id === 'check_view') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "キャンバスチェック用の縮小ラフ画像になります。"
      + "<br>ジャンプしたい場所をクリックすると目的の場所に画面がスクロールします。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "This is a reduced rough image of the canvas for checking."
      + "<br>Click on the location you want to jump to and the screen will scroll to the desired location.";
    }
  }
  if (click_id === 'pixel_art_size') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "ブロックのスキンを利用したピクセルアート用のサイズです。"
      + "<br>空白の場合は30×30を返します。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Size for pixel art using block skins."
      + "<br>If input has no value, it's returns 30 x 30.";
    }
  }
  if (click_id === 'download_datas_button') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "作成したマップアートとピクセルアートの設計図を返します。"
      + "<br>データは必要ブロック数とx,y座標が分かるエクセル、確認用のラフ画像をダウンロード出来ます。"
      + "<br>また、ロードに時間がかかりますが下のボタンをオンにするとブロックスキンありの確認用画像も表示出来ます。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Returns a blueprint of the map art and pixel art created."
      + "<br>Data can be downloaded in Excel showing the number of blocks required and x,y coordinates, and in a rough image for confirmation."
      + "<br>Also, it may take a while to load, but if you turn on the button below, you can see the image with the skin of the block.";
    }
  }
  if (click_id === 'map_art_size') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "マップで表示される色を基準にしたマップアート用のサイズです。"
      + "<br>処理のエラーを回避するため最大サイズは4×4の拡大レベル2までになります。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Size for map art based on the colors displayed on the map."
      + "<br>Maximum size is 4x4 with an enlargement level of 2 to avoid processing errors.";
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
  if (click_class === 'locked') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "色玉の色変更をロックしています。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Locked the color change of the colored boxes.";
    }
  }
  if (click_class === 'unlock') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "色玉の色変更が可能になっています。"
      + "<br>スポイトの使用に注意して下さい。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "The color of the colored boxes can be changed."
      + "<br>Use dropper carefully.";
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
  if (click_for === 'map_canvas_open_icon') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "新規色玉のマップアート用カラーを選択するモードに変更します。"
      + "<br>クリックするとパレットが縮小し、キャンバスがマイクラ地図画像専用の色吸い取りに変わります。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Change to the mode to select a new color for the map art."
      + "<br>Click to shrink the palette and changes the canvas to the picker of a new color dedicated to minecraft map images.";
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
      str = "Web Storage機能をご利用出来ない環境の方は、ここからtextデータの保存をお願いいたします。"
      + "<br>「下書き」もダウンロード出来ます。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "If you are unable to use the Web Storage function, please download your text data here."
      + '<br>And you can also download a "Draw Art".';
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
      str = "キャンバスのデータを一時保存します。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Save canvas data temporarily.";
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
function  question_obj_touch(e) {
  if (!$('#question_to_use').prop('checked')) {
    return true;
  }
  let x = e.touches[0].clientX;
  let y = e.touches[0].clientY;
  question_obj(x,y);
}
function  question_obj_mouse(e) {
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
      let key = 'unload_time';
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
      $.each(memory_obj, function(index, obj) {
        get_memorys_data['memoryObj_id' + i] = index;
        get_memorys_data['memoryObj_canvas' + i] = obj.canvas;
        get_memorys_data['memoryObj_data' + i] = obj.data;
        i++;
      })
      value_obj['top_menu_data'] = get_memorys_data;
      //color boxes of palette board cp
      value_obj['cp_html'] = $('#CP').html();
      //input sample_view rgb
      value_obj['ratio_r'] = $('#sample_ratio_r').val();
      value_obj['ratio_g'] = $('#sample_ratio_g').val();
      value_obj['ratio_b'] = $('#sample_ratio_b').val();
      //in storage
      let key = 'unload_time';
      setItem_in_localStorage (storage,key,value_obj);
    }
  }
  $('body').ready(function() {
    //load Storage
    let key = 'unload_time';
    let getData = return_obj_from_localStorage (storage,key);
    if (getData === '' || getData === null) {
      return false;
    }
    value_obj = getData;
    //storage button on or off
    if (getData['storage'] === 'off') {
      $('#auto_download_storage').prop('checked', false);
      remove_localStorage (storage,key);
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
        let canvas = get_obj['memoryObj_canvas' + i];
        let data = get_obj['memoryObj_data' + i];
        let value = {canvas: canvas, data: data};
        memory_obj[key] = value;
        i++;
      })
      //color boxes of palette board cp
      $('#CP').html('');
      $('#CP').append(getData['cp_html']);
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
