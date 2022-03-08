 /*------------------------------------------------------
    Get the color for the countrys in map.js.
 ------------------------------------------------------*/

function IndividualCountryColor(data, fromCountry, toCountry) {

    // Get the yearspan
    var yearSpan= slider.getValYear();
    var startYear= yearSpan[0];
    var endYear= yearSpan[1];
    
    // Declare variables
    var totalpoints= 0;
    var antal=0;
    var numberOfObjects = Object.keys(data.Voting).length;

    // Calculate the totalnumber of points a country got from another over a certain number of years
    // and how many years it was posssible to vote for the in the final
    for (i = 0; i< numberOfObjects ; i++ ){
        if( data.Voting[i].SemiorFinal == "f" && data.Voting[i].FromCountry == fromCountry && 
            data.Voting[i].ToCountry == toCountry && data.Voting[i].Year >= startYear && data.Voting[i].Year <= endYear ){
                totalpoints+= parseFloat(data.Voting[i].Points);
                antal++;
        }
    }

    // Calculate the snittnumber per year.
    var snittPoints= 0
    if(antal != 0){
        snittPoints=  totalpoints/antal;
    }

    // Set the color
    var color = d3.interpolateRgb("#F4ECF7", "#4A235A")(snittPoints/12);

   // Return the coler the country will get
    return color;
}