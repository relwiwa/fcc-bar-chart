var margin = {
  top: 20,
  right: 30,
  bottom: 30,
  left:40
};
var width = 1080 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

// functions that maps values to y coords in chart
var y = d3.scale.linear()
  .range([height, 0]);

var chart = d3.select('.chart')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(error, json) {
  if (error) {
    console.error("Error happened reading JSON data");
  }
  else {
    var data = json.data;
    
    y.domain([0, d3.max(data, function(d) {
      return d[1];
    })]);
    
    var barWidth = width / data.length;
    
    var bar = chart.selectAll('g')
      .data(data)
    .enter().append('g')
      .attr('transform', function(d, i) {
        return 'translate(' + i * barWidth + ',0)';
      });
    
    bar.append('rect')
      .attr('y', function(d) {
        return y(d[1]);
      })
      .attr('height', function(d) {
        return height - y(d[1]);
      })
      .attr('width', barWidth - 1);
  } 
});

function toInteger(d) {
  d.data[1] = +d.data[1];
  return d;
}