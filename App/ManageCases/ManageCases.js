// import { Auth } from 'Src/auth/auth.js';
// import { App } from 'Src/app/app.js';
// import { Messages, Loader } from 'Src/includes/messages.js';
// import { ManageCasesHTML } from 'Src/includes/manageCasesHTML.js';


import { Auth } from 'Classes/js/Auth.Class.js';
import { App } from 'Classes/js/App.Class.js';
import { Case } from 'Classes/js/Case.Class.js';
import { HTML } from 'Classes/js/GenerateHTML.Class.js';
import { Messages, Loader } from 'Classes/js/Messages.Class.js';



const CASE_SEARCH = $('#CaseSearch'); 
const FILE_UPLOAD = $('#jqxFileUpload');

const CASENAME_ADD_SCENARIO_MODAL = $('#CS_title');
const ADD_SCENARIO_MODAL = $('#newCaseModal');
const ADD_SCENRIO_BTN = $('#btnNewCS');

const EDIT_CASE_MODAL = $('#modaleditps');
const EDIT_CASE_BTN = $('#btnSaveEditPS');

const EDIT_SCENARIO_MODAL = $('#modaleditcs');
const EDIT_SCENARIO_BTN = $('#btnSaveEditCS');

HTML.renderNavPills("visible", "visible", "hidden", "Case Studies", 'Manage Case Studies', "");

Auth.getAccess()
    .then(responseData => { })
    .catch(error =>{ window.location = 'index.html'; });


Case.getCases()
    .then(cases => {
        HTML.renderCases(cases);
        // const OPEN_ADD_SCENARIO_MODAL = document.querySelectorAll('.open-newCaseModal');
        // Array.from(OPEN_ADD_SCENARIO_MODAL).forEach(link => {
        //     link.addEventListener('click', openAddScenarioModal);
        // }); 
        Loader.Off();
    })
    .catch(error =>{ console.log(error); });


    //Search cases------------------------------------------------------------------------------------------------------------------------------------------
CASE_SEARCH.keyup(function () {
    var query = $.trim(CASE_SEARCH.val()).toLowerCase();
    $('.pstitle').each(function () {
        var $this = $(this);
        if ($this.text().toLowerCase().indexOf(query) === -1)
            $this.closest('.panel').fadeOut();
        else $this.closest('.panel').fadeIn();
    });
})

//Restore Case-------------------------------------------------------------------------------------------------------------------------------------------
FILE_UPLOAD.jqxFileUpload({
    browseTemplate: 'default',
    uploadTemplate: 'primary',
    cancelTemplate: 'danger',
    uploadUrl: "App/ManageCases/ManageCases.php",
    fileInputName: 'fileToUpload'
});

FILE_UPLOAD.on('uploadEnd', function (event) {
    var args = event.args;
    var fileName = args.file;
    var serverResponce = JSON.parse(args.response);
    console.log(serverResponce);
    switch (serverResponce["type"]) {
        case 'ERROR':
            $('#messageup').text(serverResponce["msg"]).addClass('jqx-validator-error-label').show();
            break;
        case 'SUCCESS':
            HTML.renderCases(serverResponce["data"]);
            App.getSession()
            .then(session => {
                HTML.renderCasePicker(serverResponce["data"], session.cs, session.sc); 
                HTML.setActive(session.cs, session.sc);
                HTML.renderCaseLabel(session.cs, session.sc);
            })
            .catch(error =>{ console.log(error); });
            $('#modalrestore').modal('toggle');
            Messages.ShowInfoMessage(serverResponce["msg"]);
            break;
    }
});

$('#modalrestore').on('hidden.bs.modal', function () {
    $('#messageup').hide();
})


//$('.open-newCaseModal').on('click', function (event) {	
$(document).delegate('.open-newCaseModal', "click", function (e) {
    event.preventDefault(); 
    console.log('modal new');
    CASENAME_ADD_SCENARIO_MODAL.val($(this).data('cs'));
});

//CREATE NEW SCENARIO---------------------------------------------------------------------------------------------------------------------------------
// function openAddScenarioModal(){
//     console
//     CASENAME_ADD_SCENARIO_MODAL.val($(this).data('cs'));
// }

ADD_SCENARIO_MODAL.jqxValidator({
    hintType: 'label',
    animationDuration: 500,
    rules : [
        { input: '#titlecs', message: window.lang.translate("Case name is required field!"), action: 'keyup', rule: 'required' },
        { input: '#titlecs', message: window.lang.translate("Entered case name is not allowed!"), action: 'keyup', rule: function (input, commit) {
                    var casename = $( "#titlecs" ).val();
                    var result = (/^[a-zA-Z0-9-_ ]*$/.test(casename));
                    return result;
               }
        }
        ]
});

