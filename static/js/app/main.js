// Run this when JQuery is ready
jQuery(document).ready(function ($) {

	// Revealing Constructor pattern: https://vanillajstoolkit.com/boilerplates/revealing-constructor/

	// Instantiate the chart maker tool 
	var chartMaker = new ChartMaker(); 
	
	// Public Initialisation Method 
	chartMaker.init({
		chartMakerContainerClassName: "my-chart-maker-container"
	});

});