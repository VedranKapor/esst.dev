export class CaseData {
    static getGenData(pCase) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "Server/App/app.php",
                async: true,
                type: 'POST',
                data: { action: 'genData', cs: pCase },
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                error: function (data) {
                    reject(JSON.parse(data));
                }
            });            
        });
    }
    static saveFED(data, cs, sc){
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "App/DataEntry/DataEntry.php?action=saveData&cs=" + cs + "&sc=" + sc,
                async: true,
                data: data,
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                error: function (data) {
                    reject(JSON.parse(data));
                }
            });
        });
    }

    static saveShares(data, id, cs, sc){
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "App/DataEntry/DataEntry.php?action=SaveNestedData&id=" + id + "&cs=" + cs + "&sc=" + sc,
                async: true,
                data: data,
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