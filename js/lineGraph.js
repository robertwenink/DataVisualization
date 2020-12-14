// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 70 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

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
    .attr("class", "message")

// this function initialises the lineGraph and read the data into the global sumstat!
function init() {
    d3.csv('datasets/dataset.csv', function (data) {
        data_glob = data
        sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
            .key(function (d) { return d.Toelichting; })
            .entries(data);

        // Add X axis --> it is a date format
        x = d3.scaleLinear()
            .domain(d3.extent(data, function (d) { return d[xData]; }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "xaxis")
            .call(d3.axisBottom(x).ticks(5))

        // add x-label
        svg.append("text")
            .attr("class", "xlabel label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + 30)
            .text("Perioden");

        // Add Y axis
        y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return +d[yData]; })])
            .range([height, 0]);
        svg.append("g")
            .attr("class", "yaxis")
            .call(d3.axisLeft(y))

        svg.append("text")
            .attr("class", "ylabel label")
            .attr("text-anchor", "middle")
            .attr("y", -53)
            .attr("x", -height / 2)
            .attr("transform", "rotate(-90)")
            .text(yData);

        setColorPalettes();

        // after data has been loaded we can add the NL total data
        drawGraph();
    })
}

function rescaleAxis() {
    // set the new names
    d3.select(".ylabel").text(yData)
    d3.select(".xlabel").text(xData)

    data = data_glob;
    y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d[yData]; })])
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
}

function setText() {
    // reset DOM elements first
    message.selectAll(".select-province-message").remove()
    if (selectedProvince.length == 0) {
        // Show a message suggesting an axis could be selected.
        message
            .append("text")
            .attr("class", "select-province-message")
            .text("Click on province for detailed display.")
    } else {
        message
            .append("text")
            .attr("class", "select-province-message")
            .text("Currently selected province(s): " + selectedProvinceName)
    }
}

// Update the line graph according to selected map variables.
function drawGraph() {
    setText();

    // reset lines
    d3.selectAll(".lineplotelement").remove()

    // Draw ALL the lines now to enable transition later
    svg.selectAll(".lineplotelement")
        .data(sumstat)
        .enter()
        .append("path")
        .attr("class", "lineplotelement")
        // .filter(function(d){return selectedToPlot.includes(d.key)})
        .attr("stroke", function (d) { return colorGraph(d.key) })
        .transition(t)
        .attr("d", function (d) {
            return d3.line()
                .x(function (d) { return x(d[xData]); })
                .y(function (d) { return y(d[yData]); })
                (d.values)
        })
}

function updateGraph() {
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
}


// Update the line graph according to selected yvalues.
function redrawLineGraph() {
    rescaleAxis();
    updateGraph();
}

init();
