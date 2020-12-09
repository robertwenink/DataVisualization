// This file contains variables and functions used globally.
// Interaction in each component (map and line graph) is routed via this file.

// Initialize selected axis and years used in both graphs.
var selectedProvince = [];
var selectedProvinceName = [];
//Read the data

var sumstat_glob = [];
var data_glob = [];

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

// function changePlot(theseProvinces) {

// }