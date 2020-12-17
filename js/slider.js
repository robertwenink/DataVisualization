// Set margins of slider SVG.
var marginSlider = { top: 10, right: 18, bottom: 15, left:18};

var sliderTrackWidth = 360 - marginSlider.left - marginSlider.right;
var sliderTrackHeight = 100 - marginSlider.top - marginSlider.bottom;

var startDate = new Date(1995, 1);
var endDate = new Date(2020, 1);

var dateUpper = endDate;

var formatDateIntoYear = d3.timeFormat("%Y");
var formatDate = d3.timeFormat("%Y");

var sliderSVG = d3.select("#slider")
    .append("svg")
    .attr("width", sliderTrackWidth + marginSlider.left + marginSlider.right)
    .attr("height", sliderTrackHeight);

// Function coupling the dates to slider track.
var x_s = d3.scaleTime()
    .domain([startDate, endDate])
    .range([0, sliderTrackWidth])
    .clamp(true);

// Initialize slider class.
var slider = sliderSVG.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + marginSlider.left + "," + sliderTrackHeight/2 + ")");

// Insert slider track.
slider.append("line")
    .attr("class", "track")
    .attr("x1", x_s.range()[0])
    .attr("x2", x_s.range()[1])

// Insert ticks underneath slider track.
slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
    .data(x_s.ticks())
    .enter()
    .append("text")
    .attr("x", x_s)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .text(function(d) {
        return formatDateIntoYear(d);
    })

// Changes the primary selected date. Can be edited via slider.
function changeDatesUpper(newUpperDate) {
    // dateUpper is a variable used by the scatterGraph!
    dateUpper = new Date(newUpperDate.getFullYear(), newUpperDate.getMonth());
    updateScatter();
}

// Changes the primary selected date. Can be edited via slider.
function changeDatesLower(newLowerDate) {
    // dateLower is a variable used by the scatterGraph!
    dateLower = new Date(newLowerDate.getFullYear(), newLowerDate.getMonth());
    updateScatter();
}

// Insert upper handle on the track.
var upperHandle = slider
    .insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("id", "upperHandle")
    .attr("r", sliderTrackWidth / (endDate.getFullYear() - startDate.getFullYear()))
    .attr("cx", x_s(endDate))
    .call(d3.drag()
        .on("start.interrupt", function() {
            slider.interrupt();
        })
        .on("start drag", function() {
            changeDatesUpper(x_s.invert(d3.event.x));
            d3.select(this)
                .attr("cx", x_s(x_s.invert(d3.event.x)));
            d3.select("#upperLabel")
                .attr("x", x_s(x_s.invert(d3.event.x)))
                .text(formatDate(x_s.invert(d3.event.x)));
        }));

// Insert lower handle on the track.
var lowerHandle = slider
    .insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("id", "lowerHandle")
    .attr("r", sliderTrackWidth / (endDate.getFullYear() - startDate.getFullYear()))
    .attr("cx", x_s(startDate))
    .call(d3.drag()
        .on("start.interrupt", function() {
            slider.interrupt();
        })
        .on("start drag", function() {
            changeDatesLower(x_s.invert(d3.event.x));
            d3.select(this)
                .attr("cx", x_s(x_s.invert(d3.event.x)));
            d3.select("#lowerLabel")
                .attr("x", x_s(x_s.invert(d3.event.x)))
                .text(formatDate(x_s.invert(d3.event.x)));
        }));

// Insert upper label on top of handle.
var firstLabel = slider
    .append("text")
    .attr("class", "label")
    .attr("id", "upperLabel")
    .attr("text-anchor", "middle")
    .attr("x", x_s(endDate))
    .text(formatDate(endDate))
    .attr("transform", "translate(0," + (-25) + ")")

// Insert lower label on top of handle.
var firstLabel = slider
    .append("text")
    .attr("class", "label")
    .attr("id", "lowerLabel")
    .attr("text-anchor", "middle")
    .attr("x", x_s(startDate))
    .text(formatDate(startDate))
    .attr("transform", "translate(0," + (-25) + ")")

// Insert label at the beginning of slider.
slider.append("text")
        .attr("class", "label")
        .attr("id", "startLabel")
        .attr("text-anchor", "middle")
        .attr("x", x_s(startDate))
        .text(formatDate(startDate))
        .attr("transform", "translate(0," + (-25) + ")")

// Insert label at the end of slider.
slider.append("text")
        .attr("class", "label")
        .attr("id", "endLabel")
        .attr("text-anchor", "middle")
        .attr("x", x_s(endDate))
        .text(formatDate(endDate))
        .attr("transform", "translate(0," + (-25) + ")")