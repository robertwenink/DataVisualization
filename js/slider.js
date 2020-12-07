// Set margins of slider SVG.
var sliderSVGMargin = {
    top: 0,
    right: 50,
    bottom: 0,
    left: 50
};

var sliderTrackWidth = 750 - sliderSVGMargin.left - sliderSVGMargin.right;
var sliderTrackHeight = 70 - sliderSVGMargin.top - sliderSVGMargin.bottom;

var sliderSVG = d3v4.select("#slider")
    .append("svg")
    .attr("width",
        sliderTrackWidth + sliderSVGMargin.left + sliderSVGMargin.right)
    .attr("height", sliderTrackHeight);

// Function coupling the dates to slider track.
var x = d3v4.scaleTime()
    .domain([startDate, endDate])
    .range([0, sliderTrackWidth])
    .clamp(true);

// Initialize slider class.
var slider = sliderSVG.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + sliderSVGMargin.left + "," + sliderTrackHeight / 2 + ")");

// Insert slider track.
slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])

// Insert ticks underneath slider track.
slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
    .data(x.ticks(15))
    .enter()
    .append("text")
    .attr("x", x)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .text(function(d) {
        return formatDateIntoYear(d);
    });

var selected = 1;

// Insert first handle on the track.
var firstHandle = slider
    .insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("id", "firstHandle")
    .attr("r", sliderTrackWidth / (endDate.getFullYear() - startDate.getFullYear()))
    .attr("cx", x(startDate))
    .style("fill", secondaryColor)
    .call(d3v4.drag()
        .on("start.interrupt", function() {
            slider.interrupt();
        })
        .on("start drag", function() {
            selected = 0;
            changeDates(
                x.invert(d3v4.event.x), x.invert(d3.select("#secondHandle").attr("cx")));
            d3.select("#secondHandle").style("fill", secondaryColor);
            d3.select(this)
                .style("fill", primaryColor)
                .attr("cx", x(x.invert(d3v4.event.x)));
            d3.select("#firstLabel")
                .attr("x", x(x.invert(d3v4.event.x)))
                .text(formatDate(x.invert(d3v4.event.x)));
        }));

// Insert second handle on the track.
var secondHandle = slider
    .insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("id", "secondHandle")
    .attr("r", sliderTrackWidth / (endDate.getFullYear() - startDate.getFullYear()))
    .attr("cx", x(endDate))
    .style("fill", primaryColor)
    .call(d3v4.drag()
        .on("start.interrupt", function() {
            slider.interrupt();
        })
        .on("start drag", function() {
            selected = 1;
            changeDates(
                x.invert(d3v4.event.x), x.invert(d3.select("#firstHandle").attr("cx")));
            d3.select(this)
                .style("fill", primaryColor)
                .attr("cx", x(x.invert(d3v4.event.x)));
            d3.select("#firstHandle").style("fill", secondaryColor);
            d3.select("#secondLabel")
                .attr("x", x(x.invert(d3v4.event.x)))
                .text(formatDate(x.invert(d3v4.event.x)));
        }));

//Update color of secondhandle when mode is changed.        
function updateSlider() {
    if (selected == 1) {
        slider.selectAll("#secondHandle")
            .style("fill", primaryColor)
    } else {
        slider.selectAll("#firstHandle")
            .style("fill", primaryColor)
    }
}

// Insert first label on top of handle.
var firstLabel = slider
    .append("text")
    .attr("class", "label")
    .attr("id", "firstLabel")
    .attr("text-anchor", "middle")
    .attr("x", x(startDate))
    .text(formatDate(startDate))
    .attr("transform", "translate(0," + (-25) + ")")

// Insert second label on top of handle.
var secondLabel = slider
    .append("text")
    .attr("class", "label")
    .attr("id", "secondLabel")
    .attr("text-anchor", "middle")
    .attr("x", x(endDate))
    .text(formatDate(endDate))
    .attr("transform", "translate(0," + (-25) + ")")