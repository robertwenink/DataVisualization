var screenscaling = 0.88

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

mapLayer.append("text")
    .text("Left click to select/deselect individually")
    .attr('x', '20')
    .attr('y', '20')
    .attr('id','leftclickinstructions')
    .attr('class','instructions')

mapLayer.append("text")
    .text("Right click to select/deselect all at once")
    .attr('x', '20')
    .attr('y', '45')
    .attr('id','rightclickinstructions')
    .attr('class','instructions')

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

    mouseoverAll(d.properties.name)

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
    mouseoutAll(d.properties.name)
}

var removeAll = function () {
    changeSelectedProvince(null)
    d3.selectAll(".clickedText").remove()
    d3.selectAll("path#diagonalHatch").remove()

    mapLayer.selectAll("path")
        .attr('class', '')
        .attr("fill", function (d) { return colorMap(returnValuesOfPath(d)) });
}

var rightclick = function (d) {
    d3.select("#rightclickinstructions").remove()
    d3.select("#leftclickinstructions").remove()
    if (!selectedProvinceName.includes(d.properties.name)) {
        removeAll()

        d3.select("#mapContainer")
            .selectAll("path")
            .each(function () {
                // use try function as there are non-map paths present without the data
                try {
                    changeSelectedProvince(d3.select(this).data()[0].properties.name)
                    g = d3.select(this.parentNode).append('g')
                        .attr("class", "clickedText")
                    overlayText(d3.select(this).data()[0], g);
                } catch { return 0 }
            })
            .clone(true)
            .attr("fill", "URL(#diagonalHatch)")
            .attr("id", "diagonalHatch")
            .attr('class', '')

    } else {
        removeAll()
    }
    // we just clicked, so mouse is still hovering!
    mouseover.call(this, d)
}

// clicked province event handler
var clickThis = function (d) {
    d3.select("#rightclickinstructions").remove()
    d3.select("#leftclickinstructions").remove()
    if (!selectedProvinceName.includes(d.properties.name)) {
        // reset the view
        d3.selectAll(".mouseOverText").remove()
        changeSelectedProvince(d.properties.name)

        // create a path clone for the striped overlay
        d3.select(this).clone(true)
            .attr("fill", "URL(#diagonalHatch)")
            .attr("id", "diagonalHatch")
            .attr('class', '')

        // provide a clicked fill and notice we still have mouseover
        d3.select(this)
            .attr("class", "mouseover")

        mouseoverAll(d.properties.name);

        // provide province name with rectangle behind it for readability
        g = d3.select(this.parentNode).append('g')
            .attr("class", "clickedText")

        overlayText(d, g);

    } else {
        // in case the province clicker already was the selected province, we want to deselect it
        RegionName = d.properties.name
        changeSelectedProvince(RegionName)
        d3.selectAll(".clickedText")
            .filter(function () { return this.innerHTML.includes(RegionName) })
            .remove()

        d3.selectAll("path#diagonalHatch")
            .filter(function (d) { try { return d.properties.name.valueOf() === RegionName } catch { return 0 } })
            .remove()

        mapLayer.selectAll("path")
            .filter(function (d) { try { return d.properties.name.valueOf() === RegionName } catch { return 0 } })
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
        .on("contextmenu", rightclick)
        .on("click", clickThis)
});

