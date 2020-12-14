// file for the selection matrix

// make a list of the data column names we want to assess, easy hardcoded solution for now
indexList = ["Perioden", "Woningvoorraad", "VerkochteWoningen", "GemiddeldeVerkoopprijs", "TotaleWaardeVerkoopprijzen", "Inwoners15JaarOfOuder"];

// append the svg object to the body of the page, use same sizes as for linegraph
var svgM = d3.select("#selectionMatrixContainer")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr('stroke', 'none')
    .attr("transform",
        "translate(" + margin.left + "," + (margin.top) + ")");

var g = svgM.append('g');

function clickSelectionMatrix(){
    data = d3.select(this).datum()
    xData = data.xData
    yData = data.yData

    if (sumstat != undefined) {
        redrawMap();
        redrawLineGraph();
    }
}

function buildSelectionMatrix() {
    // Add background
    svgM.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr("fill", "#aaa")

    // spacing variable
    spacing = 10;
    nr = indexList.length;
    w = (width - ((nr + 1) * spacing)) / nr
    h = (height - ((nr + 1) * spacing)) / nr

    indexList.forEach(function (xData, ix) {
        indexList.forEach(function (yData, iy) {
            var datum = {"xData":xData,"yData":yData}
            svgM.append("rect")
                .datum(datum)
                .attr("width", w)
                .attr("height", h)
                .attr('x', w * (ix) + (ix + 1) * spacing)
                .attr('y', h * (iy) + (iy + 1) * spacing)
                .attr("class","matrixBlock")
                .on('click',clickSelectionMatrix)
        });
    });
}

function fillDataSelectionMatrix() {

}

buildSelectionMatrix();
