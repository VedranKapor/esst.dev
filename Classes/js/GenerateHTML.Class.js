import { CURRENCY, UNITS, SECTOR, COMMODITY, TECHNOLOGY } from 'Classes/js/const.js';

export class HTML {
    static renderNavPills(l1Status, l2Status, l3Status, l1Label, l2Label,l3Label){
        // $("#l1").css("visibility", "hidden");
        // $("#l2").css("visibility", "hidden");
        // $("#l3").css("visibility", "hidden");

        $("#l1").css("visibility", l1Status);
        $("#l1").html('<i class="ace-icon fa fa-folder-open-o home-icon"></i><span lang="en">'+ l1Label +'</span>');
        $("#l1").addClass('active');
    
        $("#l2").css("visibility", l2Status);
        $("#l2").html(l2Label);
        $("#l2").addClass('active');

        $("#l3").css("visibility", l3Status);
        $("#l3").html(l3Label);
        $("#l3").addClass('active');
        return true;
    }

    static renederUsers(uss) {
        var htmlarr = [];
        $("#esstUsers").empty();
        $.each(uss, function (index, value) {
            if (value['usergroup'] != 'admin') {
                let htmlstring = "";
                htmlstring += '<div class="panel panel-default">' +
                    '<div class="panel-heading" style="padding-right: 0px !important;">' +
                    '<table style="width: 100%;">' +
                    '<tr>' +
                    '<td>' +
                    '<b><a data-toggle="collapse" class="pstitle" data-ps="' + value['username'] + '" style="display:block; width:100%" ">' +
                    '<i class="ace-icon fa fa-user-circle-o bigger-130"></i>' + value['username'] + '</a></b>' +
                    '</td>' +
                    '<td style="width:40px; text-align:center">' +
                    '<span data-toggle="modal" data-target="#changePassModal" class="open-changePassModal" data-us="' + value['username'] + '">' +
                    '<span class="userModal" data-toggle="tooltip" data-placement="top" title="Change Password">' +
                    '<i class="ace-icon fa fa-pencil text-info icon-btn bigger-150">' +
                    '</span>' +
                    '</span>' +
                    '</td>' +
                    '<td style="width:40px; text-align:center"> ' +
                    '<span data-toggle="tooltip" data-placement="top" class="deleteUser" title="Delete user" data-us="' + value['username'] + '">' +
                    '<i class="ace-icon fa fa-trash-o text-danger icon-btn bigger-150">' +
                    '</span>' +
                    '</td>' +
                    '</tr>' +
                    '</table>' +
                    '</div>' +
                    '</div>';
                htmlarr.push(htmlstring);
            }
        })
        $("#esstUsers").html(htmlarr.join(""));
        return true;
    }


    static renderAddCaseEmpty() {
        $('#Submit').show();
        $('#casename').val('');
        $('#scenarioname').val('');
        $('#description').val('');
        $('#yearsselect').empty();
        $('#startYear').val('');
        $('#endYear').val('');

        $("#scenarioname").prop('disabled', false);

        var container = $('<div />');
        $.each(SECTOR, function (key, value) {
            container.append('<div class="funkyradio"><div class="funkyradio-default"><input type="checkbox" name="Sector[' + value + ']" id="sector' + value + '" checked/><label for="sector' + value + '"  lang="en">' + value + '</label></div></div>');
        });
        $('#Sector').html(container);


        var container = $('<div />');
        $.each(COMMODITY, function (key, value) {
            container.append('<div class="funkyradio"><div class="funkyradio-default"><input type="checkbox" name="Commodity[' + value + ']" id="commodity' + value + '" checked/><label for="commodity' + value + '"  lang="en">' + value + '</label></div></div>');
        });
        $('#Commodity').html(container);


        var container = $('<div />');
        $.each(TECHNOLOGY, function (key, value) {
            container.append('<div class="funkyradio"><div class="funkyradio-default"><input type="checkbox" name="Technology[' + value + ']" id="technology' + value + '" checked/><label for="technology' + value + '"  lang="en">' + value + '</label></div></div>');
        });
        $('#Technology').html(container);


        var container = $('<select  class="form-control" name="Currency"/>');
        $.each(CURRENCY, function (key, value) {
            if (value == "EUR")
                container.append('<option value="' + value + '" selected name="currency' + value + '" id="' + value + '">' + value + '</option>');
            else
                container.append('<option value="' + value + '" id="' + value + '">' + value + '</option>');
        });
        $('#Currency').html(container);


        var container = $('<select  class="form-control" name="Unit"/>');
        $.each(UNITS, function (key, value) {
            container.append('<option value="' + value + '" id="' + value + '">' + value + '</option>');
        });
        $('#Unit').html(container);

        $("#datepicker").jqxDateTimeInput({ width: '100%', height: '30px', });
    }

