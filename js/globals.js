// This file contains variables and functions used globally.
// Interaction in each component (map and line graph) is routed via this file.

//Global data variable
var sumstat;
var data_glob;

var colorGraph, colorMap;
var dataKeyHelperArray = ["Nederland","Groningen","Friesland","Drenthe","Overijssel","Flevoland","Gelderland","Utrecht","Noord-Holland","Zuid-Holland","Zeeland","Noord-Brabant","Limburg"];

// Initialize selected axis and years used in both graphs.
var selectedProvince = [];
var selectedProvinceName = []; // this one is generally used
var selectedToPlot = []; 

// to add "Nederland" if we always want to show the country average irrespective of selection
var showAverageNL = true;
if (showAverageNL) {
    var selectedToPlot = [dataKeyHelperArray[0]]; 
}

// initial names of the x and y Data to display
var yData = "GemiddeldeVerkoopprijs";
var xData = "Perioden";

var yData2 = "GemiddeldeVerkoopprijs";
var xData2 = "Perioden";


function returnValuesOfPath(d) {
    v = sumstat[dataKeyHelperArray.indexOf(d.properties.name)].values;
    return v[v.length-1][yData]; // de index hier kan afhankelijk worden gemaakt van jaargetal!!
}

function setColorPalettes() {
    // this palette is dependent on the categorical data i.e. the province names
    res = sumstat.map(function (d) { return d.key }) 
    colorGraph = d3.scaleOrdinal()
        .domain(res)
        .range(d3.schemeSet3);

    // create color Pallete for use in the map dependent on data values
    colorMap = d3.scaleSequential()
        .domain(d3.extent(data_glob, function (d) { if(!d.RegioS.includes("NL")){return +d[yData];} }))

        // viable options part of same scheme: Magma, Viridis, Plasma, Inferno, Cividis
        .interpolator(d3.interpolateCividis);

    // add color to the map here, when we are sure of loaded data
    mapLayer.selectAll("path")
        .attr("fill", function (d) { return colorMap(returnValuesOfPath(d))});
}

// Change the axis that is selected.
function changeSelectedProvince(newSelectedProvince, newName) {
    if (!selectedProvinceName.includes(newName)){
        selectedProvince.push(newSelectedProvince);
        selectedProvinceName.push(newName)
    } else {
        selectedProvince = [];
        selectedProvinceName = [];
    }
    //changePlot(selectedProvince)
    if (showAverageNL) {
        selectedToPlot = [dataKeyHelperArray[0], selectedProvinceName].flat();
    } else {
        selectedToPlot = selectedProvinceName;
    }
    redrawLineGraph();
    // redrawScatterGraph();
}

function loadData() {
    d3.csv('datasets/dataset.csv', function (data) {
        data_glob = data
        sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
            .key(function (d) { return d.Toelichting; })
            .entries(data)

        // only after the previous has been completed can we load components dependent on the data
        setColorPalettes()
        initGraph()
        drawGraph()
        redrawMap()
        initScatter()
        drawScatter()
        buildSelectionMatrix()
        buildSelectionMatrixTime()
    })
}

loadData()

