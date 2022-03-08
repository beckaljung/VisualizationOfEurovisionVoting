 /*------------------------------------------------------
    The map element - example from the course Practical Data Visualization and Virtual Reality (TNM093) Miniproject 2.
 ------------------------------------------------------*/

function map(){

    // Load the data for the Eurovision voting 
    var clickedOnCountry= {};
    var euroVoting = loadVoting();
    
    // Make it possible to zoom in on the map
    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", move);

    // The map 
    var mapDiv = $("#map");

    // The window for the map
    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = mapDiv.width() - margin.right - margin.left,
        height = mapDiv.height() - margin.top - margin.bottom;
        
    // Initialize tooltip
    var tooltip = d3.select("#map").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Decides the center of the map and scale
    var projection = d3.geo.mercator()
        .center([80, 30])
        .scale(200);

    // Creat the map window
    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

    // NOT SURE
    var path = d3.geo.path()
        .projection(projection);

    // Creat the svg object 
    g = svg.append("g");
    var countries={};

    // Load data and draw the map
    d3.json("data/world-topo.json", function(error, world) { 
        countries = topojson.feature(world, world.objects.countries).features;
        draw(countries,world);
    });

    // Draw the counties
    function draw(countries,data)
    {
        var country = g.selectAll(".country").data(countries);
        country.enter().insert("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("title", function(d) { return d.properties.name; })
            .style("fill", function(d) { return "#d3d3d3";}) //start color for the countries
             // task color
            // tooltip
            .on("mousemove", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
                tooltip
                .attr("style", "left:"+(mouse[0]+30)+"px;top:"+(mouse[1]+30)+"px")
                .html(d.properties.name); // see the country's name when hovered over 
            })
            .on("mouseout",  function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            // Selection when clicked on
            .on("click",  function(d) {
                selFeature(d, countries, euroVoting );
                coloruppdate(d);
                clickedOnCountry= d;
                var theYears= slider.getValYear();
                document.getElementById('divA').textContent = 'You have clicked on ' + d.properties.name + " between the years " +  theYears[0] + " and " + theYears[1] + ".";
            });

    }

    // Move on the map
    function move() {
        var t = d3.event.translate;
        var s = d3.event.scale;
        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }

    // Load the data for the voting
    function loadVoting(){
        var request = new XMLHttpRequest();
        request.open("GET", "./data/eurorating.json", false);
        request.send(null)
        var theVoting = JSON.parse(request.responseText);
        return theVoting;
    }

    // Uppdate the color when a country is clicked on
    function coloruppdate(value){
        var dt = d3.select("#map");
            dt.selectAll(".country")
                .style("fill", function(d) {  
                    
                    // Get the color for all individual countries
                    return value.properties.name == d.properties.name ? "#E5C063" : IndividualCountryColor(euroVoting, value.properties.name, d.properties.name);
                })
            
    }

    // If the values in the slider changes
    this.sliderUpdate = function(){
        // If a country is marked, then update the color of the map and the graph
       if(clickedOnCountry.properties){
           coloruppdate(clickedOnCountry);
            votegraph.updateTheGraph(clickedOnCountry.properties.name, countries, euroVoting);
            var theYears= slider.getValYear();
            document.getElementById('divA').textContent = 'You have clicked on ' + clickedOnCountry.properties.name + " between the years " +  theYears[0] + " and " + theYears[1] + ".";
        } 
    }

    // Method for selecting features of other components, SP
    function selFeature(value, countries, euroVoting){
        votegraph.updateTheGraph(value.properties.name, countries, euroVoting);
    } 

}



