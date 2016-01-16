//create a new scope (and 'privacy') with an IIFE and namespace it:
var ScrollModule = (function ($) {

  var settings = {
    topMenuHeight: 104,
    sectionVSpace: 50, //adjustment for the point at which active item will change
    headerOffset: 0,
    lastId: ''
  };

  var DOM = {

  }

  var init = function(){
    console.log('init');
  }








  //smooth scrolling function
  var smoothScrollFn = function($anchor){
    // if (location.pathname.replace(/^\//,'') == $anchor.pathname.replace(/^\//,'') && location.hostname == $anchor.hostname) {
    //     var target = $($anchor.hash);
    //     target = target.length ? target : $('[name=' + $anchor.hash.slice(1) +']');
    //     if (target.length) {
    //       $('html,body').animate({
    //         scrollTop: target.offset().top
    //       }, 1000);
    //       return false;
    //     }
    //   }
    // $('a[href*=#]:not([href=#])').click(function() {
      
    // });
    var path = location.pathname.replace(/^\//,''),
              thisPath = $anchor.pathname.replace(/^\//,''),
              host = location.hostname,
              thisHost = $anchor.hostname;

          //test anchor URLs are jump links, then use the hash part
          if (path === thisPath && host === thisHost){

            var target = $($anchor.hash);

            target = target.length ? target : $('[id=' + $anchor.hash.slice(1) +']');

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
  }

  //debouncing function
  var debounceFn = function(func, wait, immediate){
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
  }

  //collection of dom elemets that can trigger a scroll

  //scroll nav function - on click of nav item calls smooth scroll to destination

  //active scroll nav item - determine which section is active and add/remove active class on corresponding nav item

  //current scroll item - for use with active nav

  //trigger function on scroll to specific scroll position (e.g. add a class to a target element when scrolled to a point, etc)

























  //private property or method declared with var:
  var _privateMethod = function(){
    //
    console.log('private method called from a public one');
  };
  var _privateProp = "private!";

  var publicMethod = function(){
    console.log('This is a public method, not ' + _privateProp);
    _privateMethod();
  };

  var publicProperty = 'Public property';

  return {
    //object literal returned: methods and properties to expose to public
    init: init

  }

})(jQuery);


//access public stuff
//ScrollModule.pubMethod();
//console.log(ScrollModule.pubProp);