    static renderAddCase(genData, sc) {
        $('#Submit').hide();
        $('#NewCS').show();
        $('#Edit').show();
        $('#casename').val(genData.General.Casename);
        $('#casenameHidden').val(genData.General.Casename);
        $('#scenarioname').val(sc);
        $("#scenarioname").prop('disabled', true);
        $('#description').val(genData.General.Description);

        $('input:radio[id=' + genData.General.Type + ']').prop('checked', true);

        if (genData.General.Type == 'T1') {
            $('#Sector').addClass("disabledbutton");
            $('#Commodity').addClass("disabledbutton");
        }

        var container = $('<div />');
        $.each(SECTOR, function (key, value) {
            if (genData.Sector.indexOf(value) != -1) {
                container.append('<div class="funkyradio"><div class="funkyradio-default"><input type="checkbox" name="Sector[' + value + ']" id="sector' + value + '" checked/><label for="sector' + value + '"  lang="en">' + value + '</label></div></div>');
            }
            else {
                container.append('<div class="funkyradio"><div class="funkyradio-default"><input type="checkbox" name="Sector[' + value + ']" id="sector' + value + '"/><label for="sector' + value + '"  lang="en">' + value + '</label></div></div>');
            }
        });
        $('#Sector').html(container);

        var container = $('<div />');
        $.each(COMMODITY, function (key, value) {
            if (genData.Commodity.indexOf(value) != -1) {
                container.append('<div class="funkyradio" name="test"><div class="funkyradio-default"><input type="checkbox" name="Commodity[' + value + ']" id="commodity' + value + '" checked/><label for="commodity' + value + '"  lang="en">' + value + '</label></div></div>');
            }
            else {
                container.append('<div class="funkyradio" name="test"><div class="funkyradio-default"><input type="checkbox" name="Commodity[' + value + ']" id="commodity' + value + '"/><label for="commodity' + value + '"  lang="en">' + value + '</label></div></div>');
            }
        });
        $('#Commodity').html(container);

        var container = $('<div />');
        $.each(TECHNOLOGY, function (key, value) {
            if (genData.Technology.indexOf(value) != -1) {
                container.append('<div class="funkyradio" name="test"><div class="funkyradio-default"><input type="checkbox" name="Technology[' + value + ']" id="technology' + value + '" checked/><label for="technology' + value + '"  lang="en">' + value + '</label></div></div>');
            }
            else {
                container.append('<div class="funkyradio" name="test"><div class="funkyradio-default"><input type="checkbox" name="Technology[' + value + ']" id="technology' + value + '"/><label for="technology' + value + '"  lang="en">' + value + '</label></div></div>');
            }
        });
        $('#Technology').html(container);

        var container = $('<select  class="form-control" name="Currency"/>');
        $.each(CURRENCY, function (key, value) {
            if (value == genData.General.Currency)
                container.append('<option value="' + value + '" selected name="currency' + value + '" id="' + value + '">' + value + '</option>');
            else
                container.append('<option value="' + value + '" id="' + value + '">' + value + '</option>');
        });
        $('#Currency').html(container);

        var container = $('<select  class="form-control" name="Unit"/>');
        $.each(UNITS, function (key, value) {
            if (value == genData.General.Unit) {
                container.append('<option value="' + value + '" selected id="' + value + '">' + value + '</option>');
            }
            else {
                container.append('<option value="' + value + '" id="' + value + '">' + value + '</option>');
            }

        });
        $('#Unit').html(container);

        $('#startYear').val(2000);
        $('#endYear').val(2050);

        var container = $('<div />');
        for (let i = 2000; i <= 2050; i++) {
            if (genData.Year.indexOf(i) != -1) {
                container.append('<div class="funkyradio years"><div class="funkyradio-default"><input type="checkbox" name="Year[' + i + ']" id="' + i + '" checked/><label for="' + i + '">' + i + '</label></div></div>');
            }
            else {
                container.append('<div class="funkyradio years"><div class="funkyradio-default"><input type="checkbox" name="Year[' + i + ']" id="' + i + '" /><label for="' + i + '">' + i + '</label></div></div>');
            }
        }
        $('#yearsselect').html(container);
        $("#btngroup").css('display', 'block');
        $("#checkall").css('display', 'none');
        $("#uncheckall").css('display', 'block');

        $("#datepicker").jqxDateTimeInput({ width: '100%', height: '30px', });
    }

