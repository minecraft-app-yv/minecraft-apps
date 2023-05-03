/*++reserve objects++*/
let obj = { start_x: '', start_y: '', start_img: '', copy_img: '',
td_x: '', tr_y: '', td_bgColor: '', target_id: '', bef_x: '', bef_y: '', start_td_x: '', start_tr_y: '',
$target: '', target_w: '', target_h: '', arry_list: '',
$icon: '', icon_top: '', icon_left: '',
use: '', want_if: '', once_memory: '', range: '', focus_layer: '',
pop_text: '', parent_class: '',
dl_name: '', dl_img: '', dl_c: '', area_top: '', area_left: '', area_w: '', area_h: ''};
let memory_obj = {};
let sound_obj = {};
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
function return_img_html (parent_class) {
  let img = $('#CP label[for="' + parent_class + '"]').children('img');
  let html = jQuery("<div>").append(img.clone(true)).html();
  return html;
}
function add_new_obj_to_memory_obj (key,value) {
  memory_obj[key] = value;
}
function delete_memory_from_memory_obj (key) {
  delete memory_obj[key];
}
function add_score_to_roll_back_obj (value) {
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
function do_play_audio (parent_class, tr_y) {
  let key = parent_class + '_' + tr_y;
  let src = sound_obj[key];
  let music = new Audio(src);
  let volume = $('#volume_bar').val() / 100;
  music.volume = volume;
  music.play();
  // WARNING: if can play src do -> fun change_same_volume
  //let range_val = $('#volume_bar').val() / 50;
  //change_same_volume (src, range_val);
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
function hslToRgb(h, s, l) {
  // hを0-360の範囲に収める
  h = (h % 360 + 360) % 360;
  // s, lを0-1の範囲に収める
  s = s / 100;
  l = l / 100;

  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c / 2;
  let r, g, b;

  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return [r, g, b];
}
function change_same_volume (audioUrl, range_val) {
  // AudioContextを作成する
  let audioContext = new AudioContext();
  // XMLHttpRequestを使用して音声データを取得する
  let xhr = new XMLHttpRequest();
  xhr.open('GET', audioUrl, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function() {
    // 取得した音声データをデコードする
    audioContext.decodeAudioData(xhr.response, function(buffer) {
      // 各音声データの音量を取得する
      let channels = buffer.numberOfChannels;
      let volumes = [];
      for (let c = 0; c < channels; c++) {
        let data = buffer.getChannelData(c);
        let sum = data.reduce(function(acc, val) {
          return acc + Math.abs(val);
        }, 0);
        let volume = sum / data.length;
        volumes.push(volume);
      }
      // 音量を統一した音量に変換する
      let maxVolume = Math.max(...volumes);
      let targetVolume = 0.1 * range_val;
      let volumeRatio = targetVolume / maxVolume;
      // 各音声データに音量を適用するGainNodeを作成する
      let gainNodes = [];
      for (let c = 0; c < channels; c++) {
        let gainNode = audioContext.createGain();
        gainNode.gain.value = volumeRatio;
        gainNodes.push(gainNode);
      }
      // GainNodeをAudioContextに接続する
      let source = audioContext.createBufferSource();
      source.buffer = buffer;
      for (let c = 0; c < channels; c++) {
        source.connect(gainNodes[c], 0, 0);
        gainNodes[c].connect(audioContext.destination);
      }
      let blob = new Blob([xhr.response], {type: 'audio/mp3'});
      let objectUrl = URL.createObjectURL(blob);
      let music = new Audio(objectUrl);
      music.play();
    });
  };
  xhr.send();
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
//close_button
$('.close_button').click((e) => {
  let close_target_id = $('.close_button:hover').attr('data-close-id');
  $('#' + close_target_id).css('display', 'none');
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
  //make sound_obj
  let name = ['bass_drum', 'snare_drum', 'hihat',
  'string_bass', 'guitar', 'banjo', 'flute', 'didgeridoo',
  'xylophone', 'vibraphone', 'bells', 'cow_bell', 'chimes',
  'bit', 'pling', 'harp'];
  for (let i = 0; i < name.length; i++) {
    for (let j = 0; j < 25; j++) {
      let url = './audio/' + name[i] + '/';
      if (j < 10) {
        url += name[i] + '_0' + j + '.mp3'
      }
      else {
        url += name[i] + '_' + j + '.mp3'
      }
      let key = name[i] + '_' + j;
      sound_obj[key] = url;
    }
  }
  //make pixel table
  let col = "";
  let colHead = '<tr><th class="FirstBlank"></th>';
  for (let i = 0; i < 50; i++) {
    colHead += '<th class="headCol"></th>';
    col += '<td class="x' + i + '"></td>';
  }
  colHead += '</tr>';
  let table = '';
  let th_text = ['0 F#', '1 G', '2 G#', '3 A', '4 A#', '5 B', '6 C', '7 C#', '8 D', '9 D#',
'10 E', '11 F', '12 F#', '13 G', '14 G#', '15 A', '16 A#', '17 B', '18 C', '19 C#', '20 D', '21 D#', '22 E', '23 F', '24 F#'];
  for (let j = 0; j < 25; j++) {
    table += '<tr class="y' + j + '"><th class="n' + j + '">' + th_text[j] + '</th>' + col + "</tr>";
  }
  $("#musical_score thead").html(colHead);
  $("#musical_score tbody").html(table);
  add_score_to_roll_back_obj ($('#musical_score').html());
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
  //++main++
  //close volume_bar
  if ($('#volume_bar:hover').length || $('#control_panel .volume_form label[for="volume_icons"]:hover').length) {
    return true;
  }
  if ($('#volume_icons').prop('checked')) {
    $('#volume_icons').prop('checked', false);
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
  } else {
    return true;
  }
}
//one time memory load action
let add_load_title_name = function (e) {
  let name = $('#musical_score').attr('data-fileName');
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
  $('#musical_score').attr('data-fileName', '');
  if (name !== null) {
    $('#musical_score').attr('data-fileName', name);
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
  add_score_to_roll_back_obj (value);
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
$('#clear_score').click((e) => {
  $('#musical_score tbody td img').remove();
  $('#musical_score td[data-class="selected"]').removeAttr('data-class');
  $('.hanb_icon_form .included_instruments img').remove();
  $('#CP .used').removeClass('used');
  add_score_to_roll_back_obj($('#musical_score').html());
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
//palette sound_blocks form download
/*https://techacademy.jp/magazine/21725*/
$(".input_forms .title .upside_menu .palette_download").click(function () {
  let getStr = "";
  $('#CP .small_title:not(label[for="add_new_blocks"])').each(function(index){
    getStr += "_split_";
    let title_for = $(this).attr('for');
    getStr += '_titleFor_' + title_for + '_titleFor_';
    let title_img_src = $(this).children('img').attr('src');
    getStr += '_titleSrc_' + title_img_src + '_titleSrc_';
    let title_img_alt = $(this).children('img').attr('alt');
    getStr += '_titleAlt_' + title_img_alt + '_titleAlt_';
    let title_span = $(this).children('span').text();
    getStr += '_titleSpan_' + title_span + '_titleSpan_';
  });
  getStr += "_nextGroup_";
  $('#CP .CPimg').parent('label').each(function (index) {
    getStr = getStr + "_split_";
    let sound_box_id = $(this).attr('id');
    getStr = getStr + "_id_" + sound_box_id + "_id_";
    let sound_box_class = $(this).attr('class');
    getStr = getStr + "_idClass_" + sound_box_class + "_idClass_";
    let parent_class = $(this).parent().attr('class');
    getStr = getStr + "_intoClass_" + parent_class + "_intoClass_";
    let children = $(this).children(".CPimg").children().clone(true);
    for (let j = 0; j < children.length; j++) {
      let alt = jQuery(children[j]).attr("alt");
      let src = jQuery(children[j]).attr("src");
      let tag = jQuery(children[j]).get(0).tagName;
      if (tag !== undefined) {
        getStr = getStr + "_tagF_" + tag + "_tag_";
      }
      if (src !== undefined) {
        getStr = getStr + "_src_" + src + "_src_";
      }
      if (alt !== undefined) {
        getStr = getStr + "_alt_" + alt + "_alt_";
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
//palette sound_blocks form upload
function make_CP_format(e) {
  let format = '<p class="big_title">Instrument</p>';
  format += '<input id="add_new_blocks" type="checkbox" class="hidden">';
  format += '<label for="add_new_blocks" class="small_title">新ブロック</label>';
  format += '<div class="add_new_blocks">';
  format += '<input id="new_block_img" type="file" accept="image/*" class="hidden" multiple>';
  format += '<button type="button"><i class="fa-solid fa-file-circle-plus"></i></button>';
  format += '</div>';
  return format;
}
function return_array_title_elements(str) {
  let array_html = [];
  str = str.split('_split_').slice(1);
  for (let i = 0; i < str.length; i++) {
    let title_for = str[i].split('_titleFor_').slice(1, 2);
    let title_img_src = str[i].split('_titleSrc_').slice(1, 2);
    let title_img_alt = str[i].split('_titleAlt_').slice(1, 2);
    let title_span = str[i].split('_titleSpan_').slice(1, 2);
    let html = '<input id="' + title_for + '" type="checkbox" class="hidden">';
    html += '<label for="' + title_for + '" class="small_title">';
    html += '<img src="' + title_img_src + '" alt="' + title_img_alt + '">';
    html += '<span>' + title_span + '</span></label>';
    html += '<div class="' + title_for + '" data-id="instrument"></div>';
    array_html.push({title_for: title_for, html: html});
  }
  return array_html;
}
function return_array_doinput(alt_arr, src_arr, str) {
  let array_html = [];
  str = str.split("_split_").slice(1);
  for (let i = 0; i < str.length; i++) {
    let sound_box_id = str[i].split("_id_").slice(1, 2);
    let sound_box_class = str[i].split("_idClass_").slice(1, 2);
    let html = '';
    if (sound_box_class === undefined || sound_box_class === '') {
      html = '<label id="' + sound_box_id + '">';
    }
    else {
      html = '<label id="' + sound_box_id + '" class="' + sound_box_class + '">';
    }
    html += '<div class="CPimg">';
    let img = str[i].split("_tagF_").slice(1);
    for (let j = 0; j < img.length; j++) {
      let src = img[j].split("_src_").slice(1, 2);
      let alt = img[j].split("_alt_").slice(1, 2);
      let index = alt_arr.indexOf(alt[0]);
      if (index >= 0) {
        src = src_arr[index];
      }
      // WARNING: if can display img do -> crossorigin="anonymous
      html = html + '<img src="' + src + '" alt="' + alt + '" crossorigin="anonymous">';
      //html += '<img src="' + src + '" alt="' + alt + '">';
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
    str = str.split("_nextGroup_");
    let array_title_ele = return_array_title_elements(str[0]);
    let array_html = return_array_doinput(alt_arr, src_arr, str[1]);
    let format = make_CP_format();
    $('#CP').html(format);
    for (let i = 0; i < array_title_ele.length; i++) {
      $('#CP').append(array_title_ele[i].html);
    }
    for (let i = 0; i < array_html.length; i++) {
      let parent_class = array_html[i].parent_class;
      if ($('#CP .' + parent_class).length) {
        $('#CP .' + parent_class).append(array_html[i].html);
      }
      else {
        $('#CP .add_new_blocks').append(array_html[i].html);
      }
    }
    setTimeout((e) => {
      //pick color display
      let parent_class = $('#CP label.check.selected').parent().attr('class');
      let img_html = return_img_html (parent_class);
      $('.aside_menu .selected_block_img').html(img_html);
      //reset
      $("#palette_upload").val('');
      $('html').css('cursor', 'default');
    }, 1);
  };
  reader.readAsText(file);
});
/*make new instrument_icon & add new group*/
function previewAndInsert(files) {
  let alt = files[0].name;
  alt = alt.split(".");
  let title_name = alt[0];
  alt = alt[0].replaceAll(' ', '_');
  alt = alt.toLowerCase();
  let reader = new FileReader();
  reader.onload = function (evt) {
    let image = new Image();
    image.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      // change grayscale & get maxdarkestBrightness index
      let maxdarkestBrightness = 255;
      let maxIndex = 0;
      for(let i = 0; i < data.length; i += 4) {
        if (data[i + 3] == 0) {
          continue;
        }
        const brightness = (3 * data[i] + 4 * data[i + 1] + data[i + 2]) / 8;
        data[i] = brightness;
        data[i + 1] = brightness;
        data[i + 2] = brightness;
        if(brightness < maxdarkestBrightness) {
          maxdarkestBrightness = brightness;
          maxIndex = i;
        }
      }
      // maxdarkestBrightness color to hsl(240,100%,50%) then adjust the saturation in order to match the shades of other colors
      for(let i = 0; i < data.length; i += 4) {
        if (data[i + 3] == 0) {
          continue;
        }
        const h = 240;
        const s = 100;
        const l = 100 - 50 * (255 - data[i]) / (255 - maxdarkestBrightness);
        const rgb = hslToRgb(h, s, l);
        data[i] = rgb[0];
        data[i + 1] = rgb[1];
        data[i + 2] = rgb[2];
      }
      ctx.putImageData(imageData, 0, 0);
      //into img
      let img = document.createElement("img");
      img.crossOrigin = "anonymous";
      img.onload = function () {
        if (obj.use === 'add_CP_group') {
          img.alt = alt;
          img.setAttribute('data-parent', alt);
          const dad = document.querySelector('#drag-and-drop-area .explain');
          dad.innerHTML = '';
          dad.append(img);
          $('#for_add_new_group .plan_menu .plan.first .title_name input').val(title_name);
          obj.once_memory = {};
          /*
          html = '<input id="' + alt + '" type="checkbox" class="hidden">';
          html += '<label for="' + alt + '" class="small_title"><span>' + title_name + '</span></label>';
          html += '<div class="' + alt + '" data-id="instrument"></div>';
          $('#CP').append(html);
          obj.$target = alt;*/
        }
        if (obj.use === 'change_instrument_icon') {
          img.alt = obj.$target;
          img.setAttribute('data-parent', obj.$target);
          $('#CP label[for="' + obj.$target + '"]').children('img').remove();
          const cp = document.querySelector('#CP label[for="' + obj.$target + '"]');
          cp.prepend(img);
        }
      };
      img.src = canvas.toDataURL();
    };
    image.src = evt.target.result;
  };
  reader.readAsDataURL(files[0]);
}
$('#add_CP_group').change((e) =>{
  let files = e.target.files;
  if (files === undefined) {
    $('#add_CP_group').val('');
    return false;
  }
  previewAndInsert(files);
  $('#add_CP_group').val('');
});
//click
$('#drag-and-drop-area').click((e) => {
  obj.use = 'add_CP_group';
  $('#add_CP_group').click();
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
  event.preventDefault();
  dragAndDropArea.classList.remove('active');
  const files = event.dataTransfer.files;
  if (files.length === 0) {
    return false;
  }
  if (!files[0].type.match(/image\/*/)) {
    return false;
  }
  obj.use = 'add_CP_group';
  previewAndInsert(files);
});
$('#add_CP_group_button').click((e) =>{
  $('#for_add_new_group').css('display', 'flex');
});
//input sounds
function add_url_to_once_memory (newUrl) {
  let name = $('#drag-and-drop-area .explain').children('img').attr('data-parent');
  let key = name + '_' + obj.tr_y;
  obj.once_memory[key] = newUrl;
}
function add_new_sounds (files) {
  if (obj.use === 'add_sound_one_upload') {
    const fileURL = URL.createObjectURL(files[0]);
    $('#for_add_new_group .plan_menu .plan.second tbody tr.n' + obj.tr_y + ' td.file_name').text(files[0].name);
    add_url_to_once_memory (fileURL);
  }
}
$('#add_new_sounds').change((e) => {
  let files = e.target.files;
  if (files === undefined) {
    $('#add_new_sounds').val('');
    return false;
  }
  add_new_sounds (files);
  $('#add_new_sounds').val('');
});
$('#for_add_new_group .plan_menu .plan.second tbody td.one_upload').on('click', (e) => {
  if ($('#drag-and-drop-area .explain').children('img').attr('data-parent') === undefined) {
    return false;
  }
  obj.use = 'add_sound_one_upload';
  let tr_n = '';
  if ($(e.target).parent().get(0).tagName === 'TR') {
    tr_n = $(e.target).parent().attr('class');
  }
  else if ($(e.target).parent().parent().get(0).tagName === 'TR') {
    tr_n = $(e.target).parent().parent().attr('class');
  }
  else {
    return false;
  }
  tr_n = tr_n.substring(1);
  tr_n = Number(tr_n);
  obj.tr_y = tr_n;
  $('#add_new_sounds').click();
});
//sound test
$('#for_add_new_group .plan_menu .plan.second tbody tr th').click((e) => {
  let tr_n = $(event.target).parent().attr('class');
  tr_n = tr_n.substring(1);
  tr_n = Number(tr_n);
  let name = $('#drag-and-drop-area .explain').children('img').attr('data-parent');
  let key = name + '_' + tr_n;
  let audioUrl = obj.once_memory[key];
  if (audioUrl === undefined) {
    return false;
  }
  let range_val = $('#volume_bar').val() / 50;
  change_same_volume (audioUrl, range_val);
});
//slideshow action
$('#for_add_new_group .plan_menu .slideshow_icon .back_plan').click((e) => {
  let plan_menu_length = $('input[name="new_group_menu"]').length;
  let now_id = $('input[name="new_group_menu"]:checked').attr('id');
  now_id = now_id.toString();
  now_id = now_id.replace('add_new_group_','');
  now_id = Number(now_id);
  if (now_id == 0) {
    now_id = plan_menu_length - 1;
  }
  else {
    now_id--;
  }
  $('#add_new_group_' + now_id).prop('checked', true);
  $('#for_add_new_group .plan_menu').scrollTop(0);
});
$('#for_add_new_group .plan_menu .slideshow_icon .forward_plan').click((e) => {
  let plan_menu_length = $('input[name="new_group_menu"]').length;
  let now_id = $('input[name="new_group_menu"]:checked').attr('id');
  now_id = now_id.toString();
  now_id = now_id.replace('add_new_group_','');
  now_id = Number(now_id);
  if (now_id == plan_menu_length - 1) {
    now_id = 0;
  }
  else {
    now_id++;
  }
  $('#add_new_group_' + now_id).prop('checked', true);
  $('#for_add_new_group .plan_menu').scrollTop(0);
});
$('input[name="new_group_menu"]').change((e) => {
  $('#for_add_new_group .plan_menu').scrollTop(0);
});
/*change_instrument_icon*/
function change_instrument_icon (e) {
  event.preventDefault();
  obj.use = 'change_instrument_icon';
  let target_for = $(e.target).attr('for');
  if (target_for === undefined) {
    target_for = $(e.target).parent().attr('for');
  }
  obj.$target = target_for;
  $('#add_CP_group').click();
}
$('#change_instrument_icon').change((e) => {
  //reset another button
  if ($('#change_CP_group_name').prop('checked')) {
    $('#change_CP_group_name').prop('checked', false);
    $('#CP .small_title span').off('click');
    rename_CP_group(e);
  }
  if ($('#remove_CP_group').prop('checked')) {
    $('#remove_CP_group').prop('checked', false);
    $('#CP .small_title:not(label[for="add_new_blocks"])').removeAttr('data-id');
    $('#CP .small_title:not(label[for="add_new_blocks"])').off('click');
  }
  //change action
  if ($('#change_instrument_icon').prop('checked')) {
    $('#CP .small_title:not(label[for="add_new_blocks"])').attr('data-id', 'change_instrument_icon');
    $('#CP .small_title:not(label[for="add_new_blocks"])').on('click', change_instrument_icon);
  }
  if (!$('#change_instrument_icon').prop('checked')) {
    $('#CP .small_title:not(label[for="add_new_blocks"])').removeAttr('data-id');
    $('#CP .small_title:not(label[for="add_new_blocks"])').off('click');
  }
});
/*remove CP group then blocks moved to add_new_blocks*/
function remove_CP_group(e) {
  let str = '';
  if ($('header .header_form p.language').text() === 'Japanese') {
    str = "選択したグループを解除しすると戻せなくなりますがよろしいですか？";
  }
  if ($('header .header_form p.language').text() === '英語') {
    str = "Disperse selected group and that will not be able to undo, is it ok?";
  }
  let result = window.confirm(str);
  if (!result) {
    return false;
  }
  let target_for = $(e.target).attr('for');
  if (target_for === undefined) {
    target_for = $(e.target).parent().attr('for');
  }
  $('#CP .' + target_for).children().each(function(index) {
    $('#CP .add_new_blocks').append($(this));
  });
  $('#CP #' + target_for).remove();
  $('#CP label[for="' + target_for + '"]').remove();
  $('#CP .' + target_for).remove();
}
$('#remove_CP_group').change((e) => {
  //reset another button
  if ($('#change_CP_group_name').prop('checked')) {
    $('#change_CP_group_name').prop('checked', false);
    $('#CP .small_title span').off('click');
    rename_CP_group(e);
  }
  if ($('#change_instrument_icon').prop('checked')) {
    $('#change_instrument_icon').prop('checked', false);
    $('#CP .small_title:not(label[for="add_new_blocks"])').removeAttr('data-id');
    $('#CP .small_title:not(label[for="add_new_blocks"])').off('click');
  }
  //change action
  if ($('#remove_CP_group').prop('checked')) {
    $('#CP .small_title:not(label[for="add_new_blocks"])').attr('data-id', 'remove_CP_group');
    $('#CP .small_title:not(label[for="add_new_blocks"])').on('click', remove_CP_group);
  }
  if (!$('#remove_CP_group').prop('checked')) {
    $('#CP .small_title:not(label[for="add_new_blocks"])').removeAttr('data-id');
    $('#CP .small_title:not(label[for="add_new_blocks"])').off('click');
  }
});
/*change_CP_group_name button*/
function rename_CP_group(e) {
  $('#CP_group_name').off('change');
  let target_for = $('#CP_group_name').parent().attr('for');
  let val = $('#CP_group_name').val();
  $('#CP_group_name').remove();
  $('#CP .small_title[for="' + target_for + '"]').children('span').text(val);
}
function change_CP_group_name(e) {
  event.preventDefault();
  rename_CP_group(e);
  let target_for = $(e.target).parent().attr('for');
  if (target_for === undefined || target_for === '') {
    return false;
  }
  let val = $('#CP .small_title[for="' + target_for + '"]').children('span').text();
  let html = '<input type="text" id="CP_group_name" required　minlength="0" size="22" spellcheck="true">';
  $('#CP .small_title[for="' + target_for + '"]').children('span').text('');
  $('#CP .small_title[for="' + target_for + '"]').append(html);
  $('#CP_group_name').val(val);
  $('#CP_group_name').on('change', rename_CP_group);
}
$('#change_CP_group_name').change((e) => {
  //reset another button
  if ($('#change_instrument_icon').prop('checked')) {
    $('#change_instrument_icon').prop('checked', false);
    $('#CP .small_title:not(label[for="add_new_blocks"])').removeAttr('data-id');
    $('#CP .small_title:not(label[for="add_new_blocks"])').off('click');
  }
  if ($('#remove_CP_group').prop('checked')) {
    $('#remove_CP_group').prop('checked', false);
    $('#CP .small_title:not(label[for="add_new_blocks"])').removeAttr('data-id');
    $('#CP .small_title:not(label[for="add_new_blocks"])').off('click');
  }
  //change action
  if ($('#change_CP_group_name').prop('checked')) {
    $('#CP .small_title span').on('click', change_CP_group_name);
  }
  if (!$('#change_CP_group_name').prop('checked')) {
    $('#CP .small_title span').off('click');
    rename_CP_group(e);
  }
});
/*make_palette_board_compact*/
$('#make_palette_board_compact ~ label[for="make_palette_board_compact"]').click(function (e) {
  if (!$('#make_palette_board_compact').prop('checked')) {
    $('#CP p.big_title').addClass('hidden');
    $('#CP input:not(#new_block_img)').each(function (e) {
      let id = $(this).attr('id');
      $('#' + id).prop('checked', false);
      if (id !== 'add_new_blocks') {
        $('#CP label[for="' + id + '"]').removeClass('opened');
        $('#CP .' + id).css('display', 'none');
      }
    });
  }
  if ($('#make_palette_board_compact').prop('checked')) {
    $('#CP p.big_title').removeClass('hidden');
    $('#CP input:not(#new_block_img)').each(function (e) {
      let id = $(this).attr('id');
      $('#' + id).prop('checked', true);
      if (id !== 'add_new_blocks') {
        $('#CP label[for="' + id + '"]').addClass('opened');
        $('#CP .' + id).css('display', 'block');
      }
    });
  }
});
//remove_CP_boxes
$('.input_forms .title .downside_menu button.remove_CP_box').click((e) => {
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
  $('#CP label.check').remove();
  $("#CP .CPimg").parent().each(function (index) {
    let new_index = index + 1;
    $(this).attr('id', 'CP' + new_index);
  });
});
//++observer included_instruments start++
//change musical_score icons from included_instruments
function change_score_icons_from_included_instruments(e) {
  let html = jQuery("<div>").append($(this).clone(true)).html();
  //pick color display
  $('.aside_menu .selected_block_img').html(html);
  //change musical_score icons
  let parent_class = $('.aside_menu .selected_block_img img').attr('data-parent');
  $('#musical_score tbody td img.mImg').removeClass('mImg');
  $('#musical_score tbody td img[data-parent="' + parent_class + '"]').each(function (index) {
    $(this).addClass('mImg');
  });
  $('#CP label.check').removeClass('check');
  $('#CP .' + parent_class + ' label.selected').addClass('check');
}
$('.hanb_icon_form .included_instruments img').each(function (index) {
  $(this).on('click', change_score_icons_from_included_instruments);
});
/*https://pisuke-code.com/mutation-observer-infinite-loop/*/
const included_instruments = document.querySelector('.hanb_icon_form .included_instruments');
const inc_config = { childList: true, subtree: true };
const inc_callback = function(e) {
  //reset
  $('.hanb_icon_form .included_instruments img').each(function (index) {
    $(this).off('click');
  });
  //input
  $('.hanb_icon_form .included_instruments img').each(function (index) {
    $(this).on('click', change_score_icons_from_included_instruments);
  });
};
const observer_inc = new MutationObserver(inc_callback);
observer_inc.observe(included_instruments, inc_config);
//^^^observer included_instruments end^^^
//++observer cp start++
//toggle action of each groups
$('#CP input[type="checkbox"]').on('change', (e) => {
  let id = $(e.target).attr('id');
  if (id === 'add_new_blocks') {
    return false;
  }
  if ($('#' + id).prop('checked')) {
    $('label[for="' + id + '"]').addClass('opened');
    $('#CP .' + id).css('display', 'block');
  }
  if (!$('#' + id).prop('checked')) {
    $('label[for="' + id + '"]').removeClass('opened');
    $('#CP .' + id).css('display', 'none');
  }
});
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
        let str = '<label id="CP' + cp_L + '"><div class="CPimg"></div></label>';
        $("#CP .add_new_blocks").append(str);
        const cp = document.querySelector('#CP' + cp_L + ' .CPimg');
        cp.appendChild(img);
        setTimeout((e) => {
          i++;
          if (i >= files.length) {
            $('#new_block_img').val('');
            return false;
          }
          cp_L ++;
          callback (i, cp_L, files, upload_new_blocks);
        }, 0)
      };
      img.src = c.toDataURL();
      img.alt = alt[0];
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
    $('#new_block_img').val('');
    return false;
  }
  let i = 0;
  upload_new_blocks (i, cp_L, files, upload_new_blocks);
});
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
function click_palette_sound_boxes(id, parent_class) {
  //palette color select
  $('#CP label.check').removeClass('check');
  $('#' + id).addClass('check');
  $('#CP .' + parent_class).children('label.selected').removeClass('selected');
  $('#' + id).addClass('selected');
  //pick color display
  let img_html = return_img_html (parent_class);
  $('.aside_menu .selected_block_img').html(img_html);
  //change musical_score icons
  $('#musical_score tbody td img.mImg').removeClass('mImg');
  $('#musical_score tbody td img[data-parent="' + parent_class + '"]').each(function (index) {
    $(this).addClass('mImg');
  });
}
//drag and drop into selected same types
function removeEvent_selected_sound_box (e) {
  document.removeEventListener('mousemove', selected_sound_box_move);
  document.removeEventListener('mouseup', selected_sound_box_into_group);
  document.removeEventListener('touchmove', selected_sound_box_move);
  document.removeEventListener('touchend', selected_sound_box_into_group);
}
function selected_sound_box_use_mouse (e) {
  e.preventDefault();
  let id = $(this).attr('id');
  let parent_class = $(this).parent().attr('class');
  let x = e.clientX;
  let y = e.clientY;
  click_palette_sound_boxes(id, parent_class);
  obj.use = 'mouse';
  obj.target_id = id;
  obj.parent_class = parent_class;
  let html = $('#' + id).html();
  $('#selected_sound_box').append(html);
  obj.arry_list = [];
  $('#CP [data-id="instrument"]').each(function (index) {
    let instrument = $(this).attr('class');
    obj.arry_list.push(instrument);
  });
  document.addEventListener('mousemove', selected_sound_box_move);
  document.addEventListener('mouseup', selected_sound_box_into_group);
}
function selected_sound_box_use_touch (e) {
  e.preventDefault();
  let id = $(this).attr('id');
  let parent_class = $(this).parent().attr('class');
  let x = e.touches[0].clientX;
  let y = e.touches[0].clientY;
  click_palette_sound_boxes(id, parent_class);
  obj.use = 'touch';
  obj.target_id = id;
  obj.parent_class = parent_class;
  let html = $('#' + id).html();
  $('#selected_sound_box').append(html);
  obj.arry_list = [];
  $('#CP [data-id="instrument"]').each(function (index) {
    let instrument = $(this).attr('class');
    obj.arry_list.push(instrument);
  });
  document.addEventListener('touchmove', selected_sound_box_move);
  document.addEventListener('touchend', selected_sound_box_into_group);
}
function selected_sound_box_move (e) {
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
  $('#selected_sound_box').css('display', 'block');
  $('#selected_sound_box').css('top', y);
  $('#selected_sound_box').css('left', x);
  obj.bef_x = x;
  obj.bef_y = y;
  let elem = document.elementFromPoint(x, y);
  if (elem === null) {
    return true;
  }
  let $elem = jQuery(elem);
  let active_class = $elem.attr('class');
  let active_for = $elem.attr('for');
  obj.arry_list.forEach((item, i) => {
    if (active_class === item || active_for === item) {
      $('#CP .active').removeClass('active');
      $elem.addClass('active');
    }
  });
  let cp_top = $("aside .aside_menu").offset().top + 70;
  let cp_bottom = window.innerHeight - 40;
  let palette_board_scroll_top = $('.aside_menu .input_forms').scrollTop();
  if (y <= cp_top) {
    palette_board_scroll_top -= 10;
    $('.aside_menu .input_forms').scrollTop(palette_board_scroll_top);
  }
  if (y >= cp_bottom) {
    palette_board_scroll_top += 10;
    $('.aside_menu .input_forms').scrollTop(palette_board_scroll_top);
  }
}
function selected_sound_box_reset (e) {
  $('#' + obj.target_id).removeAttr('style');
  $('#selected_sound_box').html('');
  $('#selected_sound_box').css('display', 'none');
  obj.use = '';
  obj.target_id = '';
  obj.parent_class = '';
  obj.bef_x = '';
  obj.bef_y = '';
  obj.arry_list = '';
  return true;
}
function move_to_this_class(target_class) {
  let html = $('#' + obj.target_id);
  $(target_class).append(html);
  selected_sound_box_reset();
}
function selected_sound_box_into_group (e) {
  removeEvent_selected_sound_box (e);
  if (!$('#CP .active').length) {
    selected_sound_box_reset (e);
    return false;
  }
  let active_for = $('#CP .active').attr('for');
  let active_class = $('#CP .active').removeClass('active').attr('class');
  let active_if = '';
  obj.arry_list.forEach((item, i) => {
    if (active_class === item || active_for === item) {
      active_if = item;
      return false;
    }
  });
  if (active_if === 'add_new_blocks' || obj.parent_class === active_if || active_if === '') {
    selected_sound_box_reset (e);
    return false;
  }
  else if (obj.parent_class !== active_if) {
    let target_class = '#CP .' + active_if;
    move_to_this_class(target_class);
  }
}
$("#CP .CPimg").parent().each(function (index) {
  $(this).on('mousedown', selected_sound_box_use_mouse);
  $(this).on('touchstart', selected_sound_box_use_touch);
});
/*https://pisuke-code.com/mutation-observer-infinite-loop/*/
const palette_board_cp = document.querySelector('#CP');
const cp_config = { childList: true, subtree: true };
const cp_callback = function(e) {
  //reset
  $('#CP input[type="checkbox"]').off('change');
  $('#CP .add_new_blocks button').off('click');
  $('#new_block_img').off('change');
  $('#CP .CPimg img').each(function (index) {
    $(this).off('mouseenter mouseleave touchstart touchend');
  });
  $("#CP .CPimg").parent().each(function (index) {
    $(this).off('mousedown touchstart');
  });
  //input
  $('#CP input[type="checkbox"]').on('change', (e) => {
    let id = $(e.target).attr('id');
    if ($('#' + id).prop('checked')) {
      $('label[for="' + id + '"]').addClass('opened');
      $('#CP .' + id).css('display', 'block');
    }
    if (!$('#' + id).prop('checked')) {
      $('label[for="' + id + '"]').removeClass('opened');
      $('#CP .' + id).css('display', 'none');
    }
  });
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
    $(this).on('mousedown', selected_sound_box_use_mouse);
    $(this).on('touchstart', selected_sound_box_use_touch);
  });
};
const observer_cp = new MutationObserver(cp_callback);
observer_cp.observe(palette_board_cp, cp_config);
//^^^observer cp end^^^
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
//slideshow action
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
/*++musical_score editing++*/
const ac = document.getElementById('musical_score');
function all_removeEventListener (e) {
  ac.removeEventListener('mousemove', all_removeEventListener);
  ac.removeEventListener('click', score_editing);
  ac.removeEventListener('touchmove', all_removeEventListener);
}
function td_xy_in_obj (clientX,clientY) {
  let td_x,tr_y;
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
  }
  if ($element.parent().get(0).tagName === "TD") {
    td_x = $element.parent().attr('class');
    tr_y = $element.parent().parent().attr('class');
  }
  td_x = td_x.substring(1);
  tr_y = tr_y.substring(1);
  obj.td_x = Number(td_x);
  obj.tr_y = Number(tr_y);
}
function end_fun (e) {
  all_removeEventListener ();
  add_score_to_roll_back_obj ($('#musical_score').html());
};
function score_editing (e) {
  let $img = $('.aside_menu .selected_block_img img');
  if (!$img.length) {
    return false;
  }
  let $point = $('#musical_score tbody tr.y' + obj.tr_y + ' td.x' + obj.td_x);
  let $td_img = $point.find('img.mImg');
  if (!$td_img.length || $img.attr('alt') !== $td_img.attr('alt')) {
    let html = jQuery("<div>").append($img.clone(true).addClass('mImg')).html();
    $point.append(html);
    $point.attr('data-class', 'selected');
    let parent_class = $('#CP label.check').parent().attr('class');
    do_play_audio (parent_class, obj.tr_y);
    if (!$('.hanb_icon_form .included_instruments img[alt="' + $img.attr('alt') + '"]').length) {
      html = jQuery("<div>").append($img.clone(true)).html();
      $('.hanb_icon_form .included_instruments').append(html);
      let target_for = $('#CP label img[alt="' + $img.attr('alt') + '"]').parent().attr('for');
      $('#CP label[for="' + target_for + '"]').addClass('used');
    }
  }
  if ($img.attr('alt') === $td_img.attr('alt')) {
    $td_img.remove();
    if (!$point.find('img').length) {
      $point.removeAttr('data-class');
    }
    if (!$('#musical_score tbody td img[alt="' + $img.attr('alt') + '"]').length) {
      $('.hanb_icon_form .included_instruments img[alt="' + $img.attr('alt') + '"]').remove();
      let target_for = $('#CP label img[alt="' + $img.attr('alt') + '"]').parent().attr('for');
      $('#CP label[for="' + target_for + '"]').removeClass('used');
    }
  }
  end_fun ();
}
/*escape for touch test*/
ac.onmousedown = function (e) {
  obj.start_x = e.clientX;
  obj.start_y = e.clientY;
  td_xy_in_obj (obj.start_x, obj.start_y);
  ac.addEventListener('mousemove', all_removeEventListener);
  ac.addEventListener('click', score_editing);
};
ac.addEventListener("touchstart", function (e) {
  obj.start_x = e.touches[0].clientX;
  obj.start_y = e.touches[0].clientY;
  td_xy_in_obj (obj.start_x, obj.start_y);
  ac.addEventListener('touchmove', all_removeEventListener);
  ac.addEventListener('click', score_editing);
});
/*++musical_score tool action++*/
//score time
$('#score_time_input .menu .time-bar input[type="range"]').change((e) => {
  let parent_class = $(e.target).parent().attr('class');
  parent_class = parent_class.replaceAll('range','');
  parent_class = parent_class.replaceAll(' ','');
  let value = $(e.target).val().toString();
  if (parent_class !== 'point_seconds') {
    if (value < 10) {
      value = '0' + value;
    }
  }
  if (parent_class === 'point_seconds') {
    value = '.' + value;
  }
  $('#score_time_input .menu .time-bar .' + parent_class + ' input[type="text"]').val(value);
  let min = $('#score_time_input .menu .time-bar .minutes input[type="text"]').val();
  let sec = $('#score_time_input .menu .time-bar .seconds input[type="text"]').val();
  let point_sec = $('#score_time_input .menu .time-bar .point_seconds input[type="text"]').val();
  let str = min + ':' + sec + point_sec;
  $('#score_time_input .menu .time_display').text(str);
});
$('#score_time_input .menu .time-bar input[type="text"]').change((e) => {
  if ($(e.target).css('color') === 'rgb(255, 0, 0)') {
    return false;
  }
  let parent_class = $(e.target).parent().attr('class');
  parent_class = parent_class.replaceAll('range','');
  parent_class = parent_class.replaceAll(' ','');
  let value = Number($(e.target).val());
  if (parent_class !== 'point_seconds') {
    $('#score_time_input .menu .time-bar .' + parent_class + ' input[type="range"]').val(value);
  }
  if (parent_class === 'point_seconds') {
    value = 10 * value;
    $('#score_time_input .menu .time-bar .' + parent_class + ' input[type="range"]').val(value);
  }
  let min = $('#score_time_input .menu .time-bar .minutes input[type="text"]').val();
  let sec = $('#score_time_input .menu .time-bar .seconds input[type="text"]').val();
  let point_sec = $('#score_time_input .menu .time-bar .point_seconds input[type="text"]').val();
  let str = min + ':' + sec + point_sec;
  $('#score_time_input .menu .time_display').text(str);
});
$('#score_time_input .menu .time-input input[type="text"]').change((e) => {
  if ($(e.target).css('color') === 'rgb(255, 0, 0)') {
    return false;
  }
  let str = $(e.target).val().toString();
  $('#score_time_input .menu .time_display').text(str);
  let min = str.split(':').slice(0, 1);
  let sec = str.split(':').slice(1);
  let point_sec = sec[0].split('.').slice(1);
  sec = sec[0].split('.').slice(0, 1);
  $('#score_time_input .menu .time-bar .minutes input[type="range"]').val(Number(min[0]));
  $('#score_time_input .menu .time-bar .seconds input[type="range"]').val(Number(sec[0]));
  $('#score_time_input .menu .time-bar .point_seconds input[type="range"]').val(Number(point_sec[0]));
  $('#score_time_input .menu .time-bar .minutes input[type="text"]').val(min[0]);
  $('#score_time_input .menu .time-bar .seconds input[type="text"]').val(sec[0]);
  $('#score_time_input .menu .time-bar .point_seconds input[type="text"]').val('.' + point_sec[0]);
});
$('#change_score_time').click((e) => {
  let str = $('#score_time_input .menu .time_display').text();
  let min = str.split(':').slice(0, 1);
  let sec = str.split(':').slice(1);
  let point_sec = sec[0].split('.').slice(1);
  sec = sec[0].split('.').slice(0, 1);
  let time = (Number(min[0]) * 60 + Number(sec[0])) * 10 + Number(point_sec[0]);
  let col_L = $('#musical_score tbody tr.y0 td').length;
  if (time >= col_L) {
    for (let i = col_L; i < time; i++) {
      $('#musical_score thead tr').append('<th class="headCol"></th>');
      $('#musical_score tbody tr').each(function(index) {
        $(this).append('<td class="x' + i + '"></td>');
      });
    }
  }
  if (time < col_L) {
    let str = '';
    if ($('header .header_form p.language').text() === 'Japanese') {
      str = "時間外の音が消えますがよろしいですか？";
    }
    if ($('header .header_form p.language').text() === '英語') {
      str = "The sound after the changed time will be deleted, is that OK?";
    }
    let result = window.confirm(str);
    if (!result) {
      return false;
    }
  }
  $('#score_time_input').css('display', 'none');
});
$('#control_panel .hanb_menu_form .hanb_menu .score_time').click((e) => {
  $('#score_time_input').css('display', 'flex');
});
//copy score
$('#control_panel .hanb_menu_form .hanb_menu .copy_score').click((e) => {
  let arry = [];
  $('#musical_score tbody td').each(function(index) {
    let tr_y = $(this).parent('tr').attr('class');
    let td_x = $(this).attr('class');
    td_x = td_x.substring(1);
    tr_y = tr_y.substring(1);
    td_x = Number(td_x);
    tr_y = Number(tr_y);
    if (!arry[tr_y]) {
      arry[tr_y] = [];
    }
    if (!$(this).children('img').length) {
      return true;
    }
    let parent_class = [];
    $(this).children('img').each(function (index, domEle) {
      parent_class.push($(domEle).attr('data-parent'));
    });
    arry[tr_y][td_x] = parent_class;
  });
  obj.once_memory = arry;
});
//paste score
$('#control_panel .hanb_menu_form .hanb_menu .paste_score').click((e) => {
  let arry = obj.once_memory;
  arry.forEach((layer_y, y) => {
    layer_y.forEach((layer_x, x) => {
      if (arry[y][x] === undefined) {
        return true;
      }
      let $table = $('#musical_score tbody tr.y' + y + ' td.x' + x);
      arry[y][x].forEach((item, i) => {
        if ($table.children('img[data-parent="' + item + '"]').length) {
          return true;
        }
        let img = $('#CP .small_title img[data-parent="' + item + '"]');
        img = jQuery("<div>").append(img.clone(true)).html();
        $('#musical_score tbody tr.y' + y + ' td.x' + x).append(img);
        if (!$('#musical_score tbody tr.y' + y + ' td.x' + x + '[data-class="selected"]').length) {
          $('#musical_score tbody tr.y' + y + ' td.x' + x).attr('data-class', 'selected');
        }
        if (!$('.hanb_icon_form .included_instruments').children('img[data-parent="' + item + '"]').length) {
          $('.hanb_icon_form .included_instruments').append(img);
          $('#CP .small_title img[data-parent="' + item + '"]').parent().addClass('used');
        }
      });
    });
  });
  let parent_class = $('.aside_menu .selected_block_img img').attr('data-parent');
  $('#musical_score tbody td img[data-parent="' + parent_class + '"]').each(function (index) {
    $(this).addClass('mImg');
  });
});
//undo
function roll_back (e) {
  if (roll_back_obj.art.length == 0) {
    return false;
  }
  if (roll_back_obj.c_art >= roll_back_obj.art.length - 1) {
    roll_back_obj.c_art = roll_back_obj.art.length - 1;
    return false;
  }
  roll_back_obj.c_art ++;
  let html = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
  //data input
  $('#musical_score').html(html);
  //included_instruments fix
  let table_img = [];
  let icons = [];
  $('#musical_score tbody td').children('img').each(function(index) {
    let parent_class = $(this).attr('data-parent');
    if (table_img.indexOf(parent_class) < 0) {
      table_img.push(parent_class);
    }
  });
  $('.hanb_icon_form .included_instruments').children('img').each(function(index) {
    let icon_class = $(this).attr('data-parent');
    if (icons.indexOf(icon_class) < 0) {
      icons.push(icon_class);
    }
  });
  table_img.forEach((item, i) => {
    if (icons.indexOf(item) < 0) {
      $('#CP .small_title img[data-parent="' + item + '"]').parent().addClass('used');
      let img = $('#CP .small_title img[data-parent="' + item + '"]');
      img = jQuery("<div>").append(img.clone(true)).html();
      $('.hanb_icon_form .included_instruments').append(img);
    }
  });
  icons.forEach((item, i) => {
    if (table_img.indexOf(item) < 0) {
      $('.hanb_icon_form .included_instruments').children('img[data-parent="' + item + '"]').remove();
      $('#CP .small_title img[data-parent="' + item + '"]').parent().removeClass('used');
    }
  });
}
$('#control_panel .hanb_menu_form .hanb_menu .roll_back').click((e) => {
  $.each(obj, function(index, value) {
    if (index === 'once_memory') {
      return true;
    }
    obj[index] = '';
  });
  roll_back (e);
});
//redo
function roll_forward (e) {
  if (roll_back_obj.art.length == 0) {
    return false;
  }
  if (roll_back_obj.c_art <= 0) {
    roll_back_obj.c_art = 0;
    return false;
  }
  roll_back_obj.c_art --;
  let html = roll_back_obj.art[roll_back_obj.art.length - 1 - roll_back_obj.c_art];
  //data input
  $('#musical_score').html(html);
  //included_instruments fix
  let table_img = [];
  let icons = [];
  $('#musical_score tbody td').children('img').each(function(index) {
    let parent_class = $(this).attr('data-parent');
    if (table_img.indexOf(parent_class) < 0) {
      table_img.push(parent_class);
    }
  });
  $('.hanb_icon_form .included_instruments').children('img').each(function(index) {
    let icon_class = $(this).attr('data-parent');
    if (icons.indexOf(icon_class) < 0) {
      icons.push(icon_class);
    }
  });
  table_img.forEach((item, i) => {
    if (icons.indexOf(item) < 0) {
      $('#CP .small_title img[data-parent="' + item + '"]').parent().addClass('used');
      let img = $('#CP .small_title img[data-parent="' + item + '"]');
      img = jQuery("<div>").append(img.clone(true)).html();
      $('.hanb_icon_form .included_instruments').append(img);
    }
  });
  icons.forEach((item, i) => {
    if (table_img.indexOf(item) < 0) {
      $('.hanb_icon_form .included_instruments').children('img[data-parent="' + item + '"]').remove();
      $('#CP .small_title img[data-parent="' + item + '"]').parent().removeClass('used');
    }
  });
}
$('#control_panel .hanb_menu_form .hanb_menu .roll_forward').click((e) => {
  $.each(obj, function(index, value) {
    if (index === 'once_memory') {
      return true;
    }
    obj[index] = '';
  });
  roll_forward (e);
});
//shortcuts
document.addEventListener('keydown', ctrl_keydown_event, false);
document.addEventListener('keydown', ctrl_shift_keydown_event, false);
function ctrl_keydown_event(e){
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyH") {
    event.preventDefault();
    $('#control_panel .hanb_menu_form .hanb_menu .score_time').click();
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyZ") {
    event.preventDefault();
    $('#control_panel .hanb_menu_form .hanb_menu .roll_back').click();
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyC") {
    event.preventDefault();
    $('#control_panel .hanb_menu_form .hanb_menu .copy_score').click();
  }
  if(event.ctrlKey && !event.shiftKey && event.code === "KeyV") {
    event.preventDefault();
    $('#control_panel .hanb_menu_form .hanb_menu .paste_score').click();
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
    $('#control_panel .hanb_menu_form .hanb_menu .roll_forward').click();
  }
}
//change volume icons
$('#volume_bar').change((e) => {
  if ($('#volume_bar').val() > 75) {
    $('#control_panel .volume_form label[for="volume_icons"] i').css('display', 'none');
    $('#control_panel .volume_form label[for="volume_icons"] .fa-volume-high').css('display', 'block');
  }
  if ($('#volume_bar').val() <= 75 && $('#volume_bar').val() > 0) {
    $('#control_panel .volume_form label[for="volume_icons"] i').css('display', 'none');
    $('#control_panel .volume_form label[for="volume_icons"] .fa-volume-low').css('display', 'block');
  }
  if ($('#volume_bar').val() == 0) {
    $('#control_panel .volume_form label[for="volume_icons"] i').css('display', 'none');
    $('#control_panel .volume_form label[for="volume_icons"] .fa-volume-xmark').css('display', 'block');
  }
});
//pop up explain
let pop_text_selecter = '#control_panel .player';
pop_text_selecter += ', #control_panel .backward-fast';
pop_text_selecter += ', #control_panel .backward-step';
pop_text_selecter += ', #control_panel .forward-step';
pop_text_selecter += ', #control_panel .forward-fast';
pop_text_selecter += ', #control_panel .hanb_menu_form .hanb_menu .roll_back';
pop_text_selecter += ', #control_panel .hanb_menu_form .hanb_menu .roll_forward';
pop_text_selecter += ', #control_panel .hanb_menu_form .hanb_menu .copy_score';
pop_text_selecter += ', #control_panel .hanb_menu_form .hanb_menu .paste_score';
pop_text_selecter += ', #control_panel .hanb_menu_form .hanb_menu .score_time';
$(pop_text_selecter).on('mouseenter', function(e) {
  obj.pop_text = $(this).children('span.shortcut').html();
  obj.use = 'mouse';
  pop_text_at_hover (e);
});
$(pop_text_selecter).on('mouseleave', function(e) {
  $('#CP_img_explanation').remove();
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