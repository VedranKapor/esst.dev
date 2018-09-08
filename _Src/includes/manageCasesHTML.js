export class ManageCasesHTML {
    static renderCases(ps){
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
        if(typeof cs != 'undefined' && cs ){
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

    // static selectCase(pCase, pScenario) {
    //     $("#cases").removeClass('in');
    //     $("#cases").removeClass('glyphicon-ok').addClass("glyphicon-remove");;

    //     $("#collapse_" + pCase.replace(/[^A-Z0-9]/ig, "")).addClass('in');
    //     $("#collapse_" + pCase.replace(/[^A-Z0-9]/ig, ""))
    //         .parent()
    //         .find(".glyphicon-chevron-right")
    //         .removeClass("glyphicon-chevron-right")
    //         .addClass("glyphicon-chevron-down");

    //     $('*[data-cs="'+ pScenario +'"]')
    //         .parent()
    //         .find(".glyphicon-remove")
    //         .removeClass("glyphicon-remove")
    //         .addClass("glyphicon-ok");
    //     return true;
    // }
}
