import { Auth } from 'Classes/js/Auth.Class.js';

const SUBMIT = $('#login'); 
const LOGIN_FORM = $('#loginform');

SUBMIT.on('click', function (event) {	
    event.preventDefault(); 
    let username = $('#username').val();
    let password = $('#password').val();

    Auth.login( username, password )
        .then(responseData => {
            switch (responseData["type"]) {
                case 'ERROR':
                    ShowErrorMessage(responseData["msg"]);
                break;
                case 'SUCCESS':
                    ShowSuccessMessage(responseData["msg"]);
                    window.location.replace("esst.html");
                break;
            }
        })
        .catch(error => {
            let responseData = error;
            ShowErrorMessage(responseData);
        });
});

function ShowErrorMessage(message) {
    $('#msgcontainer').html('');
    let d = document.createElement('div');
    $(d).addClass("alert alert-danger alert-dismissable box-shadow--2dp")
        .attr('id', 'msg1')
        .html('<a class="close" data-dismiss="alert" aria-label="close">&times;</a>' + message)
        .appendTo($("#msgcontainer"))
    $('#msg1').delay(5000).fadeOut('slow');
}

function ShowSuccessMessage(message) {
    $('#msgcontainer').html('');
    let d = document.createElement('div');
    $(d).addClass("alert alert-success alert-dismissable box-shadow--2dp")
        .attr('id', 'msg1')
        .html('<a class="close" data-dismiss="alert" aria-label="close">&times;</a>' + message)
        .appendTo($("#msgcontainer"))
    $('#msg1').delay(5000).fadeOut('slow');
}