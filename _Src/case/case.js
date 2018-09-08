export class Case {
    static addCase(data) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "App/AddCase/AddCase.php",
                data: data,
                async: true,
                success: function(data){
                    var serverResponce = JSON.parse(data);
                    switch (serverResponce["type"]) {
                        case 'ERROR':
                            reject(serverResponce["type"]);
                            break;
                        case 'SUCCESS':
                            resolve(serverResponce);
                            break;
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    reject(errorThrown);
                }
            });          
        });
    }
}