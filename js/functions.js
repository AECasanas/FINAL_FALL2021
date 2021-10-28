jQuery(document).ready(function($){
	"use strict";
	//Gallery Validation


    $(function() {
	  $('#b-news').vTicker();
	});

	$('a[data-rel]').each(function () {
		$(this).attr('rel', $(this).data('rel'));
	});
	
	jQuery(document).ready(function() {
		jQuery('.mycarousel').jcarousel({
    	wrap: 'circular'
    });
	});

	
	//CountDown Element
	if($('.defaultCountdown').length){
		var austDay = new Date();
		austDay = new Date(2014, 7 - 1, 26);
		$('.defaultCountdown').countdown({until: austDay, format: 'dHMS'});
		$('#year').text(austDay.getFullYear());
	}
	//Bx Slider
	if($('.bxslider').length){
	$('.bxslider').bxSlider({
		mode: 'fade',
	    auto: true,	
		pagerCustom: '#bx-pager'	
	});
	}
	
	//pie chart
	if($('.percentage').length){
		$('.percentage').easyPieChart({
			animate: 1000,
			onStep: function(value) {
				this.$el.find('span').text(~~value);
			}
		});
	}
	//go to top
	$('#back-top').click(function () {
		$('body,html').animate({
				scrollTop: 0
			}, 800);
		return false;
	});

	//ToolTip
	
	$("[data-toggle='tooltip']").tooltip();
	//pretty Photo
	if($(".gallery").length){
		$("a[rel^='prettyPhoto']").prettyPhoto();
	}
	
	//responsive menu

	});
	$(window).load(function() {
  // The slider being synced must be initialized first
  $('#carousel').flexslider({
    animation: "slide",
    controlNav: false,
    animationLoop: false,
    slideshow: false,
    itemWidth: 135,
    itemMargin: 0,
    asNavFor: '.slider'
  });
   
  $('.slider').flexslider({
    animation: "slide",
    controlNav: true,
    animationLoop: false,
    slideshow: false,
    sync: "#carousel"
  });
  
  
    $('#carousel2').flexslider({
    animation: "slide",
    controlNav: false,
    animationLoop: false,
    slideshow: false,
    itemWidth: 131,
    itemMargin: 0,
    asNavFor: '#slider2'
  });
   
  $('#slider2').flexslider({
    animation: "slide",
    controlNav: true,
    animationLoop: false,
    slideshow: false,
    sync: "#carousel2"
  });
  $('#carousel3').flexslider({
    animation: "slide",
    controlNav: false,
    animationLoop: false,
    slideshow: false,
    itemWidth: 400,
    itemMargin: 0,
	minItems:2,
    asNavFor: '#slider3'
  });
   
  $('#slider3').flexslider({
    animation: "slide",
    controlNav: true,
    animationLoop: false,
    slideshow: false,
    sync: "#carousel3"
  });
});
$(window).load(function() {
  $('.flexslider').flexslider({
    animation: "slide"
  });
});




	  