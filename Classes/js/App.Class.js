export class App {
    
    static getSession() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "Server/App/app.php",
                async: true,
                type: 'POST',
                data: { action: 'getSession' },
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                error: function (data) {
                    reject(JSON.parse(data));
                }
            });            
        });
    }

    static setSession(pCase, pScenario) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "Server/App/app.php",
                async: true,
                type: 'POST',
                data: { action: 'setSession', cs: pCase, sc: pScenario },
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                error: function (data) {
                    reject(JSON.parse(data));
                }
            });            
        });
    }

    
    static resetSession() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "Server/App/app.php",
                async: true,
                type: 'POST',
                data:{action:'resetSession'},
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                error: function (data) {
                    reject(JSON.parse(data));
                }
            });            
        });
    }
}