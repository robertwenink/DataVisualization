// set the dimensions and margins of the graph
var margin2 = { top: 10, right: 60, bottom: 50, left: 70 },
    width2 = 450 - margin2.left - margin2.right,
    height2 = 350 - margin2.top - margin2.bottom;

var x2, y2, points;
var t2 = d3.transition()
    .duration(500)

var startRadius = 2.5;
var endRadius = 6;

var dateUpper = endDate;
var dateLower = startDate;

// append the svg object to the body of the page
var svg2 = d3.select("#scatterGraphContainer")
    .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin2.left + "," + margin2.top + ")");

// Message indiciting axis could be selected.
var message2 = svg2.append("g")
    .attr("class", "message")

// this function initialises the scatterGraph and read the data into the global sumstat!
function initScatter() {
    data = data_glob
    // Add X axis --> it is a date format
    x2 = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return +d[xData2]; }))
        .range([0, width2]);
    svg2.append("g")
        .attr("transform", "translate(0," + height2 + ")")
        .attr("class", "xaxis")
        .call(d3.axisBottom(x2))

    // Add Y axis
    y2 = d3.scaleLinear()
        .domain([Math.min(d3.min(data, function (d) { return +d[yData]; }), 0), d3.max(data, function (d) { return +d[yData]; })])
        .range([height2, 0]);
    svg2.append("g")
        .attr("class", "yaxis")
        .call(d3.axisLeft(y2))

    // add the X gridlines
    svg2.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height2 + ")")
        .call(d3.axisBottom(x2)
            .tickSize(-height2)
            .tickFormat("")
        )

    // add the Y gridlines
    svg2.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y2)
            .tickSize(-width2)
            .tickFormat("")
        )

    // add x-label
    svg2.append("text")
        .attr("class", "xlabel label")
        .attr("text-anchor", "middle")
        .attr("x", width2 / 2)
        .attr("y", height2 + 50)
        .text(getUnitsFullText(xData2));

    // add y-label
    svg2.append("text")
        .attr("class", "ylabel label")
        .attr("text-anchor", "middle")
        .attr("y", -53)
        .attr("x", -height2 / 2)
        .attr("transform", "rotate(-90)")
        .text(getUnitsFullText(yData));

    rescaleScatterAxis()
}


function rescaleScatterAxis() {
    // set the new names
    svg2.select(".ylabel").text(getUnitsFullText(yData))
    svg2.select(".xlabel").text(getUnitsFullText(xData2))

    data = data_glob;
    y2 = d3.scaleLinear()
        .domain([Math.min(d3.min(data, function (d) { return +d[yData]; }), 0), d3.max(data, function (d) { return +d[yData]; })])
        .range([height2, 0]);

    x2 = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return +d[xData2]; }))
        .range([0, width2]);

    svg2.selectAll(".yaxis")
        .transition(t2)
        .call(d3.axisLeft(y2))

    svg2.selectAll(".xaxis")
        .transition(t2)
        .call(d3.axisBottom(x2))
        .selectAll("text")
        .attr("y", 3)
        .attr("x", 5)
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");
}

function setTextScatter() {
    // reset DOM elements first
    message2.selectAll(".select-province-message").remove()
    if (selectedProvinceName.length == 0) {
        // Show a message suggesting an axis could be selected.
        message2
            .append("text")
            .attr("class", "select-province-message")
            .text("Click on province for detailed display.")
    } else {
        message2
            .append("text")
            .attr("class", "select-province-message")
            .text("")
        // .text("Currently selected province(s): " + selectedProvinceName)
    }
}

function mouseoverScatter(d) {
    mouseoverAll(d.Toelichting)
}

function mouseoutScatter(d) {
    mouseoutAll(d.Toelichting)
}

// Update the line graph according to selected map variables.
function drawScatter() {
    setTextScatter();

    svg2.selectAll(".scatterplotelement")
        .data(data_glob)
        .enter()
        .append("circle")
        .on('mouseover', mouseoverScatter)
        .on('mouseout', mouseoutScatter)
        .attr("class", "scatterplotelement")
        // .style("fill", function (d) { return colorGraph(d.Toelichting) })
        .style("fill", "none")
        .transition(t2)
        .attr("cx", function (d) { return x2(d[xData2]); })
        .attr("cy", function (d) { return y2(d[yData]); })
        .attr("r", function (d) { return startRadius + (endRadius-startRadius)*((d.Perioden-dateLower.getFullYear())/(dateUpper.getFullYear()-dateLower.getFullYear()))})

    //shortcut to setting point correctly while maintaining listeners
    updateScatter()
}

function updateScatter() {
    setTextScatter();

    // reset the fill of the lines
    svg2.selectAll(".scatterplotelement")
        .style("fill", "none")

    // redraw the lines with new data  
    svg2.selectAll(".scatterplotelement")
        .filter(function (d) { return (selectedToPlot.includes(d.Toelichting) && d.Perioden >= dateLower.getFullYear() && d.Perioden <= dateUpper.getFullYear() && d.Perioden%1==0) })
        .style("fill", function (d) { return colorGraph(d.Toelichting) })
        .attr("r", function (d) {return startRadius + (endRadius-startRadius)*((d.Perioden-dateLower.getFullYear())/(dateUpper.getFullYear()-dateLower.getFullYear()))})
        //.attr("fill-opacity", function (d) {return (0.5+0.5*((d.Perioden-dateLower.getFullYear())/(dateUpper.getFullYear()-dateLower.getFullYear()))**2)})
        .attr("class", "scatterplotelement")

    // to make the non-selected/ non-shown move already as well! looks better for the scatterplot
    svg2.selectAll(".scatterplotelement")
        .transition(t2)
        .attr("cx", function (d) { return x2(d[xData2]); })
        .attr("cy", function (d) { return y2(d[yData]); })
}


// Update the scatter graph according to selected values.
function redrawScatterGraph() {
    rescaleScatterAxis();
    updateScatter();
}


