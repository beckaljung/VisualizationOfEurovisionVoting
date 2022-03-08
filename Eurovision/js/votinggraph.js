 /*------------------------------------------------------
    The graph element - - source : https://www.d3-graph-gallery.com/graph/connectedscatter_multi.html
 ------------------------------------------------------*/
function votinggraph(){
  // Set the widow for the graph
  var margin = {top: 10, right: 100, bottom: 30, left: 30},
  width = 1000 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;


  // The tooltip
  var tooltip = d3.select("#tooltipGraph")
    .append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .text("");

      
  // Function to draw the graph
  function creatTheGraph(toCountry, countries, euroVoting){
    // Delete the old graph
    d3.select("#the_SVG_ID").remove();

    // Create the svg graph
    var svg = d3.select("#thegraph")
      .append("svg")
      .attr("id","the_SVG_ID")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    // Get the yearspan
    var yearSpan = slider.getValYear();
    var startYear= yearSpan[0];
    var endYear= yearSpan[1];

    // Declare variables
    var numberOfObjects = Object.keys(euroVoting.Voting).length;
    var numberOfCountries = Object.keys(countries).length;
    var theWholeArray= [];
    var objects={};

    
    // Get the data for the graph
    for(var j=0; j<numberOfCountries ; j++){ 
      // Declare variabels
      var numberOf=0;
      var theValues=[];
      var fromCountry= countries[j].properties.name;
      if(countries[j].properties.name != toCountry){
        for (i = 0; i< numberOfObjects ; i++ ){
          // If the data corrosponds to the right sender, reciver, in the final, in the yearspan
          if( euroVoting.Voting[i].SemiorFinal == "f" && euroVoting.Voting[i].FromCountry == fromCountry && 
            euroVoting.Voting[i].ToCountry == toCountry && euroVoting.Voting[i].Year >= startYear && euroVoting.Voting[i].Year <= endYear ){
              var temp ={};
              // Merge the T and J voting
              if(theValues.some(e => e.time === euroVoting.Voting[i].Year)){
                var lastObj=Object.keys(theValues).length;
                var newPoints= (parseFloat(theValues[lastObj-1].value) + parseFloat(euroVoting.Voting[i].Points))/2;
                theValues[lastObj-1].value = newPoints.toString();
              }
              // Push the year and points to an array for the object
              else{
                temp ={time: euroVoting.Voting[i].Year, value: parseFloat(euroVoting.Voting[i].Points),theCountry : fromCountry};
                theValues.push(temp);
                numberOf++;
              }
          }
        }
        // Push every object, with its arrays, to theWholeArray
        objects = {name:fromCountry, values: theValues};
        theWholeArray.push(objects);
      }
    }

    // Add X axis, the years
    var x = d3.scale.linear()
      .domain([startYear,endYear])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.svg.axis().scale(x)
      .tickFormat(d3.format("d")))

    // Add Y axis, the points
    var y = d3.scale.linear()
      .domain( [0,12])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.svg.axis().scale(y).orient("left")); 
      
    // Add the lines
    var line = d3.svg.line()
      .x(function(d) { return x(+d.time) })
      .y(function(d) { return y(+d.value) })

      svg.selectAll("myLines")
        .data(theWholeArray)
        .enter()
        .append("path")
        .attr("d", function(d){ return line(d.values) } )
        .attr("class", "line")
        .attr("stroke", function(d){ return "#4A235A" })
        .style("stroke-opacity", "20%" )
        .style("stroke-width", 1)
        .style("fill", "none")
        // When hovered over
        .on("mousemove", function(d) {
          tooltip.transition()
              d3.select(this).style("stroke", d3.select(this).attr('stroke'))
              .style('stroke-opacity', "100%")
              .style("stroke-width", 2);
              tooltip.text("Points recieved from " + d.values[0].theCountry)
              return tooltip.style("visibility", "visible");
        })
        // When no logner hovered
        .on("mouseout", function(d) {
          d3.select(this).style("stroke", d3.select(this).attr('stroke')).transition().delay(5)
          .style('stroke-opacity', "20%")
          .style("stroke-width", 1);
          return tooltip.style("visibility", "hidden");
      }
      );
        
    // Add the points
    svg
      .selectAll("myDots")
      .data(theWholeArray)
      .enter()
        .append('g')
        .style("fill", function(d){ return "#23102B" }) 
        .style("fill-opacity", "20%" )                      
      .selectAll("myPoints")
      .data(function(d){ return d.values })
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.time) } )
        .attr("cy", function(d) { return y(d.value) } )
        .attr("r", 3)
        // When hovered over. 
        .on("mousemove", function(d) {
           tooltip.transition()
           d3.select(this).style("fill", d3.select(this).attr('fill'))
           .attr('fill-opacity', "100%")
           .attr("r", 6);
           tooltip.text("Points recieved from " + d.theCountry)
           return tooltip.style("visibility", "visible");
         })
         // When no longer hovered. 
         .on("mouseout", function(d) {
           d3.select(this).style("fill", d3.select(this).attr('fill'))
           .attr('fill-opacity', "20%")
           .attr("r", 3);
           return tooltip.style("visibility", "hidden");
       });
  };

  // Update the graph when the map or the slider updates
  this.updateTheGraph = function(toCountry, countries, euroVoting){
    creatTheGraph(toCountry, countries, euroVoting);
  }

}
