/*++reserve functions++*/
//BG_change_fun
$(document).scroll(function () {
  let h = $(this).scrollTop();
  if (h < 400) {
    $('body').css('background-image', 'radial-gradient(ellipse at center, rgba(10,5,0,0.8) 40%,rgba(0,0,0,0.9) 60%,rgba(0,0,0,1) 100%) , url(./img/BG.jpg)');
  }
  if (h >= 400) {
    $('body').css('background-image', 'radial-gradient(ellipse at center, rgba(10,5,0,0.8) 40%,rgba(0,0,0,0.9) 60%,rgba(0,0,0,1) 100%) , url(../chunk_checker/img/codePen_Minecraft_1.jpg)');
  }
  if (h >= 1000) {
    $('body').css('background-image', 'radial-gradient(ellipse at center, rgba(10,5,0,0.8) 40%,rgba(0,0,0,0.9) 60%,rgba(0,0,0,1) 100%) , url(../art/img/codePen_MineBK31.jpg)');
  }
});
//close_button
$('.close_button').click((e) => {
  let close_target_id = $('.close_button:hover').attr('data-close-id');
  $('#' + close_target_id).css('display', 'none');
});
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
