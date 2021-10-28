$(document).ready(function() {

    var $slider = $('.slidea');

    // Attach the plugin to an element
    $slider.slidea({
        width: 1920,
        height: 960
    });


    // slidea.load    : function(event)
    $slider.on('slidea.load', function (event) {
        console.log('Slidea has been loaded.')
    });

    // slidea.change  : function(event, prev, current, next, max, element)
    $slider.on('slidea.change', function (event, prev, current, next, max, element) {
        console.log(
            'Slidea prev: ' + prev,
            'Slidea current: ' + current,
            'Slidea next: ' + next,
            'Slidea max: ' + max,
            'Slidea element: ' + element
        );
    });

    // slidea.pause   : function(event)
    $slider.on('slidea.pause', function (event) {
        console.log('Slidea has been paused.')
    });

    // slidea.resume   : function(event)
    $slider.on('slidea.resume', function (event) {
        console.log('Slidea has been resumed.')
    });

    // slidea.resize  : function(event, width, height)
    $slider.on('slidea.resize', function (event, width, height) {
        console.log('Slidea has been resized.', 'Slidea width: ' + width, 'Slidea height: ' + height);
    });
});