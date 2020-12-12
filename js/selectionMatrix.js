// file for the selection matrix

// make a list of the data column names we want to assess, easy hardcoded solution for now
indexList = ["Perioden","Woningvoorraad","VerkochteWoningen","GemiddeldeVerkoopprijs","TotaleWaardeVerkoopprijzen","Inwoners15JaarOfOuder"];
nr = indexList.length;

// append the svg object to the body of the page, use same sizes as for linegraph
var svgM = d3.select("#selectionMatrixContainer")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr('stroke','none')
    .attr("transform",
        "translate(" + margin.left + "," + (margin.top) + ")");

// Add background
svgM.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr("fill","#aaa")

var g = svgM.append('g');

// spacing variable
var spacing = 10;
var w = (width-((nr+1)*spacing))/nr
var h = (height-((nr+1)*spacing))/nr

indexList.forEach(function(xData,ix) {
    indexList.forEach(function(yData,iy) {
        svgM.append("rect")
            .attr("width",w)
            .attr("height",h)
            .attr('x',w*(ix)+(ix+1)*spacing) 
            .attr('y',h*(iy)+(iy+1)*spacing) 
            .attr("fill","black")
            .attr('stroke-width', '3')
            .attr('xData',xData)
            .attr('yData',yData)
    }); 
});