/*!
 * Revealing Constructor Pattern Boilerplate
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 */
var ChartMaker = (function () {

	'use strict';

	/**
	 * Create the Constructor object
	 */
	var Constructor = function () {

		//
		// Variables
		//
        var chartMakerModel = null;
        var options = "123";
        var wrapper = null;
        var page = null;
        var chartMakerContainer = null;
        
        // Constructor exposed API functions
        var publicAPIs = {};

        //
        // Define option defaults
        //
        var defaults = {
            chartMakerContainerClassName: ""
        };


		//
		// Methods
		//

        /*!
        * Merge two or more objects together.
        * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
        * @param   {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
        * @param   {Object}   objects  The objects to merge together
        * @returns {Object}            Merged values of defaults and options
        */
        var extend = function () {

            // Variables
            var extended = {};
            var deep = false;
            var i = 0;

            // Check if a deep merge
            if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
                deep = arguments[0];
                i++;
            }

            // Merge the object into the extended object
            var merge = function (obj) {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        // If property is an object, merge properties
                        if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                            extended[prop] = extend(extended[prop], obj[prop]);
                        } else {
                            extended[prop] = obj[prop];
                        }
                    }
                }
            };

            // Loop through each object and conduct a merge
            for (; i < arguments.length; i++) {
                var obj = arguments[i];
                merge(obj);
            }

            return extended;

        };

        /**
		 * A private method
		 */
		var uiBasicsCollector  = function () {
            // Code goes here...
            
            return `
                <form role="form">
                    <fieldset class="legend-brdr-bttm">
                        <legend>The Basics</legend>
                        <div class="form-group">
                            <label for="exampleInputEmail1">English Title</label>
                            <input type="text" class="form-control" id="exampleInputEmail1" placeholder="` +  chartMakerModel.getChartTitleEnglish() + `" />
                        </div>
                        <div class="form-group">
                            <label for="exampleInputEmail1">French Title</label>
                            <input type="text" class="form-control" id="exampleInputEmail2" placeholder="` +  chartMakerModel.getChartTitleFrench() + `" />
                        </div>
                    </fieldset>
                    <input type="submit" text="Nope" id="basicsCollectorForm" class="btn btn-primary" />
                </form>`;

		};

        /**
		 * A private method
		 */
		var uiChart = function () {
            // Code goes here...
            
            return `
                <div class="chart-maker-core bg-primary">
                    <ul class="list-unstyled">
                        <li><strong>English Title:</strong> ` + chartMakerModel.getChartTitleEnglish() + `</li>
                        <li><strong>English French:</strong> ` + chartMakerModel.getChartTitleFrench() + `</li>
                    </ul>
                </div>
                `;

		};

        /**
		 * A private method
		 */
		var uiWrapper  = function () {
            // Code goes here...
            
            return `
                <div class="row">
                    <div class="col-md-6">
                        `+ uiBasicsCollector() +`
                    </div>
                    <div class="col-md-6">
                        `+ uiChart() +`
                    </div>
                </div>`;

		};

        /**
		 * A private method
		 */
		var buildDom = function () {
            
            // Check that there is a class name specified
            if (options.chartMakerContainerClassName === "") {
                throw ("Chart Maker container class has not been set");
            }
    
            // Cache the whole document for performance reasons
            wrapper = $(document);
    
            if ( wrapper.has('.' + options.chartMakerContainerClassName)) { 
                // Cache the chart wrapper div
                chartMakerContainer = wrapper.find('.' + options.chartMakerContainerClassName);

                 // Append ui container 
                chartMakerContainer.append(uiWrapper()); 
            }
            else { 
                throw("Supplied Class Name not found."); 
            }
            
        };
        
        /**
		 * Bind events in the dom to handlers in the controller
		 */
		var bindEvents = function () {
            // Code goes here...



            wrapper.find('#basicsCollectorForm').on('click', basicsCollectorsSubmit.bind(this));

           
            
            /*
            // If the open button is clicked show the menu
            menuOpenButton.on('click', show.bind(this));

            // If the close button is clicked hide the menu
            menuCloseButton.on('click', hide.bind(this));

            // If the first focusable item is tabed on
            menuContainerFirstFocusable.on('keydown', tabKeyMenuFirstChildHandler.bind(this));

            // If the last focusable item is tabed on
            menuContainerLastFocusable.on('keydown', tabKeyMenuLastChildHandler.bind(this));
            */



		};

        /**
		 * A private method
		 */
		var basicsCollectorsSubmit = function (event) {
            
            console.log ("Hello");

            // Code goes here...
            
            // Update the model
            chartMakerModel.setChartTitleEnglish(wrapper.find('#exampleInputEmail1')); 

            console.log("Chart Model Says..." + chartMakerModel.getChartTitleEnglish().toString()); 

            // Prevent Default Action
            return false; 
		};

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
		 * Another public method
		 */
		publicAPIs.init = function (settings) {

            // Code goes here...

            // Merge options into defaults
            options = extend(defaults, settings || {});

            try {

                 // Initialise Chart Maker Model 
                chartMakerModel = new ChartMakerModel();
                chartMakerModel.init(); 

                // Build the Interface 
                buildDom();

                // Bind the Events 
                bindEvents(); 


                // Cache the dom and other elements
                //cacheAndBuildDom();

                // Bind the event handlers
                //bindEvents();


            }
            catch (e) {
                // Send the error message to the console window
                console.log("Chart Maker (View Controller) Plugin: " + e);
                console.trace(); 
            }
            finally {
                //code that will run after a try/catch block regardless of the outcome
            }
        
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
