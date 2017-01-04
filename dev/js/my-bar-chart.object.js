function MyBarChart(data) {
	this.chart = {};
	this.data = data;
	this.helper = new MyHelper();

	// SVG properties
	this.props = {};
	this.props.margin = {
		top: 20,
		right: 30,
		bottom: 30,
		left: 40
	};
	this.props.width = 1080 - this.props.margin.left - this.props.margin.right;
	this.props.height = 600 - this.props.margin.top - this.props.margin.bottom;

	// D3 data formatting properties
	this.props.formats = {
		currGdp: d3.format(',.0'),
		prev: d3.format('+.2%')
	};
}

MyBarChart.prototype.createChart = function() {
	this.chart.svg = d3.select('.chart')
  .attr('width', this.props.width + this.props.margin.left + this.props.margin.right)
  .attr('height', this.props.height + this.props.margin.top + this.props.margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')');
	return this.chart;	
}

MyBarChart.prototype.addXAxis = function() {
	this.chart.x = d3.time.scale()
		.range([10, this.props.width])
		.domain([
			d3.min(this.data, function(d) {
				return new Date(d[0]);
			}),
			d3.max(this.data, function(d) {
				return new Date(d[0]);
			})]);

	var xAxis = d3.svg.axis()
	.orient('bottom')
	.scale(this.chart.x);
	
	this.chart.svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + this.props.height + ')')
		.call(xAxis);
}

MyBarChart.prototype.addYAxis = function() {
	this.chart.y = d3.scale.linear()
		.range([this.props.height, 0]);

	var yAxis = d3.svg.axis()
		.scale(this.chart.y)
		.orient('left')
		.ticks(10)
		.tickFormat(function (d) {
			d = d/1000;
			return d + "k";
		})
		.outerTickSize(0);
	
	this.chart.y.domain([0, d3.max(this.data, function(d) {
		return d[1];
	})]);

	this.chart.svg.append('g')
		.attr('class', 'y axis')
		.call(yAxis)
		.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', 6)
			.attr('dy', '.71em')
			.style('text-anchor', 'end')
			.text('US GDP in Billion US-$');
}

MyBarChart.prototype.addBars = function() {    
	var that = this;
	this.chart.svg.selectAll('.bar')
		.data(this.data)
		.enter().append('rect')
			.attr('class', function(d, k) {
				return 'bar q-' + d[0].substring(5, 7) + ' k-' + k;
			})
			.attr('x', function(d) {
				return that.chart.x(new Date(d[0]));
			})
			.attr('y', function(d) {
				return that.chart.y(d[1]);
			})
			.attr('height', function(d) {
				return that.props.height - that.chart.y(d[1]);
			})
			.attr('width', this.props.width/this.data.length + 1);
}

MyBarChart.prototype.addBackgroundTooltips = function() {
	this.chart.bgTooltip = this.chart.svg
		.append('g')
			.attr('class', 'bg-tooltip')
			.attr('transform', 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')');

	this.chart.bgTooltip.append('text')
		.attr('class', 'bg-tooltip-gdp')
		.attr('x', 30)
		.attr('y', this.props.margin.top + 100);

	this.chart.bgTooltip.append('text')
		.attr('class', 'bg-tooltip-currency')
		.attr('x', 30)
		.attr('y', this.props.margin.top + 230)
		.text('Billion US-$');

	this.chart.bgTooltip.append('text')
		.attr('class', 'bg-tooltip-year')
		.attr('x', 30)
		.attr('y', this.props.height - 100);
}

MyBarChart.prototype.setupAuthorDrivenNarrative = function() {
	var that = this;
	var authorDrivenCounter = 0;
	var authorDrivenInterval = setInterval(function(d) {

		// change font-size of displayed gdp amount

		var fontSize = d3.select('.bg-tooltip-gdp')
			.style('font-size');
		fontSize = fontSize.substring(0, fontSize.length - 2);
		fontSize = +fontSize;
		if (authorDrivenCounter > 0) {
			fontSize = fontSize * ((((that.data[authorDrivenCounter][1] / that.data[(authorDrivenCounter - 1)][1]) - 1) / 2) + 1);
		}

		// update elements of author-driven narrative

		d3.select('.k-' + authorDrivenCounter)
			.style('display', 'block');
		d3.select('.bg-tooltip-gdp')
			.text(that.props.formats.currGdp(d3.round(that.data[authorDrivenCounter][1])))
			.style('font-size', fontSize);
		d3.select('.bg-tooltip-year')
			.text(that.data[authorDrivenCounter][0].substring(0, 4));
		authorDrivenCounter++;

		// check for end of author-driven narrative

		if (authorDrivenCounter >= that.data.length) {

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
				
				that.startUserDrivenNarrative();

      }, 3500);
		}
	}, 40);

}

MyBarChart.prototype.startUserDrivenNarrative = function() {
	var that = this;
	
	d3.selectAll('.bar')
	.on('mouseover', function(d, k) {

		d3.select(this)
			.style('fill', '#43a2ca');

		// build tooltip-quarter
		
		var currentQuarter = that.helper	.extractQuarter(d[0]);
		d3.select('.bg-tooltip-year')
			.text(currentQuarter);

		// build tooltip-gdp

		d3.select('.bg-tooltip-gdp')
			.text(that.props.formats.currGdp(d3.round(d[1])));

		d3.select('.bg-tooltip')
			.style('display', 'block');
	})
	.on('mouseleave', function() {
		d3.select(this)
			.style('fill', '#a8ddb5');

		d3.select('.bg-tooltip')
			.style('display', 'none');
	});
}