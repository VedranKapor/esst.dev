import { Auth } from 'Src/auth/auth.js';
import { App } from 'Src/app/app.js';
import { Messages, Loader } from 'Src/includes/messages.js';

HTML.renderNavPills("visible", "visible", "hidden", "Data Entry", 'Demand Data', "");

Auth.getAccess()
    .then(responseData => { })
    .catch(error =>{ window.location = 'index.html'; });

// function getGenData(cs) {
//     $.ajax({
//         url: "App/DataEntry/DataEntry.php",
//         data: { action: 'genData', cs: cs },
//         type: 'GET',
//         async: false,
//         success: function (result) {
//             serverResponce = JSON.parse(result);
//         },
//         error: function (xhr, status, error) {
//             ShowErrorMessage(error);
//         }
//     });
//     return serverResponce;
// }

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


function checkSectorInputs() {
    sectors = genData['Sectors'];
    var errorType = [];
    var rows = $("#jqxgrid").jqxGrid('getrows');
    for (var i = 0; i < rows.length; i++) {
        $.each(years, function (key, value) {
            var error = new Object();
            var year = value;
            if (rows[i][year] < 0) {
                error['Sector'] = sectors[i];
                error['Year'] = year;
                error['Value'] = rows[i][year];
                errorType.push(error);
            }
            if (!isNumber(rows[i][year])) {
                error['Sector'] = sectors[i];
                error['Year'] = year;
                error['Value'] = rows[i][year];
                errorType.push(error);
            }
        });
    }
    return errorType;
}

function showErrorTypeParent() {
    errorType = checkSectorInputs();
    $('#msgError').hide();
    if (Object.keys(errorType).length !== 0) {
        error = "";
        for(i=0; i<errorType.length; i++){
            error += '<i class="red">' + errorType[i].Sector + '</i> ' + '<i class="">' + errorType[i].Year + '</i>, ';
        }
        msg = 'Invalid values for: ' + error.trim().replace(/.$/,".") ;
        $('#msgError').html(msg).removeClass("jqx-validator-success-label").addClass("jqx-validator-error-label").show();
    }
}

function saveFED(genData) {
    var objList = [];
    var rows = $("#jqxgrid").jqxGrid('getrows');

    years = genData['Years'];

    session = $.parseJSON(getByAction("getSession"));
    cs = session.cs;
    sc = session.sc;

    for (var i = 0; i < rows.length; i++) {
        var data = new Object();
        $.each(years, function (key, value) {
            var year = value;
            data[year] = parseFloat(rows[i][year]);
        });
        data['sector'] = sectors[i];
        objList.push(data);
    }
    errorType = checkSectorInputs();
    if (Object.keys(errorType).length === 0) {
        var myJsonString = JSON.stringify(objList);
        $.ajax({
            type: "POST",
            url: "App/DataEntry/DataEntry.php?action=saveData&cs=" + cs + "&sc=" + sc,
            data: myJsonString,
            dataType: "json",
            success: function (result) {
                var serverResponce = result;
                switch (serverResponce["type"]) {
                    case 'ERROR':
                        ShowErrorMessage(serverResponce["msg"]);
                        break;
                    case 'SUCCESS':
                        ShowInfoMessage(serverResponce["msg"]);
                        $("#msgPg").text("Data have been saved.").removeClass("jqx-validator-info-label").addClass("jqx-validator-success-label").show();
                        $('#msgError').hide();
                        break;
                }
            },
            error: function (xhr, status, error) {
                ShowErrorMessage(error);
            }
        });
    }
    else {
        showErrorTypeParent(errorType);
    }
}

function renderMainChart() {
    var graf = $('#jqxchart').jqxChart('getInstance');
    var rows = $('#jqxgrid').jqxGrid('getrows');
    var sampleData = [];
    $.each(years, function (key, value) {
        var year = value;
        var sampleLength = Object.keys(rows).length;
        var data = new Object();
        data['year'] = year;
        for (var i = 0; i < sampleLength; i++) {
            data[rows[i].sector] = rows[i][year];
        }
        sampleData.push(data);
    });
    graf.source = sampleData;
    graf.update();
}





var columnsrenderer = function (key, value) {
    return '<div style="font-weight:bold; font-style:italic;  margin-left:5px;margin-top:5px; height:50px; word-wrap:normal;white-space:normal;">' + value + '</div>';
}

var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
    return '<div style="font-weight:bold; font-style:italic; margin-left:5px;margin-top:5px;">' + value + '</div>';
}

var cellsrendererDynamic = function (row, columnfield, value, defaulthtml, columnproperties) {
    //console.log(decimal);
    var formattedValue = $.jqx.dataFormat.formatnumber(value, decimal);
    return '<span style="margin: 4px; float:right; ">' + formattedValue + '</span>';
}

var cellsrendererValues = function (row, columnfield, value, defaulthtml, columnproperties) {
    var formattedValue = $.jqx.dataFormat.formatnumber(value, 'd3');
    return '<span style="margin: 4px; float:right; ">' + formattedValue + '</span>';
}

