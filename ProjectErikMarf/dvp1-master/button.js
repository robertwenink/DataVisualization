// File for button handling (select modes).

var div = d3.selectAll("#buttons");

div.append("text")
    .text("Show: ")

div.append("button")
    .text("Weekly")
    .on('click', function() { changeMode("weekly") });

div.append("button")
    .text("Yearly")
    .on('click', function() { changeMode("yearly") });