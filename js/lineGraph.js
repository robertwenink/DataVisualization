// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

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

//Read the data
d3.csv('datasets/dataset.csv', function(data) {

    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d.name;})
        .entries(data);

        // Add X axis --> it is a date format
    var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.Index; }))
    .range([ 0, width ]);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5));

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.PrijsindexVerkoopprijzen_1; })])
    .range([ height, 0 ]);
    svg.append("g")
    .call(d3.axisLeft(y));

    // color palette
    var res = sumstat.map(function(d){ return d.key }) // list of group names
    var color = d3.scaleOrdinal()
    .domain(res)
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

    // Draw the line
    svg.selectAll(".line")
        .data(sumstat)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d.key) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
            return d3.line()
            .x(function(d) { return x(d.Index); })
            .y(function(d) { return y(d.PrijsindexVerkoopprijzen_1); })
            (d.values)
    })
})

// Update the line graph according to selected variable.
function setLineGraph() {
    message.selectAll(".select-province-message").remove()
    if (selectedProvince == null) {
        // Show a message suggesting an axis could be selected.
        message
            .append("text")
            .attr("class", "select-province-message")
            .text("Click on province for detailed display.")
            .style("font-size", "12px")

    } else {
        message
            .append("text")
            .attr("class", "select-province-message")
            .text("Click on province for detailed display: "+selectedProvinceName)
            .style("font-size", "12px")
    }
}

setLineGraph();