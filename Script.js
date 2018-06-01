var time1 = 'monthly';
var time2 = 'monthly';

var chartData1;  //var to store data from the json file
var chartData2;

$.ajax({
    dataType: "json",
    url: 'lineChartData1.json',
    success: function(data){
        chartData1 = data;
        main(1);
    }
});

$.ajax({
    dataType: "json",
    url: 'lineChartData2.json',
    success: function(data){
        chartData2 = data;
        main(2);
    }
});

var menu = document.getElementById("select");
menu.addEventListener("change", helper1);

function helper1(event) {
    if (menu.value == "monthly1"){
        time1 = 'monthly';
        main(1);
    }
    if (menu.value == "daily1"){
        time1 = 'daily';
        main(1);
    }
}

document.getElementById("monthly2").addEventListener("click", function(){
    time2 = 'monthly';
    main(2);
});

document.getElementById("daily2").addEventListener("click", function(){
    time2 = 'daily';
    main(2);
});

document.getElementById("DownloadCSVLine1").addEventListener("click", function(){
    if (time1 == 'monthly') {    //time is changed based on the last button clicked
        time = chartData1.monthly;
    }
    else if(time1 == 'daily') {
        time = chartData1.daily;
    }
    downloadCSVLine(time);
});

document.getElementById("DownloadCSVLine2").addEventListener("click", function(){
    if (time2 == 'monthly') {    //time is changed based on the last button clicked
        time = chartData2.monthly;
    }
    else if(time2 == 'daily') {
        time = chartData2.daily;
    }
    downloadCSVLine(time);
});

