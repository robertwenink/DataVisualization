var width = 700,
    height = 900,
    centered;

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

var effectLayer = g.append('g')
    .classed('effect-layer', true);

var mapLayer = g.append('g')
    .classed('map-layer', true);

var mouseover = function (d) {
    if (d.properties.name!=selectedProvinceName){
        d3.select(this).style("fill", d3.select(this).attr('stroke'))
            .attr("class", "mouseover")

        // add text
        d3.select(this.parentNode).append("text")
            .attr('x',function(){
                return path.centroid(d)[0]-40;
            })
            .attr('y',function(){
                return path.centroid(d)[1]-5;
            })
            .attr("class", "mouseOverText")//adding a label class
            .text(function () {
                return d.properties.name;
            });
    }
}

var mouseout = function (d) {
    d3.selectAll(".mouseOverText").remove()
    if (d.properties.name!=selectedProvinceName){
        d3.select(this).style("fill", d3.select(this).attr('stroke'))
            .attr('class', 'map-layer')
    }
}

var clickThis = function (d) {
    if (selectedProvince == null) {
        changeSelectedProvince(d, d.properties.name)
        d3.selectAll(".mouseOverText").remove()
        d3.select(this).style("fill",  "yellow")
            .attr("class", "clickFill");
        d3.select(this.parentNode).append("text")
        .attr('x',function(){
            return path.centroid(d)[0]-40;
        })
        .attr('y',function(){
            return path.centroid(d)[1]-5;
        })
        .attr("class", "clickText")//adding a label class
        .text(function () {
            return selectedProvinceName;
        });
    } else if (selectedProvinceName == d.properties.name) {
        changeSelectedProvince(null, "Nothing selected")
        d3.selectAll(".clickText").remove()
        d3.select(this).style("fill", d3.select(this).attr('stroke'))
            .attr('class', 'map-layer');
    } else {
        d3.selectAll(".clickText").remove()
        d3.selectAll(".clickFill").style("fill", d3.select(this).attr('stroke'))
            .attr('class', 'map-layer');
        changeSelectedProvince(d, d.properties.name)
        d3.select(this).style("fill",  "yellow")
        .attr("class", "clickFill");
        d3.select(this.parentNode).append("text")
        .attr('x',function(){
            return path.centroid(d)[0]-40;
        })
        .attr('y',function(){
            return path.centroid(d)[1]-5;
        })
        .attr("class", "clickText")//adding a label class
        .text(function () {
            return selectedProvinceName;
        });
    }
}

// Load map data
d3.json('datasets/provinces_without_water.geojson', function (error, mapData) {
    var features = mapData.features;
    console.log(features);

    // features.forEach(function (feature) {
    //     if (feature.geometry.type == "MultiPolygon") {
    //         feature.geometry.coordinates.forEach(function (polygon) {
    //             polygon.forEach(function (ring) {
    //                 // ring.reverse();
    //             })
    //         })
    //     }
    // })

    // Draw each province as a path
    var centroids = features.map(function (feature){
        return path.centroid(feature);
    });
    console.log(centroids)

    mapLayer.selectAll('path') 
        .data(features) // de data van de json is nu gejoined aan het path element als we .enter() en append doen!!!
        .enter().append('path')
        .attr('d', path)
        .attr('vector-effect', 'non-scaling-stroke')
        .on('mouseover', mouseover)
        .on("mouseout", mouseout)
        .on("click", clickThis);
});


function resize() {
    // uit het voorbeeld, nog correct implementeren
    viewWidth = window.innerWidth;
    viewHeight = window.innerHeight - 50;

    width = viewWidth - margin.left - margin.right;
    height = viewHeight - margin.top - margin.bottom;

    x.range([0, width]);
    y.range([height, 0]);

    xAxis.scale(x);
    yAxis.scale(y);

    d3.select("#container")
        .attr("width", viewWidth);

    d3.select("#vis")
        .attr("width", viewWidth)
        .attr("height", viewHeight);

    d3.select("svg")
        .attr("width", viewWidth)
        .attr("height", viewHeight);


    drawScatterplot(xValue, yValue, colorValue, sizeValue);
}

//resize();
d3.select(window).on("resize", resize);
