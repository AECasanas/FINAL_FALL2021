$(document).ready(function () {

    $(window).resize(function () {
        var width = $(window).width();
        var height = $(window).height();

        $('#container').height(height - 80);

        if (width < 768) {
            $('.pb-navbar').addClass('collapse');
            $('.pb-nav', $('.pb-navbar')).removeClass('open').velocity({
                opacity: 0,
                translateY: -500
            }, 0);
        } else {
            $('.pb-navbar').removeClass('collapse');
            $('.pb-nav', $('.pb-navbar')).removeClass('open').velocity({
                opacity: 1,
                translateY: 0
            }, 0);
        }

        $('.presentation-animation').each(function () {
            $(this).height($(this).width())
        })

    }).trigger('resize');


    $('#presentation-polaroid').velocity({
        scale: 1.5,
        opacity: 1,
        rotateZ: 45,
        translateY: 20,
        translateX: 50
    }, {
        loop: true,
        delay: 1000,
        duration: 500
    });


    //Attach the plugin to an element
    $('#slidea').slidea({
        width: 1920,
        height: 960,
        layout: 'fluid',
        scroller: true, // Enable Scroller Item
        scrollerPosition: 'right', // Scroller position: left, center, right
        scrollerTop: 92, // Percentage from top of slider
    });

    $('#testimonials').slidea({
        animation: {
            initial: 'opacity 0, rotate x -90',
            out: 'fade out',
            easing: 'swing',
            duration: 500
        },
        delay: 6000,
        layout: 'content',
        controls: false,
        controlsThumbnail: false,
        pagination: true,
        responsiveFont: false,
        paginationPosition: 'outside',
        progress: false,
        paginationClass: 'slidea-pagination-dark',
        controlsClass: 'slidea-controls-dark',
        progressClass: 'slidea-progress-dark'
    });

    $('.pb-logo-overlay').on('click', function (e) {
        var $navbar = $(this).parents('.pb-navbar');

        if ($navbar.hasClass('collapse')) {
            if ($('.pb-nav', $navbar).hasClass('open')) {
                $('.pb-nav', $navbar).removeClass('open').velocity({
                    opacity: 0,
                    translateY: -500
                });
            } else {
                $('.pb-nav', $navbar).addClass('open').velocity({
                    opacity: 1,
                    translateY: 0
                });

                $('.pb-nav-item').velocity({
                    rotateX: 90,
                    translateY: -30,
                    scale: 0
                }, 0).velocity({
                    rotateX: 0,
                    translateY: 0,
                    scale: 1
                }, {
                    duration: 1000,
                    easing: "spring"
                });
            }
        }
    });


    $('.dropdown-button').dropdown({
            hover: false,
            alignment: 'right',
            belowOrigin: true // Displays dropdown below the button
        }
    );


    $('#movebox1').velocity({
        translateY: 300
    }, {
        duration: 1000,
        loop: true,
        delay: 500
    });

    $('#movebox2').velocity({
        translateY: 300
    }, {
        duration: 3000,
        loop: true,
        delay: 500
    });


    $('#scroll-up').on('click', function(){
        $('body').velocity("scroll", {offset: -80});
    });

    $(document).scroll(function (e) {
        if ($(document).scrollTop() > 200){
            $('#scroll-up').addClass('visible');
        } else {
            $('#scroll-up').removeClass('visible');
        }
    });



    $('.scrollspy').scrollSpy();

});

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-61167988-1', 'auto');
ga('send', 'pageview');
