/*++reserve functions++*/
let obj = {td_x: '', tr_z: '', view: '', start_x: '', start_y: ''};
/*aside display at 1200px*/
$(window).resize(function() {
  let ww = window.innerWidth;
  if (ww >= 1200) {
    if (!$('#hanb').prop('checked')) {
      $('#hanb').prop('checked', true);
    }
  }
});
//close_button
$('.close_button').click((e) => {
  let close_target_id = $('.close_button:hover').attr('data-close-id');
  $('#' + close_target_id).css('display', 'none');
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
/*hide aside menu when using smartphone*/
$(document).ready(function () {
  let ww = window.innerWidth;
  if (ww <= 640) {
    $('#hanb').prop('checked', false);
  }
});
/*++main++*/
/*Map Calculation*/
function map_calcu () {
  $("#answer").removeClass("hidden");
  let wh = window.innerHeight;
  wh = wh - 80;
  $('table').css('max-height', wh);
  let x = $('input[name="x"]').val();
  let z = $('input[name="z"]').val();
  let chunkCount = $('select[name="count"]').val();
  obj.view = $('input[name="view"]:checked').val();
  let area = chunkCount * 2 + 1;
  let ansx = Math.floor(x / 16) * 16 - 16 * chunkCount;
  let ansz = Math.floor(z / 16) * 16 - 16 * chunkCount;
  /*simple display*/
  if (obj.view == 1) {
    let i = 0;
    let col = "";
    let colEnpty = "";
    let countX = 0;
    while (i <= 16 * area) {
      if (ansx % 16 === 0) {
        col = col + '<th style="padding: 0.5em;" class="x16 tableTop" data-p="x' + ansx + '">' + ansx + "</th>";
        colEnpty = colEnpty + '<td style="padding: 0.5em;" class="x16" data-p="x' + ansx + '"><span class="hide countX' + countX + '">x' + ansx + "<br></span></td>";
        countX = countX + 1;
      } else if (((ansx % 16) + 1) % 16 === 0) {
        col = col + '<th style="padding: 0.5em;" class="x15 tableTop" data-p="x' + ansx + '">' + ansx + "</th>";
        colEnpty = colEnpty + '<td style="padding: 0.5em;" class="x15" data-p="x' + ansx + '"><span class="hide countXbef' + countX + '">x' + ansx + "<br></span></td>";
      } else if (((ansx % 16) - 1) % 16 === 0) {
        col = col + '<th class="tableTopNone" data-p="x' + ansx + '">X</th>';
        colEnpty = colEnpty + '<td data-p="x' + ansx + '"></td>';
      }
      ansx = ansx + 1;
      i = i + 1;
    }

    let j = 0;
    let positionZ = "";
    let table = '<thead><tr><th class = "fixed"></th>' + col + "</tr></thead><tbody>";
    let countZ = 0;
    while (j <= 16 * area) {
      if (ansz % 16 === 0) {
        table = table + '<tr class="z16 countZ' + countZ + '" data-p="z' + ansz + '"><th style="padding: 0.5em;" class="tableLeft"><span class="hide cZ">z' +
          ansz + "</span>" + ansz + "</th>" + colEnpty + "</tr>";
        countZ = countZ + 1;
      } else if (((ansz % 16) + 1) % 16 === 0) {
        table = table + '<tr class="z15 countZbef' + countZ + '" data-p="z' + ansz + '"><th style="padding: 0.5em;" class="tableLeft"><span class="hide cZ">z' +
          ansz + "</span>" + ansz + "</th>" + colEnpty + "</tr>";
      } else if (((ansz % 16) - 1) % 16 === 0) {
        table = table + '<tr data-p="z' + ansz + '"><th class="tableLeftNone">X</th>' + colEnpty + "</tr>";
      }
      ansz = ansz + 1;
      j = j + 1;
    }
    table += '</tbody>';
    $("#answer").children().remove();
    $("#answer").append(table);

    let myX = "";
    let myZ = "";
    if (x % 16 === 0 || ((x % 16) + 1) % 16 === 0) {
      myX = x;
    } else {
      myX = Math.floor(x / 16) * 16 + 1;
    }
    if (z % 16 === 0 || ((z % 16) + 1) % 16 === 0) {
      myZ = z;
    } else {
      myZ = Math.floor(z / 16) * 16 + 1;
    }
    obj.td_x = myX;
    obj.tr_z = myZ;
    $('#answer tr[data-p="z' + myZ + '"] td[data-p="x' + myX + '"]').append('<p class="space"></p>');
    $('#answer tr[data-p="z' + myZ + '"] td[data-p="x' + myX + '"] p.space').attr("id", "here");
  }
  /*detailed display*/
  if (obj.view == 2) {
    let i = 0;
    let col = "";
    let colEnpty = "";
    let countX = 0;
    while (i <= 16 * area) {
      if (ansx % 16 === 0) {
        col = col + '<th style="padding: 0.5em;" class="x16 tableTop" data-p="x' + ansx + '">' + ansx + "</th>";
        colEnpty = colEnpty + '<td style="padding: 0.5em;" class="x16" data-p="x' + ansx + '"><span class="hide countX' + countX + '">x' + ansx + "<br></span></td>";
        countX = countX + 1;
      } else if (((ansx % 16) + 1) % 16 === 0) {
        col = col + '<th style="padding: 0.5em;" class="x15 tableTop" data-p="x' + ansx + '">' + ansx + "</th>";
        colEnpty = colEnpty + '<td style="padding: 0.5em;" class="x15" data-p="x' + ansx + '"><span class="hide countXbef' + countX + '">x' + ansx + "<br></span></td>";
      } else {
        col = col + '<th style="padding: 0.5em;" class="tableTop" data-p="x' + ansx + '">' + ansx + "</th>";
        colEnpty = colEnpty + '<td data-p="x' + ansx + '"></td>';
      }
      ansx = ansx + 1;
      i = i + 1;
    }

    let j = 0;
    let table = '<thead><tr><th class = "fixed"></th>' + col + '</tr></thead><tbody>';
    let countZ = 0;
    while (j <= 16 * area) {
      if (ansz % 16 === 0) {
        table = table + '<tr class="z16 countZ' + countZ + '" data-p="z' + ansz + '"><th style="padding: 0.5em;" class="tableLeft"><span class="hide cZ">z' +
          ansz + "</span>" + ansz + "</th>" + colEnpty + "</tr>";
        countZ = countZ + 1;
      } else if (((ansz % 16) + 1) % 16 === 0) {
        table = table + '<tr class="z15 countZbef' + countZ + '" data-p="z' + ansz + '"><th style="padding: 0.5em;" class="tableLeft"><span class="hide cZ">z' +
          ansz + "</span>" + ansz + "</th>" + colEnpty + "</tr>";
      } else {
        table = table + '<tr data-p="z' + ansz + '"><th style="padding: 0.5em;" class="tableLeft">' + ansz + "</th>" + colEnpty + "</tr>";
      }
      ansz = ansz + 1;
      j = j + 1;
    }
    table += '</tbody>';
    $("#answer").children().remove();
    $("#answer").append(table);
    obj.td_x = x;
    obj.tr_z = z;
    $('#answer tr[data-p="z' + z + '"] td[data-p="x' + x + '"]').append('<p class="space"></p>');
    $('#answer tr[data-p="z' + z + '"] td[data-p="x' + x + '"] p.space').attr("id", "here");
  }
  /*show coordinates*/
  let coordinate = $('input[name="coordinate"]:checked').val();
  if (coordinate == 1) {
    $("tr.z16 td.x16 span").removeClass("hide");
    $("tr.z15 td.x15 span").removeClass("hide");
  } else {
    $("tr.z16 td.x16 span").addClass("hide");
    $("tr.z15 td.x15 span").addClass("hide");
  }

  let n = 0;
  while (n <= area) {
    for (let m = 0; m <= area; m = m + 1) {
      let cou_Z = $("tr.countZ" + n + " span.cZ").text();
      let cou_Z_bef = $("tr.countZbef" + n + " span.cZ").text();
      $("tr.countZ" + n + " span.countX" + m + "").append(cou_Z);
      $("tr.countZbef" + n + " span.countXbef" + m + "").append(cou_Z_bef);
    }
    n = n + 1;
  }
  /*move to my place*/
  /*https://code-pocket.info/20191109272/*/
  /*https://developer.mozilla.org/ja/docs/Web/API/Element/scrollIntoView*/
  let target = document.getElementById("here");
  target.scrollIntoView({ block: "center", inline: "center" });
  if (!$('#command_block').prop('checked')) {
    change_command ();
  }
}
$('.go_button').on("click", function (e) {
  if (!$('input[name="x"]').val()) {
    $('input[name="x"]').val(123);
  }
  if (!$('input[name="z"]').val()) {
    $('input[name="z"]').val(123);
  }
  try {
    const inputText1 = $('input[name="x"]').val();
    const inputText2 = $('input[name="z"]').val();
    if (!/^(-?[0-9]+)$/.test(inputText1)) {
      throw new Error('半角数字またはマイナス記号以外が入力されています。');
    }
    if (!/^(-?[0-9]+)$/.test(inputText2)) {
      throw new Error('半角数字またはマイナス記号以外が入力されています。');
    }
    // ここに正常な処理を追加
    map_calcu ();
  } catch (error) {
    alert(error.message);
  }
});
/*move to #here at click my place icon*/
$(".aside_menu .my_place").click(function () {
  let target = document.getElementById("here");
  target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
});
/*avoid crashes using delete range*/
$('input[name="view"]').change(function () {
  if ($('input[name="view"]:checked').val() == 2) {
    $('select[name="count"] option[value="10"]').addClass("hide");
    $('select[name="count"] option[value="6"]').addClass("hide");
    if (
      $('select[name="count"]').val() == 10 ||
      $('select[name="count"]').val() == 6
    ) {
      $('select[name="count"] option[value="1"]').prop("selected", true);
    }
  } else {
    $('select[name="count"] option[value="10"]').removeClass("hide");
    $('select[name="count"] option[value="6"]').removeClass("hide");
  }
});
//++observer cp start++
/*change command*/
function write_command(str) {
  $('#codeToCopy').text(str);
  $('#copyButton').html('<i class="fa-solid fa-copy"></i>');
}
function get_xz() {
  let td_x,tr_z;
  let elem = document.elementFromPoint(obj.start_x, obj.start_y);
  if (elem === null) {
    return true;
  }
  let $element = jQuery(elem);
  if ($element.get(0).tagName !== "TD" && $element.parent().get(0).tagName !== "TD") {
    return false;
  }
  if ($element.get(0).tagName === "TD") {
    td_x = $element.attr('data-p');
    tr_z = $element.parent().attr('data-p');
  }
  if ($element.parent().get(0).tagName === "TD") {
    td_x = $element.parent().attr('data-p');
    tr_z = $element.parent().parent().attr('data-p');
  }
  td_x = td_x.substring(1);
  tr_z = tr_z.substring(1);
  obj.td_x = Number(td_x);
  obj.tr_z = Number(tr_z);
}
function change_command () {
  all_removeE ();

  if (obj.view == 1) {
    let x = Math.floor(obj.td_x / 16) * 16;
    let z = Math.floor(obj.tr_z / 16) * 16;
    let str = '/tp @p ' + x + ' ~ ' + z;
    write_command(str);
    $('#answer tbody td.command_target').removeClass('command_target');
    $('#answer tbody tr[data-p="z' + z + '"] td[data-p="x' + x + '"]').addClass('command_target');
  }
  if (obj.view == 2) {
    let str = '/tp @p ' + obj.td_x + ' ~ ' + obj.tr_z;
    write_command(str);
    $('#answer tbody td.command_target').removeClass('command_target');
    $('#answer tbody tr[data-p="z' + obj.tr_z + '"] td[data-p="x' + obj.td_x + '"]').addClass('command_target');
  }
}
function all_removeE () {
  document.querySelector('#answer tbody').removeEventListener('mousemove', all_removeE);
  document.querySelector('#answer tbody').removeEventListener('mouseup', change_command);
  document.querySelector('#answer tbody').removeEventListener('touchmove', all_removeE);
  document.querySelector('#answer tbody').removeEventListener('touchend', change_command);
}
function map_mousedown (e) {
  if ($('#command_block').prop('checked')) {
    return false;
  }
  obj.start_x = e.clientX;
  obj.start_y = e.clientY;
  get_xz();
  document.querySelector('#answer tbody').addEventListener('mousemove', all_removeE);
  document.querySelector('#answer tbody').addEventListener('mouseup', change_command);
}
function map_touchstart (e) {
  if ($('#command_block').prop('checked')) {
    return false;
  }
  obj.start_x = e.touches[0].clientX;
  obj.start_y = e.touches[0].clientY;
  get_xz();
  document.querySelector('#answer tbody').addEventListener('touchmove', all_removeE);
  document.querySelector('#answer tbody').addEventListener('touchend', change_command);
}
const map = document.querySelector('#answer');
const config = { childList: true, subtree: true };
const callback = function(e) {
  //reset
  document.querySelector('#answer tbody').removeEventListener('mousedown', map_mousedown);
  document.querySelector('#answer tbody').removeEventListener('touchstart', map_touchstart);
  //input
  document.querySelector('#answer tbody').addEventListener('mousedown', map_mousedown);
  document.querySelector('#answer tbody').addEventListener('touchstart', map_touchstart);
};
const observer = new MutationObserver(callback);
observer.observe(map, config);
//^^^observer cp end^^^
/*command copy*/
document.getElementById("copyButton").addEventListener("click", function() {
  // コピーするテキストを取得
  var codeToCopy = document.getElementById("codeToCopy").innerText;

  // 新しいテキストエリアを作成して、コピーするテキストを設定
  var tempTextArea = document.createElement("textarea");
  tempTextArea.value = codeToCopy;

  // テキストエリアをページに追加
  document.body.appendChild(tempTextArea);

  // テキストエリアの選択範囲を設定し、コピーを実行
  tempTextArea.select();
  document.execCommand("copy");

  // テキストエリアを削除
  document.body.removeChild(tempTextArea);
  document.getElementById("copyButton").innerHTML = '<i class="fa-solid fa-check"></i>';
  //alert("コピーしました！");
});
//全角を半角に変更
/*https://www.searchlight8.com/jquery-javaascript-replace-charcode/*/
$(function () {
  $("input").blur(function () {
    charChange($(this));
  });
  charChange = function (e) {
    let val = e.val();
    let str = val.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
    if (val.match(/[Ａ-Ｚａ-ｚ０-９]/g)) {
      $(e).val(str);
    }
  };
});
