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

var yAxis = d3.svg.axis()
  .scale(y)
  .orient('left')
  .ticks(10)
  .tickFormat(function (d) {
    d = d/1000;
    return d + "k";
  });

var chart = d3.select('.chart')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var tooltip = chart
  .append('g')
    .attr('class', 'tooltip')
    .style('visibility', 'hidden')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

tooltip.append('text')
  .attr('class', 'tooltip-quarter')
  .attr('x', 30)
  .attr('y', margin.top + 10);
tooltip.append('text')
  .attr('class', 'tooltip-gdp')
  .attr('x', 200)
  .attr('y', margin.top + 10);
tooltip.append('text')
  .attr('class', 'tooltip-prev')
  .attr('x', 50)
  .attr('y', margin.top + 80)
  .text('Comparison To Previous Quarters:');
tooltip.append('text')
  .attr('class', 'tooltip-prev tooltip-prev-year')
  .attr('x', 50)
  .attr('y', margin.top + 120);
tooltip.append('text')
  .attr('class', 'tooltip-prev tooltip-prev-year-gdp')
  .attr('x', 200)
  .attr('y', margin.top + 120);
tooltip.append('text')
  .attr('class', 'tooltip-prev tooltip-prev-quarter')
  .attr('x', 50)
  .attr('y', margin.top + 170);
tooltip.append('text')
  .attr('class', 'tooltip-prev tooltip-prev-quarter-gdp')
  .attr('x', 200)
  .attr('y', margin.top + 170);

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(error, json) {
  if (error) {
    console.error('Error happened reading JSON data');
  }
  else {
    var data = json.data;
    
    var x = d3.time.scale()
      .range([10, width])
      .domain([
        d3.min(data, function(d) {
          return new Date(d[0]);
        }),
        d3.max(data, function(d) {
          return new Date(d[0]);
        })]);

    var xAxis = d3.svg.axis()
    .orient('bottom')
    .scale(x);
    
    y.domain([0, d3.max(data, function(d) {
      return d[1];
    })]);
        
    chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);
    
    chart.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('US GDP in Billion US-$');
    
    chart.selectAll('.bar')
      .data(data)
    .enter().append('rect')
      .attr('class', function(d) {
        return 'bar q-' + d[0].substring(5, 7);
      })
      .attr('x', function(d) {
        return x(new Date(d[0]));
      })
      .attr('y', function(d) {
        return y(d[1]);
      })
      .attr('height', function(d) {
        return height - y(d[1]);
      })
      .attr('width', width/data.length + 1)
      .on('mouseover', function(d, k) {
        // build tooltip-quarter
        var currentQuarter = extractQuarter(d[0]);
        d3.select('.tooltip-quarter')
          .text(currentQuarter + ':');
        
        // build tooltip-gdp
        var formatCurr = d3.format(',.0');
        d3.select('.tooltip-gdp')
          .text(formatCurr(d3.round(d[1])) + ' Billion US-$');
      
        // build tooltip-prev-quarter
        var prevQuarter = 'No data available for previous quarter';
        if (k > 0) {
          prevQuarter = extractQuarter(data[k - 1][0]) + ':';
        }
        d3.select('.tooltip-prev-quarter')
          .text(prevQuarter);

        // build tooltip-prev-quarter-gdp
        var formatPrev = d3.format('+.2%');
        var prevQuarterGdp = '';
        if (k > 0) {
          prevQuarterGdp = formatPrev(d[1] / data[k - 1][1] - 1);
        }
        d3.select('.tooltip-prev-quarter-gdp')
          .text(prevQuarterGdp);
      
        // build tooltip-prev-year
        var prevYear = 'No data available for previous year';
        if (k > 3) {
          prevYear = extractQuarter(data[k - 4][0]) + ':';
        }
        d3.select('.tooltip-prev-year')
          .text(prevYear);
        
        // build tooltip-prev-year-gdp
        var prevYearGdp = '';
        if (k > 3) {
          prevYearGdp = formatPrev(d[1] / data[k-4][1] - 1);
        }
        d3.select('.tooltip-prev-year-gdp')
          .text(prevYearGdp);

        d3.select('.tooltip')
          .style('visibility', 'visible');
      })
      .on('mouseleave', function() {
        d3.select('.tooltip')
          .style('visibility', 'hidden');
      });
  } 

});



function toInteger(d) {
  d.data[1] = +d.data[1];
  return d;
}

function extractQuarter(d) {
  var year = d.substring(0, 4);
  var month = d.substring(5, 7);
  var quarter = year + '/';
  switch (month) {
    case '01':
      quarter += 'I';
      break;
    case '04':
      quarter += 'II';
      break;
    case '07':
      quarter += 'III';
      break;
    case '10':
      quarter += 'IV';
  }
  return quarter;
}