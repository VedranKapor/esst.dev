
export class Grid {

    // constructor(decimal) {
    //     this.decimal = 'd2';
    // }
    // get decimal() {
    //     return this.constructor.foo;
    // }
    static gridSource(dataAdapter){
        let gridSource = {
            source: dataAdapter
        }
        return gridSource;
    }

    static gridSetting(dataAdapter, theme, array, text, datafield, settings={}){
        let setting = {
            autoheight: true,
            autorowheight: true,
            width: '100%',
            theme: theme,
            source: dataAdapter,
            editable: true,
            showstatusbar: true,
            showaggregates: true,
            columnsresize: true,
            columnsautoresize: true,
            altrows: true,
            selectionmode: 'multiplecellsadvanced',
            columns: Grid.getGridColumns(array, text, datafield, settings ),
        }
        return setting;
    }

    static getGridColumns(array, text, datafield, settings={} ){
        //console.log(Grid.decimal);
        let GridColumns = [];
        let width = 100 / (array.length + 1);
        let kolone = { text: text,  datafield: datafield, width: width + '%', pinned: true, editable: false, minwidth: 120 };
        GridColumns.push(kolone);
        $.each(array, function (key, value) {
            kolone = {
                text: value,
                datafield: value,
                width: width + '%',
                minwidth: 75,
                cellsalign: 'right',
                align: 'right',
            }
            Object.assign(kolone, settings);
            GridColumns.push(kolone);
        });
        return GridColumns;
    }   

    static columnsrenderer(key, value) {
        return '<div style="font-weight:bold; font-style:italic;  margin-left:5px;margin-top:5px; height:50px; word-wrap:normal;white-space:normal;">' + value + '</div>';
    }
    
    // static cellsrenderer(row, columnfield, value, defaulthtml, columnproperties) {
    //     return '<div style="font-weight:bold; font-style:italic; margin-left:5px;margin-top:5px;">' + value + '</div>';
    // }
    
    static cellsrenderer(row, columnfield, value, defaulthtml, columnproperties) {
        var formattedValue = $.jqx.dataFormat.formatnumber(value, Grid.decimal);
        return '<span style="margin: 4px; float:right; ">' + formattedValue + '</span>';
    }
    
    // static cellsrendererValues(row, columnfield, value, defaulthtml, columnproperties) {
    //     //console.log(value);
    //     var formattedValue = $.jqx.dataFormat.formatnumber(value, 'd2');
    //     return '<span style="margin: 4px; float:right; ">' + formattedValue + '</span>';
    // }
    
    static aggregatesrenderer(aggregates, column, element, summaryData) {
        //console.log(aggregates);
        let sum = aggregates['sum'].toFixed(Grid.decimal.slice(-1));
        return `<span style="margin-top: 8px; margin-right:3px; float: right;">` + sum + `</span>`;
    }
    
    static aggregatesrenderer100(aggregates, column, element, summaryData) {
        let sum = parseFloat(aggregates['sum']).toFixed(Grid.decimal.slice(-1));
        let result;
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
    
    static initeditor(row, cellvalue, editor) {
        //editor.jqxNumberInput({ decimalDigits: 2 });
        editor.jqxNumberInput({textAlign: 'center'});
    }
    
    static validation(cell, value) {
        if (value < 0) {
            return { result: false, message: 'Value should be positive number.' };
        }
        if(isNaN(value)){
            return { result: false, message: "Value is not valid number!" };
        }
        return true;
    }
    
    static validation100(cell, value) {
        if (value < 0) {
            return { result: false, message: 'Value should be positive number!' };
        }
        else if (value > 100) {
            return { result: false, message: 'Value cannot be larger than 100!' };
        }
        return true;
    }


    static isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    static checkGridInputs(gridRows, years, type) {
        let errorType = [];
        for (var i = 0; i < gridRows.length; i++) {
            $.each(years, function (key, value) {
                var error = new Object();
                var year = value;
                if (gridRows[i][year] < 0) {
                    error[type] = gridRows[i][type];
                    error['Year'] = year;
                    error['Value'] = gridRows[i][year];
                    errorType.push(error);
                }
                if (!Grid.isNumber(gridRows[i][year])) {
                    error[type] = gridRows[i][type];
                    error['Year'] = year;
                    error['Value'] = gridRows[i][year];
                    errorType.push(error);
                }
            });
        }
        return errorType;
    }

    static checkSums(grid, years, decimalPlace) {
        let errorType = [];
        var rows = grid.jqxGrid('getrows');
        $.each(years, function (key, value) {
            var sum = new Object();
            var year = value;
            var tmp = grid.jqxGrid('getcolumnaggregateddata', year, ['sum']);
            let suma = tmp.sum.toFixed(decimalPlace);
            if (suma > 100.00) {
                //sum[year] = grid.jqxGrid('getcolumnaggregateddata', year, ['sum']);
                sum['Sum'] = 'Sum';
                sum['Year'] = year;
                sum['Value'] = suma;
                errorType.push(sum);
            }
        });
        return errorType;
    }

    static showErrorTypeParent(errorType, id, type) {
        $('#'+id).hide();
        console.log(errorType);
        let error = "";
        for(i=0; i<errorType.length; i++){
            error += '<i class="red">' + errorType[i][type] + '</i> ' + '<i class="">' + errorType[i].Year + '</i>, ';
        }
        let msg = 'Invalid values for: ' + error.trim().replace(/.$/,".") ;
        $('#'+id).html(msg).removeClass("jqx-validator-success-label").addClass("jqx-validator-error-label").show();
        return true;
    }
    
 }

 Grid.decimal = 'd2';