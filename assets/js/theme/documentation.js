$(document).ready(function () {

    $(window).resize(function () {
        var width = $(window).width();
        var height = $(window).height();

        $('#container').height(height - 80);

        if (width < 768) {
            $('.documentation-sidebar').height('auto');
            $('.pb-navbar').addClass('collapse');
            $('.pb-nav', $('.pb-navbar')).removeClass('open').velocity({
                opacity: 0,
                translateY: -500
            }, 0);
        } else {
            $('.documentation-sidebar').height(height - 150);
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



    SyntaxHighlighter.defaults.toolbar = false;
    SyntaxHighlighter.all();

});


(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-61167988-1', 'auto');
ga('send', 'pageview');
