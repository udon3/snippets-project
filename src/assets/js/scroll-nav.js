if (typeof scrollNav === "undefined") {
    var scrollNav = {};
}

scrollNav = {
  vars: {
    topMenuHeight: 104,
    sectionVSpace: 50, //adjustment for the point at which active item will change
    headerOffset: 0,
    lastId: ''
  },

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
      scrollNav.DOM.$window = $(window);
    }

    //JumpScroll nav
    scrollNav.DOM.scrollLink = $('.jumpnav a, .scrollcol a, a.toplink');
    scrollNav.DOM.scrollLink.on('click', scrollNav.events.smoothScroll);

    var $scrollNav = $('.jumpnav');
    if($scrollNav.length > 0) {
      scrollNav.DOM.$menuItems = $('a', $scrollNav);

      scrollNav.DOM.$scrollItems = scrollNav.DOM.$menuItems.map(function() {
          var item = $($(this).attr('href'));
          if (item.length) { return item; } //returns target DOM element
      });
      scrollNav.DOM.$window.on('scroll', scrollNav.events.activescrollNav);
      scrollNav.DOM.$window.on('load', scrollNav.events.activescrollNav);

     
      //fade scroll
      scrollNav.DOM.$scrollSections = scrollNav.DOM.$scrollItems.map(function(){
        return this;
      });
      scrollNav.DOM.$scrollSections.each(function(){
        $(this).addClass('is-obscured');
      });
      //First section should not be obscured
      scrollNav.DOM.$scrollSections[0].removeClass('is-obscured');
      
      

    }

  },

  events: {
    smoothScroll: function(e) {

      //scrollNav.vars.headerOffset = scrollNav.vars.topMenuHeight;
      //console.log(scrollNav.vars.headerOffset);
      
      if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[id=' + this.hash.slice(1) +']');
        if (target.length) {    
          $('html,body').animate({
            scrollTop: target.offset().top - scrollNav.vars.topMenuHeight
          }, 700);
          return false;
        }
      }
    },

    activescrollNav: function() {    
      var scrollTop = $(window).scrollTop(),  
          viewPortHeight = window.innerHeight,    
          // container scroll position
          fromTop = scrollTop + scrollNav.vars.topMenuHeight;



      // Get id of current scroll item
      var cur = scrollNav.DOM.$scrollItems.map(function() {
        //console.log(Math.round($(this).offset().top));
        if ($(this).offset().top < (fromTop + scrollNav.vars.sectionVSpace))
          return this;
      });
      // Get the id of the current element
      cur = cur[cur.length-1]; 

      //add active class to section while in view
      //cur.addClass('inactive');
      scrollNav.DOM.$scrollItems.addClass('inactive');
      cur.removeClass('inactive');

      var id = cur && cur.length ? cur[0].id : '';

      // Manually set last item to active if at bottom of page
      if(scrollTop + $(window).height() === $(document).height()) {
        // get last item
        scrollNav.DOM.$menuItems.removeClass('active');
        scrollNav.DOM.$menuItems.last().addClass('active');
        scrollNav.vars.lastId = scrollNav.DOM.$menuItems.last().attr('href');
        

      } else {

        if (scrollNav.vars.lastId !== id) {
          scrollNav.vars.lastId = id;

          // Set/remove active class
          scrollNav.DOM.$menuItems.removeClass('active').filter('[href=#'+id+']').addClass('active');
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



scrollNav.init();

