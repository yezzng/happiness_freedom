let svg = d3.select("#map");
let width = svg.attr("width");
let height = svg.attr("height");
let margin = {
    top: -30,
    right: 20,
    bottom: 30,
    left: 20
};
const mapWidth = width - margin.left - margin.right;
const mapHeight = height - margin.top - margin.bottom;
const map = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const requestData = async () => {
  const world = await d3.json("./world_110m.json");

  const countries = topojson.feature( world, world.objects.countries );

  const countriesMesh = topojson.mesh( world, world.objects.countires );
  var projection = d3.geoMercator().fitSize( [mapWidth, mapHeight], countries );
  var path = d3.geoPath().projection( projection );

  svg.selectAll("path").data(countries.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", path);

    svg.append("path")
        .datum(countriesMesh)
        .attr("class", "outline")
        .attr("d", path);
};
requestData();



// window.onload = () => {
//   width =  962, height = 600
//
//
// var projection = d3.geoMercator()
//   .scale(125)
//   .translate([width / 2.5, height / 1.4]);
//
// var svg = d3.select("#map").append("svg")
//   .attr("width", width)
//   .attr("height", height);
//   // .attr("class", "mapSVG");
//
// var path = d3.geoPath();
//
// var projection = d3.geoMercator()
//                    .scale(130)
//                   .translate( [width / 2, height / 1.5]);
//
// var path = d3.geoPath().projection(projection);
//
// }
