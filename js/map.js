var screenscaling = 0.80

var width = 735 * screenscaling,
    height = 840 * screenscaling,
    centered;

var dxText = 40,
    dyText = -5;

// Set svg wi dth & height
var svg = d3.select("#mapContainer").append("svg")
    .attr('width', width)
    .attr('height', height);

var projection = d3.geo.mercator()
    // Set appropriate scale for display
    .scale(10000 * screenscaling)
    // Center the map to NL
    .center([5.3, 52.17])
    .translate([width / 2, height / 2]);

// define the 'path' variable for drawing, and its projection type
var path = d3.geo.path()
    .projection(projection);

// add definition for striped overlay
svg.append('defs')
    .append('pattern')
    .attr('id', 'diagonalHatch')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', 8)
    .attr('height', 8)
    .append('path')
    .attr('d', 'M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4')
    .attr('stroke-width', '1')
    .attr('stroke', "red") // red is a divergent color wrt viridis!

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

var highlightGraphLine = function (d) {
    // highlight the corresponding line in the lineGraph!
    var name = d.properties.name
    d3.selectAll("path.lineplotelement")
        .filter(function (d) { return d.key.valueOf() === name.valueOf(); })
        .attr("class", "lineplotelement selected")
    d3.selectAll("path.scatterplotelement")
        .filter(function (d) { return d.key.valueOf() === name.valueOf(); })
        .attr("class", "scatterplotelement selected")

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
    else {
        highlightGraphLine(d);
    }
}

// mouseout event handler, counterpart of mouseover
var mouseout = function (d) {
    d3.selectAll(".mouseOverText").remove()
    d3.selectAll(".selected")
        .attr("class", "lineplotelement")
    d3.selectAll(".selected")
        .attr("class", "scatterplotelement")

    if (!selectedProvinceName.includes(d.properties.name)) {
        d3.select(this)
            .attr('class', '')
    }
    else {
        d3.select(this)
            .attr('class', 'clickedFill')
    }
}

// clicked province event handler
var clickThis = function (d) {
    if (!selectedProvinceName.includes(d.properties.name)) {
        // reset the view
        d3.selectAll(".mouseOverText").remove()
        changeSelectedProvince(d, d.properties.name)

        // create a path clone for the striped overlay
        d3.select(this).clone(true)
            .attr("fill", "URL(#diagonalHatch)")
            .attr("id", "diagonalHatch")
            .attr('class', '')

        // provide a clicked fill and notice we still have mouseover
        d3.select(this)
            .attr("class", "mouseover clickedFill")
            
        highlightGraphLine(d);

        // provide province name with rectangle behind it for readability
        g = d3.select(this.parentNode).append('g')
            .attr("class", "clickedText")

        overlayText(d, g);

    } else {
        // in case the province clicker already was the selected province, we want to deselect it
        changeSelectedProvince(null, d.properties.name)
        d3.selectAll(".clickedText").remove()
        d3.selectAll("path#diagonalHatch").remove()

        mapLayer.selectAll("path")
            .attr('class', '')
            .attr("fill", function (d) { return colorMap(returnValuesOfPath(d)) });

        // we just clicked, so mouse is still hovering!
        mouseover.call(this, d)
    }
}

function recolorMap() {
    mapLayer.selectAll("path")
        .attr("fill", function (d) { return colorMap(returnValuesOfPath(d)) });

    // easiest to just redraw
    mapLayer.selectAll("path#diagonalHatch")
        .attr("fill", "URL(#diagonalHatch")
}

function redrawMap() {
    setColorPalettes();
    recolorMap()
}

// Load map data
d3.json('datasets/provinces_without_water.geojson', function (error, mapData) {
    // d3.json('datasets/gemeentes.geojson', function (error, mapData) {
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

