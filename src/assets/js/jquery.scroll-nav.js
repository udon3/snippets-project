
//This is a jquery plugin for a scrolling navigation
/*
  dependencies:
    + jquery
    + velocity.js (http://github.com/julianshapiro/velocity)

call the plugin on the navigation element
  Options:
    - sticky nav or not
    - speed of scroll
    - animate section as they come into view?


*/

(function ($) {
 
  $.fn.scrollNavIt = function( options ) {

    var defaults = {
      // These are the defaults for exposed options
      linkObjects: '.scroll-nav a, .toplink', //elements to add into the links array
      sectionVSpace: 50, // px adjustment for the point at which active item will be triggerd
      headerOffset: 0,
      lastId: '',
      stickyNav: false,
      scrollSpeed: null,
      animateInView: false
    };

    // Merge options
    var settings = $.extend({
                      navHeight: $(this).height(),
                      complete: null, // set up for a callback
                      //and other settings   

                        

                    }, defaults, options );

    // return, so that the plugin action can be chainable
    // the this keyword refers to the object the function is called on, and we iterate through each matching dom object with $.each()
    return this.each(function() {

      // 'this' refers to the navigation object

      //allow for call backs:
      if ($.isFunction(settings.complete)){
        settings.complete.call(this);
      }

      //set up the hook for scroll-nav on the body:
      $('body').addClass('scroll-nav-enabled');

      // run the function(s) defined for this plugin
      // - pass 'settings' to function
      // - pass the 'this' to the function referring to the object the plugin is called on
      scrollNav(settings, this);


    });


    // All the plugin functions here:
    function scrollNav(settings, object){

      var scrollNavObj = {

        vars: {
          $window: $(window),
          $subNavItem: null,
          $stickyMenu: null,
          $scrollLink: null,
          $menuItems: null,
          $scrollItems: null,
          $scrollSections: [],
         
        },

        //init function invoked after the object literal
        init: function(){
          
          var $linksArray = $(settings.linkObjects);
          var $navContainer = $(object);
          
          $linksArray.each(function(){
            $(this).on('click', scrollNavObj.scrollFn);
          });


        },

        //scroll action 
        scrollFn: function(){
          
          var path = location.pathname.replace(/^\//,''),
              thisPath = this.pathname.replace(/^\//,''),
              host = location.hostname,
              thisHost = this.hostname;

          if (path === thisPath && host === thisHost){

            var target = $(this.hash);

            target = target.length ? target : $('[id=' + this.hash.slice(1) +']');

            if (target.length) {    
              //use velocity

              $(target).velocity('scroll', {
                duration: 500,
                offset: -40,
                easing: 'ease-in-out'
              });

              return false;
            }
          }
          


        },

        //active nav highlighting
        activeNavFn: function(){

          console.log();

          var scrollTop = $(window).scrollTop(),  
              navHeight = settings.navHeight,
              viewPortHeight = window.innerHeight,
              fromTop = scrollTop + navHeight; // container scroll position

              ///////WIP//////////

        },

        //get current scroll item
        currentItemFn: function(){

        },

        //get window scroll position
        scrollPosFn: function(){

        }

      };

      scrollNavObj.init();
     

    }

  };

 
}(jQuery));

//Usage:
//$('.scroll-nav').scrollNavIt({/*options*/});





