var time = 'monthly';

var chartData;  //var to store data from the json file
$.ajax({
    dataType: "json",
    url: 'lineChartData1.json',
    success: function(data){
        main(data, time);
    }
});

document.getElementById("monthly").addEventListener("click", function(){
    time = 'monthly';
    main(chartData, time);
});

document.getElementById("daily").addEventListener("click", function(){
    time = 'daily';
    main(chartData, time);
});

document.getElementById("DownloadCSVLine").addEventListener("click", function(){
    if (time == 'monthly') {    //time is changed based on the last button clicked
        time = chartData.monthly;
    }
    else if(time == 'daily') {
        time = chartData.daily;
    }
    downloadCSVLine(time);
});

function main(data, time) {
    chartData = data;
    if (time == 'monthly') {    //time is changed based on the last button clicked
        time = chartData.monthly;
    }
    else if(time == 'daily') {
        time = chartData.daily;
    }
    // x = prepareTableDataLine(time);
    // createTable(x);
    x = prepareTableDataLine(time);
    createTable(x, '#theTable');
    createChart(time);
}    

function prepareTableDataLine(timeFrame){
    valueKey = Object.keys(timeFrame)[1];
    if(timeFrame.dates[0] == 'Dates'){      //formatting the data to be used for making the table
        timeFrame.dates.splice(0,1);
        timeFrame[valueKey].splice(0,1);
    }
    var dataSet = []
    if(timeFrame.dates[0][4] == '-'){       //check if the dates are formatted
        for(var i =0; i < timeFrame.dates.length; i++){
            dataSet.push(timeFrame.dates[i].split());   //more data formatting
            dataSet[i].push(timeFrame[valueKey][i]);        //^
        }
    }
    else{
        for(var i =0; i < timeFrame.dates.length; i++){
            timeFrame.dates[i] = timeFrame.dates[i].substr(0, 4) + '-' + timeFrame.dates[i].substr(4, 2) + '-' + timeFrame.dates[i].substr(6, 2);
            dataSet.push(timeFrame.dates[i].split());
            dataSet[i].push(timeFrame[valueKey][i]);
        }
    }
    return dataSet;
}

function createTable(tableData, tableID){
    if ( $.fn.dataTable.isDataTable( tableID ) ) { //check if this is already a datatable
        $(tableID).DataTable().clear();              //clear its data
        $(tableID).dataTable().fnAddData(tableData);     //populate it with a new set of data
    }
    else{
        $(document).ready(function() {
            $(tableID).DataTable( {      //initialization of the datatable
                data: tableData,
                // "columnDefs": [
                //     { "width": "20%", "targets": 0 }
                // ],
                columns: [
                    { title: "Date" },
                    { title: "Value" },
                ],
                "scrollY": "300px",     //scroll function and the default size of the table
                "searching": false,     //disabled the search function
                "paging":   false,      //disabled paging
                scrollCollapse: true, //shortens the height of the table if there isnt much data to fill up its height
                "deferRender": true,    //renders one page at a time to speed up intialization if we're using a paginated table(but we're not lol)
                "processing": true,     //displays a 'processing' indicator while the table is being processed
                "bInfo": false,         //the table by default states "show 1 to N entries of N entries" so i got rid of that
            } );
        } );
    }
}
        
        
function createChart(timeFrame){
    
    var thisTime = JSON.parse(JSON.stringify(timeFrame));
    for(var i =0; i < thisTime.dates.length; i++){
            //thisTime.dates[i] = thisTime.dates[i].substr(0, 4) + '-' + thisTime.dates[i].substr(4, 2) + '-' + thisTime.dates[i].substr(6, 2);
        }
    dateKey = Object.keys(thisTime)[0];      
    thisTime[dateKey].unshift(dateKey); //data formatting to create the chart
    columnss = thisTime.dates;
    valueKey = Object.keys(thisTime)[1];
    thisTime[valueKey].unshift(valueKey);
    dataa = thisTime[valueKey];
    var chart = c3.generate({
            bindto: '#chart',
            size: {
                height: 300,    //size set same the datatable
                //width: 480    //default size is full width of page
            },
            data: {
                x: 'dates',
                xFormat: '%Y-%m-%d',
                columns: [
                    columnss,   // example of what is being passed ['x', "20170831", "20170930", "20171031", "20171130", "20171231", "20180131", "20180228", "20180331", "20180430", "20180531"],
                    dataa,      // example of what is being passed ['users', 20, 26, 26, 27, 27, 31, 34, 34, 34, 43]
                ],
                color: function (color, d) {
                    // d will be 'id' when called for legends
                    return d.id && d.id === valueKey ? d3.rgb(color).darker(d.value / 30) : color;
                },
            },
            axis: {
                x: {
                    type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d'
                    }
                }
            }
        });
    }

