var time1 = 'monthly'; //var to store value of monthly/daily dropdown
var time2 = 'monthly';

var chartData1;  //var to store data from the json file
var chartData2;

var currentLang = 'EN'; //var to store current language of page

// $.ajax({
//     dataType: "json",
//     url: 'lineChartData1.json',
//     success: function(data){
//         chartData1 = data;
//         mainLine(1);
//     }
// });

// $.ajax({
//     dataType: "json",
//     url: 'lineChartData2.json',
//     success: function(data){
//         chartData2 = data;
//         mainLine(2);
//     }
// });

var progress1 = false; 
var p2 = false;
var p3 = false;
var p4 = false; 

var beforeSend = function(){
    if (progress1 == true && p2 == true && p3 == true && p4 == true){
        xmlHttp.abort();
    }
}

var menu = document.getElementById("select");
menu.addEventListener("change", helper1);

function helper1(event) {
    if (menu.value == "monthly1"){
        time1 = 'monthly';
        mainLine(1);
    }
    if (menu.value == "daily1"){
        time1 = 'daily';
        mainLine(1);
    }
}

var menu2 = document.getElementById("select2");
menu2.addEventListener("change", helper2);

function helper2(event) {
    if (menu2.value == "monthly2"){
        time2 = 'monthly';
        mainLine(2);
    }
    if (menu2.value == "daily2"){
        time2 = 'daily';
        mainLine(2);
    }
}
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

function swap(dict){
    var ret = {};
    for(var key in dict){
      ret[dict[key]] = key;
    }
    return ret;
}
 
var fr_dict = {};
var fr_list = [];
var inverse_fr_dict = {};
$.getJSON("fr_dpts.json", function(result){
    //console.log(result);
    fr_dict = result;
    var values = $.map(fr_dict, function(value,key) {return value});
    var keys = $.map(fr_dict, function(value, key) {return key});
    // console.log(values);
    // console.log(keys);
    fr_list = Array(values);
    inverse_fr_dict = swap(fr_dict);
    //console.log(inverse_fr_dict);
});

var en_dict = {};
var en_list = [];
var inverse_en_dict = {};
$.getJSON("en_dpts.json", function(result){
    //console.log(result);
    en_dict = result;
    var values = $.map(en_dict, function(value,key) {return value});
    var keys = $.map(en_dict, function(value, key) {return key});
    // console.log(values);
    // console.log(keys);
    en_list = Array(values);
    inverse_en_dict = swap(en_dict);
    //console.log(inverse_fr_dict);
});

//Returns the bilingual version of the name given
function get_bilingual_name (dept){
    try{
        return fr_dict[inverse_en_dict[String(dept)]]
    }
    catch (err){
        return en_dict[inverse_fr_dict[String(dept)]]
    }
}

function departmentsToFrench (barchartData1){
    var barChartData1FR = $.extend(true, {}, barChartData1);
    for(var i=0; i<barchartData1["departments"].length; i++){
        barChartData1FR["departments"][i] = fr_dict[inverse_en_dict[barChartData1FR["departments"][i]]];
        if (barChartData1FR["departments"][i] === undefined){
            barChartData1FR["departments"][i] = barChartData1["departments"][i];
        }
    }
    return barChartData1FR;
}

$("#eng-toggle").on('click', function(event) {
    currentLang = "EN";
    document.getElementById("h11").innerHTML="<strong>GC</strong>collab Group Stats Page";
    document.getElementById("url-message").innerHTML="Paste the group URL above and set your desired start and end dates to retrieve relevant statistics.";
    document.getElementById("pageViewsTitle").innerHTML="Page Views";
    document.getElementById("downloadCSV").innerHTML="Download data as CSV";
    document.getElementById("month").innerHTML="Monthly";
    document.getElementById("day").innerHTML="Daily";
    document.getElementById("month").innerHTML="Monthly";
    document.getElementById("day").innerHTML="Daily";
    document.getElementById("groupMemebershipTitle").innerHTML="Group Membership";
    document.getElementById("departmentTitle").innerHTML="Group Members by Department";
    document.getElementById("topContentTitle").innerHTML="Top Group Content";
    document.getElementById("getStatss").innerHTML="Get Stats";
    mainBar(1, 'departments', barChartData1);
});

