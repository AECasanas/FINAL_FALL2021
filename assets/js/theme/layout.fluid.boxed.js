$(document).ready(function() {
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
        thumbnails: true
    });
});