ADD_SCENRIO_BTN.on('click', function (event) {	
    event.preventDefault(); 
   ADD_SCENARIO_MODAL.jqxValidator('validate');
});

ADD_SCENARIO_MODAL.on('validationSuccess', function (event) {
    $('#messageps').hide();
    var pCase = CASENAME_ADD_SCENARIO_MODAL.val();
    var pScenario = $("#titlecs").val();
    if (pScenario == '') {
        $('#fgtitlecs').addClass('has-error');
        return false;
    }
    Case.addScenario(pCase, pScenario)
    .then(serverResponce => {
        switch (serverResponce["type"]) {
            case 'ERROR':
                Messages.ShowErrorMessage(serverResponce["msg"]);
            break;
            case 'SUCCESS':
                ADD_SCENARIO_MODAL.modal('toggle');

                HTML.renderCases(serverResponce["data"]);

                HTML.renderCasePicker(serverResponce["data"], pCase, pScenario); 

                HTML.setActive(pCase, pScenario);

                HTML.renderCaseLabel(pCase, pScenario); 

                Messages.ShowInfoMessage("Scenario " + pScenario + " created under " + pCase + " case study!");
            break;
            case 'WARNING':
                $('#messagecs').text(serverResponce["msg"]).show();
            break;
        }
     })
    .catch(error =>{ Messages.ShowErrorMessage(error) });
});

ADD_SCENARIO_MODAL.on('hidden.bs.modal', function () {
    $('#messageps').hide();
    CASENAME_ADD_SCENARIO_MODAL.val("");
    $("#titlecs").val("");
})

//GET DESCRIPTION--------------------------------------------------------------------------------------------------------------------------------------------
$(document).delegate(".descriptionPS", "click", function (e) {
    $('#mdescriptionps').val('');
    var pCase = $(this).attr('data-ps');
    $('#mtitleps_desc').text(pCase);
    Case.getDescription(pCase)
    .then(serverResponce => {
        switch (serverResponce["type"]) {
            case 'ERROR':
                Messages.ShowErrorMessage(serverResponce["msg"]);
            break;
            case 'SUCCESS':
                $('#mdescriptionps').html(serverResponce["data"]);
            break;
        }
     })
    .catch(error =>{ Messages.ShowErrorMessage(error) });
});


    //EDIT CASE STUDY---------------------------------------------------------------------------------------------------------------------------------------
$(document).delegate(".editPS", "click", function (e) {
    $('#mdescps_edit').val('');
    var pCase = $(this).attr('data-ps');
    $('#mtitleps_edit').val(pCase);
    $('#titleps_old').val(pCase);
    Case.getDescription(pCase)
    .then(serverResponce => {
        console.log(serverResponce["data"]);
        switch (serverResponce["type"]) {
            case 'ERROR':
                Messages.ShowErrorMessage(serverResponce["msg"]);
            break;
            case 'SUCCESS':
                $('#mdescps_edit').val(serverResponce["data"]);
            break;
        }
     })
    .catch(error =>{ Messages.ShowErrorMessage(error) });
});

EDIT_CASE_MODAL.jqxValidator({
   hintType: 'label',
   animationDuration: 500,
   rules : [
       { input: '#mtitleps_edit', message: window.lang.translate("Case name is required field!"), action: 'keyup', rule: 'required' },
       { input: '#mtitleps_edit', message: window.lang.translate("Entered case name is not allowed!"), action: 'keyup', rule: function (input, commit) {
                   var casename = $( "#mtitleps_edit" ).val();
                   var result = (/^[a-zA-Z0-9-_ ]*$/.test(casename));
                   return result;
              }
       }
       ]
});
    
EDIT_CASE_BTN.on('click', function (event) {	
    event.preventDefault(); 
    EDIT_CASE_MODAL.jqxValidator('validate');
});
    
EDIT_CASE_MODAL.on('validationSuccess', function (event) {
    var pCase = $('#titleps_old').val();
    var pCaseNew = $('#mtitleps_edit').val();
    var pDesc = $('#mdescps_edit').val();

    Case.editCase(pCase, pCaseNew, pDesc)
    .then(serverResponce => {
        switch (serverResponce["type"]) {
            case 'ERROR':
                Messages.ShowErrorMessage(serverResponce["msg"]);
            break;
            case 'SUCCESS':
                EDIT_CASE_MODAL.modal('toggle');
                HTML.renderCases(serverResponce["data"]);
                App.getSession()
                    .then(session => {
                        HTML.renderCasePicker(serverResponce["data"], session.cs, session.sc); 
                        HTML.setActive(session.cs, session.sc);
                        HTML.renderCaseLabel(session.cs, session.sc);
                    })
                    .catch(error =>{ console.log(error); });
                Messages.ShowInfoMessage(serverResponce["msg"]);
            break;
            case 'WARNING':
                    $('#messageps').text(serverResponce["msg"]).addClass('label label-danger').show();
            break;
        }
     })
    .catch(error =>{ Messages.ShowErrorMessage(error) });
});
    
