// file for the selection matrix

// make a list of the data column names we want to assess, easy hardcoded solution for now
XindexList2 = ["Woningvoorraad", "VerkochteWoningen", "GemiddeldeVerkoopprijs", "TotaleWaardeVerkoopprijzen"];
YindexList2 = ["Woningvoorraad", "VerkochteWoningen", "GemiddeldeVerkoopprijs", "TotaleWaardeVerkoopprijzen"];

// append the svg object to the body of the page, use same sizes as for linegraph
var svgM = d3.select("#selectionMatrixContainer")
    .append("svg")
    .style("margin-left", 0)
    .style("margin-top", 10)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr('stroke', 'none')
    .attr("transform",
        "translate(" + 20 + "," + (margin.top) + ")");

var gM = svgM.append('g');

function clickSelectionMatrix() {
    data2 = d3.select(this).datum()
    xData2 = data2.xData
    yData2 = data2.yData

    if (sumstat != undefined) {
        redrawScatterGraph();
    }
}

function fillDataSelectionMatrix(xData2, yData2, w2, h2) {
    // create static plot for each selection svg/rect
    x2 = d3.scaleLinear()
        .domain(d3.extent(data_glob, function (d) { return +d[xData2]; }))
        .range([0, w2]);
    y2 = d3.scaleLinear()
        .domain([0, d3.max(data_glob, function (d) { return +d[yData2]; })])
        .range([h2, 0]);
    this.append("g")
        .selectAll(".matrixLine")
        .data(sumstat)
        .enter()
        .append("path")
        .attr("class", "matrixLine")
        // .filter(function(d){return selectedToPlot.includes(d.key)})
        .attr("stroke", function (d) { return colorGraph(d.key) })
        .attr("d", function (d) {
            return d3.line()
                .x(function (d) { return x(d[xData2]); })
                .y(function (d) { return y(d[yData2]); })
                (d.values)
        })
}

function buildSelectionMatrix() {
    // spacing variable
    spacing2 = 10;
    nr2 = Math.max(XindexList2.length,YindexList2.length);
    w2 = (width2 - ((nr2 + 1) * spacing2)) / nr2
    h2 = (height2 - ((nr2 + 1) * spacing2)) / nr2

    XindexList2.forEach(function (xData2, ix) {
        YindexList2.forEach(function (yData2, iy) {
            var datum = { "xData": xData2, "yData": yData2 }
            var x2 = w2 * (ix) + (ix + 1) * spacing2
            var y2 = h2 * (iy) + (iy) * spacing2

            // Add background
            svgM.append('rect')
                .attr("width", w2 + 2 * spacing2)
                .attr("height", h2 + 2 * spacing2)
                .attr('x', x2 - spacing2)
                .attr('y', y2 - spacing2)
                .attr("fill", "#aaa")

            svgM.append("rect")
                .datum(datum)
                .attr("width", w2)
                .attr("height", h2)
                .attr('x', x2)
                .attr('y', y2)
                .attr("class", "matrixBlock")
                .on('click', clickSelectionMatrix)

            svg_rect2 = svgM.append("svg")
                .attr("width", w2)
                .attr("height", h2)
                .attr('x', x2)
                .attr('y', y2)

            fillDataSelectionMatrix.call(svg_rect2, xData2, yData2, w2, h2)

        });
    })
}


