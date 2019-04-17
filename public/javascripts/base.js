/* eslint-disable prefer-arrow-callback */

$('.menu-button.btn-open').click(function (e) { 
  e.preventDefault();
  $('.header-menu').fadeIn(500);
});

$('.menu-button.btn-close').click(function (e) { 
  e.preventDefault();
  $('.header-menu').fadeOut(500);
});