// set the dimensions and margins of the graph
var margin = { top: 20, right: 60, bottom: 40, left: 70 },
    width = 450 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

var x, y;
var t = d3.transition()
    .duration(500)

// append the svg object to the body of the page
var svg = d3.select("#lineGraphContainer")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Message indiciting axis could be selected.
var message = svg.append("g")
    .style("font-size", "1em")
    .style("margin-bottom", "1em")
    .attr("class", "message")

// this function initialises the lineGraph and read the data into the global sumstat!
function initGraph() {
    data = data_glob
    // Add X axis --> it is a date format
    x = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return +d[xData]; }))
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "xaxis")
        .call(d3.axisBottom(x))

    // Add Y axis
    y = d3.scaleLinear()
        .domain([Math.min(d3.min(data, function (d) { return +d[yData]; }),0), d3.max(data, function (d) { return +d[yData]; })])
        .range([height, 0]);
    svg.append("g")
        .attr("class", "yaxis")
        .call(d3.axisLeft(y))

    // add the X gridlines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .tickSize(-height)
            .tickFormat("")
        )

    // add the Y gridlines
    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat("")
        )

    // add x-label
    svg.append("text")
        .attr("class", "xlabel label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .text("Year");

    // add y-label
    svg.append("text")
        .attr("class", "ylabel label")
        .attr("text-anchor", "middle")
        .attr("y", -53)
        .attr("x", -height / 2)
        .attr("transform", "rotate(-90)")
        .text(getUnitsFullText(yData));

    rescaleAxis() 
}

function rescaleAxis() {
    // set the new names
    d3.select(".ylabel").text(getUnitsFullText(yData))
    // d3.select(".xlabel").text("Year")

    data = data_glob;
    y = d3.scaleLinear()
        .domain([Math.min(d3.min(data, function (d) { return +d[yData]; }),0), d3.max(data, function (d) { return +d[yData]; })])
        .range([height, 0]);

    x = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return +d[xData]; }))
        .range([0, width]);

    svg.selectAll(".yaxis")
        .transition(t)
        .call(d3.axisLeft(y))

    svg.selectAll(".xaxis")
        .transition(t)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("y", 3)
        .attr("x", 5)
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");
}

function setText() {
    // reset DOM elements first
    message.selectAll(".select-province-message").remove()
    if (selectedProvinceName.length == 0) {
        // Show a message suggesting an axis could be selected.
        message
            .append("text")
            .attr("class", "select-province-message")
            .text("Click on province for detailed display.")
    } else {
        message
            .append("text")
            .attr("class", "select-province-message")
            .text("")
            // .text("Currently selected province(s): " + selectedProvinceName)
    }
}

function mouseoverGraph(d) {
    mouseoverAll(d.key)
}

function mouseoutGraph(d) {
    mouseoutAll(d.key)
}

// Update the line graph according to selected map variables.
function drawGraph() {
    setText();

    // Draw ALL the lines now to enable transition later
    svg.selectAll(".lineplotelement")
        .data(sumstat)
        .enter()
        .append("path")
        .attr("class", "lineplotelement")
        .attr("stroke", function (d) { return colorGraph(d.key) })
        .on('mouseover', mouseoverGraph)
        .on("mouseout", mouseoutGraph)
        .transition(t)
        .attr("d", function (d) {
            return d3.line()
                .x(function (d) { return x(d[xData]); })
                .y(function (d) { return y(d[yData]); })
                (d.values)
        })
        
        // shortcut to setting the graph correctly
        updateGraph()
}

function updateGraph() {
    setText();

    // redraw the lines with new data
    svg.selectAll(".lineplotelement")
        .attr("stroke", "none")

    svg.selectAll(".lineplotelement")
        .filter(function (d) { return selectedToPlot.includes(d.key) })
        .transition(t)
        .attr("stroke", function (d) { return colorGraph(d.key) })
        .attr("d", function (d) {
            return d3.line()
                .x(function (d) { return x(d[xData]); })
                .y(function (d) { return y(d[yData]); })
                (d.values)
        })
        .filter(function(d){console.log(d.key.valueOf());return d.key.valueOf() === "Nederland"})
        .style("stroke-dasharray", ("3, 3"))
}

// Update the line graph according to selected values.
function redrawLineGraph() {
    rescaleAxis();
    updateGraph();
}
