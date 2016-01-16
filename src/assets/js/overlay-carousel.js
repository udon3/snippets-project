$(document).ready(function(){
  
  
  $('.open-overlay').on('click', function(){
    
    
    var targetId = $(this).attr('data-target-id'),
        $targetEl = $('#' + targetId);
    
    $targetEl.addClass('active');
    
  });
  
  
  $('.close-overlay').on('click', function(){
    
    var $elToClose = $(this).parents('.overlay-wrapper');
    
    $elToClose.removeClass('active');
  });
  
});