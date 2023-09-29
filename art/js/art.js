/*++reserve objects++*/
let memory_obj = {};
let cp_obj = {};
let command_obj = {};
let value_obj = {};
let storage = localStorage;
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
  if ($('#no_set_action').prop('checked')) {
    return false;
  }
  if ($('#draw_art').prop('checked') && roll_back_obj.one_time_img.length) {
    let value = roll_back_obj.draw[roll_back_obj.draw.length - roll_back_obj.c_draw - 1];
    if (value === null) {
      dactx.fillStyle = "white";
      dactx.fillRect(0, 0, dac.width, dac.height);
    }
    if (value !== null) {
      dactx.putImageData(value, 0, 0);
    }
  }
  //memory reset
  roll_back_obj.tableP = [];
  roll_back_obj.c_one_time = 0;
  roll_back_obj.one_time_img = [];
  $.each(obj, function(index, value) {
    obj[index] = '';
  });
  array_match_cell = [];
  count = 0;
  //toggle_action
  if (id === 'no_set_action') {
    $('#no_set_action').prop('checked', true);
  }
  else if ($('#' + id).prop('checked')) {
    setTimeout(() => {
      $('#' + id).prop('checked', false);
      $('#no_set_action').prop('checked', true);
    }, "1")
  }
  else if (!$('#' + id).prop('checked')) {
    return true;
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
function delete_memory_from_obj (key) {
  delete memory_obj[key];
}
function add_canvas_to_roll_back_obj (value) {
  let memory_amount = 1000;
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
    roll_back_obj.draw.push(value);
  }
}
function change_to_map_art (e) {
  $('.palette .palette_button .selected_block_img').css('display', 'none');
  $('#CP_icons .selected_block_img').css('display', 'none');
  $('.palette .palette_button i.fa-droplet').css('display', 'inline-block');
  $('#colorBox').css('display', 'inline-block');
  $('#no_set_action').click();
  if (obj.want_if === 'top_menu') {
    $('#line_bold_for_draw').val(1);
    $('#change_to_map_art_data').click();
    $('#for_map_art_size').click();
    $('#pixel_art_canvas_frame, #draw_art_canvas_frame').addClass('hidden');
    $('#map_art_canvas_frame').removeClass('hidden');
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
      $('#pixel_art_canvas_frame, #draw_art_canvas_frame').addClass('hidden');
      $('#map_art_canvas_frame').removeClass('hidden');
    }
  }
  if (obj.want_if === 'select_size') {
    $('#change_to_map_art_data').click();
    if (!$('#draw_art').prop('checked')) {
      $('#map_art').click();
      $('#pixel_art_canvas_frame, #draw_art_canvas_frame').addClass('hidden');
      $('#map_art_canvas_frame').removeClass('hidden');
    }
  }
  if (obj.want_if === 'change_art_board') {
    $('#for_map_art_size').click();
    $('#change_to_map_art_data').click();
    if (!$('#draw_art').prop('checked')) {
      $('#map_art').click();
      $('#pixel_art_canvas_frame, #draw_art_canvas_frame').addClass('hidden');
      $('#map_art_canvas_frame').removeClass('hidden');
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
    $('#line_bold_for_draw').val(1);
    $('#change_to_pixel_art_data').click();
    $('#for_pixel_art_size').click();
    $('#map_art_canvas_frame, #draw_art_canvas_frame').addClass('hidden');
    $('#pixel_art_canvas_frame').removeClass('hidden');
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
      $('#map_art_canvas_frame, #draw_art_canvas_frame').addClass('hidden');
      $('#pixel_art_canvas_frame').removeClass('hidden');
    }
  }
  if (obj.want_if === 'select_size') {
    $('#change_to_pixel_art_data').click();
    if (!$('#draw_art').prop('checked')) {
      $('#pixel_art').click();
      $('#map_art_canvas_frame, #draw_art_canvas_frame').addClass('hidden');
      $('#pixel_art_canvas_frame').removeClass('hidden');
    }
  }
  if (obj.want_if === 'change_art_board') {
    $('#for_pixel_art_size').click();
    $('#change_to_pixel_art_data').click();
    if (!$('#draw_art').prop('checked')) {
      $('#pixel_art').click();
      $('#map_art_canvas_frame, #draw_art_canvas_frame').addClass('hidden');
      $('#pixel_art_canvas_frame').removeClass('hidden');
    }
  }
}
function change_to_draw_art (e) {
  $('#no_set_action').click();
  if (obj.want_if === 'top_menu') {
    $('#line_bold_for_draw').val(10);
    $('#map_art_canvas_frame, #pixel_art_canvas_frame').addClass('hidden');
    $('#draw_art_canvas_frame').removeClass('hidden');
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
  rgb = rgb.replace(/\s+/g, "");
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
function deepCopyObj(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return deepCopyArray(obj);
  }
  let copy = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepCopyObj(obj[key]);
    }
  }
  return copy;
}
//localStorage
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
async function load_command_id_xlsx() {
  const url = '../art/data/image_alts.xlsm'; // ファイルのURLに置き換えてください

  try {
    const response = await fetch(url);
    const data = await response.arrayBuffer();

    const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const dataArray = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    let new_obj = {};
    dataArray.forEach(item => {
      new_obj[item[0]] = [item[1], item[2]];
    });

    return new_obj;
  } catch (error) {
    console.log('Error:', error);
    return {};
  }
}
/*++localStorage++*/
/*https://qiita.com/mocha_xx/items/e0897e9f251da042af59*/
/*https://www.sejuku.net/blog/28696*/
/*https://atmarkit.itmedia.co.jp/ait/articles/1108/12/news093_2.html*/
/*https://javascript.programmer-reference.com/js-onunload/*/
/*https://qiita.com/niihara_megumu/items/be693500d42088027547*/
if (typeof sessionStorage === 'undefined') {
  let str;
  if ($('header .header_form p.language').text() === 'Japanese') {
    str = "このブラウザはWeb Storage機能が実装されていません";
  }
  if ($('header .header_form p.language').text() === '英語') {
    str = "This browser does not been implemented Web Storage function";
  }
  $('#auto_download_storage').prop('checked', false);
  window.alert(str);
} else {
  let str;
  if ($('header .header_form p.language').text() === 'Japanese') {
    str = "このページはWeb Storage機能を使用しています";
  }
  if ($('header .header_form p.language').text() === '英語') {
    str = "This page uses the Web Storage function";
  }
  //ページを離れる直前
  window.onbeforeunload = function(){
    //make input data for localStorage
    //storage button on or off
    if (!$('#auto_download_storage').prop('checked')) {
      value_obj['storage'] = 'off';
      //in storage
      let key = 'art_ver_two';
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
        if (obj === undefined) {
          return true;
        }
        get_memorys_data['memoryObj_id' + i] = index;
        get_memorys_data['memoryObj_canvas' + i] = obj.canvas;
        get_memorys_data['memoryObj_data' + i] = obj.data;
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
      value_obj['ratio_r'] = [$('#sample_ratio_r').val(), Number($('#sample_ratio_r').attr('data-count'))];
      value_obj['ratio_g'] = [$('#sample_ratio_g').val(), Number($('#sample_ratio_g').attr('data-count'))];
      value_obj['ratio_b'] = [$('#sample_ratio_b').val(), Number($('#sample_ratio_b').attr('data-count'))];
      //here add command id
      value_obj['command_data'] = deepCopyObj(command_obj);
      //in storage
      let key = 'art_ver_two';
      setItem_in_localStorage (storage,key,value_obj);
    }
  }
  //upload load storage from button
  $('header .header_form nav ul li.roll_back').click((e) => {
    let key = 'art_ver_two';
    let getData = return_obj_from_localStorage (storage,key);
    if (getData === '' || getData === null) {
      return false;
    }
    value_obj = getData;
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
    let get_cp_obj = getData['cp_html'];
    let arry_cp_class = ['add_new_blocks', 'color_named_blocks', 'easy_to_gather', 'hard_in_overworld', 'in_nether', 'in_end'];
    for (let j = 0; j < arry_cp_class.length; j++) {
      let html = get_cp_obj['cpObj_data' + j];
      $('#CP .' + arry_cp_class[j]).html(html);
    }
    //input sample_view rgb
    $('#sample_ratio_r').val(getData['ratio_r']);
    $('#sample_ratio_g').val(getData['ratio_g']);
    $('#sample_ratio_b').val(getData['ratio_b']);
  });
  $('header .header_2windows nav ul li.roll_back').click((e) => {
    let key = 'art_ver_two';
    let getData = return_obj_from_localStorage (storage,key);
    if (getData === '' || getData === null) {
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
    let get_cp_obj = getData['cp_html'];
    let arry_cp_class = ['add_new_blocks', 'color_named_blocks', 'easy_to_gather', 'hard_in_overworld', 'in_nether', 'in_end'];
    for (let j = 0; j < arry_cp_class.length; j++) {
      let html = get_cp_obj['cpObj_data' + j];
      $('#CP .' + arry_cp_class[j]).html(html);
    }
    //input sample_view rgb
    $('#sample_ratio_r').val(getData['ratio_r']);
    $('#sample_ratio_g').val(getData['ratio_g']);
    $('#sample_ratio_b').val(getData['ratio_b']);
  });
}
/*++ready document++*/
$(document).ready(async function () {
  //load Storage
  let load_flag = false;
  let key = 'art_ver_two';
  let getData = return_obj_from_localStorage (storage,key);
  if (getData !== '' && getData !== null) {
    value_obj = getData;
    //storage button on or off
    if (getData['storage'] === 'off') {
      $('#auto_download_storage').prop('checked', false);
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
      let get_cp_obj = getData['cp_html'];
      let arry_cp_class = ['add_new_blocks', 'color_named_blocks', 'easy_to_gather', 'hard_in_overworld', 'in_nether', 'in_end'];
      for (let j = 0; j < arry_cp_class.length; j++) {
        let html = get_cp_obj['cpObj_data' + j];
        $('#CP .' + arry_cp_class[j]).html(html);
      }
      //check box color to display
      let id = $("#CP label.check").attr('id');
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
      //input sample_view rgb
      $('#sample_ratio_r').val(getData['ratio_r'][0]);
      $('#sample_ratio_g').val(getData['ratio_g'][0]);
      $('#sample_ratio_b').val(getData['ratio_b'][0]);
      $('#sample_ratio_r').attr('data-count', getData['ratio_r'][1]);
      $('#sample_ratio_g').attr('data-count', getData['ratio_g'][1]);
      $('#sample_ratio_b').attr('data-count', getData['ratio_b'][1]);
      //read command id
      if (getData['command_data'] !== undefined) {
        command_obj = getData['command_data'];
        load_flag = true;
      }
    }
  }
  //command_ids into obj
  if (!load_flag) {
    command_obj = await load_command_id_xlsx();
  }
  //hide aside menu when using smartphone & 2 windows
  let ww = window.innerWidth;
  if (ww >= 1200) {
    $('#hanb').prop('checked', true);
  }
  //palette color img add crossorigin
  $('#CP .CPimg').find('img').attr('crossorigin', 'anonymous');
  $('#CP .CPimg').find('img').each(function() {
    let alt = $(this).attr('alt');
    if (alt !== undefined) {
      let src = $(this).attr('src');
      let id = $('#CP .CPimg img[alt="' + alt + '"]').parent().parent().attr('id');
      const image = new Image();
      image.onload = () => {
        cp_obj[alt] = {img: image, color: $('#' + id + ' .CPrgb').css('backgroundColor')}
      };
      image.crossOrigin = 'anonymous'; // クロスオリジン属性を設定
      image.src = src;
    }
  });
  let cell_x = [];
  let cells = [];
  mactx.fillStyle = 'white';
  mactx.fillRect(0, 0, mac.width, mac.height);
  mactx.lineWidth = 0.5;
  mactx.strokeStyle = '#f5f5f5';
  for (let x = 0; x < $('#map_art_size').val(); x++) {
    cell_x[x] = 0;
    mactx.beginPath();
    mactx.moveTo(x * cell_size_map, 0);
    mactx.lineTo(x * cell_size_map, mac.width);
    mactx.stroke();
  }
  for (let y = 0; y < $('#map_art_size').val(); y++) {
    cells[y] = cell_x;
    mactx.beginPath();
    mactx.moveTo(0, y * cell_size_map);
    mactx.lineTo(mac.height, y * cell_size_map);
    mactx.stroke();
  }
  roll_back_obj.map.push(cells);
  cell_x = [];
  cells = [];
  pactx.fillStyle = 'white';
  pactx.fillRect(0, 0, pac.width, pac.height);
  pactx.lineWidth = 0.5;
  pactx.strokeStyle = '#f5f5f5';
  for (let x = 0; x < $('#pixel_art_size').val(); x++) {
    cell_x[x] = 0;
    pactx.beginPath();
    pactx.moveTo(x * cell_size_pixel, 0);
    pactx.lineTo(x * cell_size_pixel, pac.width);
    pactx.stroke();
  }
  for (let y = 0; y < $('#pixel_art_size').val(); y++) {
    cells[y] = cell_x;
    pactx.beginPath();
    pactx.moveTo(0, y * cell_size_pixel);
    pactx.lineTo(pac.height, y * cell_size_pixel);
    pactx.stroke();
  }
  roll_back_obj.pixel.push(cells);
  dactx.fillStyle = 'white';
  dactx.fillRect(0, 0, dac.width, dac.height);
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
function return_for_memory_value (key) {
  let value;
  if ($('#pixel_art').prop('checked')) {
    let arry = deepCopyArray(roll_back_obj.pixel[roll_back_obj.pixel.length - roll_back_obj.c_pixel - 1]);
    value = {canvas: 'pixel_art', data: arry};
    if ($('#pixel_art_canvas_frame').attr('data-fileName') !== '') {
      $('#' + key).children('span').addClass('titled');
      $('#' + key).children('span').text($('#pixel_art_canvas_frame').attr('data-fileName'));
    }
  }
  if ($('#map_art').prop('checked')) {
    let arry = deepCopyArray(roll_back_obj.map[roll_back_obj.map.length - roll_back_obj.c_map - 1]);
    value = {canvas: 'map_art', data: arry};
    if ($('#map_art_canvas_frame').attr('data-fileName') !== '') {
      $('#' + key).children('span').addClass('titled');
      $('#' + key).children('span').text($('#map_art_canvas_frame').attr('data-fileName'));
    }
  }
  if ($('#draw_art').prop('checked')) {
    let img = dactx.getImageData(0, 0, dac.width, dac.height);
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    c.width = dac.width;
    c.height = dac.height;
    ctx.putImageData(img, 0, 0);
    data = c.toDataURL();
    value = {canvas: 'draw_art', data: data};
    if ($('#draw_art_canvas_frame').attr('data-fileName') !== '') {
      $('#' + key).children('span').addClass('titled');
      $('#' + key).children('span').text($('#draw_art_canvas_frame').attr('data-fileName'));
    }
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
    let value = return_for_memory_value (key);
    add_new_obj_to_memory_obj (key,value);
  } else {
    return true;
  }
}
//one time memory delete action
function otm_delete(e) {
  let str = '';
  if ($('header .header_form p.language').text() === 'Japanese') {
    str = "保存データが消えますがよろしいですか？";
  }
  if ($('header .header_form p.language').text() === '英語') {
    str = "Saved data will be lost, is this OK?";
  }
  let result = window.confirm(str);
  if (!result) {
    return false;
  }
  let target_id = $(e).parent().attr('id');
  if ($('#' + target_id).attr('data-check').length) {
    $('#' + target_id).removeAttr('data-check');
    $(e).css('display', 'none');
    $('#' + target_id).children('i.fa-bookmark').css('display', 'inline-block');
    let key = target_id;
    delete_memory_from_obj (key);
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
    $('#pixel_art_canvas_frame').attr('data-fileName', '');
    if (name !== null) {
      $('#pixel_art_canvas_frame').attr('data-fileName', name);
    }
    $('#pixel_art_size').val(value.data[0].length);
    $('.aside_menu label[for="for_pixel_art_size"]').click();
    //into canvas
    make_canvas (value.data);
    add_canvas_to_roll_back_obj (value.data);
  }
  if (value.canvas === 'map_art' && $('#map_art').prop('checked')) {
    $('#map_art_canvas_frame').attr('data-fileName', '');
    if (name !== null) {
      $('#map_art_canvas_frame').attr('data-fileName', name);
    }
    $('#map_art_size').val(value.data[0].length);
    $('.aside_menu label[for="for_map_art_size"]').click();
    //into canvas
    make_canvas (value.data);
    add_canvas_to_roll_back_obj (value.data);
  }
  if (value.canvas === 'draw_art' && $('#draw_art').prop('checked')) {
    let url = value.data;
    let img = new Image();
    img.onload = function (e) {
      dac.width = img.width;
      dac.width = img.height;
      dactx.drawImage(img, 0, 0, dac.width, dac.width);
      setTimeout((e) => {
        let roll_back = dactx.getImageData(0, 0, dac.width, dac.height);
        add_canvas_to_roll_back_obj (roll_back);
      }, 1)
    };
    img.crossOrigin = 'anonymous';
    img.src = url;
    $('#draw_art_canvas_frame').attr('data-fileName', '');
    if (name !== null) {
      $('#draw_art_canvas_frame').attr('data-fileName', name);
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
  let str = '';
  if ($('header .header_form p.language').text() === 'Japanese') {
    str = "選択したメモリが消えますがよろしいですか？";
  }
  if ($('header .header_form p.language').text() === '英語') {
    str = "Are you sure you want to erase the selected memory?";
  }
  let result = window.confirm(str);
  if (!result) {
    return false;
  }
  let target_id = $('#syncer-acdn-03 li[data-target="target_memorys"] p.target').parent().attr('id');
  $('#' + target_id).remove();
  let key = target_id;
  delete_memory_from_obj (key);
  let i = 1;
  $('#syncer-acdn-03 li[data-target="target_memorys"]').each(function(index, element) {
    let target_key = $(element).attr('id');
    let value = memory_obj[target_key];
    if (value === undefined) {
      return false;
    }
    delete_memory_from_obj (target_key);
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
  if (value === undefined) {
    return false;
  }
  let canvas_style = value.canvas;
  let getStr = "";
  getStr = getStr + "_canvas_" + canvas_style + "_canvas_";
  if (canvas_style === 'draw_art') {
    getStr = getStr + "_split_";
    let url = value.data;
    url = encodeURIComponent(url);
    getStr = getStr + "_drawUrl_" + url + "_drawUrl_";
    let getTitle = $('#' + target_id).children("span").text();
    let blob = new Blob([getStr], { type: "text/plain" });
    let link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = getTitle + ".txt";
    link.click();
    link.remove();
  }
  else {
    let data = deepCopyArray(value.data);
    data = data.map(row => row.map(item => item === 0 ? '' : item));
    const getTitle = $('#' + target_id).children("span").text(); // ファイル名
    const sheet_name = canvas_style + '_size_' + value.data.length; // シート名

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, sheet_name); // シート名を設定
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }); // 'array' を指定
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getTitle + '.xlsx'; // ファイル名を設定
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  }
});
//data upload
/*https://javascript.keicode.com/newjs/how-to-read-file-with-file-api.php*/
function showDialog() {
  return new Promise((resolve) => {
    $("#dialog").dialog({
      modal: true,
      buttons: {
        PixelArt: function() {
          $(this).dialog("close");
          resolve('pixel_art');
        },
        MapArt: function() {
          $(this).dialog("close");
          resolve('map_art');
        }
      },
      closeOnEscape: false,
      open: function(event, ui) {
        $(".ui-dialog-titlebar-close").show();
        $(".ui-dialog-titlebar-close").click(function() {
          resolve(false);
        });
      },
      close: function() {
        return false;
      }
    });
  });
}
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
async function upload_memory_fun(e){
  let target_id = $('#syncer-acdn-03 li[data-target="target_memorys"] p.target').parent().attr('id');
  if (target_id === undefined || target_id === '') {
    $('#upload_memory').val("");
    return false;
  }
  const file = e.target.files[0];
  if (file === undefined) {
    return false;
  }
  let str1 = file.name;
  let data_flag;
  const fileExtension = str1.split('.').pop().toLowerCase();
  if (fileExtension === 'xlsx' || fileExtension === 'xls') {
    data_flag = 'excel';
  } else if (fileExtension === 'txt') {
    data_flag = 'text';
  } else {
    return false;
  }
  $('#' + target_id + ' span').addClass('titled');
  const title_in_it = document.querySelector('#' + target_id + ' span.titled');
  if (data_flag === 'text') {
    const reader = new FileReader();
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
        let str = '';
        if ($('header .header_form p.language').text() === 'Japanese') {
          str = '設計図の「block_placement.xlsx」を入れて下さい。';
        }
        if ($('header .header_form p.language').text() === '英語') {
          str = 'Please upload "block_placement.xlsx" in the blueprint data.';
        }
        $('#' + target_id + ' span').removeClass('titled');
        $('#upload_memory').val('');
        window.alert(str);
        return false;
      }
      $('#' + target_id).attr('data-check', 'checked');
      $('#' + target_id).children('i.fa-bookmark').css('display', 'none');
      $('#' + target_id).children('i.fa-delete-left').css('display', 'inline-block');
      let key = target_id;
      add_new_obj_to_memory_obj (key,{canvas: canvas_style, data: html});
      str1 = str1.split(".").slice(0, 1);
      title_in_it.innerText = str1;
      $('#upload_memory').val('');
    };
    reader.readAsText(file);
  }
  if (data_flag === 'excel') {
    const reader = new FileReader();
    reader.onload = async function(e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      let sheet_name = workbook.SheetNames[0]; // 最初のシート名を取得（適宜調整）
      const worksheet = workbook.Sheets[sheet_name];
      const dataArray = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      let arry = deepCopyArray(dataArray);
      arry = arry.map(row => row.map(item => item === '' ? 0 : item));
      sheet_name = sheet_name.split('_size_');
      let canvas_style = 'pixel_art';
      if (sheet_name[1]) {
        canvas_style = sheet_name[0];
      } else {
        canvas_style = false;
        canvas_style = await showDialog();
        if (canvas_style === false) {
          $('#' + target_id + ' span').removeClass('titled');
          $('#upload_memory').val('');
          return false;
        }
        if (canvas_style === 'map_art') {
          if (arry.length <= 128) {
            arry = build_new_board(128, arry);
          }
          else if (arry.length <= 256) {
            arry = build_new_board(256, arry);
          }
          else {
            arry = build_new_board(512, arry);
          }
        }
      }
      $('#' + target_id).attr('data-check', 'checked');
      $('#' + target_id).children('i.fa-bookmark').css('display', 'none');
      $('#' + target_id).children('i.fa-delete-left').css('display', 'inline-block');
      let key = target_id;
      add_new_obj_to_memory_obj (key,{canvas: canvas_style, data: arry});
      str1 = str1.split(".").slice(0, 1);
      title_in_it.innerText = str1;
      $('#upload_memory').val('');
    };
    reader.readAsArrayBuffer(file);
  }
}
$('#upload_memory').change(upload_memory_fun);
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
  $('#memory_text').off('change blur');
  let html = '<input type="text" id="memory_text" required　minlength="0" size="22" spellcheck="true">';
  $('#syncer-acdn-03 li[data-target="target_memorys"] p.target').parent().prepend(html);
  let bef_text = $('#syncer-acdn-03 li[data-target="target_memorys"] p.target').parent().children('span').text();
  $('#memory_text').val(bef_text);
  $('#memory_text').css('left', 40);
  $('#memory_text').css('top', 2);
  $('#memory_text').select();
  $('#memory_text').on('change',change_memory_text);
  $('#memory_text').on('blur',change_memory_text);
});
//canvas clear action
$('#clear_canvas').click((e) => {
  let str = '';
  if ($('header .header_form p.language').text() === 'Japanese') {
    str = "キャンバスを消去します。";
  }
  if ($('header .header_form p.language').text() === '英語') {
    str = "Clear the canvas.";
  }
  let result = window.confirm(str);
  if (!result) {
    return false;
  }
  if($('#pixel_art').prop('checked') && !$('#map_canvas_open_icon').prop('checked')) {
    $('#pixel_art_canvas_frame').attr('data-fileName', '');
    let cell_x = [];
    let cells = [];
    pactx.fillStyle = 'white';
    pactx.fillRect(0, 0, pac.width, pac.height);
    pactx.lineWidth = 0.5;
    pactx.strokeStyle = '#f5f5f5';
    for (let x = 0; x < $('#pixel_art_size').val(); x++) {
      cell_x[x] = 0;
      pactx.beginPath();
      pactx.moveTo(x * cell_size_pixel, 0);
      pactx.lineTo(x * cell_size_pixel, pac.width);
      pactx.stroke();
    }
    for (let y = 0; y < $('#pixel_art_size').val(); y++) {
      cells[y] = cell_x;
      pactx.beginPath();
      pactx.moveTo(0, y * cell_size_pixel);
      pactx.lineTo(pac.height, y * cell_size_pixel);
      pactx.stroke();
    }
    add_canvas_to_roll_back_obj (cells);
  }
  if($('#map_art').prop('checked') && !$('#map_canvas_open_icon').prop('checked')) {
    $('#map_art_canvas_frame').attr('data-fileName', '');
    let cell_x = [];
    let cells = [];
    mactx.fillStyle = 'white';
    mactx.fillRect(0, 0, mac.width, mac.height);
    mactx.lineWidth = 0.5;
    mactx.strokeStyle = '#f5f5f5';
    for (let x = 0; x < $('#map_art_size').val(); x++) {
      cell_x[x] = 0;
      mactx.beginPath();
      mactx.moveTo(x * cell_size_map, 0);
      mactx.lineTo(x * cell_size_map, mac.width);
      mactx.stroke();
    }
    for (let y = 0; y < $('#map_art_size').val(); y++) {
      cells[y] = cell_x;
      mactx.beginPath();
      mactx.moveTo(0, y * cell_size_map);
      mactx.lineTo(mac.height, y * cell_size_map);
      mactx.stroke();
    }
    add_canvas_to_roll_back_obj (cells);
  }
  if($('#draw_art').prop('checked') && !$('#map_canvas_open_icon').prop('checked')) {
    $('#draw_art_canvas').attr('data-fileName', '');
    all_removeEventListener (e);
    dactx.fillStyle = "white";
    dactx.fillRect(0, 0, dac.width, dac.height);
    add_canvas_to_roll_back_obj (null);
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
  let inputValue = $(this).val();
  if (!/^\d*$/.test(inputValue) || inputValue === '') {
    $(this).val(30);
    return false;
  }
  if (inputValue > 512) {
    $(this).val(512);
  }
});
//open drag-and-drop-area from aside iocn
$('.aside_menu .change_to_pixel_art').click((e) => {
  if (!$('#map_canvas_open_icon').prop('checked')) {
    $('#drag-and-drop-area').css('display', 'flex');
    $('#editing_areas').css('width', '600px');
    $('#editing_areas').css('height', '600px');
    const edit = document.getElementById("editing_areas");
    document.body.style.scrollBehavior = "smooth";
    window.scrollTo(0, 0);
    edit.scrollLeft = 0;
    edit.scrollTop = 0;
    document.body.style.scrollBehavior = "auto";
  }
  if ($('#map_canvas_open_icon').prop('checked')) {
    $('#color_pick_map_drag-and-drop-area').css('display', 'flex');
    $('#color_pick_map').css('width', '600px');
    $('#color_pick_map').css('height', '600px');
    const cpm = document.getElementById("color_pick_map");
    document.body.style.scrollBehavior = "smooth";
    window.scrollTo(0, 0);
    cpm.scrollLeft = 0;
    cpm.scrollTop = 0;
    document.body.style.scrollBehavior = "auto";
  }
});
//check_view display
const cvc = document.getElementById("check_view");
const cvctx = cvc.getContext("2d");
let check_view_fun = function (e) {
  $('#check_view').css('display', 'block');
  if ($('#draw_art').prop('checked')) {
    let name = $('#draw_art_canvas_frame').attr('data-fileName');
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
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    let w, h, name, nL, arry;
    if ($('#map_art').prop('checked')) {
      arry = deepCopyArray(roll_back_obj.map[roll_back_obj.map.length - roll_back_obj.c_map - 1]);
      w = arry.length;
      h = arry[0].length;
      name = $('#map_art_canvas_frame').attr('data-fileName');
      nL = name.length;
    }
    if ($('#pixel_art').prop('checked')) {
      arry = deepCopyArray(roll_back_obj.pixel[roll_back_obj.pixel.length - roll_back_obj.c_pixel - 1]);
      w = arry.length;
      h = arry[0].length;
      name = $('#pixel_art_canvas_frame').attr('data-fileName');
      nL = name.length;
    }
    c.width = w;
    c.height = h;
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        let alt = arry[j][i];
        if (alt == 0) {
          continue;
        }
        if ($('#map_art').prop('checked')) {
          ctx.fillStyle = cp_obj[alt].color;
          ctx.fillRect(i, j, 1, 1);
        }
        if ($('#pixel_art').prop('checked')) {
          let rgba = $('#CP .CPimg img[alt="' + alt + '"]').css("background-color");
          ctx.fillStyle = rgba;
          ctx.fillRect(i, j, 1, 1);
        }
      }
    }
    cvctx.drawImage(c, 0, 0, c.width, c.height, 0, 0, 171, 171);
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
  let x,y;
  let min_map_size = 171;
  let edit = document.getElementById('editing_areas');
  if (obj.use === 'mouse') {
    x = e.clientX - cvc.getBoundingClientRect().left;
    y = e.clientY - cvc.getBoundingClientRect().top;
  }
  if (obj.use === 'touch') {
    x = e.touches[0].clientX - cvc.getBoundingClientRect().left;
    y = e.touches[0].clientY - cvc.getBoundingClientRect().top;
  }
  if ($('#pixel_art').prop('checked')) {
    cell_size_map = cvc.width / $('#pixel_art_size').val();
    x = Math.floor(x / cell_size_map);
    y = Math.floor(y / cell_size_map);
    cell_size_map = pac.width / $('#pixel_art_size').val();
  }
  if ($('#map_art').prop('checked')) {
    cell_size_map = cvc.width / $('#map_art_size').val();
    x = Math.floor(x / cell_size_map);
    y = Math.floor(y / cell_size_map);
    cell_size_map = mac.width / $('#map_art_size').val();
  }
  if ($('#draw_art').prop('checked')) {
    cell_size_map = ($("#draw_art_scale").val() / 100) * dac.width / cvc.width;
  }
  x = x * cell_size_map - edit.clientWidth / 2;
  y = y * cell_size_map - edit.clientHeight / 2;
  edit.scrollLeft = x;
  edit.scrollTop = y;
}
cvc.addEventListener('mousedown', (e) => {
  obj.use = 'mouse';
  canvas_to_move_check_view_point(e);
});
cvc.addEventListener('mouseenter', (e) => {
  $('#check_view').css('cursor', 'crosshair');
});
cvc.addEventListener('mouseleave', (e) => {
  $('#check_view').css('cursor', 'default');
});
cvc.addEventListener('touchstart', (e) => {
  obj.use = 'touch';
  canvas_to_move_check_view_point(e);
});
//resize canvas table
function build_new_board(size, old_arry) {
  let new_arry = [];
  for (let y = 0; y < size; y++) {
    if (!new_arry[y]) {
      new_arry[y] = [];
    }
    for (let x = 0; x < size; x++) {
      let id = 0;
      if (x < old_arry[0].length && y < old_arry.length) {
        id = old_arry[y][x];
      }
      new_arry[y][x] = id;
    }
  }
  return new_arry;
}
$("#resize_button").click(function () {
  if ($('#draw_art').prop('checked'))  {
    return false;
  }
  let size, new_arry, old_arry;
  if ($('#pixel_art').prop('checked')) {
    size = $('#pixel_art_size').val();
    if (size === '') {
      size = 30;
      $('#pixel_art_size').val(30);
    }
    if (size > 512) {
      size = 512;
      $('#pixel_art_size').val(512);
    }
    old_arry = deepCopyArray(roll_back_obj.pixel[roll_back_obj.pixel.length - roll_back_obj.c_pixel - 1]);
  }
  if ($('#map_art').prop('checked')) {
    size = $('#map_art_size').val();
    old_arry = deepCopyArray(roll_back_obj.map[roll_back_obj.map.length - roll_back_obj.c_map - 1]);
  }
  if (size >= old_arry.length) {
    new_arry = build_new_board(size, old_arry);
  }
  else {
    let result;
    if ($('header .header_form p.language').text() === 'Japanese') {
      result = confirm('アートが消えますが続けますか？');
    }
    if ($('header .header_form p.language').text() === '英語') {
      result = confirm('The Art maybe be disappeared, will you continue?');
    }
    if (result) {
      new_arry = build_new_board(size, old_arry);
    } else {
      if ($('#map_art').prop('checked')) {
        $('#map_art_size').val(old_arry.length);
      }
      if ($('#pixel_art').prop('checked')) {
        $('#pixel_art_size').val(old_arry.length);
      }
      return false;
    }
  }
  add_canvas_to_roll_back_obj (new_arry);
  make_canvas (new_arry);
});
//file download
function return_str_unescape_html(string) {
  if (typeof string !== "string") {
    return string;
  }
  return string.replace(/(&amp;|&#x27;|&#x60;|&quot;|&lt;|&gt;)/g, function (match) {
    return {
      "&amp;": "&",
      "&#x27;": "'",
      "&#x60;": "`",
      "&quot;": '"',
      "&lt;": "<",
      "&gt;": ">"
    }[match];
  });
}
function make_map_art_fun(arry, type) {
  let coordinate = [];
  coordinate[0] = $('#coordinate_x').val();
  coordinate[1] = $('#coordinate_y').val();
  coordinate[2] = $('#coordinate_z').val();
  for (let i = 0; i < coordinate.length; i++) {
    if (coordinate[i] === '' || coordinate[i] === undefined) {
      coordinate[i] = 0;
    }
    coordinate[i] = Number(coordinate[i]);
    if (i !== 1) {
      coordinate[i] = Math.floor((coordinate[i] + 64) / 128) * 128 - 64;
    }
  }
  let str = 'tp @p ' + coordinate[0] + ' ' + coordinate[1] + ' ' + coordinate[2] + '\n';
  if (type === 'je') {
    str = 'execute as @p at @s run teleport @s ' + coordinate[0] + ' ' + coordinate[1] + ' ' + coordinate[2] + '\n';
  }
  for (let j = 0; j < arry.length; j++) {
    for (let i = 0; i < arry[0].length; i++) {
      let x = coordinate[0] + i;
      let y = coordinate[1];
      let z = coordinate[2] + j;
      let id = '';
      let alt = arry[j][i];
      if (type === 'be') {
        id = 'air';
        if (alt != 0) {
          id = return_str_unescape_html(command_obj[alt][0]);
        }
      }
      if (type === 'je') {
        id = 'minecraft:air';
        if (alt != 0) {
          id = return_str_unescape_html(command_obj[alt][1]);
        }
      }
      if (id === '') {
        continue;
      }
      str += 'fill ' + x + ' ' + y + ' ' + z + ' ' + x + ' ' + y + ' ' + z + ' ' + id + '\n';
    }
  }
  return str;
}
function make_pixel_art_fun(arry, type) {
  let coordinate = [];
  coordinate[0] = $('#coordinate_x').val();
  coordinate[1] = $('#coordinate_y').val();
  coordinate[2] = $('#coordinate_z').val();
  for (let i = 0; i < coordinate.length; i++) {
    if (coordinate[i] === '' || coordinate[i] === undefined) {
      coordinate[i] = 0;
    }
    coordinate[i] = Number(coordinate[i]);
  }
  let str = 'tp @p ' + coordinate[0] + ' ' + coordinate[1] + ' ' + coordinate[2] + '\n';
  if (type === 'je') {
    str = 'execute as @p at @s run teleport @s ' + coordinate[0] + ' ' + coordinate[1] + ' ' + coordinate[2] + '\n';
  }
  for (let j = 0; j < arry.length; j++) {
    for (let i = 0; i < arry[0].length; i++) {
      let x = coordinate[0] + i - (arry[0].length / 2);
      let y = coordinate[1] - j + arry.length;
      let z = coordinate[2];
      if ($('#make_art_direction').val() === 'horizon') {
        x = coordinate[0] + i - (arry[0].length / 2);
        y = coordinate[1];
        z = coordinate[2] + j - (arry.length / 2);
      }
      let id = '';
      let alt = arry[j][i];
      if (type === 'be') {
        id = 'air';
        if (alt != 0) {
          id = return_str_unescape_html(command_obj[alt][0]);
        }
      }
      if (type === 'je') {
        id = 'minecraft:air';
        if (alt != 0) {
          id = return_str_unescape_html(command_obj[alt][1]);
        }
      }
      if (id === '') {
        continue;
      }
      str += 'fill ' + x + ' ' + y + ' ' + z + ' ' + x + ' ' + y + ' ' + z + ' ' + id + '\n';
    }
  }
  return str;
}
function return_blockC_imgUrl_skinUrl(arry, type) {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  c.width = arry[0].length * 20;
  c.height = arry.length * 20;
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, c.width, c.height);
  const dc = document.createElement("canvas");
  const dctx = dc.getContext("2d");
  dc.width = arry[0].length * 20;
  dc.height = arry.length * 20;
  dctx.fillStyle = 'white';
  dctx.fillRect(0, 0, dc.width, dc.height);
  let count_block = [];
  for (let y = 0; y < arry.length; y++) {
    count_block = count_block.concat(arry[y]);
    for (let x = 0; x < arry[0].length; x++) {
      let alt = arry[y][x];
      let rgb = 'white';
      if (alt != 0) {
        if (type === 'map_art') {
          rgb = cp_obj[alt].color;
        }
        if (type === 'pixel_art') {
          rgb = $('#CP .CPimg img[alt="' + alt + '"]').css('backgroundColor');
        }
      }
      ctx.fillStyle = rgb;
      ctx.fillRect(x * 20, y * 20, 20, 20);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 0.1;
      ctx.strokeRect(x * 20, y * 20, 20, 20);
      if ($('#need_block_skins').prop('checked')) {
        if (alt != 0) {
          dctx.drawImage(cp_obj[alt].img, x * 20, y * 20, 20, 20);
        }
        dctx.strokeStyle = "black";
        dctx.lineWidth = 0.1;
        dctx.strokeRect(x * 20, y * 20, 20, 20);
      }
    }
  }
  let count = {};
  count_block.forEach(function (i) {
    count[i] = (count[i] || 0) + 1;
  });
  delete count[0];
  let keyArray = Object.keys(count);
  let valArray = [];
  keyArray.forEach(function (element) {
    valArray.push(count[element]);
  });
  count_block = [];
  count_block[0] = keyArray;
  count_block[1] = valArray;
  return {count: count_block, c_img: c.toDataURL('image/png'), c_skin: dc.toDataURL('image/png')};
}
function func1(arry, canvas_style) {
  arry = arry.map(row => row.map(item => item === 0 ? '' : item));
  const sheet_name = canvas_style + '_size_' + arry.length; // シート名
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(arry);
  XLSX.utils.book_append_sheet(wb, ws, sheet_name); // シート名を設定
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }); // 'array' を指定
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  return blob;
}
function imgblob(dataurl) {
  let bin = atob(dataurl.split(",")[1]);
  let buffer = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i);
  }
  return new Blob([buffer.buffer], { type: 'image/png' });
}
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
  let arry = [];
  if ($('#map_art').prop('checked')) {
    arry = deepCopyArray(roll_back_obj.map[roll_back_obj.map.length - roll_back_obj.c_map - 1]);
  }
  if ($('#pixel_art').prop('checked')) {
    arry = deepCopyArray(roll_back_obj.pixel[roll_back_obj.pixel.length - roll_back_obj.c_pixel - 1]);
  }
  let placeExcelBlob, needExcelBlob, cBlobImg, cBlobSkin, fun_text, nameArr, blobArr, obj;
  if ($('#map_art').prop('checked')) {
    obj = return_blockC_imgUrl_skinUrl(arry, 'map_art');
    placeExcelBlob = func1(arry, 'map_art');
    needExcelBlob = func1(obj.count, 'map_art');
    cBlobImg = imgblob(obj.c_img);
    nameArr = ['block_placement.xlsx', 'items_needed.xlsx', 'art_image.png'];
    blobArr = [placeExcelBlob, needExcelBlob, cBlobImg];
    if ($('#need_block_skins').prop('checked')) {
      cBlobSkin = imgblob(obj.c_skin);
      nameArr.push('art_skin_image.png');
      blobArr.push(cBlobSkin);
    }
    if ($('#need_fun_for_be').prop('checked')) {
      fun_text = make_map_art_fun(arry, 'be');
      const blob = new Blob([fun_text], { type: "text/plain" });
      nameArr.push('map_be.mcfunction');
      blobArr.push(blob);
    }
    if ($('#need_fun_for_je').prop('checked')) {
      fun_text = make_map_art_fun(arry, 'je');
      const blob = new Blob([fun_text], { type: "text/plain" });
      nameArr.push('map_je.mcfunction');
      blobArr.push(blob);
    }
  }
  if ($('#pixel_art').prop('checked')) {
    obj = return_blockC_imgUrl_skinUrl(arry, 'pixel_art');
    placeExcelBlob = func1(arry, 'pixel_art');
    needExcelBlob = func1(obj.count, 'pixel_art');
    cBlobImg = imgblob(obj.c_img);
    nameArr = ['block_placement.xlsx', 'items_needed.xlsx', 'art_image.png'];
    blobArr = [placeExcelBlob, needExcelBlob, cBlobImg];
    if ($('#need_block_skins').prop('checked')) {
      cBlobSkin = imgblob(obj.c_skin);
      nameArr.push('art_skin_image.png');
      blobArr.push(cBlobSkin);
    }
    if ($('#need_fun_for_be').prop('checked')) {
      fun_text = make_pixel_art_fun(arry, 'be');
      const blob = new Blob([fun_text], { type: "text/plain" });
      nameArr.push('pixel_be.mcfunction');
      blobArr.push(blob);
    }
    if ($('#need_fun_for_je').prop('checked')) {
      fun_text = make_pixel_art_fun(arry, 'je');
      const blob = new Blob([fun_text], { type: "text/plain" });
      nameArr.push('pixel_je.mcfunction');
      blobArr.push(blob);
    }
  }
  if ($('#draw_art').prop('checked')) {
    const dac = document.getElementById("draw_art_canvas");
    cBlobImg = imgblob(dac.toDataURL('image/png'));
    nameArr = ["rough_sketch_image.png"];
    blobArr = [cBlobImg];
  }
  zipDownloop(nameArr, blobArr);
  $('#wait').addClass('hidden');
}
function edit_command_id(e) {
  $('#change_command').css('backgroundColor', '#fff');
  let text = $('#command_table input[name="command"]:checked ~ span').text();
  $('#change_command').val(text);
}
function fold_command_table(e) {
  let target_class = $(event.target).attr('class');
  if (event.target.tagName[0] === 'T') {
    target_class = $(event.target).children('i').attr('class');
  }
  setTimeout(() => {
    if (target_class === 'fa-solid fa-square-caret-down') {
      $('#command_table thead th i').each((i, ele) => {
        $(ele).attr('class', 'fa-solid fa-square-caret-up');
        $('#command_table tbody').css('display', '');
        $('#plan_to_download_Blueprint .second.plan .table_frame').css('height', 'calc(600px * 0.9 - 60px)');
      });
    }
    if (target_class === 'fa-solid fa-square-caret-up') {
      $('#command_table thead th i').each((i, ele) => {
        $(ele).attr('class', 'fa-solid fa-square-caret-down');
        $('#command_table tbody').css('display', 'none');
        $('#plan_to_download_Blueprint .second.plan .table_frame').css('height', '100%');
      });
    }
  }, 4);
}
function validateInput(inputElement) {
  const inputValue = inputElement.value;
  const regex = /[^a-zA-Z0-9_=-\[\]"\/:\s-]/g;
  if (regex.test(inputValue)) {
    inputElement.value = inputValue.replace(/[^a-zA-Z0-9_=-\[\]"\/:\s-]/g, '');
  }
}
function build_command_table (e) {
  let table = '<thead><tr>';
  table += '<th class="bk_title" onclick="fold_command_table(this)">Block Name <i class="fa-solid fa-square-caret-up" onclick="fold_command_table(this)"></i></th>';
  table += '<th class="be_title" onclick="fold_command_table(this)">ID for B.E. <i class="fa-solid fa-square-caret-up" onclick="fold_command_table(this)"></i></th>';
  table += '<th class="je_title" onclick="fold_command_table(this)">ID for J.E. <i class="fa-solid fa-square-caret-up" onclick="fold_command_table(this)"></i></th>';
  table += '</tr></thead>';
  table += '<tbody>';
  for (let alt in command_obj) {
    let be = command_obj[alt][0];
    let je = command_obj[alt][1];
    table += '<tr>';
    table += '<th class="bk_name"><label><input onchange="edit_command_id()" type="radio" name="command" value="' + alt + '"/><span class="command">' + alt + '</span></label></th>';
    if (be === null) {
      table += '<td class="be_name" data-id="empty"><label><input onchange="edit_command_id()" type="radio" name="command" value="' + alt + '"/><span class="command"></span></label></td>';
    } else {
      table += '<td class="be_name"><label><input onchange="edit_command_id()" type="radio" name="command" value="' + alt + '"/><span class="command">' + be + '</span></label></td>';
    }
    if (je === null) {
      table += '<td class="je_name" data-id="empty"><label><input onchange="edit_command_id()" type="radio" name="command" value="' + alt + '"/><span class="command"></span></label></td>';
    } else {
      table += '<td class="je_name"><label><input onchange="edit_command_id()" type="radio" name="command" value="' + alt + '"/><span class="command">' + je + '</span></label></td>';
    }
    table += '</tr>';
  }
  table += '</tbody>';
  $('#command_table').html(table);
}
$('#change_command').change((e) => {
  let result;
  if ($('header .header_form p.language').text() === 'Japanese') {
    result = confirm('idを変更してよろしいですか？');
  }
  if ($('header .header_form p.language').text() === '英語') {
    result = confirm('Are you sure you want to change the id?');
  }
  if (!result) {
    return false;
  }
  let text = $('#change_command').val();
  let alt = $('#command_table input[name="command"]:checked').val();
  let edition = $('#command_table input[name="command"]:checked').parent().parent().attr('class');
  if (text === '') {
    $('#change_command').css('backgroundColor', 'rgb(255, 150, 150)');
  }
  else {
    $('#change_command').css('backgroundColor', '#fff');
  }
  if (edition === 'bk_name' && text !== '') {
    let result = Object.keys(command_obj).find(key => key === text);
    if (result !== undefined) {
      if ($('header .header_form p.language').text() === 'Japanese') {
        alert('既に使われているBlock Nameです。');
      }
      if ($('header .header_form p.language').text() === '英語') {
        alert('Block Name already in use.');
      }
      return false;
    }
    $('#command_table input[name="command"]:checked ~ span').text(text);
    command_obj[text] = command_obj[alt];
    delete command_obj[alt];
    cp_obj[text] = cp_obj[alt];
    delete cp_obj[alt];
    $('#CP .CPimg img[alt="' + alt + '"]').attr('alt', text);
    $('#command_table input[value="' + alt + '"]').each((index, domEle) => {
      $(domEle).val(text);
    });
  }
  if (edition === 'be_name') {
    $('#command_table input[name="command"]:checked ~ span').text(text);
    command_obj[alt][0] = text;
    if (text === '') {
      command_obj[alt][0] = null;
      $('#command_table input[name="command"]:checked').parent().parent().attr('data-id', 'empty');
    }
    else if ($('#command_table input[name="command"]:checked').parent().parent().attr('data-id') === 'empty') {
      $('#command_table input[name="command"]:checked').parent().parent().attr('data-id', '');
    }
  }
  if (edition === 'je_name') {
    $('#command_table input[name="command"]:checked ~ span').text(text);
    command_obj[alt][1] = text;
    if (text === '') {
      command_obj[alt][1] = null;
      $('#command_table input[name="command"]:checked').parent().parent().attr('data-id', 'empty');
    }
    else if ($('#command_table input[name="command"]:checked').parent().parent().attr('data-id') === 'empty') {
      $('#command_table input[name="command"]:checked').parent().parent().attr('data-id', '');
    }
  }
});
$('#display_plan_of_Blueprint').click((e) => {
  $('#plan_menu_0').prop('checked', true);
  $('#plan_to_download_Blueprint').css('display', 'flex');
  $('#CP .CPimg').find('img').each(function(index, domEle) {
    let alt = $(domEle).attr('alt');
    let result = Object.keys(command_obj).find(key => key === alt);
    if (result === undefined) {
      command_obj[alt] = [null, null];
    }
  });
  if ($('#pixel_art').prop('checked')) {
    $('#plan_to_download_Blueprint .second.plan label.button').css('display', 'inline-block');
    $('#make_art_direction').css('display', 'block');
  }
  if ($('#map_art').prop('checked')) {
    $('#plan_to_download_Blueprint .second.plan label.button').css('display', 'inline-block');
    $('#make_art_direction').css('display', 'none');
  }
  if ($('#draw_art').prop('checked')) {
    $('#plan_to_download_Blueprint .second.plan label.button').css('display', 'none');
    $('#make_art_direction').css('display', 'none');
  }
  build_command_table ();
});
$('#download_datas_button').click((e) => {
  $('#wait').removeClass('hidden');
  downBlueprint(e);
});
$('#plan_to_download_Blueprint .plan_menu .slideshow_icon i').click((e) => {
  let target = $(event.target).parent().attr('class');
  let plan_menu_length = $('input[name="plan_menu"]').length;
  let now_id = $('input[name="plan_menu"]:checked').attr('id');
  now_id = now_id.toString();
  now_id = now_id.replace('plan_menu_','');
  now_id = Number(now_id);
  if (target === 'back_plan') {
    now_id--;
    if (now_id < 0) {
      now_id = plan_menu_length - 1;
    }
  }
  if (target === 'forward_plan') {
    now_id++;
    if (now_id > plan_menu_length - 1) {
      now_id = 0;
    }
  }
  $('#plan_to_download_Blueprint .plan_menu .slideshow_icon label[for="plan_menu_' + now_id + '"]').click();
});
$('input[name="plan_menu"]').change((e) => {
  $('#plan_to_download_Blueprint .plan_menu').scrollTop(0);
});
//export import id list
$('#plan_to_download_Blueprint .second.plan section .idList.export').click((e) => {
  let arry = [];
  for (let key in command_obj) {
    if (command_obj.hasOwnProperty(key)) {
      arry.push([key, command_obj[key][0], command_obj[key][1]]);
    }
  }
  const sheet_name = 'EachIDs'; // シート名

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(arry);
  XLSX.utils.book_append_sheet(wb, ws, sheet_name); // シート名を設定
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }); // 'array' を指定
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'command_ids.xlsx'; // ファイル名を設定
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
});
$('#idList_import').change((e) => {
  const file = e.target.files[0];
  if (file === undefined) {
    $('#idList_import').val('');
    return false;
  }
  const reader = new FileReader();
  reader.onload = async function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    let sheet_name = workbook.SheetNames[0]; // 最初のシート名を取得（適宜調整）
    const worksheet = workbook.Sheets[sheet_name];
    const dataArray = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    let arry = deepCopyArray(dataArray);
    let new_obj = {};
    arry.forEach(item => {
      if (item[1] === undefined) {
        item[1] = null;
      }
      if (item[2] === undefined) {
        item[2] = null;
      }
      new_obj[item[0]] = [item[1], item[2]];
    });
    command_obj = new_obj;
    build_command_table ();
    $('#idList_import').val('');
  };
  reader.readAsArrayBuffer(file);
});
$('#plan_to_download_Blueprint .second.plan section .idList.import').click((e) => {
  $('#idList_import').click();
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
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('touchmove', resize_target);
  document.addEventListener('touchmove', move_icon);
});
$("#for_palette_resize").on('touchend', function(e) {
  document.removeEventListener('touchmove', handleTouchMove);
  document.removeEventListener('touchmove', resize_target);
  document.removeEventListener('touchmove', move_icon);
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
  $("#CP .CPrgb").parent().each(function (index) {
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
    cp_obj = {};
    $('#CP .CPimg').find('img').each(function() {
      let alt = $(this).attr('alt');
      if (alt !== undefined) {
        let src = $(this).attr('src');
        let id = $('#CP .CPimg img[alt="' + alt + '"]').parent().parent().attr('id');
        const image = new Image();
        image.onload = () => {
          cp_obj[alt] = {img: image, color: $('#' + id + ' .CPrgb').css('backgroundColor')}
        };
        image.crossOrigin = 'anonymous'; // クロスオリジン属性を設定
        image.src = src;
      }
    });
    $("#palette_upload").val('');
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
  document.getElementById("color_dropper_icon").removeEventListener('change', reset_rgb_to_check_color_box);
  document.getElementById("map_canvas_open_icon").removeEventListener('change', reset_rgb_to_check_color_box);
}
function reset_rgb_to_check_color_box(e) {
  all_removeEL_at_pick ();
  let id = $("#CP label.check").attr("id");
  if (id === undefined) {
    return false;
  }
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
  let x = obj.end_x;
  let y = obj.end_y;
  let pixel = cpctx.getImageData(x, y, 1, 1);
  let data = pixel.data;
  all_removeEL_at_pick (e);
  if ($("#palette_lock").prop('checked')) {
    reset_rgb_to_check_color_box(e);
    return false;
  }
  if (!$("#palette_lock").prop('checked')) {
    let str = '';
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "マップ用の色玉を変更してよろしいですか？";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = 'Are you sure you want to change the "Color box" for the map art?';
    }
    let result = window.confirm(str);
    if (!result) {
      return false;
    }
    let id = $("#CP label.check").attr("id");
    const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    $("#" + id).children(".CPrgb").css("background-color", rgb);
    let alt = $('#' + id + ' .CPimg img.mImg').attr('alt');
    cp_obj[alt].color = rgb;
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
  obj.end_x = x;
  obj.end_y = y;
}
function color_pick_action_onmouse (e) {
  let x,y;
  x = e.clientX - cpc.getBoundingClientRect().left;
  y = e.clientY - cpc.getBoundingClientRect().top;
  search_map_colors(x,y);
}
function color_pick_action_ontouch (e) {
  let x,y;
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
    let str = '';
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "マップ用の色玉を変更してよろしいですか？";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = 'Are you sure you want to change the "Color box" for the map art?';
    }
    let result = window.confirm(str);
    if (!result) {
      return false;
    }
    let id = $("#CP label.check").attr("id");
    $("#" + id).children(".CPrgb").css("background-color", colorcode);
    let alt = $('#' + id + ' .CPimg img.mImg').attr('alt');
    cp_obj[alt].color = colorcode;
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
    document.getElementById("color_dropper_icon").addEventListener('change', reset_rgb_to_check_color_box);
    document.getElementById("map_canvas_open_icon").addEventListener('change', reset_rgb_to_check_color_box);
  }
});
//all removeEventListener at window remove
document.addEventListener('beforeunload', all_removeEL_at_pick);
document.addEventListener('mouseleave', all_removeEL_at_pick);
//remove_CP_boxes
$('#CP_icons .CP_icons_form button.remove_CP_box').click((e) => {
  let str = '';
  if ($('header .header_form p.language').text() === 'Japanese') {
    str = "選択したブロックを完全に消去してよろしいですか？";
  }
  if ($('header .header_form p.language').text() === '英語') {
    str = "Are you sure you want to erase the selected block completely?";
  }
  let result = window.confirm(str);
  if (!result) {
    return false;
  }
  let target_class = $('#CP label.check').parent().attr('class');
  if (target_class === 'color_named_blocks') {
    return false;
  }
  let alt = $('#CP label.check .CPimg img.mImg').attr('alt');
  delete cp_obj[alt];
  delete command_obj[alt];
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
        let str = '<label id="CP' + cp_L + '"><div class="CPrgb" style="background: rgb(0, 0, 0);"></div><div class="CPimg"></div></label>';
        $("#CP .add_new_blocks").append(str);
        const cp = document.querySelector('#CP' + cp_L + ' .CPimg');
        cp.appendChild(img);
        cp_obj[alt[0]] = {img: img, color: 'rgb(0, 0, 0)'};
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
            $("#CP" + cp_L).addClass('check');
            return false;
          }
          cp_L ++;
          callback (i, cp_L, files, upload_new_blocks);
        }, 0)
      };
      img.src = c.toDataURL();
      if (cp_obj.hasOwnProperty(alt[0])) {
        alt[0] = 'new_' + alt[0];
      }
      img.alt = alt[0];
      img.className = "mImg";
      command_obj[alt[0]] = [null, null];
    };
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
  $("#CP label.check").removeClass("check");
  $("#" + id).addClass('check');
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
  event.preventDefault();
  let id = $(this).attr('id');
  if (id === undefined) {
    return false;
  }
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
  let html = $('#' + id).html();
  $('#selected_color_box').append(html);
  document.addEventListener('mousemove', selected_color_box_move);
  document.addEventListener('mouseup', selected_color_box_into_group);
}
function selected_color_box_use_touch (e) {
  event.preventDefault();
  let id = $(this).attr('id');
  if (id === undefined) {
    return false;
  }
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
  obj.end_x = x;
  obj.end_y = y;
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
  obj.end_x = '';
  obj.end_y = '';
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
  removeEvent_selected_color_box ();
  $('#CP .active').removeClass('active');
  let x = obj.end_x;
  let y = obj.end_y;
  let elem = document.elementFromPoint(x, y);
  if (elem === null) {
    selected_color_box_reset ();
    return false;
  }
  let $elem = jQuery(elem);
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
  if (want_if === 'easy_to_gather') {
    if (obj.parent_class === 'easy_to_gather') {
      selected_color_box_reset ();
    }
    else {
      let target_class = '#CP .easy_to_gather';
      move_to_this_class(target_class);
    }
  }
  else if (want_if === 'hard_in_overworld') {
    if (obj.parent_class === 'hard_in_overworld') {
      selected_color_box_reset ();
    }
    else {
      let target_class = '#CP .hard_in_overworld';
      move_to_this_class(target_class);
    }
  }
  else if (want_if === 'in_nether') {
    if (obj.parent_class === 'in_nether') {
      selected_color_box_reset ();
    }
    else {
      let target_class = '#CP .in_nether';
      move_to_this_class(target_class);
    }
  }
  else if (want_if === 'in_end') {
    if (obj.parent_class === 'in_end') {
      selected_color_box_reset ();
    }
    else {
      let target_class = '#CP .in_end';
      move_to_this_class(target_class);
    }
  }
  else {
    selected_color_box_reset ();
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
//toggle radio checked action normal_tool & advanced_tool
let toggle_target = '.normal_tool > label:not(label[for="normal_tool_button"])';
toggle_target += ', label[for="line_bold_for_draw"]';
toggle_target += ', .advanced_tool > label:not(label[for="advanced_tool_button"]';
$(toggle_target).click(function (e) {
  let id = $(this).attr('for');
  toggle_radio_checked (id);
});
//toggle radio checked action rect_todo
$('.advanced_tool .sub_advanced_tool > label').click((e) => {
  let id = $('.advanced_tool .sub_advanced_tool > label:hover').attr('for');
  toggle_radio_at_area (id);
});
//change to no_set_action
function no_set_action_ClickOrTouch(e) {
  e.preventDefault();
  let id = 'no_set_action';
  toggle_radio_checked(id);
}
$('.normal_tool .normal_tool_button i.fa-pen-ruler').on('click touchstart', no_set_action_ClickOrTouch);
//line bold collect number
$('#line_bold_for_draw').change((e) => {
  if ($('#line_bold_for_draw').val() < 1) {
    $('#line_bold_for_draw').val(1);
  }
});
//pop up explain of roll_back_and_forward & ZoomUpDown
let pop_html_selecter = '.roll_back_and_forward .roll_back';
pop_html_selecter += ', .roll_back_and_forward .roll_forward';
pop_html_selecter += ', .zoom_in_out_scope label[for="plus_scope_icon"]';
pop_html_selecter += ', .zoom_in_out_scope label[for="minus_scope_icon"]';
$(pop_html_selecter).on('mouseenter', function(e) {
  obj.pop_text = $(this).children('span.shortcut').html();
  obj.use = 'mouse';
  pop_text_at_hover (e);
});
$(pop_html_selecter).on('mouseleave', function(e) {
  $('#CP_img_explanation').remove();
});
//pop up explain of sub_advanced_tool
let pop_text_selecter = '.advanced_tool .sub_advanced_tool .to_close_path';
pop_text_selecter += ', .advanced_tool .sub_advanced_tool .to_open_path';
pop_text_selecter += ', .advanced_tool .sub_advanced_tool label[for="for_cut_area"]';
pop_text_selecter += ', .advanced_tool .sub_advanced_tool label[for="for_copy_area"]';
$(pop_text_selecter).on('mouseenter', function(e) {
  obj.pop_text = $(this).children('span.shortcut').text();
  obj.use = 'mouse';
  pop_text_at_hover (e);
});
$(pop_text_selecter).on('mouseleave', function(e) {
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
let tool_icons_selecters = '.palette .palette_button > i';
tool_icons_selecters = tool_icons_selecters + ', .zoom_in_out_scope .zoom_scope_button > i';
tool_icons_selecters = tool_icons_selecters + ', .normal_tool .normal_tool_button > i';
tool_icons_selecters = tool_icons_selecters + ', .roll_back_and_forward .roll_both_button > i';
tool_icons_selecters = tool_icons_selecters + ', .advanced_tool .advanced_tool_button > i';
tool_icons_selecters = tool_icons_selecters + ', .palette .palette_button > .selected_block_img';
$(tool_icons_selecters).mousedown(function (e) {
  e.preventDefault();
  obj.use = 'mouse';
  let button_class = $(this).parent().attr('class');
  obj.$icon = choose_$icon_from_buttons_class (button_class);
  obj.start_x = e.clientX;
  obj.start_y = e.clientY;
  obj.icon_top = obj.$icon.offset().top - window.scrollY;
  obj.icon_left = obj.$icon.offset().left - window.scrollX;
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
  obj.icon_top = obj.$icon.offset().top - window.scrollY;
  obj.icon_left = obj.$icon.offset().left - window.scrollX;
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('touchmove', palette_button_move);
});
$(tool_icons_selecters).on('touchend', function(e) {
  document.removeEventListener('touchmove', handleTouchMove);
  document.removeEventListener('touchmove', palette_button_move);
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
let calcDelta_original = function (t, p) {
  return ( Math.pow((p.r - t.r) * 0.3, 2) + Math.pow((p.g - t.g) * 0.59, 2) + Math.pow((p.b - t.b) * 0.11, 2));
};
let chooseColor_for_blocks = function (calcDelta, palette, inrgb) {
  const rgb = convertToRGB(inrgb);
  let color, alt;
  let delta = Number.MAX_SAFE_INTEGER;
  Object.entries(palette).forEach(([key, value]) => {
    // カラーパレットの色(RGB)
    const prgb = convertToRGB(value);
    const d = calcDelta(rgb, prgb);
    if (d < delta) {
      color = value;
      delta = d;
      alt = key;
    }
  });
  return {alt: alt, color: color};
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
  let ratio_r = Number($('#sample_ratio_r').val()) * 100;
  let ratio_g = Number($('#sample_ratio_g').val()) * 100;
  let ratio_b = Number($('#sample_ratio_b').val()) * 100;
  let sum_ratio = ratio_r + ratio_g + ratio_b;
  sum_ratio /= 100;
  $('#sample_ratio_r').val(Math.floor(ratio_r / sum_ratio) / 100);
  $('#sample_ratio_g').val(Math.floor(ratio_g / sum_ratio) / 100);
  $('#sample_ratio_b').val(Math.floor(ratio_b / sum_ratio) / 100);
  let r_count = Number($('#sample_ratio_r').attr('data-count'));
  let g_count = Number($('#sample_ratio_g').attr('data-count'));
  let b_count = Number($('#sample_ratio_b').attr('data-count'));
  for (let k = 0; k < sample_array.length; k++) {
    if (k > 0) {
      ratio_r = ratio_r + (Math.random() - 0.5) * 20 * Math.exp(-r_count / 10);
      r_count++;
      if (ratio_r < 0) {
        ratio_r = 30;
      }
      ratio_g = ratio_g + (Math.random() - 0.5) * 20 * Math.exp(-g_count / 10);
      g_count++;
      if (ratio_g < 0) {
        ratio_g = 59;
      }
      ratio_b = ratio_b + (Math.random() - 0.5) * 20 * Math.exp(-b_count / 10);
      b_count++;
      if (ratio_b < 0) {
        ratio_b = 11;
      }
    }
    let sum = ratio_r + ratio_g + ratio_b;
    sum /= 100;
    ratio_r = Math.floor(ratio_r / sum) / 100;
    ratio_g = Math.floor(ratio_g / sum) / 100;
    ratio_b = Math.floor(ratio_b / sum) / 100;
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
    ratio_r *= 100;
    ratio_g *= 100;
    ratio_b *= 100;
  }
  $('#sample_ratio_r').attr('data-count', r_count);
  $('#sample_ratio_g').attr('data-count', g_count);
  $('#sample_ratio_b').attr('data-count', b_count);
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
      $('#pixel_art_size').val(30);
    }
    if (px > 512) {
      px = 512;
      $('#pixel_art_size').val(512);
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
  const palette = {};
  $('#CP .active').removeClass('active');
  if ($("#change_to_map_art_data").prop('checked')) {
    $("#CP .CPrgb").each(function (index, domEle) {
      let target = $(domEle).parent().parent().attr('class');
      if ($('#' + target).prop('checked')) {
        let alt = $(domEle).parent().children('.CPimg').children('img.mImg').attr('alt');
        let cpRgb = $(domEle).css("backgroundColor").toString();
        palette[alt] = cpRgb;
      }
    });
  }
  if ($("#change_to_pixel_art_data").prop('checked')) {
    $('#CP .CPimg img').each(function (index, domEle) {
      let target = $(domEle).parent().parent().parent().attr('class');
      if ($('#' + target).prop('checked')) {
        let alt = $(domEle).attr('alt');
        let cpImgColor = $(domEle).css("backgroundColor").toString();
        palette[alt] = cpImgColor;
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
  let cells = [];
  for (let i = 0; i < px; i++) {
    if (!cells[i]) {
      cells[i] = [];
    }
    for (let j = 0; j < px; j++) {
      let pixel = ctx.getImageData(j, i, 1, 1);
      let data = pixel.data;
      const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
      if (rgb === 'rgb(255, 255, 255)') {
        cells[i][j] = 0;
        continue;
      }
      if ($('#map_art').prop('checked') || $('#pixel_art').prop('checked')) {
        let catch_obj = chooseColor_for_blocks(calcDelta, palette, rgb);
        cells[i][j] = catch_obj.alt;
      }
      if ($('#draw_art').prop('checked')) {
        let catch_obj = chooseColor_for_blocks(calcDelta, palette, rgb);
        dactx.fillStyle = catch_obj.color;
        dactx.fillRect(j, i, 1, 1);
      }
    }
  }
  if ($('#map_art').prop('checked') || $('#pixel_art').prop('checked')) {
    add_canvas_to_roll_back_obj (cells);
    make_canvas (cells);
  }
  if ($('#draw_art').prop('checked')) {
    let value = dactx.getImageData(0, 0, dac.width, dac.height);
    add_canvas_to_roll_back_obj (value);
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
  $('#sample_ratio_r').attr('data-count', 1);
  $('#sample_ratio_g').attr('data-count', 1);
  $('#sample_ratio_b').attr('data-count', 1);
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
    $('#pixel_art').parent().click();
    obj.want_if = 'top_menu';
    change_to_pixel_art ();
    px = $('#pixel_art_size').val();
    if (px === '') {
      px = 30;
      $('#pixel_art_size').val(30);
    }
    if (px > 512) {
      px = 512;
      $('#pixel_art_size').val(512);
    }
  }
  if ($("#change_to_map_art_data").prop('checked')) {
    $('#map_art').parent().click();
    obj.want_if = 'top_menu';
    change_to_map_art ();
    px = $('#map_art_size').val();
  }
  const palette = {};
  if ($("#change_to_map_art_data").prop('checked')) {
    $("#CP .CPrgb").each(function (index, domEle) {
      let alt = $(domEle).parent().children('.CPimg').children('img.mImg').attr('alt');
      let cpRgb = $(domEle).css("backgroundColor").toString();
      palette[alt] = cpRgb;
    });
  }
  if ($("#change_to_pixel_art_data").prop('checked')) {
    $('#CP .CPimg img').each(function (index, domEle) {
      let alt = $(domEle).attr('alt');
      let cpImgColor = $(domEle).css("backgroundColor").toString();
      palette[alt] = cpImgColor;
    });
  }
  let sc = 600 / px;
  let cells = [];
  for (let i = 0; i < px; i++) {
    if (!cells[i]) {
      cells[i] = [];
    }
    for (let j = 0; j < px; j++) {
      let pixel = dactx.getImageData(j * sc, i * sc, 1, 1);
      let data = pixel.data;
      const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
      if (rgb === 'rgb(255, 255, 255)') {
        cells[i][j] = 0;
        continue;
      }
      let result = Object.keys(palette).find(key => palette[key] === rgb);
      if (result === undefined) {
        let ratio_r = Number($('#sample_ratio_r').val());
        let ratio_g = Number($('#sample_ratio_g').val());
        let ratio_b = Number($('#sample_ratio_b').val());
        let calcDelta = function ( t, p) {
          return ( Math.pow((p.r - t.r) * ratio_r, 2) + Math.pow((p.g - t.g) * ratio_g, 2) + Math.pow((p.b - t.b) * ratio_b, 2));
        };
        let catch_obj = chooseColor_for_blocks(calcDelta, palette, rgb);
        result = catch_obj.alt;
      }
      cells[i][j] = result;
    }
  }
  add_canvas_to_roll_back_obj (cells);
  make_canvas (cells);
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
let obj = { start_x: '', start_y: '', start_img: '', end_x: '', end_y: '', fir_x: '', fir_y: '',
$target: '', target_w: '', target_h: '', target_id: '', parent_class: '',
$icon: '', icon_top: '', icon_left: '',
use: '', pop_text: '', want_if: '',
dl_img: '', dl_name: ''
};
let roll_back_obj = {map: [], pixel: [], draw: [null], c_map: 0, c_pixel: 0, c_draw: 0, tableP: [], one_time_img: [], c_one_time: 0};
const mac = document.getElementById("map_art_canvas");
const pac = document.getElementById("pixel_art_canvas");
const dac = document.getElementById("draw_art_canvas");
mac.setAttribute('willReadFrequently', 'true');
pac.setAttribute('willReadFrequently', 'true');
dac.setAttribute('willReadFrequently', 'true');
const mactx = mac.getContext("2d");
const pactx = pac.getContext("2d");
const dactx = dac.getContext("2d");
let cell_size_map = mac.width / $('#map_art_size').val();
let cell_size_pixel = pac.width / $('#pixel_art_size').val();
let do_flag = true;
let end_flag = false;
let isDragging = false;
let array_match_cell = [];
let count = 0;
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.crossOrigin = 'anonymous'; // クロスオリジン属性を設定
    image.src = src;
  });
}
function make_canvas (value_arry) {
  if ($('#map_art').prop('checked')) {
    cell_size_map = mac.width / $('#map_art_size').val();
    mactx.fillStyle = 'white';
    mactx.fillRect(0, 0, mac.width, mac.height);
    mactx.lineWidth = 0.5;
    mactx.strokeStyle = '#f5f5f5';
    value_arry.forEach((layer_y, y) => {
      layer_y.forEach((item, x) => {
        if (item != 0) {
          mactx.fillStyle = cp_obj[item].color;
          mactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
        }
      });
    });
    for (let x = 0; x < $('#map_art_size').val(); x++) {
      mactx.beginPath();
      mactx.moveTo(x * cell_size_map, 0);
      mactx.lineTo(x * cell_size_map, mac.width);
      mactx.stroke();
    }
    for (let y = 0; y < $('#map_art_size').val(); y++) {
      mactx.beginPath();
      mactx.moveTo(0, y * cell_size_map);
      mactx.lineTo(mac.height, y * cell_size_map);
      mactx.stroke();
    }
  }
  if ($('#pixel_art').prop('checked')) {
    cell_size_map = pac.width / $('#pixel_art_size').val();
    pactx.fillStyle = 'white';
    pactx.fillRect(0, 0, pac.width, pac.height);
    pactx.lineWidth = 0.5;
    pactx.strokeStyle = '#f5f5f5';
    value_arry.forEach((layer_y, y) => {
      layer_y.forEach((item, x) => {
        if (item != 0) {
          const image = cp_obj[item].img;
          pactx.drawImage(image, x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
        }
      });
    });
    for (let xL = 0; xL < $('#pixel_art_size').val(); xL++) {
      pactx.beginPath();
      pactx.moveTo(xL * cell_size_map, 0);
      pactx.lineTo(xL * cell_size_map, pac.width);
      pactx.stroke();
    }
    for (let yL = 0; yL < $('#pixel_art_size').val(); yL++) {
      pactx.beginPath();
      pactx.moveTo(0, yL * cell_size_map);
      pactx.lineTo(pac.height, yL * cell_size_map);
      pactx.stroke();
    }
  }
}
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
function all_removeEventListener (e) {
  document.removeEventListener('mousemove', handleTouchMove, { passive: false });
  mac.removeEventListener('mousemove', choose_fun);
  pac.removeEventListener('mousemove', choose_fun);
  dac.removeEventListener('mousemove', choose_fun);
  mac.removeEventListener('mouseup', end_fun);
  pac.removeEventListener('mouseup', end_fun);
  dac.removeEventListener('mouseup', end_fun);
  document.removeEventListener('mouseup', rect_FirstUp);
  document.removeEventListener('mouseup', rect_SecondUp);
  document.removeEventListener('touchstart', handleTouchMove, { passive: false });
  document.removeEventListener('touchmove', handleTouchMove, { passive: false });
  mac.removeEventListener('touchmove', choose_fun);
  pac.removeEventListener('touchmove', choose_fun);
  dac.removeEventListener('touchmove', choose_fun);
  mac.removeEventListener('touchend', end_fun);
  pac.removeEventListener('touchend', end_fun);
  dac.removeEventListener('touchend', end_fun);
  document.removeEventListener('touchend', rect_FirstUp);
  document.removeEventListener('touchend', rect_SecondUp);
  do_flag = true;
}
function get_picked_colorBox_from_id(id) {
  $("#CP label.check").removeClass("check");
  $("#" + id).addClass('check');
  //pick color display
  let select_rgb = $("#" + id + " .CPrgb").css("backgroundColor").toString();
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
function prepare_ctx_data (e) {
  if (obj.want_if === 'pen_tool'
  || obj.want_if === 'stroke_path_with_rect'
  || obj.want_if === 'stroke_path_with_line'
  || obj.want_if === 'stroke_path_with_arc') {
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
    dactx.lineWidth = $('#line_bold_for_draw').val();
    dactx.lineCap = "round";
  }
  if (obj.want_if === 'eraser_points_tool') {
    dactx.strokeStyle = "white";
    dactx.lineWidth = $('#line_bold_for_draw').val();
    dactx.lineCap = "round";
  }
  if (obj.want_if === 'fill_in_with_line'
  || obj.want_if === 'fill_in_with_rect'
  || obj.want_if === 'fill_in_with_arc') {
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
  if (obj.want_if === 'copy_area_with_rect'
  || obj.want_if === 'resize_area_with_rect'
  || obj.want_if === 'roll_area_with_rect') {
    dactx.strokeStyle = "black";
    dactx.lineWidth = 1;
  }
}
function color_dropper_icon(e) {
  all_removeEventListener ();
  if ($('#map_art').prop('checked') || $('#pixel_art').prop('checked')) {
    let alt = obj.one_time_arry[obj.start_y][obj.start_x];
    if (alt != 0) {
      let id = $('#CP .CPimg img[alt="' + alt + '"]').parent().parent().attr('id');
      if ($('#pixel_art').prop('checked')) {
        $('#' + id + ' .CPimg img.mImg').removeClass('mImg');
        $('#' + id + ' .CPimg img[alt="' + alt + '"]').addClass('mImg');
      }
      get_picked_colorBox_from_id(id);
    }
  }
  if ($('#draw_art').prop('checked')) {
    let pixel = dactx.getImageData(obj.start_x, obj.start_y, 1, 1);
    let data = pixel.data;
    let catch_color = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    $("#CP .CPrgb").each(function (index) {
      let id = $(this).parent().attr('id');
      if ($("#change_to_map_art_data").prop('checked')) {
        let bgColor = $(this).css("backgroundColor").toString();
        let result = bgColor.split(",");
        if (bgColor === catch_color && result.length < 4) {
          get_picked_colorBox_from_id(id);
          return false;
        }
      }
      if ($("#change_to_pixel_art_data").prop('checked')) {
        $('#' + id + ' .CPimg').find("img").each(function (index) {
          let imgColor = $(this).css("backgroundColor").toString();
          let result = imgColor.split(",");
          if (imgColor === catch_color && result.length < 4) {
            $('#' + id + ' .CPimg img.mImg').removeClass('mImg');
            $(this).addClass('mImg');
            get_picked_colorBox_from_id(id);
            return false;
          }
        });
      }
    });
  }
}
function end_fun (e) {
  if ($('#map_art').prop('checked') || $('#pixel_art').prop('checked')) {
    if (obj.want_if === 'stroke_path_with_line' || obj.want_if === 'fill_in_with_line') {
      if (roll_back_obj.tableP.length <= 0) {
        roll_back_obj.tableP.push({x: obj.start_x, y: obj.start_y});
      }
      roll_back_obj.tableP.push({x: obj.end_x, y: obj.end_y});
      roll_back_obj.c_one_time = 0;
      let data = calculateDistanceAngle(obj.start_x, obj.start_y, obj.end_x, obj.end_y);
      let alt = $('#CP label.check .CPimg img.mImg').attr('alt');
      let line_bold = $('#line_bold_for_draw').val();
      if ($('#for_cut_area').prop('checked') && obj.want_if === 'fill_in_with_line') {
        alt = 0;
        line_bold = 1;
      }
      for (let i = 0; i < data.dis; i++) {
        let mx = obj.start_x + Math.round(i * Math.cos(data.ang));
        let my = obj.start_y + Math.round(i * Math.sin(data.ang));
        for (let a = 0; a < line_bold ** 2; a++) {
          let x = Math.round(mx - (line_bold - 1) / 2 + a % line_bold);
          let y = Math.round(my - (line_bold - 1) / 2 + Math.floor(a / line_bold));
          if (x >= 0 && x < $('#map_art_size').val() && y >= 0 && y < $('#map_art_size').val() && $('#map_art').prop('checked')) {
            if (Math.sqrt((mx - x) ** 2 + (my - y) ** 2) < line_bold) {
              obj.one_time_arry[y][x] = alt;
            }
          }
          if (x >= 0 && x < $('#pixel_art_size').val() && y >= 0 && y < $('#pixel_art_size').val() && $('#pixel_art').prop('checked')) {
            if (Math.sqrt((mx - x) ** 2 + (my - y) ** 2) < line_bold) {
              obj.one_time_arry[y][x] = alt;
            }
          }
        }
      }
    }
    if (obj.want_if === 'stroke_path_with_rect' || obj.want_if === 'fill_in_with_rect') {
      let w = Math.abs(obj.start_x - obj.end_x);
      let h = Math.abs(obj.start_y - obj.end_y);
      let alt = $('#CP label.check .CPimg img.mImg').attr('alt');
      let line_bold = $('#line_bold_for_draw').val();
      if ($('#for_cut_area').prop('checked') && obj.want_if === 'fill_in_with_rect') {
        line_bold = 1;
        alt = 0;
      }
      line_bold--;
      for (let y = obj.fir_y - line_bold; y < h + obj.fir_y + line_bold; y++) {
        for (let x = obj.fir_x - line_bold; x < w + obj.fir_x + line_bold; x++) {
          if (obj.want_if === 'stroke_path_with_rect') {
            if (x > obj.fir_x + line_bold && x < w + obj.fir_x - 1 - line_bold && y > obj.fir_y + line_bold && y < h + obj.fir_y - 1 - line_bold) {
              continue;
            }
          }
          obj.one_time_arry[y][x] = alt;
        }
      }
    }
    if (obj.want_if === 'stroke_path_with_arc' || obj.want_if === 'fill_in_with_arc') {
      let r = Math.sqrt((obj.start_x - obj.end_x) ** 2 + (obj.start_y - obj.end_y) ** 2);
      let alt = $('#CP label.check .CPimg img.mImg').attr('alt');
      let line_bold = $('#line_bold_for_draw').val();
      if ($('#for_cut_area').prop('checked') && obj.want_if === 'fill_in_with_arc') {
        line_bold = 1;
        alt = 0;
      }
      line_bold--;
      r += line_bold;
      for (let a = 0; a < r ** 2; a++) {
        let x = Math.round(obj.start_x - r + a % r);
        let y = Math.round(obj.start_y - r + Math.floor(a / r));
        if (Math.sqrt((obj.start_x - x) ** 2 + (obj.start_y - y) ** 2) < r) {
          if (obj.want_if === 'stroke_path_with_arc') {
            if (Math.sqrt((obj.start_x - x) ** 2 + (obj.start_y - y) ** 2) < r - 2 * line_bold - 1) {
              continue;
            }
          }
          let mirror = [{x: x, y: y},
            {x: 2 * (obj.start_x - 1) - x, y: y},
            {x: x, y: 2 * (obj.start_y - 1) - y},
            {x: 2 * (obj.start_x - 1) - x, y: 2 * (obj.start_y - 1) - y}
          ];
          mirror.forEach((item, i) => {
            if (item.x >= 0 && item.x < $('#map_art_size').val() && item.y >= 0 && item.y < $('#map_art_size').val() && $('#map_art').prop('checked')) {
              obj.one_time_arry[item.y][item.x] = alt;
            }
            if (item.x >= 0 && item.x < $('#pixel_art_size').val() && item.y >= 0 && item.y < $('#pixel_art_size').val() && $('#pixel_art').prop('checked')) {
              obj.one_time_arry[item.y][item.x] = alt;
            }
          });
        }
      }
    }
    add_canvas_to_roll_back_obj (obj.one_time_arry);
  }
  if ($('#draw_art').prop('checked')) {
    let value;
    if (obj.want_if === 'stroke_path_with_line' || obj.want_if === 'fill_in_with_line') {
      while (roll_back_obj.c_draw > 0) {
        roll_back_obj.draw.pop();
        roll_back_obj.c_draw --;
      }
      if (!isDragging) {
        obj.end_x = obj.start_x;
        obj.end_y = obj.start_y;
      }
      let before_x, before_y, cp1x, cp1y;
      let cp2x = 2 * obj.start_x - obj.end_x;
      let cp2y = 2 * obj.start_y - obj.end_y;
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
      roll_back_obj.tableP.push([obj.start_x, obj.start_y, obj.end_x, obj.end_y]);
      roll_back_obj.one_time_img.push(dactx.getImageData(0, 0, dac.width, dac.height));
      roll_back_obj.c_one_time = 0;
    }
    else {
      value = dactx.getImageData(0, 0, dac.width, dac.height);
      add_canvas_to_roll_back_obj (value);
    }
  }
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
  if ($('#map_art').prop('checked')) {
    mx -= mac.getBoundingClientRect().left;
    my -= mac.getBoundingClientRect().top;
    if (mx >= 0 && mx < mac.width && my >=0 && my < mac.height) {
      cell_size_map = mac.width / $('#map_art_size').val();
      mx = Math.floor(mx / cell_size_map);
      my = Math.floor(my / cell_size_map);
    } else {
      return false;
    }
    mactx.lineWidth = 0.5;
    mactx.strokeStyle = '#f5f5f5';
    mactx.fillStyle = cp_obj[alt].color;
    if (obj.want_if === 'eraser_points_tool') {
      alt = 0;
      mactx.fillStyle = 'white';
    }
    for (let a = 0; a < $('#line_bold_for_draw').val() ** 2; a++) {
      let x = Math.round(mx - ($('#line_bold_for_draw').val() - 1) / 2 + a % $('#line_bold_for_draw').val());
      let y = Math.round(my - ($('#line_bold_for_draw').val() - 1) / 2 + Math.floor(a / $('#line_bold_for_draw').val()));
      if (x >= 0 && x < $('#map_art_size').val() && y >= 0 && y < $('#map_art_size').val()) {
        if (Math.sqrt((mx - x) ** 2 + (my - y) ** 2) < $('#line_bold_for_draw').val()) {
          obj.one_time_arry[y][x] = alt;
          mactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
          mactx.strokeRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
        }
      }
    }
  }
  if ($('#pixel_art').prop('checked')) {
    mx -= pac.getBoundingClientRect().left;
    my -= pac.getBoundingClientRect().top;
    if (mx >= 0 && mx < pac.width && my >=0 && my < pac.height) {
      cell_size_map = pac.width / $('#pixel_art_size').val();
      mx = Math.floor(mx / cell_size_map);
      my = Math.floor(my / cell_size_map);
    } else {
      return false;
    }
    pactx.lineWidth = 0.5;
    pactx.strokeStyle = '#f5f5f5';
    pactx.fillStyle = 'white';
    const image = cp_obj[alt].img;
    for (let a = 0; a < $('#line_bold_for_draw').val() ** 2; a++) {
      let x = Math.round(mx - ($('#line_bold_for_draw').val() - 1) / 2 + a % $('#line_bold_for_draw').val());
      let y = Math.round(my - ($('#line_bold_for_draw').val() - 1) / 2 + Math.floor(a / $('#line_bold_for_draw').val()));
      if (x >= 0 && x < $('#pixel_art_size').val() && y >= 0 && y < $('#pixel_art_size').val()) {
        if (Math.sqrt((mx - x) ** 2 + (my - y) ** 2) < $('#line_bold_for_draw').val()) {
          obj.one_time_arry[y][x] = 0;
          pactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
          if (obj.want_if === 'pen_tool') {
            obj.one_time_arry[y][x] = alt;
            pactx.drawImage(image, x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
          }
          pactx.strokeRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
        }
      }
    }
  }
  if ($('#draw_art').prop('checked')) {
    let scale = Number($('#draw_art_scale').val()) / 100;
    mx -= dac.getBoundingClientRect().left;
    my -= dac.getBoundingClientRect().top;
    mx /= scale;
    my /= scale;
    if (mx < 0 || mx >= dac.width || my < 0 || my >= dac.height) {
      return false;
    }
    prepare_ctx_data (e);
    dactx.beginPath();
    dactx.moveTo(obj.start_x , obj.start_y);
    dactx.lineTo(mx, my);
    dactx.stroke();
    obj.start_x = mx;
    obj.start_y = my;
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
    obj.one_time_arry[y][x] = change_alt;
    let xy_obj = {x: x, y: y};
    let key = array_match_cell.findIndex(obj => obj.x === xy_obj.x && obj.y === xy_obj.y);
    while (key >= 0) {
      array_match_cell.splice(key, 1);
      key = array_match_cell.indexOf(xy_obj);
    }
    let next = 0;
    for (let i = 0; i < array_xy_obj.length; i++) {
      if (
        obj.one_time_arry[array_xy_obj[i].y] === undefined || 
        obj.one_time_arry[array_xy_obj[i].y][array_xy_obj[i].x] === undefined
      ) {
        continue;
      }
      let target_alt = obj.one_time_arry[array_xy_obj[i].y][array_xy_obj[i].x];
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
  if ($('#map_art').prop('checked') || $('#pixel_art').prop('checked')) {
    let change_alt = $('#CP label.check .CPimg img.mImg').attr('alt');
    if (obj.want_if === 'area_cut_tool_of_scissors') {
      change_alt = 0;
    }
    let base_alt = obj.one_time_arry[my][mx];
    count = 0;
    try {
      const result = await same_area_search (mx, my, change_alt, base_alt);
      if (result) {
        make_canvas (obj.one_time_arry);
        end_fun();
      }
      all_removeEventListener ();
      $('html').css('cursor', 'default');
    } catch (error) {
      all_removeEventListener ();
      $('html').css('cursor', 'default');
    }
  }
  if ($('#draw_art').prop('checked')) {
    let color = 'white';
    if ($("#change_to_map_art_data").prop('checked') && obj.want_if === 'fill_tool_of_paint_roller') {
      color = $('#colorBox').val();
    }
    if ($("#change_to_pixel_art_data").prop('checked') && obj.want_if === 'fill_tool_of_paint_roller') {
      let $img = $('.palette .palette_button .selected_block_img').find("img.mImg");
      if ($img.length) {
        color = $img.css("background-color");
      }
      if ($img.length <= 0) {
        return false;
      }
    }
    let change_alt = 'change_color';
    obj.one_time_arry = [];
    let range = $('#line_bold_for_draw').val();
    if (range >= 4) {
      range = 4;
    }
    for (let y = 0; y < dac.height / range; y++) {
      if (!obj.one_time_arry[y]) {
        obj.one_time_arry[y] = [];
      }
      for (let x = 0; x < dac.width / range; x++) {
        let pixel = dactx.getImageData(x * range, y * range, 1, 1);
        let data = pixel.data;
        obj.one_time_arry[y][x] = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
      }
    }
    let base_alt = obj.one_time_arry[Math.floor(my / range)][Math.floor(mx / range)];
    count = 0;
    try {
      const result = await same_area_search (Math.floor(mx / range), Math.floor(my / range), change_alt, base_alt);
      if (result) {
        obj.one_time_arry.forEach((layer_y, y) => {
          layer_y.forEach((item, x) => {
            if (item === change_alt) {
              dactx.fillStyle = color;
              dactx.beginPath();
              dactx.arc(x * range, y * range, range, 0, Math.PI * 2, 0);
              dactx.fill();
            }
          });
        });
        end_fun();
      }
      all_removeEventListener ();
      $('html').css('cursor', 'default');
    } catch (error) {
      all_removeEventListener ();
      $('html').css('cursor', 'default');
    }
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
  if ($('#map_art').prop('checked')) {
    obj.end_x -= mac.getBoundingClientRect().left;
    obj.end_y -= mac.getBoundingClientRect().top;
    if (obj.end_x >= 0 && obj.end_x < mac.width && obj.end_y >=0 && obj.end_y < mac.height) {
      cell_size_map = mac.width / $('#map_art_size').val();
      obj.end_x = Math.floor(obj.end_x / cell_size_map);
      obj.end_y = Math.floor(obj.end_y / cell_size_map);
    } else {
      return false;
    }
  }
  if ($('#pixel_art').prop('checked')) {
    obj.end_x -= pac.getBoundingClientRect().left;
    obj.end_y -= pac.getBoundingClientRect().top;
    if (obj.end_x >= 0 && obj.end_x < pac.width && obj.end_y >=0 && obj.end_y < pac.height) {
      cell_size_map = pac.width / $('#pixel_art_size').val();
      obj.end_x = Math.floor(obj.end_x / cell_size_map);
      obj.end_y = Math.floor(obj.end_y / cell_size_map);
    } else {
      return false;
    }
  }
  let data = calculateDistanceAngle(obj.start_x, obj.start_y, obj.end_x, obj.end_y);
  let alt = $('#CP label.check .CPimg img.mImg').attr('alt');
  if ($('#map_art').prop('checked')) {
    mactx.putImageData(obj.start_img, 0, 0);
    mactx.lineWidth = 0.5;
    mactx.strokeStyle = '#f5f5f5';
    mactx.fillStyle = cp_obj[alt].color;
    let line_bold = $('#line_bold_for_draw').val();
    if ($('#for_cut_area').prop('checked') && obj.want_if === 'fill_in_with_line') {
      line_bold = 1;
      mactx.fillStyle = 'white';
    }
    for (let i = 0; i < data.dis; i++) {
      let mx = obj.start_x + Math.round(i * Math.cos(data.ang));
      let my = obj.start_y + Math.round(i * Math.sin(data.ang));
      for (let a = 0; a < line_bold ** 2; a++) {
        let x = Math.round(mx - (line_bold - 1) / 2 + a % line_bold);
        let y = Math.round(my - (line_bold - 1) / 2 + Math.floor(a / line_bold));
        if (x >= 0 && x < $('#map_art_size').val() && y >= 0 && y < $('#map_art_size').val()) {
          if (Math.sqrt((mx - x) ** 2 + (my - y) ** 2) < line_bold) {
            mactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
            mactx.strokeRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
          }
        }
      }
    }
  }
  if ($('#pixel_art').prop('checked')) {
    const image = cp_obj[alt].img;
    pactx.putImageData(obj.start_img, 0, 0);
    pactx.lineWidth = 0.5;
    pactx.strokeStyle = '#f5f5f5';
    pactx.fillStyle = 'white';
    let line_bold = $('#line_bold_for_draw').val();
    let target_flag = true;
    if ($('#for_cut_area').prop('checked') && obj.want_if === 'fill_in_with_line') {
      line_bold = 1;
      target_flag = false;
    }
    for (let i = 0; i < data.dis; i++) {
      let mx = obj.start_x + Math.round(i * Math.cos(data.ang));
      let my = obj.start_y + Math.round(i * Math.sin(data.ang));
      for (let a = 0; a < line_bold ** 2; a++) {
        let x = Math.round(mx - (line_bold - 1) / 2 + a % line_bold);
        let y = Math.round(my - (line_bold - 1) / 2 + Math.floor(a / line_bold));
        if (x >= 0 && x < $('#pixel_art_size').val() && y >= 0 && y < $('#pixel_art_size').val()) {
          if (Math.sqrt((mx - x) ** 2 + (my - y) ** 2) < line_bold) {
            pactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
            if (target_flag) {
              pactx.drawImage(image, x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
            }
            pactx.strokeRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
          }
        }
      }
    }
  }
}
function stroke_path_with_line(e) {
  isDragging = true;
  let scale = Number($('#draw_art_scale').val()) / 100;
  if (obj.use === 'mouse') {
    obj.end_x = (e.clientX - dac.getBoundingClientRect().left) / scale;
    obj.end_y = (e.clientY - dac.getBoundingClientRect().top) / scale;
  }
  if (obj.use === 'touch') {
    obj.end_x = (e.touches[0].clientX - dac.getBoundingClientRect().left) / scale;
    obj.end_y = (e.touches[0].clientY - dac.getBoundingClientRect().top) / scale;
  }
  let before_x, before_y, cp1x, cp1y;
  let cp2x = 2 * obj.start_x - obj.end_x;
  let cp2y = 2 * obj.start_y - obj.end_y;
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
  if ($('#map_art').prop('checked')) {
    obj.end_x -= mac.getBoundingClientRect().left;
    obj.end_y -= mac.getBoundingClientRect().top;
    if (obj.end_x >= 0 && obj.end_x < mac.width && obj.end_y >=0 && obj.end_y < mac.height) {
      cell_size_map = mac.width / $('#map_art_size').val();
      obj.end_x = Math.floor(obj.end_x / cell_size_map);
      obj.end_y = Math.floor(obj.end_y / cell_size_map);
    } else {
      return false;
    }
  }
  if ($('#pixel_art').prop('checked')) {
    obj.end_x -= pac.getBoundingClientRect().left;
    obj.end_y -= pac.getBoundingClientRect().top;
    if (obj.end_x >= 0 && obj.end_x < pac.width && obj.end_y >=0 && obj.end_y < pac.height) {
      cell_size_map = pac.width / $('#pixel_art_size').val();
      obj.end_x = Math.floor(obj.end_x / cell_size_map);
      obj.end_y = Math.floor(obj.end_y / cell_size_map);
    } else {
      return false;
    }
  }
  if ($('#draw_art').prop('checked')) {
    let scale = Number($('#draw_art_scale').val()) / 100;
    obj.end_x -= dac.getBoundingClientRect().left;
    obj.end_y -= dac.getBoundingClientRect().top;
    obj.end_x /= scale;
    obj.end_y /= scale;
    if (obj.end_x < 0 || obj.end_x >= dac.width || obj.end_y < 0 || obj.end_y >= dac.height) {
      return false;
    }
  }
  if (obj.start_x <= obj.end_x) {
    obj.fir_x = obj.start_x;
  } else {
    obj.fir_x = obj.end_x;
  }
  if (obj.start_y <= obj.end_y) {
    obj.fir_y = obj.start_y;
  } else {
    obj.fir_y = obj.end_y;
  }
  let w = Math.abs(obj.start_x - obj.end_x);
  let h = Math.abs(obj.start_y - obj.end_y);
  let alt = $('#CP label.check .CPimg img.mImg').attr('alt');
  if ($('#map_art').prop('checked')) {
    mactx.lineWidth = 0.5;
    mactx.strokeStyle = '#f5f5f5';
    mactx.fillStyle = cp_obj[alt].color;
    mactx.putImageData(obj.start_img, 0, 0);
    let line_bold = $('#line_bold_for_draw').val();
    if ($('#for_cut_area').prop('checked') && obj.want_if === 'fill_in_with_rect') {
      line_bold = 1;
      mactx.fillStyle = 'white';
    }
    line_bold--;
    for (let y = obj.fir_y - line_bold; y < h + obj.fir_y + line_bold; y++) {
      for (let x = obj.fir_x - line_bold; x < w + obj.fir_x + line_bold; x++) {
        if (obj.want_if === 'stroke_path_with_rect') {
          if (x > obj.fir_x + line_bold && x < w + obj.fir_x - 1 - line_bold && y > obj.fir_y + line_bold && y < h + obj.fir_y - 1 - line_bold) {
            continue;
          }
        }
        mactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
        mactx.strokeRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
      }
    }
  }
  if ($('#pixel_art').prop('checked')) {
    const image = cp_obj[alt].img;
    pactx.putImageData(obj.start_img, 0, 0);
    pactx.lineWidth = 0.5;
    pactx.strokeStyle = '#f5f5f5';
    pactx.fillStyle = 'white';
    let line_bold = $('#line_bold_for_draw').val();
    let target_flag = true;
    if ($('#for_cut_area').prop('checked') && obj.want_if === 'fill_in_with_rect') {
      line_bold = 1;
      target_flag = false;
    }
    line_bold--;
    for (let y = obj.fir_y - line_bold; y < h + obj.fir_y + line_bold; y++) {
      for (let x = obj.fir_x - line_bold; x < w + obj.fir_x + line_bold; x++) {
        if (obj.want_if === 'stroke_path_with_rect') {
          if (x > obj.fir_x + line_bold && x < w + obj.fir_x - 1 - line_bold && y > obj.fir_y + line_bold && y < h + obj.fir_y - 1 - line_bold) {
            continue;
          }
        }
        pactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
        if (target_flag) {
          pactx.drawImage(image, x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
        }
        pactx.strokeRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
      }
    }
  }
  if ($('#draw_art').prop('checked')) {
    prepare_ctx_data (e);
    dactx.putImageData(obj.start_img, 0, 0);
    if (obj.want_if === 'stroke_path_with_rect') {
      dactx.strokeRect(obj.fir_x, obj.fir_y, w, h);
    }
    if (obj.want_if === 'fill_in_with_rect') {
      dactx.fillRect(obj.fir_x, obj.fir_y, w, h);
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
  if ($('#map_art').prop('checked')) {
    obj.end_x -= mac.getBoundingClientRect().left;
    obj.end_y -= mac.getBoundingClientRect().top;
    if (obj.end_x >= 0 && obj.end_x < mac.width && obj.end_y >=0 && obj.end_y < mac.height) {
      cell_size_map = mac.width / $('#map_art_size').val();
      obj.end_x = Math.floor(obj.end_x / cell_size_map);
      obj.end_y = Math.floor(obj.end_y / cell_size_map);
    } else {
      return false;
    }
  }
  if ($('#pixel_art').prop('checked')) {
    obj.end_x -= pac.getBoundingClientRect().left;
    obj.end_y -= pac.getBoundingClientRect().top;
    if (obj.end_x >= 0 && obj.end_x < pac.width && obj.end_y >=0 && obj.end_y < pac.height) {
      cell_size_map = pac.width / $('#pixel_art_size').val();
      obj.end_x = Math.floor(obj.end_x / cell_size_map);
      obj.end_y = Math.floor(obj.end_y / cell_size_map);
    } else {
      return false;
    }
  }
  if ($('#draw_art').prop('checked')) {
    let scale = Number($('#draw_art_scale').val()) / 100;
    obj.end_x -= dac.getBoundingClientRect().left;
    obj.end_y -= dac.getBoundingClientRect().top;
    obj.end_x /= scale;
    obj.end_y /= scale;
    if (obj.end_x < 0 || obj.end_x >= dac.width || obj.end_y < 0 || obj.end_y >= dac.height) {
      return false;
    }
  }
  let r = Math.sqrt((obj.start_x - obj.end_x) ** 2 + (obj.start_y - obj.end_y) ** 2);
  let alt = $('#CP label.check .CPimg img.mImg').attr('alt');
  if ($('#map_art').prop('checked')) {
    mactx.lineWidth = 0.5;
    mactx.strokeStyle = '#f5f5f5';
    mactx.fillStyle = cp_obj[alt].color;
    mactx.putImageData(obj.start_img, 0, 0);
    let line_bold = $('#line_bold_for_draw').val();
    if ($('#for_cut_area').prop('checked') && obj.want_if === 'fill_in_with_arc') {
      line_bold = 1;
      mactx.fillStyle = 'white';
    }
    line_bold--;
    r += line_bold;
    for (let a = 0; a < r ** 2; a++) {
      let x = Math.round(obj.start_x - r + a % r);
      let y = Math.round(obj.start_y - r + Math.floor(a / r));
      if (Math.sqrt((obj.start_x - x) ** 2 + (obj.start_y - y) ** 2) < r) {
        if (obj.want_if === 'stroke_path_with_arc') {
          if (Math.sqrt((obj.start_x - x) ** 2 + (obj.start_y - y) ** 2) < r - 2 * line_bold - 1) {
            continue;
          }
        }
        let mirror = [{x: x, y: y},
          {x: 2 * (obj.start_x - 1) - x, y: y},
          {x: x, y: 2 * (obj.start_y - 1) - y},
          {x: 2 * (obj.start_x - 1) - x, y: 2 * (obj.start_y - 1) - y}
        ];
        mirror.forEach((item, i) => {
          if (item.x >= 0 && item.x < $('#map_art_size').val() && item.y >= 0 && item.y < $('#map_art_size').val()) {
            mactx.fillRect(item.x * cell_size_map, item.y * cell_size_map, cell_size_map, cell_size_map);
            mactx.strokeRect(item.x * cell_size_map, item.y * cell_size_map, cell_size_map, cell_size_map);
          }
        });
      }
    }
  }
  if ($('#pixel_art').prop('checked')) {
    const image = cp_obj[alt].img;
    pactx.putImageData(obj.start_img, 0, 0);
    pactx.lineWidth = 0.5;
    pactx.strokeStyle = '#f5f5f5';
    pactx.fillStyle = 'white';
    let line_bold = $('#line_bold_for_draw').val();
    let target_flag = true;
    if ($('#for_cut_area').prop('checked') && obj.want_if === 'fill_in_with_arc') {
      line_bold = 1;
      target_flag = false;
    }
    line_bold--;
    r += line_bold;
    for (let a = 0; a < r ** 2; a++) {
      let x = Math.round(obj.start_x - r + a % r);
      let y = Math.round(obj.start_y - r + Math.floor(a / r));
      if (Math.sqrt((obj.start_x - x) ** 2 + (obj.start_y - y) ** 2) < r) {
        if (obj.want_if === 'stroke_path_with_arc') {
          if (Math.sqrt((obj.start_x - x) ** 2 + (obj.start_y - y) ** 2) < r - 2 * line_bold - 1) {
            continue;
          }
        }
        let mirror = [{x: x, y: y},
          {x: 2 * (obj.start_x - 1) - x, y: y},
          {x: x, y: 2 * (obj.start_y - 1) - y},
          {x: 2 * (obj.start_x - 1) - x, y: 2 * (obj.start_y - 1) - y}
        ];
        mirror.forEach((item, i) => {
          if (item.x >= 0 && item.x < $('#pixel_art_size').val() && item.y >= 0 && item.y < $('#pixel_art_size').val()) {
            pactx.fillRect(item.x * cell_size_map, item.y * cell_size_map, cell_size_map, cell_size_map);
            if (target_flag) {
              pactx.drawImage(image, item.x * cell_size_map, item.y * cell_size_map, cell_size_map, cell_size_map);
            }
            pactx.strokeRect(item.x * cell_size_map, item.y * cell_size_map, cell_size_map, cell_size_map);
          }
        });
      }
    }
  }
  if ($('#draw_art').prop('checked')) {
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
}
function return_first_copyed_obj (e) {
  let x, y, w, h, put_img, xc, yc, piBase, piMove, xRange, yRange;
  put_img = roll_back_obj.one_time_img[0];
  let scale = [1, 1];
  if (obj.want_if === 'copy_area_with_rect') {
    x = obj.end_x - put_img.width;
    y = obj.end_y - put_img.height;
    w = put_img.width;
    h = put_img.height;
    if ($('#for_horizontal_flip').prop('checked')) {
      scale[0] = -1;
    }
    if ($('#for_vertical_flip').prop('checked')) {
      scale[1] = -1;
    }
  }
  if (obj.want_if === 'resize_area_with_rect') {
    x = obj.start_x - put_img.width;
    y = obj.start_y - put_img.height;
    w = obj.end_x - x;
    if (w < 0) {
      scale[0] = -1;
    }
    h = obj.end_y - y;
    if (h < 0) {
      scale[1] = -1;
    }
  }
  if (obj.want_if === 'roll_area_with_rect') {
    xc = obj.start_x - put_img.width / 2;
    yc = obj.start_y - put_img.height / 2;
    piBase = Math.atan((obj.start_y - yc) / (obj.start_x - xc));
    xRange = Math.abs(obj.end_x - xc);
    yRange = Math.abs(obj.end_y - yc);
    if (xRange >= yRange && obj.end_x >= xc) {
      piMove = Math.atan((obj.end_y - yc) / xRange);
    } else if (xRange >= yRange && obj.end_x < xc) {
      piMove = Math.atan((obj.end_y - yc) / xRange);
      piMove = Math.PI - piMove;
    } else if (xRange < yRange && obj.end_y >= yc) {
      piMove = Math.atan((obj.end_x - xc) / yRange);
      piMove = Math.PI / 2 - piMove;
    } else if (xRange < yRange && obj.end_y < yc) {
      piMove = Math.atan((obj.end_x - xc) / yRange);
      piMove = piMove - Math.PI / 2;
    }
  }
  return {x: x, y: y, w: w, h: h, scale: scale, put_img: put_img, xc: xc, yc: yc, piMove: piMove, piBase: piBase};
}
async function rect_FirstUp(e) {
  let w = Math.abs(obj.start_x - obj.end_x);
  let h = Math.abs(obj.start_y - obj.end_y);
  if ($('#map_art').prop('checked')) {
    mactx.putImageData(obj.start_img, 0, 0);
    cell_size_map = mac.width / $('#map_art_size').val();
    mactx.lineWidth = 0.5;
    mactx.strokeStyle = '#f5f5f5';
    mactx.fillStyle = 'white';
    for (let y = 0; y < h; y++) {
      if (!roll_back_obj.one_time_img[y]) {
        roll_back_obj.one_time_img[y] = [];
      }
      for (let x = 0; x < w; x++) {
        roll_back_obj.one_time_img[y][x] = obj.one_time_arry[y + obj.fir_y][x + obj.fir_x];
        if ($('#for_cut_area').prop('checked')) {
          obj.one_time_arry[y + obj.fir_y][x + obj.fir_x] = 0;
          mactx.fillRect((x + obj.fir_x) * cell_size_map, (y + obj.fir_y) * cell_size_map, cell_size_map, cell_size_map);
          mactx.strokeRect((x + obj.fir_x) * cell_size_map, (y + obj.fir_y) * cell_size_map, cell_size_map, cell_size_map);
        }
      }
    }
    if ($('#for_cut_area').prop('checked')) {
      add_canvas_to_roll_back_obj (obj.one_time_arry);
    }
  }
  if ($('#pixel_art').prop('checked')) {
    pactx.putImageData(obj.start_img, 0, 0);
    cell_size_map = pac.width / $('#pixel_art_size').val();
    pactx.lineWidth = 0.5;
    pactx.strokeStyle = '#f5f5f5';
    pactx.fillStyle = 'white';
    for (let y = 0; y < h; y++) {
      if (!roll_back_obj.one_time_img[y]) {
        roll_back_obj.one_time_img[y] = [];
      }
      for (let x = 0; x < w; x++) {
        roll_back_obj.one_time_img[y][x] = obj.one_time_arry[y + obj.fir_y][x + obj.fir_x];
        if ($('#for_cut_area').prop('checked')) {
          obj.one_time_arry[y + obj.fir_y][x + obj.fir_x] = 0;
          pactx.fillRect((x + obj.fir_x) * cell_size_map, (y + obj.fir_y) * cell_size_map, cell_size_map, cell_size_map);
          pactx.strokeRect((x + obj.fir_x) * cell_size_map, (y + obj.fir_y) * cell_size_map, cell_size_map, cell_size_map);
        }
      }
    }
    if ($('#for_cut_area').prop('checked')) {
      add_canvas_to_roll_back_obj (obj.one_time_arry);
    }
  }
  if ($('#draw_art').prop('checked')) {
    dactx.putImageData(obj.start_img, 0, 0);
    let cut_img = dactx.getImageData(obj.fir_x, obj.fir_y, w, h);
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    c.width = w;
    c.height = h;
    ctx.putImageData(cut_img, 0, 0);
    const image = await loadImage(c.toDataURL());
    dactx.putImageData(obj.start_img, 0, 0);
    roll_back_obj.one_time_img = [image];
    if ($('#for_cut_area').prop('checked')) {
      dactx.fillStyle = 'white';
      dactx.fillRect(obj.fir_x, obj.fir_y, w, h);
    }
  }
  all_removeEventListener ();
}
function rect_SecondUp(e) {
  all_removeEventListener ();
  if ($('#map_art').prop('checked') || $('#pixel_art').prop('checked')) {
    count = 0;
    if (obj.want_if === 'copy_area_with_rect') {
      if ($('#map_art').prop('checked') || $('#pixel_art').prop('checked')) {
        for (let y = 0; y < roll_back_obj.one_time_img.length; y++) {
          for (let x = 0; x < roll_back_obj.one_time_img[y].length; x++) {
            count++;
            if (count >= 17000) {
              break;
            }
            let alt = roll_back_obj.one_time_img[y][x];
            let mx = obj.fir_x + x + obj.end_x - obj.start_x;
            let my = obj.fir_y + y + obj.end_y - obj.start_y;
            if ($('#for_horizontal_flip').prop('checked')) {
              mx = obj.fir_x + roll_back_obj.one_time_img[y].length - x + obj.end_x - obj.start_x;
            }
            if ($('#for_vertical_flip').prop('checked')) {
              my = obj.fir_y + roll_back_obj.one_time_img.length - y + obj.end_y - obj.start_y;
            }
            if (mx >= 0 && mx < $('#map_art_size').val() && my >= 0 && my < $('#map_art_size').val() && $('#map_art').prop('checked')) {
              obj.one_time_arry[my][mx] = alt;
            }
            if (mx >= 0 && mx < $('#pixel_art_size').val() && my >= 0 && my < $('#pixel_art_size').val() && $('#pixel_art').prop('checked')) {
              obj.one_time_arry[my][mx] = alt;
            }
          }
        }
      }
    }
    if (obj.want_if === 'resize_area_with_rect') {
      let center = {x: obj.fir_x + roll_back_obj.one_time_img[0].length / 2, y: obj.fir_y + roll_back_obj.one_time_img.length / 2};
      let ratio = {w: 1, h: 1};
      if (Math.abs(obj.start_y - center.y) > 0) {
        ratio.h = Math.abs((obj.end_y - center.y) / (obj.start_y - center.y));
        if (isNaN(ratio.h)) {
          ratio.h = 1;
        }
      }
      if (Math.abs(obj.start_x - center.x) > 0) {
        ratio.w = Math.abs((obj.end_x - center.x) / (obj.start_x - center.x));
        if (isNaN(ratio.w)) {
          ratio.w = 1;
        }
      }
      if ($('#map_art').prop('checked') || $('#pixel_art').prop('checked')) {
        for (let y = 0; y < Math.round(roll_back_obj.one_time_img.length * ratio.h); y++) {
          for (let x = 0; x < Math.round(roll_back_obj.one_time_img[0].length * ratio.w); x++) {
            count++;
            if (count >= 17000) {
              break;
            }
            const maxY = Math.min(roll_back_obj.one_time_img.length - 1, Math.round(y / ratio.h));
            const maxX = Math.min(roll_back_obj.one_time_img[0].length - 1, Math.round(x / ratio.w));
            let alt = roll_back_obj.one_time_img[maxY][maxX];
            let d = 0;
            if (Math.abs(obj.end_y - obj.fir_y) > 0) {
              d = (obj.end_x - obj.fir_x) / Math.abs(obj.end_x - obj.fir_x);
            }
            let mx = Math.round(center.x + (x - roll_back_obj.one_time_img[0].length * ratio.w / 2) * d);
            d = 0;
            if (Math.abs(obj.end_y - obj.fir_y) > 0) {
              d = (obj.end_y - obj.fir_y) / Math.abs(obj.end_y - obj.fir_y);
            }
            let my = Math.round(center.y + (y - roll_back_obj.one_time_img.length * ratio.h / 2) * d);
            if (mx >= 0 && mx < $('#map_art_size').val() && my >= 0 && my < $('#map_art_size').val() && $('#map_art').prop('checked')) {
              obj.one_time_arry[my][mx] = alt;
            }
            if (mx >= 0 && mx < $('#pixel_art_size').val() && my >= 0 && my < $('#pixel_art_size').val() && $('#pixel_art').prop('checked')) {
              obj.one_time_arry[my][mx] = alt;
            }
          }
        }
      }
    }
    if (obj.want_if === 'roll_area_with_rect') {
      let center = {x: obj.fir_x + roll_back_obj.one_time_img[0].length / 2, y: obj.fir_y + roll_back_obj.one_time_img.length / 2};
      let end_data = calculateDistanceAngle(center.x, center.y, obj.end_x, obj.end_y);
      let start_data = calculateDistanceAngle(center.x, center.y, obj.fir_x, obj.fir_y);
      let ang = end_data.ang - (start_data.ang + Math.PI);
      if (ang < 0) {
        ang += 2 * Math.PI;
      }
      if ($('#map_art').prop('checked') || $('#pixel_art').prop('checked')) {
        for (let h = 0; h < 2 * Math.round(start_data.dis); h++) {
          for (let w = 0; w < 2 * Math.round(start_data.dis); w++) {
            if (Math.sqrt((w - Math.round(start_data.dis)) ** 2 + (h - Math.round(start_data.dis)) ** 2) <= Math.round(start_data.dis)) {
              count++;
              if (count >= 17000) {
                break;
              }
              let cell_data = calculateDistanceAngle(Math.round(start_data.dis), Math.round(start_data.dis), w, h);
              let x = Math.round(roll_back_obj.one_time_img[0].length / 2 + cell_data.dis * Math.cos(cell_data.ang - ang));
              let y = Math.round(roll_back_obj.one_time_img.length / 2 + cell_data.dis * Math.sin(cell_data.ang - ang));
              if (isNaN(x) || isNaN(y)) {
                continue;
              }
              if (x >= 0 && x < roll_back_obj.one_time_img[0].length && y >= 0 && y < roll_back_obj.one_time_img.length) {
                let alt = roll_back_obj.one_time_img[y][x];
                let mx = Math.round(center.x + w - Math.round(start_data.dis));
                let my = Math.round(center.y + h - Math.round(start_data.dis));
                if (mx >= 0 && mx < $('#map_art_size').val() && my >= 0 && my < $('#map_art_size').val() && $('#map_art').prop('checked')) {
                  obj.one_time_arry[my][mx] = alt;
                }
                if (mx >= 0 && mx < $('#pixel_art_size').val() && my >= 0 && my < $('#pixel_art_size').val() && $('#pixel_art').prop('checked')) {
                  obj.one_time_arry[my][mx] = alt;
                }
              }
            }
          }
        }
      }
    }
    add_canvas_to_roll_back_obj (obj.one_time_arry);
  }
  if ($('#draw_art').prop('checked')) {
    let copyed_obj = return_first_copyed_obj (e);
    dactx.putImageData(obj.start_img, 0, 0);
    if (obj.want_if === 'copy_area_with_rect' || obj.want_if === 'resize_area_with_rect') {
      dactx.translate((copyed_obj.x + copyed_obj.w / 2), (copyed_obj.y + copyed_obj.h / 2));
      dactx.scale(copyed_obj.scale[0], copyed_obj.scale[1]);
      dactx.drawImage(copyed_obj.put_img, -copyed_obj.w / 2, -copyed_obj.h / 2, copyed_obj.w, copyed_obj.h);
      dactx.scale(copyed_obj.scale[0], copyed_obj.scale[1]);
      dactx.translate(-(copyed_obj.x + copyed_obj.w / 2), -(copyed_obj.y + copyed_obj.h / 2));
      let value = dactx.getImageData(0, 0, dac.width, dac.height);
      add_canvas_to_roll_back_obj (value);
    }
    if (obj.want_if === 'roll_area_with_rect') {
      dactx.translate(copyed_obj.xc, copyed_obj.yc);
      dactx.rotate(copyed_obj.piMove - copyed_obj.piBase);
      dactx.drawImage(copyed_obj.put_img, -copyed_obj.put_img.width / 2, -copyed_obj.put_img.height / 2, copyed_obj.put_img.width, copyed_obj.put_img.height);
      dactx.rotate(copyed_obj.piBase - copyed_obj.piMove);
      dactx.translate(-copyed_obj.xc, -copyed_obj.yc);
      let value = dactx.getImageData(0, 0, dac.width, dac.height);
      add_canvas_to_roll_back_obj (value);
    }
  }
  roll_back_obj.one_time_img = [];
  return false;
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
  if ($('#map_art').prop('checked')) {
    obj.end_x -= mac.getBoundingClientRect().left;
    obj.end_y -= mac.getBoundingClientRect().top;
    if (obj.end_x >= 0 && obj.end_x < mac.width && obj.end_y >=0 && obj.end_y < mac.height) {
      cell_size_map = mac.width / $('#map_art_size').val();
      obj.end_x = Math.floor(obj.end_x / cell_size_map);
      obj.end_y = Math.floor(obj.end_y / cell_size_map);
    } else {
      return false;
    }
  }
  if ($('#pixel_art').prop('checked')) {
    obj.end_x -= pac.getBoundingClientRect().left;
    obj.end_y -= pac.getBoundingClientRect().top;
    if (obj.end_x >= 0 && obj.end_x < pac.width && obj.end_y >=0 && obj.end_y < pac.height) {
      cell_size_map = pac.width / $('#pixel_art_size').val();
      obj.end_x = Math.floor(obj.end_x / cell_size_map);
      obj.end_y = Math.floor(obj.end_y / cell_size_map);
    } else {
      return false;
    }
  }
  if ($('#draw_art').prop('checked')) {
    let scale = Number($('#draw_art_scale').val()) / 100;
    obj.end_x -= dac.getBoundingClientRect().left;
    obj.end_y -= dac.getBoundingClientRect().top;
    obj.end_x /= scale;
    obj.end_y /= scale;
    if (obj.end_x < 0 || obj.end_x >= dac.width || obj.end_y < 0 || obj.end_y >= dac.height) {
      return false;
    }
  }
  if (!roll_back_obj.one_time_img.length) {
    if (obj.start_x <= obj.end_x) {
      obj.fir_x = obj.start_x;
    } else {
      obj.fir_x = obj.end_x;
    }
    if (obj.start_y <= obj.end_y) {
      obj.fir_y = obj.start_y;
    } else {
      obj.fir_y = obj.end_y;
    }
    let w = Math.abs(obj.start_x - obj.end_x);
    let h = Math.abs(obj.start_y - obj.end_y);
    if ($('#map_art').prop('checked')) {
      mactx.putImageData(obj.start_img, 0, 0);
      mactx.strokeStyle = "black";
      mactx.lineWidth = 1;
      mactx.strokeRect(obj.fir_x * cell_size_map, obj.fir_y * cell_size_map, w * cell_size_map, h * cell_size_map);
    }
    if ($('#pixel_art').prop('checked')) {
      pactx.putImageData(obj.start_img, 0, 0);
      pactx.strokeStyle = "black";
      pactx.lineWidth = 1;
      pactx.strokeRect(obj.fir_x * cell_size_map, obj.fir_y * cell_size_map, w * cell_size_map, h * cell_size_map);
    }
    if ($('#draw_art').prop('checked')) {
      prepare_ctx_data (e);
      dactx.putImageData(obj.start_img, 0, 0);
      dactx.strokeRect(obj.fir_x, obj.fir_y, w, h);
    }
    document.addEventListener('mouseup', rect_FirstUp);
    document.addEventListener('touchend', rect_FirstUp);
    return false;
  }
  if (roll_back_obj.one_time_img.length) {
    if ($('#map_art').prop('checked') || $('#pixel_art').prop('checked')) {
      count = 0;
      let ori_arry = deepCopyArray(roll_back_obj.one_time_img);
      if (obj.want_if === 'copy_area_with_rect') {
        if ($('#map_art').prop('checked')) {
          mactx.putImageData(obj.start_img, 0, 0);
          for (let y = 0; y < ori_arry.length; y++) {
            for (let x = 0; x < ori_arry[y].length; x++) {
              count++;
              if (count >= 17000) {
                break;
              }
              let alt = ori_arry[y][x];
              mactx.lineWidth = 0.5;
              mactx.strokeStyle = '#f5f5f5';
              mactx.fillStyle = 'white';
              if (alt != 0) {
                mactx.fillStyle = cp_obj[alt].color;
              }
              let mx = obj.fir_x + x + obj.end_x - obj.start_x;
              let my = obj.fir_y + y + obj.end_y - obj.start_y;
              if ($('#for_horizontal_flip').prop('checked')) {
                mx = obj.fir_x + ori_arry[y].length - x + obj.end_x - obj.start_x;
              }
              if ($('#for_vertical_flip').prop('checked')) {
                my = obj.fir_y + ori_arry.length - y + obj.end_y - obj.start_y;
              }
              if (mx >= 0 && mx < $('#map_art_size').val() && my >= 0 && my < $('#map_art_size').val()) {
                mactx.fillRect(mx * cell_size_map, my * cell_size_map, cell_size_map, cell_size_map);
                mactx.strokeRect(mx * cell_size_map, my * cell_size_map, cell_size_map, cell_size_map);
              }
            }
          }
        }
        if ($('#pixel_art').prop('checked')) {
          pactx.putImageData(obj.start_img, 0, 0);
          for (let y = 0; y < ori_arry.length; y++) {
            for (let x = 0; x < ori_arry[y].length; x++) {
              count++;
              if (count >= 17000) {
                break;
              }
              let alt = ori_arry[y][x];
              pactx.lineWidth = 0.5;
              pactx.strokeStyle = '#f5f5f5';
              pactx.fillStyle = 'white';
              let image = null;
              if (alt != 0) {
                image = cp_obj[alt].img;
              }
              let mx = obj.fir_x + x + obj.end_x - obj.start_x;
              let my = obj.fir_y + y + obj.end_y - obj.start_y;
              if ($('#for_horizontal_flip').prop('checked')) {
                mx = obj.fir_x + ori_arry[y].length - x + obj.end_x - obj.start_x;
              }
              if ($('#for_vertical_flip').prop('checked')) {
                my = obj.fir_y + ori_arry.length - y + obj.end_y - obj.start_y;
              }
              if (mx >= 0 && mx < $('#pixel_art_size').val() && my >= 0 && my < $('#pixel_art_size').val()) {
                pactx.fillRect(mx * cell_size_map, my * cell_size_map, cell_size_map, cell_size_map);
                if (image !== null) {
                  pactx.drawImage(image, mx * cell_size_map, my * cell_size_map, cell_size_map, cell_size_map);
                }
                pactx.strokeRect(mx * cell_size_map, my * cell_size_map, cell_size_map, cell_size_map);
              }
            }
          }
        }
      }
      if (obj.want_if === 'resize_area_with_rect') {
        let center = {x: obj.fir_x + ori_arry[0].length / 2, y: obj.fir_y + ori_arry.length / 2};
        let ratio = {w: 1, h: 1};
        if (Math.abs(obj.start_y - center.y) > 0) {
          ratio.h = Math.abs((obj.end_y - center.y) / (obj.start_y - center.y));
          if (isNaN(ratio.h)) {
            ratio.h = 1;
          }
        }
        if (Math.abs(obj.start_x - center.x) > 0) {
          ratio.w = Math.abs((obj.end_x - center.x) / (obj.start_x - center.x));
          if (isNaN(ratio.w)) {
            ratio.w = 1;
          }
        }
        if ($('#map_art').prop('checked')) {
          mactx.putImageData(obj.start_img, 0, 0);
          for (let y = 0; y < Math.round(ori_arry.length * ratio.h); y++) {
            for (let x = 0; x < Math.round(ori_arry[0].length * ratio.w); x++) {
              count++;
              if (count >= 17000) {
                break;
              }
              const maxY = Math.min(ori_arry.length - 1, Math.round(y / ratio.h));
              const maxX = Math.min(ori_arry[0].length - 1, Math.round(x / ratio.w));
              let alt = ori_arry[maxY][maxX];
              mactx.lineWidth = 0.5;
              mactx.strokeStyle = '#f5f5f5';
              mactx.fillStyle = 'white';
              if (alt != 0) {
                mactx.fillStyle = cp_obj[alt].color;
              }
              let d = 0;
              if (Math.abs(obj.end_y - obj.fir_y) > 0) {
                d = (obj.end_x - obj.fir_x) / Math.abs(obj.end_x - obj.fir_x);
              }
              let mx = Math.round(center.x + (x - ori_arry[0].length * ratio.w / 2) * d);
              d = 0;
              if (Math.abs(obj.end_y - obj.fir_y) > 0) {
                d = (obj.end_y - obj.fir_y) / Math.abs(obj.end_y - obj.fir_y);
              }
              let my = Math.round(center.y + (y - ori_arry.length * ratio.h / 2) * d);
              if (mx >= 0 && mx < $('#map_art_size').val() && my >= 0 && my < $('#map_art_size').val()) {
                mactx.fillRect(mx * cell_size_map, my * cell_size_map, cell_size_map, cell_size_map);
                mactx.strokeRect(mx * cell_size_map, my * cell_size_map, cell_size_map, cell_size_map);
              }
            }
          }
        }
        if ($('#pixel_art').prop('checked')) {
          pactx.putImageData(obj.start_img, 0, 0);
          for (let y = 0; y < Math.round(ori_arry.length * ratio.h); y++) {
            for (let x = 0; x < Math.round(ori_arry[0].length * ratio.w); x++) {
              count++;
              if (count >= 17000) {
                break;
              }
              const maxY = Math.min(ori_arry.length - 1, Math.round(y / ratio.h));
              const maxX = Math.min(ori_arry[0].length - 1, Math.round(x / ratio.w));
              let alt = ori_arry[maxY][maxX];
              pactx.lineWidth = 0.5;
              pactx.strokeStyle = '#f5f5f5';
              pactx.fillStyle = 'white';
              let image = null;
              if (alt != 0) {
                image = cp_obj[alt].img;
              }
              let d = 0;
              if (Math.abs(obj.end_y - obj.fir_y) > 0) {
                d = (obj.end_x - obj.fir_x) / Math.abs(obj.end_x - obj.fir_x);
              }
              let mx = Math.round(center.x + (x - ori_arry[0].length * ratio.w / 2) * d);
              d = 0;
              if (Math.abs(obj.end_y - obj.fir_y) > 0) {
                d = (obj.end_y - obj.fir_y) / Math.abs(obj.end_y - obj.fir_y);
              }
              let my = Math.round(center.y + (y - ori_arry.length * ratio.h / 2) * d);
              if (mx >= 0 && mx < $('#pixel_art_size').val() && my >= 0 && my < $('#pixel_art_size').val()) {
                pactx.fillRect(mx * cell_size_map, my * cell_size_map, cell_size_map, cell_size_map);
                if (image !== null) {
                  pactx.drawImage(image, mx * cell_size_map, my * cell_size_map, cell_size_map, cell_size_map);
                }
                pactx.strokeRect(mx * cell_size_map, my * cell_size_map, cell_size_map, cell_size_map);
              }
            }
          }
        }
      }
      if (obj.want_if === 'roll_area_with_rect') {
        let center = {x: obj.fir_x + ori_arry[0].length / 2, y: obj.fir_y + ori_arry.length / 2};
        let end_data = calculateDistanceAngle(center.x, center.y, obj.end_x, obj.end_y);
        let start_data = calculateDistanceAngle(center.x, center.y, obj.fir_x, obj.fir_y);
        let ang = end_data.ang - (start_data.ang + Math.PI);
        if (ang < 0) {
          ang += 2 * Math.PI;
        }
        if ($('#map_art').prop('checked')) {
          mactx.putImageData(obj.start_img, 0, 0);
          for (let h = 0; h < 2 * Math.round(start_data.dis); h++) {
            for (let w = 0; w < 2 * Math.round(start_data.dis); w++) {
              if (Math.sqrt((w - Math.round(start_data.dis)) ** 2 + (h - Math.round(start_data.dis)) ** 2) <= Math.round(start_data.dis)) {
                count++;
                if (count >= 17000) {
                  break;
                }
                let cell_data = calculateDistanceAngle(Math.round(start_data.dis), Math.round(start_data.dis), w, h);
                let x = Math.round(ori_arry[0].length / 2 + cell_data.dis * Math.cos(cell_data.ang - ang));
                let y = Math.round(ori_arry.length / 2 + cell_data.dis * Math.sin(cell_data.ang - ang));
                if (isNaN(x) || isNaN(y)) {
                  continue;
                }
                if (x >= 0 && x < ori_arry[0].length && y >= 0 && y < ori_arry.length) {
                  mactx.lineWidth = 0.5;
                  mactx.strokeStyle = '#f5f5f5';
                  mactx.fillStyle = 'white';
                  let alt = ori_arry[y][x];
                  if (alt != 0) {
                    mactx.fillStyle = cp_obj[alt].color;
                  }
                  let mx = Math.round(center.x + w - Math.round(start_data.dis));
                  let my = Math.round(center.y + h - Math.round(start_data.dis));
                  if (mx >= 0 && mx < $('#map_art_size').val() && my >= 0 && my < $('#map_art_size').val()) {
                    mactx.fillRect(mx * cell_size_map, my * cell_size_map, cell_size_map, cell_size_map);
                    mactx.strokeRect(mx * cell_size_map, my * cell_size_map, cell_size_map, cell_size_map);
                  }
                }
              }
            }
          }
        }
        if ($('#pixel_art').prop('checked')) {
          pactx.putImageData(obj.start_img, 0, 0);
          for (let h = 0; h < 2 * Math.round(start_data.dis); h++) {
            for (let w = 0; w < 2 * Math.round(start_data.dis); w++) {
              if (Math.sqrt((w - Math.round(start_data.dis)) ** 2 + (h - Math.round(start_data.dis)) ** 2) <= Math.round(start_data.dis)) {
                count++;
                if (count >= 17000) {
                  break;
                }
                let cell_data = calculateDistanceAngle(Math.round(start_data.dis), Math.round(start_data.dis), w, h);
                let x = Math.round(ori_arry[0].length / 2 + cell_data.dis * Math.cos(cell_data.ang - ang));
                let y = Math.round(ori_arry.length / 2 + cell_data.dis * Math.sin(cell_data.ang - ang));
                if (isNaN(x) || isNaN(y)) {
                  continue;
                }
                if (x >= 0 && x < ori_arry[0].length && y >= 0 && y < ori_arry.length) {
                  let alt = ori_arry[y][x];
                  pactx.lineWidth = 0.5;
                  pactx.strokeStyle = '#f5f5f5';
                  pactx.fillStyle = 'white';
                  let image = null;
                  if (alt != 0) {
                    image = cp_obj[alt].img;
                  }
                  let mx = Math.round(center.x + w - Math.round(start_data.dis));
                  let my = Math.round(center.y + h - Math.round(start_data.dis));
                  if (mx >= 0 && mx < $('#pixel_art_size').val() && my >= 0 && my < $('#pixel_art_size').val()) {
                    pactx.fillRect(mx * cell_size_map, my * cell_size_map, cell_size_map, cell_size_map);
                    if (image !== null) {
                      pactx.drawImage(image, mx * cell_size_map, my * cell_size_map, cell_size_map, cell_size_map);
                    }
                    pactx.strokeRect(mx * cell_size_map, my * cell_size_map, cell_size_map, cell_size_map);
                  }
                }
              }
            }
          }
        }
      }
    }
    if ($('#draw_art').prop('checked')) {
      let copyed_obj = return_first_copyed_obj (e);
      dactx.putImageData(obj.start_img, 0, 0);
      if (obj.want_if === 'copy_area_with_rect' || obj.want_if === 'resize_area_with_rect') {
        dactx.translate((copyed_obj.x + copyed_obj.w / 2), (copyed_obj.y + copyed_obj.h / 2));
        dactx.scale(copyed_obj.scale[0], copyed_obj.scale[1]);
        dactx.drawImage(copyed_obj.put_img, -copyed_obj.w / 2, -copyed_obj.h / 2, copyed_obj.w, copyed_obj.h);
        dactx.strokeRect(-copyed_obj.w / 2, -copyed_obj.h / 2, copyed_obj.w, copyed_obj.h);
        dactx.scale(copyed_obj.scale[0], copyed_obj.scale[1]);
        dactx.translate(-(copyed_obj.x + copyed_obj.w / 2), -(copyed_obj.y + copyed_obj.h / 2));
      }
      if (obj.want_if === 'roll_area_with_rect') {
        dactx.translate(copyed_obj.xc, copyed_obj.yc);
        dactx.rotate(copyed_obj.piMove - copyed_obj.piBase);
        dactx.strokeRect(-copyed_obj.put_img.width / 2, -copyed_obj.put_img.height / 2, copyed_obj.put_img.width, copyed_obj.put_img.height);
        dactx.drawImage(copyed_obj.put_img, -copyed_obj.put_img.width / 2, -copyed_obj.put_img.height / 2, copyed_obj.put_img.width, copyed_obj.put_img.height);
        dactx.rotate(copyed_obj.piBase - copyed_obj.piMove);
        dactx.translate(-copyed_obj.xc, -copyed_obj.yc);
      }
    }
    document.addEventListener('mouseup', rect_SecondUp);
    document.addEventListener('touchend', rect_SecondUp);
    return false;
  }
}
function return_want_if_at_tool (e) {
  let want_if = 'false';
  if ($('#map_canvas_open_icon').prop('checked')) {
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
  if (obj.want_if === 'stroke_path_with_line' || obj.want_if === 'fill_in_with_line') {
    if ($('#map_art').prop('checked') || $('#pixel_art').prop('checked')) {
      stroke_straight_path_with_line(e);
    }
    if ($('#draw_art').prop('checked')) {
      stroke_path_with_line(e);
    }
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
  if (!do_flag || event.shiftKey || event.ctrlKey) {
    return false;
  }
  do_flag = false;
  obj.use = 'mouse';
  obj.one_time_arry = deepCopyArray(roll_back_obj.map[roll_back_obj.map.length - roll_back_obj.c_map - 1]);
  if (obj.one_time_arry === undefined) {
    roll_back_obj.map.pop();
    do_flag = true;
    return false;
  }
  obj.want_if = return_want_if_at_tool ();
  if (obj.want_if === 'false') {
    all_removeEventListener (e);
    return false;
  }
  if (obj.want_if === 'true') {
    all_removeEventListener (e);
    return true;
  }
  obj.start_x = e.clientX - mac.getBoundingClientRect().left;
  obj.start_y = e.clientY - mac.getBoundingClientRect().top;
  obj.start_img = mactx.getImageData(0, 0, mac.width, mac.height);
  if (obj.start_x >= 0 && obj.start_x < mac.width && obj.start_y >=0 && obj.start_y < mac.height) {
    cell_size_map = mac.width / $('#map_art_size').val();
    obj.start_x = Math.floor(obj.start_x / cell_size_map);
    obj.start_y = Math.floor(obj.start_y / cell_size_map);
  } else {
    all_removeEventListener (e);
    return false;
  }
  if (obj.want_if === 'fill_tool_of_paint_roller' || obj.want_if === 'area_cut_tool_of_scissors') {
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
    $('html').css('cursor', 'wait');
    setTimeout(() => {
      fill_tool_of_paint_roller(e);
    }, "1")
  }
  else if (obj.want_if === 'color_dropper_icon') {
    color_dropper_icon(e);
  }
  else if (obj.want_if === 'stroke_path_with_line' || obj.want_if === 'fill_in_with_line') {
    while (roll_back_obj.c_one_time > 0) {
      roll_back_obj.tableP.pop();
      roll_back_obj.c_one_time--;
    }
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
    mac.addEventListener('mousemove', choose_fun);
    mac.addEventListener('mouseup', end_fun);
  }
  else if (obj.want_if === 'copy_area_with_rect' || obj.want_if === 'resize_area_with_rect' || obj.want_if === 'roll_area_with_rect') {
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
    mac.addEventListener('mousemove', choose_fun);
  }
  else {
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
    mac.addEventListener('mousemove', choose_fun);
    mac.addEventListener('mouseup', end_fun);
  }
};
pac.onmousedown = function (e) {
  if (!do_flag || event.shiftKey || event.ctrlKey) {
    return false;
  }
  do_flag = false;
  obj.use = 'mouse';
  obj.one_time_arry = deepCopyArray(roll_back_obj.pixel[roll_back_obj.pixel.length - roll_back_obj.c_pixel - 1]);
  if (obj.one_time_arry === undefined) {
    roll_back_obj.pixel.pop();
    do_flag = true;
    return false;
  }
  obj.want_if = return_want_if_at_tool ();
  if (obj.want_if === 'false') {
    all_removeEventListener (e);
    return false;
  }
  if (obj.want_if === 'true') {
    all_removeEventListener (e);
    return true;
  }
  obj.start_x = e.clientX - pac.getBoundingClientRect().left;
  obj.start_y = e.clientY - pac.getBoundingClientRect().top;
  obj.start_img = pactx.getImageData(0, 0, pac.width, pac.height);
  if (obj.start_x >= 0 && obj.start_x < pac.width && obj.start_y >=0 && obj.start_y < pac.height) {
    cell_size_map = pac.width / $('#pixel_art_size').val();
    obj.start_x = Math.floor(obj.start_x / cell_size_map);
    obj.start_y = Math.floor(obj.start_y / cell_size_map);
  } else {
    all_removeEventListener (e);
    return false;
  }
  if (obj.want_if === 'fill_tool_of_paint_roller' || obj.want_if === 'area_cut_tool_of_scissors') {
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
    $('html').css('cursor', 'wait');
    setTimeout(() => {
      fill_tool_of_paint_roller(e);
    }, "1")
  }
  else if (obj.want_if === 'color_dropper_icon') {
    color_dropper_icon(e);
  }
  else if (obj.want_if === 'stroke_path_with_line' || obj.want_if === 'fill_in_with_line') {
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
dac.onmousedown = function (e) {
  if (!do_flag || event.shiftKey || event.ctrlKey) {
    return false;
  }
  do_flag = false;
  obj.use = 'mouse';
  obj.want_if = return_want_if_at_tool ();
  if (obj.want_if === 'false') {
    all_removeEventListener (e);
    return false;
  }
  if (obj.want_if === 'true') {
    all_removeEventListener (e);
    return true;
  }
  let scale = Number($('#draw_art_scale').val()) / 100;
  obj.start_x = (e.clientX - dac.getBoundingClientRect().left) / scale;
  obj.start_y = (e.clientY - dac.getBoundingClientRect().top) / scale;
  obj.start_img = dactx.getImageData(0, 0, dac.width, dac.height);
  if (obj.start_x < 0 || obj.start_x >= dac.width || obj.start_y < 0 || obj.start_y >= dac.height) {
    all_removeEventListener (e);
    return false;
  }
  if (obj.want_if === 'fill_tool_of_paint_roller' || obj.want_if === 'area_cut_tool_of_scissors') {
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
    $('html').css('cursor', 'wait');
    setTimeout(() => {
      fill_tool_of_paint_roller(e);
    }, "1")
  }
  else if (obj.want_if === 'color_dropper_icon') {
    color_dropper_icon(e);
  }
  else if (obj.want_if === 'stroke_path_with_line' || obj.want_if === 'fill_in_with_line') {
    while (roll_back_obj.c_one_time > 0) {
      roll_back_obj.tableP.pop();
      roll_back_obj.one_time_img.pop();
      roll_back_obj.c_one_time--;
    }
    isDragging = false;
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
    dac.addEventListener('mousemove', choose_fun);
    dac.addEventListener('mouseup', end_fun);
  }
  else if (obj.want_if === 'copy_area_with_rect' || obj.want_if === 'resize_area_with_rect' || obj.want_if === 'roll_area_with_rect') {
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
    dac.addEventListener('mousemove', choose_fun);
  }
  else {
    document.addEventListener('mousemove', handleTouchMove, { passive: false });
    dac.addEventListener('mousemove', choose_fun);
    dac.addEventListener('mouseup', end_fun);
  }
};
mac.addEventListener('touchstart', function (e) {
  if (!do_flag || event.shiftKey || event.ctrlKey) {
    return false;
  }
  do_flag = false;
  obj.use = 'touch';
  obj.one_time_arry = deepCopyArray(roll_back_obj.map[roll_back_obj.map.length - roll_back_obj.c_map - 1]);
  if (obj.one_time_arry === undefined) {
    roll_back_obj.map.pop();
    do_flag = true;
    return false;
  }
  obj.want_if = return_want_if_at_tool ();
  if (obj.want_if === 'false') {
    all_removeEventListener (e);
    return false;
  }
  if (obj.want_if === 'true') {
    all_removeEventListener (e);
    return true;
  }
  obj.start_x = e.touches[0].clientX - mac.getBoundingClientRect().left;
  obj.start_y = e.touches[0].clientY - mac.getBoundingClientRect().top;
  obj.start_img = mactx.getImageData(0, 0, mac.width, mac.height);
  if (obj.start_x >= 0 && obj.start_x < mac.width && obj.start_y >=0 && obj.start_y < mac.height) {
    cell_size_map = mac.width / $('#map_art_size').val();
    obj.start_x = Math.floor(obj.start_x / cell_size_map);
    obj.start_y = Math.floor(obj.start_y / cell_size_map);
  } else {
    all_removeEventListener (e);
    return false;
  }
  if (obj.want_if === 'fill_tool_of_paint_roller' || obj.want_if === 'area_cut_tool_of_scissors') {
    document.addEventListener('touchstart', handleTouchMove, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    $('html').css('cursor', 'wait');
    setTimeout(() => {
      fill_tool_of_paint_roller(e);
    }, "1")
  }
  else if (obj.want_if === 'color_dropper_icon') {
    color_dropper_icon(e);
  }
  else if (obj.want_if === 'stroke_path_with_line' || obj.want_if === 'fill_in_with_line') {
    while (roll_back_obj.c_one_time > 0) {
      roll_back_obj.tableP.pop();
      roll_back_obj.c_one_time--;
    }
    document.addEventListener('touchstart', handleTouchMove, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    mac.addEventListener('touchmove', choose_fun);
    mac.addEventListener('touchend', end_fun);
  }
  else if (obj.want_if === 'copy_area_with_rect' || obj.want_if === 'resize_area_with_rect' || obj.want_if === 'roll_area_with_rect') {
    document.addEventListener('touchstart', handleTouchMove, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    mac.addEventListener('touchmove', choose_fun);
  }
  else {
    document.addEventListener('touchstart', handleTouchMove, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    mac.addEventListener('touchmove', choose_fun);
    mac.addEventListener('touchend', end_fun);
  }
});
pac.addEventListener('touchstart', function (e) {
  if (!do_flag || event.shiftKey || event.ctrlKey) {
    return false;
  }
  do_flag = false;
  obj.use = 'touch';
  obj.one_time_arry = deepCopyArray(roll_back_obj.pixel[roll_back_obj.pixel.length - roll_back_obj.c_pixel - 1]);
  if (obj.one_time_arry === undefined) {
    roll_back_obj.pixel.pop();
    do_flag = true;
    return false;
  }
  obj.want_if = return_want_if_at_tool ();
  if (obj.want_if === 'false') {
    all_removeEventListener (e);
    return false;
  }
  if (obj.want_if === 'true') {
    all_removeEventListener (e);
    return true;
  }
  obj.start_x = e.touches[0].clientX - pac.getBoundingClientRect().left;
  obj.start_y = e.touches[0].clientY - pac.getBoundingClientRect().top;
  obj.start_img = pactx.getImageData(0, 0, pac.width, pac.height);
  if (obj.start_x >= 0 && obj.start_x < pac.width && obj.start_y >=0 && obj.start_y < pac.height) {
    cell_size_map = pac.width / $('#pixel_art_size').val();
    obj.start_x = Math.floor(obj.start_x / cell_size_map);
    obj.start_y = Math.floor(obj.start_y / cell_size_map);
  } else {
    all_removeEventListener (e);
    return false;
  }
  if (obj.want_if === 'fill_tool_of_paint_roller' || obj.want_if === 'area_cut_tool_of_scissors') {
    document.addEventListener('touchstart', handleTouchMove, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    $('html').css('cursor', 'wait');
    setTimeout(() => {
      fill_tool_of_paint_roller(e);
    }, "1")
  }
  else if (obj.want_if === 'color_dropper_icon') {
    color_dropper_icon(e);
  }
  else if (obj.want_if === 'stroke_path_with_line' || obj.want_if === 'fill_in_with_line') {
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
dac.addEventListener('touchstart', function (e) {
  if (!do_flag || event.shiftKey || event.ctrlKey) {
    return false;
  }
  do_flag = false;
  obj.use = 'touch';
  obj.want_if = return_want_if_at_tool ();
  if (obj.want_if === 'false') {
    all_removeEventListener (e);
    return false;
  }
  if (obj.want_if === 'true') {
    all_removeEventListener (e);
    return true;
  }
  let scale = Number($('#draw_art_scale').val()) / 100;
  obj.start_x = (e.touches[0].clientX - dac.getBoundingClientRect().left) / scale;
  obj.start_y = (e.touches[0].clientY - dac.getBoundingClientRect().top) / scale;
  obj.start_img = dactx.getImageData(0, 0, dac.width, dac.height);
  if (obj.start_x < 0 || obj.start_x >= dac.width || obj.start_y < 0 || obj.start_y >= dac.height) {
    all_removeEventListener (e);
    return false;
  }
  if (obj.want_if === 'fill_tool_of_paint_roller' || obj.want_if === 'area_cut_tool_of_scissors') {
    document.addEventListener('touchstart', handleTouchMove, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    $('html').css('cursor', 'wait');
    setTimeout(() => {
      fill_tool_of_paint_roller(e);
    }, "1")
  }
  else if (obj.want_if === 'color_dropper_icon') {
    color_dropper_icon(e);
  }
  else if (obj.want_if === 'stroke_path_with_line' || obj.want_if === 'fill_in_with_line') {
    while (roll_back_obj.c_one_time > 0) {
      roll_back_obj.tableP.pop();
      roll_back_obj.one_time_img.pop();
      roll_back_obj.c_one_time--;
    }
    isDragging = false;
    document.addEventListener('touchstart', handleTouchMove, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    dac.addEventListener('touchmove', choose_fun);
    dac.addEventListener('touchend', end_fun);
  }
  else if (obj.want_if === 'copy_area_with_rect' || obj.want_if === 'resize_area_with_rect' || obj.want_if === 'roll_area_with_rect') {
    document.addEventListener('touchstart', handleTouchMove, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    dac.addEventListener('touchmove', choose_fun);
  }
  else {
    document.addEventListener('touchstart', handleTouchMove, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    dac.addEventListener('touchmove', choose_fun);
    dac.addEventListener('touchend', end_fun);
  }
});
/*all removeEventListener at window remove*/
document.addEventListener('beforeunload', all_removeEventListener);
document.addEventListener('mouseleave', all_removeEventListener);
//roll_back
function roll_back (e) {
  roll_back_obj.c_one_time++;
  if ($('#map_art').prop('checked')) {
    roll_back_obj.c_map++;
    if (roll_back_obj.c_map >= roll_back_obj.map.length) {
      roll_back_obj.c_map--;
      roll_back_obj.c_one_time = roll_back_obj.c_map;
      return false;
    }
    let value = roll_back_obj.map[roll_back_obj.map.length - 1 - roll_back_obj.c_map];
    $('#map_art_size').val(value.length);
    make_canvas (value);
  }
  if ($('#pixel_art').prop('checked')) {
    roll_back_obj.c_pixel++;
    if (roll_back_obj.c_pixel >= roll_back_obj.pixel.length) {
      roll_back_obj.c_pixel--;
      roll_back_obj.c_one_time = roll_back_obj.c_pixel;
      return false;
    }
    let value = roll_back_obj.pixel[roll_back_obj.pixel.length - 1 - roll_back_obj.c_pixel];
    $('#pixel_art_size').val(value.length);
    make_canvas (value);
  }
  if ($('#draw_art').prop('checked')) {
    if (roll_back_obj.c_one_time < roll_back_obj.one_time_img.length && roll_back_obj.one_time_img.length > 0) {
      let value = roll_back_obj.one_time_img[roll_back_obj.one_time_img.length - 1 - roll_back_obj.c_one_time];
      dactx.putImageData(value, 0, 0);
    }
    else if (roll_back_obj.c_one_time <= roll_back_obj.one_time_img.length && roll_back_obj.one_time_img.length > 0) {
      let value = roll_back_obj.draw[roll_back_obj.draw.length - 1 - roll_back_obj.c_draw];
      if (value === null) {
        dactx.fillStyle = "white";
        dactx.fillRect(0, 0, dac.width, dac.height);
      }
      if (value !== null) {
        dactx.putImageData(value, 0, 0);
      }
    }
    else {
      roll_back_obj.c_draw ++;
      if (roll_back_obj.c_draw >= roll_back_obj.draw.length) {
        roll_back_obj.c_draw--;
        roll_back_obj.c_one_time = roll_back_obj.c_draw + roll_back_obj.one_time_img.length;
        return false;
      }
      let value = roll_back_obj.draw[roll_back_obj.draw.length - 1 - roll_back_obj.c_draw];
      if (value === null) {
        dactx.fillStyle = "white";
        dactx.fillRect(0, 0, dac.width, dac.height);
      }
      if (value !== null) {
        dactx.putImageData(value, 0, 0);
      }
    }
  }
}
$('.roll_back_and_forward .roll_back').click((e) => {
  roll_back (e);
});
//roll_forward
function roll_forward (e) {
  roll_back_obj.c_one_time--;
  if (roll_back_obj.c_one_time < 0) {
    roll_back_obj.c_one_time = 0;
  }
  if ($('#map_art').prop('checked')) {
    roll_back_obj.c_map--;
    if (roll_back_obj.c_map < 0) {
      roll_back_obj.c_map = 0;
      return false;
    }
    let value = roll_back_obj.map[roll_back_obj.map.length - 1 - roll_back_obj.c_map];
    $('#map_art_size').val(value.length);
    make_canvas (value);
  }
  if ($('#pixel_art').prop('checked')) {
    roll_back_obj.c_pixel--;
    if (roll_back_obj.c_pixel < 0) {
      roll_back_obj.c_pixel = 0;
      return false;
    }
    let value = roll_back_obj.pixel[roll_back_obj.pixel.length - 1 - roll_back_obj.c_pixel];
    $('#pixel_art_size').val(value.length);
    make_canvas (value);
  }
  if ($('#draw_art').prop('checked')) {
    if (roll_back_obj.c_one_time < roll_back_obj.one_time_img.length && roll_back_obj.one_time_img.length > 0) {
      let value = roll_back_obj.one_time_img[roll_back_obj.one_time_img.length - 1 - roll_back_obj.c_one_time];
      dactx.putImageData(value, 0, 0);
    }
    else if (roll_back_obj.c_one_time <= roll_back_obj.one_time_img.length && roll_back_obj.one_time_img.length > 0) {
      roll_back_obj.c_draw --;
      let value = roll_back_obj.draw[roll_back_obj.draw.length - 1 - roll_back_obj.c_draw];
      if (value === null) {
        dactx.fillStyle = "white";
        dactx.fillRect(0, 0, dac.width, dac.height);
      }
      if (value !== null) {
        dactx.putImageData(value, 0, 0);
      }
    }
    else {
      roll_back_obj.c_draw --;
      if (roll_back_obj.c_draw < 0) {
        roll_back_obj.c_draw = 0;
        return false;
      }
      let value = roll_back_obj.draw[roll_back_obj.draw.length - 1 - roll_back_obj.c_draw];
      if (value === null) {
        dactx.fillStyle = "white";
        dactx.fillRect(0, 0, dac.width, dac.height);
      }
      if (value !== null) {
        dactx.putImageData(value, 0, 0);
      }
    }
  }
}
$('.roll_back_and_forward .roll_forward').click((e) => {
  roll_forward (e);
});
//shortcuts for roll_back_and_forward & ZoomUpDown
document.addEventListener('keydown', keydown_event, false);
function keydown_event(e) {
  //only key
  if ($('#stroke_path_with_line').prop('checked') || $('#fill_in_with_line').prop('checked')) {
    if (roll_back_obj.tableP.length) {
      if (event.ctrlKey || event.shiftKey) {
        $('#editing_areas').css('cursor', 'crosshair');
      } else {
        $('#editing_areas').css('cursor', 'default');
      }
    }
  }
  //shift + key
  //ctrl + key
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyZ") {
    event.preventDefault();
    $('.roll_back_and_forward .roll_back').click();
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "NumpadAdd") {
    event.preventDefault();
    let scope = 'plus';
    scope_action(scope, 'shortcut', 'shortcut');
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "NumpadSubtract") {
    event.preventDefault();
    let scope = 'minus';
    scope_action(scope, 'shortcut', 'shortcut');
  }
  if(event.ctrlKey && !event.shiftKey) {
    if (event.code === 'Digit0' || event.code === "Numpad0") {
      event.preventDefault();
      let edit = document.getElementById('editing_areas');
      let point = {x: edit.clientWidth / 2 + edit.scrollLeft, y: edit.clientHeight / 2 + edit.scrollTop};
      let scale = 100;
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
      resize_canvas (scale, point);
    }
  }
  //ctrl + shift + key
  if(event.ctrlKey && event.shiftKey && event.code === "KeyZ") {
    event.preventDefault();
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
  let value = dactx.getImageData(0, 0, dac.width, dac.height);
  add_canvas_to_roll_back_obj (value);
  return false;
};
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
  if ($('#map_art').prop('checked') || $('#pixel_art').prop('checked')) {
    if ($('#map_art').prop('checked')) {
      obj.one_time_arry = deepCopyArray(roll_back_obj.map[roll_back_obj.map.length - roll_back_obj.c_map - 1]);
    }
    if ($('#pixel_art').prop('checked')) {
      obj.one_time_arry = deepCopyArray(roll_back_obj.pixel[roll_back_obj.pixel.length - roll_back_obj.c_pixel - 1]);
    }
    let edge = [];
    if (obj.want_if === 'fill_in_with_line') {
      roll_back_obj.tableP.forEach((item, n) => {
        if (n >= roll_back_obj.tableP.length - 1) {
          return false;
        }
        let data = calculateDistanceAngle(item.x, item.y, roll_back_obj.tableP[n + 1].x, roll_back_obj.tableP[n + 1].y);
        for (let i = 0; i < data.dis; i++) {
          let x = item.x + Math.round(i * Math.cos(data.ang));
          let y = item.y + Math.round(i * Math.sin(data.ang));
          if (x >= 0 && x < $('#map_art_size').val() && y >= 0 && y < $('#map_art_size').val() && $('#map_art').prop('checked')) {
            if (!edge[y]) {
              edge[y] = [];
            }
            edge[y][x] = 'edge';
          }
          if (x >= 0 && x < $('#pixel_art_size').val() && y >= 0 && y < $('#pixel_art_size').val() && $('#pixel_art').prop('checked')) {
            if (!edge[y]) {
              edge[y] = [];
            }
            edge[y][x] = 'edge';
          }
        }
      });
    }
    obj.start_x = roll_back_obj.tableP[roll_back_obj.tableP.length - 1].x;
    obj.start_y = roll_back_obj.tableP[roll_back_obj.tableP.length - 1].y;
    obj.end_x = roll_back_obj.tableP[0].x;
    obj.end_y = roll_back_obj.tableP[0].y;
    let data = calculateDistanceAngle(obj.start_x, obj.start_y, obj.end_x, obj.end_y);
    let alt = $('#CP label.check .CPimg img.mImg').attr('alt');
    if ($('#map_art').prop('checked')) {
      cell_size_map = mac.width / $('#map_art_size').val();
      mactx.lineWidth = 0.5;
      mactx.strokeStyle = '#f5f5f5';
      mactx.fillStyle = cp_obj[alt].color;
      let line_bold = $('#line_bold_for_draw').val();
      if ($('#for_cut_area').prop('checked') && obj.want_if === 'fill_in_with_line') {
        alt = 0;
        line_bold = 1;
        mactx.fillStyle = 'white';
      }
      for (let i = 0; i < data.dis; i++) {
        let mx = obj.start_x + Math.round(i * Math.cos(data.ang));
        let my = obj.start_y + Math.round(i * Math.sin(data.ang));
        if (mx >= 0 && mx < $('#map_art_size').val() && my >= 0 && my < $('#map_art_size').val() && obj.want_if === 'fill_in_with_line') {
          if (!edge[my]) {
            edge[my] = [];
          }
          edge[my][mx] = 'edge';
        }
        for (let a = 0; a < line_bold ** 2; a++) {
          let x = Math.round(mx - (line_bold - 1) / 2 + a % line_bold);
          let y = Math.round(my - (line_bold - 1) / 2 + Math.floor(a / line_bold));
          if (x >= 0 && x < $('#map_art_size').val() && y >= 0 && y < $('#map_art_size').val()) {
            if (Math.sqrt((mx - x) ** 2 + (my - y) ** 2) < line_bold) {
              mactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              mactx.strokeRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              obj.one_time_arry[y][x] = alt;
            }
          }
        }
      }
      if (obj.want_if === 'fill_in_with_line') {
        for (let y = 0; y < edge.length; y++) {
          let fill_flag = false;
          if (edge[y] === undefined) {
            continue;
          }
          for (let x = 0; x < edge[y].length; x++) {
            if (edge[y][x] === 'edge' && edge[y][x + 1] !== 'edge' && !fill_flag) {
              fill_flag = true;
              mactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              mactx.strokeRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              obj.one_time_arry[y][x] = alt;
            }
            if (fill_flag) {
              mactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              mactx.strokeRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              obj.one_time_arry[y][x] = alt;
            }
            if (edge[y][x] !== 'edge' && edge[y][x + 1] === 'edge' && fill_flag) {
              fill_flag = false;
              mactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              mactx.strokeRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              obj.one_time_arry[y][x] = alt;
              continue;
            }
          }
        }
      }
    }
    if ($('#pixel_art').prop('checked')) {
      cell_size_map = pac.width / $('#pixel_art_size').val();
      const image = cp_obj[alt].img;
      pactx.lineWidth = 0.5;
      pactx.strokeStyle = '#f5f5f5';
      pactx.fillStyle = 'white';
      let line_bold = $('#line_bold_for_draw').val();
      let target_flag = true;
      if ($('#for_cut_area').prop('checked') && obj.want_if === 'fill_in_with_line') {
        alt = 0;
        line_bold = 1;
        target_flag = false;
      }
      for (let i = 0; i < data.dis; i++) {
        let mx = obj.start_x + Math.round(i * Math.cos(data.ang));
        let my = obj.start_y + Math.round(i * Math.sin(data.ang));
        if (mx >= 0 && mx < $('#pixel_art_size').val() && my >= 0 && my < $('#pixel_art_size').val() && obj.want_if === 'fill_in_with_line') {
          if (!edge[my]) {
            edge[my] = [];
          }
          edge[my][mx] = 'edge';
        }
        for (let a = 0; a < line_bold ** 2; a++) {
          let x = Math.round(mx - (line_bold - 1) / 2 + a % line_bold);
          let y = Math.round(my - (line_bold - 1) / 2 + Math.floor(a / line_bold));
          if (x >= 0 && x < $('#pixel_art_size').val() && y >= 0 && y < $('#pixel_art_size').val()) {
            if (Math.sqrt((mx - x) ** 2 + (my - y) ** 2) < line_bold) {
              pactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              if (target_flag) {
                pactx.drawImage(image, x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              }
              pactx.strokeRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              obj.one_time_arry[y][x] = alt;
            }
          }
        }
      }
      if (obj.want_if === 'fill_in_with_line') {
        for (let y = 0; y < edge.length; y++) {
          let fill_flag = false;
          if (edge[y] === undefined) {
            continue;
          }
          for (let x = 0; x < edge[y].length; x++) {
            if (edge[y][x] === 'edge' && edge[y][x + 1] !== 'edge' && !fill_flag) {
              fill_flag = true;
              pactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              if (target_flag) {
                pactx.drawImage(image, x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              }
              pactx.strokeRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              obj.one_time_arry[y][x] = alt;
            }
            if (fill_flag) {
              pactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              if (target_flag) {
                pactx.drawImage(image, x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              }
              pactx.strokeRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              obj.one_time_arry[y][x] = alt;
            }
            if (edge[y][x] !== 'edge' && edge[y][x + 1] === 'edge' && fill_flag) {
              fill_flag = false;
              pactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              if (target_flag) {
                pactx.drawImage(image, x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              }
              pactx.strokeRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              obj.one_time_arry[y][x] = alt;
              continue;
            }
          }
        }
      }
    }
    roll_back_obj.tableP = [];
    roll_back_obj.one_time_img = [];
    roll_back_obj.c_one_time = 0;
    add_canvas_to_roll_back_obj (obj.one_time_arry);
    return false;
  }
  if ($('#draw_art').prop('checked')) {
    let value = roll_back_obj.draw[roll_back_obj.draw.length - roll_back_obj.c_draw - 1];
    if (value === null) {
      dactx.fillStyle = "white";
      dactx.fillRect(0, 0, dac.width, dac.height);
      close_path_finish();
    }
    if (value !== null) {
      dactx.putImageData(value, 0, 0);
      close_path_finish();
    }
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
  let value = dactx.getImageData(0, 0, dac.width, dac.height);
  add_canvas_to_roll_back_obj (value);
  return false;
};
function to_open_path (e) {
  while (roll_back_obj.c_one_time > 0) {
    roll_back_obj.tableP.pop();
    roll_back_obj.c_one_time --;
  }
  if (roll_back_obj.tableP.length <= 0) {
    roll_back_obj.one_time_img = [];
    roll_back_obj.c_one_time = 0;
    return false;
  }
  if ($('#map_art').prop('checked') || $('#pixel_art').prop('checked')) {
    if (obj.want_if === 'stroke_path_with_line') {
      roll_back_obj.tableP = [];
      roll_back_obj.one_time_img = [];
      roll_back_obj.c_one_time = 0;
    }
    if (obj.want_if === 'fill_in_with_line') {
      if ($('#map_art').prop('checked')) {
        obj.one_time_arry = deepCopyArray(roll_back_obj.map[roll_back_obj.map.length - roll_back_obj.c_map - 1]);
      }
      if ($('#pixel_art').prop('checked')) {
        obj.one_time_arry = deepCopyArray(roll_back_obj.pixel[roll_back_obj.pixel.length - roll_back_obj.c_pixel - 1]);
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
          if (x >= 0 && x < $('#map_art_size').val() && y >= 0 && y < $('#map_art_size').val() && $('#map_art').prop('checked')) {
            if (!edge[y]) {
              edge[y] = [];
            }
            edge[y][x] = 'edge';
          }
          if (x >= 0 && x < $('#pixel_art_size').val() && y >= 0 && y < $('#pixel_art_size').val() && $('#pixel_art').prop('checked')) {
            if (!edge[y]) {
              edge[y] = [];
            }
            edge[y][x] = 'edge';
          }
        }
      });
      obj.start_x = roll_back_obj.tableP[roll_back_obj.tableP.length - 1].x;
      obj.start_y = roll_back_obj.tableP[roll_back_obj.tableP.length - 1].y;
      obj.end_x = roll_back_obj.tableP[0].x;
      obj.end_y = roll_back_obj.tableP[0].y;
      let data = calculateDistanceAngle(obj.start_x, obj.start_y, obj.end_x, obj.end_y);
      let alt = $('#CP label.check .CPimg img.mImg').attr('alt');
      if ($('#map_art').prop('checked')) {
        cell_size_map = mac.width / $('#map_art_size').val();
        mactx.lineWidth = 0.5;
        mactx.strokeStyle = '#f5f5f5';
        mactx.fillStyle = cp_obj[alt].color;
        if ($('#for_cut_area').prop('checked')) {
          alt = 0;
          mactx.fillStyle = 'white';
        }
        for (let i = 0; i < data.dis; i++) {
          let x = obj.start_x + Math.round(i * Math.cos(data.ang));
          let y = obj.start_y + Math.round(i * Math.sin(data.ang));
          if (x >= 0 && x < $('#map_art_size').val() && y >= 0 && y < $('#map_art_size').val()) {
            mactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
            mactx.strokeRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
            obj.one_time_arry[y][x] = alt;
            if (!edge[y]) {
              edge[y] = [];
            }
            edge[y][x] = 'edge';
          }
        }
        for (let y = 0; y < edge.length; y++) {
          let fill_flag = false;
          if (edge[y] === undefined) {
            continue;
          }
          for (let x = 0; x < edge[y].length; x++) {
            if (edge[y][x] === 'edge' && edge[y][x + 1] !== 'edge' && !fill_flag) {
              fill_flag = true;
              mactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              mactx.strokeRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              obj.one_time_arry[y][x] = alt;
            }
            if (fill_flag) {
              mactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              mactx.strokeRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              obj.one_time_arry[y][x] = alt;
            }
            if (edge[y][x] !== 'edge' && edge[y][x + 1] === 'edge' && fill_flag) {
              fill_flag = false;
              mactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              mactx.strokeRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              obj.one_time_arry[y][x] = alt;
              continue;
            }
          }
        }
      }
      if ($('#pixel_art').prop('checked')) {
        cell_size_map = pac.width / $('#pixel_art_size').val();
        const image = cp_obj[alt].img;
        pactx.lineWidth = 0.5;
        pactx.strokeStyle = '#f5f5f5';
        pactx.fillStyle = 'white';
        let line_bold = $('#line_bold_for_draw').val();
        let target_flag = true;
        if ($('#for_cut_area').prop('checked')) {
          alt = 0;
          line_bold = 1;
          target_flag = false;
        }
        for (let i = 0; i < data.dis; i++) {
          let x = obj.start_x + Math.round(i * Math.cos(data.ang));
          let y = obj.start_y + Math.round(i * Math.sin(data.ang));
          if (x >= 0 && x < $('#pixel_art_size').val() && y >= 0 && y < $('#pixel_art_size').val()) {
            pactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
            if (target_flag) {
              pactx.drawImage(image, x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
            }
            pactx.strokeRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
            obj.one_time_arry[y][x] = alt;
            if (!edge[y]) {
              edge[y] = [];
            }
            edge[y][x] = 'edge';
          }
        }
        for (let y = 0; y < edge.length; y++) {
          let fill_flag = false;
          if (edge[y] === undefined) {
            continue;
          }
          for (let x = 0; x < edge[y].length; x++) {
            if (edge[y][x] === 'edge' && edge[y][x + 1] !== 'edge' && !fill_flag) {
              fill_flag = true;
              pactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              if (target_flag) {
                pactx.drawImage(image, x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              }
              pactx.strokeRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              obj.one_time_arry[y][x] = alt;
            }
            if (fill_flag) {
              pactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              if (target_flag) {
                pactx.drawImage(image, x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              }
              pactx.strokeRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              obj.one_time_arry[y][x] = alt;
            }
            if (edge[y][x] !== 'edge' && edge[y][x + 1] === 'edge' && fill_flag) {
              fill_flag = false;
              pactx.fillRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              if (target_flag) {
                pactx.drawImage(image, x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              }
              pactx.strokeRect(x * cell_size_map, y * cell_size_map, cell_size_map, cell_size_map);
              obj.one_time_arry[y][x] = alt;
              continue;
            }
          }
        }
      }
      roll_back_obj.tableP = [];
      roll_back_obj.one_time_img = [];
      roll_back_obj.c_one_time = 0;
      add_canvas_to_roll_back_obj (obj.one_time_arry);
      return false;
    }
  }
  if ($('#draw_art').prop('checked')) {
    let value = roll_back_obj.draw[roll_back_obj.draw.length - roll_back_obj.c_draw - 1];
    if (value === null) {
      dactx.fillStyle = "white";
      dactx.fillRect(0, 0, dac.width, dac.height);
      open_path_finish();
    }
    if (value !== null) {
      dactx.putImageData(value, 0, 0);
      open_path_finish();
    }
  }
}
$('.advanced_tool .to_close_path').click((e) => {
  to_close_path (e);
});
$('.advanced_tool .to_open_path').click((e) => {
  to_open_path (e);
});
/*shortcuts for close_end_line_path & open_end_line_path*/
document.getElementById('editing_areas').addEventListener('click', click_event,false);
function click_event(e){
  if ($('#stroke_path_with_line').prop('checked') || $('#fill_in_with_line').prop('checked')) {
    if(!event.ctrlKey && event.shiftKey) {
      $('.advanced_tool .to_close_path').click();
    }
    if(event.ctrlKey && !event.shiftKey) {
      $('.advanced_tool .to_open_path').click();
    }
  }
}
/*ZoomUpDown action*/
function resize_canvas (scale, point) {
  if ($('#map_art').prop('checked') || $('#pixel_art').prop('checked')) {
    let edit = document.getElementById('editing_areas');
    let value;
    if ($('#map_art').prop('checked')) {
      cell_size_map = mac.width / $('#map_art_size').val();
      point.x = Math.floor(point.x / cell_size_map);
      point.y = Math.floor(point.y / cell_size_map);
      mac.width = Math.round(scale * 600);
      mac.height = Math.round(scale * 600);
      cell_size_map = mac.width / $('#map_art_size').val();
      value = roll_back_obj.map[roll_back_obj.map.length - 1 - roll_back_obj.c_map];
    }
    if ($('#pixel_art').prop('checked')) {
      cell_size_map = pac.width / $('#pixel_art_size').val();
      point.x = Math.floor(point.x / cell_size_map);
      point.y = Math.floor(point.y / cell_size_map);
      pac.width = Math.round(scale * 600);
      pac.height = Math.round(scale * 600);
      cell_size_map = pac.width / $('#pixel_art_size').val();
      value = roll_back_obj.pixel[roll_back_obj.pixel.length - 1 - roll_back_obj.c_pixel];
    }
    make_canvas (value);
    point.x = point.x * cell_size_map - edit.clientWidth / 2;
    point.y = point.y * cell_size_map - edit.clientHeight / 2;
    edit.scrollLeft = point.x;
    edit.scrollTop = point.y;
  }
  if ($('#draw_art').prop('checked')) {
    let bef_w_str = $('#draw_art_canvas').css('width');
    let bef_w_num = parseInt(bef_w_str, 10);
    $('#draw_art_canvas').css('width', Math.round(scale * 600));
    $('#draw_art_canvas').css('height', Math.round(scale * 600));
    let af_w_str = $('#draw_art_canvas').css('width');
    let af_w_num = parseInt(af_w_str, 10);
    let edit = document.getElementById('editing_areas');
    point.x = point.x * (af_w_num / bef_w_num) - edit.clientWidth / 2;
    point.y = point.y * (af_w_num / bef_w_num) - edit.clientHeight / 2;
    edit.scrollLeft = point.x;
    edit.scrollTop = point.y;
  }
}
function scope_action(scope, x, y) {
  let scale, point;
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
  point = {x: x, y: y};
  if (x === 'shortcut') {
    let edit = document.getElementById('editing_areas');
    point = {x: edit.clientWidth / 2 + edit.scrollLeft, y: edit.clientHeight / 2 + edit.scrollTop};
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
  resize_canvas (scale, point);
}
mac.addEventListener("mousedown", function (e) {
  if ($('#zoom_scope_button').prop('checked')) {
    let x = e.clientX - mac.getBoundingClientRect().left;
    let y = e.clientY - mac.getBoundingClientRect().top;
    let scope = 'plus';
    if ($('#minus_scope_icon').prop('checked')) {
      scope = 'minus';
    }
    scope_action(scope, x, y);
  }
});
pac.addEventListener("mousedown", function (e) {
  if ($('#zoom_scope_button').prop('checked')) {
    let x = e.clientX - pac.getBoundingClientRect().left;
    let y = e.clientY - pac.getBoundingClientRect().top;
    let scope = 'plus';
    if ($('#minus_scope_icon').prop('checked')) {
      scope = 'minus';
    }
    scope_action(scope, x, y);
  }
});
dac.addEventListener("mousedown", function (e) {
  if ($('#zoom_scope_button').prop('checked')) {
    let scale = Number($('#draw_art_scale').val()) / 100;
    let x = (e.clientX - dac.getBoundingClientRect().left) / scale;
    let y = (e.clientY - dac.getBoundingClientRect().top) / scale;
    let scope = 'plus';
    if ($('#minus_scope_icon').prop('checked')) {
      scope = 'minus';
    }
    scope_action(scope, x, y);
  }
});
mac.addEventListener("touchstart", function (e) {
  if ($('#zoom_scope_button').prop('checked')) {
    let x = e.touches[0].clientX - mac.getBoundingClientRect().left;
    let y = e.touches[0].clientY - mac.getBoundingClientRect().top;
    let scope = 'plus';
    if ($('#minus_scope_icon').prop('checked')) {
      scope = 'minus';
    }
    scope_action(scope, x, y);
  }
});
pac.addEventListener("touchstart", function (e) {
  if ($('#zoom_scope_button').prop('checked')) {
    let x = e.touches[0].clientX - pac.getBoundingClientRect().left;
    let y = e.touches[0].clientY - pac.getBoundingClientRect().top;
    let scope = 'plus';
    if ($('#minus_scope_icon').prop('checked')) {
      scope = 'minus';
    }
    scope_action(scope, x, y);
  }
});
dac.addEventListener("touchstart", function (e) {
  if ($('#zoom_scope_button').prop('checked')) {
    let scale = Number($('#draw_art_scale').val()) / 100;
    let x = (e.touches[0].clientX - dac.getBoundingClientRect().left) / scale;
    let y = (e.touches[0].clientY - dac.getBoundingClientRect().top) / scale;
    let scope = 'plus';
    if ($('#minus_scope_icon').prop('checked')) {
      scope = 'minus';
    }
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
  let scale, point;
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
  let edit = document.getElementById('editing_areas');
  point = {x: edit.clientWidth / 2 + edit.scrollLeft, y: edit.clientHeight / 2 + edit.scrollTop};
  $('#zoom_scope_button').prop('checked', false);
  resize_canvas (scale, point);
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
