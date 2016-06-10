function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'controllers/login.php', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        window.location.href=window.location.href;
    }
  };
  xhr.send("email=" + profile.getEmail() + "&name=" + profile.getName());
}

function signOut() {
  gapi.load('auth2', function() {
   gapi.auth2.init({
       client_id: '332020513166-urs8iui38gd74512o7dcjglsb9u23cij.apps.googleusercontent.com'
   })
   .then(function() {
       auth2 = gapi.auth2.getAuthInstance();
       auth2.signOut().then(function () {
         var xhr = new XMLHttpRequest();
         xhr.open('POST', 'controllers/logout.php', true);
         xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
         xhr.onreadystatechange = function() {
           if (xhr.readyState == 4) {
             window.location.href=window.location.href;
           }
         };
         xhr.send();
       });
   });
 });
}

function searchGame() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'controllers/search_game.php', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        return xhr.responseText;
    }
  };
  xhr.send();
}

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
      });
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

  !function(d,s,id){
    var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
    if(!d.getElementById(id)){js=d.createElement(s);
      js.id=id;
      js.src=p+"://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js,fjs);
    }
  }(document,"script","twitter-wjs");

});
