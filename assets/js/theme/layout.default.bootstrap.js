$(document).ready(function() {
    // Attach the plugin to an element
    $('.slidea').slidea({
        width: 1920,
        height: 960,
        delay: 3000,
        animation: {
            initial: 'rotate y 90, scale 2, opacity 0',
            out: 'rotate y -90, scale 2, fade out',
            easing: 'swing',
            duration: 500
        }
    });
});