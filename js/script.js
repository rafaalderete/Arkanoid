$(document).ready(function() {

  var SLIDEWIDTH = 480;
  var SLIDETIME = 5000;
  var imageposition = 1;
  var sliding = false;

  function slideImage (clicked, position) {
    sliding = true;
    if (!clicked)
      if (imageposition == 4)
        position = -3;
    var marginvalue = parseInt($(".carousel .slides").css("margin-left")) + (SLIDEWIDTH * -position);
    $(".carousel .slides").animate({"margin-left":marginvalue},1000,function(){
        imageposition = imageposition + position;
        $(".dots .dot").removeClass("active");
        $("#dot"+String(imageposition)).addClass("active");
        sliding = false;
      })
  }

  var slideTimer = setInterval(slideImage, SLIDETIME, false, 1);

  $('.dots .dot').click(function() {
    if ((imageposition != $(this).attr('position')) && !(sliding)) {
      clearInterval(slideTimer);
      slideImage(true, $(this).attr('position') - imageposition);
      slideTimer = setInterval(slideImage, SLIDETIME, false, 1);
    }
	});

  $('.dropdown').hover(
       function(){
           $(this).children('.dropdown-content').stop().slideDown('fast');
       },
       function(){
           $(this).children('.dropdown-content').slideUp('fast');
       }
   );

   $('.small-menu').click(function() {
     $('.big-menu').slideToggle('fast');
   });

   Snap.select('.svg-facebook').hover(
     function() {
       Snap.select('#facebook-background').animate({'fill':'rgb(60, 60, 153)'}, 0.5);
       Snap.select('#facebook').animate({'fill':'white'}, 0.5);
     },
     function() {
       Snap.select('#facebook-background').animate({'fill':'white'}, 0.5);
       Snap.select('#facebook').animate({'fill':'black'}, 0.5);
   });

  $(window).resize(function(){
    if($(window).width() > 600 && $('.big-menu').is(':hidden')) {
        $('.big-menu').removeAttr('style');
    }
  });

});
