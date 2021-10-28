/**
 |--------------------------------------------------------------------------
 | Slidea Default Layout
 |--------------------------------------------------------------------------
 | Plugin Type: Slidea Module
 | License: CodeCanyon Standard / Extended
 | Author: Alex Grozav
 | Website: http://plugins.grozav.com/slidea
 | Email: alex@grozav.com
 */
;
(function ($, window, document, undefined) {

    // undefined is used here as the undefined global
    // variable in ECMAScript 3 and is mutable (i.e. it can
    // be changed by someone else). undefined isn't really
    // being passed in so we can ensure that its value is
    // truly undefined. In ES5, undefined can no longer be
    // modified.

    // window and document are passed through as local
    // variables rather than as globals, because this (slightly)
    // quickens the resolution process and can be more
    // efficiently minified (especially when both are
    // regularly referenced in your plugin).

    $.fn.slidea.defaultLayout = function () {
        var layout = this;

        // Slider Object
        // ---------------------
        layout.slider = null;

        /**
         |--------------------------------------------------------------------------
         | Init
         |--------------------------------------------------------------------------
         | Initialize the layout parameters
         */
        layout.init = function () {
            // Set Slider
            // ---------------------
            layout.slider = this;

            // Add Classes
            // ---------------------
            layout.slider.element.addClass('slidea-default');
        };


        /**
         |--------------------------------------------------------------------------
         | Setup
         |--------------------------------------------------------------------------
         | Set up the slider and each of the slides
         */
        layout.setup = function () {
            if (typeof layout.slider.cache == 'undefined')
                return;


            // Slider Size
            // ---------------------
            layout.slider.elementWidth = layout.slider.element.width();
            layout.slider.elementHeight = layout.slider.parentWidth / layout.slider.settings.width * layout.slider.settings.height;

            layout.slider.element.height(layout.slider.elementHeight);
            layout.slider.inner.height(layout.slider.elementHeight);

            // Slides Size
            // ---------------------
            // Compute visible background image size and set margins to center the image
            layout.slider.slides.each(function (i) {
                var $slide = $(this);
                var $background = $('.slidea-background', $slide);
                var $videobackground = $('.slidea-video-background', $slide);

                layout.slider.visibleWidth = layout.slider.elementWidth;
                layout.slider.visibleHeight = layout.slider.visibleWidth / layout.slider.cache[i].background.width * layout.slider.cache[i].background.height;

                // Slide Layers
                // ---------------------
                var widthRatio = layout.slider.elementWidth / layout.slider.settings.width;
                var heightRatio = layout.slider.elementHeight / layout.slider.settings.height;
                var $layers = $('.slidea-layer', $(this));
                $layers.each(function (layerIndex) {
                    var layerCSS = {};

                    if ('top' in layout.slider.cache[i].layer[layerIndex].position)
                        layerCSS.top = heightRatio * layout.slider.cache[i].layer[layerIndex].position.top;
                    else if ('bottom' in layout.slider.cache[i].layer[layerIndex].position)
                        layerCSS.bottom = heightRatio * layout.slider.cache[i].layer[layerIndex].position.bottom;


                    if ('left' in layout.slider.cache[i].layer[layerIndex].position)
                        layerCSS.left = widthRatio * layout.slider.cache[i].layer[layerIndex].position.left;
                    else if ('right' in layout.slider.cache[i].layer[layerIndex].position)
                        layerCSS.right = widthRatio * layout.slider.cache[i].layer[layerIndex].position.right;


                    if ('width' in layout.slider.cache[i].layer[layerIndex])
                        layerCSS.width = widthRatio * layout.slider.cache[i].layer[layerIndex].width;
                    if ('height' in layout.slider.cache[i].layer[layerIndex])
                        layerCSS.height = heightRatio * layout.slider.cache[i].layer[layerIndex].height;

                    $(this).css(layerCSS);
                });

                // Full Video
                // ---------------------
                $('.slidea-video', layout.slider.element).each(function(){
                    var $video = $(this);
                    var $parent = $video.parent();

                    if($parent.is('.slidea-video-background'))
                        return;

                    var height = $parent.height();
                    var width = $parent.width();

                    $video.css({
                        width: width,
                        height: height
                    });
                });

                // Video Background
                // ---------------------
                if ($videobackground.length) {
                    var $video = $('.video', $videobackground);

                    var dataWidth = parseInt($video.attr('data-width'));
                    var dataHeight = parseInt($video.attr('data-height'));

                    var videoWidth = layout.slider.elementWidth;
                    var videoHeight = videoWidth * (dataHeight / dataWidth);


                    $video.css({
                        'width': videoWidth,
                        'height': videoHeight
                    });
                }
            });
        };

        /**
         |--------------------------------------------------------------------------
         | slide
         |--------------------------------------------------------------------------
         | Display the slide element with index i and program the animation logic for
         | each background, layer and object
         |
         | Previous slide needs to be set in order to preview the out animation so that
         | we can create a transition between every slide
         |
         | The layers and objects need to be stopped and reanimated in order to prevent
         | animation flaws.
         |
         | Layer and object animation will transition from an inverted
         | animation state to a default state to provide normal slider behaviour
         */
        layout.slide = function (i, prev) {
            var $layers = $('.slidea-layer', layout.slider.active);
            var $objects = $('.slidea-object', layout.slider.active);


            // Previous Slide
            // ---------------------
            // Run animateOut animation for previous slide
            if (prev != -1) {
                var $prev = layout.slider.slides.eq(prev);
                var prevDelay = layout.slider.cache[prev].background.delay;

                // Animate background out
                var isEmpty = $.isEmptyObject(layout.slider.cache[prev].background.animation[prevDelay].state);
                if (!isEmpty) {
                    $prev.velocity(layout.slider.cache[prev].background.animation[prevDelay].state, {
                        duration: layout.slider.cache[prev].background.animation[prevDelay].duration,
                        easing: layout.slider.cache[prev].background.animation[prevDelay].easing
                    });
                }
            }

            // Active Slide
            // ---------------------
            // Set initial animation position for active slide
            var currentDelay = layout.slider.cache[i].background.delay;

            // Run active slide animation timeline
            // ---------------------
            if (!$.isEmptyObject(layout.slider.cache[i].background.animation.initial.state))
                layout.slider.active.velocity(layout.slider.cache[i].background.animation.initial.state, 0);
            $.each(layout.slider.cache[i].background.animation, function (index) {
                var isEmpty = $.isEmptyObject(layout.slider.cache[i].background.animation[index].state);
                if (index >= currentDelay || isNaN(index) || isEmpty)
                    return;

                layout.slider.cache[i].background.animation[index].timeline = setTimeout(function () {
                    layout.slider.active.velocity(layout.slider.cache[i].background.animation[index].state, {
                        duration: layout.slider.cache[i].background.animation[index].duration,
                        easing: layout.slider.cache[i].background.animation[index].easing
                    });
                }, index);
            });

            // Run layer animation timeline
            // ---------------------
            $layers.each(function (layerIndex) {
                var $layer = $(this);

                if (!$.isEmptyObject(layout.slider.cache[i].layer[layerIndex].animation.initial.state))
                    $layer.velocity(layout.slider.cache[i].layer[layerIndex].animation.initial.state, 0);
                $.each(layout.slider.cache[i].layer[layerIndex].animation, function (index) {
                    layout.slider.cache[i].layer[layerIndex].animation[index].timeline = setTimeout(function () {
                        var isEmpty = $.isEmptyObject(layout.slider.cache[i].layer[layerIndex].animation[index].state);
                        if (isNaN(index) || isEmpty)
                            return;

                        $layer.velocity(layout.slider.cache[i].layer[layerIndex].animation[index].state, {
                            duration: layout.slider.cache[i].layer[layerIndex].animation[index].duration,
                            easing: layout.slider.cache[i].layer[layerIndex].animation[index].easing
                        });
                    }, index);
                });
            });

            // Run layer animation timeline
            // ---------------------
            $objects.each(function (objectIndex) {
                var $object = $(this);

                if (!$.isEmptyObject(layout.slider.cache[i].object[objectIndex].animation.initial.state))
                    $object.velocity(layout.slider.cache[i].object[objectIndex].animation.initial.state, 0);
                $.each(layout.slider.cache[i].object[objectIndex].animation, function (index) {
                    layout.slider.cache[i].object[objectIndex].animation[index].timeline = setTimeout(function () {
                        var isEmpty = $.isEmptyObject(layout.slider.cache[i].object[objectIndex].animation[index].state);
                        if (isNaN(index) || isEmpty)
                            return;

                        $object.velocity(layout.slider.cache[i].object[objectIndex].animation[index].state, {
                            duration: layout.slider.cache[i].object[objectIndex].animation[index].duration,
                            easing: layout.slider.cache[i].object[objectIndex].animation[index].easing
                        });
                    }, index);
                });
            });
        };
    };


    /**
     |--------------------------------------------------------------------------
     | addLayout
     |--------------------------------------------------------------------------
     | Add the layout to Slidea as a new instance
     */
    $.slidea.addLayout("default", $.fn.slidea.defaultLayout);

})(jQuery, window, document);