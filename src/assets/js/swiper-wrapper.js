// wrapper function for Swiper

//set up namespace
if(typeof window.SwiperWrapper === "undefined") {
	window.SwiperWrapper = {};
}

SwiperWrapper = {
	
	//Swiper plugin: /vendor/swiper.jquery.min.js
	swiper: {
		vars: {
			swiperInstance: null
		},

		init: function(){
			$('html').addClass('swiper-enabled');
			var titles = ['One', 'Two', 'Three', 'Four'];
			var $floatbox = $('.floatbox'),
					sections = $('section', $floatbox),
					$assuranceTag = $('.level-of-assurance', $floatbox);

			
			//set the first section to be on top:
			$(sections[0]).addClass('active');
			$assuranceTag.removeClass('non-visible');

			var swiper = new Swiper('.swiper-container', {
				pagination: '.swiper-pagination',
				direction: 'vertical',
				speed: 1000,
				slidesPerView: 1,
				paginationClickable: true,
				paginationBulletRender: function (index, className) {
		      return '<span class="' + className + ' section'+(index) + '"><i>' + titles[(index)] + '</i></span>';
	  		},
				spaceBetween: 0,
				hashnav: true,				
				nextButton: '.swiper-button-next',
				prevButton: '.swiper-button-prev',
				parallax: true,
				mousewheelControl: true,
				keyboardControl: true,
				grabCursor: false,
				onSlideChangeStart: function(swiper){					
					//set opacity of current floatbox section to 0 + decrease z-index 
					$(sections).removeClass('active');

					var i = swiper.activeIndex;

					$(sections[i]).addClass('active');

					if (i === 0){
						$assuranceTag.removeClass('non-visible');
					} else {
						if (!$assuranceTag.hasClass('non-visible')){
							$assuranceTag.addClass('non-visible');
						}
					}


				},
				onSlideChangeEnd: function(swiper){
					
				}
    	});

    	SwiperWrapper.swiper.vars.swiperInstance = swiper;
		},

		uninit: function(){
			var swiper = SwiperWrapper.swiper.vars.swiperInstance;
			$('html').removeClass('swiper-enabled');
			swiper.destroy();
		}
	}

};
   