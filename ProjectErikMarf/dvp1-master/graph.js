// This file stores methods concerned with the radar chart.
// Code inspired by default d3 library of line graphs.

// Set the dimensions and margins of the graph
var graphSVGMargin = {
    top: 50,
    right: 20,
    bottom: 50,
    left: 60
}
var graphWidth = 632 - graphSVGMargin.left - graphSVGMargin.right
var graphHeight = 350 - graphSVGMargin.top - graphSVGMargin.bottom;

// Append SVG to body of the page.
var graphSVG = d3v4.select("#lineGraph")
    .append("svg")
    .attr("width", graphWidth + graphSVGMargin.left + graphSVGMargin.right)
    .attr("height", graphHeight + graphSVGMargin.top + graphSVGMargin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + graphSVGMargin.left + "," + graphSVGMargin.top + ")")

// Initialize axes, X uses date and Y range depends on variable.
var xAxis = d3v4.axisBottom()
    .scale(dateScale);
graphSVG.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + graphHeight + ")")
var yScale = d3v4.scaleLinear()
    .range([graphHeight, 0])
    .domain([0, 1]);
var yAxis = d3v4.axisLeft()
    .scale(yScale);
graphSVG.append("g")
    .attr("class", "y-axis")

// Append rulers, corresponding to currently selected years.
graphSVG
    .append("rect", ".ruler")
    .attr("class", "ruler")
    .attr("id", "vertical-primary-ruler")
    .attr("fill", "black")

// Message indiciting axis could be selected.
var message = graphSVG.append("g")
    .attr("class", "message")

// Line generator.
var line = d3.svg.line()
    .x(function(d) {
        return dateScale(d["date"]);
    })
    .y(function(d) {
        return yScale(d["value"]);
    })

