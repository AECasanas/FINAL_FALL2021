/**
 |--------------------------------------------------------------------------
 | Slidea
 |--------------------------------------------------------------------------
 | Plugin Type: jQuery
 | License: CodeCanyon Standard / Extended
 | Author: Alex Grozav
 | Company: Pixobyte
 | Website: http://plugins.grozav.com/slidea
 | Email: alex@grozav.com
 */
;
(function($, window, document, undefined) {

    "use strict";

    // Events
    // slidea.load    : function(event)
    // slidea.change  : function(event, prev, current, next, max, element)
    // slidea.pause   : function(event)
    // slidea.resume  : function(event)
    // slidea.resize  : function(event, width, height)

    $.slidea = function(element, options) {


        // Default Settings
        // ---------------------
        var defaults = {
            width: 1280, // Slide canvas width
            height: 720, // Slide canvas height

            animation: {
                initial: 'opacity 0', // Slide initial animation state
                out: 'fade out', // Slide default out animation
                easing: 'swing', // Default animation easing
                duration: 500 // Default animation duration
            },

            delay: 4000, // Slide delay / display time
            start: 800, // Layer animation start time

            layout: 'default', // Slider layout
            layerIndex: 99, // Starting z-index for layers

            touch: true, // Slider touch controls

            retina: true, // Retina images with @2x suffix

            autoplay: true, // Autoplay feature
            pauseOnHover: false, // Pause autoplay on hover
            loop: true, // Start from first slide after reaching last

            progress: true, // Add progress bar
            progressPosition: 'bottom', // Progress bar position top / bottom
            progressClass: 'slidea-progress-light', // Additional thumbnail classes

            controls: true, // Add next / prev buttons
            controlsThumbnail: true, // Add thumbnail to controls
            controlsHTML: {
                prev: '&lt;',
                next: '&gt;'
            },
            controlsClass: 'slidea-controls-alternate', // Additional control classes

            thumbnails: false, // Add thumbnails
            thumbnailsVisible: { // Maximum number of thumbnails on page
                phone: 3,
                tablet: 4,
                laptop: 5,
                desktop: 6
            },
            thumbnailsPosition: 'after', // Thumbnails position before or after
            thumbnailsClass: '', // Additional thumbnail classes

            mousewheel: false, // Enable Slide on Scroll
            preventScrolling: true, // Prevent page scrolling if mousewheel enabled

            pagination: false, // Add pagination
            paginationPosition: 'inside', // Pagination position outside / inside
            paginationClass: 'slidea-pagination-light', // Additional pagination classes

            scroller: false, // Enable Scroller Item
            scrollerMarkup: '<span class="slidea-scroller-1"></span>', // Markup for scroller item (1 or 2)
            scrollerPosition: 'center', // Scroller position: left, center, right
            scrollerTop: 80, // Percentage from top of slider

            responsiveFont: true, // Resize font responsively
            responsiveFontMax: 9999, // Maximum font ratio
            responsiveFontMin: 0.2, // Minimum font ratio

            preventDragging: true, // Prevent image dragging

            selector: { // Element selectors
                slide: '.slide', // Should not be changed unless absolutely necessary
                content: '.content',
                background: '.background',
                videoBackground: '.video-background',
                video: '.video',
                videoCover: '.video-cover',
                layer: '.layer',
                object: '.object',
                next: '.next',
                prev: '.prev'
            }
        };

        // Units
        // ---------------------
        // Allowed animation parameter units
        var units = /%|px|deg/g;

        // Self
        // ---------------------
        var slider = this;
        slider.settings = {};

        // Animation States
        // ---------------------
        slider.animation = {};

        // Slider
        // ---------------------
        slider.element = $(element);
        slider.parent = slider.element.parent();
        slider.current = -1;

        // Window
        // ---------------------
        var $window = $(window);
        slider.winWidth = $window.width();
        slider.winHeight = $window.height();

        // Window
        // ---------------------
        slider.visibleWidth = slider.winWidth;
        slider.visibleHeight = slider.winHeight;

        // Cache
        // ---------------------
        slider.cache = {};

        // Retina Display
        // ---------------------
        slider.retina = false;

        // Video Players
        // ---------------------
        slider.youTubePlayer = {};
        slider.vimeoPlayer = {};

        // Timer
        // ---------------------
        // Used in slide to set timeout to next slide
        var timer = {};
        timer.timeout = null;
        timer.start = 0;
        timer.remaining = 0;

        /**
         |--------------------------------------------------------------------------
         | Add Loader
         |--------------------------------------------------------------------------
         | Adds a CSS3 Animated loader to the slider
         */
        var addLoader = function() {
            if ($('.slidea-loader-wrapper', slider.element).length == 0) {
                var html = '';
                html += '<div class="slidea-loader-wrapper">';
                html += '<div class="slidea-loader">';
                html += '<div class="slidea-loader-inner">';
                html += '<div class="preloader-wrapper big active"> <div class="spinner-layer spinner-blue"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div><div class="spinner-layer spinner-red"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div><div class="spinner-layer spinner-yellow"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div><div class="spinner-layer spinner-green"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div></div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';

                slider.element.prepend(html);
            }
        };


        /**
         |--------------------------------------------------------------------------
         | Hide Loader
         |--------------------------------------------------------------------------
         | Hides CSS3 Animated loader to the slider
         */
        var hideLoader = function() {
            $('.slidea-loader-wrapper', slider.element)
                .velocity({
                    scale: 3,
                    opacity: 0
                }, {
                    display: 'none'
                }, {
                    duration: 500
                });
        };


        /**
         |--------------------------------------------------------------------------
         | Init
         |--------------------------------------------------------------------------
         | Sets the slider default variables and animations
         */
        slider.init = function() {
            // User Settings
            // ---------------------
            slider.settings = $.extend({}, defaults, options);

            // Slider Loader
            // ---------------------
            addLoader();

            // Animation States
            // ---------------------
            initAnimation();

            // Slider Settings
            // ---------------------
            setDataSettings();

            // Add Slidea Classes
            // ---------------------
            addClasses();

            // Wrap Objects
            // ---------------------
            wrapObjects();

            // Check Retina
            // ---------------------
            if (istrue(slider.settings.retina))
                slider.retina = checkRetina();

            // Set Slider Inner
            // ---------------------
            slider.inner = $('.slidea-inner', slider.element);

            // Set Slides
            // ---------------------
            slider.slides = $('.slidea-slide', slider.element);
            slider.slidesLength = slider.slides.length;

            // Set Active Slide
            // ---------------------
            slider.active = slider.slides.eq(0);

            // Set Size Setup
            // ---------------------
            slider.winWidth = $window.width();
            slider.winHeight = $window.height();

            slider.parentWidth = slider.parent.width();
            slider.parentHeight = slider.parent.height();

            slider.elementWidth = slider.parentWidth;
            slider.elementHeight = slider.elementWidth / slider.settings.width * slider.settings.height;

            // Setup Layers
            // ---------------------
            setupLayers();

            // Setup Videos
            // ---------------------
            setupVideos();

            // Bind Window Resize
            // ---------------------
            bindResize();

            // Prevent Image Dragging
            // ---------------------
            if (istrue(slider.settings.preventDragging))
                preventDragging();

            // Perform Initial Load
            // ---------------------
            slider.load(function() {
                slider.setup();

                if (istrue(slider.settings.progress))
                    addProgressBar();
                if (istrue(slider.settings.pagination))
                    addPagination();
                if (istrue(slider.settings.scroller))
                    addScroller();
                if (istrue(slider.settings.thumbnails))
                    addThumbnails();
                if (istrue(slider.settings.pauseOnHover))
                    enablePauseOnHover();
                if (istrue(slider.settings.touch))
                    enableTouch();
                if (istrue(slider.settings.mousewheel))
                    enableMouseWheel();
                if (istrue(slider.settings.controls))
                    enableControls();

                setupContent();

                hideLoader();

                setTimeout(function() {
                    slider.slide(0);
                }, 500);

                slider.element.trigger('slidea.load');
            });
        };


        /**
         |--------------------------------------------------------------------------
         | wrapObjects
         |--------------------------------------------------------------------------
         | Wrap the slides with a .slidea-inner class for layout flexibility
         */
        var wrapObjects = function() {
            slider.element.wrapInner('<div class="slidea-inner"></div>');
        };


        /**
         |--------------------------------------------------------------------------
         | checkRetina
         |--------------------------------------------------------------------------
         | Checks if device has a Retina compatible screen
         */
        var checkRetina = function() {
            var root = (typeof exports === 'undefined' ? window : exports);
            var mediaQuery = '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)';

            if (root.devicePixelRatio > 1) {
                return true;
            }

            if (root.matchMedia && root.matchMedia(mediaQuery).matches) {
                return true;
            }

            return false;
        }


        /**
         |--------------------------------------------------------------------------
         | initRetina
         |--------------------------------------------------------------------------
         | Change image source to @2x.ext or to specified source if device screen
         | supports Retina
         */
        var initRetina = function($slide) {
            $('img[data-at2x]', $slide).each(function() {
                var $img = $(this);
                var newsrc = $img.attr('data-at2x');

                if (defined(newsrc)) {
                    var src = $img.attr('src');

                    if (newsrc == "true") {
                        src = src.replace(/(\.[\w\?=]+)$/, "@2x$1")
                    } else {
                        src = newsrc;
                    }

                    $img.attr('src', src);
                }
            });
        }

        /**
         |--------------------------------------------------------------------------
         | addClasses
         |--------------------------------------------------------------------------
         | Add the actual classes to the Slidea selector classes
         */
        var addClasses = function() {
            $(slider.settings.selector.slide, slider.element).addClass('slidea-slide');
            $(slider.settings.selector.content, slider.element).addClass('slidea-content');
            $(slider.settings.selector.background, slider.element).addClass('slidea-background');
            $(slider.settings.selector.videoBackground, slider.element).addClass('slidea-video-background');
            $(slider.settings.selector.video, slider.element).addClass('slidea-video');
            $(slider.settings.selector.videoCover, slider.element).addClass('slidea-video-cover');
            $(slider.settings.selector.layer, slider.element).addClass('slidea-layer');
            $(slider.settings.selector.object, slider.element).addClass('slidea-object');
            $(slider.settings.selector.next, slider.element).addClass('slidea-next');
            $(slider.settings.selector.prev, slider.element).addClass('slidea-prev');
            $(slider.settings.selector.pagination, slider.element).addClass('slidea-pagination');
        };

        /**
         |--------------------------------------------------------------------------
         | setDataSettings
         |--------------------------------------------------------------------------
         | Check if slider has data-settings which override default init settings
         */
        var setDataSettings = function() {
            if (defined(slider.element.attr('data-width'))) {
                slider.settings.width = slider.element.attr('data-width');
            }

            if (defined(slider.element.attr('data-height'))) {
                slider.settings.height = slider.element.attr('data-height');
            }

            if (defined(slider.element.attr('data-animation-initial'))) {
                slider.settings.animation.initial = slider.element.attr('data-animate-initial');
            }

            if (defined(slider.element.attr('data-animation-out'))) {
                slider.settings.animation.out = slider.element.attr('data-animate-out');
            }

            if (defined(slider.element.attr('data-duration'))) {
                slider.settings.animation.duration = slider.element.attr('data-duration');
            }

            if (defined(slider.element.attr('data-easing'))) {
                slider.settings.animation.easing = slider.element.attr('data-easing');
            }

            if (defined(slider.element.attr('data-delay'))) {
                slider.settings.delay = slider.element.attr('data-delay');
            }

            if (defined(slider.element.attr('data-layout'))) {
                slider.settings.layout = slider.element.attr('data-layout');
            }
        };


        /**
         |--------------------------------------------------------------------------
         | initAnimation
         |--------------------------------------------------------------------------
         | Set default animation parameters for Slidea animation objects
         | and create animus model
         */
        var initAnimation = function() {
            var override = {
                duration: slider.settings.animation.duration,
                easing: slider.settings.animation.easing
            };

            // Animus
            // ---------------------
            slider.animus = new $.animus(override);
        };

        /**
         |--------------------------------------------------------------------------
         | bindResize
         |--------------------------------------------------------------------------
         | Binds the slider's window resize functionality to cache current window
         | width and height and to set the layout up
         */
        var bindResize = function() {
            $window.resize(function() {
                slider.winWidth = $window.width();
                slider.winHeight = $window.height();

                slider.parentWidth = slider.parent.width();
                slider.parentHeight = slider.parent.height();

                slider.elementWidth = slider.parentWidth;
                slider.elementHeight = slider.elementWidth / slider.settings.width * slider.settings.height;

                slider.setup();

                setupContent();

                if (istrue(slider.settings.scroller)) {
                    positionScroller();
                }

                if (istrue(slider.settings.thumbnails)) {
                    resizeThumbnails();
                }

                slider.element.trigger('slidea.resize', [slider.parentWidth, slider.parentHeight]);
            });
        };

        /**
         |--------------------------------------------------------------------------
         | setupLayers
         |--------------------------------------------------------------------------
         | Set the z-index of each of the slider layers
         */
        var setupLayers = function() {
            slider.slides.each(function() {
                var $layers = $('.slidea-layer', $(this));
                var layerCount = $layers.length;
                $layers.each(function(i) {
                    var zindex = slider.settings.layerIndex + layerCount - i;
                    $(this).css('z-index', zindex);
                });
            });
        };


        /**
         |--------------------------------------------------------------------------
         | setupVideos
         |--------------------------------------------------------------------------
         | Setup video events at slide start for HTML5, YouTube and Vimeo videos
         */
        var setupVideos = function() {
            var delay = 500,
                interval, i = 0,
                tries = 10;

            $('video.slidea-video', slider.element).attr('data-video-type', 'html5');
            $('iframe[data-src*="youtube.com"].slidea-video', slider.element).attr('data-video-type', 'youtube');
            $('iframe[data-src*="vimeo.com"].slidea-video', slider.element).attr('data-video-type', 'vimeo');

            $('.slidea-video', slider.element).each(function() {
                var $video = $(this);
                var volume = $video.attr('data-volume');
                var controls = ($video.attr('data-controls') === 'true');
                var pauseSlider = ($video.attr('data-pause-slider') === 'true');
                var randomID = 'slidea-video-' + Math.floor((Math.random() * 1000) + 1);

                volume = isNaN(volume) ? 0 : volume;
                if (!defined($video.attr('id')))
                    $video.attr('id', randomID);

                var id = $video.attr('id');
                var src = $video.attr('data-src');

                // HTML5
                // ---------------------
                if ($video.attr('data-video-type') === 'html5') {
                    $video.get(0).volume = volume;

                    if (controls == true) {
                        $video.attr('controls', 'controls');
                    }

                    if (istrue(slider.settings.autoplay) && pauseSlider == true) {
                        $video.on("play", function() {
                            pauseTimer();
                        });
                        $video.on("pause ended", function() {
                            unpauseTimer();
                        });
                    }
                }

                // YouTube
                // ---------------------
                if ($video.attr('data-video-type') === 'youtube') {
                    var videoID, separator;

                    if (src.indexOf('enablejsapi=1') == -1) {
                        if (src.indexOf('?') == -1)
                            $video.attr('src', src + '?enablejsapi=1');
                        else
                            $video.attr('src', src + '&enablejsapi=1');

                        src = $video.attr('src');
                    }

                    if (src.indexOf('playerapiid=') == -1) {
                        if (src.indexOf('?') == -1)
                            $video.attr('src', src + '?playerapiid=' + id);
                        else
                            $video.attr('src', src + '&playerapiid=' + id);

                        src = $video.attr('src');
                    }

                    if (src.indexOf('embed') != '-1') {
                        videoID = src.split('/');
                        videoID = videoID[videoID.length - 1];

                        separator = videoID.indexOf('?');
                        if (separator != -1) {
                            videoID = videoID.substring(0, separator);
                        }
                    } else {
                        videoID = src.split('v=')[1];
                        separator = videoID.indexOf('&');
                        if (separator != -1) {
                            videoID = videoID.substring(0, separator);
                        }
                    }

                    $video.load(function() {
                        slider.youTubePlayer[id] = new YT.Player(id, {
                            height: '720',
                            width: '1280',
                            videoId: videoID,
                            events: {
                                "onStateChange": function(e) {
                                    if (e.data === 1)
                                        pauseTimer();
                                    if (e.data === 2 || e.data === 0)
                                        unpauseTimer();
                                }
                            }
                        });

                        i = 0;
                        interval = setInterval(function() {
                            i++;

                            if (i == tries)
                                clearInterval(interval);
                            else if (!defined(slider.youTubePlayer[id]) || typeof slider.youTubePlayer[id].setVolume !== 'function')
                                return;
                            else
                                clearInterval(interval);

                            slider.youTubePlayer[id].setVolume(volume);
                        }, delay);

                    })

                }

                // Vimeo
                // ---------------------
                if ($video.attr('data-video-type') === 'vimeo') {

                    if (src.indexOf('api=1') == -1) {
                        if (src.indexOf('?') == -1)
                            $video.attr('src', src + '?api=1');
                        else
                            $video.attr('src', src + '&api=1');

                        src = $video.attr('src');
                    }

                    if (src.indexOf('player_id=') == -1) {
                        if (src.indexOf('?') == -1)
                            $video.attr('src', src + '?player_id=' + id);
                        else
                            $video.attr('src', src + '&player_id=' + id);

                        src = $video.attr('src');
                    }

                    $video.load(function() {
                        slider.vimeoPlayer[id] = $f(id);
                        slider.vimeoPlayer[id].addEvent('ready', function() {
                            $video.attr('data-ready', 'true');
                            slider.vimeoPlayer[id].api('setVolume', volume);

                            if (istrue(slider.settings.autoplay) && pauseSlider == true) {
                                slider.vimeoPlayer[id].addEvent('play', pauseTimer);
                                slider.vimeoPlayer[id].addEvent('pause', unpauseTimer);
                                slider.vimeoPlayer[id].addEvent('finish', unpauseTimer);
                            }
                        });
                    });

                }
            })

            $('.slidea-video-cover', slider.element).each(function() {
                var $cover = $(this);
                var $parent = $cover.parent();
                var $video = $('.slidea-video', $parent);
                var type = $video.attr('data-video-type')
                var id = $video.attr('id')

                switch (type) {
                    case 'html5':
                        {
                            $cover.on('click', function() {
                                $video.get(0).play();
                                $cover.velocity('fadeOut');
                            })
                        }
                        break;
                    case 'youtube':
                        {
                            $cover.on('click', function() {
                                slider.youTubePlayer[id].playVideo();
                                $cover.velocity('fadeOut');
                            })
                        }
                        break;
                    case 'vimeo':
                        {
                            $cover.on('click', function() {
                                slider.vimeoPlayer[id].api('play');
                                $cover.velocity('fadeOut');
                            })
                        }
                        break;
                }
            });

        };


        /**
         |--------------------------------------------------------------------------
         | setupContent
         |--------------------------------------------------------------------------
         | Set the content width and responsive font size utility
         */
        var setupContent = function() {
            var $content = $('.slidea-content', slider.element);
            $content.width(slider.parentWidth);

            // Responsive Font
            // ---------------------
            if (istrue(slider.settings.responsiveFont)) {
                var $text = $('h1, h2, h3, h4, h5, h6, p, caption, span', slider.element);
                var ratio = slider.element.width() / slider.settings.width;
                ratio = ratio > slider.settings.responsiveFontMax ? slider.settings.responsiveFontMax : ratio < slider.settings.responsiveFontMin ? slider.settings.responsiveFontMin : ratio;

                $text.each(function() {
                    var fontSize = '14px';
                    if (defined($(this).attr('data-font-size'))) {
                        fontSize = $(this).attr('data-font-size');
                    } else {
                        fontSize = $(this).css('font-size');
                        $(this).attr('data-font-size', fontSize);
                    }
                    fontSize = parseFloat(fontSize) * ratio;

                    $(this).css('font-size', fontSize + 'px');
                    $(this).css('line-height', fontSize * 1.1 + 'px');
                });
            }

            // Content Positioning
            // ---------------------
            $('.content.content-top', slider.element).css('top', 0);
            $('.content.content-center', slider.element).each(function() {
                $(this).height(slider.element.height());
            });
            $('.content.content-bottom', slider.element).each(function() {
                $(this).css({
                    'bottom': slider.elementHeight - slider.element.height()
                });
            });
        };

        /**
         |--------------------------------------------------------------------------
         | Setup
         |--------------------------------------------------------------------------
         | Setup wrapper function for calling static slider method
         */
        slider.setup = function() {
            // Create Layout
            // ---------------------
            slider.layout = {};
            $.each($.slidea.layout, function(index, value) {
                slider.layout[index] = new value();
            });

            // Init Layout
            // ---------------------
            slider.layout[slider.settings.layout].init.call(slider);

            // Setup Layout
            // ---------------------
            slider.layout[slider.settings.layout].setup.call(slider);
        };


        /**
         |--------------------------------------------------------------------------
         | Slide
         |--------------------------------------------------------------------------
         | Slide wrapper function for calling static slider method to move
         | the carousel to the next slide
         */
        slider.slide = function(i) {
            var from = slider.current;
            var next = i + 1 > slider.slidesLength - 1 ? 0 : i + 1;
            var prev = i - 1 < 0 ? slider.slidesLength - 1 : i - 1;

            // Index Logic
            // ---------------------
            if (i == slider.current)
                return;

            if (i > slider.slidesLength - 1)
                i = 0;
            if (i < 0)
                i = slider.slidesLength - 1;

            // Set Active
            // ---------------------
            $('.previous', slider.element).removeClass('previous');
            slider.active.removeClass('active').addClass('previous');
            slider.active = slider.slides.eq(i);
            slider.active.addClass('active');


            // Clear Timeouts
            // ---------------------
            if (slider.current != -1)
                slider.clearTimeouts(slider.current);
            slider.clearTimeouts(i);

            // Layout Slide
            // ---------------------
            slider.layout[slider.settings.layout].slide.call(slider, i, slider.current);

            // Set Current
            // ---------------------
            slider.current = i;

            // Go to next
            // ---------------------
            // Go to the next slide after the slide specific delay
            if (istrue(slider.settings.autoplay)) {

                timer.start = new Date();
                timer.remaining = slider.cache[i].background.delay;

                clearTimeout(timer.clock);
                timer.clock = setTimeout(function() {
                    if (!istrue(slider.settings.loop) && i + 1 == slider.slidesLength - 1)
                        return;
                    slider.slide(i + 1);
                }, timer.remaining);
            }

            // Animate Progress Bar
            // ---------------------
            if (istrue(slider.settings.progress)) {
                slider.progress.bar
                    .velocity('stop')
                    .velocity({
                        width: '0%'
                    }, 0)
                    .velocity({
                        width: '100%'
                    }, timer.remaining);
            }

            // Set Control Thumbnails
            // ---------------------
            if (istrue(slider.settings.controlsThumbnail)) {
                slider.prevThumbnail.attr('src', slider.cache[prev].thumbnail);
                slider.nextThumbnail.attr('src', slider.cache[next].thumbnail);
            }

            // Set Pagination Active
            // ---------------------
            if (slider.settings.pagination) {
                slider.pagination.filter('.active').removeClass('active');
                slider.pagination.eq(i).addClass('active');
            }

            // Set Thumbnails Active
            // ---------------------
            if (slider.settings.thumbnails) {
                slider.thumbnails.elements.filter('.active').removeClass('active');
                slider.thumbnails.elements.eq(i).addClass('active');
            }

            // Handle Videos
            // ---------------------
            slider.handleVideos(from, i);


            slider.element.trigger('slidea.change', [prev, slider.current, next, slider.slidesLength, slider.active]);
        };


        /**
         |--------------------------------------------------------------------------
         | clearTimeouts
         |--------------------------------------------------------------------------
         | Clears all the set timeouts for the chosen slide in order to stop all
         | programmed animations
         */
        slider.clearTimeouts = function(i) {
            $.each(slider.cache[i].background.animation, function(index) {
                clearTimeout(slider.cache[i].background.animation[index].timeline);
            });

            $.each(slider.cache[i].layer, function(index) {
                $.each(slider.cache[i].layer[index].animation, function(animateIndex) {
                    clearTimeout(slider.cache[i].layer[index].animation[animateIndex].timeline);
                });
            });

            $.each(slider.cache[i].object, function(index) {
                $.each(slider.cache[i].object[index].animation, function(animateIndex) {
                    clearTimeout(slider.cache[i].object[index].animation[animateIndex].timeline);
                });
            });
        };


        /**
         |--------------------------------------------------------------------------
         | Next & Previous Slide
         |--------------------------------------------------------------------------
         | Helper classes to slide to next slide or to the previous one
         */
        slider.next = function() {
            var next = slider.current + 1 > slider.slidesLength - 1 ? 0 : slider.current + 1;
            slider.slide(next);
        };

        slider.prev = function() {
            var prev = slider.current - 1 < 0 ? slider.slidesLength - 1 : slider.current - 1;
            slider.slide(prev);
        };


        /**
         |--------------------------------------------------------------------------
         | Pause & Unpause
         |--------------------------------------------------------------------------
         | Helper classes to pause or unpause the slider
         */
        slider.pause = function() {
            pauseTimer();
        };

        slider.resume = function() {
            unpauseTimer();
        };

        /**
         |--------------------------------------------------------------------------
         | videoTimeline
         |--------------------------------------------------------------------------
         | Handle autoplay timeouts using a timeout timeline
         */
        var videoTimeline = {};

        /**
         |--------------------------------------------------------------------------
         | handleVideos
         |--------------------------------------------------------------------------
         | Handle video events at slide start for HTML5, YouTube and Vimeo videos
         */
        slider.handleVideos = function(previous, current) {

            var $previous = slider.slides.eq(previous);
            var $current = slider.slides.eq(current);

            // Previous Slide
            // ---------------------
            // Pause or stop videos from previous slide
            if (previous !== -1)
                $('.slidea-video', $previous).each(function() {
                    var $video = $(this);
                    var id = $video.attr('id');

                    var reset = ($video.attr('data-reset') === 'true');

                    clearTimeout(videoTimeline[id]);

                    // HTML5
                    // ---------------------
                    if ($video.attr('data-video-type') === 'html5') {
                        $video.get(0).pause();
                        if (reset) {
                            setTimeout(function() {
                                $video.get(0).currentTime = 0;
                            }, slider.cache[current].background.animation[0].duration);
                        }
                    }

                    // Youtube
                    // ---------------------
                    if ($video.attr('data-video-type') === 'youtube') {
                        slider.youTubePlayer[id].pauseVideo();
                        if (reset) {
                            setTimeout(function() {
                                slider.youTubePlayer[id].stopVideo();
                            }, slider.cache[current].background.animation[0].duration);
                        }
                    }

                    // Vimeo
                    // ---------------------
                    if ($video.attr('data-video-type') === 'vimeo') {
                        slider.vimeoPlayer[id].api('pause');
                        if (reset) {
                            setTimeout(function() {
                                slider.vimeoPlayer[id].api('unload');
                            }, slider.cache[current].background.animation[0].duration);
                        }
                    }
                });

            // Current Slide
            // ---------------------
            // Play videos from current slide
            $('.slidea-video', $current).each(function() {
                var $video = $(this);
                var id = $video.attr('id');

                var delay = 500,
                    interval, i = 0,
                    tries = 10;

                var autoplay = ($video.attr('data-autoplay') === 'true');
                var autoplayTime = defined($video.attr('data-autoplay-time')) ? parseInt($video.attr('data-autoplay-time'), 10) : 100;
                var pauseSlider = ($video.attr('data-pause-slider') === 'true');

                // HTML5
                // ---------------------
                if ($video.attr('data-video-type') === 'html5') {
                    if (autoplay == true) {
                        videoTimeline[id] = setTimeout(function() {
                            $video.get(0).play();
                        }, autoplayTime);
                    }

                }

                // Youtube
                // ---------------------
                if ($video.attr('data-video-type') === 'youtube') {
                    if (autoplay == true) {
                        i = 0;
                        interval = setInterval(function() {
                            i++;

                            if (i == tries)
                                clearInterval(interval);
                            else if (!defined(slider.youTubePlayer[id]) || typeof slider.youTubePlayer[id].playVideo !== 'function')
                                return;
                            else
                                clearInterval(interval);

                            videoTimeline[id] = setTimeout(function() {
                                slider.youTubePlayer[id].playVideo();
                            }, autoplayTime);

                        }, delay);
                    }
                }

                // Vimeo
                // ---------------------
                if ($video.attr('data-video-type') === 'vimeo') {
                    if (autoplay == true) {
                        i = 0;
                        interval = setInterval(function() {
                            i++;

                            if (i == tries)
                                clearInterval(interval);
                            else if (!defined($video.attr('data-ready')) || typeof slider.vimeoPlayer[id].api !== 'function')
                                return;
                            else
                                clearInterval(interval);

                            videoTimeline[id] = setTimeout(function() {
                                Froogaloop(id).api('play');
                            }, autoplayTime);
                        }, delay);
                    }
                }
            });
        };


        /**
         |--------------------------------------------------------------------------
         | enableTouch
         |--------------------------------------------------------------------------
         | Get swipe direction and go to next or previous slide
         */
        var enableTouch = function() {
            slider.element.hammer().on('swipe', function(ev) {
                if (ev['gesture']['direction'] === 2 && ev['gesture']['distance'] > 100)
                    slider.slide(slider.current + 1);
                if (ev['gesture']['direction'] === 4 && ev['gesture']['distance'] > 100)
                    slider.slide(slider.current - 1);
                ev.preventDefault();
            });
        };


        /**
         |--------------------------------------------------------------------------
         | enableMouseWheel
         |--------------------------------------------------------------------------
         | Get scrolling direction and go to next or previous slide
         */
        var enableMouseWheel = function() {
            slider.element.mousewheel(function(event) {
                if (event.deltaY == -1) {
                    slider.slide(slider.current + 1);
                }

                if (event.deltaY == 1) {
                    slider.slide(slider.current - 1);
                }

                if (istrue(slider.settings.preventScrolling)) {
                    event.preventDefault();
                }
            });
        };


        /**
         |--------------------------------------------------------------------------
         | enableControls
         |--------------------------------------------------------------------------
         | Enable next and previous buttons and bind the controls
         */
        var enableControls = function() {
            var html = '';
            html += '<a href="javascript:void(0);" class="slidea-control slidea-prev ' + slider.settings.controlsClass + '">';
            html += '<div class="slidea-control-inner">';
            if (istrue(slider.settings.controlsThumbnail)) {
                html += '<div class="slidea-control-thumbnail">';
                html += '<img src="" alt="Previous Slide" class="slidea-control-image"/>';
                html += '</div>';
            }
            html += '<div class="slidea-control-text">';
            html += slider.settings.controlsHTML.prev;
            html += '</div>';
            html += '</div>';
            html += '</a>';

            html += '<a href="javascript:void(0);" class="slidea-control slidea-next ' + slider.settings.controlsClass + '">';
            html += '<div class="slidea-control-inner">';
            if (istrue(slider.settings.controlsThumbnail)) {
                html += '<div class="slidea-control-thumbnail">';
                html += '<img src="" alt="Next Slide" class="slidea-control-image"/>';
                html += '</div>';
            }
            html += '<div class="slidea-control-text">';
            html += slider.settings.controlsHTML.next;
            html += '</div>';
            html += '</div>';
            html += '</a>';

            slider.element.append(html);

            slider.prevButton = $('.slidea-prev', slider.element);
            slider.nextButton = $('.slidea-next', slider.element);

            if (istrue(slider.settings.controlsThumbnail)) {
                slider.prevThumbnail = $('.slidea-control-image', slider.prevButton);
                slider.nextThumbnail = $('.slidea-control-image', slider.nextButton);
            }

            slider.prevButton.on('click', function() {
                slider.slide(slider.current - 1);
            });
            slider.nextButton.on('click', function() {
                slider.slide(slider.current + 1);
            });

        };


        /**
         |--------------------------------------------------------------------------
         | enablePauseOnHover
         |--------------------------------------------------------------------------
         | Get swipe direction and go to next or previous slide
         */
        var enablePauseOnHover = function() {
            slider.element.on('mouseenter', function() {
                pauseTimer();
            });
            slider.element.on('mouseleave', function() {
                unpauseTimer();
            });
        };


        /**
         |--------------------------------------------------------------------------
         | pauseTimer
         |--------------------------------------------------------------------------
         | Pause autoplay when mouse is over slider element
         */
        var pauseTimer = function() {
            var currentTime = new Date();
            timer.remaining = timer.remaining - (currentTime - timer.start);

            clearTimeout(timer.clock);

            if (istrue(slider.settings.progress)) {
                slider.progress.bar.velocity('stop');
            }

            slider.element.trigger('slidea.pause');
        };

        /**
         |--------------------------------------------------------------------------
         | unpauseTimer
         |--------------------------------------------------------------------------
         | Unpause timer when hovering about slider element stops
         */
        var unpauseTimer = function() {
            var nextSlide = slider.current == -1 ? 1 : slider.current + 1;

            timer.start = new Date();

            clearTimeout(timer.clock);
            timer.clock = setTimeout(function() {
                slider.slide(nextSlide);
            }, timer.remaining);

            if (istrue(slider.settings.progress)) {
                slider.progress.bar.velocity({
                    width: '100%'
                }, timer.remaining);
            }

            slider.element.trigger('slidea.resume');
        };

        /**
         |--------------------------------------------------------------------------
         | preventDragging
         |--------------------------------------------------------------------------
         | Prevent image dragging on computers
         */
        var preventDragging = function() {
            $('img', slider.element).on('dragstart', function(event) {
                event.preventDefault();
            });
        };

        /**
         |--------------------------------------------------------------------------
         | addProgressBar
         |--------------------------------------------------------------------------
         | Add progress bar to the slider container
         */
        var addProgressBar = function() {
            var position = slider.settings.progressPosition == 'top' ? 'slidea-progress-top' : 'slidea-progress-bottom';

            var html = '';
            html += '<div class="slidea-progress ' + position + ' ' + slider.settings.progressClass + '">';
            html += '<div class="slidea-progress-bar">';
            html += '</div>';
            html += '</div>';

            slider.element.prepend(html);

            slider.progress = {};
            slider.progress.element = $('.slidea-progress', slider.element);
            slider.progress.bar = $('.slidea-progress-bar', slider.element);
        };

        /**
         |--------------------------------------------------------------------------
         | addPagination
         |--------------------------------------------------------------------------
         | Add pagination bullets to the slider
         */
        var addPagination = function() {
            var position = slider.settings.paginationPosition === 'inside' ? 'slidea-pagination-inside' : 'slidea-pagination-outside';

            var html = '';
            html += '<div class="slidea-pagination ' + position + ' ' + slider.settings.paginationClass + '">';
            for (var i = 0; i < slider.slidesLength; i++) {
                html += '<div class="slidea-pagination-bullet"></div>';
            }
            html += '</div>';


            var $pagination = $(html);

            if (slider.settings.paginationPosition === 'inside') {
                slider.element.prepend($pagination);
            } else {
                slider.element.after($pagination);
            }

            slider.pagination = $('.slidea-pagination-bullet', $pagination);

            slider.pagination.each(function(i) {
                var $bullet = $(this);
                $bullet.on('click', function() {
                    slider.pagination.filter('.active').removeClass('active');
                    $bullet.addClass('active');

                    slider.slide(i);
                });
            });

        };


        /**
         |--------------------------------------------------------------------------
         | addScroller
         |--------------------------------------------------------------------------
         | Add scroller item to slider and bind click action
         */
        var addScroller = function() {
            var tryscroller = setInterval(function() {
                var height = slider.element.height();
                if (defined(height) && height > 0) {
                    clearInterval(tryscroller);

                    var position = slider.settings.scrollerTop * height / 100;
                    var scroller = '<div class="slidea-scroller-wrapper slidea-scroller-' + slider.settings.scrollerPosition + '">';
                    scroller += slider.settings.scrollerMarkup;
                    scroller += '</div>';

                    slider.element.prepend(scroller);
                    slider.scroller = $('.slidea-scroller-wrapper', slider.element);
                    slider.scrollerHeight = slider.scroller.height();
                    slider.scroller.css('marginTop', height - slider.scrollerHeight);

                    slider.scroller.on('click', function() {
                        $("html").velocity("scroll", {
                            offset: slider.element.height(),
                            mobileHA: false,
                            duration: 1000
                        });
                    });

                    positionScroller();
                }
            }, 500)
        }

        /**
         |--------------------------------------------------------------------------
         | positionScroller
         |--------------------------------------------------------------------------
         | Position the scroller item based on scroller options
         */
        var positionScroller = function() {
            var position = slider.settings.scrollerTop * slider.element.height() / 100 - slider.scrollerHeight;
            slider.scroller.css('margin-top', position);
        }


        /**
         |--------------------------------------------------------------------------
         | addThumbnails
         |--------------------------------------------------------------------------
         | Add thumbnails underneath our slider
         */
        var addThumbnails = function() {
            var thumbsCount = slider.settings.thumbnailsVisible.desktop;
            if (slider.winWidth < 768) {
                thumbsCount = slider.settings.thumbnailsVisible.phone;
            } else if (slider.winWidth < 992) {
                thumbsCount = slider.settings.thumbnailsVisible.tablet;
            } else if (slider.winWidth < 1200) {
                thumbsCount = slider.settings.thumbnailsVisible.laptop;
            }

            var width = slider.parentWidth / thumbsCount;
            var innerWidth = width * slider.slidesLength;

            var html = '';
            html += '<div class="slidea-thumbnails ' + slider.settings.thumbnailsClass + '">';
            html += '<div class="slidea-thumbnails-inner" style="width: ' + innerWidth + 'px;">';
            $.each(slider.cache, function(index) {
                html += '<div class="slidea-thumbnail-wrapper" style="width: ' + width + 'px;">';
                html += '<img class="slidea-thumbnail" src="' + this.thumbnail + '" alt="Slide ' + index + '" />';
                html += '</div>';
            });
            html += '</div>';
            html += '</div>';

            slider.thumbnails = {};
            slider.thumbnails.wrapper = $(html);

            if (slider.settings.thumbnailsPosition === 'before')
                slider.element.before(slider.thumbnails.wrapper);
            else
                slider.element.after(slider.thumbnails.wrapper);

            slider.thumbnails.inner = $('.slidea-thumbnails-inner', slider.thumbnails.wrapper);
            slider.thumbnails.elements = $('.slidea-thumbnail-wrapper', slider.thumbnails.wrapper);

            slider.thumbnails.elements.each(function(i) {
                var $thumbnail = $(this);
                $thumbnail.on('click', function() {
                    slider.thumbnails.elements.filter('.active').removeClass('active');
                    $thumbnail.addClass('active');

                    slider.slide(i);
                });
            });

            $('img', slider.thumbnails.elements.eq(0)).load(function() {
                var height = $(this).height();
                slider.thumbnails.inner.height(height)
            });

            $('img', slider.thumbnails.elements).on('dragstart', function(event) {
                event.preventDefault();
            });


            if (istrue(slider.settings.touch)) {
                var translateThumbnails = 0,
                    translateText;
                slider.thumbnails.elements.hammer().on('pan', function(ev) {
                    var width = slider.thumbnails.inner.width();
                    var parentWidth = slider.thumbnails.wrapper.width();


                    translateThumbnails -= ev['gesture']['velocityX'] * 7;

                    if (translateThumbnails > 0) {
                        translateThumbnails = 0;
                    } else if (translateThumbnails < parentWidth - width) {
                        translateThumbnails = parentWidth - width;
                    }

                    if (translateThumbnails <= 0 && translateThumbnails > parentWidth - width) {
                        var translate = "translate(" + translateThumbnails + "px, 0)";
                        slider.thumbnails.inner.css({
                            'webkit-transform': translate,
                            'moz-transform': translate,
                            'ms-transform': translate,
                            'o-transform': translate,
                            'transform': translate
                        }, 0);
                    }

                    ev.preventDefault();
                });
            }

        };

        /**
         |--------------------------------------------------------------------------
         | resizeThumbnails
         |--------------------------------------------------------------------------
         | Resize thumbnails when window resize happens
         */
        var resizeThumbnails = function() {
            var thumbsCount = slider.settings.thumbnailsVisible.desktop;
            if (slider.winWidth < 768) {
                thumbsCount = slider.settings.thumbnailsVisible.phone;
            } else if (slider.winWidth < 992) {
                thumbsCount = slider.settings.thumbnailsVisible.tablet;
            } else if (slider.winWidth < 1200) {
                thumbsCount = slider.settings.thumbnailsVisible.laptop;
            }

            var width = slider.parentWidth / thumbsCount,
                height;
            var innerWidth = width * slider.slidesLength;

            slider.thumbnails.inner.width(innerWidth);
            slider.thumbnails.elements.width(width);

            height = $('img', slider.thumbnails.elements.eq(0)).height();
            slider.thumbnails.inner.height(height);

            slider.thumbnails.inner.css({
                'webkit-transform': "translate(0, 0)",
                'moz-transform': "translate(0, 0)",
                'ms-transform': "translate(0, 0)",
                'o-transform': "translate(0, 0)",
                'transform': "translate(0, 0)"
            }, 0);
        };

        /**
         |--------------------------------------------------------------------------
         | Load
         |--------------------------------------------------------------------------
         | Load function to imagesLoaded images and cache slide animations
         */
        slider.load = function(callback) {
            var i = 0;

            slider.slides.each(function(index) {
                var $slide = $(this);

                // Retina Setup
                // ---------------------
                if (slider.retina == true) {
                    initRetina($slide);
                }

                // Preload Image
                // ---------------------
                $slide.imagesLoaded().always(function() {
                    var $background = $('.slidea-background', $slide);
                    var $layers = $('.slidea-layer', $slide);
                    var $objects = $('.slidea-object', $slide);

                    // Cache Setup
                    // ---------------------
                    slider.cache[index] = {};
                    slider.cache[index].layer = {};
                    slider.cache[index].object = {};
                    slider.cache[index].background = getAnimationData($slide, $background, 'background');

                    // Cache layers
                    // ---------------------
                    var layerDelay = slider.cache[index].background.delay - slider.cache[index].background.animation[0].duration / 2;
                    $layers.each(function(layerIndex) {
                        var $layer = $(this),
                            $image = null;

                        if ($layer.is('img')) {
                            $image = $(this);
                        }

                        slider.cache[index].layer[layerIndex] = getAnimationData($layer, $image, 'layer', layerDelay);
                    });

                    // Cache objects
                    // ---------------------
                    $objects.each(function(objectIndex) {
                        var $object = $(this);

                        slider.cache[index].object[objectIndex] = getAnimationData($object, null, 'object', layerDelay);
                    });


                    // Cache Thumbnail
                    // ---------------------
                    var thumbnail = $slide.attr('data-thumbnail');
                    if (thumbnail)
                        slider.cache[index].thumbnail = thumbnail;
                    else
                        slider.cache[index].thumbnail = $background.attr('src');

                    // Check if loaded
                    // ---------------------
                    // If all slides are loaded, call the actual setup function
                    i++;
                    if (i == slider.slidesLength) {
                        callback.call();
                    }
                });
            });
        };


        /**
         |--------------------------------------------------------------------------
         | getAnimationData
         |--------------------------------------------------------------------------
         | Load wrapper function to imagesLoaded images and cache slide animations.
         | The first animation is reversed, so that we start our slide with the default
         | position every time. T
         */
        var getAnimationData = function($object, $image, type, delay) {
            var string = "",
                timeStack = [0],
                i = 1;

            // Set Element
            // ---------------------
            var element = {};
            element.type = type;
            element.animation = {};

            // Get Base Image Size
            // ---------------------
            if ($image != null && defined($image.get(0))) {

                element.width = $image.get(0).naturalWidth;
                element.height = $image.get(0).naturalHeight;


                if (!defined(element.width)) {
                    element.width = $image.get(0).width;
                }
                if (!defined(element.height)) {
                    element.height = $image.get(0).height;
                }

                if (!defined(element.width)) {
                    element.width = slider.settings.width;
                }
                if (!defined(element.height)) {
                    element.height = slider.settings.height;
                }
            } else {
                element.width = 'auto';
                element.height = 'auto';
            }

            // Get Layer Settings
            // ---------------------
            if (type === 'layer') {
                element.position = {};

                if (defined($object.attr('data-top'))) {
                    element.position.top = parseFloat($object.attr('data-top'));
                } else if (defined($object.attr('data-bottom'))) {
                    element.position.bottom = parseFloat($object.attr('data-bottom'));
                } else {
                    element.position.top = 0;
                }

                if (defined($object.attr('data-left'))) {
                    element.position.left = parseFloat($object.attr('data-left'));
                } else if (defined($object.attr('data-right'))) {
                    element.position.right = parseFloat($object.attr('data-right'));
                } else {
                    element.position.left = 0;
                }

                if (defined($object.attr('data-width'))) {
                    element.width = parseFloat($object.attr('data-width'));
                }
                if (defined($object.attr('data-height'))) {
                    element.height = parseFloat($object.attr('data-height'));
                }
            }


            // Get Initial
            // ---------------------
            if (defined($object.attr('data-animate-initial')))
                string = $object.attr('data-animate-initial');
            else if (type === 'background')
                string = slider.settings.animation.initial;
            else
                string = "";

            // This sets the initial state of our animated object
            // The entering animation will be set as css and will
            // transition to the default state
            element.animation.initial = slider.animus.get(string);


            // Get Enter Animation
            // ---------------------
            // Starting time for layer animation
            if (defined($object.attr('data-start')))
                element.start = parseInt($object.attr('data-start'), 10);
            else if (type === 'background')
                element.start = 0;
            else
                element.start = slider.settings.start;

            // Get In Animation
            // ---------------------
            // Set animation in override to set a different beginning state
            // other than the default one
            element.animation[element.start] = slider.animus.get($object.attr('data-animate-in'));

            // Get Display Time
            // ---------------------
            if (defined($object.attr('data-delay')))
                element.delay = parseInt($object.attr('data-delay'), 10) + parseInt(element.animation[element.start].duration, 10);
            else
                element.delay = parseInt(slider.settings.delay, 10) + parseInt(element.animation[element.start].duration, 10);

            // Get Animation Timeline
            // ---------------------
            var animationStack = {};
            var timeline = $object.data();
            $.each(timeline, function(key, value) {
                var time;

                // Check if data key matches animation
                if ((time = key.match(/animateAt([0-9]*)/)) != null) {
                    var atTime = parseInt(time[1], 10);

                    animationStack[atTime] = value;

                    // Add time to time stack
                    timeStack[i++] = atTime;
                }
            });

            // Set Animation Timeline
            // ---------------------
            // The time stack is needed to maintain the order of
            // the object animations since JSON objects aren't ordered
            timeStack.sort();
            $.each(timeStack, function(key) {
                element.animation[timeStack[key]] = slider.animus.get(animationStack[timeStack[key]]);
            });

            // Get Exit Animation
            // ---------------------
            if (defined($object.attr('data-animate-out')))
                string = $object.attr('data-animate-out');
            else if (type === 'background')
                string = slider.settings.animation.out;
            else
                string = "";


            // Set ending time as default delay or when last animation ends
            var lastTime = timeStack[timeStack.length - 1];
            var endTime;

            if (string !== "") {
                if (type === 'background')
                    endTime = element.delay > lastTime + element.animation[lastTime].duration ? element.delay : lastTime + element.animation[lastTime].duration;
                else
                    endTime = delay;

                element.animation[endTime] = slider.animus.get(string);
            }

            // Get Animation Reset
            // ---------------------
            // Set reset state by getting all the animation variables
            // and setting them to the default values
            element.animation.initial.state = slider.animus.reset(true, element, element.animation.initial.state);
            element.animation[element.start].state = slider.animus.reset(true, element, element.animation[element.start].state);

            // Set fade from 0 to 1 if opacity is not set already
            if (!('opacity' in element.animation.initial.state))
                element.animation.initial.state.opacity = 0;
            if (!('opacity' in element.animation[element.start].state))
                element.animation[element.start].state.opacity = 1;

            return element;
        };


        /**
         |--------------------------------------------------------------------------
         | set
         |--------------------------------------------------------------------------
         | Helper function to set a variable if it is defined, not set already and
         | the string matches our expected measurement units
         |
         | @var     object      Animation object which is going to be set
         | @var     state       Initial or final state animation selector
         | @var     parameter   CSS attribute to be modified
         | @var     value       Value to be set to the object
         | @var     overwrite   Overwrite any existing values
         */
        var set = function(object, parameter, value, overwrite) {
            if (!defined(object[parameter]) || overwrite == true) {
                if (defined(value) && ($.isNumeric(value) || units.test(value))) {
                    object[parameter] = value;
                }
            }
        };

        /**
         |--------------------------------------------------------------------------
         | defined
         |--------------------------------------------------------------------------
         | Helper function to check whether a variable is defined or not
         | @var     variable
         */
        var defined = function(variable) {
            return typeof variable !== 'undefined';
        };

        /**i
         |--------------------------------------------------------------------------
         | isTrue
         |--------------------------------------------------------------------------
         | Helper function to check whether a variable is true or false
         | @var     variable
         */
        var istrue = function(variable) {
            return variable == true || variable === "true";
        };

        /**
         |--------------------------------------------------------------------------
         | Construct
         |--------------------------------------------------------------------------
         | Initialize slider when constructed
         */
        slider.init();
    };


    /**
     |--------------------------------------------------------------------------
     | Slidea Layout
     |--------------------------------------------------------------------------
     | Stores all the plugin layouts for further processing
     */
    $.slidea.layout = {};


    /**
     |--------------------------------------------------------------------------
     | Slidea addLayout
     |--------------------------------------------------------------------------
     | Adds a layout which can be applied to the slider
     |
     | @type    static      Function scope is outside the Slidea elements
     */
    $.slidea.addLayout = function(name, layout) {
        $.slidea.layout[name] = layout;
    };

    /**
     |--------------------------------------------------------------------------
     | Wrapper
     |--------------------------------------------------------------------------
     | Mark the plugin initialization with a data attribute to prevent multiple
     | calls on the same DOM Element
     */
    $.fn.slidea = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('slidea')) {
                var self = new $.slidea(this, options);
                $(this).data('slidea', self);
            }
        });
    }

})(jQuery, window, document);
