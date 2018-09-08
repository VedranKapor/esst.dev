// $(document).ready(function(){

pcs = JSON.parse(getCS('getCases'));
//renderCasePicker(pcs, ps, cs);

if (JSON.parse(localStorage.getItem("ps")) != null && JSON.parse(localStorage.getItem("cs")) != null) {
    getEsstCase();
    renderEsstCaseBtn(ps, cs, true);
    renderCasePicker(pcs, ps, cs);
}
else {
    ShowWarningMessage("Please select active planning study and scenario!");
    renderEsstCaseBtn('', '', false);
    renderCasePicker(pcs, '', '');
}

//  Begin cs to set session variables for planning study and case study
$(document).delegate(".casepicker_onClick", "click", function (e) {
    var titleps = $(this).attr('data-ps');
    var titlecs = $(this).attr('data-cs');
    active = localStorage.getItem("activePage");


    if (JSON.parse(active) != undefined && JSON.parse(active) != "Home") {
        console.log(active);
        $(".esst-content").load('App/AddCase/' + JSON.parse(active) + '.html');
    }

    setEsstCase(titleps, titlecs);
    renderEsstCaseBtn(titleps, titlecs, true);
    setActiveCS(titleps, titlecs);

});


function setActiveCS(titleps, titlecs) {
    $('#cases').find(".in").removeClass("in");
    $('#cases').find(".glyphicon-chevron-down").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-right");

    $("#collapse_" + titleps.replace(/[^A-Z0-9]/ig, "")).addClass('in');
    $("#collapse_" + titleps.replace(/[^A-Z0-9]/ig, ""))
        .parent()
        .find(".glyphicon-chevron-right")
        .removeClass("glyphicon-chevron-right")
        .addClass("glyphicon-chevron-down");
    $('#cases').find(".glyphicon-ok").removeClass("glyphicon-remove").addClass("glyphicon-remove");
    $("#collapse_" + titleps.replace(/[^A-Z0-9]/ig, "")).parent().find(`[data-cs='${titlecs}']`).parent().find(".glyphicon-remove").removeClass("glyphicon-remove").addClass("glyphicon-ok");
}

function getCS(action, caseName) {
    var result = "";
    $.ajax({
        url: "Scripts/app.php",
        async: false,
        type: 'POST',
        data: { action: action, case: caseName },
        success: function (data) {
            result = data;
        }
    });
    return result;
}

function getEsstCase() {
    ps = JSON.parse(localStorage.getItem("ps"));
    cs = JSON.parse(localStorage.getItem("cs"));
}
function setEsstCase(ps, cs) {
    localStorage.setItem("ps", JSON.stringify(ps));
    localStorage.setItem("cs", JSON.stringify(cs));
}
function renderEsstCaseBtn(ps, cs, flag) {
    $('#ps').html(ps);
    $('#cs').html(cs);
    // if(flag){
    //     $('#ace-settings-btn').find($(".fa")).removeClass('fa-window-close-o').addClass('fa-check-square-o');
    // }
    // else{
    //     $('#ace-settings-btn').find($(".fa")).removeClass('fa-check-square-o').addClass('fa-window-close-o');
    // }
}


function renderCasePicker(pcs, ps, cs) {
    tmp = $(document).height();
    win = $(window).height();
    h = tmp - 65;  //footer 56 i navbar 45 px
    $('#casePicker').attr('style', 'min-height:' + h + 'px !important;');
    var htmlarr = [];
    htmlarr.push("<div  class='modal-header'>Select planning study and scenario</div>");
    $.each(pcs, function (index, value) {
        htmlstring = "";
        htmlstring +=
            '<h5 style="color: #777; font-size:12px; margin-bottom:2px; margin-top:20px;min-width:250px; text-align: left;" class="label-title"><span style="margin-left:10px" class="glyphicon glyphicon-folder-open"></span>' + value['title'] + '</h5>' +
            '<div class="funkyradio" style="min-width:250px; ">';
        $.each(value['cs'], function (index, valuecs) {
            //console.log('PS '+value['title'] +' '+ ps +' CS '+ valuecs['title']+' '+cs)
            if (value['title'] == ps && valuecs['title'] == cs) {
                htmlstring += '<div class="funkyradio-defaut funkyradio-cst">' +
                    '<input type="radio" class="casepicker_onClick" name="sc" data-ps="' + value['title'] + '" data-cs="' + valuecs['title'] + '" id="' + value['title'] + valuecs['title'] + '" checked/>' +
                    '<label for="' + value['title'] + valuecs['title'] + '">' + valuecs['title'] + '</label>' +
                    '</div>';
            }
            else {
                (value['title'] != ps && valuecs['title'] != cs)
                htmlstring += '<div class="funkyradio-defaut funkyradio-cst">' +
                    '<input type="radio" class="casepicker_onClick" name="sc" data-ps="' + value['title'] + '" data-cs="' + valuecs['title'] + '" id="' + value['title'] + valuecs['title'] + '"/>' +
                    '<label for="' + value['title'] + valuecs['title'] + '">' + valuecs['title'] + '</label>' +
                    '</div>';
            }
        })
        htmlstring += '</div>';
        htmlarr.push(htmlstring);
    })
    $("#casePicker").html(htmlarr.join(""));
}

