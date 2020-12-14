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

function clickSelectionMatrix() {
    data = d3.select(this).datum()
    xData = data.xData
    yData = data.yData

    if (sumstat != undefined) {
        redrawMap();
        redrawLineGraph();
    }
}

function fillDataSelectionMatrix(xData, yData, w, h) {
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

function buildSelectionMatrix() {
    // Add background
    svgM.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr("fill", "#aaa")

    // spacing variable
    spacing = 10;
    nr = indexList.length - 1;
    w = (width - ((nr + 1) * spacing)) / nr
    h = (height - ((nr + 1) * spacing)) / nr

    indexList.forEach(function (xData, ix) {
        indexList.forEach(function (yData, iy) {
            if (ix < iy) {
                var datum = { "xData": xData, "yData": yData }
                var x = w * (ix) + (ix + 1) * spacing
                var y = h * (iy - 1) + (iy) * spacing

                rect = svgM.append("rect")
                    .datum(datum)
                    .attr("width", w)
                    .attr("height", h)
                    .attr('x', x)
                    .attr('y', y)
                    .attr("class", "matrixBlock")
                    .on('click', clickSelectionMatrix)

                svg_rect = svgM.append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    .attr('x', x)
                    .attr('y', y)

                fillDataSelectionMatrix.call(svg_rect, xData, yData, w, h)
            }
        });
    })
}


