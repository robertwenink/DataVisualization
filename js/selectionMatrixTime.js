// file for the selection matrix

// make a list of the data column names we want to assess, easy hardcoded solution for now
Xindex = ["Perioden"];
YindexList = ["Woningvoorraad", "VerkochteWoningen", "GemiddeldeVerkoopprijs", "TotaleWaardeVerkoopprijzen"];

// append the svg object to the body of the page, use same sizes as for linegraph
var svgMT = d3.select("#selectionMatrixTimeContainer")
    .append("svg")
    .style("margin-left", 0)
    .style("margin-top", 10)
    .attr("width", width + margin.left + margin.right)
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
    spacing = 15;
    nr = Math.max(Xindex.length,YindexList.length);
    w = (width - ((nr + 2) * spacing)) / nr
    h = (height - ((nr + 1) * spacing)) / nr

    Xindex.forEach(function (xData, ix) {
        YindexList.forEach(function (yData, iy) {
            var datum = { "xData": xData, "yData": yData }
            var x = w * (ix) + (ix + 1) * spacing
            var y = h * (iy) + (iy) * spacing

            // Add background
            svgMT.append('rect')
                .attr("width", w + 4 * spacing)
                .attr("height", h + 2 * spacing)
                .attr('x', x - 2*spacing)
                .attr('y', y - spacing)
                .attr("fill", "#aaa")

            svgMT.append("rect")
                .datum(datum)
                .attr("width", w)
                .attr("height", h)
                .attr('x', x)
                .attr('y', y)
                .attr("class", "matrixBlock")
                .on('click', clickSelectionMatrixTime)

            svgMT.append("text")
                .text(yData)
                .attr('x', 0.5*w+spacing)
                .attr('y', y)
                .style("font-size", "8px")
                .style("text-anchor", "middle")

            svg_rect = svgMT.append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr('x', x)
                .attr('y', y)

            fillDataSelectionMatrixTime.call(svg_rect, xData, yData)

        });
    })
}


