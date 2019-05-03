
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

    console.log(happy);

    const countries = topojson.feature( world, world.objects.countries );

    console.log(world);

    const countriesMesh = topojson.mesh( world, world.objects.countries );
    var projection = d3.geoMercator().fitSize( [mapWidth, mapHeight], countries );
    var path = d3.geoPath().projection( projection );

    //making color scale
    const colorScale = d3.scaleSequential()
                          .domain( [0, 10] )
                          .range( ['#CDDBF7', '#224499']);

    svg.selectAll("path").data(countries.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", path);

    svg.append("path")
        .datum(countriesMesh)
        .attr("class", "outline")
        .attr("d", path);

    // create tooltip to show name of the country and data point
    var tooltip = d3.select("#mapContainer").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // mouse on and off for tooltip
    svg.selectAll('path')
        .on("mousemove", mouseOnPlot)
        .on("mouseout", mouseLeavesPlot)
        .attr("name", function (d) { return d.Country; });


    var tooltipWidth = parseFloat(tooltip.style("width"));
    var tooltipHeight = parseFloat(tooltip.style("height"));


    function mouseOnPlot() {
        // Move the tooltip
        const x = (event.pageX - (tooltipWidth / 2.0));
        const y = (event.pageY - tooltipHeight + 20);
        tooltip.style("left", x + 'px');
        tooltip.style("top", y + 'px');

        // Clear tooltip
        tooltip.html("");

        // Give tooltip a label
        let country = d3.select(this);
        tooltip.append("div").attr("class", "tooltip-label").text(happy.Country);
        tooltip.append("div").attr("class", "tooltip-label").text("Happiness Score: " + happy.HappinessScore);
        tooltip.append("div").attr("class", "tooltip-label").text("Freedom Score: " + happy.HumanFreedomScore)


        const countryName = country.attr('name');
        tooltip.append('div')
          .attr("class", "tooltip-content")
          .text(countryName);

    }

    function mouseLeavesPlot() {
      tooltip.style("opacity", 0);
    }





};
requestData();
