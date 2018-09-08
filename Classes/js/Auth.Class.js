
export class Auth {

    static login(username, password){
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "Auth/login/login.php",
                async: true,
                data: { action: 'login', username: username, password: password },
                type: 'POST',
                success: function (result) {                  
                    var serverResponce = JSON.parse(result);
                    switch (serverResponce["type"]) {
                        case 'SUCCESS':
                            resolve(serverResponce);
                            break;
                        case 'ERROR':
                            reject(serverResponce);
                            break;
                    }
                }
            });            
        });     
    }

    static getAccess() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "Auth/users/users.php",
                async: true,
                data: { action: 'getAccess' },
                type: 'POST',
                success: function (result) {
                    var serverResponce = JSON.parse(result);
                    switch (serverResponce["type"]) {
                        case 'ADMINACCESS':
                            resolve(serverResponce["session"]);
                            break;
                        case 'USERACCESS':
                            resolve(serverResponce["session"]);
                            break;
                        case 'ERROR':
                            reject(serverResponce["type"]);
                            break;
                    }
                }
            });            
        });
    }

    static getUsers() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'Auth/us.json',
                async: true,
                type: 'POST',
                success: function (data) {
                    resolve(data);
                },
                error: function (request, status, error) {
                    reject(request.responseText);
                }                
            });
        });
    }

    static addUser(username, password) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "Auth/users/users.php",
                async: true,
                type: 'POST',
                data: { action: 'addUser', username: username, password: password, usergroup: 'user' },
                success: function (data) {
                    let serverResponce = JSON.parse(data);
                    switch (serverResponce["type"]) {
                        case 'ERRORCurrent':
                            reject(serverResponce)
                        break;
                        case 'ERRORNew':
                            reject(serverResponce)
                        break;
                        case 'SUCCESS':
                            resolve(serverResponce)
                        break;
                    }
                }
            });
        });
    }

    static changePass(password, newpasword, username) {
        return new Promise((resolve, reject) => { 
            if(password == '') reject({ 'msg': 'Pasword is required field!', "type": "ERRORCurrent" });
            if(newpasword == '') reject({ 'msg': 'New password is required field!', "type": "ERRORNew" });
            $.ajax({
                url: "Auth/users/users.php",
                async: true,
                type: 'POST',
                data: { action: 'changePassword', userID: username, currentpassword: password, newpassword: newpasword },
                success: function (data) {
                    var serverResponce = JSON.parse(data);
                    switch (serverResponce["type"]) {
                        case 'ERRORCurrent':
                            reject(serverResponce);
                        break;
                        case 'ERRORNew':
                            reject(serverResponce);
                            break;
                        case 'SUCCESS':
                            resolve(serverResponce);
                        break;
                    }
                }
            });
        });
    }

    static deleteUser(username) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "Auth/users/users.php",
                data: { action: 'deleteUser', username: username },
                type: 'POST',
                success: function (result) {
                    var serverResponce = JSON.parse(result);
                    switch (serverResponce["type"]) {
                        case 'ERROR':
                            reject(serverResponce);
                        break;
                        case 'SUCCESS':
                            resolve(serverResponce);
                        break;
                    }
                },
                error: function (xhr, status, error) {
                    ShowErrorMessage(error);
                }
            });
        });
    }

    static userModal() {
        let username = $(this).attr('data-ps');
        $('#usernameHid').val(username);
        $('#changeUserPass').show();
        $('#changeAdminPass').hide();
        return true;
    }

    static adminModal() {
        $('#changeUserPass').hide();
        $('#changeAdminPass').show();
        return true;
    }
}