//user management

function getSession() {
    $.ajax({
        data: { action: 'getSession' },
        url: "Scripts/app.php",
        async: false,
        type: 'POST',
        success: function (data) {
            result = $.parseJSON(data);
        }
    });
    return result;
}

function access() {
    $.ajax({
        url: "Auth/users/users.php",
        async: false,
        data: { action: 'getAccess' },
        type: 'POST',
        success: function (result) {
            var serverResponce = JSON.parse(result);
            switch (serverResponce["type"]) {
                case 'ADMINACCESS':
                    //console.log(serverResponce["msg"]);
                    break;
                case 'USERACCESS':
                    //console.log(serverResponce["msg"]);
                    break;
                case 'ERROR':
                    //console.log(serverResponce["msg"]);
                    window.location = 'index.html';
                    break;
            }
        }
    });
}


function changepassword() {
    $('#jqxNotification').jqxNotification('closeAll');
    $('#msgPassword').hide();
    $('#msgPasswordNew').hide();

    if ($('#currentpassword').val() == '') {
        console.log('praznooo');
        //ShowErrorMessage('Username required');
        $('#msgPassword').text('Current password is required field!');
        $('#msgPassword').addClass('jqx-validator-error-label');
        $('#msgPassword').show();
        return false;
    }

    if ($('#newpassword').val() == '') {
        //ShowErrorMessage('Password required');
        $('#msgPasswordNew').text('New username is required field!');
        $('#msgPasswordNew').addClass('jqx-validator-error-label');
        $('#msgPasswordNew').show();
        return false;
    }
    $.ajax({
        url: "Auth/users/users.php",
        async: false,
        type: 'POST',
        data: { action: 'changePassword', userID: 'null', currentpassword: $('#currentpassword').val(), newpassword: $('#newpassword').val() },
        success: function (data) {
            var serverResponce = JSON.parse(data);
            switch (serverResponce["type"]) {
                case 'ERRORCurrent':
                    $('#jqxNotification').jqxNotification('closeAll');
                    //ShowErrorMessage(serverResponce["msg"]);
                    $('#msgPassword').text(serverResponce["msg"]);
                    $('#msgPassword').addClass('jqx-validator-error-label');
                    $('#msgPassword').show();
                    break;
                case 'ERRORNew':
                    $('#jqxNotification').jqxNotification('closeAll');
                    //ShowErrorMessage(serverResponce["msg"]);
                    $('#msgPasswordNew').text(serverResponce["msg"]);
                    $('#msgPasswordNew').addClass('jqx-validator-error-label');
                    $('#msgPasswordNew').show();
                    break;
                case 'SUCCESS':
                    $('#jqxNotification').jqxNotification('closeAll');
                    ShowInfoMessage(serverResponce["msg"]);
                    $('#changePassModal').modal('hide');
                    break;
            }
        }
    });
}


