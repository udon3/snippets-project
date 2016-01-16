
//This is a jquery plugin for a scrolling navigation
/*
  dependencies:
    + jquery
    + velocity.js (http://github.com/julianshapiro/velocity)
    + debounce.js ()

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
      stickyNav: false, //WIP : not yet used - make having sticky nav an option
      scrollSpeed: 500, //velocity.js animation speed, millisecs
      easing: 'ease-in-out' //velocity.js animation easing
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

      //scrollNavObject:
      var sno = {

        vars: {
          $window: $(window),
          $scrollItems: null
         
        },

        //init function invoked after the object literal
        init: function(){
          
          var $linksArray = $(settings.linkObjects);
          var $navContainer = $(object);
          
          //scroll on click:
          $linksArray.each(function(){            
            $(this).on('click', sno.scrollFn);
          });

          //return a jq object array of each linked section element
          sno.vars.$scrollItems = $('a', $navContainer).map(function() {
            var item = $($(this).attr('href')); 
            if (item.length) { return item; } //returns target DOM element, e.g. $('#section1')
          });

          // using debounce function bound to scroll event
          var debouncedFn = sno.debounceFn(sno.activeNavFn, 150);

          //active classes control:
          sno.vars.$window.on({
            load: function() {
               sno.activeNavFn();
            },
            scroll: function() {
              debouncedFn();               
            }
          });

        },

        //scroll action 
        //uses velocity.js for animating
        //WIP - case for Browserify + dependency injects?
        scrollFn: function(){
      
          var path = location.pathname.replace(/^\//,''),
              thisPath = this.pathname.replace(/^\//,''),
              host = location.hostname,
              thisHost = this.hostname;

          //test anchor URLs are jump links, then use the hash part
          if (path === thisPath && host === thisHost){

            var target = $(this.hash);

            target = target.length ? target : $('[id=' + this.hash.slice(1) +']');

            if (target.length) {    

              //use velocity to animate scroll
              $(target).velocity('scroll', {
                duration: settings.scrollSpeed,
                offset: -settings.navHeight,
                easing: settings.easing
              });

              return false;
            }
          }


        },


        debounceFn: function(func, wait, immediate){
          //Debouncing: minimise the multiple firings of a function call (on window scrolls and resizes)
          // http://davidwalsh.name/javascript-debounce-function            
          var timeout;
          return function() {
            var context = this, args = arguments;
            var later = function() {
              timeout = null;
              if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
          };
        },

        //active nav highlighting
        // (called from init wrapped in a debounce script)
        activeNavFn: function(){

          $(settings.linkObjects).removeClass('active');

          //run currentItemFn to get current item Id, 
          //use it to find the corresponding nav item                    
          var currentId = sno.currentItemFn();

          $(settings.linkObjects).filter('[href=#'+currentId+']').addClass('active');              

        },

        //get current scroll item
        // (called from activeNavFn)
        currentItemFn: function(){

          var scrollTop = $(window).scrollTop(),  
              navHeight = settings.navHeight,
              sectionVSpace = settings.sectionVSpace,
              viewPortHeight = window.innerHeight;

          var cur = sno.vars.$scrollItems.map(function() {            
            if ($(this).offset().top < (scrollTop + navHeight + sectionVSpace)) //section's pos is less than viewport pos  
              return this;
              
          });

          // Get the current item id
          cur = cur[cur.length-1]; 
          var currentId = cur && cur.length ? cur[0].id : '';


          //if last item:
          if (scrollTop + viewPortHeight === $(document).height()){
            //console.log('have hit bottom!');
            var last = sno.vars.$scrollItems.length-1;
            //get the id of the last item via array pos
            currentId = sno.vars.$scrollItems[last][0].id;
          }

          return currentId;

         

        },

        //get window scroll position
        scrollPosFn: function(){

        }

      };

      sno.init();
     

    }

  };

 
}(jQuery));

//Usage:
//$('.scroll-nav').scrollNavIt({/*options*/});





