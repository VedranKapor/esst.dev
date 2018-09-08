
import { Auth } from 'Classes/js/Auth.Class.js';
import { App } from 'Classes/js/App.Class.js';
import { Case } from 'Classes/js/Case.Class.js';
import { HTML } from 'Classes/js/GenerateHTML.Class.js';
import { Messages, Loader } from 'Classes/js/Messages.Class.js';

const CHANGE_PASS_BTN  = document.querySelector('#changePass'); 
CHANGE_PASS_BTN.addEventListener('click', changePass);

Auth.getAccess()
    .then(responseData => {
        let us = responseData.us
        HTML.renderUserLabel(us);
    })
    .catch(error =>{
        //console.error(error);
        window.location = 'index.html';  
    });

Case.getCases()
    .then(responseData => {
        let pcs = responseData;
        App.getSession()
        .then(session => {
            if(typeof session.cs != 'undefined'){
                let cs = session.cs;
                let sc = session.sc;
                HTML.renderCasePicker(pcs, cs, sc);
                HTML.renderCaseLabel(cs, sc);
            }
            else{
                HTML.renderCasePicker(pcs, '', '');
            }  
        })
        .catch(error =>{ console.log(error); });
    })
    .catch(error =>{ console.log(error); });


$(document).delegate(".casepicker", "click", function (e) {
    e.stopImmediatePropagation();
    let cs = $(this).attr('data-ps');
    let sc = $(this).attr('data-cs');
    selectCase(cs, sc);
});

function selectCase(cs, sc) {

    let active = JSON.parse(localStorage.getItem("activePage"));
    if (active != undefined && active != "Home") {
        hasher.setHash("#");
        hasher.setHash("#"+active);
    }
    if(active != "ManageCases"){
        HTML.setActive(cs, sc);
    }
    App.setSession(cs, sc);
    HTML.renderCaseLabel(cs, sc);
    return true;
}

function changePass() {
    const password = $('#currentpassword').val();
    const newpassword = $('#newpassword').val();
    const username = $('#usernameHid').val();
    Messages.CloseAll();
    $('#msgPassword').hide();
    $('#msgPasswordNew').hide();
    Auth.changePass(password, newpassword, username)
        .then(responseData => {
            Messages.ShowInfoMessage(responseData["msg"]);
            $('#changePassModal').modal('hide');
        })
        .catch(error => {
            let responseData = error;
            switch (responseData["type"]) {
                case 'ERRORCurrent':
                    $('#msgPassword').text(responseData["msg"]).show();
                break;
                case 'ERRORNew':
                    $('#msgPasswordNew').text(responseData["msg"]).show();
                break;
            }
        });
} 
$('#changePassModal').on('hidden.bs.modal', function () {
    $('#msgPassword').hide();
    $('#msgPasswordNew').hide();
    $('#currentpassword').val('');
    $('#newpassword').val('');
});

