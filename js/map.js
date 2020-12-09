var width = 700,
    height = 900,
    centered;

var dxText = 40,
    dyText = 5;

// Set svg wi dth & height
var svg = d3.select("#mapContainer").append("svg")
.attr('width', width)
.attr('height', height);

// Add background
svg.append('rect')
.attr('class', 'background')
.attr('width', width)
.attr('height', height)

var g = svg.append('g');

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

// could be used to overlay transitioning effects
var effectLayer = g.append('g')
    .classed('effect-layer', true);

// group layer for the map
var mapLayer = g.append('g')
    .classed('map-layer', true);

// mouseover event handler
var mouseover = function (d) {
if (!selectedProvinceName.includes(d.properties.name)){
        // change the display of provinces on mouseover
        d3.select(this)
            .attr("class", "mouseover")

        // show province name on mouse over
        d3.select(this.parentNode).append("text")
            .attr('x',function(){
                return path.centroid(d)[0]-dxText;
            })
            .attr('y',function(){
                return path.centroid(d)[1]-dyText;
            })
            .attr("class", "mouseOverText")
            .text(function () {
                return d.properties.name;
            });
    }
}

// mouseout event handler, counterpart of mouseover
var mouseout = function (d) {
    d3.selectAll(".mouseOverText").remove()
    if (!selectedProvinceName.includes(d.properties.name)){
        d3.select(this)
            .attr('class', 'map-layer')
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
            .attr("class", "clickedFill");

        // add text overlay
        d3.select(this.parentNode).append("text")
        .attr('x',function(){
            return path.centroid(d)[0]-dxText;
        })
        .attr('y',function(){
            return path.centroid(d)[1]-dyText;
        })
        .attr("class", "clickedText")
        .text(function () {
            return d.properties.name;
        });
    } else {
        // in case the province clicker already was the selected province, we want to deselect it
        changeSelectedProvince(null, d.properties.name)
        d3.selectAll(".clickedText").remove()
        mapLayer.selectAll("path")
            .attr('class', 'map-layer');
    }
}

// Load map data
d3.json('datasets/provinces_without_water.geojson', function (error, mapData) {
    var features = mapData.features;

    // draw each path into the mapLayer
    mapLayer.selectAll() 
        .data(features) // de data van de json is nu gejoined aan het path element als we .enter() en append doen!!!
        .enter().append('path')
        .attr('d', path)
        .attr('vector-effect', 'non-scaling-stroke')
        .on('mouseover', mouseover)
        .on("mouseout", mouseout)
        .on("click", clickThis);
});