$("#fr-toggle").on('click', function(event) {
    currentLang = "FR";
    document.getElementById("h11").innerHTML="Page des statistiques des groupes <strong>GC</strong>collab";
    document.getElementById("url-message").innerHTML="Collez l'URL du groupe ci-dessus et choisissez les dates de début et de fin pour récupérer les statistiques pertinentes.";
    document.getElementById("pageViewsTitle").innerHTML="Pages consultées";
    document.getElementById("downloadCSV").innerHTML="Télécharger les données au format CSV";
    document.getElementById("month").innerHTML="Mensuel";
    document.getElementById("day").innerHTML="Quotidien";
    document.getElementById("month2").innerHTML="Mensuel";
    document.getElementById("day2").innerHTML="Quotidien";
    document.getElementById("groupMemebershipTitle").innerHTML="Appartenance au groupe";
    document.getElementById("departmentTitle").innerHTML="Membres du groupe par département";
    document.getElementById("topContentTitle").innerHTML="Top contenu du groupe";
    document.getElementById("getStatss").innerHTML="Obtenir des stats";
    zeroethKey = Object.keys(barChartData1)[0]; //name of first column ie "departments"
    firstKey = Object.keys(barChartData1)[1]; //name of second column ie "members"
    barChartData1[zeroethKey].shift(); //adds "department" to start of department array 
    barChartData1[firstKey].shift();
    frenchDepartments = departmentsToFrench(barChartData1);
    console.log(frenchDepartments);
    mainBar(1, 'departments', frenchDepartments);
});

