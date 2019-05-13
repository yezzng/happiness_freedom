const width1 = 1000;
            const height1 = 600;
          	const config = {
              speed: 0.05,
              verticalTilt: -10,
              horizontalTilt: 0
            }
            let locations = [];
            const svg2 = d3.select('svg')
                .attr('width', width1).attr('height', height1);
            const markerGroup = svg2.append('g');
            const projection = d3.geoOrthographic();
            const initialScale = projection.scale();
            const path = d3.geoPath().projection(projection);
            const center = [width1/2, height1/2];

            enableRotation();
            draw();

function draw(){
    let svg = d3.select("#map2");
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
        const happy = await d3.csv("data/hap.csv");

      //  console.log(happy)
        // draw a world map
        const countries = topojson.feature( world, world.objects.countries );
        const countriesMesh = topojson.mesh( world, world.objects.countries );
      //  var projection = d3.geoGraticule().fitSize( [mapWidth, mapHeight], countries );
        var path = d3.geoPath().projection( projection );



        // clean up data
        var countryf=[];
        var filtered = happy.filter(d => d['HumanFreedomRank'] !== NaN &&
        d['HumanFreedomRank'] > 0 &&
        d['HumanFreedomRank'].length !== 0 &&
        d['HumanFreedomScore'] !== NaN &&
        d['HumanFreedomScore'] > 0 &&
        d['HumanFreedomScore'].length !== 0);
      var score=[];
      var country=[];
      var id=[];
        filtered.forEach( (d, i) => {
          score[i] = Number(d['HappinessScore']);
          country[i]=d['Country'];
          id[i]=Number(d['Id']);

          d['HappinessRank'] = Number(d['HappinessRank']);
          d['HumanFreedomRank'] = Number(d['HumanFreedomRank']);
          d['HumanFreedomScore'] = Number(d['HumanFreedomScore']);
     //   console.log(happy);
        })
      //  countryf= happy.filter(d => d['Id']=="356");

       // console.log(score[]);
        var name;
        var color=d3.scaleLinear()
        .domain([1,8])
        .range(['#CDDBF7', '#224499'])
        .clamp(true)
        .interpolate(d3.interpolateHcl);
        var arr=[];
        var div2 = d3.select("body").append("div")
        .attr("class", "tooltip1")
        .style("opacity", 1);
        svg.selectAll("path").data(countries.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .attr("d", path)
            .style( "fill",function( d,i ) {
              count = d.id;
              countryf = filtered.filter( d => d[ 'Id' ] == count );
              var score=[];
              // Give tooltip a label
              countryf.forEach( ( d, i ) => {
                score =  d [ 'HumanFreedomScore' ];
      
              })
              return color(score);
               }) //coloring the map
            .on("mouseover", function(d,i) {
                count=d.id;


                countryf= happy.filter(d => d['Id']==count);
       //         console.log("contry"+JSON.stringify(countryf));
                countryf.forEach( (d, i) => {
                 var score = Number(d['HumanFreedomScore']);
                var  name=d['Country'];
               //   id[i]=Number(d['Id']);

                div2.transition()
                  .duration(50)
                  .style("opacity", .9);

                  div2.html("Country: "+name+ "<br/>"+"Freedom Score: "+score)
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY - 28) + "px");})
                
                })
            .on("mouseout", function(d) {
                div2.transition()
                  .duration(50)
                  .style("opacity", 0);});



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

        const graticule = d3.geoGraticule()
        .step([10, 10]);

    svg2.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path)
        .style("opacity",0.5)
        .style("stroke", "#ccc");



    };
    requestData();


              

            }

            function enableRotation() {
                d3.timer(function (elapsed) {
                    projection.rotate([config.speed * elapsed - 120, config.verticalTilt, config.horizontalTilt]);
                    svg2.selectAll("path").attr("d", path);
                 
                });
            }
