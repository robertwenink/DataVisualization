// file for the selection matrix

var marginSM = { top: 10, right: 5, bottom: 20, left: 25 },
    widthSM = 360 - marginSM.left - marginSM.right,
    heightSM = 340 - marginSM.top - marginSM.bottom;

// make a list of the data column names we want to assess, easy hardcoded solution for now
XindexList2 = ["Housing Stock", "Stock Increase", "Price Index", "Houses Sold%", "Average Price", "Total Value Sold"];
// XindexList2 = ["Woningvoorraad", "VerkochteWoningen", "GemiddeldeVerkoopprijs", "TotaleWaardeVerkoopprijzen"];

// append the svg object to the body of the page, use same sizes as for linegraph
var svgM = d3.select("#selectionMatrixContainer")
    .append("svg")
    .style("margin-left", 0)
    .style("margin-top", 10)
    .attr("width", widthSM + marginSM.left + marginSM.right)
    .attr("height", 100 + marginSM.top + marginSM.bottom)
    .append("g")
    .attr('stroke', 'none')
    .attr("transform",
        "translate(" + (marginSM.left) + "," + (marginSM.top) + ")");

var gM = svgM.append('g');

function clickSelectionMatrix() {
    data2 = d3.select(this).datum()
    xData2 = data2.xData
    yData = data2.yData

    if (sumstat != undefined) {
        svgM.selectAll(".matrixBlock").style("stroke", "none")
        d3.select(this).style("stroke", "black").style("stroke-width", 3)
        redrawScatterGraph();
    }
}

function fillDataSelectionMatrix(xData2, yData, w, h) {
    // create static plot for each selection svg/rect
    x = d3.scaleLinear()
        .domain(d3.extent(data_glob, function (d) { return +d[xData2]; }))
        .range([0, w]);
    y = d3.scaleLinear()
        .domain([0, d3.max(data_glob, function (d) { return +d[yData]; })])
        .range([h, 0]);
    this.append("g")
        .selectAll(".matrixLine")
        .data(data_glob)
        .enter()
        .filter(function (d) { return date.getFullYear() == d.Perioden })
        .append("circle")
        .attr("cx", function (d) { return x(d[xData2]); })
        .attr("cy", function (d) { return y(d[yData]); })
        .attr("r", 2.5)
        .style("fill", function (d) { return colorGraph(d.Toelichting) })
}

function buildSelectionMatrix() {
    // spacing variable
    spacing = 5;
    nr = Math.max(Xindex.length,YindexList.length);
    w2 = (widthSM - ((nr + 2) * spacing)) / nr
    h2 = (heightSM - ((nr + 1) * spacing)) / nr
    w = Math.min(w2,h2)
    h = Math.min(w2,h2)

    XindexList2.forEach(function (xData2, ix) {
        var datum = { "xData": xData2, "yData": yData }
        var x = w * (ix) + (ix + 1) * spacing
        var y = 0

        // Add background
        svgM.append('rect')
            .attr("width", w + 2 * spacing)
            .attr("height", h + 2 * spacing)
            .attr('x', x - 1 * spacing)
            .attr('y', y - 1 * spacing)
            .attr("fill", "#aaa")

        // Add encapsulating background
        svgM.append("rect")
            .datum(datum)
            .attr("width", w)
            .attr("height", h)
            .attr('x', x)
            .attr('y', y)
            .attr("class", "matrixBlock")
            .on('click', clickSelectionMatrix)

        gg = svgM.append("g")
            .attr("transform", "translate(".concat(x+w/2+12.5,",",y+h+2*spacing,") rotate(-45)"))

        gg.append("text")
            .text(xData2)
            .style("font-size", "12px")
            .style("text-anchor", "end")


        // append the graph svg
        svg_rect2 = svgM.append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr('x', x)
            .attr('y', y)

        fillDataSelectionMatrix.call(svg_rect2, xData2, yData, w, h)
    });
}


