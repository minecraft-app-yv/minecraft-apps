/*++reserve objects++*/
let obj = { start_x: '', start_y: '', start_img: '',
$target: '', target_w: '', target_h: '', target_id: '', parent_class: '',
$icon: '', icon_top: '', icon_left: '',
use: '', pop_text: '', want_if: '',
td_x: '', tr_y: '', td_bgColor: '', copy_img: '', pulled_img: '',
bef_x: '', bef_y: '',
dl_img: '', dl_name: ''};
let memory_obj = {};
let roll_back_obj = {map: ['null'], pixel: ['null'], draw: ['null'], c_map: 0, c_pixel: 0, c_draw: 0,
tableP: [], one_time_img: [], c_one_time: 0};
/*++reserve functions++*/
function roll_back_obj_url_value_into_canvas (value_url,callback) {
  const dac = document.getElementById("draw_art_canvas");
  const dactx = dac.getContext("2d");
  img = new Image();
  img.src = value_url;
  img.onload = function (e) {
    let scale = $("#draw_art_scale").val();
    scale = Number(scale);
    scale = scale / 100;
    dac.width = 600 * scale;
    dac.height = 600 * scale;
    dactx.drawImage(img, 0, 0, dac.width, dac.height);
    callback();
  };
}
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
  if (roll_back_obj.tableP.length) {
    roll_back_obj.tableP = [];
    roll_back_obj.one_time_img = [];
    roll_back_obj.c_one_time = 0;
    let value = roll_back_obj.draw[roll_back_obj.draw.length - roll_back_obj.c_draw - 1];
    if (value === 'null') {
      dactx.fillStyle = "white";
      dactx.fillRect(0, 0, dac.width, dac.height);
    }
    if (value !== 'null') {
      let callback = function(){return true};
      roll_back_obj_url_value_into_canvas (value,callback);
    }
  }
  $.each(obj, function(index, value) {
    obj[index] = '';
  });
  array_match_cell = [];
  count = 0;
  //toggle_action
  if (id === 'reset_stroke_path_with_line') {
    $('#no_set_action').prop('checked', true);
  }
  if (id !== 'reset_stroke_path_with_line') {
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
}
function toggle_radio_at_area (id) {
  if ($('#' + id).prop('checked')) {
    setTimeout(() => {
      $('#' + id).prop('checked', false);
      $('input[name="rect_todo"]:not(#' + id + ')').prop('checked', true);
    }, "1")
  }
  if (!$('#' + id).prop('checked')) {
    return true;
  }
}
function return_img_html (palette_color_box_id) {
  let img = $("#" + palette_color_box_id + " .CPimg").find("img.mImg");
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
  let memory_amount = 30;
  if ($('#map_art').prop('checked')) {
    while (roll_back_obj.c_map > 0) {
      roll_back_obj.map.pop();
      roll_back_obj.c_map --;
    }
    if (roll_back_obj.map.length >= memory_amount) {
      roll_back_obj.map.shift();
    }
    roll_back_obj.c_map = 0;
    roll_back_obj.map.push(value);
  }
  if ($('#pixel_art').prop('checked')) {
    while (roll_back_obj.c_pixel > 0) {
      roll_back_obj.pixel.pop();
      roll_back_obj.c_pixel --;
    }
    if (roll_back_obj.pixel.length >= memory_amount) {
      roll_back_obj.pixel.shift();
    }
    roll_back_obj.c_pixel = 0;
    roll_back_obj.pixel.push(value);
  }
  if ($('#draw_art').prop('checked')) {
    while (roll_back_obj.c_draw > 0) {
      roll_back_obj.draw.pop();
      roll_back_obj.c_draw --;
    }
    if (roll_back_obj.draw.length >= memory_amount) {
      roll_back_obj.draw.shift();
    }
    roll_back_obj.c_draw = 0;
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    c.width = dac.width;
    c.height = dac.height;
    ctx.putImageData(value, 0, 0);
    let url = c.toDataURL();
    roll_back_obj.draw.push(url);
  }
}
function change_to_map_art (e) {
  $('.palette .palette_button .selected_block_img').css('display', 'none');
  $('#CP_icons .selected_block_img').css('display', 'none');
  $('.palette .palette_button i.fa-droplet').css('display', 'inline-block');
  $('#colorBox').css('display', 'inline-block');
  $('#no_set_action').click();
  if (obj.want_if === 'top_menu') {
    $('#change_to_map_art_data').click();
    $('#for_map_art_size').click();
    $('#pixel_art_canvas, #draw_art_canvas_frame').addClass('hidden');
    $('#map_art_canvas').removeClass('hidden');
    $('.advanced_tool .advanced_tool_button').css('display', 'none');
    $('#advanced_tool_button').prop('checked', false);
    $('#draw_art_to_pixels, #drag-and-drop-area p.draw_art_to_pixels').css('display', 'none');
    $('#map_art_scale').addClass('appear');
    $('#map_art_scale ~ label[for="map_art_scale"]').addClass('appear');
    $('#pixel_art_scale').removeClass('appear');
    $('#pixel_art_scale ~ label[for="pixel_art_scale"]').removeClass('appear');
    $('#draw_art_scale').removeClass('appear');
    $('#draw_art_scale ~ label[for="draw_art_scale"]').removeClass('appear');
  }
  if (obj.want_if === 'drag-and-drop-area') {
    $('#for_map_art_size').click();
    if (!$('#draw_art').prop('checked')) {
      $('#map_art').click();
      $('#pixel_art_canvas, #draw_art_canvas_frame').addClass('hidden');
      $('#map_art_canvas').removeClass('hidden');
      $('.advanced_tool .advanced_tool_button').css('display', 'none');
      $('#advanced_tool_button').prop('checked', false);
    }
  }
  if (obj.want_if === 'select_size') {
    $('#change_to_map_art_data').click();
    if (!$('#draw_art').prop('checked')) {
      $('#map_art').click();
      $('#pixel_art_canvas, #draw_art_canvas_frame').addClass('hidden');
      $('#map_art_canvas').removeClass('hidden');
      $('.advanced_tool .advanced_tool_button').css('display', 'none');
      $('#advanced_tool_button').prop('checked', false);
    }
  }
  if (obj.want_if === 'change_art_board') {
    $('#for_map_art_size').click();
    $('#change_to_map_art_data').click();
    if (!$('#draw_art').prop('checked')) {
      $('#map_art').click();
      $('#pixel_art_canvas, #draw_art_canvas_frame').addClass('hidden');
      $('#map_art_canvas').removeClass('hidden');
      $('.advanced_tool .advanced_tool_button').css('display', 'none');
      $('#advanced_tool_button').prop('checked', false);
    }
  }
}
function change_to_pixel_art (e) {
  $('.palette .palette_button .selected_block_img').css('display', 'inline-block');
  $('#CP_icons .selected_block_img').css('display', 'inline-block');
  $('.palette .palette_button i.fa-droplet').css('display', 'none');
  $('#colorBox').css('display', 'none');
  $('#no_set_action').click();
  if (obj.want_if === 'top_menu') {
    $('#change_to_pixel_art_data').click();
    $('#for_pixel_art_size').click();
    $('#map_art_canvas, #draw_art_canvas_frame').addClass('hidden');
    $('#pixel_art_canvas').removeClass('hidden');
    $('.advanced_tool .advanced_tool_button').css('display', 'none');
    $('#advanced_tool_button').prop('checked', false);
    $('#draw_art_to_pixels, #drag-and-drop-area p.draw_art_to_pixels').css('display', 'none');
    $('#map_art_scale').removeClass('appear');
    $('#map_art_scale ~ label[for="map_art_scale"]').removeClass('appear');
    $('#pixel_art_scale').addClass('appear');
    $('#pixel_art_scale ~ label[for="pixel_art_scale"]').addClass('appear');
    $('#draw_art_scale').removeClass('appear');
    $('#draw_art_scale ~ label[for="draw_art_scale"]').removeClass('appear');
  }
  if (obj.want_if === 'drag-and-drop-area') {
    $('#for_pixel_art_size').click();
    if (!$('#draw_art').prop('checked')) {
      $('#pixel_art').click();
      $('#map_art_canvas, #draw_art_canvas_frame').addClass('hidden');
      $('#pixel_art_canvas').removeClass('hidden');
      $('.advanced_tool .advanced_tool_button').css('display', 'none');
      $('#advanced_tool_button').prop('checked', false);
    }
  }
  if (obj.want_if === 'select_size') {
    $('#change_to_pixel_art_data').click();
    if (!$('#draw_art').prop('checked')) {
      $('#pixel_art').click();
      $('#map_art_canvas, #draw_art_canvas_frame').addClass('hidden');
      $('#pixel_art_canvas').removeClass('hidden');
      $('.advanced_tool .advanced_tool_button').css('display', 'none');
      $('#advanced_tool_button').prop('checked', false);
    }
  }
  if (obj.want_if === 'change_art_board') {
    $('#for_pixel_art_size').click();
    $('#change_to_pixel_art_data').click();
    if (!$('#draw_art').prop('checked')) {
      $('#pixel_art').click();
      $('#map_art_canvas, #draw_art_canvas_frame').addClass('hidden');
      $('#pixel_art_canvas').removeClass('hidden');
      $('.advanced_tool .advanced_tool_button').css('display', 'none');
      $('#advanced_tool_button').prop('checked', false);
    }
  }
}
function change_to_draw_art (e) {
  $('#no_set_action').click();
  if (obj.want_if === 'top_menu') {
    $('#map_art_canvas, #pixel_art_canvas').addClass('hidden');
    $('#draw_art_canvas_frame').removeClass('hidden');
    $('.advanced_tool .advanced_tool_button').css('display', 'block');
    $('#draw_art_to_pixels, #drag-and-drop-area p.draw_art_to_pixels').css('display', 'block');
    $('#map_art_scale').removeClass('appear');
    $('#map_art_scale ~ label[for="map_art_scale"]').removeClass('appear');
    $('#pixel_art_scale').removeClass('appear');
    $('#pixel_art_scale ~ label[for="pixel_art_scale"]').removeClass('appear');
    $('#draw_art_scale').addClass('appear');
    $('#draw_art_scale ~ label[for="draw_art_scale"]').addClass('appear');
  }
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
  $('#CP .CPimg').find('img').attr('crossorigin', 'anonymous');
  //drawSelf canvas background
  document.getElementById("draw_art_canvas").getContext("2d").fillStyle = "white";
  document.getElementById("draw_art_canvas").getContext("2d").fillRect(0, 0, dac.width, dac.height);
  //make pixel table
  let i = 0;
  let col = "";
  let colHead = '<th class="FirstBlank"></th>';
  while (i < 30) {
    colHead = colHead + '<th class="headCol"></th>';
    col = col + '<td class="x' + i + '"></td>';
    i = i + 1;
  }
  let j = 0;
  let table = "";
  while (j < 30) {
    table = table + '<tr class="y' + j + '"><th class="headRow"></th>' + col + "</tr>";
    j = j + 1;
  }
  $("#map_art_canvas thead").append('<tr></tr>');
  $("#map_art_canvas thead tr").html(colHead);
  $("#map_art_canvas tbody").html(table);
  $("#pixel_art_canvas thead").append('<tr></tr>');
  $("#pixel_art_canvas thead tr").html(colHead);
  $("#pixel_art_canvas tbody").html(table);
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
function return_for_memory_value (e) {
  let value;
  if ($('#pixel_art').prop('checked')) {
    let arry = [];
    $('#pixel_art_canvas td').each(function(index) {
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
        arry[tr_y][td_x] = jQuery("<div>").append(img.clone(true)).children().css('backgroundColor');
        return true;
      }
    });
    value = {canvas: 'pixel_art', data: arry};
  }
  if ($('#map_art').prop('checked')) {
    let arry = [];
    $('#map_art_canvas td').each(function(index) {
      let tr_y = $(this).parent().attr('class');
      let td_x = $(this).attr('class');
      tr_y = tr_y.substring(1);
      td_x = td_x.substring(1);
      tr_y = Number(tr_y);
      td_x = Number(td_x);
      if (!arry[tr_y]) {
        arry[tr_y] = [];
      }
      arry[tr_y][td_x] = $(this).css('backgroundColor');
    });
    value = {canvas: 'map_art', data: arry};
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
    $('#pixel_art_canvas').attr('data-fileName', '');
    if (name !== null) {
      $('#pixel_art_canvas').attr('data-fileName', name);
    }
    $('#pixel_art_size').val(value.data[0].length);
    $('.aside_menu label[for="for_pixel_art_size"]').click();
    //into canvas
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
    let colHead = '<tr><th class="FirstBlank"></th>';
    let table = '';
    let count = value.data[0].length;
    for (let y = 0; y < count; y++) {
      colHead = colHead + '<th class="headCol"></th>';
      let col_html = '';
      for (let x = 0; x < count; x++) {
        let imgColor = value.data[y][x];
        let index = palette_color.indexOf(imgColor);
        if (index < 0) {
          col_html += '<td class="x' + x + '"></td>';
          continue;
        }
        let img = palette_img[index];
        col_html += '<td class="x' + x + '">' + img + '</td>';
      }
      table = table + '<tr class="y' + y + '"><th class="headRow"></th>' + col_html + "</tr>";
    }
    colHead += '</tr>';
    $("#pixel_art_canvas thead").html(colHead);
    $("#pixel_art_canvas tbody").html(table);
    setTimeout((e) => {
      let roll_back = $('#pixel_art_canvas').html();
      add_canvas_to_roll_back_obj (roll_back);
    }, 1)
  }
  if (value.canvas === 'map_art' && $('#map_art').prop('checked')) {
    $('#map_art_canvas').attr('data-fileName', '');
    if (name !== null) {
      $('#map_art_canvas').attr('data-fileName', name);
    }
    $('#map_art_size').val(value.data[0].length);
    $('.aside_menu label[for="for_map_art_size"]').click();
    //into canvas
    let palette_color = [];
    $('#CP .CPrgb').each(function(index) {
      let imgColor = $(this).css('background-color');
      palette_color.push(imgColor);
    });
    let colHead = '<tr><th class="FirstBlank"></th>';
    let table = '';
    let count = value.data[0].length;
    for (let y = 0; y < count; y++) {
      colHead = colHead + '<th class="headCol"></th>';
      let col_html = '';
      for (let x = 0; x < count; x++) {
        let imgColor = value.data[y][x];
        let index = palette_color.indexOf(imgColor);
        if (index < 0) {
          col_html += '<td class="x' + x + '"></td>';
          continue;
        }
        col_html += '<td class="x' + x + '" style="background: ' + imgColor + ';"></td>';
      }
      table = table + '<tr class="y' + y + '"><th class="headRow"></th>' + col_html + "</tr>";
    }
    colHead += '</tr>';
    $("#map_art_canvas thead").html(colHead);
    $("#map_art_canvas tbody").html(table);
    setTimeout((e) => {
      let roll_back = $('#map_art_canvas').html();
      add_canvas_to_roll_back_obj (roll_back);
    }, 1)
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
      setTimeout((e) => {
        let roll_back = dactx.getImageData(0, 0, dac.width, dac.height);
        add_canvas_to_roll_back_obj (roll_back);
      }, 1)
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
  let have_memory = $('#' + target_id).attr('data-check');
  if (target_id === undefined || target_id === '' || have_memory !== 'checked') {
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
    getStr = getStr + "_split_";
    for (let y = 0; y < value.data.length; y++) {
      for (let x = 0; x < value.data[0].length; x++) {
        let color = value.data[y][x];
        if (color === '' || color === undefined) {
          getStr = getStr + "_col_";
          continue;
        }
        let rgb = color.split("rgb(").slice(1);
        rgb = rgb[0].replace(")", "");
        rgb = rgb[0].replaceAll(" ", "");
        rgb = rgb.split(",");
        getStr = getStr + "_r_" + rgb[0] + "_r_" + "_g_" + rgb[1] + "_g_" + "_b_" + rgb[2] + "_b_";
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
  reader.onload = () => {
    let upText = reader.result;
    upText = return_str_escape_html(upText);
    upText = upText.split("_split_");
    let canvas_style = upText[0];
    canvas_style = canvas_style.split("_canvas_").slice(1, 2);
    canvas_style = canvas_style[0];
    let html = '';
    let arry = [];
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
        table[i].pop();
      }
      table.forEach((row, y) => {
        row.forEach((col, x) => {
          if (!arry[y]) {
            arry[y] = [];
          }
          if (table[y][x] === '') {
            arry[y][x] = '';
            return true;
          }
          table[y][x] = table[y][x].replaceAll(" ", "");
          let r = table[y][x].split("_r_").slice(1, 2);
          let g = table[y][x].split("_g_").slice(1, 2);
          let b = table[y][x].split("_b_").slice(1, 2);
          if (r == '255' && g == '255' && b == '255') {
            arry[y][x] = '';
            return true;
          }
          arry[y][x] = 'rgb(' + r + ", " + g + ", " + b + ')';
        });
      });
      html = arry;
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
/*change canvas action*/
$('#map_art ~ li').click((e) => {
  obj.want_if = 'top_menu';
  change_to_map_art (e);
});
$('#pixel_art ~ li').click((e) => {
  obj.want_if = 'top_menu';
  change_to_pixel_art (e);
});
$('#draw_art ~ li').click((e) => {
  obj.want_if = 'top_menu';
  change_to_draw_art (e)
});
$('#change_to_map_art_data ~ span').click((e) => {
  obj.want_if = 'drag-and-drop-area';
  change_to_map_art (e);
});
$('#change_to_pixel_art_data ~ span').click((e) => {
  obj.want_if = 'drag-and-drop-area';
  change_to_pixel_art (e);
});
$('.input_forms .for_map_art_size').click((e) => {
  obj.want_if = 'select_size';
  change_to_map_art (e);
});
$('.input_forms .for_pixel_art_size').click((e) => {
  obj.want_if = 'select_size';
  change_to_pixel_art (e);
});
$('#CP_icons .CP_icons_form .change_art_board').click((e) => {
  obj.want_if = 'change_art_board';
  if ($('#change_to_map_art_data').prop('checked')) {
    change_to_pixel_art (e);
    return true;
  }
  if ($('#change_to_pixel_art_data').prop('checked')) {
    change_to_map_art (e);
    return true;
  }
});
function cell_defaulting (id) {
  let i = 0;
  let col = "";
  let colHead = '<th class="FirstBlank"></th>';
  while (i < 30) {
    colHead = colHead + '<th class="headCol"></th>';
    col = col + '<td class="x' + i + '"></td>';
    i = i + 1;
  }
  let j = 0;
  let table = "";
  while (j < 30) {
    table = table + '<tr class="y' + j + '"><th class="headRow"></th>' + col + "</tr>";
    j = j + 1;
  }
  $('#' + id + ' thead tr').html(colHead);
  $('#' + id + ' tbody').html(table);
}
$('input[name="display"]').change((e) => {
  let canvas = $('input[name="display"]:checked').val();
  /**/
  if (canvas === 'map_art') {
    //select canvas in to data
    let key = 'map_art';
    let data_obj = memory_obj[key];
    delete memory_obj[key];
    if (data_obj) {
      $('#map_art_canvas').html(data_obj.data);
      $('#map_art_canvas').attr('data-fileName', data_obj.fileName);
    }
    //pre canvas get data
    key = 'pixel_art';
    data_obj = memory_obj[key];
    if (data_obj === undefined) {
      let data = $('#pixel_art_canvas').html();
      let fileName = $('#pixel_art_canvas').attr('data-fileName');
      memory_obj[key] = {data: data, fileName: fileName};
      let id = 'pixel_art_canvas';
      cell_defaulting (id);
    }
  }
  if (canvas === 'pixel_art') {
    //select canvas in to data
    let key = 'pixel_art';
    let data_obj = memory_obj[key];
    delete memory_obj[key];
    if (data_obj) {
      $('#pixel_art_canvas').html(data_obj.data);
      $('#pixel_art_canvas').attr('data-fileName', data_obj.fileName);
    }
    //pre canvas get data
    key = 'map_art';
    data_obj = memory_obj[key];
    if (data_obj === undefined) {
      let data = $('#map_art_canvas').html();
      let fileName = $('#map_art_canvas').attr('data-fileName');
      memory_obj[key] = {data: data, fileName: fileName};
      let id = 'map_art_canvas';
      cell_defaulting (id);
    }
  }
});
/*++aside++*/
//change select size views
$('.get_bata').click(function() {
  let select_id = $(this).parent().parent().attr('class');
  select_id = '#' + select_id;
  $(select_id).prop('checked', true);
});
$('#check_view_button').click(function(){
  $('#check_view_button').removeClass('first_try');
});
//retouch 512px sizes for pixel_art
$('aside .for_pixel_art_size input.get_bata').change(function () {
  let px = $(this).val();
  if (px > 512) {
    $(this).val("512");
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
//check_view display
const cvc = document.getElementById("check_view");
const cvctx = cvc.getContext("2d");
let check_view_fun = function (e) {
  $('#check_view').css('display', 'block');
  if ($('#draw_art').prop('checked')) {
    let name = $('#draw_art_canvas').attr('data-fileName');
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
    cvctx.drawImage(dac, 0, 0, dac.width, dac.height, 0, 0, 171, 171);
  }
  if (!$('#draw_art').prop('checked')) {
    cvctx.clearRect(0, 0, cvc.width, cvc.height);
    const oc = document.createElement("canvas");
    const octx = oc.getContext("2d");
    let w, h, name, nL;
    if ($('#map_art').prop('checked')) {
      w = $("#map_art_canvas thead").find("th").length - 1;
      h = $("#map_art_canvas tbody").find("tr").length;
      name = $('#map_art_canvas').attr('data-fileName');
      nL = name.length;
    }
    if ($('#pixel_art').prop('checked')) {
      w = $("#pixel_art_canvas thead").find("th").length - 1;
      h = $("#pixel_art_canvas tbody").find("tr").length;
      name = $('#pixel_art_canvas').attr('data-fileName');
      nL = name.length;
    }
    oc.width = w;
    oc.height = h;
    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        let rgba;
        if ($('#map_art').prop('checked')) {
          rgba = $("#map_art_canvas tbody tr.y" + i + " td.x" + j).css("background-color");
          octx.fillStyle = rgba;
          octx.fillRect(j, i, 1, 1);
        }
        if ($('#pixel_art').prop('checked')) {
          let $imgMImg = $("#pixel_art_canvas tbody tr.y" + i + " td.x" + j).find("img.mImg");
          if ($imgMImg.length) {
            rgba = $("#pixel_art_canvas tbody tr.y" + i + " td.x" + j).find("img.mImg").css("background-color");
            octx.fillStyle = rgba;
            octx.fillRect(j, i, 1, 1);
          } else {
            continue;
          }
        }
      }
    }
    cvctx.drawImage(oc, 0, 0, oc.width, oc.height, 0, 0, 171, 171);
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
  }
};
$('#check_view_button').click((e) => {
  e.preventDefault();
  $('#wait').removeClass('hidden');
  setTimeout(() => {
    check_view_fun(e);
    $('#wait').addClass('hidden');
  }, "500")
});
//canvas to move check_view point
function canvas_to_move_check_view_point(e) {
  let x,y,top,left, canvas_size;
  let min_map_size = 171;
  let target_html = '<div id="to_move_point" style="position:absolute;"></div>';
  if ($('#pixel_art').prop('checked')) {
    $('#pixel_art_canvas').append(target_html);
    canvas_size = $('#pixel_art_canvas').width();
  }
  if ($('#map_art').prop('checked')) {
    $('#map_art_canvas').append(target_html);
    canvas_size = $('#map_art_canvas').width();
  }
  if ($('#draw_art').prop('checked')) {
    $('#draw_art_canvas_frame').append(target_html);
    canvas_size = $('#draw_art_canvas_frame').width();
  }
  if (obj.use === 'mouse') {
    x = e.clientX - cvc.getBoundingClientRect().left;
    y = e.clientY - cvc.getBoundingClientRect().top;
  }
  if (obj.use === 'touch') {
    x = e.touches[0].clientX - cvc.getBoundingClientRect().left;
    y = e.touches[0].clientY - cvc.getBoundingClientRect().top;
  }
  top = y * (canvas_size / min_map_size);
  left = x * (canvas_size / min_map_size);
  $('#to_move_point').css('top', top);
  $('#to_move_point').css('left', left);
  let target = document.getElementById('to_move_point');
  target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  $('#to_move_point').remove();
}
cvc.addEventListener('mousedown', (e) => {
  obj.use = 'mouse';
  canvas_to_move_check_view_point(e);
});
cvc.addEventListener('touchstart', (e) => {
  obj.use = 'touch';
  canvas_to_move_check_view_point(e);
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
      src = $("#" + id + " .CPimg").find("img.mImg").attr("src");
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
      alt = $("#" + id + " .CPimg").find("img.mImg").attr("alt");
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
      let rgb = $(point).find("img.mImg").css("background-color");
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
  $("#CP .CPrgb").parent().each(function (index) {
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
//instole map data
const cpc = document.getElementById("color_pick_map_canvas");
const cpctx = cpc.getContext("2d");
function create_color_pick_map(image) {
  cpctx.clearRect(0, 0, cpc.width, cpc.height);
  let imgH = image.height;
  let imgW = image.width;
  let px = 1280;
  let py = 1280;
  if (imgH >= imgW) {
    py = (1280 * imgH) / imgW;
  } else {
    px = (1280 * imgW) / imgH;
  }
  cpc.width = px;
  cpc.height = py;
  cpctx.fillStyle = "rgb(255, 255, 255)";
  cpctx.fillRect(0, 0, px, py);
  cpctx.drawImage(image, 0, 0, imgW, imgH, 0, 0, px, py);
}
const pick_map_previewAndInsert = (files) => {
  let file = files[0];
  if (file === undefined) {
    $('#wait').addClass('hidden');
    return false;
  }
  let reader = new FileReader();
  let image = new Image();
  image.crossOrigin = "anonymous";
  reader.onload = function (evt) {
    image.onload = function () {
      create_color_pick_map(image);
      $('#color_pick_map_input').val('');
      $('#color_pick_map_drag-and-drop-area').css('display', 'none');
      $('#wait').addClass('hidden');
    };
    image.src = evt.target.result;
  };
  reader.readAsDataURL(file);
}
document.querySelector('#color_pick_map_button').addEventListener('click', (ele) => {
  document.getElementById('color_pick_map_input').click();
});
document.getElementById('color_pick_map_input').addEventListener('change', (event) => {
  $('#wait').removeClass('hidden');
  const files = event.target.files;
  if (files.length > 0) {
    pick_map_previewAndInsert(files);
  }
  event.target.files = null;
  event.target.value = null;
});
const pick_map_dragAndDropArea = document.getElementById('color_pick_map_drag-and-drop-area');
pick_map_dragAndDropArea.addEventListener('dragover', (event) => {
  pick_map_dragAndDropArea.classList.add('active');
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
});
pick_map_dragAndDropArea.addEventListener('dragleave', (event) => {
  pick_map_dragAndDropArea.classList.remove('active');
});
pick_map_dragAndDropArea.addEventListener('drop', (event) => {
  $('#wait').removeClass('hidden');
  event.preventDefault();
  pick_map_dragAndDropArea.classList.remove('active');
  const files = event.dataTransfer.files;
  if (files.length === 0) {
    return false;
  }
  if (!files[0].type.match(/image\/*/)) {
    return false;
  }
  pick_map_previewAndInsert(files);
});
//use dropper tool
//https://cly7796.net/blog/javascript/changing-the-color-format-with-javascript/
function all_removeEL_at_pick (e) {
  $("#color_dropper_icon").prop('checked', false);
  cpc.style.cursor = 'default';
  document.removeEventListener('mousemove', handleTouchMove, { passive: false });
  cpc.removeEventListener('mousemove', color_pick_action_onmouse);
  cpc.removeEventListener('mousedown', color_pick_up);
  document.removeEventListener('touchmove', handleTouchMove, { passive: false });
  cpc.removeEventListener('touchmove', color_pick_action_ontouch);
  cpc.removeEventListener('touchend', color_pick_up);
}
function reset_rgb_to_check_color_box(e) {
  let id = $("#CP label.check").attr("id");
  let rgb = $("#" + id).children(".CPrgb").css("background-color");
  rgb = rgb_to_return_array_rgb (rgb);
  $("#CP_icons .rgb .rgbR").text(rgb[0]);
  $("#CP_icons .rgb .rgbG").text(rgb[1]);
  $("#CP_icons .rgb .rgbB").text(rgb[2]);
  let R = ("0" + parseInt(rgb[0]).toString(16)).slice(-2);
  let G = ("0" + parseInt(rgb[1]).toString(16)).slice(-2);
  let B = ("0" + parseInt(rgb[2]).toString(16)).slice(-2);
  let bgCcode = "#" + R + G + B;
  $("#colorBox").val(bgCcode);
}
function color_pick_up(e) {
  let x = obj.bef_x;
  let y = obj.bef_y;
  let pixel = cpctx.getImageData(x, y, 1, 1);
  let data = pixel.data;
  all_removeEL_at_pick (e);
  if ($("#palette_lock").prop('checked')) {
    reset_rgb_to_check_color_box(e);
    all_removeEL_at_pick (e);
    return false;
  }
  if (!$("#palette_lock").prop('checked')) {
    let id = $("#CP label.check").attr("id");
    const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    $("#" + id).children(".CPrgb").css("background-color", rgb);
    all_removeEL_at_pick (e);
    return false;
  }
}
function search_map_colors(x,y) {
  let pixel = cpctx.getImageData(x, y, 1, 1);
  let data = pixel.data;
  $("#CP_icons .rgb .rgbR").text(data[0]);
  $("#CP_icons .rgb .rgbG").text(data[1]);
  $("#CP_icons .rgb .rgbB").text(data[2]);
  let R = ("0" + parseInt(data[0]).toString(16)).slice(-2);
  let G = ("0" + parseInt(data[1]).toString(16)).slice(-2);
  let B = ("0" + parseInt(data[2]).toString(16)).slice(-2);
  let bgCcode = "#" + R + G + B;
  $("#colorBox").val(bgCcode);
  obj.bef_x = x;
  obj.bef_y = y;
}
function color_pick_action_onmouse (e) {
  x = e.offsetX;
  y = e.offsetY;
  search_map_colors(x,y);
}
function color_pick_action_ontouch (e) {
  x = e.touches[0].clientX - cpc.getBoundingClientRect().left;
  y = e.touches[0].clientY - cpc.getBoundingClientRect().top;
  search_map_colors(x,y);
}
function color_pick_from_colorBox(e) {
  let colorcode = colorBox.value;
  let obj_rgb = hex_to_return_obj_rgb (colorcode);
  all_removeEL_at_pick (e);
  if ($("#draw_art").prop('checked')) {
    $("#CP_icons .rgb .rgbR").text(obj_rgb.r);
    $("#CP_icons .rgb .rgbG").text(obj_rgb.g);
    $("#CP_icons .rgb .rgbB").text(obj_rgb.b);
  }
  if ($("#palette_lock").prop('checked') && !$("#draw_art").prop('checked')) {
    reset_rgb_to_check_color_box(e);
    return false;
  }
  if (!$("#palette_lock").prop('checked')) {
    let id = $("#CP label.check").attr("id");
    $("#" + id).children(".CPrgb").css("background-color", colorcode);
    return false;
  }
}
$('#colorBox').change((e) => {
  color_pick_from_colorBox(e);
});
$('#color_dropper_icon').change((e) => {
  if (!$('#color_dropper_icon').prop('checked')) {
    reset_rgb_to_check_color_box(e);
    return false;
  }
  if ($('#color_dropper_icon').prop('checked') && $('#map_canvas_open_icon').prop('checked')) {
    cpc.style.cursor = 'pointer';
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
    cpc.addEventListener('mousemove', color_pick_action_onmouse);
    cpc.addEventListener('mousedown', color_pick_up);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    cpc.addEventListener('touchmove', color_pick_action_ontouch);
    cpc.addEventListener('touchend', color_pick_up);
  }
});
//all removeEventListener at window remove
document.addEventListener('beforeunload', all_removeEL_at_pick);
document.addEventListener('mouseleave', all_removeEL_at_pick);
//remove_CP_boxes
$('#CP_icons .CP_icons_form button.remove_CP_box').click((e) => {
  let target_class = $('#CP label.check').parent().attr('class');
  if (target_class === 'color_named_blocks') {
    return false;
  }
  $('#CP label.check').remove();
  $("#CP .CPrgb").each(function (index) {
    index ++;
    $(this).parent().attr('id', 'CP' + index);
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
      let str = '<label id="CP' + cp_L + '"><div class="CPrgb"></div><div class="CPimg"></div></label>';
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
          //$("#CP" + cp_L).addClass("check");
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
  let cp_L = $("#CP .CPrgb").length;
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
  let select_rgb = $("#" + id + " .CPrgb").css("backgroundColor").toString();
  let select_img = $("#" + id + " .CPimg img.mImg");
  let img_html = return_img_html (id);
  let array_rgb = rgb_to_return_array_rgb (select_rgb);
  let text_hex = rgb_to_return_text_hex (array_rgb);
  $('.palette .palette_button > i').css('color', select_rgb);
  $("#colorBox").val(text_hex);
  $('.palette .palette_button .selected_block_img, #CP_icons .selected_block_img').html(img_html);
  $("#CP_icons span.rgbR").text(array_rgb[0].slice(-3));
  $("#CP_icons span.rgbG").text(array_rgb[1].slice(-3));
  $("#CP_icons span.rgbB").text(array_rgb[2].slice(-3));
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
$("#CP .CPrgb").each(function (index) {
  $(this).parent().on('mousedown', selected_color_box_use_mouse);
  $(this).parent().on('touchstart', selected_color_box_use_touch);
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
  $("#CP .CPrgb").each(function (index) {
    $(this).parent().off('mousedown touchstart');
  });
  //input
  $('#CP .add_new_blocks button').on('click', (e) => {
    $('#new_block_img').click();
  });
  $('#new_block_img').on('change', (e) => {
    let cp_L = $("#CP .CPrgb").length;
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
  $("#CP .CPrgb").each(function (index) {
    $(this).parent().on('mousedown', selected_color_box_use_mouse);
    $(this).parent().on('touchstart', selected_color_box_use_touch);
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
//toggle radio checked action advanced_tool
$('.advanced_tool > label:not(label[for="advanced_tool_button"], label[for="line_bold_for_draw"])').click(function (e) {
  let id = $(this).attr('for');
  toggle_radio_checked (id);
});
//toggle radio checked action rect_todo
$('.advanced_tool .sub_advanced_tool > label').click((e) => {
  let id = $('.advanced_tool .sub_advanced_tool > label:hover').attr('for');
  toggle_radio_at_area (id);
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
//pop up explain of sub_advanced_tool
$('.advanced_tool .sub_advanced_tool .to_close_path, .advanced_tool .sub_advanced_tool .to_open_path').on('mouseenter', function(e) {
  obj.pop_text = $(this).children('span.shortcut').text();
  obj.use = 'mouse';
  pop_text_at_hover (e);
});
$('.advanced_tool .sub_advanced_tool .to_close_path, .advanced_tool .sub_advanced_tool .to_open_path').on('mouseleave', function(e) {
  $('#CP_img_explanation').remove();
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
tool_icons_selecters = tool_icons_selecters + ', .zoom_in_out_scope .zoom_scope_button > i';
tool_icons_selecters = tool_icons_selecters + ', .normal_tool .normal_tool_button > i';
tool_icons_selecters = tool_icons_selecters + ', .roll_back_and_forward .roll_both_button > i';
tool_icons_selecters = tool_icons_selecters + ', .advanced_tool .advanced_tool_button > i';
tool_icons_selecters = tool_icons_selecters + ', .palette .palette_button > .selected_block_img';
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
  if (button_class === 'advanced_tool_button') {
    $icon = $('.advanced_tool');
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
const color_pick = document.querySelector('#color_pick_map');
const observer_pick_map = new MutationObserver(function() {
  const width = color_pick.getBoundingClientRect().width;
  const height = color_pick.getBoundingClientRect().height;
  if (height >= 900) {
    let h = height + 300;
    $('main').css('height', h);
  }
  if (height < 900) {
    $('main').css('height', 1000);
  }
});
observer_pick_map.observe(color_pick, {attributes: true});
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
    $("#CP .CPrgb").each(function (index) {
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
    $("#CP .CPrgb").each(function (index) {
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
    $("#CP .CPrgb").each(function (index) {
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
    $("#CP .CPrgb").each(function (index) {
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
/*draw_art_to_pixels*/
function draw_art_to_pixels(e) {
  let px;
  if ($('#change_to_pixel_art_data').prop('checked')) {
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
  if ($("#change_to_map_art_data").prop('checked')) {
    px = $('#map_art_size').val();
  }
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
  if ($("#change_to_map_art_data").prop('checked')) {
    $("#map_art_canvas thead tr").html(colHead);
    $("#map_art_canvas tbody").html(table);
  }
  if ($('#change_to_pixel_art_data').prop('checked')) {
    $("#pixel_art_canvas thead tr").html(colHead);
    $("#pixel_art_canvas tbody").html(table);
  }
  const palette = [];
  const paletteId = [];
  if ($("#change_to_map_art_data").prop('checked')) {
    $("#CP .CPrgb").each(function (index) {
      let bgColor = $(this).css("backgroundColor").toString();
      let result = bgColor.split(",");
      if (result >= 4) {
        return true;
      } else {
        palette.push(bgColor);
      }
    });
  }
  if ($("#change_to_pixel_art_data").prop('checked')) {
    $("#CP .CPrgb").each(function (index) {
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
    });
  }
  let sc = 600 / px;
  for (let i = 0; i < px; i++) {
    for (let j = 0; j < px; j++) {
      let pixel = dactx.getImageData(j * sc, i * sc, 1, 1);
      let data = pixel.data;
      const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
      if ($("#change_to_map_art_data").prop('checked')) {
        let choosergb = chooseColor_at_draw_to_pixels(palette, rgb);
        if (choosergb === "empty") {
          continue;
        }
        if (choosergb !== "empty") {
          $("#map_art_canvas tbody tr.y" + i + " td.x" + j).css("background", choosergb);
        }
      }
      if ($("#change_to_pixel_art_data").prop('checked')) {
        let choosergb = chooseColor_at_draw_to_pixels(palette, rgb);
        if (choosergb === "empty") {
          continue;
        }
        if (choosergb !== "empty") {
          let chooseBlock = chooseImg(paletteId, palette, choosergb);
          $("#pixel_art_canvas tbody tr.y" + i + " td.x" + j).html(chooseBlock);
        }
      }
    }
  }
}
$('#draw_art_to_pixels').click((e) => {
  $('#wait').removeClass('hidden');
  e.preventDefault();
  draw_art_to_pixels(e);
  $('#drag-and-drop-area').css('display', 'none');
  $('#wait').addClass('hidden');
});
//close_button
$('.close_button').click((e) => {
  let close_target_id = $('.close_button:hover').attr('data-close-id');
  $('#' + close_target_id).css('display', 'none');
});
/*map art editing*/
const mac = document.getElementById("map_art_canvas");
const pac = document.getElementById("pixel_art_canvas");
const dac = document.getElementById("draw_art_canvas");
const dactx = dac.getContext("2d");
let array_match_cell = [];
let count = 0;
function all_removeEventListener (e) {
  document.removeEventListener('mousemove', handleTouchMove, { passive: false });
  mac.removeEventListener('mousemove', choose_fun);
  pac.removeEventListener('mousemove', choose_fun);
  dac.removeEventListener('mousemove', choose_fun);
  document.removeEventListener('mouseup', rect_FirstUp);
  document.removeEventListener('mouseup', rect_SecondUp);
  document.removeEventListener("touchstart", handleTouchMove, { passive: false });
  document.removeEventListener("touchmove", handleTouchMove, { passive: false });
  mac.removeEventListener("touchmove", choose_fun);
  pac.removeEventListener("touchmove", choose_fun);
  dac.removeEventListener("touchmove", choose_fun);
  document.removeEventListener("touchend", rect_FirstUp);
  document.removeEventListener("touchend", rect_SecondUp);
}
function get_strokeStyle_at_path (e) {
  if ($("#change_to_map_art_data").prop('checked')) {
    dactx.strokeStyle = $('#colorBox').val();
  }
  if ($("#change_to_pixel_art_data").prop('checked')) {
    let $img = $('.palette .palette_button .selected_block_img').find("img.mImg");
    if ($img.length) {
      dactx.strokeStyle = $img.css("background-color");
    }
    if ($img.length <= 0) {
      return false;
    }
  }
  dactx.lineWidth = $("#line_bold_for_draw").val();
  dactx.lineCap = "round";
}
function get_fillStyle_at_fill(e) {
  if ($('#for_cut_area').prop('checked')) {
    dactx.fillStyle = "white";
  }
  if ($("#change_to_map_art_data").prop('checked') && !$('#for_cut_area').prop('checked')) {
    dactx.fillStyle = $('#colorBox').val();
  }
  if ($("#change_to_pixel_art_data").prop('checked') && !$('#for_cut_area').prop('checked')) {
    let $img = $('.palette .palette_button .selected_block_img').find("img.mImg");
    if ($img.length) {
      dactx.fillStyle = $img.css("background-color");
    }
    if ($img.length <= 0) {
      return false;
    }
  }
  dactx.strokeStyle = "black";
  dactx.lineWidth = 1;
  dactx.lineCap = "round";
}
function prepare_ctx_data (e) {
  if (obj.want_if === 'pen_tool'
  || obj.want_if === 'stroke_path_with_rect'
  || obj.want_if === 'stroke_path_with_line'
  || obj.want_if === 'stroke_path_with_arc') {
    get_strokeStyle_at_path (e);
  }
  if (obj.want_if === 'eraser_points_tool') {
    dactx.strokeStyle = "white";
    dactx.lineWidth = $("#line_bold_for_draw").val();
    dactx.lineCap = "round";
  }
  if (obj.want_if === 'fill_in_with_line'
  || obj.want_if === 'fill_in_with_rect'
  || obj.want_if === 'fill_in_with_arc') {
    get_fillStyle_at_fill(e);
  }
  if (obj.want_if === 'copy_area_with_rect'
  || obj.want_if === 'resize_area_with_rect'
  || obj.want_if === 'roll_area_with_rect') {
    dactx.strokeStyle = "black";
    dactx.lineWidth = 1;
  }
}
function get_picked_colorBox_from_id(id) {
  $("#CP *").removeClass("check");
  $("#" + id).addClass("check");
  //pick color display
  let select_rgb = $("#" + id + " .CPrgb").css("backgroundColor").toString();
  let select_img = $("#" + id + " .CPimg img.mImg")
  let img_html = return_img_html (id);
  let array_rgb = rgb_to_return_array_rgb (select_rgb);
  let text_hex = rgb_to_return_text_hex (array_rgb);
  $('.palette .palette_button > i').css('color', select_rgb);
  $("#colorBox").val(text_hex);
  $('.palette .palette_button .selected_block_img, #CP_icons .selected_block_img').html(img_html);
  $("#CP_icons span.rgbR").text(array_rgb[0].slice(-3));
  $("#CP_icons span.rgbG").text(array_rgb[1].slice(-3));
  $("#CP_icons span.rgbB").text(array_rgb[2].slice(-3));
}
function color_dropper_icon(e) {
  let catch_color;
  if ($('#map_art').prop('checked') || $('#pixel_art').prop('checked')) {
    td_xy_bgColor_in_obj (obj.start_x, obj.start_y);
    catch_color = obj.td_bgColor;
  }
  if ($('#draw_art').prop('checked')) {
    let x = obj.start_x;
    let y = obj.start_y;
    let pixel = dactx.getImageData(x, y, 1, 1);
    let data = pixel.data;
    catch_color = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
  }
  const palette_map = [];
  const palette_map_id = [];
  const palette_pixel = [];
  const palette_pixel_id = [];
  $("#CP .CPrgb").each(function (index) {
    let id = $(this).parent().attr('id');
    let bgColor = $(this).css("backgroundColor").toString();
    let result = bgColor.split(",");
    if (result >= 4) {
      return true;
    } else {
      palette_map.push(bgColor);
      palette_map_id.push(id);
    }
  });
  $("#CP .CPrgb").each(function (index) {
    let id = $(this).parent().attr('id');
    let disL = $('#' + id + ' .CPimg').find("img").length;
    if (disL <= 0) {
      return true;
    }
    if (disL > 1) {
      for (let j = 1; j <= disL; j++) {
        let imgColor = $('#' + id + ' .CPimg').children("img.dis" + j).css("backgroundColor").toString();
        palette_pixel.push(imgColor);
        let pId = id + "/dis" + j;
        palette_pixel_id.push(pId);
      }
    }
    if (disL == 1) {
      let imgColor = $('#' + id + ' .CPimg').children("img").css("backgroundColor").toString();
      palette_pixel.push(imgColor);
      palette_pixel_id.push(id);
    }
  });
  if ($('#map_art').prop('checked')) {
    let map_key = palette_map.indexOf(catch_color);
    if (map_key < 0) {
      return false;
    }
    if (map_key >= 0) {
      let id = palette_map_id[map_key];
      get_picked_colorBox_from_id(id);
    }
  }
  if ($('#pixel_art').prop('checked')) {
    let pixel_key = palette_pixel.indexOf(catch_color);
    if (pixel_key < 0) {
      return false;
    }
    if (pixel_key >= 0) {
      let id = palette_pixel_id[pixel_key];
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
  if ($('#draw_art').prop('checked')) {
    map_key = palette_map.indexOf(catch_color);
    pixel_key = palette_pixel.indexOf(catch_color);
    if (map_key < 0 && pixel_key < 0) {
      return false;
    }
    if (map_key >= 0) {
      let id = palette_map_id[map_key];
      get_picked_colorBox_from_id(id);
    }
    else if (pixel_key >= 0) {
      let id = palette_pixel_id[pixel_key];
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
}
function end_fun (e) {
  all_removeEventListener ();
  let value;
  if (obj.use === 'mouse_at_map_art' || obj.use === 'touch_at_map_art') {
    value = $('#map_art_canvas').html();
    add_canvas_to_roll_back_obj (value);
  }
  if (obj.use === 'mouse_at_pixel_art' || obj.use === 'touch_at_pixel_art') {
    value = $('#pixel_art_canvas').html();
    add_canvas_to_roll_back_obj (value);
  }
  if (obj.use === 'mouse_at_draw_art' || obj.use === 'touch_at_draw_art') {
    if (obj.want_if === 'stroke_path_with_line' || obj.want_if === 'fill_in_with_line') {
      let move_x, move_y;
      if (obj.use === 'mouse_at_draw_art') {
        move_x = e.clientX - dac.getBoundingClientRect().left;
        move_y = e.clientY - dac.getBoundingClientRect().top;
      }
      if (obj.use === 'touch_at_draw_art') {
        move_x = obj.bef_x;
        move_y = obj.bef_y;
      }
      let before_x, before_y, cp1x, cp1y;
      let cp2x = 2 * obj.start_x - move_x;
      let cp2y = 2 * obj.start_y - move_y;
      if (roll_back_obj.tableP.length <= 0) {
        before_x = obj.start_x;
        before_y = obj.start_y;
        cp1x = obj.start_x;
        cp1y = obj.start_y;
      }
      if (roll_back_obj.tableP.length > 0) {
        before_x = roll_back_obj.tableP[roll_back_obj.tableP.length - 1][0];
        before_y = roll_back_obj.tableP[roll_back_obj.tableP.length - 1][1];
        cp1x = roll_back_obj.tableP[roll_back_obj.tableP.length - 1][2];
        cp1y = roll_back_obj.tableP[roll_back_obj.tableP.length - 1][3];
      }
      dactx.putImageData(obj.start_img, 0, 0);
      dactx.beginPath();
      dactx.moveTo(before_x, before_y);
      dactx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, obj.start_x, obj.start_y);
      dactx.stroke();
      roll_back_obj.tableP.push([obj.start_x, obj.start_y, move_x, move_y]);
      roll_back_obj.one_time_img.push(dactx.getImageData(0, 0, dac.width, dac.height));
      roll_back_obj.c_one_time = 0;
    }
    else {
      value = dactx.getImageData(0, 0, dac.width, dac.height);
      add_canvas_to_roll_back_obj (value);
    }
  }
  mac.removeEventListener("mouseup", end_fun);
  pac.removeEventListener("mouseup", end_fun);
  dac.removeEventListener("mouseup", end_fun);
  mac.removeEventListener("touchend", end_fun);
  pac.removeEventListener("touchend", end_fun);
  dac.removeEventListener("touchend", end_fun);
};
function pen_tool (e) {
  if (obj.use === 'mouse_at_map_art') {
    let color = $('#colorBox').val();
    $("#map_art_canvas td:hover").css("background", color);
  }
  if (obj.use === 'mouse_at_pixel_art') {
    let img = $('.palette .palette_button .selected_block_img').find("img.mImg");
    if (img !== 'undefined') {
      img = jQuery("<div>").append(img.clone(true)).html();
    }
    if (img === 'undefined') {
      return false;
    }
    $("#pixel_art_canvas td:hover").html(img);
  }
  if (obj.use === 'mouse_at_draw_art' || obj.use === 'touch_at_draw_art') {
    prepare_ctx_data (e);
    let mx,my
    if (obj.use === 'mouse_at_draw_art') {
      mx = e.clientX;
      my = e.clientY;
    }
    if (obj.use === 'touch_at_draw_art') {
      mx = e.touches[0].clientX;
      my = e.touches[0].clientY;
    }
    let scale = $("#draw_art_scale").val();
    mx -= dac.getBoundingClientRect().left;
    my -= dac.getBoundingClientRect().top;
    dactx.beginPath();
    if (obj.use === 'mouse_at_draw_art') {
      dactx.moveTo(mx - e.movementX, my - e.movementY);
    }
    if (obj.use === 'touch_at_draw_art') {
      dactx.moveTo(obj.bef_x, obj.bef_y);
    }
    dactx.lineTo(mx, my);
    dactx.stroke();
    obj.bef_x = mx;
    obj.bef_y = my;
  }
  if (obj.use === 'touch_at_map_art') {
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    let color = $('#colorBox').val();
    let elem = document.elementFromPoint(x, y);
    if (elem === null) {
      return true;
    }
    if (elem.tagName === "TD") {
      elem.style.background = color;
    }
  }
  if (obj.use === 'touch_at_pixel_art') {
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    let img = $('.palette .palette_button .selected_block_img').find("img.mImg");
    if (img !== 'undefined') {
      img = jQuery("<div>").append(img.clone(true)).html();
    }
    if (img === 'undefined') {
      return false;
    }
    let elem = document.elementFromPoint(x, y);
    if (elem === null) {
      return true;
    }
    let $elem = jQuery(elem);
    let tag = $elem.get(0).tagName;
    if (tag === 'IMG') {
      $elem.parent().html(img);
      return true;
    }
    if (tag === 'TD') {
      if (!$elem.children('img').length) {
        $elem.html(img);
        return true;
      }
    }
  }
}
function td_xy_bgColor_in_obj (clientX,clientY) {
  let td_x,tr_y,td_bgColor;
  let elem = document.elementFromPoint(clientX, clientY);
  //https://pisuke-code.com/javascript-element-from-point/
  //https://www.javadrive.jp/javascript/dom/index28.html
  //https://www.codeflow.site/ja/article/jquery__jquery-how-to-get-the-tag-name
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
function draw_canvas_xy_bgColor_in_obj (clientX,clientY) {
  let pixel = dactx.getImageData(clientX, clientY, 1, 1);
  let data = pixel.data;
  obj.td_bgColor = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
}
function same_area_search (x, y, change_to_fun, search_fun) {
  count++
  if (count >= 2500) {
    return false;
  }
  let base_color = obj.td_bgColor;
  let number = 1;
  if ($('#draw_art').prop('checked')) {
    number = 4; //reduce lag
  }
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
    if (target_color === 'undefined' || target_color === '') {
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
    if (obj.use === 'mouse_at_map_art' || obj.use === 'touch_at_map_art') {
      change_to_fun = function (pre_x, pre_y) {
        $('#' + canvas_id + ' tr.y' + pre_y + ' td.x' + pre_x).css("background-color", color);
      };
      search_fun = function (pre_x, pre_y) {
        let target_color = $('#' + canvas_id + ' tr.y' + pre_y + ' td.x' + pre_x).css("background-color");
        return target_color;
      };
      count = 0;
      same_area_search (obj.td_x, obj.tr_y, change_to_fun, search_fun);
    }
    if (obj.use === 'mouse_at_pixel_art' || obj.use === 'touch_at_pixel_art') {
      change_to_fun = function (pre_x, pre_y) {
        $('#' + canvas_id + ' tr.y' + pre_y + ' td.x' + pre_x).html(img);
      };
      search_fun = function (pre_x, pre_y) {
        let target_color;
        let $target = $('#' + canvas_id + ' tr.y' + pre_y + ' td.x' + pre_x);
        if ($target === 'undefined') {
          target_color = 'edge';
        }
        if ($target !== 'undefined' && $target.children('img.mImg').length <= 0) {
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
    if (obj.use === 'mouse_at_draw_art' || obj.use === 'touch_at_draw_art') {
      change_to_fun = function (pre_x, pre_y) {
        let range = 3; //reduce lag
        //dactx.fillRect(pre_x * L, y * L, L, L);
        dactx.fillStyle = color;
        dactx.beginPath();
        dactx.arc(pre_x, pre_y, range, 0, Math.PI * 2, 0);
        dactx.fill();
      };
      search_fun = function (pre_x, pre_y) {
        let target_color;
        if (pre_x > 0 && pre_x < dac.width && pre_y > 0 && pre_y < dac.height) {
          let pixel = dactx.getImageData(pre_x, pre_y, 1, 1);
          let data = pixel.data;
          target_color = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
        } else {
          target_color = "edge";
        }
        return target_color;
      };
      count = 0;
      same_area_search (obj.start_x, obj.start_y, change_to_fun, search_fun);
    }
  }
  if (action_type === 'cut') {
    if (obj.use === 'mouse_at_map_art' || obj.use === 'touch_at_map_art') {
      change_to_fun = function (pre_x, pre_y) {
        $('#' + canvas_id + ' tr.y' + pre_y + ' td.x' + pre_x).removeAttr("style");
      };
      search_fun = function (pre_x, pre_y) {
        let target_color = $('#' + canvas_id + ' tr.y' + pre_y + ' td.x' + pre_x).css("background-color");
        return target_color;
      };
      count = 0;
      same_area_search (obj.td_x, obj.tr_y, change_to_fun, search_fun);
    }
    if (obj.use === 'mouse_at_pixel_art' || obj.use === 'touch_at_pixel_art') {
      change_to_fun = function (pre_x, pre_y) {
        $('#' + canvas_id + ' tr.y' + pre_y + ' td.x' + pre_x).find("img").remove();
      };
      search_fun = function (pre_x, pre_y) {
        let target_color;
        let $target = $('#' + canvas_id + ' tr.y' + pre_y + ' td.x' + pre_x);
        if ($target === 'undefined') {
          target_color = 'edge';
        }
        if ($target !== 'undefined' && $target.children('img.mImg').length <= 0) {
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
    if (obj.use === 'mouse_at_draw_art' || obj.use === 'touch_at_draw_art') {
      change_to_fun = function (pre_x, pre_y) {
        let range = 3; //reduce lag
        dactx.fillStyle = 'white';
        dactx.beginPath();
        dactx.arc(pre_x, pre_y, range, 0, Math.PI * 2, 0);
        dactx.fill();
      };
      search_fun = function (pre_x, pre_y) {
        let target_color;
        if (pre_x > 0 && pre_x < dac.width && pre_y > 0 && pre_y < dac.height) {
          let pixel = dactx.getImageData(pre_x, pre_y, 1, 1);
          let data = pixel.data;
          target_color = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
        } else {
          target_color = "edge";
        }
        return target_color;
      };
      count = 0;
      same_area_search (obj.start_x, obj.start_y, change_to_fun, search_fun);
    }
  }
}
function fill_tool_of_paint_roller(e) {
  let canvas_id, color, img, action_type;
  if (obj.use === 'mouse_at_map_art' || obj.use === 'touch_at_map_art') {
    canvas_id = 'map_art_canvas';
    color = $('#colorBox').val();
    td_xy_bgColor_in_obj (obj.start_x, obj.start_y);
  }
  if (obj.use === 'mouse_at_pixel_art' || obj.use === 'touch_at_pixel_art') {
    canvas_id = 'pixel_art_canvas';
    img = $('.palette .palette_button .selected_block_img').find("img.mImg");
    if (img !== 'undefined') {
      img = jQuery("<div>").append(img.clone(true)).html();
    }
    if (img === 'undefined') {
      return false;
    }
    td_xy_bgColor_in_obj (obj.start_x, obj.start_y);
  }
  if (obj.use === 'mouse_at_draw_art' || obj.use === 'touch_at_draw_art') {
    canvas_id = 'draw_art_canvas';
    if ($("#change_to_map_art_data").prop('checked')) {
      color = $('#colorBox').val();
    }
    if ($("#change_to_pixel_art_data").prop('checked')) {
      let $img = $('.palette .palette_button .selected_block_img').find("img.mImg");
      if ($img.length) {
        color = $img.css("background-color");
      }
      if ($img.length <= 0) {
        return false;
      }
    }
    draw_canvas_xy_bgColor_in_obj (obj.start_x, obj.start_y);
  }
  action_type = 'fill';
  area_action_fun (canvas_id, color, img, action_type);
  $('html').css('cursor', 'default');
}
function area_cut_tool_of_scissors(e) {
  let canvas_id,color,img,action_type;
  if (obj.use === 'mouse_at_map_art' || obj.use === 'touch_at_map_art') {
    canvas_id = 'map_art_canvas';
    td_xy_bgColor_in_obj (obj.start_x, obj.start_y);
  }
  if (obj.use === 'mouse_at_pixel_art' || obj.use === 'touch_at_pixel_art') {
    canvas_id = 'pixel_art_canvas';
    td_xy_bgColor_in_obj (obj.start_x, obj.start_y);
  }
  if (obj.use === 'mouse_at_draw_art' || obj.use === 'touch_at_draw_art') {
    canvas_id = 'draw_art_canvas';
    color = 'white';
    draw_canvas_xy_bgColor_in_obj (obj.start_x, obj.start_y);
  }
  action_type = 'cut';
  area_action_fun (canvas_id, color, img, action_type);
  $('html').css('cursor', 'default');
}
function eraser_points_tool(e) {
  if (obj.use === 'mouse_at_map_art') {
    $("#map_art_canvas td:hover").removeAttr("style");
  }
  if (obj.use === 'mouse_at_pixel_art') {
    $("#pixel_art_canvas td:hover img").remove();
  }
  if (obj.use === 'mouse_at_draw_art' || obj.use === 'touch_at_draw_art') {
    prepare_ctx_data (e);
    let mx,my
    if (obj.use === 'mouse_at_draw_art') {
      mx = e.clientX - dac.getBoundingClientRect().left;
      my = e.clientY - dac.getBoundingClientRect().top;
    }
    if (obj.use === 'touch_at_draw_art') {
      mx = e.touches[0].clientX - dac.getBoundingClientRect().left;
      my = e.touches[0].clientY - dac.getBoundingClientRect().top;
    }
    dactx.beginPath();
    if (obj.use === 'mouse_at_draw_art') {
      dactx.moveTo(mx - e.movementX, my - e.movementY);
    }
    if (obj.use === 'touch_at_draw_art') {
      dactx.moveTo(obj.bef_x, obj.bef_y);
      obj.bef_x = mx;
      obj.bef_y = my;
    }
    dactx.lineTo(mx, my);
    dactx.stroke();
  }
  if (obj.use === 'touch_at_map_art' || obj.use === 'touch_at_pixel_art') {
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    let elem = document.elementFromPoint(x, y);
    if (elem === null) {
      return true;
    }
    let $elem = jQuery(elem);
    let tag = $elem.get(0).tagName;
    if (tag === 'IMG') {
      elem.remove();
      return true;
    }
    if (tag === 'TD') {
      if (!$elem.children('img').length) {
        elem.removeAttribute("style");
        return true;
      }
    }
  }
}
function stroke_path_with_line(e) {
  let move_x, move_y;
  if (obj.use === 'mouse_at_draw_art') {
    move_x = e.clientX - dac.getBoundingClientRect().left;
    move_y = e.clientY - dac.getBoundingClientRect().top;
  }
  if (obj.use === 'touch_at_draw_art') {
    move_x = e.touches[0].clientX - dac.getBoundingClientRect().left;
    move_y = e.touches[0].clientY - dac.getBoundingClientRect().top;
  }
  let before_x, before_y, cp1x, cp1y;
  let cp2x = 2 * obj.start_x - move_x;
  let cp2y = 2 * obj.start_y - move_y;
  if (roll_back_obj.tableP.length <= 0) {
    before_x = obj.start_x;
    before_y = obj.start_y;
    cp1x = obj.start_x;
    cp1y = obj.start_y;
    dactx.strokeStyle = '#E0E0E0';
    dactx.lineWidth = 1;
  }
  if (roll_back_obj.tableP.length > 0) {
    before_x = roll_back_obj.tableP[roll_back_obj.tableP.length - 1][0];
    before_y = roll_back_obj.tableP[roll_back_obj.tableP.length - 1][1];
    cp1x = roll_back_obj.tableP[roll_back_obj.tableP.length - 1][2];
    cp1y = roll_back_obj.tableP[roll_back_obj.tableP.length - 1][3];
    prepare_ctx_data (e);
  }
  dactx.putImageData(obj.start_img, 0, 0);
  dactx.beginPath();
  dactx.moveTo(before_x, before_y);
  dactx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, obj.start_x, obj.start_y);
  dactx.stroke();
  obj.bef_x = move_x;
  obj.bef_y = move_y;
}
function stroke_path_with_rect(e) {
  let mx, my, x, y
  if (obj.use === 'mouse_at_draw_art') {
    mx = e.clientX - dac.getBoundingClientRect().left;
    my = e.clientY - dac.getBoundingClientRect().top;
  }
  if (obj.use === 'touch_at_draw_art') {
    mx = e.touches[0].clientX - dac.getBoundingClientRect().left;
    my = e.touches[0].clientY - dac.getBoundingClientRect().top;
  }
  if (obj.start_x <= mx) {
    x = obj.start_x;
  } else {
    x = mx;
  }
  if (obj.start_y <= my) {
    y = obj.start_y;
  } else {
    y = my;
  }
  let w = Math.abs(obj.start_x - mx);
  let h = Math.abs(obj.start_y - my);
  prepare_ctx_data (e);
  dactx.putImageData(obj.start_img, 0, 0);
  if (obj.want_if === 'stroke_path_with_rect') {
    dactx.strokeRect(x, y, w, h);
  }
  if (obj.want_if === 'fill_in_with_rect') {
    dactx.fillRect(x, y, w, h);
  }
}
function stroke_path_with_arc(e) {
  let mx,my
  if (obj.use === 'mouse_at_draw_art') {
    mx = e.clientX - dac.getBoundingClientRect().left;
    my = e.clientY - dac.getBoundingClientRect().top;
  }
  if (obj.use === 'touch_at_draw_art') {
    mx = e.touches[0].clientX - dac.getBoundingClientRect().left;
    my = e.touches[0].clientY - dac.getBoundingClientRect().top;
  }
  let r = Math.sqrt((obj.start_x - mx) * (obj.start_x - mx) + (obj.start_y - my) * (obj.start_y - my));
  prepare_ctx_data (e);
  dactx.putImageData(obj.start_img, 0, 0);
  dactx.beginPath();
  dactx.arc(obj.start_x, obj.start_y, r, 0, 2 * Math.PI, true);
  if (obj.want_if === 'stroke_path_with_arc') {
    dactx.stroke();
  }
  if (obj.want_if === 'fill_in_with_arc') {
    dactx.fill();
  }
}
function return_rect_obj (e) {
  let mx, my, x, y, w, h;
  if (obj.use === 'mouse_at_draw_art') {
    mx = e.clientX - dac.getBoundingClientRect().left;
    my = e.clientY - dac.getBoundingClientRect().top;
  }
  if (obj.use === 'touch_at_draw_art') {
    mx = obj.bef_x;
    my = obj.bef_y;
  }
  w = Math.abs(obj.start_x - mx);
  h = Math.abs(obj.start_y - my);
  if (obj.start_x <= mx) {
    x = obj.start_x;
  } else {
    x = mx;
  }
  if (obj.start_y <= my) {
    y = obj.start_y;
  } else {
    y = my;
  }
  return {mx: mx, my: my, x: x, y: y, w: w, h: h};
}
function return_first_copyed_obj (e) {
  let bg_img, x, y, w, h, put_img, url, mx, my, xc, yc, piBase, piMove, xRange, yRange;
  if (obj.use === 'mouse_at_draw_art') {
    mx = e.clientX - dac.getBoundingClientRect().left;
    my = e.clientY - dac.getBoundingClientRect().top;
  }
  if (obj.use === 'touch_at_draw_art') {
    mx = obj.bef_x;
    my = obj.bef_y;
  }
  if (obj.want_if === 'copy_area_with_rect') {
    put_img = obj.copy_img;
    if (obj.use === 'mouse_at_draw_art') {
      x = e.offsetX - put_img.width;
      y = e.offsetY - put_img.height;
    }
    if (obj.use === 'touch_at_draw_art') {
      x = obj.bef_x - put_img.width;
      y = obj.bef_y - put_img.height;
    }
    w = put_img.width;
    h = put_img.height;
  }
  if (obj.want_if === 'resize_area_with_rect') {
    url = obj.copy_img;
    put_img = new Image();
    put_img.src = url;
    x = obj.start_x - put_img.width;
    y = obj.start_y - put_img.height;
    w = mx - x;
    h = my - y;
  }
  if (obj.want_if === 'roll_area_with_rect') {
    url = obj.copy_img;
    put_img = new Image();
    put_img.src = url;
    xc = obj.start_x - put_img.width / 2;
    yc = obj.start_y - put_img.height / 2;
    piBase = Math.atan((obj.start_y - yc) / (obj.start_x - xc));
    xRange = Math.abs(mx - xc);
    yRange = Math.abs(my - yc);
    if (xRange >= yRange && mx >= xc) {
      piMove = Math.atan((my - yc) / xRange);
    } else if (xRange >= yRange && mx < xc) {
      piMove = Math.atan((my - yc) / xRange);
      piMove = Math.PI - piMove;
    } else if (xRange < yRange && my >= yc) {
      piMove = Math.atan((mx - xc) / yRange);
      piMove = Math.PI / 2 - piMove;
    } else if (xRange < yRange && my < yc) {
      piMove = Math.atan((mx - xc) / yRange);
      piMove = piMove - Math.PI / 2;
    }
  }
  return {bg_img: bg_img, x: x, y: y, w: w, h: h, put_img: put_img, xc: xc, yc: yc, piMove: piMove, piBase: piBase};
}
function rect_FirstUp(e) {
  all_removeEventListener ();
  let r_obj = return_rect_obj (e);
  dactx.putImageData(obj.start_img, 0, 0);
  let cut_img = dactx.getImageData(r_obj.x, r_obj.y, r_obj.w, r_obj.h);
  if (obj.want_if === 'copy_area_with_rect') {
    obj.copy_img = cut_img;
  }
  if (obj.want_if === 'resize_area_with_rect' || obj.want_if === 'roll_area_with_rect') {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    c.width = r_obj.w;
    c.height = r_obj.h;
    ctx.putImageData(cut_img, 0, 0);
    obj.copy_img = c.toDataURL();
  }
  if ($('#for_cut_area').prop('checked')) {
    dactx.fillStyle = 'white';
    dactx.fillRect(r_obj.x, r_obj.y, r_obj.w, r_obj.h);
    //obj.pulled_img = dactx.getImageData(0, 0, dac.width, dac.height);
  }
  return false;
}
function rect_SecondUp(e) {
  all_removeEventListener ();
  let copyed_obj = return_first_copyed_obj (e);
  dactx.putImageData(obj.start_img, 0, 0);
  if (obj.want_if === 'copy_area_with_rect') {
    dactx.putImageData(copyed_obj.put_img, copyed_obj.x, copyed_obj.y, 0, 0, copyed_obj.w, copyed_obj.h);
    value = dactx.getImageData(0, 0, dac.width, dac.height);
    add_canvas_to_roll_back_obj (value);
  }
  if (obj.want_if === 'resize_area_with_rect') {
    copyed_obj.put_img.onload = function (e) {
      dactx.drawImage(copyed_obj.put_img, copyed_obj.x, copyed_obj.y, copyed_obj.w, copyed_obj.h);
      value = dactx.getImageData(0, 0, dac.width, dac.height);
      add_canvas_to_roll_back_obj (value);
    };
  }
  if (obj.want_if === 'roll_area_with_rect') {
    copyed_obj.put_img.onload = function (e) {
      dactx.translate(copyed_obj.xc, copyed_obj.yc);
      dactx.rotate(copyed_obj.piMove - copyed_obj.piBase);
      dactx.drawImage(copyed_obj.put_img, -copyed_obj.put_img.width / 2, -copyed_obj.put_img.height / 2, copyed_obj.put_img.width, copyed_obj.put_img.height);
      dactx.rotate(copyed_obj.piBase - copyed_obj.piMove);
      dactx.translate(-copyed_obj.xc, -copyed_obj.yc);
      value = dactx.getImageData(0, 0, dac.width, dac.height);
      add_canvas_to_roll_back_obj (value);
    };
  }
  obj.copy_img = "";
  return false;
}
function copy_area_with_rect(e) {
  let mx, my, x, y, w, h;
  if (obj.use === 'mouse_at_draw_art') {
    mx = e.clientX - dac.getBoundingClientRect().left;
    my = e.clientY - dac.getBoundingClientRect().top;
  }
  if (obj.use === 'touch_at_draw_art') {
    mx = e.touches[0].clientX - dac.getBoundingClientRect().left;
    my = e.touches[0].clientY - dac.getBoundingClientRect().top;
  }
  w = Math.abs(obj.start_x - mx);
  h = Math.abs(obj.start_y - my);
  if (obj.start_x <= mx) {
    x = obj.start_x;
  } else {
    x = mx;
  }
  if (obj.start_y <= my) {
    y = obj.start_y;
  } else {
    y = my;
  }
  obj.bef_x = mx;
  obj.bef_y = my;
  prepare_ctx_data (e);
  dactx.putImageData(obj.start_img, 0, 0);
  if (obj.copy_img === '') {
    dactx.strokeRect(x, y, w, h);
    document.addEventListener('mouseup', rect_FirstUp);
    document.addEventListener('touchend', rect_FirstUp);
    return false;
  }
  if (obj.copy_img !== '') {
    let copyed_obj = return_first_copyed_obj (e);
    dactx.putImageData(obj.start_img, 0, 0);
    if (obj.want_if === 'copy_area_with_rect') {
      dactx.putImageData(copyed_obj.put_img, copyed_obj.x, copyed_obj.y, 0, 0, copyed_obj.w, copyed_obj.h);
      dactx.strokeRect(copyed_obj.x, copyed_obj.y, copyed_obj.w, copyed_obj.h);
    }
    if (obj.want_if === 'resize_area_with_rect') {
      copyed_obj.put_img.onload = function (e) {
        dactx.strokeRect(copyed_obj.x, copyed_obj.y, copyed_obj.w, copyed_obj.h);
        dactx.drawImage(copyed_obj.put_img, copyed_obj.x, copyed_obj.y, copyed_obj.w, copyed_obj.h);
      };
    }
    if (obj.want_if === 'roll_area_with_rect') {
      copyed_obj.put_img.onload = function (e) {
        dactx.translate(copyed_obj.xc, copyed_obj.yc);
        dactx.rotate(copyed_obj.piMove - copyed_obj.piBase);
        dactx.strokeRect(-copyed_obj.put_img.width / 2, -copyed_obj.put_img.height / 2, copyed_obj.put_img.width, copyed_obj.put_img.height);
        dactx.drawImage(copyed_obj.put_img, -copyed_obj.put_img.width / 2, -copyed_obj.put_img.height / 2, copyed_obj.put_img.width, copyed_obj.put_img.height);
        dactx.rotate(copyed_obj.piBase - copyed_obj.piMove);
        dactx.translate(-copyed_obj.xc, -copyed_obj.yc);
      };
    }
    document.addEventListener('mouseup', rect_SecondUp);
    document.addEventListener('touchend', rect_SecondUp);
    return false;
  }
}
function return_want_if_at_tool (e) {
  let want_if = 'false';
  if ($('#no_set_action').prop('checked') || $('#map_canvas_open_icon').prop('checked')) {
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
    if ($('#fill_in_with_line').prop('checked')) {
      want_if = 'fill_in_with_line';
    }
    if ($('#stroke_path_with_rect').prop('checked')) {
      want_if = 'stroke_path_with_rect';
    }
    if ($('#fill_in_with_rect').prop('checked')) {
      want_if = 'fill_in_with_rect';
    }
    if ($('#stroke_path_with_arc').prop('checked')) {
      want_if = 'stroke_path_with_arc';
    }
    if ($('#fill_in_with_arc').prop('checked')) {
      want_if = 'fill_in_with_arc';
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
  if (obj.want_if === 'pen_tool') {
    pen_tool(e);
  }
  if (obj.want_if === 'eraser_points_tool') {
    eraser_points_tool(e);
  }
  if (obj.want_if === 'stroke_path_with_line' || obj.want_if === 'fill_in_with_line') {
    stroke_path_with_line(e);
  }
  if (obj.want_if === 'stroke_path_with_rect' || obj.want_if === 'fill_in_with_rect') {
    stroke_path_with_rect(e);
  }
  if (obj.want_if === 'stroke_path_with_arc' || obj.want_if === 'fill_in_with_arc') {
    stroke_path_with_arc(e);
  }
  if (obj.want_if === 'copy_area_with_rect' || obj.want_if === 'resize_area_with_rect' || obj.want_if === 'roll_area_with_rect') {
    copy_area_with_rect(e);
  }
}
/*escape for touch test*/
mac.onmousedown = function (e) {
  obj.use = 'mouse_at_map_art';
  obj.want_if = return_want_if_at_tool ();
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
  if (obj.want_if === 'fill_tool_of_paint_roller') {
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
    $('html').css('cursor', 'wait');
    setTimeout(() => {
      fill_tool_of_paint_roller(e);
      end_fun();
    }, "1")
  }
  else if (obj.want_if === 'area_cut_tool_of_scissors') {
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
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
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
    mac.addEventListener('mousemove', choose_fun);
    mac.addEventListener("mouseup", end_fun);
  }
};
pac.onmousedown = function (e) {
  obj.use = 'mouse_at_pixel_art';
  obj.want_if = return_want_if_at_tool ();
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
  if (obj.want_if === 'fill_tool_of_paint_roller') {
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
    $('html').css('cursor', 'wait');
    setTimeout(() => {
      fill_tool_of_paint_roller(e);
      end_fun();
    }, "1")
  }
  else if (obj.want_if === 'area_cut_tool_of_scissors') {
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
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
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
    pac.addEventListener('mousemove', choose_fun);
    pac.addEventListener("mouseup", end_fun);
  }
};
dac.onmousedown = function (e) {
  obj.use = 'mouse_at_draw_art';
  obj.want_if = return_want_if_at_tool ();
  if (obj.want_if === 'false') {
    all_removeEventListener (e);
    return false;
  }
  if (obj.want_if === 'true') {
    all_removeEventListener (e);
    return true;
  }
  obj.start_x = e.clientX - dac.getBoundingClientRect().left;
  obj.start_y = e.clientY - dac.getBoundingClientRect().top;
  obj.start_img = dactx.getImageData(0, 0, dac.width, dac.height);
  if (obj.want_if === 'fill_tool_of_paint_roller') {
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
    $('html').css('cursor', 'wait');
    setTimeout(() => {
      fill_tool_of_paint_roller(e);
      end_fun();
    }, "1")
  }
  else if (obj.want_if === 'area_cut_tool_of_scissors') {
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
    $('html').css('cursor', 'wait');
    setTimeout(() => {
      area_cut_tool_of_scissors(e);
      end_fun();
    }, "1")
  }
  else if (obj.want_if === 'color_dropper_icon') {
    color_dropper_icon(e);

  }
  else if (obj.want_if === 'stroke_path_with_line' || obj.want_if === 'fill_in_with_line') {
    if (!e.shiftKey && !e.ctrlKey) {
      while (roll_back_obj.c_one_time > 0) {
        roll_back_obj.tableP.pop();
        roll_back_obj.one_time_img.pop();
        roll_back_obj.c_one_time --;
      }
      document.addEventListener('mousemove', handleTouchMove, { passive: false });
      dac.addEventListener('mousemove', choose_fun);
      dac.addEventListener("mouseup", end_fun);
    }
  }
  else if (obj.want_if === 'copy_area_with_rect' || obj.want_if === 'resize_area_with_rect' || obj.want_if === 'roll_area_with_rect') {
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
    dac.addEventListener('mousemove', choose_fun);
  }
  else {
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
    dac.addEventListener('mousemove', choose_fun);
    dac.addEventListener("mouseup", end_fun);
  }
};
mac.addEventListener("touchstart", function (e) {
  obj.use = 'touch_at_map_art';
  obj.want_if = return_want_if_at_tool ();
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
  if (obj.want_if === 'fill_tool_of_paint_roller') {
    document.addEventListener("touchstart", handleTouchMove, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    $('html').css('cursor', 'wait');
    setTimeout(() => {
      fill_tool_of_paint_roller(e);
      end_fun();
    }, "1")
  }
  else if (obj.want_if === 'area_cut_tool_of_scissors') {
    document.addEventListener("touchstart", handleTouchMove, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
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
    document.addEventListener("touchstart", handleTouchMove, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    mac.addEventListener("touchmove", choose_fun);
    mac.addEventListener("touchend", end_fun);
  }
});
pac.addEventListener("touchstart", function (e) {
  obj.use = 'touch_at_pixel_art';
  obj.want_if = return_want_if_at_tool ();
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
  if (obj.want_if === 'fill_tool_of_paint_roller') {
    document.addEventListener("touchstart", handleTouchMove, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    $('html').css('cursor', 'wait');
    setTimeout(() => {
      fill_tool_of_paint_roller(e);
      end_fun();
    }, "1")
  }
  else if (obj.want_if === 'area_cut_tool_of_scissors') {
    document.addEventListener("touchstart", handleTouchMove, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
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
    document.addEventListener("touchstart", handleTouchMove, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    pac.addEventListener("touchmove", choose_fun);
    pac.addEventListener("touchend", end_fun);
  }
});
dac.addEventListener("touchstart", function (e) {
  obj.use = 'touch_at_draw_art';
  obj.want_if = return_want_if_at_tool ();
  if (obj.want_if === 'false') {
    all_removeEventListener (e);
    return false;
  }
  if (obj.want_if === 'true') {
    all_removeEventListener (e);
    return true;
  }
  obj.start_x = e.touches[0].clientX - dac.getBoundingClientRect().left;
  obj.start_y = e.touches[0].clientY - dac.getBoundingClientRect().top;
  obj.start_img = dactx.getImageData(0, 0, dac.width, dac.height);
  if (obj.want_if === 'fill_tool_of_paint_roller') {
    document.addEventListener("touchstart", handleTouchMove, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    $('html').css('cursor', 'wait');
    setTimeout(() => {
      fill_tool_of_paint_roller(e);
      end_fun();
    }, "1")
  }
  else if (obj.want_if === 'area_cut_tool_of_scissors') {
    document.addEventListener("touchstart", handleTouchMove, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    $('html').css('cursor', 'wait');
    setTimeout(() => {
      area_cut_tool_of_scissors(e);
      end_fun();
    }, "1")
  }
  else if (obj.want_if === 'color_dropper_icon') {
    color_dropper_icon(e);
  }
  else if (obj.want_if === 'stroke_path_with_line' || obj.want_if === 'fill_in_with_line') {
    if (!e.shiftKey && !e.ctrlKey) {
      while (roll_back_obj.c_one_time > 0) {
        roll_back_obj.tableP.pop();
        roll_back_obj.one_time_img.pop();
        roll_back_obj.c_one_time --;
      }
      document.addEventListener("touchstart", handleTouchMove, { passive: false });
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      dac.addEventListener("touchmove", choose_fun);
      dac.addEventListener("touchend", end_fun);
    }
  }
  else if (obj.want_if === 'copy_area_with_rect' || obj.want_if === 'resize_area_with_rect' || obj.want_if === 'roll_area_with_rect') {
    document.addEventListener("touchstart", handleTouchMove, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    dac.addEventListener("touchmove", choose_fun);
  }
  else {
    obj.bef_x = obj.start_x;
    obj.bef_y = obj.start_y;
    document.addEventListener("touchstart", handleTouchMove, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    dac.addEventListener("touchmove", choose_fun);
    dac.addEventListener("touchend", end_fun);
  }
});
//all removeEventListener at window remove
document.addEventListener('beforeunload', all_removeEventListener);
document.addEventListener('mouseleave', all_removeEventListener);
//roll_back
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
/*shortcuts for close_end_line_path & open_end_line_path*/
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
}
/*ZoomUpDown action*/
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
});
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
if (typeof sessionStorage === 'undefined') {
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
