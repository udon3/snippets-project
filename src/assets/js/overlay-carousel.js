$(document).ready(function(){
  
  
  $('.open-overlay').on('click', function(){
    
    var targetId = $(this).attr('data-target-id'),
        $targetEl = $('#' + targetId);
    
    $targetEl.addClass('active');

    $('.flexslider').flexslider({
      animation: "slide",
      controlsContainer: $(".custom-controls-container"),
      customDirectionNav: $(".custom-navigation a"),
      slideshow: false
    });
    
  });
  
  
  $('.close-overlay').on('click', function(){
    
    var $elToClose = $(this).parents('.overlay-wrapper');
    
    $elToClose.removeClass('active');
  });
  
//need to load flexslider AFTER the overlay is opened




});