function main(num) {
    if (time1 == 'monthly' && num==1) {    //time is changed based on the last button clicked
        time = chartData1.monthly;
    }
    else if(time1 == 'daily' && num==1) {
        time = chartData1.daily;
    }
    else if (time2 == 'monthly' && num==2) {  
        time = chartData2.monthly;
    }
    else if (time2 == 'daily' && num==2) {
        time = chartData2.daily;
    }
    // x = prepareTableDataLine(time);
    // createTable(x);
    x = prepareTableDataLine(time);
    createTable(x, '#theTable'.concat(String(num)), "Date");
    createChartLine(time, '#chart'.concat(String(num)));
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

function createTable(tableData, tableID, metric){
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
                    { title: metric },
                    { title: "Value" },
                ],
                "scrollY": "200px",     //scroll function and the default size of the table
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
        
        
function createChartLine(timeFrame, chartID){
    
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
            bindto: chartID,
            size: {
                height: 200,    //size set same the datatable
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
            legend: {
                show: false
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
var barChartData1;
var barChartData2;
//var titles=["Departments", "Members"]; 
//var columnColors = [rgb(31, 119, 180), rgb(255, 127, 14), rgb(44, 160, 44), rgb(214, 39, 40), rgb(148, 103, 189), rgb(140, 86, 75), rgb(227, 119, 194), rgb(127, 127, 127), rgb(188, 189, 34), rgb(23, 190, 207)];
var columnColors = ['rgb(31, 119, 180)', 'rgb(255, 127, 14)', 'rgb(44, 160, 44)', 'rgb(214, 39, 40)', 'rgb(148, 103, 189)', 'rgb(140, 86, 75)', 'rgb(227, 119, 194)', 'rgb(127, 127, 127)', 'rgb(188, 189, 34)', 'rgb(23, 190, 207)', 'rgb(31, 119, 180)', 'rgb(255, 127, 14)', 'rgb(44, 160, 44)', 'rgb(214, 39, 40)', 'rgb(148, 103, 189)', 'rgb(140, 86, 75)', 'rgb(227, 119, 194)', 'rgb(127, 127, 127)', 'rgb(188, 189, 34)', 'rgb(23, 190, 207)'];

        
document.getElementById("DownloadCSVBar1").addEventListener("click", function(){
    downloadCSVBar(barChartData1);
});

document.getElementById("DownloadCSVBar2").addEventListener("click", function(){
    downloadCSVBar(barChartData2);
});

$.ajax({
    dataType: "json",
    url: 'barChartData1.json',
    success: function(d){
        barChartData1 = d;
        x = prepareTableDataBar(d);
        createChartBar(d, barChart1);
        createTable(x, '#test1', "Department");
    }
});

$.ajax({
    dataType: "json",
    url: 'barChartData2.json',
    success: function(d){
        barChartData2 = d;
        x = prepareTableDataBar2(d);
        createChartBar(d, barChart2);
        createTable(x, '#test2', "Title");
    }
});
        
function prepareTableDataBar(chartData){
    var dataSet = []
    zeroethKey = Object.keys(chartData)[0];
    firstKey = Object.keys(chartData)[1]; 
    for(var i =0; i < chartData[zeroethKey].length; i++){
        dataSet.push(chartData[zeroethKey][i].split());
        dataSet[i].push(chartData[firstKey][i]);
    }
    return dataSet;
}

function createChartBar(chartData, chartID){
    zeroethKey = Object.keys(chartData)[0];
    firstKey = Object.keys(chartData)[1]; 
    chartData[zeroethKey].unshift(zeroethKey);
    chartData[firstKey].unshift(firstKey);
    columnss = chartData[zeroethKey].slice(1,21);
    dataa = chartData[firstKey].slice(0,21);
    var str = firstKey;
    var chart = c3.generate({
        bindto: chartID,
        data: {
            columns: [
                dataa,
            ],
            type: 'bar',
            color: function (color, d) {
                // d will be 'id' when called for legends
                return columnColors[d.index];
            },
        },
        legend: {
            show: false
        },
        bar: {
            width: {
                ratio: 1 // this makes bar width 50% of length between ticks
            }
            // or
            //width: 100 // this makes bar width 100px
        },
        axis: {
            x: {
                type: 'category',
                categories: columnss,
            }
        },
        onrendered: function() {
            d3.selectAll(".c3-axis.c3-axis-x .tick text")
                .style("display", "none");
        }
    });
}

function downloadCSVBar(chartData){
    //barChartData.departments.unshift('departments');
    // Shape the data into an acceptable format for parsing
    var overall = [];
    zeroethKey = Object.keys(chartData)[0];
    firstKey = Object.keys(chartData)[1]; 
    for(var i = 0; i < chartData[zeroethKey].length; i++){
        overall.push([chartData[zeroethKey][i], chartData[firstKey][i]]);
    }
    // Construct the CSV string and start download
    var csv_data = Papa.unparse(overall);
    download(csv_data, 'data_spreadsheet.csv');
}

function validTypeCheck (typeStr) {
    validTypes = ['file','discussion','event_calendar','groups','blog',
    'bookmarks','pages', 'docs'];
    if (validTypes.includes(typeStr)) {
        return typeStr;
    } 
    else {
        return 'unknown';
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
    // Fix ordering
    newData.sort(function(a,b){
        return a[1] - b[1];
    });
    return newData;
}

function fixDataBarChart2(data){
    zeroethKey = Object.keys(data)[0]; //"fileType"
    //goes through file type array and applies validTypeCheck
    for(var i=0; i<data[zeroethKey].length; i++){ 
        data[zeroethKey][i] = validTypeCheck(data[zeroethKey][i]);
    }
    data = fixDuplicateEntries(data);
    return data;
}

//returns data in format [ ['(file) name', 30], ['(file) name2', 20] ]
function prepareTableDataBar2(chartData){
    var dataSet = []
    zeroethKey = Object.keys(chartData)[0];
    firstKey = Object.keys(chartData)[1]; 
    secondKey = Object.keys(chartData)[2];
    for(var i =0; i < chartData[zeroethKey].length; i++){
        chartData[zeroethKey][i] = "(" + chartData[zeroethKey][i] + ") " + chartData[secondKey][i]; 
    }
    for(var i =0; i < chartData[zeroethKey].length; i++){
        dataSet.push(chartData[zeroethKey][i].split());
        dataSet[i].push(chartData[firstKey][i]);
    }
    return dataSet;
}