

(function ($) {
 
    $.fn.greenify = function( options ) {
 
        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            color: "#556b2f",
            backgroundColor: "white"
        }, options );
 
        // Greenify the collection based on the settings variable.
        return this.css({
            color: settings.color,
            backgroundColor: settings.backgroundColor
        });
 
    };
 
}(jQuery));


/*
var defaults = { validate: false, limit: 5, name: "foo" };
var options = { validate: true, name: "bar" };
 
// Merge defaults and options, without modifying defaults
var settings = $.extend( {}, defaults, options );*/


//http://blog.teamtreehouse.com/writing-your-own-jquery-plugins

//This is a jquery plugin that takes a data table and generates an animated graph

(function ($) {
 
  $.fn.generateGraph = function( options ) {

    var defaults = {
      // These are the defaults.
      useYAxis: false, //can omit the y-axis
      graphsContainerClass: '.tableGraphs', //there can be more than one wrapper on a page
      graphTableWrapClass: '.tg-wrap', //individual table-graph wrapper, as children of the above
      genGraphContainer: '<div class="gg-wrap"></div>', //generated container for graph + caption heading
      genHeading: 'h3', //change if this needs to be another element (caption text will be reperesented)      
      headingClass: 'gg-caption', //class for the heading
      genGraph: '<div class="gg"></div>', //generated graph element
      genBars: '<div class="gg__bars"></div>', //Bars for generated graph element
      genBarGroup: '<div class="gg__bar-wrap"></div>' //generated bar group (column for each bar)
    };

    // This is the easiest way to have default options.
    var settings = $.extend({
      complete     : null // set up for a callback
    }, defaults, options );



    // return, so that the plugin action can be chainable
    // the this keyword refers to the object the function is called on, and we iterate through each matching dom object with $.each()
    return this.each(function() {
      // Plugin code would go here...

      //allow for call backs:
      if ($.isFunction(settings.complete)) {
        settings.complete.call(this);
      }












    });

  };
 
}(jQuery));

//$('table').generateGraph({})













/*

(function( $ ) {
 
    $.fn.showLinkLocation = function() {

      var defaults = {
        color: "#556b2f",
        backgroundColor: "white"
      }
      var settings = $.extend({}, defaults, options );
 
        this.filter( "a" ).each(function() {
            var link = $( this );
            link.append( " (" + link.attr( "href" ) + ")" );
        });
 
        return this;
 
    };
 
}( jQuery ));*/
 
// Usage example:
//$( "a" ).showLinkLocation();