//chevron 
//$('.collapse').on('shown.bs.collapse', function() {
$(document).delegate(".collapse", "shown.bs.collapse", function (e) {
    $(this)
        .parent()
        .find(".glyphicon-chevron-right")
        .removeClass("glyphicon-chevron-right")
        .addClass("glyphicon-chevron-down");
})
// .on('hidden.bs.collapse', function() {
$(document).delegate(".collapse", "hidden.bs.collapse", function (e) {
    $(this)
        .parent()
        .find(".glyphicon-chevron-down")
        .removeClass("glyphicon-chevron-down")
        .addClass("glyphicon-chevron-right");
});

//BACKUP CASE STUDY--------------------------------------------------------------------------------------------------------------------------------------
$(document).delegate(".backupCS", "click", function (e) {
    e.stopImmediatePropagation();
    var pCase = $(this).attr('data-ps');

    Case.backupCase(pCase)
    .then(serverResponce => {
        switch (serverResponce["type"]) {
            case 'ERROR':
                Messages.ShowErrorMessage(serverResponce["msg"]);
            break;
            case 'SUCCESS':
                if (serverResponce.zip) {
                    Messages.ShowInfoMessage("Case " + pCase + " backed up!");
                    location.href = "Scripts/Download.php?case=" + pCase;
                }
            break;
        }
     })
    .catch(error =>{ Messages.ShowErrorMessage(error) });
});

//COPY CASE STUDY--------------------------------------------------------------------------------------------------------------------------
//$(".copyPS").click(function () {
$(document).delegate(".copyPS", "click", function (e) {
    e.stopImmediatePropagation()
    var pCase = $(this).attr('data-ps');
    Case.copyCase(pCase)
    .then(serverResponce => {
        switch (serverResponce["type"]) {
            case 'ERROR':
                Messages.ShowErrorMessage(serverResponce["msg"]);
            break;
            case 'SUCCESS':
                HTML.renderCases(serverResponce["data"]);
                App.getSession()
                    .then(session => {
                        HTML.renderCasePicker(serverResponce["data"], session.cs, session.sc); 
                    })
                    .catch(error =>{ console.log(error); });
                Messages.ShowInfoMessage(serverResponce["msg"]);
            break;
            case 'WARNING':
                    $('#messageps').text(serverResponce["msg"]).addClass('label label-danger').show();
            break;
        }
     })
    .catch(error =>{ Messages.ShowErrorMessage(error) });
});

//function for delete planninng study----------------------------------------------------------------------------------------------------------------
$(document).delegate(".deletePS", "click", function (e) {
    e.stopImmediatePropagation()
    var pCase = $(this).attr('data-ps');
    bootbox.confirm('Are You sure that You want to DELETE Planning Study ' + pCase + '?',
        function (e) {
            Case.deleteCase(pCase)
            .then(serverResponce => {
                switch (serverResponce["type"]) {
                    case 'ERROR':
                        Messages.ShowErrorMessage(serverResponce["msg"]);
                    break;
                    case 'SUCCESS':
                        HTML.renderCases(serverResponce["data"]);
                        App.getSession()
                            .then(session => {
                                HTML.renderCasePicker(serverResponce["data"], session.cs, session.sc); 
                                HTML.renderCaseLabel(session.cs, session.sc); 
                            })
                            .catch(error =>{ console.log(error); });
                        Messages.ShowInfoMessage(serverResponce["msg"]);
                    break;
                }
             })
            .catch(error =>{ Messages.ShowErrorMessage(error) });
        })
});

//COPY SCENARIO----------------------------------------------------------------------------------------------------------------------------------------
//$(".copyCS").click(function () {
$(document).delegate(".copyCS", "click", function (e) {
    e.stopImmediatePropagation();
    var pCase = $(this).attr('data-ps');
    var pScenario = $(this).attr('data-cs');
    Case.copyScenario(pCase, pScenario)
    .then(serverResponce => {
        switch (serverResponce["type"]) {
            case 'ERROR':
                Messages.ShowErrorMessage(serverResponce["msg"]);
            break;
            case 'SUCCESS':
                HTML.renderCases(serverResponce["data"]);
                App.getSession()
                    .then(session => {
                        HTML.renderCasePicker(serverResponce["data"], session.cs, session.sc); 
                        HTML.setActive(session.cs, session.sc);
                    })
                    .catch(error =>{ console.log(error); });
                Messages.ShowInfoMessage(serverResponce["msg"]);
            break;
        }
     })
    .catch(error =>{ Messages.ShowErrorMessage(error) });
});


