export class UsersHTML {
    static renederUsers(uss) {
        var htmlarr = [];
        $("#esstUsers").empty();
        $.each(uss, function (index, value) {
            if( value['usergroup'] != 'admin'){
                let htmlstring = "";
                htmlstring += '<div class="panel panel-default">' +
                    '<div class="panel-heading" style="padding-right: 0px !important;">' +
                        '<table style="width: 100%;">' +
                            '<tr>' +
                                '<td>' +
                                    '<b><a data-toggle="collapse" class="pstitle" data-ps="'+ value['username'] +'" style="display:block; width:100%" ">' +
                                    '<i class="ace-icon fa fa-user-circle-o bigger-130"></i>' + value['username'] + '</a></b>' +
                                '</td>' +
                                '<td style="width:40px; text-align:center">'+
                                    '<span data-toggle="modal" data-target="#changePassModal" class="open-changePassModal" data-us="'+ value['username'] +'">'+
                                    '<span class="userModal" data-toggle="tooltip" data-placement="top" title="Change Password">'+
                                    '<i class="ace-icon fa fa-pencil text-info icon-btn bigger-150">'+
                                    '</span>'+
                                    '</span>' +
                                '</td>'+
                                '<td style="width:40px; text-align:center"> ' +
                                    '<span data-toggle="tooltip" data-placement="top" class="deleteUser" title="Delete user" data-us="'+ value['username'] +'">' +
                                    '<i class="ace-icon fa fa-trash-o text-danger icon-btn bigger-150">'+   
                                    '</span>' +
                                '</td>' +
                            '</tr>' +
                        '</table>' +
                    '</div>'+
                '</div>';
                htmlarr.push(htmlstring);
            }
        })
        $("#esstUsers").html(htmlarr.join(""));
        return true;
    }
}