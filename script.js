
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

  //loading datasets
  const world = await d3.json("/world_110m.json");
  const happy = await d3.csv("data/2015happyFreedom.csv");

  const countries = topojson.feature( world, world.objects.countries );

console.log(world);
  const countriesMesh = topojson.mesh( world, world.objects.countries );
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


  console.log(happy);






};
requestData();