//edit scenario------------------------------------------------------------------------------------------------------------------------------------------
$(document).delegate(".editCS", "click", function (e) {
    var pCase = $(this).attr('data-ps');
    var pScenario = $(this).attr('data-cs');
    $('#mtitleps_editcs').val(pCase);
    $('#titlecs_old').val(pScenario);
    $('#titlecs_edit').val(pScenario);
});

EDIT_SCENARIO_MODAL.jqxValidator({
   hintType: 'label',
   animationDuration: 500,
   rules : [
       { input: '#titlecs_edit', message: window.lang.translate("Case name is required field!"), action: 'keyup', rule: 'required' },
       { input: '#titlecs_edit', message: window.lang.translate("Entered case name is not allowed!"), action: 'keyup', rule: function (input, commit) {
                   var casename = $( "#titlecs_edit" ).val();
                   var result = (/^[a-zA-Z0-9-_ ]*$/.test(casename));
                   return result;
              }
       }
       ]
});

EDIT_SCENARIO_BTN.on('click', function (event) {	
    event.preventDefault(); 
    EDIT_SCENARIO_MODAL.jqxValidator('validate');
});

EDIT_SCENARIO_MODAL.on('validationSuccess', function (event) {
    var pScenario = $('#titlecs_old').val();
    var pScenarioNew = $('#titlecs_edit').val();
    var pCase = $('#mtitleps_editcs').val();

    Case.editScenario(pCase, pScenario, pScenarioNew)
    .then(serverResponce => {
        switch (serverResponce["type"]) {
            case 'ERROR':
                Messages.ShowErrorMessage(serverResponce["msg"]);
            break;
            case 'SUCCESS':
                EDIT_SCENARIO_MODAL.modal('toggle');
                HTML.renderCases(serverResponce["data"]);
                App.getSession()
                    .then(session => {
                        HTML.renderCasePicker(serverResponce["data"], session.cs, session.sc); 
                        HTML.setActive(session.cs, session.sc);
                        HTML.renderCaseLabel(session.cs, session.sc);
                    })
                    .catch(error =>{ console.log(error); });
                Messages.ShowInfoMessage(serverResponce["msg"]);
            break;
            case 'WARNING':
                $('#messagecs').text(serverResponce["msg"]).addClass('label label-danger').show();
            break;
        }
     })
    .catch(error =>{ Messages.ShowErrorMessage(error) });
});

//function for delete planninng study-------------------------------------------------------------------------------------------------------------------
$(document).delegate(".deleteCS", "click", function (e) {
    e.stopImmediatePropagation();
    var pCase = $(this).attr('data-ps');
    var pScenario = $(this).attr('data-cs');
    bootbox.confirm('Are You sure that You want to DELETE scenario ' + pScenario + '?',
        function (e) {
            Case.deleteScenario(pCase, pScenario)
            .then(serverResponce => {
                switch (serverResponce["type"]) {
                    case 'ERROR':
                        Messages.ShowErrorMessage(serverResponce["msg"]);
                    break;
                    case 'SUCCESS':
                        HTML.renderCases(serverResponce["data"]);
                        App.getSession()
                            .then(session => {
                                HTML.renderCasePicker(serverResponce["data"], session.cs, session.sc); 
                                HTML.renderCaseLabel(session.cs, session.sc); 
                                //App.renderCaseLabel('test', 'test'); 
                                HTML.setActive(session.cs, session.sc);
                            })
                            .catch(error =>{ console.log(error); });
                        Messages.ShowInfoMessage(serverResponce["msg"]);
                    break;
                }
             })
            .catch(error =>{ Messages.ShowErrorMessage(error) });            
        })
});

$(document).delegate(".begincs", "click", function (e) {
    var pCase = $(this).attr('data-ps');
    var pScenario = $(this).attr('data-cs');
    App.setSession(pCase, pScenario)
    .then(serverResponce => {
        let session = serverResponce["SESSION"];
        HTML.renderCaseLabel(session.cs, session.sc); 
        HTML.setActive(session.cs, session.sc);
        Case.getCases()
        .then(cases => {
            HTML.renderCasePicker(cases, session.cs, session.sc); 
        })
        .catch(error =>{ console.log(error); });
    })
    .catch(error =>{ console.log(error); });
});