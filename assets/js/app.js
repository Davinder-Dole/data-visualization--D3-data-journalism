var data;
d3.csv("assets/data/data.csv").then(d=> {
    data=d;
    parseData();
    makeResponsive();
    console.log(data);
});

function parseData(){
    data.forEach(function(data) {
        data.income = parseFloat(data.income);
        data.smokes = parseFloat(data.smokes);
        data.healthcare = parseFloat(data.healthcare);
        data.poverty = parseFloat(data.poverty);
        data.obesity = parseFloat(data.obesity);
        data.age = parseFloat(data.age);
         });
}

var curX= 'poverty';
var curY= 'smokes';
var cRadius=15;



function makeResponsive() {
    

    // if the SVG area isn't empty when the browser loads, remove it
    // and replace it with a resized version of the chart
    var svgArea = d3.select("#scatter").select("svg");
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // SVG wrapper dimensions are determined by the current width
    // and height of the browser window.
    var svgWidth = window.innerWidth*0.8;
    var svgHeight = window.innerHeight*0.75;
  
    var margin = {
      top: 50,
      right: 50,
      bottom: 100,
      left: 100
    };
  
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;
  
      
    // append svg and group
    var svg = d3.select("#scatter")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);
  
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("class","cgroup");
  
    // scales
    var xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[curX])).nice()
        .range([0, width]);

  
    var yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[curY])).nice()
        .range([height,0]);

        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);
        
       // append axes
    chartGroup.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

    // Step 1: Append tooltip div
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${(d.state)}<br>${curX}: ${d[curX]}<br>${curY}: ${d[curY]}`);
    });
 
  // Step 2: Create the tooltip in chartGroup.
  chartGroup.call(toolTip);

     // append circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter();


      circlesGroup.append("circle")
      .attr("cx", d => xScale(d[curX]))
      .attr("cy", d => yScale(d[curY]))
      .attr("r", "15")
      .classed("stateCircle",true)
      .on("mouseover", function(d) {
        toolTip.show(d, this);
      })
        .on("mouseout", function(d) {
          toolTip.hide(d);
        });
     
      
      circlesGroup
      .append("text")
      .attr("x",  d => xScale(d[curX]))
      .attr("y", d => yScale(d[curY]))
      .text(d=> d.abbr)
      .classed("stateText",true)
      .on("mouseover", function(d) {
        toolTip.show(d, this);
      })
        .on("mouseout", function(d) {
          toolTip.hide(d);
        });;
    
  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top+40})`)
    .attr("class", "axis-text-x inactive")
    .attr("data-axis-name", "income")
    .text('Household Income (Median)');
   

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
    .attr("class", "axis-text-x active")
    .attr("data-axis-name", "poverty")
    .text('In Poverty(%)');

    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top+20})`)
    .attr("class", "axis-text-x inactive")
    .attr("data-axis-name", "age")
    .text('Age (Median)');
  
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axis-text-y inactive")
    .attr("data-axis-name", "obesity")
    .text('obesity (%)');

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+20)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axis-text-y active")
    .attr("data-axis-name", "smokes")
     .text('Smokes (%)');

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+40)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axis-text-y inactive")
    .attr("data-axis-name", "healthcare")
    .text('Lacks Healthcare (%)');

    function labelChangeX(clickedAxis) {
      d3.selectAll(".axis-text-x")
          .filter(".active")
          .classed("active", false)
          .classed("inactive", true);
     clickedAxis.classed("inactive", false).classed("active", true);
   }
  // change the y axis's status from inactive to active when clicked and change all active to inactive
  function labelChangeY(clickedAxis) {
      d3.selectAll(".axis-text-y")
          .filter(".active")
          .classed("active", false)
          .classed("inactive", true);
    clickedAxis.classed("inactive", false).classed("active", true);
  }


  // on click events for the x-axis
  d3.selectAll(".axis-text-x").on("click", function () {

    // assign the variable to the current axis
      var clickedSelection = d3.select(this);
      var isClickedSelectionInactive = clickedSelection.classed("inactive");
      console.log("this axis is inactive", isClickedSelectionInactive)
      var clickedAxis = clickedSelection.attr("data-axis-name");
      console.log("current axis: ", clickedAxis);

      if (isClickedSelectionInactive) {
          curX = clickedAxis;
          
          xScale.domain(d3.extent(data, d => d[curX])).nice()
        
          // create x-axis
          svg.select(".x-axis")
              .transition()
              .duration(1000)
              .ease(d3.easeLinear)
              .call(xAxis);

          d3.selectAll("circle")
              .transition()
              .duration(1000)
              .ease(d3.easeLinear)
              .on("start", function () {
                  d3.select(this)
                      .attr("opacity", 0.50)
                      .attr("r", 20)
              })
              .attr("cx", d=>xScale(d[curX]))
              .on("end", function () {
                  d3.select(this)
                      .transition()
                      .duration(500)
                      .attr("r", 15)
                      .attr("fill", "#4380BA")
                      .attr("opacity", 0.75);
              })
          d3.selectAll(".stateText")
                  .transition()
                  .duration(1000)
                  .ease(d3.easeLinear)
                  .attr("x", d=>xScale(d[curX]))
                  }
      labelChangeX(clickedSelection);
      })



  // On click events for the y-axis
  d3.selectAll(".axis-text-y").on("click", function () {
      // assign the variable to the current axis
      var clickedSelection = d3.select(this);
      var isClickedSelectionInactive = clickedSelection.classed("inactive");
      console.log("this axis is inactive", isClickedSelectionInactive)
      var clickedAxis = clickedSelection.attr("data-axis-name");
      console.log("current axis: ", clickedAxis);
      if (isClickedSelectionInactive) {
          curY = clickedAxis;
           yScale.domain(d3.extent(data, d => d[curY])).nice();

          // create y-axis
          svg.select(".y-axis")
              .transition()
              .duration(1000)
              .ease(d3.easeLinear)
              .call(yAxis);
          d3.selectAll("circle")
              .transition()
              .duration(1000)
              .ease(d3.easeLinear)
              .on("start", function () {
                  d3.select(this)
                      .attr("opacity", 0.50)
                      .attr("r", 20)
              })
              .attr("cy", d=> yScale(d[curY]))
              .on("end", function () {
                  d3.select(this)
                      .transition()
                      .duration(500)
                      .attr("r", 15)
                       .attr("fill", "#4380BA")
                      .attr("opacity", 0.75);
              })

          d3.selectAll(".stateText")
              .transition()
              .duration(1000)
              .ease(d3.easeLinear)
              .attr("y", d=> yScale(d[curY])
              )
          labelChangeY(clickedSelection);
      }
  });
};

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);


