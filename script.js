window.onload = () => {
var width = 962,
    height = 600;

var projection = d3.geoMercator()
  .scale(125)
  .translate([width / 2.5, height / 1.4]);

var svg = d3.select( "#map" ).append( "svg" )
  .attr("width", width)
  .attr("height", height)
  .attr("class", "mapSVG");

var path = d3.geoPath()
  .projection(projection);

}
