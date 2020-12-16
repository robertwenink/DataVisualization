// Set margins of slider SVG.
var marginSlider = { top: 10, right: 15, bottom: 15, left:15};

var sliderTrackWidth = 400 - marginSlider.left - marginSlider.right;
var sliderTrackHeight = 100 - marginSlider.top - marginSlider.bottom;

var startDate = new Date(1995, 10);
var endDate = new Date(2019, 1);

var date = endDate;

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
    .data(x_s.ticks(15))
    .enter()
    .append("text")
    .attr("x", x_s)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .text(function(d) {
        return formatDateIntoYear(d);
    });

var selected = 1;

// Changes the primary selected date. Can be edited via slider.
function changeDates(newDate) {
    date = new Date(newDate.getFullYear(), newDate.getMonth());
    setScatterTime(date);
}

// Insert first handle on the track.
var firstHandle = slider
    .insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("id", "firstHandle")
    .attr("r", sliderTrackWidth / (endDate.getFullYear() - startDate.getFullYear()))
    .attr("cx", x_s(endDate))
    .call(d3.drag()
        .on("start.interrupt", function() {
            slider.interrupt();
        })
        .on("start drag", function() {
            selected = 0;
            changeDates(x_s.invert(d3.event.x));
            d3.select(this)
                .attr("cx", x_s(x_s.invert(d3.event.x)));
            d3.select("#firstLabel")
                .attr("x", x_s(x_s.invert(d3.event.x)))
                .text(formatDate(x_s.invert(d3.event.x)));
        }));

// Insert first label on top of handle.
var firstLabel = slider
    .append("text")
    .attr("class", "label")
    .attr("id", "firstLabel")
    .attr("text-anchor", "middle")
    .attr("x", x_s(endDate))
    .text(formatDate(endDate))
    .attr("transform", "translate(0," + (-25) + ")")

// // Insert second label on top of handle.
// var secondLabel = slider
//     .append("text")
//     .attr("class", "label")
//     .attr("id", "secondLabel")
//     .attr("text-anchor", "middle")
//     .attr("x", x_s(endDate))
//     .text(formatDate(endDate))
//     .attr("transform", "translate(0," + (-25) + ")")