var aggregatesrenderer = function (aggregates, column, element, summaryData) {
    sum = aggregates['sum'].toFixed(3);
    return `<span style="margin-top: 8px; margin-right:3px; float: right;">` + sum + `</span>`;
}

var aggregatesrenderer100 = function (aggregates, column, element, summaryData) {
    let sum = parseFloat(aggregates['sum']);
    sum = aggregates['sum'];
    sum = sum.toFixed(decimalPlace);
    switch (true) {
        case (sum == 0):
            return result = `<span style="margin-top: 8px; margin-right:3px; float: right;">` + sum + `</span>`;
            break;
        case (sum == 100):
            return result = `<span  style="margin-top: 8px; margin-right:3px; float: right;"><i class="fa fa-check green" aria-hidden="true"></i>` + sum + `</span>`;
            break;
        case (sum < 100):
            return result = `<span  style="margin-top: 8px; margin-right:3px; float: right;"><i class="fa fa-exclamation-triangle warning" aria-hidden="true"></i>` + sum + `</span>`;
            break;
        case (sum > 100):
            return result = `<span  style="margin-top: 8px; margin-right:3px; float: right;"><i class="fa fa-exclamation-triangle fa-pulse red" aria-hidden="true"></i>` + sum+ `</span>`;
            break;
    }
}

var initeditor = function (row, cellvalue, editor) {
    //editor.jqxNumberInput({ decimalDigits: 2 });
    editor.jqxNumberInput({textAlign: 'center'});
}

var validation = function (cell, value) {
    if (value < 0) {
        return { result: false, message: 'Value should be positive number.' };
    }
    if(isNaN(value)){
        return { result: false, message: "Value is not valid number!" };
    }
    return true;
}

var validation100 = function (cell, value) {
    if (value < 0) {
        return { result: false, message: 'Value should be positive number!' };
    }
    else if (value > 100) {
        return { result: false, message: 'Value cannot be larger than 100!' };
    }
    return true;
}

var getSectorsSeries = function (sectors) {
    var sSectors = [];
    $.each(sectors, function (key, value) {
        var serija = {
            dataField: value,
            displayText: value,
            //fillColor: color_obj[value["sector"]],
        };
        sSectors.push(serija);
    });
    return sSectors;
}

var getFuelsSeries = function (fuels) {
    //console.log(fuels);
    var sFuels = [];
    $.each(fuels, function (key, value) {
        var serija = {
            dataField: value,
            displayText: value,
            fillColor: color_obj[value],
        };
        sFuels.push(serija);
    });
    return sFuels;
}

var getYearsColumns = function (years, kol) {
    var cYears = [];
    var width = 100 / (kol + 1);
    var kolone = {
        text: 'PJ',
        datafield: 'sector',
        width: width + '%',
        pinned: true,
        editable: false,
        minwidth: 120,
        //cellsrenderer: cellsrenderer
    };
    flag = true;
    cYears.push(kolone);
    $.each(years, function (key, value) {
        kolone = {
            text: value,
            datafield: value,
            width: width + '%',
            minwidth: 80,
            aggregates: ['sum'],
            cellsalign: 'right',
            align: 'right',
            //cellsformat: 'd2',
            //columntype: 'numberinput',
            aggregatesrenderer: aggregatesrenderer,
            //initeditor: initeditor,
            validation: validation,
            cellsrenderer: cellsrendererValues
            //renderer: columnsrenderer
        }
        cYears.push(kolone);
    });
    return cYears;
}

var getYearsColumns100 = function (years, kol) {
    var cYears100 = [];
    var width = 100 / (kol + 1);

    var kolone1 = {
        text: '%',
        datafield: 'fuel',
        width: width + '%',
        pinned: true,
        editable: false,
        minwidth: 90
    };

    cYears100.push(kolone1);
    $.each(years, function (key, value) {
        kolone = {
            text: value,
            datafield: value,
            width: width + '%',
            minwidth: 75,
            cellsalign: 'right',
            align: 'right',
            //cellsformat: 'p2',
            //columntype: 'numberinput',
            aggregates: ['sum'],
            aggregatesrenderer: aggregatesrenderer100,
            //initeditor: initeditor,
            cellsrenderer: cellsrendererDynamic,
            validation: validation100
        }
        cYears100.push(kolone);
    });
    return cYears100;
}

var getYearsColumnsTech = function (years, kol) {
    var cYears100 = [];
    var width = 100 / (kol + 1);

    var kolone1 = {
        text: '%',
        datafield: 'fuel',
        width: width + '%',
        pinned: true,
        editable: false,
        minwidth: 90
    };

    cYears100.push(kolone1);
    $.each(years, function (key, value) {
        kolone = {
            text: value,
            datafield: value,
            width: width + '%',
            minwidth: 55,
            cellsalign: 'right',
            align: 'right',
            cellsformat: 'd2',
           // aggregates: ['sum'],
           // aggregatesrenderer: aggregatesrenderer100
        }
        cYears100.push(kolone);
    });
    return cYears100;
}


