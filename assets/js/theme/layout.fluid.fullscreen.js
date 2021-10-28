$(document).ready(function() {

    $(window).resize(function(){
        $('.fullscreen').height($(window).height()).width($(window).width());
    }).trigger('resize');

    // Attach the plugin to an element
    $('.slidea').slidea({
        width: 1920,
        height: 960,
        animation: {
            initial: 'opacity 0',
            out: 'fade out',
            easing: 'swing',
            duration: 1000
        },
        layout: 'fluid',
        pagination: true
    });
});