// file for the selection matrix

// make a list of the data column names we want to assess, easy hardcoded solution for now
Xindex = ["Perioden"];
YindexList = ["Housing Stock", "Stock Increase", "Price Index [-]", "Houses Sold [%]", "Average Price", "Total Value Sold"];
// YindexList = ["Woningvoorraad", "VerkochteWoningen", "GemiddeldeVerkoopprijs", "TotaleWaardeVerkoopprijzen"];

// append the svg object to the body of the page, use same sizes as for linegraph
var svgMT = d3.select("#selectionMatrixTimeContainer")
    .append("svg")
    .style("margin-left", 0)
    .style("margin-top", 5)
    .attr("width", 390 + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr('stroke', 'none')
    .attr("transform",
        "translate(" + margin.left + "," + (margin.top) + ")");

var gT = svgMT.append('g');

function clickSelectionMatrixTime() {
    data = d3.select(this).datum()
    xData = data.xData
    yData = data.yData

    if (sumstat != undefined) {
        svgMT.selectAll(".matrixBlock").style("stroke", "none")
        d3.select(this).style("stroke", "black").style("stroke-width", 3)
        redrawMap();
        redrawLineGraph();
        buildSelectionMatrix();
        redrawScatterGraph();
    }
}

function fillDataSelectionMatrixTime(xData, yData) {
    // create static plot for each selection svg/rect
    x = d3.scaleLinear()
        .domain(d3.extent(data_glob, function (d) { return +d[xData]; }))
        .range([0, w]);
    y = d3.scaleLinear()
        .domain([0, d3.max(data_glob, function (d) { return +d[yData]; })])
        .range([h, 0]);
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
                .x(function (d) { return x(d[xData]); })
                .y(function (d) { return y(d[yData]); })
                (d.values)
        })
}

function buildSelectionMatrixTime() {
    // spacing variable
    spacing = 5;
    nr = Math.max(Xindex.length, YindexList.length);
    w2 = (width) / nr
    h2 = (height) / nr
    w = Math.min(w2, h2)
    h = Math.min(w2, h2)

    svgMT.append("text")
        .attr("class", 'instructions')
        .text("Click to select y-data")
        .attr("y", -8)
        .attr('x',width/2-18)
        .attr('text-anchor','middle')

    Xindex.forEach(function (xData, ix) {
        YindexList.forEach(function (yData, iy) {
            var datum = { "xData": xData, "yData": yData }
            var x = w * (ix) + (ix + 1) * spacing + width / 2
            var y = h * (iy) + (iy) * spacing

            // Add encapsulating background
            svgMT.append('rect')
                .attr("width", w + 2 * spacing)
                .attr("height", h + 2 * spacing)
                .attr('x', x - 1 * spacing)
                .attr('y', y - 1 * spacing)
                .attr("fill", "#aaa")

            // add graph background
            svgMT.append("rect")
                .datum(datum)
                .attr("width", w)
                .attr("height", h)
                .attr('x', x)
                .attr('y', y)
                .attr("class", "matrixBlock")
                .on('click', clickSelectionMatrixTime)

            // Add data label text
            svgMT.append("text")
                .text(getUnitsFullText(yData))
                .attr('x', x - 3 * spacing)
                .attr('y', y + h / 2 + 6)
                .style("font-size", "12px")
                .style("text-anchor", "end")

            // append the graph svg
            svg_rect = svgMT.append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr('x', x)
                .attr('y', y)

            fillDataSelectionMatrixTime.call(svg_rect, xData, yData)

        });
    })
}


