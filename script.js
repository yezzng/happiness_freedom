
let svg = d3.select("#map");
let width = svg.attr("width");
let height = svg.attr("height");
let margin = { top: 30, right: 20, bottom: 10, left: 20
};
const mapWidth = width - margin.left - margin.right;
const mapHeight = height - margin.top - margin.bottom;
const map = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const requestData = async () => {

    //loading datasets
    const world = await d3.json("/data/world_110m.json");
    const happy = await d3.csv("/data/2015happyFreedom.csv");

    // check data
    console.log(happy);
    // console.log(world);

    // draw a world map
    const countries = topojson.feature( world, world.objects.countries );
    const countriesMesh = topojson.mesh( world, world.objects.countries );
    var projection = d3.geoMercator().fitSize( [mapWidth, mapHeight], countries );
    var path = d3.geoPath().projection( projection );



    // clean up data
    var filtered = happy.filter(d => d['HumanFreedomRank'] !== NaN &&
    d['HumanFreedomRank'] > 0 &&
    d['HumanFreedomRank'].length !== 0 &&
    d['HumanFreedomScore'] !== NaN && 
    d['HumanFreedomScore'] > 0 && 
    d['HumanFreedomScore'].length !== 0);
  var score=[];
    filtered.forEach( (d, i) => {
      score[i] = Number(d['HappinessScore']);
      d['HappinessRank'] = Number(d['HappinessRank']);
      d['HumanFreedomRank'] = Number(d['HumanFreedomRank']);
      d['HumanFreedomScore'] = Number(d['HumanFreedomScore']);

    })

    console.log(filtered);

    var color=d3.scaleLinear()
    .domain([1,10])
    .range(['#CDDBF7', '#224499'])
    .clamp(true)
    .interpolate(d3.interpolateHcl);


    svg.selectAll("path").data(countries.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", path)
        .style("fill", (d,i) => color(score[i]));

    //generating counts in order to make a color scale
    let countryCounts = {};
    let idToCountry = {};
    filtered.forEach( row => {
      countryCounts[row.name] = 0;
      idToCountry[row.id] = row.name;
    })

   
    
    const colorScale = d3.scaleQuantize()
    .domain( [0, 10] )
    .range( ['#00f9ff', '#0051ff']);

    // coloring in map with colors
    map.selectAll(".country")
      .style("fill", d => color(d.HumanFreedomScore));

    var linearScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, 600]);
    d3.select('#mapLegend')
        .selectAll('rect')
        .data(filtered)
        .enter()
        .append('rect')
        .attr('x', function(d) {
          return linearScale(d);
        })
        .attr('width', 300)
        .attr('height', 30)
        .style('fill', function(d) {
          return colorScale(d);
        });





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
        const y = (event.pageY - tooltipHeight - 20);
        tooltip.style("left", x + 'px');
        tooltip.style("top", y + 'px');

        // Clear tooltip
        tooltip.html("");

        // Give tooltip a label
        let country = d3.select(this);
        tooltip.append("div").attr("class", "tooltip-label").text(filtered.Country);
        tooltip.append("div").attr("class", "tooltip-label").text("Happiness Score: " + filtered.HappinessScore);
        tooltip.append("div").attr("class", "tooltip-label").text("Freedom Score: " + filtered.HumanFreedomScore)


        const countryName = country.attr('name');
        tooltip.append("div")
          .attr("class", "tooltip-content")
          .text(countryName);

    }

    function mouseLeavesPlot() {
      tooltip.style("opacity", 0);
    }





};
requestData();
