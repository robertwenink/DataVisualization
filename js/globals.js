// This file contains variables and functions used globally.
// Interaction in each component (map and line graph) is routed via this file.

//Global data variable
var sumstat;
var data_glob;

// Initialize selected axis and years used in both graphs.
var selectedProvince = [];
var selectedProvinceName = [];

var colorGraph, colorMap;
var dataKeyHelperArray = ["Nederland","Groningen","Friesland","Drenthe","Overijssel","Flevoland","Gelderland","Utrecht","Noord-Holland","Zuid-Holland","Zeeland","Noord-Brabant","Limburg"];

// dummy om aan te geven in welke data we geinteresseerd zijn, dit kan later worden ingevuld door de waarde van de dropdown
var dataname = "GemiddeldeVerkoopprijs"
// var dataname = "Woningvoorraad"

function returnValuesOfPath(d) {
    v = sumstat[dataKeyHelperArray.indexOf(d.properties.name)].values;
    return v[v.length-1][dataname] // de index hier kan afhankelijk worden gemaakt van jaargetal!!
}

function setColorPalettes() {
    // GraphColor can only be generated after the data is known!
    // this palette is dependent on the categorical data i.e. the province names
    res = sumstat.map(function (d,i) { return d.key }) // list of group names
    console.log(sumstat)
    colorGraph = d3.scaleOrdinal()
        .domain(res)
        .range(d3.schemeSet3);

    // create color Pallete for use in the map
    // this palette is dependent on the data values; it should not include the NL overall data range values!
    colorMap = d3.scaleSequential()
        .domain(d3.extent(data_glob, function (d) { if(!d.RegioS.includes("NL")){return Math.max(d[dataname]);} }))
        // select: Magma, Viridis, Plasma, Inferno, Cividis
        .interpolator(d3.interpolateCividis);
        // .interpolator(d3.interpolateViridis);

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
    setLineGraph();
}
