
let svg = d3.select("#map");
let width = svg.attr("width");
let height = svg.attr("height");
let margin = { top: 10, right: 20, bottom: 10, left: 20
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
    //console.log(world);

    const countries = topojson.feature( world, world.objects.countries );



    // draw a world map
    const countries = topojson.feature( world, world.objects.countries );
    const countriesMesh = topojson.mesh( world, world.objects.countries );
    var projection = d3.geoMercator().fitSize( [mapWidth, mapHeight], countries );
    var path = d3.geoPath().projection( projection );

    // clean up data
    happy.forEach( (d, i) => {
      d['HappinessScore'] = Number(d['HappinessScore']);
      d['HappinessRank'] = Number(d['HappinessRank']);
      d['HumanFreedomRank'] = Number(d['HumanFreedomRank']);
      d['HumanFreedomScore'] = Number(d['HumanFreedomScore']);
    })
  
    console.log(happy);

    

    svg.selectAll("path").data(countries.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", path);

    //making color scale
    // const colorScale = d3.scaleQuantize()
    //                   .domain( [0, 10] )
    //                   .range( ['#CDDBF7', '#224499']);



    var linearScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, 600]);
    
    var colorScale = d3.scaleQuantile()
        .domain([0, 100])
        .range( ['#CDDBF7', '#224499']);
    
    d3.select('#mapLegend')
        .selectAll('rect')
        .data(happy)
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

    // map.selectAll(".country")
    //   .style("fill", d => colorScale(d.countries));



    svg.append("path")
        .datum(countriesMesh)
        .attr("class", "outline")
        .attr("d", path);

    //generating counts
    let countryCounts = {};
    let idToCountry = {};
    happy.forEach( row => {
      countryCounts[row.name] = 0;
      idToCountry[row.id] = row.name;
    })

    //making color scale
    const colorScale = d3.scaleQuantile()
                          .domain( [0, 10] )
                          .range( ['#CDDBF7', '#224499']);

    map.selectAll(".state")
        .style( "fill", d => colorScale( countryCounts[ idToCountry[d.id] ] ) );

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
        tooltip.append("div")
          .attr("class", "tooltip-content")
          .text(countryName);

    }

    function mouseLeavesPlot() {
      tooltip.style("opacity", 0);
    }





};
requestData();
