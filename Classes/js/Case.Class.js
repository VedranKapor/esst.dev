export class Case {

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

    static addCase(data) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "App/AddCase/AddCase.php",
                data: data,
                async: true,
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                error: function (data) {
                    reject(JSON.parse(data));
                }
            });          
        });
    }

    static getCases() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "Server/App/app.php",
                async: true,
                type: 'POST',
                data: { action: 'getCases' },
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                error: function (data) {
                    reject(JSON.parse(data));
                }
            });            
        });
    }

    static addScenario(pCase, pScenario) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "App/ManageCases/ManageCases.php",
                data: { action: 'createScenario', case: pCase, scenario: pScenario },
                type: 'POST',
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                error: function (data) {
                    reject(JSON.parse(data));
                }
            });            
        });
    }

    static getDescription(pCase) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "App/ManageCases/ManageCases.php",
                data: { case: pCase, action: 'getDescription' },
                type: 'POST',          
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                error: function (data) {
                    reject(JSON.parse(data));
                }
            });           
        });
    }

    static editCase(pCase, pCaseNew, pDesc) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "App/ManageCases/ManageCases.php",
                data: { case: pCase, caseNew: pCaseNew, desc: pDesc, action: 'updatePlanningStudy' },
                type: 'POST',
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                error: function (data) {
                    reject(JSON.parse(data));
                }
            });      
        });
    }

    static backupCase(pCase) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "App/ManageCases/ManageCases.php",
                data: { case: pCase, action: 'backupCase' },
                type: 'POST',
                async: true,
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                error: function (data) {
                    reject(JSON.parse(data));
                }
            });      
        });
    }

    static copyCase(pCase) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "App/ManageCases/ManageCases.php",
                data: { case: pCase, action: 'copyCase' },
                type: 'POST',
                async: true,
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                error: function (data) {
                    reject(JSON.parse(data));
                }
            });    
        });
    }

    static deleteCase(pCase) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "App/ManageCases/ManageCases.php",
                data: { case: pCase, action: 'deleteStudy' },
                type: 'POST',
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                error: function (data) {
                    reject(JSON.parse(data));
                }
            });  
        });
    }

    static copyScenario(pCase, pScenario) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "App/ManageCases/ManageCases.php",
                data: { case: pCase, scenario: pScenario, action: 'copyScenario' },
                type: 'POST',
                async: true,
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                error: function (data) {
                    reject(JSON.parse(data));
                }
            });  
        });
    }

    static deleteScenario(pCase, pScenario) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "App/ManageCases/ManageCases.php",
                data: { case: pCase, scenario: pScenario, action: 'deleteScenario' },
                type: 'POST',
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                error: function (data) {
                    reject(JSON.parse(data));
                }
            }); 
        });
    }

    static editScenario(pCase, pScenario, pScenarioNew) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "App/ManageCases/ManageCases.php",
                data: { scenario: pScenario, scenarioNew: pScenarioNew, case: pCase, action: 'updateScenarioName' },
                type: 'POST',
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