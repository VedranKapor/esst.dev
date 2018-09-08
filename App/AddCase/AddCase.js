// import { Auth } from 'Src/auth/auth.js';
// import { App } from 'Src/app/app.js';
// import { Case } from 'Src/case/case.js';
// import { Messages, Loader } from 'Src/includes/messages.js';
// import { CaseHTML } from 'Src/includes/caseHTML.js';

import { Auth } from 'Classes/js/Auth.Class.js';
import { App } from 'Classes/js/App.Class.js';
import { Case } from 'Classes/js/Case.Class.js';
import { HTML } from 'Classes/js/GenerateHTML.Class.js';
import { Messages, Loader } from 'Classes/js/Messages.Class.js';

const CASE   = $('#case');
const SUBMIT = $('#Submit'); 
const EDIT   = $('#Edit');
const ADD    = $('#NewCS');
const START_YEAR    = $('#startYear');
const END_YEAR    = $('#endYear');

const CHECK_ALL    = $('#checkall');
const UNCHECK_ALL  = $("#uncheckall");
const CHECK_2X     = $("#checkx2");
const CHECK_5X     = $("#checkx5");
const TYPE_SIMULATION = $('input[type=radio][name=Type]');


HTML.renderNavPills("visible", "visible", "hidden", "Case Studies", 'Create Case Study', "");

Auth.getAccess()
    .then(responseData => { })
    .catch(error =>{ window.location = 'index.html'; });

App.getSession()
    .then(session => {
        if(typeof session.cs != 'undefined' && session.cs){
            console.log(session.cs);
            Case.getGenData(session.cs)
                .then(genData => {
                    
                    HTML.renderAddCase(genData, session.sc);
                    Loader.Off();
                })
        }
        else{
            HTML.renderAddCaseEmpty();
            Loader.Off();
        } 
    })
    .catch(error =>{ console.log(error); });

let buttonFlag = 'Save';

SUBMIT.on('click', function (event) {	
    event.preventDefault(); 
    buttonFlag = 'Save';
    CASE.jqxValidator('validate')
});
EDIT.on('click', function (event) {	
    event.preventDefault(); 
    buttonFlag = 'Edit';
    CASE.jqxValidator('validate')
});
ADD.on('click', function (event) {	
    event.preventDefault(); 
    EDIT.hide();
    ADD.hide();
    SUBMIT.show();
    HTML.renderAddCaseEmpty();
});

var render = function (message, input) {
    //console.log(Object.values(input));
    if (this._message) {
        this._message.remove();
    }
    this._message = $("<span class='jqx-validator-error-label' lang='"+ $.cookie("lang") +"'>" + message + "</span>")
    this._message.appendTo("#yearsselectmsg");
    return this._message;
 }

CASE.jqxValidator({
    hintType: 'label',
    animationDuration: 500,
    rules : [
        { input: '#casename', message: window.lang.translate("Case name is required field!"), action: 'keyup', rule: 'required' },
        { input: '#casename', message: window.lang.translate("Entered case name is not allowed!"), action: 'keyup', rule: function (input, commit) {
                    var casename = $( "#casename" ).val();
                    var result = (/^[a-zA-Z0-9-_ ]*$/.test(casename));
                    return result;
               }
        },
        { input: '#scenarioname', message: window.lang.translate("Scenario name is required field!"), action: 'keyup', rule: 'required'},
             { input: '#scenarioname', message: window.lang.translate("Entered scenario name is not allowed!"), action: 'keyup', rule: function (input, commit) {
                 var scenarioname = $( "#scenarioname" ).val();
                 var result = (/^[a-zA-Z0-9-_ ]*$/.test(scenarioname));
                 return result;
         }
         },
         { input: '#startYear', message: window.lang.translate("Required"), action: 'keyup', rule: 'required' },
         { input: '#startYear', message: window.lang.translate('Start year must be between 2000 and 2050'), action: 'keyup', rule: function (input, commit) {
                var start = $( "#startYear" ).val();
                return start >= 2000 && start <= 2050;
            }
         },
         { input: '#endYear', message: window.lang.translate("Required"), action: 'keyup', rule: 'required' },
         { input: '#endYear', message: window.lang.translate("End year is less then start year!"), action: 'keyup',  rule: function (input, commit) {
                     let start = $( "#startYear" ).val();
                     let end = $( "#endYear" ).val();
                     let res = end-start;
                     return res >= 0;
                }
         },
         { input: '#endYear', message: window.lang.translate('End year must be between 2000 and 2050'), action: 'keyup',  rule: function (input, commit) {
                var end = $( "#endYear" ).val();
                return end >= 2000 && end <= 2050;
            }
         },
         { input: '#yearsselect', message: window.lang.translate('Select at least one year'), action: 'change', hintRender: render, rule: function () {
             var elements = $('#yearsselect').find('input[type=checkbox]');
             var check = false;
             var result = $.grep(elements, function(element, index) {
                 if(element.checked==true)
                     check=true;
                 });
             return (check);
             }
         },
         { input: '#Sector', message: window.lang.translate('Select at least one sector'), action: 'change', rule: function () {
            var elements = $('#Sector').find('input[type=checkbox]');
            var check = false;
            var result = $.grep(elements, function(element, index) {
                if(element.checked==true)
                    check=true;
                });
            return (check);
            }
        },
        { input: '#Commodity', message: window.lang.translate('Select at least one commodity'), action: 'change', rule: function () {
            var elements = $('#Commodity').find('input[type=checkbox]');
            var check = false;
            var result = $.grep(elements, function(element, index) {
                if(element.checked==true)
                    check=true;
                });
            return (check);
            }
        },
        { input: '#Technology', message: window.lang.translate('Select at least one technology'), action: 'change', rule: function () {
            var elements = $('#Technology').find('input[type=checkbox]');
            var check = false;
            var result = $.grep(elements, function(element, index) {
                if(element.checked==true)
                    check=true;
                });
            return (check);
            }
        }
        ]
 });
 
 //sve case 
