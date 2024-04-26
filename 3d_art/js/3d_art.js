/*++reserve objects++*/
window.sharedData = {
  memory_obj: {},
  cp_obj: {},
  focus_point: [15, 15, 15],
  roll_back_obj: {art: [], c_art: 0, tableP: [], one_time_img: [], c_one_time: 0},
};
const memory_obj = window.sharedData.memory_obj;
const cp_obj = window.sharedData.cp_obj;
const focus_point = window.sharedData.focus_point;
const roll_back_obj = window.sharedData.roll_back_obj;
const layer_slice = {select_vertical_layers: 'z', select_horizon_layers: 'y', select_side_layers: 'x'};
let obj = {
  use: '', once_memory: '', want_if: '', change_cubes: '', start_img: '', copy_img: '',
  start_x: '', start_y: '', start_z: '', end_x: '', end_y: '', end_z: '', //use in editing_2d
  $target: '', target_w: '', target_h: '', target_id: '',
  $icon: '', icon_top: '', icon_left: '',
  pop_text: '', parent_class: '',
  dl_name: '', dl_img: '', dl_c: '', area_top: '', area_left: '', area_w: '', area_h: ''
};
let command_obj = {};
let value_obj = {};
let storage = localStorage;
const currentOrigin = window.location.origin;
const iframe = document.querySelector("#myCanvas");
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
      $('#no_set_action').click();
      $('#' + id).trigger('change');
    }, "1")
  }
  if (!$('#' + id).prop('checked')) {
    return true;
  }
}
function return_img_html_arry_rgb (palette_color_box_id) {
  let img = $("#" + palette_color_box_id + " .CPimg").find('img.mImg');
  let color = img.css('backgroundColor');
  let html = jQuery("<div>").append(img.clone(true)).html();
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
function rgb_to_return_array_rgb (rgb) {
  rgb = rgb.replace("rgb(", "");
  rgb = rgb.replace("rgba(", "");
  rgb = rgb.replace(")", "");
  rgb = rgb.replaceAll(" ", "");
  rgb = rgb.split(",");
  return rgb;
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
function restoreArrayFromString(text) {
  const layers = text.split("_layerZ_");
  layers.pop();
  const parsedArray = layers.map(layerZ => {
    const rows = layerZ.split("_layerY_");
    rows.pop();
    return rows.map(row => {
      const cells = row.split("_layerX_");
      cells.pop();
      return cells.map(cell => {
        if (cell === '0') {
          return 0;
        }
        else {
          return cell;
        }
      });
    });
  });
  return parsedArray;
}
function localStorageInto (getData) {
  if (getData['top_menu'] === undefined) {
    return true;
  }
  //top menu memory
  $('#syncer-acdn-03 li[data-target="target_memorys"]').each(function(ele) {
    $(this).remove();
  });
  $('#syncer-acdn-03').append(getData['top_menu']);
  //memory_obj in js
  let get_obj = getData['top_menu_data'];
  for (const key in memory_obj) {
    if (memory_obj.hasOwnProperty(key)) {
      delete memory_obj[key];
    }
  }
  let i = 0;
  while (get_obj['memoryObj_id' + i]) {
    let key = get_obj['memoryObj_id' + i];
    let data = get_obj['memoryObj_data' + i];
    data = restoreArrayFromString(data);
    let value = data;
    memory_obj[key] = value;
    i++;
  }
  //color boxes of palette board cp
  let get_cp_obj = getData['cp_html'];
  let arry_cp_class = ['add_new_blocks', 'color_named_blocks', 'easy_to_gather', 'hard_in_overworld', 'in_nether', 'in_end'];
  arry_cp_class.forEach(function(value, index) {
    $('#CP .' + arry_cp_class[index]).html(get_cp_obj['cpObj_data' + index]);
  });
  //check box color to display
  let id = $("#CP label.check").attr('id');
  if (id !== undefined) {
    //pick color display
    let obj_data = return_img_html_arry_rgb (id);
    $('.palette .palette_button .selected_block_img, #CP_icons .selected_block_img').html(obj_data.html);
    $('#CP_icons .rgb span.rgbR').text(obj_data.rgb[0]);
    $('#CP_icons .rgb span.rgbG').text(obj_data.rgb[1]);
    $('#CP_icons .rgb span.rgbB').text(obj_data.rgb[2]);
  }
  //input sample_view rgb
  $('#sample_ratio_r').val(getData['ratio_r'][0]);
  $('#sample_ratio_g').val(getData['ratio_g'][0]);
  $('#sample_ratio_b').val(getData['ratio_b'][0]);
  $('#sample_ratio_r').attr('data-count', getData['ratio_r'][1]);
  $('#sample_ratio_g').attr('data-count', getData['ratio_g'][1]);
  $('#sample_ratio_b').attr('data-count', getData['ratio_b'][1]);
  //read command id
  if (getData['command_data'] !== undefined) {
    command_obj = deepCopyObj(getData['command_data']);
    load_flag = true;
  }
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
//accordion
//https://syncer.jp/accordion-content
$(".syncer-acdn").click(function () {
  let target = $(this).data("target");
  $("#" + target).slideToggle("fast");
  if ($(this).attr('class') !== 'syncer-acdn open') {
    $(this).addClass('open');
  }
  else {
    $(this).removeClass('open');
  }
});
/*++localStorage++*/
if (typeof sessionStorage === undefined) {
  if ($('header .header_form p.language').text() === 'Japanese') {
    str = "このブラウザはWeb Storage機能が実装されていません";
  }
  if ($('header .header_form p.language').text() === '英語') {
    str = "This browser does not been implemented Web Storage function";
  }
  $('#auto_download_storage').prop('checked', false);
  window.alert(str);
}
else {
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
      let key = '3d_art_ver_two';
      remove_localStorage (storage,key);
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
        let getStr = '';
        for (let z = 0; z < obj.length; z++) {
          for (let y = 0; y < obj[z].length; y++) {
            for (let x = 0; x < obj[z][y].length; x++) {
              let alt = obj[z][y][x];
              if (alt === '') {
                getStr += "_layerX_";
                continue;
              }
              getStr += alt + "_layerX_";
            }
            getStr += "_layerY_";
          }
          getStr += "_layerZ_";
        }
        get_memorys_data['memoryObj_data' + i] = getStr;
        i++;
      })
      value_obj['top_menu_data'] = get_memorys_data;
      //color boxes of palette board cp
      let get_cp_obj = {};
      let arry_cp_class = ['add_new_blocks', 'color_named_blocks', 'easy_to_gather', 'hard_in_overworld', 'in_nether', 'in_end'];
      arry_cp_class.forEach(function(value, index) {
        get_cp_obj['cpObj_data' + index] = $('#CP .' + arry_cp_class[index]).html();
      });
      value_obj['cp_html'] = get_cp_obj;
      //input sample_view rgb
      value_obj['ratio_r'] = [$('#sample_ratio_r').val(), Number($('#sample_ratio_r').attr('data-count'))];
      value_obj['ratio_g'] = [$('#sample_ratio_g').val(), Number($('#sample_ratio_g').attr('data-count'))];
      value_obj['ratio_b'] = [$('#sample_ratio_b').val(), Number($('#sample_ratio_b').attr('data-count'))];
      value_obj['command_data'] = deepCopyObj(command_obj);
      //in storage
      let key = '3d_art_ver_two';
      remove_localStorage (storage,key);
      setItem_in_localStorage (storage,key,value_obj);
    }
  }
  //upload load storage from button
  let localStorageRollBack_selector = 'header .header_form nav ul li.roll_back';
  localStorageRollBack_selector += ', header .header_2windows nav ul li.roll_back';
  $(localStorageRollBack_selector).click((e) => {
    let key = '3d_art_ver_two';
    let getData = return_obj_from_localStorage (storage,key);
    if (getData === '' || getData === null) {
      return false;
    }
    value_obj = getData;
    $('#auto_download_storage').prop('checked', true);
    localStorageInto (getData);
  });
}
/*++ready document++*/
$(document).ready(async function () {
  //load Storage
  let load_flag = false;
  let key = '3d_art_ver_two';
  let getData = return_obj_from_localStorage (storage, key);
  if (getData !== '' || getData !== null) {
    value_obj = getData;
    if (getData['storage'] === 'off') {
      $('#auto_download_storage').prop('checked', false);
    }
    if (getData['storage'] === 'on') {
      localStorageInto (getData);
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
  $('#CP .CPimg').find('img').attr('crossorigin', 'anonymous');
  let imagesLoaded = 0;
  $('#CP .CPimg').find('img').each(function() {
    let alt = $(this).attr('alt');
    if (alt !== undefined) {
      let src = $(this).attr('src');
      let color = $(this).css('backgroundColor');
      const image = new Image();
      image.onload = () => {
        imagesLoaded++;
        cp_obj[alt] = {img: image, color: color};
      };
      image.crossOrigin = 'anonymous'; // クロスオリジン属性を設定
      image.src = src;
    }
  });
  //make select_layers options
  let layer_count = $('#art_size').val();
  let vertical_layer_html = '';
  for (let k = 0; k < layer_count; k++) {
    let reverse_c = layer_count - k - 1;
    if (reverse_c == Math.floor(layer_count / 2)) {
      vertical_layer_html += '<option value="' + reverse_c + '" autofocus selected class="selected">' + reverse_c + '</option>';
    }
    else {
      vertical_layer_html += '<option value="' + reverse_c + '">' + reverse_c + '</option>';
    }
  }
  $('#select_vertical_layers').html(vertical_layer_html);
  $('#select_side_layers').html(vertical_layer_html);
  $('#select_horizon_layers').html(vertical_layer_html);
  // send data to iframe
  let queryParams = `?currentOrigin=${currentOrigin}`;
  iframe.src = `./3d_canvas.html${queryParams}`;
  //create 3d arry
  let arry = [];
  for (let z = 0; z < layer_count; z++) {
    if (!arry[z]) {
      arry[z] = [];
    }
    for (let y = 0; y < layer_count; y++) {
      if (!arry[z][y]) {
        arry[z][y] = [];
      }
      for (let x = 0; x < layer_count; x++) {
        arry[z][y][x] = 0;
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
$('.palette .palette_board').on('mouseleave', (e) => {
  $('#CP .CPimg img.appear').removeClass('appear');
});
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
function otm_check(e) {
  if ($(e).attr('class') === undefined || !$(e).attr('class').length) {
    $('#syncer-acdn-03 li[data-target="target_memorys"] p').removeClass('target');
    $(e).addClass('target');
  }
  else {
    $(e).removeClass('target');
  }
}
function otm_save(e) {
  let target_id = $(e).parent().attr('id');
  if ($('#' + target_id).attr('data-check') === undefined || !$('#' + target_id).attr('data-check').length) {
    $('#' + target_id).attr('data-check', 'checked');
    $(e).css('display', 'none');
    $('#' + target_id).children('i.fa-delete-left').css('display', 'inline-block');
    let titleName = $('#my2DCanvas').attr('data-fileName');
    if (titleName !== '') {
      $('#' + target_id).children('span').addClass('titled');
      $('#' + target_id).children('span').text(titleName);
    }
    let key = target_id;
    if (roll_back_obj.art.length - roll_back_obj.c_art - 1 < 0) {
      roll_back_obj.c_art = roll_back_obj.art.length - 1;
    }
    let value = deepCopyArray(roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1]);
    add_new_obj_to_memory_obj (key,value);
  }
  else {
    return true;
  }
}
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
    delete_memory_from_memory_obj (key);
    $('#' + target_id).children('span').removeClass('titled');
    let text_val = target_id.toString();
    text_val = text_val.replace("OTM_cell_","");
    $('#' + target_id).children('span').text(text_val);
  }
  else {
    return true;
  }
}
function memory_value_into_canvas (key, name) {
  // change name
  $('#my2DCanvas').attr('data-fileName', '');
  if (name !== null) {
    $('#my2DCanvas').attr('data-fileName', name);
  }
  else {
    name = '';
  }
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
  // change values
  let value = deepCopyArray(memory_obj[key]);
  add_canvas_to_roll_back_obj (value);
  if ($('#editing_2d').prop('checked')) {
    const iframeVariable = 'restart';
    window.parent.postMessage({ iframeVariable }, '*');
  }
  else if ($('#editing_layer').prop('checked')) {
    const inputValue = {task: 'restart'};
    iframe.contentWindow.postMessage(inputValue, currentOrigin);
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
  let data = deepCopyArray(value);
  const getTitle = $('#' + target_id).children("span").text();

  const wb = XLSX.utils.book_new();
  for (let z = 0; z < value.length; z++) {
    const sheet_name = `z${z}`; // シート名を z の値に設定
    const data = value[z].map(row => row.map(item => item === 0 ? '' : item));
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, sheet_name); // シートをブックに追加
  }
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = getTitle + '.xlsx'; // ファイル名を設定
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
});
$('#upload_memory').change((e) => {
  let target_id = $('#syncer-acdn-03 li[data-target="target_memorys"] p.target').parent().attr('id');
  if (target_id === undefined || target_id === '') {
    $('#upload_memory').val('');
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
      const layers = upText.split("_layerZ_");
      layers.pop();
      const parsedArray = layers.map(layerZ => {
        const rows = layerZ.split("_layerY_");
        rows.pop();
        return rows.map(row => {
          const cells = row.split("_layerX_");
          cells.pop();
          return cells.map(cell => {
            if (cell.startsWith("_r_")) {
              const regexR = /_r_(.*?)_r_/;
              const regexG = /_g_(.*?)_g_/;
              const regexB = /_b_(.*?)_b_/;
              const r = cell.match(regexR)[1].replaceAll(" ", "");
              const g = cell.match(regexG)[1].replaceAll(" ", "");
              const b = cell.match(regexB)[1].replaceAll(" ", "");
              for (let alt in cp_obj) {
                if (cp_obj.hasOwnProperty(alt)) {
                  let color = rgb_to_return_array_rgb(cp_obj[alt].color);
                  if (color[0] === r && color[1] === g && color[2] === b) {
                    return alt;
                  }
                }
              }
            } else {
              return 0;
            }
          });
        });
      });
      $('#' + target_id).attr('data-check', 'checked');
      $('#' + target_id).children('i.fa-bookmark').css('display', 'none');
      $('#' + target_id).children('i.fa-delete-left').css('display', 'inline-block');
      let key = target_id;
      add_new_obj_to_memory_obj (key, parsedArray);
      str1 = str1.split(".").slice(0, 1);
      title_in_it.innerText = str1;
      $('#upload_memory').val('');
    };
    reader.readAsText(file);
  }
  if (data_flag === 'excel') {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const parsedData = [];
      workbook.SheetNames.forEach(sheetName => {
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
        const parsedSheet = sheetData.map(row => {
          return row.map(cell => cell === '' ? 0 : cell); // 空セルを 0 に変換
        });
        parsedData.push(parsedSheet);
      });
      $('#' + target_id).attr('data-check', 'checked');
      $('#' + target_id).children('i.fa-bookmark').css('display', 'none');
      $('#' + target_id).children('i.fa-delete-left').css('display', 'inline-block');
      let key = target_id;
      add_new_obj_to_memory_obj (key, parsedData);
      str1 = str1.split(".").slice(0, 1);
      title_in_it.innerText = str1;
      $('#upload_memory').val('');
    };
    reader.readAsArrayBuffer(file);
  }
});
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
/*change editing style*/
$('input[name="display"]').change((e) => {
  $('#no_set_action').click();
  if ($('#editing_layer').prop('checked')) {
    $('#myCanvas').removeClass('hidden');
    $('#my2DCanvas').addClass('hidden');
    // start iframe
    let queryParams = `?currentOrigin=${currentOrigin}`;
    iframe.src = `./3d_canvas.html${queryParams}`;
    $('#myCanvas').on('load', function() {
      // メッセージを送信
      const inputValue = {task: 'restart'};
      iframe.contentWindow.postMessage(inputValue, currentOrigin);
    });
  }
  if ($('#editing_2d').prop('checked')) {
    $('#myCanvas').addClass('hidden');
    $('#my2DCanvas').removeClass('hidden');
    // iframeのsrc属性を空に設定して停止する
    $('#myCanvas').attr('src', '');
  }
});
/*++aside++*/
//retouch 64 sizes for art_size
function change_max_size_limit (e) {
  let px = $(e.target).val();
  px = Number(String(px).replace(/[^0-9]/g, ''));
  if (px > 64) {
    px = 64;
  }
  else if (px <= 0) {
    px = 5;
  }
  $(e.target).val(px);
}
$('#art_size').on('input', function (e) {
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
  let execution_limit = 1;
  let listFunction = [];
  let str = 'tp @p ' + coordinate[0] + ' ' + coordinate[1] + ' ' + coordinate[2] + '\n';
  if (type === 'je') {
    str = 'execute as @p at @s run teleport @s ' + coordinate[0] + ' ' + coordinate[1] + ' ' + coordinate[2] + '\n';
  }
  for (let z = 0; z < arry.length; z++) {
    for (let y = 0; y < arry.length; y++) {
      for (let x = 0; x < arry.length; x++) {
        let mapX = coordinate[0] + x - (arry.length / 2);
        let mapY = coordinate[1] + y;
        let mapZ = coordinate[2] + z - arry.length;
        let id = '';
        let alt = arry[z][y][x];
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
        execution_limit++;
        if (execution_limit < 10000) {
          str += 'fill ' + mapX + ' ' + mapY + ' ' + mapZ + ' ' + mapX + ' ' + mapY + ' ' + mapZ + ' ' + id + '\n';
        }
        else {
          execution_limit = 1;
          str += 'fill ' + mapX + ' ' + mapY + ' ' + mapZ + ' ' + mapX + ' ' + mapY + ' ' + mapZ + ' ' + id + '\n';
          listFunction.push(str);
          str = '';
        }
      }
    }
  }
  listFunction.push(str);
  return listFunction;
}
function return_arry_count_block_needed(arry_block_needed) {
  let count = {};
  arry_block_needed.forEach(function (i) {
    count[i] = (count[i] || 0) + 1;
  });
  delete count[0];
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
function return_obj_make_Blueprint_direction_horizon (arry) {
  let arry_block_position = [1];
  let arry_block_needed = [2];
  let arry_url_for_skins = [];
  let arry_url_for_rough = [];
  for (let l_y = 0; l_y < arry.length; l_y++) {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    c.width = arry.length * 20;
    c.height = arry.length * 20;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, c.width, c.height);
    const dc = document.createElement("canvas");
    const dctx = dc.getContext("2d");
    dc.width = arry.length * 20;
    dc.height = arry.length * 20;
    dctx.fillStyle = 'white';
    dctx.fillRect(0, 0, dc.width, dc.height);
    let arry_one_layer_p = [1];
    for (let z = 0; z < arry.length; z++) {
      let arrayCol = [];
      for (let x = 0; x < arry.length; x++) {
        let alt = arry[z][l_y][x];
        arrayCol.push(alt);
        let rgb = 'white';
        if (alt != 0) {
          rgb = cp_obj[alt].color;
        }
        ctx.fillStyle = rgb;
        ctx.fillRect(x * 20, z * 20, 20, 20);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0.1;
        ctx.strokeRect(x * 20, z * 20, 20, 20);
        if ($('#need_block_skins').prop('checked')) {
          if (alt != 0) {
            dctx.drawImage(cp_obj[alt].img, x * 20, z * 20, 20, 20);
          }
          dctx.strokeStyle = "black";
          dctx.lineWidth = 0.1;
          dctx.strokeRect(x * 20, z * 20, 20, 20);
        }
      }
      arry_block_needed = arry_block_needed.concat(arrayCol);
      arrayCol = arrayCol.reduce((resultArray, num, id) => {
        if (num == 0) {
          resultArray[id] = '';
        }
        else {
          resultArray[id] = num;
        }
        return resultArray;
      }, []);
      arry_one_layer_p.push(arrayCol);
    }
    arry_one_layer_p.shift();
    for (let i = 0; i < arry_one_layer_p.length; i++) {
      if (arry_one_layer_p[i].filter(x => x !== '').length) {
        arry_block_position.push({name: 'horizon_bottom_' + l_y, sheet: arry_one_layer_p});
        //rough_Blueprint URL
        arry_url_for_rough.push(c.toDataURL('image/png'));
        if ($('#need_block_skins').prop('checked')) {
          arry_url_for_skins.push(dc.toDataURL('image/png'));
        }
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
  return {p: arry_block_position, n: arry_block_needed, skin: arry_url_for_skins, rough: arry_url_for_rough};
}
function return_obj_make_Blueprint_direction_vertical (arry) {
  let arry_block_position = [1];
  let arry_block_needed = [2];
  let arry_url_for_skins = [];
  let arry_url_for_rough = [];
  for (let l_z = 0; l_z < arry.length; l_z++) {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    c.width = arry.length * 20;
    c.height = arry.length * 20;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, c.width, c.height);
    const dc = document.createElement("canvas");
    const dctx = dc.getContext("2d");
    dc.width = arry.length * 20;
    dc.height = arry.length * 20;
    dctx.fillStyle = 'white';
    dctx.fillRect(0, 0, dc.width, dc.height);
    let arry_one_layer_p = [1];
    for (let y = arry.length - 1; y >= 0; y--) {
      let mapY = arry.length - 1 - y;
      let arrayCol = [];
      for (let x = 0; x < arry.length; x++) {
        let alt = arry[l_z][y][x];
        arrayCol.push(alt);
        let rgb = 'white';
        if (alt != 0) {
          rgb = cp_obj[alt].color;
        }
        ctx.fillStyle = rgb;
        ctx.fillRect(x * 20, mapY * 20, 20, 20);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0.1;
        ctx.strokeRect(x * 20, mapY * 20, 20, 20);
        if ($('#need_block_skins').prop('checked')) {
          if (alt != 0) {
            dctx.drawImage(cp_obj[alt].img, x * 20, mapY * 20, 20, 20);
          }
          dctx.strokeStyle = "black";
          dctx.lineWidth = 0.1;
          dctx.strokeRect(x * 20, mapY * 20, 20, 20);
        }
      }
      arry_block_needed = arry_block_needed.concat(arrayCol);
      arrayCol = arrayCol.reduce((resultArray, num, id) => {
        if (num == 0) {
          resultArray[id] = '';
        }
        else {
          resultArray[id] = num;
        }
        return resultArray;
      }, []);
      arry_one_layer_p.push(arrayCol);
    }
    arry_one_layer_p.shift();
    for (let i = 0; i < arry_one_layer_p.length; i++) {
      if (arry_one_layer_p[i].filter(x => x !== '').length) {
        arry_block_position.push({name: 'vertical_back_' + l_z, sheet: arry_one_layer_p});
        //rough_Blueprint URL
        arry_url_for_rough.push(c.toDataURL('image/png'));
        if ($('#need_block_skins').prop('checked')) {
          arry_url_for_skins.push(dc.toDataURL('image/png'));
        }
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
  return {p: arry_block_position, n: arry_block_needed, skin: arry_url_for_skins, rough: arry_url_for_rough};
}
//excel
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
function downBlueprint(e) {
  let arry = deepCopyArray(roll_back_obj.art[roll_back_obj.art.length - roll_back_obj.c_art - 1]);

  let obj = {};
  if ($('#Blueprint_direction_horizon').prop('checked')) {
    obj = return_obj_make_Blueprint_direction_horizon (arry);
  }
  if ($('#Blueprint_direction_vertical').prop('checked')) {
    obj = return_obj_make_Blueprint_direction_vertical (arry);
  }
  if (obj.n.length <= 0) {
    return false;
  }

  let zip = new JSZip();
  zip.file('items_needed.xlsx', export_xlsx(obj.n));
  zip.file('block_placement.xlsx', export_xlsx(obj.p));
  //rough img
  let folderName = 'rough_layer_images';
  let rough_folder = zip.folder(folderName);
  obj.rough.forEach((url, i) => {
    let name = obj.p[i].name;
    let c_Blob = imgblob(url);
    rough_folder.file(name + '.png', c_Blob);
  });
  if ($('#need_fun_for_be').prop('checked')) {
    let listFunction = make_pixel_art_fun(arry, 'be');
    listFunction.forEach((fun_text, i) => {
      const blob = new Blob([fun_text], { type: "text/plain" });
      zip.file('pixelthree_be_' + i + '.mcfunction', blob);
    });
  }
  if ($('#need_fun_for_je').prop('checked')) {
    let listFunction = make_pixel_art_fun(arry, 'je');
    listFunction.forEach((fun_text, i) => {
      const blob = new Blob([fun_text], { type: "text/plain" });
      zip.file('pixelthree_je_' + i + '.mcfunction', blob);
    });
  }
  if ($('#need_block_skins').prop('checked')) {
    //skin img
    let skinFolderName = 'skin_layer_images';
    let skin_folder = zip.folder(skinFolderName);
    obj.skin.forEach((url, i) => {
      let name = obj.p[i].name;
      let c_Blob = imgblob(url);
      skin_folder.file(name + '.png', c_Blob);
    });
  }
  //zipDownload
  zip.generateAsync({ type: "blob" }).then(function (content) {
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(content, "minecraft3DArt.zip");
    }
    else {
      const url = (window.URL || window.webkitURL).createObjectURL(content);
      const download = document.createElement("a");
      download.href = url;
      download.download = "minecraft3DArt.zip";
      download.click();
      (window.URL || window.webkitURL).revokeObjectURL(url);
    }
  });
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
        $('#plan_to_download_Blueprint .third.plan .table_frame').css('height', 'calc(600px * 0.9 - 60px)');
      });
    }
    if (target_class === 'fa-solid fa-square-caret-up') {
      $('#command_table thead th i').each((i, ele) => {
        $(ele).attr('class', 'fa-solid fa-square-caret-down');
        $('#command_table tbody').css('display', 'none');
        $('#plan_to_download_Blueprint .third.plan .table_frame').css('height', '100%');
      });
    }
  }, 4);
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
function delete_str_escape_html(string) {
  if (typeof string !== "string") {
    return string;
  }
  //remove ""
  return string.replace(/[&'`<>]/g, '');
}
$('#change_command').on('input', (e) => {
  let text = $('#change_command').val();
  text = delete_str_escape_html(text);
  $('#change_command').val(text);
});
$('#change_command').change((e) => {
  let result;
  if ($('header .header_form p.language').text() === 'Japanese') {
    result = confirm('idを変更してよろしいですか？');
  }
  if ($('header .header_form p.language').text() === '英語') {
    result = confirm('Are you sure you want to change the id?');
  }
  if (!result) {
    $('#change_command').val('');
    $('#command_table input[name="command"]:checked').prop('checked', false);
    return false;
  }
  let text = $('#change_command').val();
  text = return_str_escape_html(text);
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
  build_command_table ();
});
$('#download_datas_button').click((e) => {
  $('#wait').removeClass('hidden');
  downBlueprint(e);
  setTimeout((e) => {
    $('#wait').addClass('hidden');
  }, 5);
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
$('#plan_to_download_Blueprint .third.plan section .idList.export').click((e) => {
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
      item.forEach((string, i) => {
        string.replace(/(&quot;)/g, function (match) {
          return { "&quot;": '"' }[match];
        });
      });
      new_obj[item[0]] = [item[1], item[2]];
    });
    command_obj = new_obj;
    build_command_table ();
    $('#idList_import').val('');
  };
  reader.readAsArrayBuffer(file);
});
$('#plan_to_download_Blueprint .third.plan section .idList.import').click((e) => {
  $('#idList_import').click();
});
//scroll for smartphone
let scrollTimeout;
$('.aside_menu .scrollTop').on('touchstart', () => {
  scrollTimeout = setInterval(() => {
    const currentScrollTop = $(window).scrollTop();
    const targetScrollTop = currentScrollTop - 5;
    window.scroll({
      top: targetScrollTop,
      behavior: 'smooth' // スムーズなスクロール効果を利用する
    });
  }, 100); // 100ミリ秒ごとにスクロール処理を実行
}).on('touchend touchcancel', () => {
  clearInterval(scrollTimeout);
});
$('.aside_menu .scrollBottom').on('touchstart', () => {
  scrollTimeout = setInterval(() => {
    const currentScrollTop = $(window).scrollTop();
    const targetScrollTop = currentScrollTop + 5;
    window.scroll({
      top: targetScrollTop,
      behavior: 'smooth' // スムーズなスクロール効果を利用する
    });
  }, 100); // 100ミリ秒ごとにスクロール処理を実行
}).on('touchend touchcancel', () => {
  clearInterval(scrollTimeout);
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
    for (const key in cp_obj) {
      if (cp_obj.hasOwnProperty(key)) {
        delete cp_obj[key];
      }
    }
    let imagesLoaded = 0;
    $('#CP .CPimg').find('img').each(function() {
      let alt = $(this).attr('alt');
      if (alt !== undefined) {
        let src = $(this).attr('src');
        let color = $(this).css('backgroundColor');
        const image = new Image();
        image.onload = () => {
          imagesLoaded++;
          cp_obj[alt] = {img: image, color: color}
          // すべての画像がロードされた後にメッセージを送信
          if (imagesLoaded === $('#CP .CPimg').find('img').length) {
            const inputValue = {task: 'textureLoader', alt: 'all'};
            iframe.contentWindow.postMessage(inputValue, currentOrigin);
          }
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
          cp_obj[alt[0]] = {img: img, color: rgb};
          // メッセージを送信
          const inputValue = {task: 'textureLoader', alt: alt[0]};
          iframe.contentWindow.postMessage(inputValue, currentOrigin);
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
  $.each(obj, function(index, value) {
    obj[index] = '';
  });
}
function selected_color_box_reset (e) {
  $('#' + obj.target_id).css('opacity', '1');
  $('#selected_color_box').html('');
  $('#selected_color_box').css('display', 'none');
}
function move_to_this_class(target_class) {
  $('#' + obj.target_id).remove();
  let html = $('#selected_color_box').html();
  html = jQuery('<label id="' + obj.target_id + '">').append(html);
  $(target_class).append(html);
  selected_color_box_reset();
}
function selected_color_box_move (e) {
  $('#' + obj.target_id).css('opacity', '0.5');
  if (obj.use === 'mouse') {
    obj.start_x = e.clientX;
    obj.start_y = e.clientY;
  }
  if (obj.use === 'touch') {
    obj.start_x = e.touches[0].clientX;
    obj.start_y = e.touches[0].clientY;
  }
  $('#selected_color_box').css('display', 'block');
  $('#selected_color_box').css('top', obj.start_y);
  $('#selected_color_box').css('left', obj.start_x);
  let elem = document.elementFromPoint(obj.start_x, obj.start_y);
  if (elem === null) {
    return true;
  }
  let $elem = jQuery(elem);
  let active_class = $elem.attr('class');
  if (
    active_class === 'easy_to_gather'
    || active_class === 'hard_in_overworld'
    || active_class === 'in_nether'
    || active_class === 'in_end'
    || active_class === 'small_title'
  ) {
    $('#CP .active').removeClass('active');
    $elem.addClass('active');
  }
  let cp_top = $(".palette .palette_board").offset().top + 116 - window.scrollY;
  let cp_bottom = $(".palette .palette_board").offset().top + $(".palette .palette_board").height() - window.scrollY;
  let palette_board_scroll_top = $('.palette .palette_board').scrollTop();
  if (obj.start_y <= cp_top) {
    palette_board_scroll_top -= 20;
    $('.palette .palette_board').scrollTop(palette_board_scroll_top);
  }
  if (obj.start_y >= cp_bottom) {
    palette_board_scroll_top += 20;
    $('.palette .palette_board').scrollTop(palette_board_scroll_top);
  }
}
function selected_color_box_into_group (e) {
  $('#CP .active').removeClass('active');
  let x = obj.start_x;
  let y = obj.start_y;
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
  removeEvent_selected_color_box (e);
}
function selected_color_box_use_mouse (e) {
  e.preventDefault();
  let id = $(this).attr('id');
  let parent_class = $(this).parent().attr('class');
  obj.start_x = e.clientX;
  obj.start_y = e.clientY;
  click_palette_color_boxes(id,obj.start_x,obj.start_y);
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
  obj.start_x = e.touches[0].clientX;
  obj.start_y = e.touches[0].clientY;
  click_palette_color_boxes(id,obj.start_x,obj.start_y);
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
//fix_art_scale
function fix_art_scale (e) {
  let size = $(e.target).val();
  size = Number(String(size).replace(/[^0-9]/g, ''));
  $(e.target).val(size);
}
$('#art_scale').on('input', function (e) {
  fix_art_scale (e);
});
// change copy when push copy_area_with_rect button
let change_to_copy_button = '.normal_tool > label[for="copy_area_with_rect"]';
change_to_copy_button += ', .normal_tool > label[for="resize_area_with_rect"]';
change_to_copy_button += ', .normal_tool > label[for="roll_area_with_rect"]';
$(change_to_copy_button).click((e) => {
  $('#for_copy_area').prop('checked', true).trigger('change');
});
let change_to_path_button = '.normal_tool > label[for="stroke_path_with_line"]';
change_to_path_button += ', .normal_tool > label[for="stroke_path_with_rect"]';
change_to_path_button += ', .normal_tool > label[for="stroke_path_with_arc"]';
$(change_to_path_button).click((e) => {
  $('#for_path_area').prop('checked', true).trigger('change');
});
//pop up explain of roll_back_and_forward
let pop_text_selecter = '.roll_back_and_forward .roll_back';
pop_text_selecter += ', .roll_back_and_forward .roll_forward';
pop_text_selecter += ', .layer_selector .layer_copy';
pop_text_selecter += ', .layer_selector .layer_cut';
pop_text_selecter += ', .layer_selector .layer_paste';
pop_text_selecter += ', .layer_selector .layer_change';
pop_text_selecter += ', .zoom_in_out_scope label[for="plus_scope_icon"]';
pop_text_selecter += ', .zoom_in_out_scope label[for="minus_scope_icon"]';
pop_text_selecter += ', .normal_tool .sub_normal_tool .to_close_path';
pop_text_selecter += ', .normal_tool .sub_normal_tool .to_open_path';
pop_text_selecter += ', .sub_normal_tool label[for="for_path_area"]';
pop_text_selecter += ', .sub_normal_tool label[for="for_fill_area"]';
pop_text_selecter += ', .sub_normal_tool label[for="for_cut_area"]';
pop_text_selecter += ', .sub_normal_tool label[for="for_copy_area"]';
$(pop_text_selecter).on('mouseenter', function(e) {
  obj.pop_text = $(this).children('span.shortcut').html();
  obj.use = 'mouse';
  pop_text_at_hover (e);
});
$(pop_text_selecter).on('mouseleave', function(e) {
  $('#CP_img_explanation').remove();
});
//change layers
$('.layer_selector .layer_change').click((e) => {
  $('#no_set_action').click();
});
let change_layers_selecter = '#select_vertical_layers';
change_layers_selecter += ', #select_side_layers';
change_layers_selecter += ', #select_horizon_layers';
$(change_layers_selecter).change((e) => {
  let id = $(e.target).attr('id');
  $('#' + id + ' option.selected').removeClass('selected');
  $('#' + id + ' option[value="' + $(e.target).val() + '"]').addClass('selected');
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
  // メッセージを送信
  const inputValue = {task: 'resize'};
  iframe.contentWindow.postMessage(inputValue, currentOrigin); // ターゲットURLを指定
});
observer_canvas.observe(editing_areas, {attributes: true});
//drag and drop images into web to change pixels
function convertToRGB (rgb) {
  rgb = rgb.replace("rgb(", "");
  rgb = rgb.replace(")", "");
  rgb = rgb.split(",");
  return { r: rgb[0], g: rgb[1], b: rgb[2]};
};
function chooseColor (calcDelta, palette, inrgb) {
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
}
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
    cx = (imgW - imgH) / 2;
    imgW = imgH;
  } else {
    cy = (imgH - imgW) / 2;
    imgH = imgW;
  }
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(0, 0, 171, 171);
  ctx.drawImage(image, cx, cy, imgW, imgH, 0, 0, 171, 171);
  $('#CP .active').removeClass('active');
  const palette = [];
  $("#CP .CPimg").each(function (index) {
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
        }
      }
      if (disL == 1) {
        let imgColor = $('#' + id + ' .CPimg').children("img").css("backgroundColor").toString();
        palette.push(imgColor);
      }
    }
  });
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
    sample_array[k].fillStyle = "rgb(255, 255, 255)";
    sample_array[k].fillRect(0, 0, 171, 171);
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
    let calcDelta = function (t, p) {
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
  $('#make_menu_0').prop('checked', true);
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
    cx = (imgW - imgH) / 2;
    imgW = imgH;
  } else {
    cy = (imgH - imgW) / 2;
    imgH = imgW;
  }
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(0, 0, rough_c_size, rough_c_size);
  ctx.drawImage(image, cx, cy, imgW, imgH, 0, 0, rough_c_size, rough_c_size);
  const palette = [];
  $("#CP .CPimg").each(function (index) {
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
        }
      }
      if (disL == 1) {
        let imgColor = $('#' + id + ' .CPimg').children("img").css("backgroundColor").toString();
        palette.push(imgColor);
      }
    }
  });
  let ratio_r = Number($('#sample_ratio_r').val());
  let ratio_g = Number($('#sample_ratio_g').val());
  let ratio_b = Number($('#sample_ratio_b').val());
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
  obj.dl_c = {};
  obj.dl_c['trim'] = cptx.getImageData(0, 0, cp.width, cp.height);
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
  //$('#for_sample_view').css('display', 'none');
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
  let c_top = $('#check_photo').offset().top - window.scrollY;
  let c_left = $('#check_photo').offset().left - window.scrollX;
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
    obj.end_x = e.clientX;
    obj.end_y = e.clientY;
  }
  if (obj.use === 'touch') {
    obj.end_x = e.touches[0].clientX;
    obj.end_y = e.touches[0].clientY;
  }
  const cp = document.getElementById('check_photo');
  const cptx = cp.getContext("2d");
  let x_range = obj.end_x - obj.start_x;
  let y_range = obj.end_y - obj.start_y;
  let c_top = $('#check_photo').offset().top - window.scrollY;
  let c_left = $('#check_photo').offset().left - window.scrollX;
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
  if (
    obj.end_y > (area_top + c_top) - 20 &&
    obj.end_y < (area_top + c_top) + 20 &&
    obj.end_x > (area_left + c_left) - 20 &&
    obj.end_x < (area_left + c_left) + 20
  ) {
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
  else if (
    obj.end_y > ((area_top + c_top) + area_h) - 20 &&
    obj.end_y < ((area_top + c_top) + area_h) + 20 &&
    obj.end_x > ((area_left + c_left) + area_w) - 20 &&
    obj.end_x < ((area_left + c_left) + area_w) + 20
  ) {
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
  else if (
    obj.end_y > ((area_top + c_top) + area_h) - 20 &&
    obj.end_y < ((area_top + c_top) + area_h) + 20 &&
    obj.end_x > (area_left + c_left) - 20 &&
    obj.end_x < (area_left + c_left) + 20
  ) {
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
  else if (
    obj.end_y > (area_top + c_top) - 20 &&
    obj.end_y < (area_top + c_top) + 20 &&
    obj.end_x > ((area_left + c_left) + area_w) - 20 &&
    obj.end_x < ((area_left + c_left) + area_w) + 20
  ) {
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
  else if (
    obj.end_y > (area_top + c_top) - 20 &&
    obj.end_y < (area_top + c_top) + 20 &&
    obj.end_x >= (area_left + c_left) + 20 &&
    obj.end_x <= ((area_left + c_left) + area_w) - 20
  ) {
    if (area_top + y_range < 0) {
      return true;
    }
    if (area_h - y_range <= 40) {
      return true;
    }
    obj.area_h = obj.area_h - y_range / c_scale;
    obj.area_top = obj.area_top + y_range / c_scale;
  }
  else if (
    obj.end_y > ((area_top + c_top) + area_h) - 20 &&
    obj.end_y < ((area_top + c_top) + area_h) + 20 &&
    obj.end_x >= (area_left + c_left) + 20 &&
    obj.end_x <= ((area_left + c_left) + area_w) - 20
  ) {
    if (area_top + area_h + y_range > c_h) {
      return true;
    }
    if (area_h + y_range <= 40) {
      return true;
    }
    obj.area_h = obj.area_h + y_range / c_scale;
  }
  else if (
    obj.end_y >= (area_top + c_top) + 20 &&
    obj.end_y <= ((area_top + c_top) + area_h) - 20 &&
    obj.end_x > (area_left + c_left) - 20 &&
    obj.end_x < (area_left + c_left) + 20
  ) {
    if (area_left + x_range < 0) {
      return true;
    }
    if (area_w - x_range <= 40) {
      return true;
    }
    obj.area_w = obj.area_w - x_range / c_scale;
    obj.area_left = obj.area_left + x_range / c_scale;
  }
  else if (
    obj.end_y >= (area_top + c_top) + 20 &&
    obj.end_y <= ((area_top + c_top) + area_h) - 20 &&
    obj.end_x > ((area_left + c_left) + area_w) - 20 &&
    obj.end_x < ((area_left + c_left) + area_w) + 20
  ) {
    if (area_left + area_w + x_range > c_w) {
      return true;
    }
    if (area_w + x_range <= 40) {
      return true;
    }
    obj.area_w = obj.area_w + x_range / c_scale;
  }
  obj.start_x = obj.end_x;
  obj.start_y = obj.end_y;
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  c.width = cp.width;
  c.height = cp.height;
  ctx.putImageData(obj.dl_c.trim, 0, 0);
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
  ctx.putImageData(obj.dl_c.trim, 0, 0);
  //non-uniform scaling
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
  obj.dl_c['nonScaling'] = cstx.getImageData(0, 0, cs.width, cs.height);
  //proportional scaling
  cstx.fillStyle = "rgb(255, 255, 255)";
  cstx.fillRect(0, 0, cs.width, cs.height);
  let maxSize = Math.max(obj.area_w, obj.area_h);
  let gapH = Math.round((maxSize - obj.area_h) / (2 * one_block_size));
  let gapW = Math.round((maxSize - obj.area_w) / (2 * one_block_size));
  if (maxSize <= obj.area_w) {
    gapW = 0;
  }
  else {
    gapH = 0;
  }
  let target_block_size = maxSize / layer_count;
  for (let h = 0; h < layer_count - 2 * gapH; h++) {
    for (let w = 0; w < layer_count - 2 * gapW; w++) {
      let h_half = (h * target_block_size) + (target_block_size / 2);
      let w_half = (w * target_block_size) + (target_block_size / 2);
      let pixel = ctx.getImageData(Math.round(obj.area_left + w_half), Math.round(obj.area_top + h_half), 1, 1);
      let data = pixel.data;
      const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
      if (rgb === 'rgb(255, 255, 255)' || rgb === 'rgb(0, 0, 0)') {
        continue;
      }
      cstx.fillStyle = rgb;
      cstx.fillRect((w + gapW) * one_block_size, (h + gapH) * one_block_size, one_block_size, one_block_size);
    }
  }
  obj.dl_c['propScaling'] = cstx.getImageData(0, 0, cs.width, cs.height);
  $('#prop_non_scaling').children('i').attr('class', 'fa-solid fa-crop');
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
  let nL = obj.dl_name.length;
  if (nL <= 20) {
    nL = 20;
  }
  nL = 20 / nL + "em";
  $(".input_forms .load_title span").css("font-size", nL);
  $(".input_forms .load_title span").text(obj.dl_name);
  $('#my2DCanvas').attr('data-fileName', obj.dl_name);
  //change select list
  let layer_count = $('#art_size').val();
  let select_layer = Math.floor(layer_count / 2);
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

  const palette = {color: [], alt: []};
  $("#CP .CPimg").each(function (index) {
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
          let alt = $('#' + id + ' .CPimg').children("img.dis" + j).attr('alt');
          palette.color.push(imgColor);
          palette.alt.push(alt);
        }
      }
      if (disL == 1) {
        let imgColor = $('#' + id + ' .CPimg').children("img").css("backgroundColor").toString();
        let alt = $('#' + id + ' .CPimg').children("img").attr('alt');
        palette.color.push(imgColor);
        palette.alt.push(alt);
      }
    }
  });
  let ratio_r = Number($('#sample_ratio_r').val());
  let ratio_g = Number($('#sample_ratio_g').val());
  let ratio_b = Number($('#sample_ratio_b').val());
  let calcDelta = function ( t, p) {
    return ( Math.pow((p.r - t.r) * ratio_r, 2) + Math.pow((p.g - t.g) * ratio_g, 2) + Math.pow((p.b - t.b) * ratio_b, 2));
  };

  const newArry = [];
  let layer_id = $('.layer_selector select.appear').attr('id');
  for (let z = 0; z < layer_count; z++) {
    if (!newArry[z]) {
      newArry[z] = [];
    }
    for (let y = 0; y < layer_count; y++) {
      if (!newArry[z][y]) {
        newArry[z][y] = [];
      }
      for (let x = 0; x < layer_count; x++) {
        newArry[z][y][x] = 0;
      }
    }
  }
  const cs = document.getElementById('change_to_pixel_sample');
  const cstx = cs.getContext("2d");
  let one_block_size = cs.width / layer_count;
  let layerArry = [];
  for (let h = 0; h < layer_count; h++) {
    if (!layerArry[h]) {
      layerArry[h] = [];
    }
    for (let w = 0; w < layer_count; w++) {
      let h_half = (h * one_block_size) + (one_block_size / 2);
      let w_half = (w * one_block_size) + (one_block_size / 2);
      let pixel = cstx.getImageData(Math.round(w_half), Math.round(h_half), 1, 1);
      let data = pixel.data;
      const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
      if (rgb === 'rgb(255, 255, 255)') {
        layerArry[h][w] = 0;
        continue;
      }
      let index = palette.color.indexOf(rgb);
      if (index < 0) {
        let newRgb = chooseColor(calcDelta, palette.color, rgb);
        index = palette.color.indexOf(newRgb);
      }
      layerArry[h][w] = palette.alt[index];
    }
  }
  for (let z = 0; z < newArry.length; z++) {
    for (let y = 0; y < newArry[z].length; y++) {
      for (let x = 0; x < newArry[z][y].length; x++) {
        let mapY = newArry[z].length - y - 1;
        if (layer_slice[layer_id] === 'x' && x == select_layer) {
          newArry[z][y][x] = layerArry[mapY][z];
        }
        if (layer_slice[layer_id] === 'y' && y == select_layer) {
          newArry[z][y][x] = layerArry[z][x];
        }
        if (layer_slice[layer_id] === 'z' && z == select_layer) {
          newArry[z][y][x] = layerArry[mapY][x];
        }
      }
    }
  }
  add_canvas_to_roll_back_obj (newArry);
  $.each(obj, function(index, value) {
    obj[index] = '';
  });
  if ($('#editing_2d').prop('checked')) {
    const iframeVariable = 'restart';
    window.parent.postMessage({ iframeVariable }, '*');
  }
  else if ($('#editing_layer').prop('checked')) {
    const inputValue = {task: 'restart', step: 'new'};
    iframe.contentWindow.postMessage(inputValue, currentOrigin);
  }
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
$('#prop_non_scaling').click((e) => {
  const cs = document.getElementById('change_to_pixel_sample');
  const cstx = cs.getContext("2d");
  cstx.fillStyle = "rgb(255, 255, 255)";
  cstx.fillRect(0, 0, cs.width, cs.height);
  const cropSimpleIcon = $('#prop_non_scaling').children('i.fa-crop-simple');
  const cropIcon = $('#prop_non_scaling').children('i.fa-crop');
  switch (true) {
    case cropSimpleIcon.length > 0:
    $('#prop_non_scaling').children('i').attr('class', 'fa-solid fa-crop');
    cstx.putImageData(obj.dl_c.propScaling, 0, 0);
    break;
    case cropIcon.length > 0:
    $('#prop_non_scaling').children('i').attr('class', 'fa-solid fa-crop-simple');
    cstx.putImageData(obj.dl_c.nonScaling, 0, 0);
    break;
    default:
    break;
  }
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
  obj.dl_name = return_str_escape_html(obj.dl_name);
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
/*++footer++*/
/*question_to_use*/
/*++language change++*/
function scroll_top_bottom_infinite(element) {
  if (element.scrollHeight <= element.clientHeight) {
    return false;
  }
  // 上から下に20秒かけてスクロール
  element.scrollTop = 0;
  const scrollDownDuration = 5000;
  const scrollUpDuration = 0;
  setTimeout(() => {
    const startTime = Date.now();
    const endTime = startTime + scrollDownDuration;
    const startScrollTop = element.scrollTop;
    const scrollDown = () => {
      const now = Date.now();
      const remainingTime = endTime - now;
      const progress = 1 - remainingTime / scrollDownDuration;
      element.scrollTop = startScrollTop + progress * (element.scrollHeight - element.clientHeight);
      if (remainingTime > 0) {
        requestAnimationFrame(scrollDown);
      } else {
        // 5秒待ってから上に戻る
        setTimeout(() => {
          const scrollUpStartTime = Date.now();
          const scrollUpEndTime = scrollUpStartTime + scrollUpDuration;
          const scrollDownEndTop = element.scrollTop;
          const scrollUp = () => {
            const now = Date.now();
            const remainingTime = scrollUpEndTime - now;
            const progress = 1 - remainingTime / scrollUpDuration;
            element.scrollTop = scrollDownEndTop - progress * (element.scrollHeight - element.clientHeight);
            if (remainingTime > 0) {
              requestAnimationFrame(scrollUp);
            } else {
              // 5秒待ってから再び下にスクロール
              setTimeout(() => {
                scroll_top_bottom_infinite(element);
              }, 5000);
            }
          };
          requestAnimationFrame(scrollUp);
        }, 5000);
      }
    };
    requestAnimationFrame(scrollDown);
  }, 0);
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
  if (click_id === 'theme_switch') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "背景を昼モードと夜モードに変更できます。"
      + "<br>アートを確認し辛い時に変えて下さい。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "You can change the background to day or night mode."
      + "<br>Change it if it is difficult to see the art.";
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
      + "<br>設計図は、必要ブロック数と座標が分かるエクセル・確認用のラフ画像を、各階層毎にしてダウンロード出来ます。"
      + "<br>また、ロードに時間がかかりますがブロックスキンありの確認用画像もダウンロード出来ます。"
      + "<br>function用のコマンドテキストもあります。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Returns a blueprint of the 3D art you have created."
      + "<br>The blueprints are available for download in Excels that showing the number of blocks required and their coordinates, and rough images these are each layer for confirmation."
      + "<br>Also, it may take a while to load, but if you want, you can download the image with the skin of the block."
      + "<br>There is also a command text for function.";
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
      str = "表示・選択しているレイヤーをコピーします。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Copy the displayed or selected layer.";
    }
  }
  if (click_class === 'layer_cut') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "表示・選択しているレイヤーの要素をコピー＆カットします。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Copy and cut elements of the displayed or selected layer.";
    }
  }
  if (click_class === 'layer_paste') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "コピーしたレイヤーをペーストします。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Paste the copied layer.";
    }
  }
  if (click_for === 'jump_to_this_layer') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "選択したポイントを基準に軸を変更します。"
      + "<br>アートの繋がりを確認した状態でレイヤーの向きを変えたい時に使用して下さい。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Change the axis with respect to the selected point."
      + "<br>Use this when you want to change the orientation of the layer while checking the connection of the art.";
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
      + "<br>Web Storage機能を使用しているためご利用出来ない環境の方は各データの保存をお願いいたします。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "When button was on, memory and palette data are stored before closing the page and automatically upload."
      + "<br>Please save each data if you cannot use the Web Storage function.";
    }
  }
  if (click_id === 'download_memory') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "Web Storage機能をご利用出来ない環境の方は、ここからexcelデータの保存をお願いいたします。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "If you are unable to use the Web Storage function, please download your excel data here.";
    }
  }
  if (click_class === 'upload_memory') {
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "ダウンロードしたデータをアップロードしてメモリを復元します。"
      + "<br>バージョン1のテキストデータでも読み込めるようにしましたが、早めにエクセルに変更して下さい。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Upload the downloaded data to restore the memory."
      + "<br>We have made it possible to read version 1 text data, but please switch to Excel as soon as possible..";
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
      + "<br>チェックしたメモリを使って、Ctrl + Sのショトカでアートを保存出来ます。";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "Save canvas data temporarily."
      + "<br>You can save your art with the shortcut Ctrl + S using the checked memory.";
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
