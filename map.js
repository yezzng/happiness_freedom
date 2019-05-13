let svg = d3.select("#map");
let width = svg.attr("width");
let height = svg.attr("height");
let margin = { top: 30, right: 20, bottom: 10, left: 20 };

const mapWidth = width - margin.left - margin.right;
const mapHeight = height - margin.top - margin.bottom;
const map = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const requestData = async () => {

  // load datasets
  const world = await d3.json("../data/world_110m.json");

  let filterCountry = ['010', '304'];
  console.log(world);

  world.objects.countries.geometries = world.objects.countries.geometries.filter(d => {
    return filterCountry.indexOf(d.id.toString().padStart(3, '0')) === -1;
  });


  const happy = await d3.csv("../data/2015happyFreedom.csv");

  // draw a world map
  var countries = topojson.feature( world, world.objects.countries );
  var countriesMesh = topojson.mesh( world, world.objects.countries );
  var projection = d3.geoMercator().fitSize( [mapWidth, mapHeight], countries );
  var path = d3.geoPath().projection( projection );

  // clean up data
  var filtered = happy.filter(d => d[ 'HumanFreedomRank' ] !== NaN &&
                                    d[ 'HumanFreedomRank' ] > 0 &&
                                    d[ 'HumanFreedomRank' ].length !== 0 &&
                                    d[ 'HumanFreedomScore' ] !== NaN &&
                                    d[ 'HumanFreedomScore' ] > 0 &&
                                    d[ 'HumanFreedomScore' ].length !== 0 );

  // generate counts in order to make a color scale
  var score = [];
  filtered.forEach( (d, i) => {
    score[ i ] = Number( d[ 'HappinessScore' ] );
    d[ 'HappinessRank' ] = Number( d[ 'HappinessRank' ] );
    d[ 'HumanFreedomRank' ] = Number( d[ 'HumanFreedomRank' ] );
    d[ 'HumanFreedomScore' ] = Number( d[ 'HumanFreedomScore' ] );
  });


const minMax = [0, 10];


  //create color scale
  var color = d3.scaleLinear()
                .domain( [ 1, 10 ] )
                .range( [ '#CDDBF7', '#224499' ] );
                // .clamp( true )
                // .interpolate( d3.interpolateHcl );

  // create tooltip to show name of the country and scores
  var div2 = d3.select( "body" ).append("div")
        .attr( "class", "tooltip1" )
        .style( "opacity", 1 );

  // mouse on and off for tooltip
  svg.selectAll( "path" ).data( countries.features )
      .enter()
      .append( "path" )
      .attr( "class", "country" )
      .attr("d", path)
      .style( "fill", ( d,i ) => color( score[ i ] ) )
      .on( "mousemove", function( d,i ) {
        count = d.id;
        countryf = happy.filter( d => d[ 'Id' ] == count );

        // Give tooltip a label
        countryf.forEach( ( d, i ) => {
          var score = Number( d [ 'HumanFreedomScore' ] );
          var name = d[ 'Country' ];
          div2.style( "opacity", .9 );
          div2.html( "Country: " + name + "<br/>" + "Freedom Score: " + score )
                  .style("left", ( d3.event.pageX ) + "px" )
                  .style( "top", ( d3.event.pageY - 28 ) + "px" );
          })

        //color map
        svg.selectAll( "path" ).style( "fill", ( d,i ) => color( score[ i ] ) );
        })

        .on("mouseout", function( d ) {
                div2.transition()
                    .duration(50)
                    .style("opacity", 0);
        });

  // create legend
  // d3.select('#mapLegend')
  //     .selectAll('rect')
  //     .data(filtered)
  //     .enter()
  //     .append('rect')
  //     .attr('x', function(d) {
  //       return color(d);
  //     })
  //     .attr('width', 300)
  //     .attr('height', 30)
  //     .style('fill', function(d) {
  //       return color(d);
  //     });
  //
  // 
  
  // begin class notes

  // create legend
  const legendBox = d3.select("#mapLegend");
  const legendBoxWidth = legendBox.attr("width");
  const legendBoxHeight = legendBox.attr("height");
  const barHeight = 60;
  const stepSize = 4;

  let legendMargin = { top: 40, right: 10, bottom: 20, left: 10 };

  const legendWidth = legendBoxWidth - legendMargin.left - legendMargin.right;
  const legendHeight = legendBoxHeight - legendMargin.top - legendMargin.bottom;

  const pixelScale = d3.scaleLinear().domain([0,legendWidth]).range([minMax[0],minMax[1]]);
  const barScale = d3.scaleLinear().domain(minMax[0], minMax[1]).range([0, legendWidth]);
  // const barAxis = d3.axisBottom(barScale);

  legendBox.html("");

  legendBox.append("g")
  .attr("class", "legendAxis")
  .style("stroke", "white")
  .style("stroke-width", ".5px")
  .attr("transform", "translate(" + legendMargin.left + "," + legendMargin.top + ")");
  // .call(barAxis);

  //draw rectangles
  let bar = legendBox.append("g").attr("transform","translate("+(30)+","+(10)+")")
  for (let i=0; i<legendWidth-40; i=i+stepSize) {
    bar.append("rect")
      .attr("x", i)
      .attr("y", 0)
      .attr("width", stepSize)
      .attr("height", barHeight)
      .style("fill", color( pixelScale(i) )); 
  }

  const newLocal = svg.append( "path" )
      .datum( countriesMesh )
      .attr( "class", "outline" )
      .attr( "d", path) ;

      
};

requestData();
