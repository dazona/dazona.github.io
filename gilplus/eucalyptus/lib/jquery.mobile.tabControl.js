// http://kwbock.github.io/blog/creating-jqm-tab-control/

$(document).delegate('.ui-navbar ul li > a', 'click', function() {
  $(this).closest('.ui-navbar').find('a').removeClass('ui-btn-active');

  $(this).addClass('ui-btn-active');

  $('#' + $(this).attr('data-href')).show().siblings('.tab-content').hide();

  return false;
});
