var barChartData;
var titles=["Departments", "Members"]; 

document.getElementById("DownloadCSV").addEventListener("click", function(){
    downloadCSV(barChartData);
});

$.ajax({
        dataType: "json",
        url: 'incoming_data_barchart_jorts.json',
        success: function(d){
            barChartData = d;
            x = prepareTableData2(d);
            createChart2(d);
            createTable2(x,d);
        }
    });

function prepareTableData2(chartData){
    var dataSet = []
    for(var i =0; i < barChartData.departments.length; i++){
        dataSet.push(barChartData.departments[i].split());

        dataSet[i].push(barChartData.members[i]);
    }
    console.log(dataSet[0])
    return dataSet;
}

function createTable2(tableData, chartData){
    $(document).ready(function() {
        $('#test').DataTable( {
        data: tableData,
        columns: [
        { title: titles[0] },
        { title: titles[1] },
        ],
        "scrollY": "500px",
        "paging": false,
        scrollCollapse: true
        } );
    } );
}

function createChart2(barChartData){
    columnss = barChartData.departments;
    //barChartData.members.unshift('members');
    //barChartData.members.unshift('departments');
    dataa = barChartData.members;
    var chart = c3.generate({
        bindto: '#chart1',
        data: {
            columns: [
            dataa,
            ],
            type: 'bar'
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

function downloadCSV(barChartData){
    //barChartData.departments.unshift('departments');
    // Shape the data into an acceptable format for parsing
    var overall = [];
    for(var i = 0; i < barChartData.departments.length; i++){
        overall.push([barChartData.departments[i], barChartData.members[i]]);
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
    // Expects data in the format [ ['(file) name', 30], ['(file) name2', 20]  ]
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


