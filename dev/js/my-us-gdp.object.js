function MyUsGdp() {
	this.data = null;
	this.barChart = null;
	
	d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(error, json) {
		if (error) {
			console.error('Error happened reading JSON data');
		}
		else {
			this.data = json.data;
			this.barChart = new MyBarChart(this.data);
			this.barChart.createChart();
			this.barChart.addXAxis();
			this.barChart.addYAxis();
			this.barChart.addBars();
			this.barChart.addBackgroundTooltips();
			this.barChart.setupAuthorDrivenNarrative();
		}
	});
}