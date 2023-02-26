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
//language transform
$('#display_language').on('change', (e) => {
  if ($('#display_language').prop('checked')) {
    //English
    $('head title').text('Privacy policy');
    $('header .header_2windows nav ul li.parent.apps').text('Apps');
    $('header .header_2windows nav ul li.checker a').attr('href', '../chunk_checker/chunk_checker_eng.html');
    $('header .header_2windows nav ul li.checker .text').text('Chunk Border Checker');
    $('header .header_2windows nav ul li.map_art a').attr('href', '../art/art_eng.html');
    $('header .header_2windows nav ul li.map_art .text').text('Map & Pixel Art Simulator');
    $('header .header_2windows a.index_of_this_page').attr('href', '../index/index_eng.html');
    $('header .header_2windows nav ul li.parent.language').text('言語');
    $('header .header_2windows nav ul li.j_language label').text('日本語');
    $('header .header_2windows nav ul li.e_language label').text('英語');
    $('header .header_form nav ul li .app_language').text('Apps');
    $('header .header_form nav ul li.checker a').attr('href', '../chunk_checker/chunk_checker_eng.html');
    $('header .header_form nav ul li.checker .text').text('Chunk Border Checker');
    $('header .header_form nav ul li.map_art a').attr('href', '../art/art_eng.html');
    $('header .header_form nav ul li.map_art .text').text('Map & Pixel Art Simulator');
    $('header .header_form h1 a.index_of_this_page').attr('href', '../index/index_eng.html');
    $('header .header_form nav ul li label.j_language').text('日本語');
    $('header .header_form nav ul li label.e_language').text('英語');
    let html = '<h1>Privacy policy</h1>'
    + '<h2>The Service collects the following information</h2>'
    + '<p>Temporary memory storage data and palette editing data.</p>'
    + '<h2>Purpose of using the information</h2>'
    + '<p>Temporary storage data and palette edit data, <br>'
    + 'which are lost when the web page is reloaded, <br>'
    + 'so we are saved them to local storage using the Web Storage function.<br>'
    + 'And then, we use this function to automatically load the saved data<br>'
    + 'when the window is loaded.</p>';
    $('main article section.top .center_form').html(html);
  }
  if (!$('#display_language').prop('checked')) {
    //English
    $('head title').text('プライバシーポリシー');
    $('header .header_2windows nav ul li.parent.apps').text('アプリ');
    $('header .header_2windows nav ul li.checker a').attr('href', '../chunk_checker/chunk_checker.html');
    $('header .header_2windows nav ul li.checker .text').text('チャンク境界チェッカー');
    $('header .header_2windows nav ul li.map_art a').attr('href', '../art/art.html');
    $('header .header_2windows nav ul li.map_art .text').text('マップ・ピクセルアート用シミュレーター');
    $('header .header_2windows a.index_of_this_page').attr('href', '../index/index.html');
    $('header .header_2windows nav ul li.parent.language').text('Language');
    $('header .header_2windows nav ul li.j_language label').text('Japanese');
    $('header .header_2windows nav ul li.e_language label').text('English');
    $('header .header_form nav ul li .app_language').text('アプリ');
    $('header .header_form nav ul li.checker a').attr('href', '../chunk_checker/chunk_checker.html');
    $('header .header_form nav ul li.checker .text').text('チャンク境界チェッカー');
    $('header .header_form nav ul li.map_art a').attr('href', '../art/art.html');
    $('header .header_form nav ul li.map_art .text').text('マップ・ピクセルアート用シミュレーター');
    $('header .header_form h1 a.index_of_this_page').attr('href', '../index/index.html');
    $('header .header_form nav ul li label.j_language').text('Japanese');
    $('header .header_form nav ul li label.e_language').text('English');
    let html = '<h1>プライバシーポリシー</h1>'
    + '<h2>当サービスは以下の情報を取得しています</h2>'
    + '<p>メモリの一時保存データとパレットの編集データ</p>'
    + '<h2>情報を利用する目的</h2>'
    + '<p>Webページの再読み込みを行うことで消滅してしまう<br>'
    + '一時保存データとパレットの編集データを<br>'
    + 'Web Storage機能を使いローカルストレージに保存。<br>'
    + '保存されたデータをwindow読み込み時に<br>'
    + '自動ロードさせるために使用しております。</p>';
    $('main article section.top .center_form').html(html);
  }
});
