d3.csv("../data/2015happyFreedom.csv").then( function(data) {

  var filtered = data.filter( d => d[ 'HumanFreedomRank' ] !== NaN &&
                                    d[ 'HumanFreedomRank' ] > 0 &&
                                    d[ 'HumanFreedomRank' ].length !== 0 &&
                                    d[ 'HumanFreedomScore' ] !== NaN &&
                                    d[ 'HumanFreedomScore' ] > 0 &&
                                    d[ 'HumanFreedomScore' ].length !== 0);

  filtered.forEach( ( d, i ) => {
    d[ 'HumanFreedomScore' ] =  Number( d[ "HumanFreedomScore" ] );
    d[ 'HumanFreedomRank' ] =  Number( d[ "HumanFreedomRank" ] );
    d[ 'HappinessRank' ] =  Number( d[ "HappinessRank" ] );
    d[ 'HappinessScore' ] =  Number( d[ "HappinessScore" ] );
  });

  let svg = d3.select( "svg#scatterplot" );
  let width = svg.attr( "width" );
  let height = svg.attr( "height" );
  let margin = { top: 10, right: 10, bottom: 50, left: 50 };
  let chartWidth = width - margin.left - margin.right;
  let chartHeight = height - margin.top - margin.bottom;

  var g = svg.append("g").attr( "transform","translate( "+ margin.left + ","+ margin.top + " ) " );

  const happyMin = d3.min( filtered, d => d[ 'HappinessScore' ] );
  const happyMax = d3.max( filtered, d => d[ 'HappinessScore' ] );
  const happyScale = d3.scaleLinear()
                        .domain( [ 1, 10 ] )
                        .range( [ 0, chartWidth ] );

  const freeMin = d3.min( filtered, d => d[ 'HumanFreedomScore' ] );
  const freeMax = d3.max( filtered, d => d[ 'HumanFreedomScore' ] );
  const freeScale = d3.scaleLinear()
                      .domain( [1, 10] )
                      .range( [ chartHeight,0 ] );
  const regionScale = d3.scaleOrdinal( d3.schemeCategory10 );

  let leftAxis = d3.axisLeft( freeScale) ;
  svg.append( "g" ).attr( "class", "y axis" )
    .attr( "transform","translate( "+ ( margin.left-10 ) +","+ ( margin.top ) +" ) " )
    .call( leftAxis );

  let bottomAxis = d3.axisBottom( happyScale ).ticks( 10 );
  let element = svg.append( "g" ).attr( "class", "x axis" )
    .attr( "transform","translate( "+ ( margin.left ) +","+ ( margin.top + chartHeight + 20 ) +" ) " );
  bottomAxis( element );

  // labels
  // x label
  svg.append( "text" )
      .attr( "class", "time" )
      .attr( "x", width / 2 )
      .attr( "y", chartHeight + 60 )
      .attr( "font-size", "14px" )
      .attr( "text-anchor", "middle" )
      .text( "Freedom Score" );

  // y label
  svg.append( "text" )
      .attr( "class", "humidity" )
      .attr( "x", - chartHeight / 2 )
      .attr( "y", 10 )
      .attr( "font-size", "14px" )
      .attr( "text-anchor", "middle" )
      .attr( "transform", "rotate( -90 ) " )
      .text( "Happiness Score" );

  // tooltip
  var div1 = d3.select( "body" ).append( "div" )
                .attr( "class", "tooltip1" )
                .style( "opacity", 1 );

  let scatter = svg.append( "g" )
        .attr( "transform","translate( " +margin.left+ ", " +margin.top+ " ) " );

  filtered.forEach( (d, i) => {
    let happy = happyScale( d[ 'HappinessScore' ] );
    let free = freeScale( d[ 'HumanFreedomScore' ] );
    let region = regionScale( d[ 'Region' ] );
    let country = d[ 'Country' ];
    let happyScore = d[ 'HappinessScore' ];
    let freeScore = d[ 'HumanFreedomScore' ];

    // Draw
    let circle = scatter.append( "circle" )
          .attr( "cx", happy )
          .attr( "cy", free )
          .attr( "r", 4 )
          .attr( "opacity", 0.8 )
          .style( "fill", region )
          .attr( "region", d[ "Region" ] )
          .attr( "nation", d[ "Country" ] )
          .on( "mouseover", function( d ) {
              div1.transition()
              .duration( 100 )
              .style( "opacity", 0.9 );
              d3.select(this).attr("r", 10);

              div1.html( "Country: " + country + "<br/>" +
                        "Happiness Score: " + happyScore + "<br/>" +
                        "Human Freedom Score: " + freeScore )
              .style( "left", ( d3.event.pageX + 15) + "px" )
              .style( "top", ( d3.event.pageY - 28 ) + "px" );
            }
          )
        .on( "mouseout", function( d ) {
            div1.transition()
            .duration( 100 )
            .style( "opacity", 0 );
            d3.select(this).attr("r", 4)
          }
        );
  });

  // // create check boxes
  // let box1 = d3.select("checkbox#box1");
  // let box2 = d3.select("checkbox#box2");
  // let box3 = d3.select("checkbox#box3");
  // let box4 = d3.select("checkbox#box4");
  // let box5 = d3.select("checkbox#box5");
  // let box6 = d3.select("checkbox#box6");
  // let box7 = d3.select("checkbox#box7");
  // let box8 = d3.select("checkbox#box8");
  // let box9 = d3.select("checkbox#box9");
  // let box10 = d3.select("checkbox#box10");

  // // If the data set’s region of the country = user-selected region
  // // AND country freedomRank is 1, 2, or 3, then print the country
  // //var userInput = document.getElementById("box1");
  // //var userInputCountry = "Albania";
  // console.log(filtered);
  // console.log(filtered[1]["Region"]);
  // if ( userInput === filtered["Region"] &&
  //     ( d["HumanFreedomRank"] === 1 ||
  //     d["HumanFreedomRank"] === 2 ||
  //     d["HumanFreedomRank"] === 3 )) {
  //   console.log( d["Country"]);
  // }

  // Regions
  regionScale.domain().forEach( function( d,i ) {
    d3.select( "#simpleLegend" )
      .append( "span" ).text( d )
      .style( "color", regionScale( d ) )
      .on( "mouseover", function() {
          scatter.selectAll( "circle" ).each( function() {
            let circle = d3.select( this );
            if ( circle.attr( "region" ) === d ) {
              circle.attr("opacity", 0.9);
            }
            else {
              circle.attr( "opacity", 0.1 );
            }
        })
      })
      .append('br');
  });

})
