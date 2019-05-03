let worldMap = d3.select("#map");
let svgMapWidth = worldMap.attr("width");
let svgMapHeight = worldMap.attr("height");
let svgMapMargin = {
    top: -30,
    right: 20,
    bottom: 30,
    left: 20
};
const mapWidth = svgMapWidth - svgMapMargin.left - svgMapMargin.right;
const mapHeight = svgMapHeight - svgMapMargin.top - svgMapMargin.bottom;
const map = worldMap.append("g")
    .attr("transform", "translate(" + svgMapMargin.left + "," + svgMapMargin.top + ")");



window.onload = () => {
  width =  962, height = 600


var projection = d3.geoMercator()
  .scale(125)
  .translate([width / 2.5, height / 1.4]);

var svg = d3.select("#map").append("svg")
  .attr("width", width)
  .attr("height", height);
  // .attr("class", "mapSVG");

var path = d3.geoPath();

var projection = d3.geoMercator()
                   .scale(130)
                  .translate( [width / 2, height / 1.5]);

var path = d3.geoPath().projection(projection);

}