    static renderCases(ps) {
        let htmlarr = [];
        $.each(ps, function (index, value) {
            let htmlstring = "";
            htmlstring += '<div class="panel panel-default">' +
                '<div class="panel-heading" style="padding-right: 0px !important;">' +
                '<table style="width: 100%;">' +
                '<tr>' +
                '<td>' +
                '<b><a data-toggle="collapse" class="pstitle text-default" style="display:block; width:100%" data-parent="#cases" id="psid_' + value['title'] + '" href="#collapse_' + value['title'].replace(/[^A-Z0-9]/ig, "") + '">' +
                '<span class="glyphicon glyphicon-chevron-right text-default"></span>' + value['title'] + '</a></b>' +
                '</td>' +
                '<td style="width:40px; text-align:center">' +
                '<span data-toggle="modal" data-target="#newCaseModal" class="open-newCaseModal" data-cs="' + value['title'] + '"  title="Create new scenario">' +
                // '<span data-toggle="tooltip" data-placement="top" >' +
                '<span class="glyphicon glyphicon-plus text-default icon-btn"></span>' +
                '</span>' +
                // '</span>' +
                '</td>' +
                '<td style="width:150px; text-align:left"><small class="text-muted"> Number of scenarios: <b><span class="text-default">' + value['ncs'] + '</span></b></small></td>' +

                '<td style="width:40px; text-align:center">' +
                '<span data-toggle="modal" data-target="#modaldescriptionps">' +
                '<span class="descriptionPS" data-ps="' + value['title'] + '" data-toggle="tooltip" data-placement="top" title="Description">' +
                '<span class="glyphicon glyphicon-info-sign text-info icon-btn"></span>' +
                '</span>' +
                '</span>' +
                '</td>' +
                '<td style="width:40px; text-align:center">' +
                '<span data-toggle="modal" data-target="#modaleditps">' +
                '<span class="editPS" data-ps="' + value['title'] + '" data-toggle="tooltip" data-placement="top" title="Edit">' +
                '<span class="glyphicon glyphicon-edit text-default icon-btn"></span>' +
                '</span>' +
                '</span>' +
                '</td>' +
                '<td style="width:40px; text-align:center">' +
                '<span class="backupCS" data-ps="' + value['title'] + '"' +
                'data-toggle="tooltip" data-placement="top" title="Backup case study" >' +
                '<span class="glyphicon glyphicon-download-alt text-default icon-btn"></span>' +
                '</span>' +
                '</td>' +

                '<td style="width:40px; text-align:center">' +
                '<span class="copyPS" data-ps="' + value['title'] + '"' + 'id="copy_' + value['title'] + '"  data-toggle="tooltip" data-placement="top" title="Copy case study" >' +
                '<span class="glyphicon glyphicon-duplicate text-default icon-btn"></span>' +
                '</span>' +
                '</td>' +
                '<td style="width:40px; text-align:center"> ' +
                '<span>' +
                '<span class="deletePS" data-ps="' + value['title'] + '"' + 'id="copy_' + value['title'] + '"  data-toggle="tooltip" data-placement="top" title="Copy case study" >' +
                //'<span data-toggle="tooltip" data-placement="top" title="Delete planning study" onclick="DeletePS(\'' + value['title'] + '\',' + value['ncs'] + ')">' +
                '<span  class="glyphicon glyphicon-trash text-danger icon-btn"></span>' +
                '</span>' +
                '</span>' +
                '</td>' +

                '</tr>' +
                '</table>' +
                '</div>' +
                '<div id="collapse_' + value['title'].replace(/[^A-Z0-9]/ig, "") + '" class="panel-collapse collapse">' +
                '<div class="panel-body" style="border: 0 !important;">' +
                '<table class="table table-hover" style="width: 100%;">';
            $.each(value['cs'], function (index, valuecs) {
                htmlstring += '<tr>' +
                    '<td style="width: 30px;"></td>' +
                    '<td>' +
                    '<span class="glyphicon glyphicon-remove danger text-default"></span>' +
                    '<a  class="begincs text-default" data-ps="' + value['title'] + '" data-cs="' + valuecs['title'] + '">' + valuecs['title'] + '</a>' +
                    '</td>' +
                    '<td style="width:40px; text-align:center">' +
                    '<span data-toggle="modal" data-target="#modaleditcs">' +
                    '<span class="editCS" data-cs="' + valuecs['title'] + '" data-ps="' + value['title'] + '" data-toggle="tooltip" data-placement="top" title="Edit scenario">' +
                    '<span class="glyphicon glyphicon-edit text-default icon-btn"></span>' +
                    '</span>' +
                    '</span>' +
                    '</td>' +
                    '<td style="width:40px; text-align:center">' +
                    '<span data-toggle="modal" data-target="#modalcopy">' +
                    '<span class="copyCS" data-ps="' + value['title'] + '"' + ' data-cs="' + valuecs['title'] + '"' + 'id="copy_' + value['title'] + '"  data-toggle="tooltip" data-placement="top" title="Copy case study" >' +
                    '<span class="glyphicon glyphicon-duplicate text-default icon-btn"></span>' +
                    '</span>' +
                    '</span>' +
                    '</td>' +
                    '<td style="width:40px; text-align:center">' +
                    //'<span class="deletecs" data-toggle="tooltip" data-placement="top" title="Delete case study" onclick="DeleteCS(\'' + value['title'] + '\',\'' + valuecs['title'] + '\')">' +
                    '<span class="deleteCS" data-ps="' + value['title'] + '"' + ' data-cs="' + valuecs['title'] + '"' + 'id="copy_' + value['title'] + '"  data-toggle="tooltip" data-placement="top" title="Copy case study" >' +
                    '<span  class="glyphicon glyphicon-trash text-danger icon-btn"></span>' +
                    '</span>' +
                    '</td>' +
                    '</tr>';
            })
            htmlstring += '</table>' +
                '</div>' +
                '</div>' +
                '</div>';
            htmlarr.push(htmlstring);
        })
        $("#cases").html(htmlarr.join(""));
    }

