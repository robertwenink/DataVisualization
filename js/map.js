var width = 700,
    height = 900,
    centered;

var dxText = 40,
    dyText = -5;

// Set svg wi dth & height
var svg = d3.select("#mapContainer").append("svg")
    .attr('xmlns', "http://www.w3.org/2000/svg")
    .attr('version', "1.1")
    .attr('width', width)
    .attr('height', height);

// Add background
svg.append('rect')
    .attr('class', 'background')
    .attr('width', width)
    .attr('height', height)

var projection = d3.geo.mercator()
    // Set appropriate scale for display; TODO change according to screen size
    .scale(10000)
    // Center the map to NL
    .center([5.3, 52.2])
    .translate([width / 2, height / 2]);
// .fitSize([width, height], path);

// define the 'path' variable for drawing, and its projection type
var path = d3.geo.path()
    .projection(projection);

// group layer for the map
var mapLayer = svg.append('g')
    .classed('map-layer', true);

// function that overlays text over a province on mouseover and mouseclick
var overlayText = function (d, g) {
    rect = g.append('rect')
        .attr('x', function () {
            return path.centroid(d)[0] - dxText - 4;
        })
        .attr('y', function () {
            return path.centroid(d)[1] - dyText - 13; // for fontsize 12.
        })
        .attr('width', d.properties.name.length * 7.5)
        .attr('height', '20')
        .attr("fill", () => colorGraph(d.properties.name));

    text = g.append('text')
        .attr('text-align', "center")
        .attr('x', function () {
            return path.centroid(d)[0] - dxText;
        })
        .attr('y', function () {
            return path.centroid(d)[1] - dyText;
        })
        .text(function () {
            return d.properties.name;
        });
}

// mouseover event handler
var mouseover = function (d) {
    // change the display of provinces on mouseover
    d3.select(this)
        .attr("class", "mouseover")

    // if not displayed allready otherwise, display a text
    if (!selectedProvinceName.includes(d.properties.name)) {
        // provide province name with rectangle behind it for readability
        g = d3.select(this.parentNode).append('g')
            .attr("class", "mouseOverText")

        overlayText(d, g);
    }
}

// mouseout event handler, counterpart of mouseover
var mouseout = function (d) {
    d3.selectAll(".mouseOverText").remove()
    if (!selectedProvinceName.includes(d.properties.name)) {
        d3.select(this)
            .attr('class', '')
    }
}

// clicked province event handler
var clickThis = function (d) {
    if (!selectedProvinceName.includes(d.properties.name)) {
        // reset the view
        d3.selectAll(".mouseOverText").remove()
        changeSelectedProvince(d, d.properties.name)

        // provide another fill
        d3.select(this)
            .attr("class", "mouseover clickedFill")
            .attr("fill", function (d) { return colorGraph(d.properties.name) })

        // provide province name with rectangle behind it for readability
        g = d3.select(this.parentNode).append('g')
            .attr("class", "clickedText")

        overlayText(d, g);

    } else {
        // in case the province clicker already was the selected province, we want to deselect it
        changeSelectedProvince(null, d.properties.name)
        d3.selectAll(".clickedText").remove()
        mapLayer.selectAll("path")
            .attr('class', '')
            .attr("fill", function (d) { return colorMap(returnValuesOfPath(d)) });
        d3.select(this)
            .attr("class", "mouseover")

        // provide province name with rectangle behind it for readability
        g = d3.select(this.parentNode).append('g')
            .attr("class", "mouseOverText")

        overlayText(d, g);
    }
}

// Load map data
d3.json('datasets/provinces_without_water.geojson', function (error, mapData) {
    var features = mapData.features;

    // draw each path into the mapLayer
    mapLayer.selectAll("path")
        .data(features) // de data van de json is nu gejoined aan het path element als we .enter() en append doen!!!
        .enter().append('path')
        .attr('d', path)
        .attr('vector-effect', 'non-scaling-stroke')
        .on('mouseover', mouseover)
        .on("mouseout", mouseout)
        .on("click", clickThis)
});

