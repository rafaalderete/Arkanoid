var USERNAMENULL = 0;
var USERNAMECHARACTERS = 1;
var PASSWORDNULL = 2;
var PASSWORDCHARACTERS = 3;
var REPEATPASSWORDNULL = 4;
var REPEATPASSWORDCHARACTERS = 5;
var PASSWORDNOTSAME = 6;
var USERNAMEEXIST = 7;
var USERNAMEPASSWORDERROR = 8;

//Mensajes de error dependiendo del tipo de error.
function errorMessage (error) {
  switch (error) {
    case 0: $('#error_username').append("<p><span class=\"error_message\">Username empty!</span></p>");
            $('#username').addClass('error_input');
            break;

    case 1: $('#error_username').append("<p><span class=\"error_message\">Username must contain at least 6 characters!</span></p>");
            $('#username').addClass('error_input');
            break;

    case 2: $('#error_password').append("<p><span class=\"error_message\">Password empty!</span></p>");
            $('#password').addClass('error_input');
            break;

    case 3: $('#error_password').append("<p><span class=\"error_message\">Password must contain at least 6 characters!</span></p>");
            $('#password').addClass('error_input');
            break;

    case 4: $('#error_repeat_password').append("<p><span class=\"error_message\">Repeat Password empty!</span></p>");
            $('#repeat_password').addClass('error_input');
            break;

    case 5: $('#error_repeat_password').append("<p><span class=\"error_message\">Repeat Password must contain at least 6 characters!</span></p>");
            $('#repeat_password').addClass('error_input');
            break;

    case 6: $('#repeat_password').addClass('error_input');
            $('#password').addClass('error_input');
            $('#error_repeat_password').append("<p><span class=\"error_message\">Password and Repeat Password must be the same!</span></p>");
            break;

    case 7: $('#error_general').append("<p><span class=\"error_message\">Username exist!</span></p>");
            $('#username').addClass('error_input');
            break;

    case 8: $('#error_general').append("<p><span class=\"error_message\">Username or Password wrong!</span></p>");
            $('#username').addClass('error_input');
            $('#password').addClass('error_input');
            break;
  }
}

//Google login.
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'controllers/login_google_users.php', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        window.location.href = history.back();
    }
  };
  xhr.send("email=" + profile.getEmail() + "&name=" + profile.getName());
}

//Google logout.
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

function login() {
  var flag = true;
  $("#error_username").empty();
  $("#error_password").empty();
  $("#error_general").empty();
  var username = $('#username').val();
  var password = $('#password').val();
  if (username == null || username == "") {
    flag = false;
    errorMessage(USERNAMENULL);
  }
  if (username.length < 4) {
    flag = false;
    errorMessage(USERNAMECHARACTERS);
  }
  if (password == null || password == "") {
    flag = false;
    errorMessage(PASSWORDNULL);
  }
  if (password.length < 6) {
    flag = false;
    errorMessage(PASSWORDCHARACTERS);
  }
  if (flag) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'controllers/login_users.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
          response = JSON.parse(xhr.responseText);
          if (response.length > 0) {
            for (i = 0; i < response.length; i++) {
              errorMessage(response[i]); //Agrega todos los errores encontradosdel lado del servidor.
            }
          }
          else {
            window.location.href = history.back();
          }
      }
    };
    xhr.send("username=" + username + "&password=" + password);
  }
}

function register() {
  var flag = true;
  $("#error_username").empty();
  $("#error_password").empty();
  $("#error_repeat_password").empty();
  $("#error_general").empty();
  var username = $('#username').val();
  var password = $('#password').val();
  var repeat_password = $('#repeat_password').val();
  if (username == null || username == "") {
    flag = false;
    errorMessage(USERNAMENULL);
  }
  if (username.length < 4) {
    flag = false;
    errorMessage(USERNAMECHARACTERS);
  }
  if (password == null || password == "") {
    flag = false;
    errorMessage(PASSWORDNULL);
  }
  if (password.length < 6) {
    flag = false;
    errorMessage(PASSWORDCHARACTERS);
  }
  if (repeat_password == null || repeat_password == "") {
    flag = false;
    errorMessage(REPEATPASSWORDNULL);
  }
  if (repeat_password.length < 6) {
    flag = false;
    errorMessage(REPEATPASSWORDCHARACTERS);
  }
  if (password != repeat_password) {
    flag = false;
    errorMessage(PASSWORDNOTSAME);
  }
  if (flag) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'controllers/register_users.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
            response = JSON.parse(xhr.responseText);
            if (response.length > 0) {
              for (i = 0; i < response.length; i++) {
                errorMessage(response[i]);//Agrega todos los errores encontradosdel lado del servidor.
              }
            }
            else {
              window.location.href = history.go(-2);
            }
      }
    };
    xhr.send("username=" + username + "&password=" + password + "&repeat_password=" + repeat_password);
  }
}
