var margin = 40;
var width = 1400 - margin;
var height = 600 - margin;

d3.select("body")
	.append("h2")
	.text("US Grand Domestic Product per Quarter");


d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(error, json) {
  if (error) {
    console.error("Error happened reading JSON data");
  }
  else {
		var svg = d3.select("body")
			.append("svg")
				.attr("width", width + margin)
				.attr("height", height + margin)
			.append('g')
				.attr('class','chart');

		var data = json.data;
		for (var i = 0; i < data.length; i++) {
			data[i] = {
				"Date": data[i][0],
				"Billion": data[i][1]
			};
		}
		
		var gdpChart = new dimple.chart(svg, data);
		
		gdpChart.defaultColors = [
			new dimple.color("#999999", "#999999", 1)
		];
		
		var x = gdpChart.addTimeAxis("x", "Date", "%Y-%m-%d", "%Y-%m");
		
		x.tickFormat = "%Y";
		x.timeInterval = 8;
		
		gdpChart.addMeasureAxis("y", "Billion");
		
		var series = gdpChart.addSeries(null, dimple.plot.bar);
		series.barGap = 0;
		
		gdpChart.draw();
 }
});