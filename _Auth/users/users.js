import { Auth } from 'Classes/js/Auth.Class.js';
import { HTML } from 'Classes/js/GenerateHTML.Class.js';
import { Messages } from 'Classes/js/Messages.Class.js';

const CHANGE_PASS_BTN = document.querySelector('#changePass'); 
const ADD_USER_BTN    = document.querySelector('#addUser');

const CHANGE_ADMIN_PASS_MODAL = document.querySelector('#open-changeAdminPassModal');

ADD_USER_BTN.addEventListener('click', addUser);
CHANGE_PASS_BTN.addEventListener('click', changePass);
CHANGE_ADMIN_PASS_MODAL.addEventListener('click', openAdminPassModal);

Auth.getAccess()
    .then(responseData => {})
    .catch(error =>{
        window.location = 'index.html';  
    });

Auth.getUsers()
.then(responseData => {
    const uss = responseData;
    HTML.renederUsers(uss);

    const DELETE_USER = document.querySelectorAll('.deleteUser');
    const CHANGE_PASS_MODAL = document.querySelectorAll('.open-changePassModal');
  
    Array.from(DELETE_USER).forEach(link => {
        link.addEventListener('click', deleteUser);
    }); 
    Array.from(CHANGE_PASS_MODAL).forEach(link => {
        link.addEventListener('click', getUsername);
    }); 
})
.catch(error => console.log(error));

function addUser() {
    const username = $('#username').val();
    const password = $('#password').val();
    Auth.addUser(username, password)
        .then(responseData => {
            Messages.ShowInfoMessage(responseData["msg"]);
            $('#addUserModal').modal('hide');
            HTML.renederUsers(responseData["data"]);
            const DELETE_USER = document.querySelectorAll('.deleteUser');
            Array.from(DELETE_USER).forEach(link => {
                link.addEventListener('click', deleteUser);
            }); 
    })
    .catch(error => {
        let responseData = error;
        switch (responseData["type"]) {
            case 'ERRORCurrent':
                $('#msgUsernameAdd').text(responseData["msg"]).show();
            break;
            case 'ERRORNew':
                $('#msgPasswordAdd').text(responseData["msg"]).show();
            break;
        }
    });
} 

function deleteUser() {
    let username = $(this).attr('data-us');
    bootbox.confirm('Are You sure that You want to DELETE user ' + username + ', with all case studies?',
    function (e) {
        if (e) {
            Auth.deleteUser(username)
                .then(responseData => {

                    Messages.ShowInfoMessage(responseData['msg']);
                    HTML.renederUsers(responseData["data"]);
                    const DELETE_USER = document.querySelectorAll('.deleteUser');
                    Array.from(DELETE_USER).forEach(link => {
                        link.addEventListener('click', deleteUser);
                    }); 
                })
                .catch(error => {
                    Messages.ErrorInfoMessage(responseData['msg']);
                });
        }
    })
} 

function getUsername() {
    let username = $(this).data('us');
    $("#usernameHid").val( username );
} 

function openAdminPassModal() {
    $("#usernameHid").val( 'admin' );
} 
