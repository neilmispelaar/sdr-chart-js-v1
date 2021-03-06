// Avoid `console` errors in browsers that lack a console.
(function () {
    var method;
    var noop = function () { };
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());


// Place any jQuery/helper plugins in here.

/*!
 * Revealing Module Pattern with User Options Boilerplate
 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
 */
var myChartMaker = (function () {

    'use strict';

    // Create global element references
    var wrapper = null;
    var page = null;
    var chartMakerContainerClassName = null;
    var chartMakerContainer = null;


    // Public APIs Object
    var publicAPIs = {};


    // Define option defaults
    var defaults = {
        chartMakerContainerClassName: ""
    };

    var options;


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
     * A private method stub
     */
    var somePrivateMethod = function () {
        // Code goes here...
        console.log("Hello");

        console.log("Options:" + options.chartMakerContainerClassName);
    };

    /**
     * A private method
     */
    var cacheAndBuildDom = function () {

        if (options.chartMakerContainerClassName === "") {
            throw ("Chart Maker container class has not been set");
        }

        // Cache the whole document for performance reasons
        wrapper = $(document);

        // Cache the chart wrapper div
        chartMakerContainer = wrapper.find('.' + options.chartMakerContainerClassName);

        // Append ui container 
        chartMakerContainer.append(ui()); 

        console.log("I am here");

        /* 
       

        



        // Add the Menu Open Button
        menuContainer.parent().append(
            "<div class=\"menuOpenButtonContainer\"><button class=\"btn menuOpenButton\" type=\"button\"><span class=\"sr-only\">Menu</span> " +
            "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"svg-icon\" viewBox=\"0 0 20 20\"><path d=\"M 3.314 4.8 h 13.372 c 0.41 0 0.743 -0.333 0.743 -0.743 c 0 -0.41 -0.333 -0.743 -0.743 -0.743 H 3.314 c -0.41 0 -0.743 0.333 -0.743 0.743 C 2.571 4.467 2.904 4.8 3.314 4.8 Z M 16.686 15.2 H 3.314 c -0.41 0 -0.743 0.333 -0.743 0.743 s 0.333 0.743 0.743 0.743 h 13.372 c 0.41 0 0.743 -0.333 0.743 -0.743 S 17.096 15.2 16.686 15.2 Z M 16.686 9.257 H 3.314 c -0.41 0 -0.743 0.333 -0.743 0.743 s 0.333 0.743 0.743 0.743 h 13.372 c 0.41 0 0.743 -0.333 0.743 -0.743 S 17.096 9.257 16.686 9.257 Z\"></path></svg>" +
            "</button></div>");

        // Add the Menu Close Button
        menuContainer.append(
            "<button class=\"btn btn-green menuCloseButton\" type=\"button\">Close</button>" + "</div>")

        // Cache the buttons
        menuOpenButton = wrapper.find('.menuOpenButton');
        menuCloseButton = wrapper.find('.menuCloseButton');

        // Cache the first and last focusable items on the menu to control tabing behaviour
        menuContainerFirstFocusable = menuContainer.find('select, input, textarea, button, a').filter(':visible').first();
        menuContainerLastFocusable = menuContainer.find('select, input, textarea, button, a').filter(':visible').last();

        */

    };

    /**
     * A private method
     */
    var ui = function () {

        var html = `
            <div class="row">
                <div class="col-md-6">
                <form role="form" method="get" action="#">
                
                    <fieldset class="legend-brdr-bttm">
                        <legend>Chart Details</legend>
                        <div class="form-group">
                            <label for="exampleInputEmail1">English Title</label>
                            <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter email" />
                        </div>
                        <div class="form-group">
                            <label for="exampleInputEmail1">French Title</label>
                            <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter email" />
                        </div>
                        <div class="form-group">
                            <label for="inputFullName" class="col-sm-4 control-label">Full Name</label>
                            <div class="col-sm-8">
                            <input type="text" class="form-control" id="inputFullName" placeholder="Full Name" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="dob" class="col-sm-4 control-label">Date of Birth<span  class="datepicker-format"> (YYYY-MM-DD)</span></label>
                            <div class="col-sm-8">
                            <input class="form-control" id="dob" name="dob" type="date" />
                            </div>
                        </div>
                    </fieldset>

               
                    <div class="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" />
                    </div>
                    <div class="form-group">
                        <label for="exampleInputFile">File input</label>
                        <input type="file" id="exampleInputFile" />
                    </div>
                    <div class="checkbox">
                        <label><input type="checkbox" /> Check me out</label>
                    </div>
                    <button type="submit" class="btn btn-default">Submit</button>
                </form>
                </div>
                <div class="col-md-6">
                    <div class="chart-canvas-container"></div>
                </div>
            </div>
        `;

        return (html); 

    };


    /**
     * A private method
     */
    var bindEvents = function () {

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
    var show = function () {
        menuContainer.addClass('open');
        // TODO this.page.addClass('noScroll');

        // Set focus after a delay to allow for the annimation
        window.setTimeout(setFocusAfterOpen.bind(this), 300);

        console.log("Mobile Menu: Open");

    };

    /**
     * A private method
     */
    var hide = function () {
        menuContainer.removeClass('open');
        //this.page.removeClass('noScroll');
        menuOpenButton.focus();

        console.log("Mobile Menu: Close");

    };

    /**
     * A private method
     */
    var tabKeyMenuFirstChildHandler = function (e) {
        if ((e.keyCode === 9 && e.shiftKey) && (menuContainer.hasClass('open') === true)) {

            e.preventDefault();

            menuContainerLastFocusable.focus();
        }
    };

    /**
     * A private method
     */
    var tabKeyMenuLastChildHandler = function (e) {
        if ((e.keyCode === 9 && !e.shiftKey) && (menuContainer.hasClass('open') === true)) {

            e.preventDefault();

            menuContainerFirstFocusable.focus();

        }
    };

    /**
     * A private method
     */
    var setFocusAfterOpen = function () {
        menuCloseButton.focus();
    };

    /**
     * A public method stub
     */
    publicAPIs.doSomething = function () {
        somePrivateMethod();
        // Code goes here...
    };

    /**
     * Another public method
     */
    publicAPIs.init = function (settings) {

        // Merge options into defaults
        options = extend(defaults, settings || {});

        try {

            // Cache the dom and other elements
            cacheAndBuildDom();

            // Bind the event handlers
            bindEvents();


        }
        catch (e) {
            // Send the error message to the console window
            console.log("Chart Maker Plugin: " + e);
        }
        finally {
            //code that will run after a try/catch block regardless of the outcome
        }
    };


    //
    // Return the Public APIs
    //
    return publicAPIs;

})();