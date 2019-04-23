$(document).ready(function () {
    init();
});
function init(){
    get_user_info();
}

function get_user_info() {
    console.log("in get_user_info()");
    var actionurl = "getuserinfo";
    var data = {};
    $.ajax({
        url: actionurl,
        cache: false,
        contentType: "application/json; charset=utf-8",
        processData: false,
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify(data),
        success: function (response, status, jqXHR) {
            console.log('Status: ' + jqXHR.status);
            if (response != "no") {
                console.log(response);
                var username = response.username;
                var email = response.email;

                //If user is currently signed-in, show the user nav board on the rightmost side
                $('#user-nav-board').show();
                $('#login-status').html(username + "<br>" + email);
                //window.location.href = 'index.html';
            }
            else {
                console.log("No user is logged in");
            }

        },
        error: (function (jqXHR, textStatus, errorThrown) {
            //alert(jqXHR.status + textStatus + errorThrown);
            console.log(jqXHR.status);
        })

    });
}
function signOut() {
    console.log("in signOut()");
    var actionurl = "signout";
    $.ajax({
        url: actionurl,
        cache: false,
        contentType: "application/json; charset=utf-8",
        processData: false,
        method: 'POST',
        dataType: 'json',
        success: function (response, status, jqXHR) {
            console.log('Status: ' + jqXHR.status);
            window.location.replace('login.html')

        },
        error: (function (jqXHR, textStatus, errorThrown) {
            //alert(jqXHR.status + textStatus + errorThrown);
            console.log("ERROR: " + jqXHR.status);
            console.log(errorThrown);
        })

    });
}