function downloadCSVLine(timeFrame){
    // Shape the data into an acceptable format for parsing
    var thisTime = JSON.parse(JSON.stringify(timeFrame));
    var overall = [];
    valueKey = Object.keys(thisTime)[1];
    dateKey = Object.keys(thisTime)[0];
    thisTime[dateKey].unshift(dateKey); //data formatting to create the chart
    thisTime[valueKey].unshift(valueKey);
    for(var i = 0; i < thisTime[valueKey].length; i++){
        overall.push([thisTime[dateKey][i], thisTime[valueKey][i]]);
    }
    // Construct the CSV string and start download
    var csv_data = Papa.unparse(overall);
    download(csv_data, 'data_spreadsheet.csv');
}


//BARCHART STUFF
var barChartData;
//var titles=["Departments", "Members"]; 
        
document.getElementById("DownloadCSVBar").addEventListener("click", function(){
    downloadCSVBar(barChartData);
});

$.ajax({
    dataType: "json",
    url: 'barChartData2.json',
    success: function(d){
        barChartData = d;
        x = prepareTableDataBar(d);
        createChartBar(d);
        createTable2(x, '#test');
    }
});
        
function prepareTableDataBar(chartData){
    var dataSet = []
    zeroethKey = Object.keys(barChartData)[0];
    firstKey = Object.keys(barChartData)[1]; 
    for(var i =0; i < barChartData[zeroethKey].length; i++){
        dataSet.push(barChartData[zeroethKey][i].split());
        dataSet[i].push(barChartData[firstKey][i]);
    }
    return dataSet;
}

function createTable2(tableData, chartData){
    zeroethKey = Object.keys(barChartData)[0];
    firstKey = Object.keys(barChartData)[1]; 
    $(document).ready(function() {
        $('#test').DataTable( {
        data: tableData,
        columns: [
        { title: zeroethKey },
        { title: firstKey },
        ],
        "scrollY": "500px",
        "paging": false,
        scrollCollapse: true
        } );
    } );
}

function createChartBar(barChartData){
    zeroethKey = Object.keys(barChartData)[0];
    firstKey = Object.keys(barChartData)[1]; 
    barChartData[zeroethKey].unshift(zeroethKey);
    barChartData[firstKey].unshift(firstKey);
    columnss = barChartData[zeroethKey].slice(0,21);
    dataa = barChartData[firstKey].slice(0,21);
    var str = firstKey;
    var chart = c3.generate({
        bindto: '#chart1',
        data: {
            columns: [
                dataa,
            ],
            type: 'bar',
            color: function (color, d) {
                // d will be 'id' when called for legends
                return d.id && d.id === firstKey ? d3.rgb(color).darker(d.value / 15) : color;
            },
        },
        bar: {
            width: {
                ratio: 0.5 // this makes bar width 50% of length between ticks
            }
            // or
            //width: 100 // this makes bar width 100px
        },
        axis: {
            x: {
                type: 'category',
                categories: columnss
            }
        }
    });
}

function downloadCSVBar(barChartData){
    //barChartData.departments.unshift('departments');
    // Shape the data into an acceptable format for parsing
    var overall = [];
    zeroethKey = Object.keys(barChartData)[0];
    firstKey = Object.keys(barChartData)[1]; 
    for(var i = 0; i < barChartData[zeroethKey].length; i++){
        overall.push([barChartData[zeroethKey][i], barChartData[firstKey][i]]);
    }
    // Construct the CSV string and start download
    var csv_data = Papa.unparse(overall);
    download(csv_data, 'data_spreadsheet.csv');
}

function validTypeCheck (typeStr) {
    validTypes = ['file','discussion','event_calendar','groups','blog',
    'bookmarks','pages'];
    if (validTypes.includes(typeStr)) {
        return typeStr;
    } 
    else {
        return 'unknown'
    }
}

function fixDuplicateEntries (data) {
    // Expects data in the format [ ['(file) name', 30], ['(file) name2', 20] ]
    // Detects duplicates and adds their views together.
    newData = [];
    seenKeys = [];
    for (var i=0;i<data.length;i++) {
        if (seenKeys.includes(data[i][0])) {
            // Already seen this name, find it in array
            for (var r=0;r<newData.length;r++) {
                if (newData[r][0] === data[i][0]) {
                    // Found the duplicate. Add this entry's views and skip it!
                    newData[r][1] = newData[r][1] + data[i][1];
                }
            }
        } 
        else {
            // Have not seen this name
            seenKeys.push(data[i][0]);
            newData.push(data[i]);
        }
    }
    // Fix ordering??
    return newData;
}

function fixData(data){
    /*var fixed_data = [];
    for (var i=0;i<data.members.length;i++) {
    fixed_data.push([ '('+ this.validTypeCheck(data.urls[i]) +') ' + data.titles[i], parseInt(data.pageviews[i])]);
    }*/
    data = fixDuplicateEntries(data);
}