$(document).ready(function () {
    pcas = JSON.parse(getByAction('getCases'));
    session = $.parseJSON(getByAction("getSession"));
    var theme = 'energyblue';

    $("#barChart").on('click', function (e) {
        e.preventDefault();
        $('.widget-toolbar a').removeClass('green').addClass('grey');
        $('#barChart').removeClass('grey').addClass('green');
        var graf = $('#jqxchart').jqxChart('getInstance');
        graf.seriesGroups[0].type = 'column';
        graf.update();
    });

    $("#lineChart").on('click', function (e) {
        e.preventDefault();
        $('.widget-toolbar a').removeClass('green').addClass('grey');
        $('#lineChart').removeClass('grey').addClass('green');
        var graf = $('#jqxchart').jqxChart('getInstance');
        graf.seriesGroups[0].type = 'spline';
        graf.update();
    });

    $("#areaChart").on('click', function (e) {
        e.preventDefault();
        $('.widget-toolbar a').removeClass('green').addClass('grey');
        $('#areaChart').removeClass('grey').addClass('green');
        var graf = $('#jqxchart').jqxChart('getInstance');
        graf.seriesGroups[0].type = 'stackedarea';
        graf.update();
    });

    $("#stackedChart").on('click', function (e) {
        e.preventDefault();
        $('.widget-toolbar a').removeClass('green').addClass('grey');
        $('#stackedChart').removeClass('grey').addClass('green');
        var graf = $('#jqxchart').jqxChart('getInstance');
        graf.seriesGroups[0].type = 'stackedcolumn';
        graf.update();
    });

    $("#saveFED").on('click', function (e) {
        e.preventDefault();
        genData = getGenData(session.cs);
        saveFED(genData);
    });

    $("#syncChart").on('click', function (e) {
        e.preventDefault();
        renderMainChart();
        showErrorTypeParent();
        // var records = $('#jqxgrid').jqxGrid('getrows');
        // errorType = checkSectorInputs();
        // renderValidationPopups(records, errorType, "Sector");
        $('#syncChart').hide();
    });

    $("#xlsMainGrid").click(function () {
        $("#jqxgrid").jqxGrid('exportdata', 'xls', 'Final Energy Demand by Sectors');
    });

    $("#invokeAggregates").on('click', function () {
        $("#jqxgrid").jqxGrid({ showaggregates: true, showstatusbar: true });
        $('#jqxgrid').jqxGrid('refreshaggregates');
        $('#jqxgrid').jqxGrid('renderaggregates');

    });

    let pasteEvent = false;
    let parentGrid = false;
    $('#jqxgrid').bind('keydown', function (event) {
        pasteEvent = false;
        parentGrid = true;
        var ctrlDown = false,
            ctrlKey = 17,
            cmdKey = 91,
            vKey = 86,
            cKey = 67;
        var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
        if (key == vKey) {
            $("#jqxgrid").jqxGrid({ showaggregates: false, showstatusbar: false });
            pasteEvent = true;
        }
    }).on('cellvaluechanged', function (event) {
        if (!pasteEvent && parentGrid) {
            $("#msgPg").text("Demand has been changed.").removeClass("jqx-validator-success-label").addClass("jqx-validator-info-label").show();
            renderMainChart();
            showErrorTypeParent();
        } else if (parentGrid) {
            $("#msgPg").text("Demand has been changed.").removeClass("jqx-validator-success-label").addClass("jqx-validator-info-label").show();
            //setTimeout(function() { renderMainChart();console.log('refreshed')}, 1000);
            $('#syncChart').show();
        }
    });

    function initGrid(session) {
        let cs = session.cs;
        let sc = session.sc;
        let us = session.us;
        this.csURL = 'Storage/' + us + '/' + cs + '/';
        this.scURL = 'Storage/' + us + '/' + cs + '/' + sc + '/';

        genData = getGenData(cs);
        years = genData['Years'];
        fuels = genData['Commodity'];
        sectors = genData['Sectors'];
        kol = years.length;

        var srcFED =
            {
                url: this.scURL + 'FEDSectors.json',
                datatype: 'json',
                cache: false,
                async: true,
            };
        var daFED = new $.jqx.dataAdapter(srcFED);

        //dataAdapter.dataBind();
        //var recordi = dataAdapter.records;

        var daFEDchart = new $.jqx.dataAdapter(srcFED,
            {
                async: true,
                autoBind: true,
                beforeLoadComplete: function (records) {
                    var sampleData = [];
                    $.each(years, function (key, value) {
                        var year = value;
                        var sampleLength = Object.keys(records).length;
                        var data = new Object();
                        data['year'] = year;
                        for (var i = 0; i < sampleLength; i++) {
                            data[records[i].sector] = records[i][year];
                        }
                        sampleData.push(data);
                    });
                    return sampleData;
                },
                loadError: function (xhr, status, error) { alert('Error loading "' + source.url + '" : ' + error); }
            });




            
        $('#jqxchart').jqxChart({
            title: 'Title',
            description: 'desc',
            enableAnimations: true,
            showLegend: true,
            theme: theme,

            padding: { left: 5, top: 5, right: 5, bottom: 5 },
            titlePadding: { left: 90, top: 0, right: 0, bottom: 10 },
            source: daFEDchart,
            xAxis:
                {
                    text: 'Category Axis',
                    type: 'basic',
                    textRotationAngle: 65,
                    dataField: 'year',
                    showTickMarks: true,
                    tickMarksInterval: 1,
                    tickMarksColor: '#888888',
                    unitInterval: 1,
                    showGridLines: false,
                    gridLinesInterval: 1,
                    gridLinesColor: '#888888',
                    axisSize: 'auto'
                },
            valueAxis:
                {
                    unitInterval: 20,
                    minValue: 0,
                    maxValue: 'auto',
                    displayValueAxis: true,
                    description: '%',
                    axisSize: 'auto',
                    tickMarksColor: '#888888'
                },
            colorScheme: "scheme09",
            seriesGroups:
                [
                    {
                        type: 'stackedcolumn',
                        columnsGapPercent: 100,
                        seriesGapPercent: 5,
                        series: getSectorsSeries(sectors)
                    }
                ]
        });












        var nestedSource1 =
            {
                url: this.scURL + 'FEDFuelShares.json',
                datatype: 'json',
                cache: false,
                async: false,
                updaterow: function (rowid, rowdata) {
                },
            };

        var nestedAdapter1 = new $.jqx.dataAdapter(nestedSource1);
        nestedAdapter1.dataBind();
        var recordi2 = nestedAdapter1.records;

        var sirina = 120 * kol + 150;
        var sirina2 = 110 * kol + 150;
        var visina = (recordi2[0]['Shares']['Commodity'].length) * 25 + 125;

        ///////////////////////////////////////////////////////////////////////////////////////INIT ROW DETAILS////////////////////////////////////////////////////////////////////////
        var initrowdetails = function (index, parentElement, gridElement, record) {
            
            var id = record.uid.toString();
            var grid = $($(parentElement).children()[0]);
            var toolbar = $($(parentElement).children()[1]);
            var chart = $($(parentElement).children()[2]);
            var gridValue = $($(parentElement).children()[3]);

            decimalPlace = 2;
            decimal = 'd'+decimalPlace;
            //   var grid = $($(parentElement).find("#nestedGrid"));
            //   var chart = $($(parentElement).find("#nestedChart"));

            $("#barChartNested").on('click', function (e) {
                e.preventDefault();
                $('.widget-toolbar a').removeClass('green').addClass('grey');
                $('#barChartNested').removeClass('grey').addClass('green');
                var graf = chart.jqxChart('getInstance');
                graf.seriesGroups[0].type = 'column';
                graf.update();
            });

            $("#lineChartNested").on('click', function (e) {
                e.preventDefault();
                $('.widget-toolbar a').removeClass('green').addClass('grey');
                $('#lineChartNested').removeClass('grey').addClass('green');
                var graf = chart.jqxChart('getInstance');
                graf.seriesGroups[0].type = 'spline';
                graf.update();
            });

            $("#areaChartNested").on('click', function (e) {
                e.preventDefault();
                $('.widget-toolbar a').removeClass('green').addClass('grey');
                $('#areaChartNested').removeClass('grey').addClass('green');
                var graf = chart.jqxChart('getInstance');
                graf.seriesGroups[0].type = 'stackedsplinearea';
                graf.update();
            });

            $("#stackedChartNested").on('click', function (e) {
                e.preventDefault();
                $('.widget-toolbar a').removeClass('green').addClass('grey');
                $('#stackedChartNested').removeClass('grey').addClass('green');
                var graf = chart.jqxChart('getInstance');
                graf.seriesGroups[0].type = 'stackedcolumn';
                graf.update();
            });

            $("#saveShares").on('click', function (e) {
                e.preventDefault();
                saveNestedChanges();
            });

            $("#btnClearSel").on('click', function (e) {
                e.preventDefault();
                grid.jqxGrid('clearselection');
            });

            //provjeri da su vrijednosti pozitivne i da su brojevi
            function checkSharesInputs() {
                var errorType = [];
                var rows = grid.jqxGrid('getrows');
                $.each(years, function (key, value) {
                    for (var i = 0; i < rows.length; i++) {
                        var error = new Object();
                        var year = value;
                        if (rows[i][year] < 0) {
                            error['Fuel'] = rows[i].fuel;
                            //error['Fuel'] = fuels[i].fuel;
                            error['Year'] = year;
                            error['Value'] = rows[i][year];
                            errorType.push(error);
                        }
                        if (!isNumber(rows[i][year])) {
                            error['Fuel'] = rows[i].fuel;
                            //error['Fuel'] = fuels[i].fuel;
                            error['Year'] = year;
                            error['Value'] = rows[i][year];
                            errorType.push(error);
                        }
                        var error = new Object();
                    }
                });
                return errorType;
            }

            //provjeri sume 100
            function checkSums(decimalPlace) {
                var sum = new Object();
                var rows = grid.jqxGrid('getrows');
                $.each(years, function (key, value) {
                    var year = value;
                    var tmp = grid.jqxGrid('getcolumnaggregateddata', year, ['sum']);
                    if (tmp.sum.toFixed(decimalPlace) > 100.00) {
                        sum[year] = grid.jqxGrid('getcolumnaggregateddata', year, ['sum']);
                    }
                });
                return sum;
            }

            function showError1Nested(div) {
                sums = checkSums(decimalPlace);
                //$('#msgNgError1').hide();
               // $('#'+div+' .msgError1').hide();
               console.log( $('#'+div).next().find('.msgNgError1'));
                $('#'+div).next().find('.msgNgError1').hide();
                if(Object.keys(sums).length !== 0) {
                    //$('#msgError1').hide();
                    $('#'+div).next('.msgError1').hide();
                    if (Object.keys(sums).length !== 0) {
                        var msg = '';
                        msg = 'Sum of shares for year(s): <i class="red">' + Object.keys(sums) + '</i> is more than 100%.';
                        //$('#msgNgError1').html(msg).removeClass("jqx-validator-success-label").addClass("jqx-validator-error-label").show();
                        $('#'+div).next().find('.msgNgError1').html(msg).removeClass("jqx-validator-success-label").addClass("jqx-validator-error-label").show();
                    }
                }
            }

            function showError2Nested(div) {
                errorType = checkSharesInputs();
                //$('#msgNgError2').hide();

                $('#'+div).next().find('.msgNgError2').hide();
                
                if(Object.keys(errorType).length !== 0) {
                    error = "";
                    for(i=0; i<errorType.length; i++){
                        error += '<i class="red">' + errorType[i].Fuel + '</i> ' + '<i class="">' + errorType[i].Year + '</i>, ';
                    }
                    msg = 'Some of the values are invalid: ' + error.trim().replace(/.$/,".") ;
                    //$('#msgNgError2').html(msg).removeClass("jqx-validator-success-label").addClass("jqx-validator-error-label").show();
                    $('#'+div).next().find('.msgNgError2').html(msg).removeClass("jqx-validator-success-label").addClass("jqx-validator-error-label").show();
                }
            }

            function saveNestedChanges() {
                session = $.parseJSON(getByAction("getSession"));
                cs = session.cs;
                sc = session.sc;
                $('#msgNgError1').hide();
                $('#msgNgError2').hide();
                var objList = [];
                
                
                 
                var rows = grid.jqxGrid('getrows');
                console.log(grid);
                console.log(toolbar);

                console.log(grid[0].id);
                console.log($("#"+grid[0].id).next().find('.msgNgError1'));

                for (var i = 0; i < rows.length; i++) {
                    var data = new Object();
                    $.each(years, function (key, value) {
                        var year = value;
                        //data[year] = parseFloat(rows[i][year]).toFixed(decimalPlace);
                        data[year] = parseFloat(rows[i][year]);
                    });
                    //data['fuel'] = rows[i].fuel;
                    data['fuel'] = fuels[i];
                    objList.push(data);
                }
                errorType = checkSharesInputs();
                sums = checkSums(decimalPlace);
                // console.log(sums);
                // console.log(errorType);
                $(".jqx-grid-validation, .jqx-grid-validation-arrow-up, .jqx-grid-validation-arrow-down").remove();

                if (Object.keys(errorType).length === 0 && Object.keys(sums).length === 0) {
                    var myJsonString = JSON.stringify(objList);
                    $.ajax({
                        type: "POST",
                        url: "App/DataEntry/DataEntry.php?action=SaveNestedData&id=" + id + "&cs=" + cs + "&sc=" + sc,
                        data: myJsonString,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (result) {
                            var serverResponce = result;
                            switch (serverResponce["type"]) {
                                case 'ERROR':
                                    ShowErrorMessage(serverResponce["msg"]);
                                    break;
                                case 'SUCCESS':
                                    ShowInfoMessage(serverResponce["msg"]);
                                    $('#'+grid[0].id).next().find('.msgNg').text('Shares have been saved!').removeClass("jqx-validator-info-label").addClass("jqx-validator-success-label").show();
                                    break;
                            }
                        },
                        error: function (xhr, status, error) {
                            ShowErrorMessage(error);
                        }
                    });
                }
                if(Object.keys(sums).length !== 0) {
                    console.log(sums);
                    showError1Nested(grid[0].id);
                }
                if(Object.keys(errorType).length !== 0) {
                    console.log(errorType);
                    showError2Nested(grid[0].id);
                }
            }

            var nestedSource =
                {
                    datatype: 'json',
                    root: 'Shares>Commodity',
                    localdata: recordi2[index]
                };

            var nestedAdapter = new $.jqx.dataAdapter(nestedSource);

            if (grid != null) {
                grid.jqxGrid({
                    source: nestedAdapter,
                    theme: theme,
                    //width: sirina2,
                    width: '100%',
                    columnsresize: true,
                    autoheight: true,
                    columnsheight: 25,
                    editable: true,
                    selectionmode: 'multiplecellsextended',
                    showstatusbar: true,
                    showaggregates: true,
                    altrows: true,
                    handlekeyboardnavigation: function (event) {
                        event.stopPropagation();
                    },
                    columns: getYearsColumns100(years, kol),
                });
            }

            var ndaGridValues = new $.jqx.dataAdapter(nestedSource,
                {
                    async: true,
                    autoBind: true,
                    beforeLoadComplete: function (records) {
                        $.each(records, function (index, element) {
                            $.each(years, function (i, year) {
                                records[index][year] = records[index][year] * record[year] / 100;
                            });
                        });
                        return records;
                    },
                    loadError: function (xhr, status, error) { alert('Error loading "' + source.url + '" : ' + error); }
                });


             //   ndaGridValues.dataBind();

            if (gridValue != null) {
                gridValue.jqxGrid({
                    source: ndaGridValues,
                    theme: theme,
                    width: '50%',
                    autoheight: true,
                    //columnsheight: 25,
                   // rowsheight: 22,
                    editable: false,
                    selectionmode: 'multiplecellsadvanced',
                    //showstatusbar: true,
                    //showaggregates: true,
                    altrows: true,
                    columns: getYearsColumnsTech(years, kol),
                });
            }

            var nestedAdapterChart = new $.jqx.dataAdapter(nestedSource,
                {
                    async: true,
                    autoBind: true,
                    beforeLoadComplete: function (records) {
                        var sampleData = [];
                        $.each(years, function (key, value) {
                            var year = value;
                            var sampleLength = Object.keys(records).length;
                            var data = new Object();
                            data['year'] = year;
                            for (var i = 0; i < sampleLength; i++) {
                                data[records[i].fuel] = records[i][year];
                            }
                            sampleData.push(data);
                        });
                        return sampleData;
                    },
                    loadError: function (xhr, status, error) { alert('Error loading "' + source.url + '" : ' + error); }
                });


            if (chart != null) {
                chart.jqxChart(
                    {
                        title: 'title',
                        description: 'desc',
                        enableAnimations: true,
                        showLegend: true,
                        theme: theme,
                        padding: { left: 5, top: 5, right: 5, bottom: 5 },
                        titlePadding: { left: 90, top: 0, right: 0, bottom: 10 },
                        source: nestedAdapterChart,
                        categoryAxis:
                            {
                                text: 'Category Axis',
                                type: 'basic',
                                textRotationAngle: 90,
                                dataField: 'year',
                                // showTickMarks: true,
                                // tickMarksInterval: 1,
                                // tickMarksColor: '#888888',
                                // unitInterval: 1,
                                 showGridLines: false,
                                // gridLinesInterval: 1,
                                // gridLinesColor: '#888888',
                                axisSize: 'auto',
                               // flip: false  
                            },
                        valueAxis:
                            {
                                unitInterval: 20,
                                minValue: 0,
                                showTickMarks: true,
                                tickMarksColor: '#888888',
                                maxValue: 'auto',
                                displayValueAxis: true,
                                description: '%',
                                axisSize: 'auto',
                            },
                        colorScheme: 'scheme01',
                        seriesGroups:
                            [
                                {
                                    type: 'stackedcolumn',
                                    columnsGapPercent: 100,
                                    seriesGapPercent: 5,

                                    series: getFuelsSeries(fuels)
                                }
                            ]
                    }

                );
            }

            let pasteEventNested = false;
            let netsedGrid = false;
            grid.bind('keydown', function (event) {
               
                pasteEventNested = false;
                netsedGrid = true;
                var ctrlDown = false,
                    ctrlKey = 17,
                    cmdKey = 91,
                    vKey = 86,
                    cKey = 67;
                var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
                if (key == vKey) {
                    grid.jqxGrid({ showaggregates: false, showstatusbar: false });
                    pasteEventNested = true;
                }
                // console.log(grid[0].id);
                // console.log(pasteEventNested);
                // console.log(netsedGrid);
            }).on('cellvaluechanged', function (event) {
                if (!pasteEventNested && netsedGrid) {
                    $('#'+grid[0].id).next().find(".msgNg").text("Shares have been changed.").removeClass("jqx-validator-success-label").addClass("jqx-validator-info-label").show();
                    renderNestedChart();
                    refreshGridValues();
                    showError1Nested(grid[0].id);
                    showError2Nested(grid[0].id);
                    //$("#"+grid[0].id).removeClass("jqx-grid-validation, jqx-grid-validation-arrow-up, jqx-grid-validation-arrow-down");
                    //renderNestedValidationPopups();
                } else if (netsedGrid) {
                    $('#'+grid[0].id).next().find(".msgNg").text("Shares have been changed.").removeClass("jqx-validator-success-label").addClass("jqx-validator-info-label").show();
                    //setTimeout(function() { renderMainChart();console.log('refreshed')}, 1000);
                    $('#syncChartNested').show();
                }
            });

            function refreshGridValues() {
                var rows = grid.jqxGrid('getrows');
                var dataAdapter = new $.jqx.dataAdapter(rows,
                    {
                        async: true,
                        autoBind: true,
                        beforeLoadComplete: function (rows) {
                            $.each(rows, function (index, element) {
                                $.each(years, function (i, year) {
                                    rows[index][year] = rows[index][year] * record[year] / 100;
                                });
                            });
                            return rows;
                        },
                        loadError: function (xhr, status, error) { alert('Error loading "' + source.url + '" : ' + error); }
                    });
                gridValue.jqxGrid({ source: dataAdapter });
            }
    

            function renderNestedChart() {
                var graf = chart.jqxChart('getInstance');
                var rows = grid.jqxGrid('getrows');
                var sampleData = [];
                //var sampleLength = Object.keys(rows).length;
                var sampleLength = rows.length;
                $.each(years, function (key, value) {
                    var year = value;    
                    var data = new Object();
                    data['year'] = year;
                    for (var i = 0; i < sampleLength; i++) {
                        data[rows[i]["fuel"]] = rows[i][year];
                    }
                    sampleData.push(data);
                });
                graf.source = sampleData;
                graf.update();
            }

            $("#invokeAggregatesNested").on('click', function () {
                grid.jqxGrid({ showaggregates: true, showstatusbar: true });
                grid.jqxGrid('refreshaggregates');
                grid.jqxGrid('renderaggregates');
            });
            $("#syncChartNested").on('click', function (e) {
                e.preventDefault();
                renderNestedChart();
                refreshGridValues();
                showError1Nested(grid[0].id);
                showError2Nested(grid[0].id);
                //$(" .jqx-grid-validation, .jqx-grid-validation-arrow-up, .jqx-grid-validation-arrow-down").remove();
                //renderNestedValidationPopups();
                $('#syncChartNested').hide();
            });
            $("#decUpNested").on('click', function(e){
                e.preventDefault();
                decimalPlace++;
                decimal = 'd' + parseInt(decimalPlace);
                grid.jqxGrid('render');
            });
            $("#decDownNested").on('click', function(e){
                e.preventDefault();
                decimalPlace--;
                decimal = 'd' + parseInt(decimalPlace);
                grid.jqxGrid('render');
            });




            // grid.on('cellvaluechanged', function (event) {
            //     //console.log('nested changed');
            //     var graf = chart.jqxChart('getInstance');
            //     var rows = grid.jqxGrid('getrows');
            //     var sampleData = [];
            //     $.each(years, function (key, value) {
            //         var year = value;
            //         var sampleLength = Object.keys(rows).length;
            //         var data = new Object();
            //         data['year'] = year;
            //         for (var i = 0; i < sampleLength; i++) {
            //             data[rows[i].fuel] = rows[i][year];
            //         }
            //         sampleData.push(data);
            //     });
            //     graf.source = sampleData;
            //     graf.update();
            //     $("#msgNg").text("Shares have been changed.").removeClass("jqx-validator-success-label").addClass("jqx-validator-error-label").show();
            // });
        }///////////////////////////////////////////////////////////////kraj initrowdetails


        var visina3 = visina - 50;
        // var visina = recordi2[0]['Shares']['Commodity'].length * 25 + 125;

        $("#jqxgrid").jqxGrid({
            autoheight: true,
            autorowheight: true,
            width: '100%',
            theme: theme,
            source: daFED,
            //altrows: true,
            editable: true,
            showstatusbar: true,
            showaggregates: true,
            columnsresize: true,
            columnsautoresize: true,
            selectionmode: 'multiplecellsadvanced',
            rowdetails: true,
            initrowdetails: initrowdetails,
            rowdetailstemplate: {
            rowdetails:                     
                "<div id='nestedGrid' style='margin-top:10px'></div>" +
                "<div class='widget-box' id='toolbar'>" +
                    "<div class='widget-header'>" +
                        "<h4 class='widget-title'>Toolbar</h4>" +
                        "<div class='widget-toolbar'>" +
                            "<a href='#' data-action='mix' id='saveShares' class='tooltip-info ' data-toggle='tooltip' data-placement='top' title='save data'>" +
                                "<i class='ace-icon fa fa-save success' ></i>" +
                            "</a>" +
                        "</div>" +
                        "<div class='widget-toolbar'>" +
                            "<a href='#' data-action='mix'  id='btnClearSel'  class='tooltip-info'  data-toggle='tooltip' data-placement='top' title='Clear selection'>" +
                                "<i class='ace-icon fa fa-eraser info'></i>" +
                            "</a>" +
                        "</div>" +
                        "<div class='widget-toolbar'>" +
                            "<a href='#' data-action='mix' id='barChartNested' class='tooltip-info grey' data-toggle='tooltip' data-placement='top' title='Bar Chart'>" +
                                "<i class='ace-icon fa fa-bar-chart'></i>" +
                            "</a>" +
                        "</div>" +
                        "<div class='widget-toolbar'>" +
                            "<a href='#' data-action='mix' id='lineChartNested' class='tooltip-info grey' data-toggle='tooltip' data-placement='top' title='Line Chart'>" +
                                "<i class='ace-icon fa fa-line-chart'></i>" +
                            "</a>" +
                        "</div>" +
                        "<div class='widget-toolbar'>" +
                            "<a href='#' data-action='mix' id='areaChartNested' class='tooltip-info grey' data-toggle='tooltip' data-placement='top' title='Area Chart'>" +
                                "<i class='ace-icon fa fa-area-chart'></i>" +
                            "</a>" +
                        "</div>" +
                        "<div class='widget-toolbar'>" +
                            "<a href='#' data-action='mix' id='stackedChartNested' class='tooltip-info success' data-toggle='tooltip' data-placement='top' title='Stacked Column Chart'>" +
                                "<i class='ace-icon fa fa-bars'></i>" +
                            "</a>" +
                        "</div>" +
                        "<div class='widget-toolbar'>"+
                            "<a href='#' data-action='mix' id='invokeAggregatesNested' class='tooltip-info' data-toggle='tooltip' data-placement='top' title='Invoke Aggregates'>"+
                                "<i class='ace-icon fa fa-plus-square esst'></i>"+
                            "</a>"+
                        "</div>"+
                        "<div class='widget-toolbar'>"+
                            "<a href='#' data-action='' id='syncChartNested' class='tooltip-info' data-toggle='tooltip' data-placement='top' title='Refresh chart with pasted data' style='display:none;'>"+
                                " <i class='ace-icon warning  fa fa-refresh fa-bounce'></i>"+ 
                            "</a>"+
                        "</div>"+
                        "<div class='widget-toolbar'>"+
                            "<a href='#' data-action='mix'  id='decDownNested'  class='grey tooltip-info'  data-toggle='tooltip' data-placement='top' title='Decrease decimal places'>"+
                                "<i class='ace-icon fa fa-arrow-circle-o-down orange'></i>"+
                            "</a>"+
                        "</div>"+
                        "<div class='widget-toolbar'>"+
                            "<a href='#' data-action='mix'  id='decUpNested'  class='grey tooltip-info'  data-toggle='tooltip' data-placement='top' title='Increase decimal places'>"+
                                "<i class='ace-icon fa fa-arrow-circle-o-up nest'></i>"+
                            "</a>"+
                        "</div>"+
                        "<div class='widget-toolbar'>" +
                            "<div class='msgNg' style='display:none; padding: 10px'></div>" +
                        "</div>" +
                        "<div class='widget-toolbar'>" +
                            "<div class='msgNgError1' style='display:none; padding: 10px'>asda</div>" +
                        "</div>" +
                        "<div class='widget-toolbar'>" +
                            "<div class='msgNgError2' style='display:none; padding: 10px'></div>" +
                        "</div>" +
                    "</div>" +
                "</div>" +
                "<div id='nestedChart' style='width:49%; height:" + visina3 + "px; float:left'></div>"+
                "<div id='nestedGridValue' style=' height:" + visina3 + "px; float:left'></div>",
                rowdetailsheight: visina + 35 + visina3,
                rowdetailshidden: true
            },
            columns: getYearsColumns(years, kol),
        });
    }
    initGrid(session);

    $('#jqxgrid').on('rowexpand', function (event) {
        // GET ALL SELECTE ROW INDEX (RETURNS ARRAY)
        var prev_row = $('#jqxgrid').jqxGrid('selectedrowindexes');
        // IF PREV ROW NOT NOT BLANK LOOP THROUGH ARRAY HIDING selectedrowindexes
        if (prev_row != '') {
            for (var i = 0; i < prev_row.length; i++) {
                $('#jqxgrid').jqxGrid('hiderowdetails', prev_row[i]);
            }
        };
        // GET INDEX
        var index = $('#jqxgrid').jqxGrid('getrowboundindex', event.args.rowindex);      
        // SET CURRENT ROW AS SELECTED
        $('#jqxgrid').jqxGrid({selectedrowindexes: [index]});
    });
  
    $('#jqxgrid').on('rowcollapse', function (event) {
        //CLEAR SELECTION TO REOPEN AGAIN
        $('#jqxgrid').jqxGrid('clearselection');
    });



});
