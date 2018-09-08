import { Auth } from 'Classes/js/Auth.Class.js';
import { App } from 'Classes/js/App.Class.js';
import { CaseData } from 'Classes/js/CaseData.Class.js';
import { HTML } from 'Classes/js/GenerateHTML.Class.js';
import { Grid } from 'Classes/js/Grid.Class.js';
import { Chart } from 'Classes/js/Chart.Class.js';
import { Messages } from 'Classes/js/Messages.Class.js';
import { CHART_TYPE } from 'Classes/js/const.js';
import { Loader } from '../../Classes/js/Messages.Class';

HTML.renderNavPills("visible", "visible", "hidden", "Data Entry", 'Demand Data', "");

let cs;
let sc;
let us;
let years;
let fuels;
let sectors;
let sourceChild;
let daChild;
let sectorID;
let sector;


Auth.getAccess()
    .then(responseData => {
        App.getSession()
            .then(session => {
                if(typeof session.cs != 'undefined' && session.cs){
                    CaseData.getGenData(session.cs)
                        .then(genData => {
                            cs = session.cs;
                            sc = session.sc;
                            us = session.us;
                            //let csURL = 'Storage/' + us + '/' + cs + '/';
                            let scURL = 'Storage/' + us + '/' + cs + '/' + sc + '/';

                            years = genData['Year'];
                            //fuels = genData['Commodity'];
                            sectors = genData['Sector'];
                            //let kol = years.length;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////SOURCE
                            let sourceParent =
                            {
                                url: scURL + 'FEDSectors.json',
                                datatype: 'json',
                                cache: false,
                                async: true,
                            };

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////GRID PARENT
                            var daParent = new $.jqx.dataAdapter(sourceParent);
                            let columnConfig =   {
                                aggregates: ['sum'],
                                aggregatesrenderer: Grid.aggregatesrenderer,
                                validation: Grid.validation,
                                cellsrenderer: Grid.cellsrenderer
                            };
                            let gridSettings = Grid.gridSetting(daParent, 'bootstrap', years, 'PJ', 'Sector', columnConfig);
                            $("#jqxgrid").jqxGrid( gridSettings );

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////SOURCE CHIOLD
                            sourceChild =
                            {
                                url: scURL + 'FEDFuelShares.json',
                                datatype: 'json',
                                cache: false,
                                async: true,
                            };
                        })
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////GRID CHILD
                    $('#jqxgrid').on('bindingcomplete', function (event) {
                        sectorID = 0;
                        sector = $('#jqxgrid').jqxGrid('getcellvalue', sectorID, "Sector");
                        daChild = new $.jqx.dataAdapter(sourceChild, {
                            async: true,
                            autoBind: true,
                            beforeLoadComplete: function (records) {
                                var data = new Array();
                                var length = records.length;
                                for (var i = 0; i < length; i++) {
                                    var record = records[i];
                                    if (record.Sector == sector) {
                                        data = record.Share.Commodity;
                                    }
                                }
                                return data;
                            },
                            loadError: function (xhr, status, error) { alert('Error loading "' + source.url + '" : ' + error); }
                        });
                        let columnConfigShares =   {
                            aggregates: ['sum'],
                            aggregatesrenderer: Grid.aggregatesrenderer100,
                            validation: Grid.validation,
                            cellsrenderer: Grid.cellsrenderer
                        };
                        let gridSettingsShares = Grid.gridSetting(daChild, 'bootstrap', years, '%', 'Fuel', columnConfigShares);
                        $("#jqxgridShares").jqxGrid( gridSettingsShares );
                        $('#jqxgridShares').on('bindingcomplete', function (event) {
                            $('#saveShares').data('sector', sector);
                            $('#saveShares').data('sectorID', sectorID);
                            $('#sharesTitle').html('Final energy demand commodity shares for <b class="danger">'+ sector+'</b>')
                            $('#childBox').show();
                            //$('#jqxgrid').jqxGrid('selectcell',  sectorID, "Sector");
                        });
                    });
                }
                else{
                    Messages.ShowWarningMessage('Please select scenario');
                }
            })
            .catch(error =>{ Messages.ShowErrorMessage(error);});
     })
    .catch(error =>{ window.location = 'index.html'; });


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////GRID CHILD
    $("#jqxgrid").on('cellselect', function (event) {
    //$(document).delegate("#jqxgrid", "cellselect", function (event) {
        if(event.args.datafield == 'Sector'){
            sectorID =  event.args.rowindex;
            sector = $('#jqxgrid').jqxGrid('getcellvalue', sectorID, "Sector");
            daChild = new $.jqx.dataAdapter(sourceChild,{
                async: true,
                autoBind: true,
                beforeLoadComplete: function (records) {
                    var data = new Array();
                    var length = daChild.records.length;
                    for (var i = 0; i < length; i++) {
                        var record = records[i];
                        if (record.Sector == sector) {
                            data = record.Share.Commodity;
                        }
                    }
                    return data;
                },
                loadError: function (xhr, status, error) { alert('Error loading "' + source.url + '" : ' + error); }
            });
            //$("#jqxgridShares").jqxGrid(Grid.gridSource(daChild));
            $("#jqxgridShares").jqxGrid({ source: daChild });
            $("#jqxgridShares").jqxGrid('refresh');
                $('#saveShares').data('sector', sector);
                $('#saveShares').data('sectorID', sectorID);
                $('#sharesTitle').html('Final energy demand commodity shares for <b class="danger">'+ sector+'</b>');
        }
    });



    function initDashboard() {
        var rows = $('#jqxgrid').jqxGrid('getrows');
        var daFEDchart = new $.jqx.dataAdapter(rows, {
            async: true,
            autoBind: true,
            beforeLoadComplete: function (records) {
                var sampleData = [];
                $.each(years, function (key, year) {
                    var sampleLength = Object.keys(records).length;
                    var data = new Object();
                    data['Year'] = year;
                    for (var i = 0; i < sampleLength; i++) {
                        data[records[i].Sector] = records[i][year];
                    }
                    sampleData.push(data);
                });
                return sampleData;
            },
            loadError: function (xhr, status, error) { alert('Error loading "' + source.url + '" : ' + error); }
        });
        let chartSetting = Chart.chartSetting(daFEDchart, 'bootstrap', sectors);
        $('#jqxchart').jqxChart(chartSetting);
    }

    $('#dashboardModal').on('shown.bs.modal', function (e) {
        initDashboard();
    });

    $(".switchChart").on('click', function (e) {
        e.preventDefault();
        var chartType = $(this).attr('data-chartType');
        $('.widget-toolbar a').removeClass('green').addClass('grey');
        $('#'+chartType).removeClass('grey').addClass('green');
        var graf = $('#jqxchart').jqxChart('getInstance');
        graf.seriesGroups[0].type = CHART_TYPE[chartType];
        graf.update();
    });

    $("#saveFED").on('click', function (e) {
        e.preventDefault();
        Loader.On();
        App.getSession()
            .then(session => {
                CaseData.getGenData(session.cs)
                .then(genData => {
                    saveFED(genData, session.cs, session.sc);
                    Loader.Off();
                })
            })
            .catch(error =>{ Messages.ShowErrorMessage(error); });
    });

    $("#saveShares").on('click', function (e) {
        e.preventDefault();
        App.getSession()
            .then(session => {
                CaseData.getGenData(session.cs)
                .then(genData => {
                    saveShares(genData, session.cs, session.sc);
                })
            })
            .catch(error =>{ Messages.ShowErrorMessage(error); });
    });

    // $("#syncChart").on('click', function (e) {
    //     e.preventDefault();
    //     App.getSession()
    //         .then(session => {
    //             CaseData.getGenData(session.cs)
    //             .then(genData => {
    //                 renderMainChart(genData.Year);
    //             })
    //         })
    //         .catch(error =>{ Messages.ShowErrorMessage(error); });
    //     $('#syncChart').hide();
    // });

