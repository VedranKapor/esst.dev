$(document).ready(function () {
    Cookies.remove('titlecs');
    Cookies.remove('lm');

    if ($.urlParam('e')=='1' && $.urlParam('e')!==null){
        ShowErrorMessage('Invalid username or password!');
    }
    
    $('#login').load('./Auth/login/login.html');
})

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

function ShowErrorMessage(message) {
    $('#msgcontainer').html('');
    d = document.createElement('div');
    $(d).addClass("alert alert-danger alert-dismissable box-shadow--2dp")
        .attr('id', 'msg1')
        .html('<a class="close" data-dismiss="alert" aria-label="close">&times;</a>' + message)
        .appendTo($("#msgcontainer"))
    $('#msg1').delay(5000).fadeOut('slow');
}