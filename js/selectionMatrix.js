// file for the selection matrix

var marginSM = { top: 10, right:15, bottom: 10, left:15},
    widthSM = 360 - marginSM.left - marginSM.right,
    heightSM = 300 - marginSM.top - marginSM.bottom;

// make a list of the data column names we want to assess, easy hardcoded solution for now
XindexList2 = ["Housing Stock", "Stock Increase", "Price Index", "Houses Sold", "Average Price", "Total Value Sold"];
// XindexList2 = ["Woningvoorraad", "VerkochteWoningen", "GemiddeldeVerkoopprijs", "TotaleWaardeVerkoopprijzen"];

// append the svg object to the body of the page, use same sizes as for linegraph
var svgM = d3.select("#selectionMatrixContainer")
    .append("svg")
    .style("margin-left", 0)
    .style("margin-top", 10)
    .attr("width", widthSM+marginSM.left+marginSM.right)
    .attr("height", 100+marginSM.top+marginSM.bottom)
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

function fillDataSelectionMatrix(xData2, yData, w2, h2) {
    // create static plot for each selection svg/rect
    x2 = d3.scaleLinear()
        .domain(d3.extent(data_glob, function (d) { return +d[xData2]; }))
        .range([0, w2]);
    y2 = d3.scaleLinear()
        .domain([0, d3.max(data_glob, function (d) { return +d[yData]; })])
        .range([h2, 0]);
    this.append("g")
        .selectAll(".matrixLine")
        .data(data_glob)
        .enter()
        .filter(function(d){return date.getFullYear() == d.Perioden})
          .append("circle")
          .attr("cx", function (d) { return x2(d[xData2]); } )
          .attr("cy", function (d) { return y2(d[yData]); } )
          .attr("r", 2.5)
          .style("fill", function (d) { return colorGraph(d.Toelichting) })
          .attr("class", "scatterplotelement")
}

function buildSelectionMatrix() {
    // spacing variable
    spacing2 = 15;
    nr2 = Math.max(XindexList2.length,1);
    w2 = (widthSM - ((nr2 + 1) * spacing2)) / nr2
    h2 = (heightSM - ((1 + 2) * spacing2)) / nr2

    XindexList2.forEach(function (xData2, ix) {
                var datum = { "xData": xData2, "yData": yData }
                var x2 = w2 * (ix) + (ix + 1) * spacing2
                var y2 = 0

                // Add background
                svgM.append('rect')
                    .attr("width", w2 + 2 * spacing2)
                    .attr("height", h2 + 4 * spacing2)
                    .attr('x', x2 - spacing2)
                    .attr('y', y2 - 2*spacing2)
                    .attr("fill", "#aaa")

                svgM.append("rect")
                    .datum(datum)
                    .attr("width", w2)
                    .attr("height", h2)
                    .attr('x', x2)
                    .attr('y', y2)
                    .attr("class", "matrixBlock")
                    .on('click', clickSelectionMatrix)

                svgM.append("text")
                    .text(xData2.split(" ")[0])
                    .attr('x', x2 + w2*0.5)
                    .attr('y', y2+h2+10)
                    .style("font-size", "9px")
                    .style("text-anchor", "middle")

                svgM.append("text")
                    .text(xData2.split(" ")[1])
                    .attr('x', x2 + w2*0.5)
                    .attr('y', y2+h2+20)
                    .style("font-size", "9px")
                    .style("text-anchor", "middle")

                svg_rect2 = svgM.append("svg")
                    .attr("width", w2)
                    .attr("height", h2)
                    .attr('x', x2)
                    .attr('y', y2)

                fillDataSelectionMatrix.call(svg_rect2, xData2, yData, w2, h2)
    });
}