function mainLine(num) {
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
    //console.log(timeFrame);
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
    console.log(tableData['departments']);
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
            },
            groupName: '',
            onrendered: function() {
                d3.selectAll(".c3-axis.c3-axis-x .tick text")
                    .style("display", "none");
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

// $.ajax({
//     dataType: "json",
//     url: 'barChartData1.json',
//     success: function(d){
//         mainBar(1, 'department', d);
//     }
// });

// $.ajax({
//     dataType: "json",
//     url: 'barChartData2.json',
//     success: function(d){
//         mainBar(2, 'topContent', d)
//     }
// });

function mainBar(num, stringy, barChartData){
    if(stringy == 'departments'){
        x = prepareTableDataBar(barChartData)
    }
    else if(stringy == 'topContent'){
        //console.log(barChartData);
        x = prepareTableDataBar2(barChartData);
    }
    createChartBar(barChartData, '#barChart'.concat(String(num)));
    createTable(x, '#test'.concat(String(num)), stringy);
}
        
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
    zeroethKey = Object.keys(chartData)[0]; //name of first column ie "departments"
    firstKey = Object.keys(chartData)[1]; //name of second column ie "members"
    chartData[zeroethKey].unshift(zeroethKey); //adds "department" to start of department array 
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


// $("getStats").click(function(e) {
//     e.preventDefault();
//     $.ajax({
//         type: "POST",
//         url: "/pages/test/",
//         data: { 
//             id: $("#getStats").val(), // < note use of 'this' here
//             access_token: $("#access_token").val() 
//         },
//         success: function(result) {
//             alert('ok');
//         },
//         error: function(result) {
//             alert('error');
//         }
//     });
// });

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

$("#datepicker1").on("change keyup paste", function(){
    //console.log(this.value);
    
    console.log($("#datepicker2").datepicker("getDate"));
    if($("#datepicker2").datepicker("getDate") < $("#datepicker1").datepicker("getDate")){
        document.getElementById("getStatss").disabled = true;
    }
    var day = this.value.slice(3,5);
    var month = this.value.slice(0,2);
    var year = this.value.slice(6,10);
    state.startDate = year + "-" + month + "-"+day;
    if (state.groupURL != ""){
        helperRequestData();
    }
})

$("#datepicker2").on("change keyup paste", function(){
    //console.log(this.value);
    if($("#datepicker2").datepicker("getDate") < $("#datepicker1").datepicker("getDate")){
        document.getElementById("getStatss").disabled = true;
    }
    var day = this.value.slice(3,5);
    var month = this.value.slice(0,2);
    var year = this.value.slice(6,10);
    state.endDate = year + "-" + month + "-"+day;
    if (state.groupURL != ""){
        helperRequestData();
    }
})

function helperRequestData() {
    $('.loading').show();
    $('.loading1').show();
    $('.loading2').show();
    $('.loading3').show();
    $('.url-message').hide(); 
    // if (progress1 == false && p2 == false && p3 == false && p4 == false){
    //     $('.white-box').show("slow", function(){
    //         requestData('membersOverTime');
    //         requestData('departments');
    //         requestData('topContent');
    //         requestData('pageViews');
    //     }); 
    // }
    //xmlHttp.abort();
    $('.white-box').show("slow", function(){
        requestData('membersOverTime');
        requestData('departments');
        requestData('topContent');
        requestData('pageViews');
    })
}

document.getElementById("getStatss").addEventListener("click", function(){
    //console.log(document.getElementById("statsurl").value);
    state.groupURL = document.getElementById("statsurl").value;
    helperRequestData(); 
});

var state = {
    // Each metric's specific state. Populated after data is received
    membersOverTime: {},
    departments: {},
    topContent: {},
    pageViews: {}
};
function dateConverter(d) {
    year = String(d.getFullYear());
    console.log(year);
    day = String(d.getDate());
    console.log(day);
    month = String(d.getMonth() + 1);
    console.log(month);
    if (day.length == 1){
        day = "0" + day;
    }
    if (month.length == 1){
        month = "0" + month;
    }
    return year + "-" + month + "-" + day;
}
var d = new Date();
d.setFullYear(d.getFullYear()-1);
state.startDate = dateConverter(d);
state.endDate = dateConverter(new Date());
state.groupURL = "";

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function requestData(reqType) {
    // Form correct request based on request type
    // Really ugly, needs back end changes
    var reqStatement = ""; // Populate this with the request
    switch (reqType) {
        case 'membersOverTime':
            reqStatement = '{"stepIndex":4,"reqType":{"category":1,"filter":"'+
                state.groupURL +'"},"metric":3,"metric2":0,"time":{"startDate":"'+
                state.startDate +'","endDate":"'+ 
                state.endDate +'","allTime":true},"errorFlag":false}';
            break;
        case 'departments':
            reqStatement = '{"stepIndex":4,"reqType":{"category":1,"filter":"'+ 
                state.groupURL +'"},"metric":4,"metric2":0,"time":{"startDate":"2017-02-12","endDate":"2018-02-12","allTime":true},"errorFlag":false}'
            break;
        case 'topContent':
            reqStatement = '{"stepIndex":4,"reqType":{"category":1,"filter":"'+
                state.groupURL +'"},"metric":2,"metric2":0,"time":{"startDate":"2017-02-12","endDate":"2018-02-12","allTime":true},"errorFlag":false}'
            break;
        case 'pageViews':
            reqStatement = '{"stepIndex":4,"reqType":{"category":1,"filter":"'+ 
                state.groupURL +'"},"metric":1,"metric2":0,"time":{"startDate":"' + 
                state.startDate +'","endDate":"' + 
                state.endDate +'","allTime":true},"errorFlag":false}';
            break;
        }
    // Send the request
    //reqStatement = JSON.parse('{"stepIndex":4,"reqType":{"category":1,"filter":"https://gccollab.ca/groups/profile/718/canada-indigenous-relations-creating-awareness-fostering-reconciliation-and-contributing-to-a-shared-future-relations-canada-et-peuples-indigenes-promouvoir-la-sensibilisation-favoriser-la-reconciliation-et-contribuer-a-un-avenir-partager"},"metric":2,"metric2":0,"time":{"startDate":"2017-02-12","endDate":"2018-02-12","allTime":true},"errorFlag":false}');
    //console.log(reqStatement);
    //reqStatement = JSON.stringify(reqStatement);
    //var data = {name:"John"}
    console.log(reqStatement);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            resp = JSON.parse(this.response);
            console.log(this.response);
            switch(reqType) {
                case 'membersOverTime':
                    progress1 = false;
                    chartData2 = resp;
                    console.log(chartData2);
                    mainLine(2);
                    $('.loading1').hide();
                    break;
                case 'departments':
                    p2 = false;
                    barChartData1 = resp;
                    console.log(barChartData1);
                    mainBar(1, 'departments', resp);
                    $('.loading2').hide();
                    break;
                case 'topContent':
                    p3 = false;
                    barChartData2 = resp;
                    console.log(barChartData2);
                    mainBar(2, 'topContent', resp);
                    $('.loading3').hide();
                    break;
                case 'pageViews':
                    p4 = false;
                    chartData1 = resp;
                    console.log(chartData1);
                    document.getElementById("title").innerHTML=replaceAll(chartData1.group_name, "-", " ");
                    console.log(chartData1.group_name)
                    mainLine(1)
                    $('.loading').hide();
                    break;
            }
            setTimeout(function() {
                $(window).trigger('resize');
            }, 0);
       }
    };
    xmlHttp.open("POST", "/getData/request", true); // false for synchronous request
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.send(reqStatement);
    // $.ajax({
    //     type: 'post',
    //     contentType: 'application/json',
    //     dataType: 'json',
    //     url: '/getData/request',
    //     body: reqStatement,
    //     processData: false,
    //     success: function(resp) {  
    //         console.log(resp);
    //         console.log(typeof(resp));
    //         //resp = JSON.parse(resp);
    //         switch(reqType) {
    //             case 'membersOverTime':
    //                 chartData2 = resp;
    //                 console.log(chartData2);
    //                 mainLine(2);
    //                 break;
    //             case 'departments':
    //                 barChartData1 = resp;
    //                 console.log(barChartData1);
    //                 mainBar(1, 'departments', resp);
    //                 break;
    //             case 'topContent':
    //                 barChartData2 = resp;
    //                 console.log(barChartData2);
    //                 mainBar(2, 'topContent', resp);
    //                 break;
    //             case 'pageViews':
    //                 chartData1 = resp;
    //                 console.log(chartData1);
    //                 mainLine(1)
    //                 break;
    //         }
    //     }
    // });
}

$(document).ready(function(){
    $('.white-box').hide();
});
// $(window).load(function() {
//     $('#loading').hide();
// });