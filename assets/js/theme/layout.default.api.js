$(document).ready(function () {
    // Attach the plugin to an element
    $('.slidea').slidea({
        width: 1920,
        height: 960
    });

    // Go to nth slide
    $('select').on('change', function(){
        var i = parseInt($(this).val());
        $('.slidea').data('slidea').slide(i-1);
    }).material_select();

    // Go to next slide
    $('#next').click(function () {
        $('.slidea').data('slidea').next();
    });

    // Go to prev slide
    $('#prev').click(function () {
        $('.slidea').data('slidea').prev();
    });
});