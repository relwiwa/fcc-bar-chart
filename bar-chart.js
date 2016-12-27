// SVG properties

var margin = {
  top: 20,
  right: 30,
  bottom: 30,
  left:40
};
var width = 1080 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

// D3 data formatting properties

var formatCurrGdp = d3.format(',.0');
var formatPrev = d3.format('+.2%');

// create chart

var chart = d3.select('.chart')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// create y-axis

var y = d3.scale.linear()
  .range([height, 0]);

var yAxis = d3.svg.axis()
  .scale(y)
  .orient('left')
  .ticks(10)
  .tickFormat(function (d) {
    d = d/1000;
    return d + "k";
  })
  .outerTickSize(0);

// background-tooltip elements

var bgTooltip = chart
  .append('g')
    .attr('class', 'bg-tooltip')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

bgTooltip.append('text')
  .attr('class', 'bg-tooltip-gdp')
  .attr('x', 30)
  .attr('y', margin.top + 100);

bgTooltip.append('text')
  .attr('class', 'bg-tooltip-currency')
  .attr('x', 30)
  .attr('y', margin.top + 230)
  .text('Billion US-$');

bgTooltip.append('text')
  .attr('class', 'bg-tooltip-year')
  .attr('x', 30)
  .attr('y', height - 100);

// load external JSON-data

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(error, json) {
  if (error) {
    console.error('Error happened reading JSON data');
  }
  else {
    var data = json.data;
    
    // create and add x-axis to chart
    
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
        
    chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    // setup y-domain and add y-axis to chart
    
    y.domain([0, d3.max(data, function(d) {
      return d[1];
    })]);
    
    chart.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('US GDP in Billion US-$');

    // link data with bars and add them to chart (not displayed yet)
    
    chart.selectAll('.bar')
      .data(data)
      .enter().append('rect')
        .attr('class', function(d, k) {
          return 'bar q-' + d[0].substring(5, 7) + ' k-' + k;
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
        .attr('width', width/data.length + 1);
    
    // add author-driven narrative focusing on growth of gdp
    
    var authorDrivenCounter = 0;
    var authorDrivenInterval = setInterval(function(d) {

      // change font-size of displayed gdp amount

      var fontSize = d3.select('.bg-tooltip-gdp')
        .style('font-size');
      fontSize = fontSize.substring(0, fontSize.length - 2);
      fontSize = +fontSize;
      if (authorDrivenCounter > 0) {
        fontSize = fontSize * ((((data[authorDrivenCounter][1] / data[(authorDrivenCounter - 1)][1]) - 1) / 2) + 1);
      }
      
      // update elements of author-driven narrative

      d3.select('.k-' + authorDrivenCounter)
        .style('display', 'block');
      d3.select('.bg-tooltip-gdp')
        .text(formatCurrGdp(d3.round(data[authorDrivenCounter][1])))
        .style('font-size', fontSize);
      d3.select('.bg-tooltip-year')
        .text(data[authorDrivenCounter][0].substring(0, 4));
      authorDrivenCounter++;

      // check for end of author-driven narrative

      if (authorDrivenCounter >= data.length) {
        
        // increase font size and display currency for final frame of narrative
        
        d3.select('.bg-tooltip-currency')
          .style('font-size', fontSize * 0.7)
          .style('display', 'block');
        d3.select('.bg-tooltip-year')
          .style('font-size', fontSize * 0.7);
        clearInterval(authorDrivenInterval);
        
        // set timeout until final frame gets hidden
        
        setTimeout(function() {
          d3.select('.bg-tooltip')
            .style('display', 'none');

          // enable user-driven narrative
          
          d3.selectAll('.bar')
            .on('mouseover', function(d, k) {
            
              d3.select(this)
                .style('fill', '#43a2ca');

              // build tooltip-quarter

              var currentQuarter = extractQuarter(d[0]);
              d3.select('.bg-tooltip-year')
                .text(currentQuarter);

              // build tooltip-gdp

              d3.select('.bg-tooltip-gdp')
                .text(formatCurrGdp(d3.round(d[1])));

              d3.select('.bg-tooltip')
                .style('display', 'block');
            })
            .on('mouseleave', function() {
              d3.select(this)
                .style('fill', '#a8ddb5');
            
              d3.select('.bg-tooltip')
                .style('display', 'none');
            });

          }, 3500);
      }
    }, 40);
  } 

});

// helper functions

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