function changepasswordAdmin() {
    var username = $('#usernameHid').val();
    $('#jqxNotification').jqxNotification('closeAll');
    $('#msgPassword').hide();
    $('#msgPasswordNew').hide();

    if ($('#currentpassword').val() == '') {
        console.log('postojii ' + $('#msgPassword').length);
        //ShowErrorMessage('Username required');
        $('#msgPassword').text('Current password is required field!');
        $('#msgPassword').addClass('jqx-validator-error-label');
        $('#msgPassword').show();
        return false;
    }

    if ($('#newpassword').val() == '') {
        //ShowErrorMessage('Password required');
        $('#msgPasswordNew').text('New username is required field!');
        $('#msgPasswordNew').addClass('jqx-validator-error-label');
        $('#msgPasswordNew').show();
        return false;
    }
    $.ajax({
        url: "Auth/users/users.php",
        async: false,
        type: 'POST',
        data: { action: 'changePassword', userID: username, currentpassword: $('#currentpassword').val(), newpassword: $('#newpassword').val() },
        success: function (data) {
            var serverResponce = JSON.parse(data);
            switch (serverResponce["type"]) {
                case 'ERRORCurrent':
                    console.log(serverResponce);
                    $('#jqxNotification').jqxNotification('closeAll');
                    //ShowErrorMessage(serverResponce["msg"]);
                    $('#msgPassword').text(serverResponce["msg"]);
                    $('#msgPassword').addClass('jqx-validator-error-label');
                    $('#msgPassword').show();
                    break;
                case 'ERRORNew':
                    console.log(serverResponce);
                    $('#jqxNotification').jqxNotification('closeAll');
                    //ShowErrorMessage(serverResponce["msg"]);
                    $('#msgPasswordNew').text(serverResponce["msg"]);
                    $('#msgPasswordNew').addClass('jqx-validator-error-label');
                    $('#msgPasswordNew').show();
                    break;
                case 'SUCCESS':
                    $('#jqxNotification').jqxNotification('closeAll');
                    ShowInfoMessage(serverResponce["msg"]);
                    $('#changePassModal').modal('hide');
                    break;
            }
        }
    });
}


$(document).ready(function () {
    session = getSession();
    if (session.gr == 'admin') {
        $('#userManage').show();
    }

    //sakrij poruku kad se modal zatvori
    $('#changePassModal').on('hidden.bs.modal', function () {
        console.log('hide msgs app.js')
        $('#changepasswordUser').show();
        $('#changepasswordAdmin').hide();
        $('#msgPassword').hide();
        $('#msgPasswordNew').hide();
        $('#currentpassword').val('')
        $('#newpassword').val('')
    });
});

// $(document).delegate("#sidebar-collapse", "click",function(e) {
//         setTimeout(function () {
//         $(window).trigger('resize');
//     }, 500);
// }); 


// $("#sidebar").on("click",function(e) {
//         setTimeout(function () {
//         $(window).trigger('resize');
//     }, 500);
// });


// $(document).delegate(".orange2","click",function(e){
//         setTimeout(function () {
//         $(window).trigger('resize');
//     }, 300);
//});

var theme = 'bootstrap';
function ShowErrorMessage(message) {
    $("#jqxNotification").jqxNotification({ browserBoundsOffset: 50, opacity: 0.9, autoClose: false, autoCloseDelay: 3000, showCloseButton: false, template: "error", width: '45%', theme: theme });
    $("#jqxNotificationContent").text(message);
    $("#jqxNotificationContent").text(window.lang.translate(message));
    $("#jqxNotification").jqxNotification("open");
}
function ShowInfoMessage(message) {
    $("#jqxNotification").jqxNotification({ browserBoundsOffset: 50, opacity: 0.9, autoClose: true, autoCloseDelay: 3000, showCloseButton: false, template: "info", width: '45%', theme: theme });
    $("#jqxNotificationContent").text(message);
    $("#jqxNotificationContent").text(window.lang.translate(message));
    $("#jqxNotification").jqxNotification("open");
}
function ShowWarningMessage(message) {
    $("#jqxNotification").jqxNotification({ browserBoundsOffset: 50, opacity: 0.9, autoClose: true, autoCloseDelay: 3000, showCloseButton: false, template: "warning", width: '45%', theme: theme });
    $("#jqxNotificationContent").text(message);
    $("#jqxNotification").jqxNotification("open");
}






















//var pathname = window.location.pathname; 
//var path = window.location.path; 
//var url      = window.location.href;     
//var root = document.location.hostname;
//var host = document.location.host;

// function include(page, partial) {
//     $(function(){
//       $(page).load(partial); 
//     });
// }