// Update the line graph according to selected variable.
function setLineGraph() {

    if (selectedAxis == null) {
        // Show a message suggesting an axis could be selected.
        message
            .append("text")
            .attr("class", "select-axis-message")
            .attr("x", (dateScale.range()[1] + dateScale.range()[0]) / 2)
            .attr("y", graphHeight / 2)
            .attr("text-anchor", "middle")
            .text("Click on an axis for detailed display.")
            .style("font-size", "15px")

    } else {

        // Add legend.
        var legend = graphSVG.append("g")
            .attr("class", "legend")

        // Add legend line for year average.
        legend.append("line")
            .attr("x1", 205)
            .attr("y1", -48)
            .attr("x2", 235)
            .attr("y2", -48)
            .attr("class", "legend-line")
            .style("stroke", yearColor)
            .style("stroke-width", "2px")

        // Add legend line for week average.
        legend
            .append("text")
            .attr("class", "legend-text")
            .attr("x", 185)
            .attr("y", -28)
            .attr("text-anchor", "left")
            .attr("fill", "#333333")
            .text("yearly average")

        legend.append("line")
            .attr("x1", 320)
            .attr("y1", -48)
            .attr("x2", 350)
            .attr("y2", -48)
            .attr("class", "legend-line")
            .style("stroke", "steelblue")
            .style("stroke-width", "2px")

        legend
            .append("text")
            .attr("class", "legend-text")
            .attr("x", 300)
            .attr("y",-28)
            .attr("text-anchor", "left")
            .attr("fill", "#333333")
            .text("weekly average");


        // Show the data corresponding to the selected axis.
        message.selectAll(".select-axis-message").remove();
        d3.selectAll(".graphLine").remove();
        d3.selectAll(".trendLine").remove();

        // Add text under graph, explaining selected feature.
        d3.select('#lineGraphText')
            .text(featureDescriptions[selectedAxis])
            .style("fill", secondaryColor)
            .style("opacity", 0.7)
            .style("font-size", "12px")
            .style("font-weight", 300);

        // Add title above graph.
        d3.select('#lineGraphTitle')
            .text(selectedAxis);

        // Add colors to graph axes and ticks.
        graphSVG.selectAll(".x-axis")
            .call(xAxis)
            .selectAll(".domain")
            .style("stroke", secondaryColor);

        // Draw y-axis.
        graphSVG.selectAll(".y-axis")
            .call(yAxis)
            .selectAll(".domain")
            .style("stroke", secondaryColor);

        // Draw ticks.
        graphSVG.selectAll(".tick")
            .selectAll("line")
            .style("stroke", secondaryColor)
            .selectAll("text")
            .style("size", "12px");

        // Add line graph line.
        graphSVG.selectAll('.graphLine')
            .data(timeSeries)
            .enter().append('path')
            .attr("class", "graphLine")
            .attr('d', function(d) {
                return line(d);
            })
            .attr('stroke-width', "1px")
            .attr('stroke', "#2A52BE")
            .attr('opacity', 0.7)
            .attr("fill", "none");

        // Add trend line.
        graphSVG.selectAll('.trendLine')
            .data(trendSeries)
            .enter().append('path')
            .attr("class", "trendLine")
            .attr('d', function(d) {
                return line(d);
            })
            .attr('stroke-width', "3px")
            .attr('stroke', yearColor)
            .attr('opacity', 0.8)
            .attr("fill", "none");
    }

    // Text label for the x axis
    graphSVG.append("text")
        .attr("class", "legend")
        .attr("transform",
            "translate(" + ((graphWidth / 2) ) + " ," +
            (graphHeight + graphSVGMargin.top ) + ")")
        .style("text-anchor", "middle")
        .text(dateXaxis);

    // Remove old y axis label 
    d3.selectAll("#Y-label").remove();

    // Text label for the y axis.
    graphSVG.append("text")
        .attr("class", "legend")
        .attr("transform", "rotate(-90)")
        .attr("id", "Y-label")
        .attr("y", 0 - graphSVGMargin.left)
        .attr("x", 0 - (graphHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(selectedAxis);
}

// Returns a pair of Y-values for primary and secondary axis by bisection.
function findYValues() {
    var data;
    if (mode == "weekly") {
        data = timeSeries;
    } else {
        data = trendSeries;
    }
    var primaryValue = null;
    var secondaryValue = null;
    for (var i = 0; i < data.length - 1; i++) {
        firstDate = data[i][0]["date"];
        secondDate = data[i][1]["date"]
        if (firstDate <= primaryDate &&
            primaryDate <= secondDate) {
            primaryValue = data[i][1]["value"];
        }
        if (firstDate <= secondaryDate &&
            secondaryDate <= secondDate) {
            secondaryValue = data[i][1]["value"];
        }
    }

    return [primaryValue, secondaryValue];
}

// Sets rulers for the selected years, reflecting value on y and x-axis.
function setLineGraphRulers() {

    var yValues = findYValues();
    var yValue = yValues[0];
    var otherYValue = yValues[1];

    if (selectedAxis != null) {
        d3.selectAll(".ruler").remove();
        d3.selectAll(".pointer").remove();

        // The id of attributes explain which object is created.
        graphSVG
            .append("rect", ".ruler")
            .attr("class", "ruler")
            .attr("id", "vertical-primary-ruler")
            .attr("fill", primaryColor)
            .attr("opacity", 0.8)
            .attr("width", 1)
            .attr("height", graphHeight - yScale(yValue))
            .attr("x", dateScale(primaryDate))
            .attr("y", yScale(yValue))

        graphSVG
            .append("rect", ".ruler")
            .attr("class", "ruler")
            .attr("id", "horizontal-primary-ruler")
            .attr("fill", primaryColor)
            .attr("opacity", 0.8)
            .attr("width", 1)
            .attr("height", dateScale(primaryDate))
            .attr("x", -yScale(yValue))
            .attr("y", 0)
            .attr("transform", "rotate(270,0,0)");

        graphSVG
            .insert("circle", ".primary-pointer")
            .attr("class", "pointer")
            .attr("r", 10)
            .attr("cx", dateScale(primaryDate))
            .attr("cy", yScale(yValue))
            .style("fill", primaryColor)

        graphSVG
            .append("rect", ".ruler")
            .attr("class", "ruler")
            .attr("id", "vertical-secondary-ruler")
            .attr("fill", secondaryColor)
            .attr("opacity", 0.8)
            .attr("width", 1)
            .attr("height", graphHeight - yScale(otherYValue))
            .attr("x", dateScale(secondaryDate))
            .attr("y", yScale(otherYValue))

        graphSVG
            .append("rect", ".ruler")
            .attr("class", "ruler")
            .attr("id", "horizontal-secondary-ruler")
            .attr("fill", secondaryColor)
            .attr("opacity", 0.8)
            .attr("width", 1)
            .attr("height", dateScale(secondaryDate))
            .attr("x", -yScale(otherYValue))
            .attr("y", 0)
            .attr("transform", "rotate(270,0,0)");

        graphSVG
            .insert("circle", ".primary-pointer")
            .attr("class", "pointer")
            .attr("r", 10)
            .attr("cx", dateScale(secondaryDate))
            .attr("cy", yScale(otherYValue))
            .style("fill", secondaryColor)
    }
}

setLineGraph();