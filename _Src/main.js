
import { Auth } from 'Src/auth/auth.js';
import { App } from 'Src/app/app.js';
import { ManageCasesHTML } from 'Src/includes/manageCasesHTML.js';
import { Messages, Loader } from 'Src/includes/messages.js';

const CHANGE_PASS_BTN  = document.querySelector('#changePass'); 
CHANGE_PASS_BTN.addEventListener('click', changePass);

Auth.getAccess()
    .then(responseData => {
        let us = responseData.us
        App.renderUserLabel(us);
    })
    .catch(error =>{
        window.location = 'index.html';  
    });

App.getCases()
    .then(responseData => {
        let pcs = responseData;
        App.getSession()
        .then(session => {
            if(typeof session.cs != 'undefined'){
                let cs = session.cs;
                let sc = session.sc;
                App.renderCasePicker(pcs, cs, sc);
                App.renderCaseLabel(cs, sc);
            }
            else{
                App.renderCasePicker(pcs, '', '');
            }  
        })
        .catch(error =>{ console.log(error); });
    })
    .catch(error =>{ console.log(error); });





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

