if (typeof NavScroll === "undefined") {
    var NavScroll = {};
}

NavScroll = {
  /*vars: {
    topMenuHeight: 104,
    sectionVSpace: 50, //adjustment for the point at which active item will change
    headerOffset: 0,
    lastId: ''
  },*/

  DOM: {
    $window: null,
    $subNavItem: null,
    $stickyMenu: null,
    $scrollLink: null,
    $menuItems: null,
    $scrollItems: null,
    $scrollSections: []
  },

  utils: {//do i need this?
    hasJumpscroll: function(){
      if ($('.jumpnav a').length > 0 || $('.scrollcol a').length > 0){
        return true;
      }
    }
  },

  init:  function(){
    if($(window).length > 0) {
      NavScroll.DOM.$window = $(window);
    }

    //JumpScroll nav
    NavScroll.DOM.scrollLink = $('.jumpnav a, .scrollcol a, a.toplink');
    NavScroll.DOM.scrollLink.on('click', NavScroll.events.smoothScroll);

    var $scrollNav = $('.jumpnav');
    if($scrollNav.length > 0) {
      NavScroll.DOM.$menuItems = $('a', $scrollNav);

      NavScroll.DOM.$scrollItems = NavScroll.DOM.$menuItems.map(function() {
          var item = $($(this).attr('href'));
          if (item.length) { return item; } //returns target DOM element
      });
      NavScroll.DOM.$window.on('scroll', NavScroll.events.activeNavScroll);
      NavScroll.DOM.$window.on('load', NavScroll.events.activeNavScroll);

     
      //fade scroll
      NavScroll.DOM.$scrollSections = NavScroll.DOM.$scrollItems.map(function(){
        return this;
      });
      NavScroll.DOM.$scrollSections.each(function(){
        $(this).addClass('is-obscured');
      });
      //First section should not be obscured
      NavScroll.DOM.$scrollSections[0].removeClass('is-obscured');
      
      

    }

  },

  events: {
    smoothScroll: function(e) {

      //NavScroll.vars.headerOffset = NavScroll.vars.topMenuHeight;
      //console.log(NavScroll.vars.headerOffset);
      
      if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[id=' + this.hash.slice(1) +']');
        if (target.length) {    
          $('html,body').animate({
            scrollTop: target.offset().top - NavScroll.vars.topMenuHeight
          }, 700);
          return false;
        }
      }
    },

    activeNavScroll: function() {    
      var scrollTop = $(window).scrollTop(),  
          viewPortHeight = window.innerHeight,    
          // container scroll position
          fromTop = scrollTop + NavScroll.vars.topMenuHeight;



      // Get id of current scroll item
      var cur = NavScroll.DOM.$scrollItems.map(function() {
        //console.log(Math.round($(this).offset().top));
        if ($(this).offset().top < (fromTop + NavScroll.vars.sectionVSpace))
          return this;
      });
      // Get the id of the current element
      cur = cur[cur.length-1]; 

      //add active class to section while in view
      //cur.addClass('inactive');
      NavScroll.DOM.$scrollItems.addClass('inactive');
      cur.removeClass('inactive');

      var id = cur && cur.length ? cur[0].id : '';

      // Manually set last item to active if at bottom of page
      if(scrollTop + $(window).height() === $(document).height()) {
        // get last item
        NavScroll.DOM.$menuItems.removeClass('active');
        NavScroll.DOM.$menuItems.last().addClass('active');
        NavScroll.vars.lastId = NavScroll.DOM.$menuItems.last().attr('href');
        

      } else {

        if (NavScroll.vars.lastId !== id) {
          NavScroll.vars.lastId = id;

          // Set/remove active class
          NavScroll.DOM.$menuItems.removeClass('active').filter('[href=#'+id+']').addClass('active');
        }  
      }  


      // scroll fade in effect
      //when should it kick in? at sectionHeight - viewPortSize ?
      //scrollTop >= (sectionHeight - viewPortSize) ?
      
      //Setting classes on section means if one section heicght isless than viewport, non-active section within viewport will be hidden.
      //is this what we want??
      $('.is-obscured').each( function(){
          var $this = $(this);
          var sectionBottom = $(this).position().top + $(this).outerHeight(),
              windowBottom = scrollTop + viewPortHeight;

          if(windowBottom > sectionBottom){              
              $(this).removeClass('is-obscured');
          } 
          
      }); 
      
     



    }  
  }//close events

  


  

  

};



NavScroll.init();