$("#xlsMainGrid").click(function () {
    $("#jqxgrid").jqxGrid('exportdata', 'xls', 'Final Energy Demand by Sectors');
});

$("#invokeAggregates").on('click', function () {
    $("#jqxgrid").jqxGrid({ showaggregates: true, showstatusbar: true });
    $('#jqxgrid').jqxGrid('refreshaggregates');
    $('#jqxgrid').jqxGrid('renderaggregates');
});

$("#invokeAggregatesChild").on('click', function () {
    $("#jqxgridShares").jqxGrid({ showaggregates: true, showstatusbar: true });
    $('#jqxgridShares').jqxGrid('refreshaggregates');
    $('#jqxgridShares').jqxGrid('renderaggregates');
});

$("#decUpNested").on('click', function(e){
    // console.log(Grid.decimal.substr(1));
    // console.log(parseInt(Grid.decimal.substr(1)));
    //  e.preventDefault();


    //  console.log(Grid.decimal.substr(1));
    // decimalPlace++;
     let decimal = parseInt(Grid.decimal.substr(1)) + 1;
     decimal = 'd' +  decimal;
     console.log(decimal);
     Grid.decimal = decimal;
     $('#jqxgrid').jqxGrid('render');
});
$("#decDownNested").on('click', function(e){
    // e.preventDefault();
    // decimalPlace--;
    // decimal = 'd' + parseInt(decimalPlace);
    // $('#jqxgrid').jqxGrid('render');
console.log('down');
    let decimal = parseInt(Grid.decimal.substr(1)) - 1;
    decimal = 'd' +  decimal;
    console.log(decimal);
    Grid.decimal = decimal;
    $('#jqxgrid').jqxGrid('render');
});

