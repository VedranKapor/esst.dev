export class Chart {

    static getChartSeries(array) {
        let ChartSerie = [];
        $.each(array, function (key, value) {
            var serija = {
                dataField: value,
                displayText: value,
            };
            ChartSerie.push(serija);
        });
        return ChartSerie;
    }

    static chartSetting(dataAdapter, theme, sectors){
        let setting =    {
            title: 'Title',
            description: 'desc',
            enableAnimations: true,
            showLegend: true,
            theme: theme,
    
            padding: { left: 5, top: 5, right: 5, bottom: 5 },
            titlePadding: { left: 90, top: 0, right: 0, bottom: 10 },
            source: dataAdapter,
            xAxis:
                {
                    text: 'Category Axis',
                    type: 'basic',
                    textRotationAngle: 65,
                    dataField: 'Year',
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
                        series: this.getChartSeries(sectors)
                    }
                ]
        }
        return setting;
    }











 }