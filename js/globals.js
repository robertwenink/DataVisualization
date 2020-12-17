// This file contains variables and functions used globally.
// Interaction in each component (map and line graph) is routed via this file.

//Global data variable
var sumstat;
var data_glob;

var colorGraph, colorGraphSub, colorMap;
var dataKeyHelperArray = ["Nederland", "Groningen", "Friesland", "Drenthe", "Overijssel", "Flevoland", "Gelderland", "Utrecht", "Noord-Holland", "Zuid-Holland", "Zeeland", "Noord-Brabant", "Limburg"];

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
var yData = "Housing Stock";
var xData = "Perioden";
var xData2 = "Price Index [-]";

// this was written at a point where javascript and the d3 datastructure was not yet fully understood and could probably be improved.
function returnValuesOfPath(d) {
    v = sumstat[dataKeyHelperArray.indexOf(d.properties.name)].values;
    return v[v.length - 1][yData]; // de index hier kan eventueel afhankelijk worden gemaakt van jaargetal
}

function getUnitsFullText(textdata){
    if (textdata == "Average Price" || textdata == "Total Value Sold"){
        textdata = textdata.concat(" [€]")
    }
    return textdata
}

function setColorPalettes() {
    // this palette is dependent on the categorical data i.e. the province names
    res = sumstat.map(function (d) { return d.key })
    colorGraphSub = d3.scaleOrdinal()
        .domain(res)
        .range(d3.schemePaired);

    // create color Pallete for use in the map dependent on data values
    colorMap = d3.scaleSequential()
        .domain(d3.extent(data_glob, function (d) { if (!d.RegioS.includes("NL")) { return +d[yData]; } }))

        // viable options part of same scheme: Magma, Viridis, Plasma, Inferno, Cividis
        .interpolator(d3.interpolateCividis);

    // add color to the map here, when we are sure of loaded data
    mapLayer.selectAll("path")
        .attr("fill", function (d) { return colorMap(returnValuesOfPath(d)) });
}

function colorGraph(name) {
    // if and else statement to exclude the NL data from the categorical data of only size 12.
    if (name == "Nederland" || name.includes("NL")){
        return d3.rgb("ffffff")
    }
    else {
        return colorGraphSub(name)
    }
}

// Change the axis that is selected.
function changeSelectedProvince(newSelectedProvince, newName) {
    if (!selectedProvinceName.includes(newName)) {
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
    redrawScatterGraph();
}

// to provide linked mouseover functionality, notice that 
function mouseoverAll(RegionName) {
    // only the geo path has data structured with d.properties so use that to discern type
    d3.selectAll('path')
        .filter(function (d) { try { return d.properties.name.valueOf() === RegionName } catch { return 0 } })
        .attr("class", "mouseover")

    // highlight lineplot elements
    d3.selectAll("path.lineplotelement")
        .filter(function (d) { return d.key === RegionName; })
        .attr("class", "lineplotelement selectedElement")

    // highlight scatterplot elements
    fill = d3.rgb(colorGraph(RegionName))
    d3.selectAll('circle.scatterplotelement[style="fill: '.concat(fill, ';"]'))
        .attr("r", baseRadius * 2)
}

// to provide linked mouseout functionality
function mouseoutAll(RegionName) {
    d3.selectAll(".mouseOverText").remove()

    // only the geo path has data structured with d.properties so use that to discern type
    d3.selectAll('path')
        .filter(function (d) { try { return d.properties.name.valueOf() === RegionName } catch { return 0 } })
        .attr("class", "")

    // reset lineplot element
    d3.selectAll(".selectedElement")
        .filter(".lineplotelement")
        .attr("class", "lineplotelement")

    // reset scatterplot element
    fill = d3.rgb(colorGraph(RegionName))
    d3.selectAll('circle.scatterplotelement[style="fill: '.concat(fill, ';"]'))
        .attr("r", baseRadius)
}

// initialise the data and all components!
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
        initScatter()
        drawScatter()
        redrawMap()
        buildSelectionMatrix()
        buildSelectionMatrixTime()
    })
}

loadData()

