// @TODO: YOUR CODE HERE!
var svgWidth = 800;
var svgHeight = 600;

var margins = {
  top: 30,
  right: 40,
  bottom: 50,
  left: 80
};

var width = svgWidth - margins.left - margins.right;
var height = svgHeight - margins.top - margins.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margins.left}, ${margins.top})`);

// Import Data
d3.csv("../assets/data/data.csv")
  .then(function(health_data) {

    // Managing Data
    health_data.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // Scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(health_data, d => d.poverty*1.2)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([2, d3.max(health_data, d => d.healthcare*1.2)])
      .range([height, 0]);

	// Dinamic size



    // Axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Adding Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle").data(health_data).enter();
  
    circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "lightblue")
    .attr("opacity", ".9")
    .on("click", d => toolTip.show(d));
  
  circlesGroup.append("text")
    .text(function(data){
      return data.abbr; 
    })
    .attr("dx", d => xLinearScale(d.poverty))
     .attr("dy", d => yLinearScale(d.healthcare)+10/2.5)
     .attr("font-size","9")
     .attr("class","stateText")
     .on("mouseover", function(data, index) {
       toolTip.show(data);
     d3.select(this).style("stroke","#464646")
     })
     .on("mouseout", function(data, index) {
         toolTip.hide(data)
      d3.select(this).style("stroke","#e3e3e3")
     });

    // Init tool tip
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([100, -80])
      .html(function(d) {
        return (`${d.state}<br>poverty: ${d.poverty}<br>healthcare: ${d.healthcare}`);
      });

    // Tooltip in the chart
    chartGroup.call(toolTip);



    // Axes Names
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margins.left + 30)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Health Care(%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margins.top + 10})`)
      .attr("class", "axisText")
      .text("Poverty (%)");
  });
