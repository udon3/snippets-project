
//This is a jquery plugin base from which to build something useful

(function ($) {
 
  $.fn.myPluginName = function( options ) {

    var defaults = {
      // These are the defaults for exposed options
      
    };

    // Merge options
    var settings = $.extend({
                        complete: null, // set up for a callback
                        //and other settings      
                        

                    }, defaults, options );

    // return, so that the plugin action can be chainable
    // the this keyword refers to the object the function is called on, and we iterate through each matching dom object with $.each()
    return this.each(function() {

      // Plugin code here

      //allow for call backs:
      if ($.isFunction(settings.complete)){
        settings.complete.call(this);
      }

      // run the functions defined for this plugin
      // - pass 'settings' to function
      // - pass the 'this' to the function referring to the object the plugin is called on
      myPluginFn(settings, this);


    });


    // All the plugin functions here:
    function myPluginFn(settings, object){

      var myFnObj = {

        vars: {
          
        },

        //init function invoked after the object literal
        init: function(){
          
        },

        doSomething: function(){
          
        }

      };

      //call init after all properties have been defined in the object literal
      myFnObj.init();
     

    }

  };
 
}(jQuery));

//Usage:
$('.dom-selector').myPluginName({/*options*/});