    static setActive(cs, sc) {
        $('#cases').find(".in").removeClass("in");
        if (typeof cs != 'undefined' && cs) {
            $('#cases').find(".glyphicon-chevron-down").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-right");

            $("#collapse_" + cs.replace(/[^A-Z0-9]/ig, "")).addClass('in');
            $("#collapse_" + cs.replace(/[^A-Z0-9]/ig, ""))
                .parent()
                .find(".glyphicon-chevron-right")
                .removeClass("glyphicon-chevron-right")
                .addClass("glyphicon-chevron-down");

            $('#cases').find(".glyphicon-ok").removeClass("glyphicon-ok green").addClass("glyphicon-remove danger");
            $("#collapse_" + cs.replace(/[^A-Z0-9]/ig, "")).parent().find(`[data-cs='${sc}']`).parent().find(".glyphicon-remove").removeClass("glyphicon-remove danger").addClass("glyphicon-ok green");
        }
        return true;
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

        // const CASEPICKER_BTN = document.querySelectorAll('.casepicker');
        // Array.from(CASEPICKER_BTN).forEach(link => {
        //     link.addEventListener('click', this.selectCase);
        // });  
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

    // static selectCase() {
    //     let cs = $(this).attr('data-ps');
    //     let sc = $(this).attr('data-cs');

    //     let active = JSON.parse(localStorage.getItem("activePage"));
    //     if (active != undefined && active != "Home") {
    //         hasher.setHash("#");
    //         hasher.setHash("#"+active);
    //     }
    //     if(active != "ManageCases"){
    //         this.setActive(cs, sc);
    //     }
    //     App.setSession(cs, sc);
    //     App.renderCaseLabel(cs, sc);
    //     return true;
    // }

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