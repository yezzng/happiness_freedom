


  d3.csv("../data/2015happyFreedom.csv").then( function(data) {

    
    // clean up data
    var filtered = data.filter(d => d['HumanFreedomRank'] !== NaN &&
    d['HumanFreedomRank'] > 0 &&
    d['HumanFreedomRank'].length !== 0 &&
    d['HumanFreedomScore'] !== NaN && 
    d['HumanFreedomScore'] > 0 && 
    d['HumanFreedomScore'].length !== 0);

    filtered.forEach( (d, i) => {
      d['HumanFreedomScore'] =  Number(d["HumanFreedomScore"])  ;
      d['HumanFreedomRank'] =  Number(d["HumanFreedomRank"])   ;
      d['HappinessRank'] =  Number(d["HappinessRank"])   ;
      d['HappinessScore'] =  Number(d["HappinessScore"])   ;
    });

  

    console.log(data);




    let svg2 = d3.select("#scatterplot");
    let width2 = svg2.attr("width");
    let height2 = svg2.attr("height");
    let margin2 = { top: 10, right: 10, bottom: 50, left:50};
    let chartWidth2 = width2 - margin2.left - margin2.right; 
    let chartHeight2 = height2 - margin2.top - margin2.bottom;
   

    


    var g= svg2.append("g").attr("transform","translate("+ margin2.left + ","+ margin2.top + ")");

    const happyMin = d3.min(filtered, d => d['HappinessScore']);
    const happyMax = d3.max(filtered, d => d['HappinessScore']);
    const happyScale = d3.scaleLinear()
            .domain([1, 10])
            .range([-10, width2]); 
   
    const freeMin = d3.min(filtered, d => d['HumanFreedomScore']);
    const freeMax = d3.max(filtered, d => d['HumanFreedomScore']);
    const freeScale = d3.scaleLinear()
                    .domain([1, 10])
                    .range([height2, 50]);
    const regionScale = d3.scaleOrdinal(d3.schemeCategory10);

    

    let leftAxis = d3.axisLeft(freeScale); // ticks looked fine here
    svg2.append("g").attr("class", "y axis") // Not d3-required. Just helpful for styling
      .attr("transform","translate("+ (margin2.left-10) +","+ (margin2.top - 50) +")")
      .call(leftAxis);


      let bottomAxis = d3.axisBottom(happyScale).ticks(10, d3.format("1")); 
  
    let element = svg2.append("g").attr("class", "x axis")
      .attr("transform","translate("+ (margin2.left +10) +","+ (margin2.top + chartHeight2 + 10) +")");
    bottomAxis(element); 


    var div1 = d3.select("body").append("div")	
    .attr("class", "tooltip1")				
    .style("opacity", 1);

    let scatter = svg2.append("g") // We make a subgroup to contain the points we are adding, and use the margins to shrink it and move it to the right place, so that it doesn't overlap our axes
          .attr("transform","translate("+margin2.left+","+margin2.top+")");

          filtered.forEach( (d, i) => {

            let happy = happyScale(d['HappinessScore']);
            let free = freeScale(d['HumanFreedomScore']);
            let region = regionScale(d['Region']);
            let country=d['Country'];
            let happyrank=d['HappinessRank'];
            let freerank=d['HumanFreedomRank'];
            // Draw
            let circle = scatter.append("circle")
                  .attr("cx", happy)
                  .attr("cy", free)
                  .attr("r", 4)
                  .attr("opacity", 0.8)
                  .style("fill", region)
                  .attr("region", d["Region"])
                  .attr("nation", d["Country"])
                  .on("mouseover", function(d) {		
                    div1.transition()		
                      .duration(200)		
                      .style("opacity", .9);		
                      
                      div1.html("Country: "+country+ "<br/>"+"Happiness Score: "+happy+ "<br/>"+"Human Freedom Score: "+free)	
                      .style("left", (d3.event.pageX) + "px")		
                      .style("top", (d3.event.pageY - 28) + "px");})
                .on("mouseout", function(d) {		
                    div1.transition()		
                      .duration(500)		
                      .style("opacity", 0);});	
      
          });
          
          regionScale.domain().forEach(function(d,i) {
            d3.select("#simpleLegend")
              .append("span").text(d)
              .style("color", regionScale(d))
              .on("mouseover", function() {
                scatter.selectAll("circle").each(function() {  
                  let circle = d3.select(this);
                  if (circle.attr("region") === d) {
                    circle.attr("opacity", 0.9);
                  }
                  else {
                    circle.attr("opacity", 0.1);
                  }
                })
              })
          });
          

          

        })
