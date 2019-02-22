/*!
 * Revealing Constructor Pattern Boilerplate
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 */
var ChartMakerModel = (function () {

	'use strict';

	/**
	 * Create the Constructor object
	 */
	var Constructor = function () {

		//
		// Variables
		//
        var modelData = { 
            chartType: null,
            chartTitleEnglish: null,
            chartTitleFrench: null
        };


		var publicAPIs = {};

        //
        // Define option defaults
        //
        var defaults = {
            chartType: "blah",
            chartTitleEnglish: "English Chart Title",
            chartTitleFrench: "French Chart Title"
        };


		//
		// Methods
		//

		/**
		 * A private method
		 */
		var somePrivateMethod = function () {
			// Code goes here...
		};

		/**
		 * A public method
		 */
		publicAPIs.doSomething = function () {
			somePrivateMethod();
			// Code goes here...
        };
        
        /**
		 * A public method
		 */
		publicAPIs.getChartTitleEnglish = function () {
			return(modelData.chartTitleEnglish);
        };

         /**
		 * A public method
		 */
		publicAPIs.getChartTitleFrench = function () {
			return(modelData.chartTitleFrench);
        };
        
        /**
		 * A public method
		 */
		publicAPIs.getChartType = function () {
			return(modelData.chartType);
        };
        
        /**
		 * A public method
		 */
		publicAPIs.setChartTitleEnglish = function (chartTitleEnglish) {
			modelData.chartTitleEnglish = chartTitleEnglish; 
        };

         /**
		 * A public method
		 */
		publicAPIs.setChartTitleFrench = function () {
			modelData.chartTitleFrench = chartTitleFrench; 
        };
        
        /**
		 * A public method
		 */
		publicAPIs.setChartType = function (chartType) {
			modelData.chartType = chartType; 
		};

		/**
		 * This is the init method
		 */
		publicAPIs.init = function (options) {
            
            // Setup the models data with the default values in the model 
            for (var attrname in defaults) { modelData[attrname] = defaults[attrname]; }

		};


		//
		// Return the Public APIs
		//

		return publicAPIs;

	};


	//
	// Return the Constructor
	//

	return Constructor;

})();
