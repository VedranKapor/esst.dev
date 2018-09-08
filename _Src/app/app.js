import { Messages, Loader } from 'Src/includes/messages.js';
import { ManageCasesHTML } from 'Src/includes/manageCasesHTML.js';


export class App {
    static getByAction(action, session, cs, sc) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "Server/App/app.php",
                async: true,
                type: 'POST',
                data: { action: action, session: session,  cs: cs, sc: sc },
                success: function (data) {
                    resolve(JSON.parse(data));
                }
            });            
        });
    }


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


    static renderCasePicker(pcs, ps, cs) {
        const tmp = $(document).height();
        const win = $(window).height();
        const h = win - 135;  //footer 23 i navbar 45 px breadcrumb 41

        $('#casePicker').attr('style', 'min-height:' + h + 'px !important;');
        let  htmlarr = [];
        htmlarr.push("<div  class='modal-header'>Select planning study and scenario</div>");
        $.each(pcs, function (index, value) {
            let htmlstring = "";
            htmlstring +=
                '<h5 style="color: #777; font-size:12px; margin-bottom:2px; margin-top:20px;min-width:250px; text-align: left;" class="label-title"><span style="margin-left:10px" class="glyphicon glyphicon-folder-open"></span>' + value['title'] + '</h5>' +
                '<div class="funkyradio" style="min-width:250px; ">';
            $.each(value['cs'], function (index, valuecs) {
                //console.log('PS '+value['title'] +' '+ ps +' CS '+ valuecs['title']+' '+cs)
                if (value['title'] == ps && valuecs['title'] == cs) {
                    htmlstring += '<div class="funkyradio-defaut funkyradio-cst">' +
                        '<input type="radio" class="casepicker" name="sc" data-ps="' + value['title'] + '" data-cs="' + valuecs['title'] + '" id="' + value['title'] + valuecs['title'] + '" checked/>' +
                        '<label for="' + value['title'] + valuecs['title'] + '">' + valuecs['title'] + '</label>' +
                        '</div>';
                }
                else {
                    (value['title'] != ps && valuecs['title'] != cs)
                    htmlstring += '<div class="funkyradio-defaut funkyradio-cst">' +
                        '<input type="radio" class="casepicker" name="sc" data-ps="' + value['title'] + '" data-cs="' + valuecs['title'] + '" id="' + value['title'] + valuecs['title'] + '"/>' +
                        '<label for="' + value['title'] + valuecs['title'] + '">' + valuecs['title'] + '</label>' +
                        '</div>';
                }
            })
            htmlstring += '</div>';
            htmlarr.push(htmlstring);
        })
        $("#casePicker").html(htmlarr.join(""));
        const CASEPICKER_BTN = document.querySelectorAll('.casepicker');
        Array.from(CASEPICKER_BTN).forEach(link => {
            link.addEventListener('click', this.selectCase);
        });  
        return true;
    }



    static appendCase( cs, sc) {
        let  htmlarr = [];
        let htmlstring = "";
        htmlstring +=
            '<h5 style="color: #777; font-size:12px; margin-bottom:2px; margin-top:20px;min-width:250px; text-align: left;" class="label-title"><span style="margin-left:10px" class="glyphicon glyphicon-folder-open"></span>' + cs + '</h5>' +
            '<div class="funkyradio" style="min-width:250px; ">';
        htmlstring += '<div class="funkyradio-defaut funkyradio-cst">' +
            '<input type="radio" class="casepicker" name="sc" data-ps="' + cs + '" data-cs="' + sc + '" id="' + cs+ sc + '" checked/>' +
            '<label for="' + cs + sc+ '">' + sc + '</label>' +
            '</div>';
        htmlstring += '</div>';
        htmlarr.push(htmlstring);
        $("#casePicker").append(htmlarr.join(""));
        const CASEPICKER_BTN = document.querySelectorAll('.casepicker');
        Array.from(CASEPICKER_BTN).forEach(link => {
            link.addEventListener('click', this.selectCase);
        });  
        return true;
    }

    static selectCase() {
        Loader.On();
        let cs = $(this).attr('data-ps');
        let sc = $(this).attr('data-cs');
        let active = JSON.parse(localStorage.getItem("activePage"));
        if (active != undefined && active != "Home") {
            hasher.setHash("#");
            hasher.setHash("#"+active);
        }
        if(active != "ManageCases"){
            ManageCasesHTML.setActive(cs, sc);
        }
        App.getByAction("setSession", 'case', cs, sc);
        App.renderCaseLabel(cs, sc);
        Loader.Off();

        return true;
    }

    static renderCaseLabel(ps, cs) {
        if(typeof cs != 'undefined' && cs ){
            $('#ps').html(ps);
            $('#cs').html(cs);
        }
        else{
            $('#ps').html("");
            $('#cs').html("");     
        }
        return true;
    }

    static renderUserLabel(us) {
        $('#us').html("<small>Welcome,</small>" + us);
        (us === 'admin') ? $("#userManage").show() : $("#userManage").hide();
        return true;
    }
}