let pasteEvent = true;
$('#jqxgrid').bind('keydown', function (event) {
    pasteEvent = false;
    var ctrlDown = false, ctrlKey = 17, cmdKey = 91, vKey = 86, cKey = 67;
    var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
    if (key == vKey) {
        $("#jqxgrid").jqxGrid({ showaggregates: false, showstatusbar: false });
        pasteEvent = true;
        $("#msgPg").text("Demand has been changed from clipboard data.").removeClass("jqx-validator-success-label").addClass("jqx-validator-info-label").show();
    }
}).on('cellvaluechanged', function (event) {
    if (!pasteEvent) {
        $("#msgPg").text("Demand has been changed.").removeClass("jqx-validator-success-label").addClass("jqx-validator-info-label").show();
    }
});

let pasteEventChild= true;
$('#jqxgridShares').bind('keydown', function (event) {
    pasteEventChild = false;
    var ctrlDown = false, ctrlKey = 17, cmdKey = 91, vKey = 86, cKey = 67;
    var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
    if (key == vKey) {
        $("#jqxgridShares").jqxGrid({ showaggregates: false, showstatusbar: false });
        pasteEventChild = true;
        $("#msgCg").text("Demand has been changed from clipboard data.").removeClass("jqx-validator-success-label").addClass("jqx-validator-info-label").show();
    }
}).on('cellvaluechanged', function (event) {
    if (!pasteEventChild) {
        $("#msgCg").text("Demand has been changed.").removeClass("jqx-validator-success-label").addClass("jqx-validator-info-label").show();
    }
});

function saveFED(genData, cs, sc) {
    let objList = [];
    let rows = $("#jqxgrid").jqxGrid('getrows');
    let years = genData['Year'];
    let sectors = genData['Sector'];
    for (var i = 0; i < rows.length; i++) {
        var data = new Object();
        $.each(years, function (key, value) {
            var year = value;
            data[year] = parseFloat(rows[i][year]);
        });
        data['Sector'] = sectors[i];
        objList.push(data);
    }
    let errorType = Grid.checkGridInputs(rows, years, 'Sector')
    if (Object.keys(errorType).length === 0) {
        var myJsonString = JSON.stringify(objList);
        CaseData.saveFED(myJsonString, cs, sc)
            .then(responseData => {
                Messages.ShowInfoMessage(responseData["msg"]);
                $("#msgPg").html("Data have been saved.").removeClass("jqx-validator-info-label").addClass("jqx-validator-success-label").show();
                $('#msgPgError').hide();
            })
            .catch(error => { Messages.ShowErrorMessage(error); });
    }
    else {
        Grid.showErrorTypeParent(errorType,  'msgPgError', 'Sector');
    }
}

function saveShares(genData, cs, sc) {
    let objList = [];
    let sector = $('#saveShares').data('sector'); //getter
    let sectorID = $('#saveShares').data('sectorID');
    let rows = $("#jqxgridShares").jqxGrid('getrows');
    let grid = $("#jqxgridShares");
    let years = genData['Year'];
    let fuels = genData['Commodity'];
    for (var i = 0; i < rows.length; i++) {
        var data = new Object();
        $.each(years, function (key, value) {
            var year = value;
            data[year] = parseFloat(rows[i][year]);
        });
        data['Fuel'] = fuels[i];
        objList.push(data);
    }
    let decimalPlace = Grid.decimal.slice(-1);
    let errorType = Grid.checkGridInputs(rows, years, 'Fuel');
    let sums = Grid.checkSums(grid, years, decimalPlace);

    if (Object.keys(errorType).length === 0 && Object.keys(sums).length === 0) {
        var myJsonString = JSON.stringify(objList);
        CaseData.saveShares(myJsonString, sectorID,  cs, sc)
            .then(responseData => {
                Messages.ShowInfoMessage(responseData["msg"]);
                $("#msgCg").html("Data have been saved.").removeClass("jqx-validator-info-label").addClass("jqx-validator-success-label").show();
                $('#msgCgError').hide();
            })
            .catch(error => { Messages.ShowErrorMessage(error); });
    }
    else {
        if (Object.keys(errorType).length !== 0) {
            Grid.showErrorTypeParent(errorType, 'msgCgError', 'Fuel');
        }else if (Object.keys(sums).length !== 0){
            Grid.showErrorTypeParent(sums, 'msgCgError', 'Sum');
        }
    }
}

// function renderMainChart(years) {
//     var graf = $('#jqxchart').jqxChart('getInstance');
//     var rows = $('#jqxgrid').jqxGrid('getrows');
//     var sampleData = [];
//     $.each(years, function (key, year) {
//         var sampleLength = Object.keys(rows).length;
//         var data = new Object();
//         data['Year'] = year;
//         for (var i = 0; i < sampleLength; i++) {
//             data[rows[i].Sector] = rows[i][year];
//         }
//         sampleData.push(data);
//     });
//     graf.source = sampleData;
//     graf.update();
// }





