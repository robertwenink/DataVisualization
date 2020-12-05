// This file stores methods concerned with the radar chart.
// Code inspired by Nadieh Bremer.

// Set the dimensions and margins of the radar chart.
var radarSVGMargin = {
    top: 50,
    right: 30,
    bottom: 50,
    left: 30
}
var radarWidth = 555 - radarSVGMargin.left - radarSVGMargin.right;
var radarHeight = 555 - radarSVGMargin.top - radarSVGMargin.bottom;

// Some variables used for sizing & positioning.
var radius = radarWidth / 2.5;
var angleRadial = Math.PI * 2 / axesNames.length;
var angleDegree = 360 / axesNames.length;

function RadarChart() {

    // Fetch the data to be represented by the radar chart from globals.
    data = secondaryCharts.concat(primaryCharts);

    // Scale for the axes (radius). All variables are scaled [0,1].
    var rScale = d3.scale.linear()
        .range([0, radius])
        .domain([0, 1]);

    // Remove whatever chart with the same id/class was present before.
    d3.select(".radarChart").select("svg").remove();

    // Initiate a radar chart SVG.
    var svg = d3.select(".radarChart").append("svg")
        .attr("width", radarWidth + radarSVGMargin.left + radarSVGMargin.right)
        .attr("height",
            radarHeight + radarSVGMargin.top + radarSVGMargin.bottom)
        .attr("class", "radar" + ".radarChart");

    // Append a g element.
    var g = svg.append("g")
        .attr("transform", "translate(" + (
                radarWidth / 2 + radarSVGMargin.left) +
            "," + (radarHeight / 2 + radarSVGMargin.top) + ")");

    // Wrapper for the grid & axes.
    var axisGrid = g.append("g").attr("class", "axisWrapper");

    // Draw the background circles.
    axisGrid.selectAll(".levels")
        .data(d3.range(1, 11).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", function(d, i) { return radius / 10 * d; })
        .style("fill", "#FFFFFF")
        .style("stroke", "#8e8e8e");

    // Create the axis wrappers.
    var axis = axisGrid.selectAll(".axis")
        .data(axesNames)
        .enter().append("g")
        .attr("class", "axis")
        .attr("id", function(d) { return d });

    // Append axes rectangles.
    axis.append("rect")
        .attr("x", -4)
        .attr("y", 0)
        .attr("class", "axis-rect")
        .attr("width", 8)
        .attr("height", rScale(1))
        .attr("transform", function(d, i) {
            return "rotate(" + (180 + angleDegree * i) + ",0,0)"
        })
        .style({
            "fill": secondaryColor,
            "opacity": 0.5,
            "stroke": "2px"
        })
        .attr("id", function(d) {
            return "rect" + d;
        })

    // Append axes lines.
    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function(d, i) { return rScale(1) * Math.cos(angleRadial * i - Math.PI / 2); })
        .attr("y2", function(d, i) { return rScale(1) * Math.sin(angleRadial * i - Math.PI / 2); })
        .attr("class", "line")
        .style("stroke", "black")
        .style("stroke-width", "1px")

    // Append the labels at each axis.
    axis.append("text")
        .attr("class", "legend")
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("opacity", 1)
        .attr("dy", 0)
        .attr("x", function(d, i) {
            return rScale(1.2) * Math.cos(angleRadial * i - Math.PI / 2);
        })
        .attr("y", function(d, i) {
            return rScale(1.2) * Math.sin(angleRadial * i - Math.PI / 2) + 4;
        })
        .text(function(d) { return d; })
        .attr("id", function(d) {
            return "legend" + d;
        })
        .call(wrap)

    // Text indicating at what value each level is (in [0,1]).
    axisGrid.selectAll(".axisLabel")
        .data(d3.range(1, 11).reverse())
        .enter().append("text")
        .attr("class", "axisLabel")
        .attr("x", 4)
        .attr("y", function(d) { return -d * radius / 10; })
        .attr("text-anchor", "right")
        .attr("dy", "0.4em")
        .attr("dx", "0.4em")
        .style("font-size", "11px")
        .attr("fill", "black")
        .text(function(d, i) { return d3.format('g')(d / 10); });

    // Clickable axes.
    axisGrid.selectAll(".axis")
        .on('click', function() {
            changeSelectedAxis(this.id);
            colorSortOnSelectedAxis();
            d3.selectAll(".axis-rect")
                .style("opacity", 0.5)
                .style("fill", secondaryColor)
            d3.selectAll(".legend")
                .style("font-size", 11)
                .style("font-weight", 300)
            highlightAxis(this.id);
        })
        .on("mouseout", function() {
            if (this.id != selectedAxis) {
                d3.select("#rect" + this.id)
                    .style("opacity", 0.5)
                    .style("fill", secondaryColor)
                d3.select("#legend" + this.id)
                    .style("font-size", 11)
                    .style("font-weight", 300)
            }
        })
        .on("mouseover", function() {
            highlightAxis(this.id)
        })

    // If hovered or selected, axis rect and text should highlight.
    function highlightAxis(axisName) {
        var axisToHighlight = selectedAxis;
        if (axisName != null) {
            axisToHighlight = axisName;
        }
        d3.select("#rect" + axisToHighlight)
            .style("opacity", 0.8)
            .style("fill", "#00998F")
        d3.select("#legend" + axisToHighlight)
            .style("font-size", 13)
            .style("font-weight", 600)
    }

    // Radar line generator.
    var radarLine = d3.svg.line.radial()
        .interpolate("linear-closed")
        .radius(function(d) { return rScale(d.value); })
        .angle(function(d, i) { return i * angleRadial; })

    // Create a wrapper for the blobs.
    var blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");

    //Create the outlines of the radial shapes.
    blobWrapper.append("path")
        .attr("class", "radarStrokess")
        .attr("d", function(d, i) { return radarLine(d); })
        .style("stroke-width", "5px")
        .style("stroke", function(d, i) { secondaryColor })
        .style("fill", "none");


    // Create the strokes of the radar's shape.
    var strokes = blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function(d) { return radarLine(d); })
        .style("stroke-width", function(d) {
            if (mode == "yearly") {
                return "0px";
            }
            return "1px";
        })
        .style("opacity", 0.7)
        .style("fill", function(d) {
            if (mode == "yearly") {
                if (d[0].year == primaryYear) { return yearColor; }
                return secondaryColor;
            } else {
                return "none";
            }
        })
        .style("stroke", function(d) {
            if (mode == "yearly") {
                if (d[0].year == primaryYear) { return yearColor; }
                return secondaryColor;
            } else {
                return "none";
            }
        })
        // Give ID to strokes: index + year.
        // We've implemented this to do something more complicated, but no time, now it serves no particular purpose.
        .attr("id", function(d, i) {
            return i + d[0]["year"];
        });

    // Distinguishable colour got from https://en.wikipedia.org/wiki/Help:Distinguishable_colors.
    var strokeColors = {};

    // Color the strokes based on the min and max of the currently selected axis.
    function colorSortOnSelectedAxis() {

        setRadarChartLegend();
        if (mode == "weekly") {
            indexOfAxisToColorSortOn = null;

            if (data.length > 0) {
                var entries = data[0]
                for (var k = 0; k < entries.length; k++) {
                    var variableName = entries[k].axis;
                    if (variableName == selectedAxis) {
                        indexOfAxisToColorSortOn = k;
                        break;
                    }
                }
            }

            if (indexOfAxisToColorSortOn != null) {
                var maxOfSelectedAxis = d3.max(data,
                    function(i) {
                        if (i[indexOfAxisToColorSortOn].year == primaryYear) {
                            return i[indexOfAxisToColorSortOn].value;
                        }
                        return 0;
                    });
                var minOfSelectedAxis = d3.min(data,
                    function(i) {
                        if (i[indexOfAxisToColorSortOn].year == primaryYear) {
                            return i[indexOfAxisToColorSortOn].value;
                        }
                        return 1;
                    });
                changeColorScaleDomain(minOfSelectedAxis, maxOfSelectedAxis);
                strokes.style("stroke", function(d, i) {
                    var strokeYear = d[indexOfAxisToColorSortOn].year;
                    if (strokeYear == secondaryYear) {
                        return secondaryColor;
                    }
                    // Save color for this stroke. (Again, deprecated).
                    strokeColors[i + d[0]["year"]] =
                        d3.rgb(colorScale(d[indexOfAxisToColorSortOn].value));
                    return strokeColors[i + d[0]["year"]];
                });
            } else {
                strokes.style("stroke", "gray");
            }
        }
    }

    // Taken from http://bl.ocks.org/mbostock/7555321.
    function wrap(text) {
        text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.4, // ems
                y = text.attr("y"),
                x = text.attr("x"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > 90) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }

    // If some axis was before re-render coloured, do again for new chart.
    colorSortOnSelectedAxis();
    highlightAxis();

    // Sets the legend for this radar chart.
    function setRadarChartLegend() {

        d3.selectAll(".rdr-legend").remove();

        // Add legend.
        var legend = svg.append("g")
            .attr("class", "rdr-legend")

        if (mode == "weekly") {

            // Lines corresponding to strokes.
            legend.append("line")
                .attr("x1", 10)
                .attr("y1", 0)
                .attr("x2", 40)
                .attr("y2", 0)
                .attr("class", "rdr-legend")
                .style("stroke", "black")
                .style("opacity", 0.7)
                .style("stroke-width", "2px");

            legend.append("line")
                .attr("x1", 10)
                .attr("y1", 12)
                .attr("x2", 40)
                .attr("y2", 12)
                .attr("class", "rdr-legend")
                .style("stroke", "#810081")
                .style("opacity", 0.7)
                .style("stroke-width", "1px");

            // Text telling what strokes represent.
            legend
                .append("text")
                .attr("class", "rdr-legend")
                .attr("x", 10)
                .attr("y", 30)
                .attr("text-anchor", "left")
                .attr("fill", "#333333")
                .text("represent one chart")
                .style("font-size", "12px")
                .style("font-weight", 300);

            if (selectedAxis != null) {
                // Adding gradient: there is probably an easier way to do this... but don't know how.
                const linearGradient = svg.append("defs")
                    .append("linearGradient")
                    .attr("id", "linear-gradient");

                linearGradient.append("stop")
                    .attr("offset", "0%")
                    .attr("stop-color", "#ffa500");

                linearGradient.append("stop")
                    .attr("offset", "25%")
                    .attr("stop-color", "#e03500");

                linearGradient.append("stop")
                    .attr("offset", "50%")
                    .attr("stop-color", "#c00022");

                linearGradient.append("stop")
                    .attr("offset", "75%")
                    .attr("stop-color", "#a1005e");

                linearGradient.append("stop")
                    .attr("offset", "100%")
                    .attr("stop-color", "#810081");

                // Legend scale telling what stroke colouring represents.
                svg.append("rect")
                    .attr("class", "rdr-legend")
                    .attr("x", 10)
                    .attr("y", 50)
                    .attr("width", 60)
                    .attr("height", 12)
                    .style("fill", "url(#linear-gradient)");

                // Min, max.
                legend
                    .append("text")
                    .attr("class", "rdr-legend")
                    .attr("x", 10)
                    .attr("y", 78)
                    .attr("text-anchor", "middle")
                    .attr("fill", "#333333")
                    .text("min")
                    .style("font-size", "12px")
                    .style("font-weight", 300);

                legend
                    .append("text")
                    .attr("class", "rdr-legend")
                    .attr("x", 72)
                    .attr("y", 78)
                    .attr("text-anchor", "middle")
                    .attr("fill", "#333333")
                    .text("max")
                    .style("font-size", "12px")
                    .style("font-weight", 300);
            }
        }

        if (mode == "yearly") {
            var legend = svg.append("g")
                .attr("class", "legend")

            // Area for secondary selected year (next-to-last selected).
            legend.append("rect")
                .attr("id", "legend")
                .attr("class", "legend-area")
                .attr("x", 10)
                .attr("y", 0)
                .attr("class", "rect")
                .attr("width", 30)
                .attr("height", 15)
                .attr("fill", secondaryColor)
                .attr("opacity", 0.7);

            // Area for primary selected year (last selected).
            legend.append("rect")
                .attr("id", "legend")
                .attr("class", "legend-area")
                .attr("x", 60)
                .attr("y", 0)
                .attr("class", "rect")
                .attr("width", 30)
                .attr("height", 15)
                .attr("fill", primaryColor)
                .attr("opacity", 0.7);

            legend
                .append("text")
                .attr("class", "legend")
                .attr("x", 10)
                .attr("y", 30)
                .attr("text-anchor", "left")
                .text("represent yearly average")
                .style("font-size", "12px")
                .style("font-weight", 300);
        }
    }

    setRadarChartLegend();
}