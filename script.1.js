


  d3.csv("../data/2015happyFreedom.csv").then( function(data) {

    
    data.forEach( (d, i) => {
      d['HumanFreedomScore'] =  Number(d["HumanFreedomScore"])  ;
      d['HumanFreedomRank'] =  Number(d["HumanFreedomRank"])   ;
      d['HappinessRank'] =  Number(d["HappinessRank"])   ;
      d['HappinessScore'] =  Number(d["HappinessScore"])   ;
    });

  

    console.log(data);

    let svg = d3.select("svg#scatterplot");
    let width = svg.attr("width");
    let height = svg.attr("height");
    let margin = { top: 10, right: 10, bottom: 50, left:50};
    let chartWidth = width - margin.left - margin.right; 
    let chartHeight = height - margin.top - margin.bottom;
   

    


    var g= svg.append("g").attr("transform","translate("+ margin.left + ","+ margin.top + ")");

    const happyMin = d3.min(data, d => d['HappinessScore']);
    const happyMax = d3.max(data, d => d['HappinessScore']);
    const happyScale = d3.scaleLinear()
            .domain([1, 10])
            .range([0, width]); 
   
    const freeMin = d3.min(data, d => d['HumanFreedomScore']);
    const freeMax = d3.max(data, d => d['HumanFreedomScore']);
    const freeScale = d3.scaleLinear()
                    .domain([1, 10])
                    .range([height,0]);
    const regionScale = d3.scaleOrdinal(d3.schemeCategory10);

    

    let leftAxis = d3.axisLeft(freeScale); // ticks looked fine here
    svg.append("g").attr("class", "y axis") // Not d3-required. Just helpful for styling
      .attr("transform","translate("+ (margin.left-10) +","+ margin.top +")")
      .call(leftAxis);


      let bottomAxis = d3.axisBottom(happyScale).ticks(10, d3.format("1")); 
  
    let element = svg.append("g").attr("class", "x axis")
      .attr("transform","translate("+ margin.left +","+ (margin.top + chartHeight + 10) +")");
    bottomAxis(element); 


    var div1 = d3.select("body").append("div")	
    .attr("class", "tooltip1")				
    .style("opacity", 1);

    let scatter = svg.append("g") // We make a subgroup to contain the points we are adding, and use the margins to shrink it and move it to the right place, so that it doesn't overlap our axes
          .attr("transform","translate("+margin.left+","+margin.top+")");

          data.forEach( (d, i) => {

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
                      
                      div1.html("Country: "+country+ "<br/>"+"Happiness Rank: "+happyrank+ "<br/>"+"Human Freedom Rank: "+freerank)	
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
