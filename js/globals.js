// This file contains variables and functions used globally.
// Interaction in each component (map and line graph) is routed via this file.

// Initialize selected axis and years used in both graphs.
var selectedProvince = null;
var selectedProvinceName = "Nothing selected";

// Change the axis that is selected.
function changeSelectedProvince(newSelectedProvince, newName) {
    selectedProvince = newSelectedProvince;
    selectedProvinceName = newName;
    setLineGraph();
}