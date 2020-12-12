// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x, y;

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
            .domain(d3.extent(data, function (d) { return d.Perioden; }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(5))

        // add x-label
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + 30)
            .text("Perioden");

        // Add Y axis
        y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return +d[dataname]; })])
            .range([height, 0]);
        svg.append("g")
            .attr("class", "yaxis")
            .call(d3.axisLeft(y))

        svg.append("text")
            .attr("class", "ylabel")
            .attr("text-anchor", "middle")
            .attr("y", -53)
            .attr("x", -height / 2)
            .attr("transform", "rotate(-90)")
            .text(dataname);

        setColorPalettes();

        // after data has been loaded we can add the NL total data
        setDataNL();
    })
    setText();
}

function resetYaxis() {
    d3.select(".ylabel").text(dataname)
    d3.csv('datasets/dataset.csv', function (data) {
        y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return +d[dataname]; })])
            .range([height, 0]);

        var t = d3.transition()
            .duration(5)
        
        svg.selectAll(".yaxis")
            .transition(t)
            .call(d3.axisLeft(y))
    })
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

function setDataNL() {
    // accumulate NL only specific data
    var dataNL = [];
    function isNL(value) {
        if (value.key == "Nederland") {
            dataNL.push(value)
        }
    }
    sumstat.forEach(isNL);
    // Draw the line
    svg.selectAll(".line")
        .data(dataNL)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("class", "NLlinegraphelement")
        // .attr("stroke", function (d) { return color(d.key) })
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", function (d) {
            return d3.line()
                .x(function (d) { return x(d.Perioden); })
                .y(function (d) { return y(d[dataname]); })
                (d.values)
        })
}

// Update the line graph according to selected map variables.
function setLineGraphProvince() {
    setText();

    // reset lines
    d3.selectAll(".lineplotelement").remove()


    if (selectedProvince.length == 0) {
        setDataNL();
    } else {
        // Accumulate data to add
        data = [];
        function isProvince(value) {
            if (selectedProvinceName.includes(value.key)) {
                data.push(value)
            }
        }
        sumstat.forEach(isProvince);

        // Draw the line
        svg.selectAll(".lineplotelement")
            .data(data)
            .enter()
            .append("path")
            .attr("class", "lineplotelement")
            .attr("stroke", function (d) { return colorGraph(d.key) })
            .attr("fill", "none")
            .attr("stroke-width", 1.5)
            .attr("d", function (d) {
                return d3.line()
                    .x(function (d) { return x(d.Perioden); })
                    .y(function (d) { return y(d[dataname]); })
                    (d.values)
            })
    }
}

// Update the line graph according to selected yvalues.
function setLineGraphYValue() {
    setText();

    d3.selectAll(".NLlinegraphelement").remove()
    d3.selectAll(".lineplotelement").remove()

    setDataNL();
    resetYaxis();
    // Accumulate data to add
    data = [];

    function isProvince(value) {
        if (selectedProvinceName.includes(value.key)) {
            data.push(value)
        }
    }
    sumstat.forEach(isProvince);

    // Draw the line
    svg.selectAll(".lineplotelement")
        .data(data)
        .enter()
        .append("path")
        .attr("class", "lineplotelement")
        .attr("stroke", function (d) { return colorGraph(d.key) })
        .attr("fill", "none")
        .attr("d", function (d) {
            return d3.line()
                .x(function (d) { return x(d.Perioden); })
                .y(function (d) { return y(d[dataname]); })
                (d.values)
        })

}

init();