CASE.on('validationSuccess', function (event) {
    let cs = $('#casename').val();
    let sc = $('#scenarioname').val();
    let action;
    if (buttonFlag == 'Save') { action = 'saveCase'; }
    else{ action = 'editCase'; }
    //console.log(cs, sc, action);
    let data = CASE.serialize()+'&'+$.param({ 'action': action }) + '&' + $.param({ 'ps': cs }) + '&' + $.param({ 'cs': sc });
    console.log(data);
    Case.addCase( data )
        .then(responseData => {
            console.log(responseData);
            switch (responseData["type"]) {
                case 'ERROR':
                    Messages.ShowErrorMessage(responseData["msg"]);
                break;
                case 'SUCCESS':
                    Messages.ShowSuccessMessage(responseData["msg"]);
                    HTML.renderCaseLabel(cs, sc);
                    Case.getCases()
                        .then(responseData => {
                            let pcs = responseData;
                            HTML.renderCasePicker(pcs, cs, sc);
                        })
                        .catch(error =>{ console.log(error); });
                        
                    if(action == 'saveCase'){
                        $("#scenarioname").prop('disabled', true);
                        EDIT.show();
                        ADD.show();
                        SUBMIT.hide();
                    }
                    else{
                        $('#casenameHidden').val(cs);
                    }
                break;
                case 'WARNING':
                    Messages.ShowWarningMessage(responseData["msg"]);
                break;
            }
        })
        .catch(error => {
            let responseData = error;
            Messages.ShowErrorMessage(responseData);
        });


 });

END_YEAR.keyup(function() {
    var start = $( "#startYear" ).val();
    var end = $( "#endYear" ).val();
    if(start !=='' && (end-start) >= 0 && start <= 2050 && start >= 2000 && end <= 2050 && end >= 2000){
        var container = $('<div />');
        for(var i = start; i <= end; i++) {
            container.append('<div class="funkyradio years" name="test"><div class="funkyradio-default"><input type="checkbox" name="Year['+i+']" id="'+i+'" checked/><label for="'+i+'">'+i+'</label></div></div>');
        }
        $('#yearsselect').html(container);
        $("#btngroup").css('display', 'block');
        CHECK_ALL.css('display', 'none');
        UNCHECK_ALL.css('display', 'block');
        CASE.jqxValidator('validateInput', '#yearsselect');
    }
    else{
        $('#yearsselect').empty();
        $("#btngroup").css('display', 'none');
        CASE.jqxValidator('validateInput', '#endYear');
        CASE.jqxValidator('validateInput', '#startYear');
    }
});

START_YEAR.keyup(function() {
    var start = $( "#startYear" ).val();
    var end = $( "#endYear" ).val();
    if(start !== '' && end !=='' && (end-start) >=0 && start <= 2050 && start >= 2000 && end <= 2050 && end >= 2000){
        var container = $('<div />');
        for(var i = start; i <= end; i++) {
            container.append('<div class="funkyradio years" name="test"><div class="funkyradio-default"><input type="checkbox" name="Year['+i+']" id="'+i+'" checked/><label for="'+i+'">'+i+'</label></div></div>');
        }
        $('#yearsselect').html(container);
        $("#btngroup").css('display', 'block');
        CHECK_ALL.css('display', 'none');
        UNCHECK_ALL.css('display', 'block');
        CASE.jqxValidator('validateInput', '#yearsselect');
    }
    else{
        $('#yearsselect').empty();
        $("#btngroup").css('display', 'none');
        CASE.jqxValidator('validateInput', '#endYear');
        CASE.jqxValidator('validateInput', '#startYear');
    }
});

CHECK_ALL.on('click', function (event) {
    event.preventDefault();
    var elements = $('#yearsselect').find('input[type=checkbox]');
    var result = $.grep(elements, function(element, index) {
        element.checked=true;
    });
    CHECK_ALL.css('display', 'none');
    UNCHECK_ALL.css('display', 'block');
    CASE.jqxValidator('validateInput', '#yearsselect');
});

UNCHECK_ALL.on('click', function (event) {
    event.preventDefault();
    var elements = $('#yearsselect').find('input[type=checkbox]');
    var result = $.grep(elements, function(element, index) {
            element.checked=false;
    });
    UNCHECK_ALL.css('display', 'none');
    CHECK_ALL.css('display', 'block');
    CASE.jqxValidator('validateInput', '#yearsselect');
});

CHECK_2X.on('click', function (event) {
    event.preventDefault();
    var elements = $('#yearsselect').find('input[type=checkbox]');
    var result = $.grep(elements, function(element, index) {
        if((index) % 2 == 0)
        element.checked=true;
    });
    CASE.jqxValidator('validateInput', '#yearsselect');
});

CHECK_5X.on('click', function (event) {
    event.preventDefault();
    var elements = $('#yearsselect').find('input[type=checkbox]');
    var result = $.grep(elements, function(element, index) {
        if((index) % 5 == 0)
        element.checked=true;
    });
    $('#case').jqxValidator('validateInput', '#yearsselect');
});

TYPE_SIMULATION.change(function() {
    if (this.value == 'T1') {
        $('#Sector').addClass("disabledbutton");
        $('#Commodity').addClass("disabledbutton");
    }
    else if (this.value == 'T2') {
        $('#Sector').removeClass("disabledbutton");
        $('#Commodity').removeClass("disabledbutton");
    }
});
