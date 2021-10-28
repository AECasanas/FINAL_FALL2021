/**
 |--------------------------------------------------------------------------
 | Animus
 |--------------------------------------------------------------------------
 | Plugin Type: jQuery
 | License: CodeCanyon Standard / Extended
 | Author: Alex Grozav
 | Company: Pixobyte
 | Website: http://plugins.grozav.com/animus
 | Email: alex@grozav.com
 */
;
(function ($, window, document, undefined) {

    "use strict";

    $.animus = function (defaults, finals) {

        var animus = this;

        // Animation Model
        // ---------------------
        var model = {};

        // Model Default State
        // ---------------------
        model.defaults = {
            duration: 600,
            easing: 'swing',
            state: {
                opacity: 1,
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                translateX: 0,
                translateY: 0,
                translateZ: 0,
                scale: 1,
                scaleX: 1,
                scaleY: 1,
                scaleZ: 1,
                skewX: '0%',
                skewY: '0%'
            },
            timeline: null
        };


        // Model final State
        // ---------------------
        model.finals = {
            state: {
                opacity: 0,
                rotateX: 45,
                rotateY: 45,
                rotateZ: 45,
                translateX: '-100%',
                translateY: '-100%',
                translateZ: '-100%',
                scale: 2,
                scaleX: 2,
                scaleY: 2,
                scaleZ: 2,
                skewX: '100%',
                skewY: '100%'
            }
        };

        /**
         |--------------------------------------------------------------------------
         | init
         |--------------------------------------------------------------------------
         | Override default and final animus animation model
         */
        animus.init = function () {
            $.extend(model.defaults, defaults);
            $.extend(model.finals, finals);
        };

        /**
         |--------------------------------------------------------------------------
         | get
         |--------------------------------------------------------------------------
         | Process an animation string of the form "rotate 45, fade in" into
         | a usable VelocityJS animation object
         |
         | @var     string      The animation string to be modified, of the form
         |                      move x 300px, fade in, scale up
         */
        animus.get = function (string) {
            var animation = {};

            // Animation Object
            // ---------------------
            animation.state = {};
            animation.duration = model.defaults.duration;
            animation.easing = model.defaults.easing;
            animation.timeline = null;

            if (string === "" || !defined(string))
                return animation;

            string = string.split(',');
            $.each(string, function () {
                var i = 0, parameter;
                var string = $.trim(this);
                string = string.split(' ');
                string = $.grep(string, function (n) {
                    return (n !== 'to' && n.toLowerCase());
                });

                switch (string[i]) {

                    // Animation Speed
                    // ---------------------
                    // speed [800]
                    case 'duration' :
                    case 'speed' :
                    {
                        if (defined(string[1]))
                            animation.duration = parseInt(string[1]);
                    }
                        break;

                    // Animation Easing
                    // ---------------------
                    // easing [easeInOut]
                    case 'easing' :
                    {
                        if (defined(string[1]))
                            animation.easing = string[1];
                    }
                        break;

                    // Fade Animation
                    // ---------------------
                    // fade [in, out] from 0 to 0.5
                    case 'opacity' :
                    case 'fade' :
                    {
                        parameter = 'opacity';

                        while (string[++i]) {
                            switch (string[i]) {
                                case 'in' :
                                {
                                    animation.state[parameter] = 1;
                                }
                                    break;
                                case 'out' :
                                {
                                    animation.state[parameter] = 0;
                                }
                                    break;
                                default :
                                {
                                    animation.state[parameter] = string[i];
                                }
                                    break;
                            }
                        }
                    }
                        break;

                    // Rotate Animation
                    // ---------------------
                    // rotate [x,y,z] [left,right] from 180 to 0
                    case 'rotate' :
                    {
                        parameter = 'rotateZ';

                        // Get direction
                        i = 0;
                        while (string[++i]) {
                            switch (string[i]) {
                                case 'x' :
                                {
                                    parameter = 'rotateX';
                                }
                                    break;
                                case 'y' :
                                {
                                    parameter = 'rotateY';
                                }
                                    break;
                                case 'z' :
                                {
                                    parameter = 'rotateZ';
                                }
                                    break;
                            }
                        }


                        // Get parameters
                        i = 0;
                        while (string[++i]) {
                            switch (string[i]) {
                                case 'x' :
                                case 'y' :
                                case 'z' :
                                {
                                    animation.state[parameter] = model.finals.state[parameter];
                                }
                                    break;
                                default :
                                {
                                    animation.state[parameter] = string[i];
                                }
                            }
                        }
                    }
                        break;

                    // Scale Animation
                    // ---------------------
                    // scale [up,down] from 0 to 1
                    case 'scale' :
                    {
                        parameter = 'scale';

                        // Get direction
                        i = 0;
                        while (string[++i]) {
                            switch (string[i]) {
                                case 'x' :
                                {
                                    parameter = 'scaleX';
                                }
                                    break;
                                case 'y' :
                                {
                                    parameter = 'scaleY';
                                }
                                    break;
                                case 'z' :
                                {
                                    parameter = 'scaleZ';
                                }
                                    break;
                            }
                        }


                        // Get parameters
                        i = 0;
                        while (string[++i]) {
                            switch (string[i]) {
                                case 'up' :
                                {
                                    animation.state[parameter] = operation('*', 1, model.finals.state[parameter]);
                                }
                                    break;
                                case 'down' :
                                {
                                    animation.state[parameter] = operation('/', 1, model.finals.state[parameter]);
                                }
                                    break;
                                default :
                                {
                                    animation.state[parameter] = string[i];
                                }
                                    break;
                            }
                        }
                    }
                        break;

                    // Skew Animation
                    // ---------------------
                    // skew x from 0 to 1
                    case 'skew' :
                    {
                        parameter = 'skewX';

                        // Get direction
                        i = 0;
                        while (string[++i]) {
                            switch (string[i]) {
                                case 'x' :
                                {
                                    parameter = 'skewX';
                                }
                                    break;
                                case 'y' :
                                {
                                    parameter = 'skewY';
                                }
                                    break;
                            }
                        }

                        // Get parameters
                        i = 0;
                        while (string[++i]) {
                            switch (string[i]) {
                                default :
                                {
                                    animation.state[parameter] = string[i];
                                }
                                    break;
                            }
                        }
                    }
                        break;

                    // Translate Animation
                    // ---------------------
                    // translate [x,y,z] from 0 to 100
                    case 'move' :
                    case 'slide' :
                    case 'translate' :
                    {
                        parameter = 'translateX';

                        // Get direction
                        i = 0;
                        while (string[++i]) {
                            switch (string[i]) {
                                case 'left' :
                                case 'right':
                                case 'x':
                                {
                                    parameter = 'translateX';
                                }
                                    break;
                                case 'up' :
                                case 'down' :
                                case 'y' :
                                {
                                    parameter = 'translateY';
                                }
                                    break;
                                case 'z' :
                                {
                                    parameter = 'translateZ';
                                }
                                    break;
                            }
                        }

                        // Get parameters
                        i = 0;
                        while (string[++i]) {
                            switch (string[i]) {
                                case 'x' :
                                case 'y' :
                                case 'z' :
                                {
                                    animation.state[parameter] = model.finals.state[parameter];
                                }
                                    break;
                                case 'in' :
                                case 'up' :
                                case 'left' :
                                {
                                    animation.state[parameter] = model.finals.state[parameter];
                                }
                                    break;
                                case 'out' :
                                case 'down' :
                                case 'right' :
                                {
                                    animation.state[parameter] = operation('*', -1, model.finals.state[parameter]);
                                }
                                    break;
                                default :
                                {
                                    animation.state[parameter] = string[i];
                                }
                                    break;
                            }
                        }

                    }
                        break;

                    // Other Animation
                    // ---------------------
                    // animate
                    default :
                    {
                        parameter = string[0];

                        // Get parameters
                        while (string[++i]) {
                            switch (string[i]) {
                                default :
                                {
                                    animation.state[parameter] = string[i];
                                }
                                    break;
                            }
                        }
                    }
                        break;
                }

            });

            return animation;
        };



        /**
         |--------------------------------------------------------------------------
         | reset
         |--------------------------------------------------------------------------
         | Set reset state by getting all the animation variables
         | and setting them to the default values
         |
         | @var     deep    Generate reset from an array of animations if true
         |                  or from a single animation if false
         */
        animus.reset = function (deep, element, animation) {
            var reset = {};

            if (deep === true) {
                $.each(element.animation, function () {
                    $.each(this.state, function (key) {
                        if (!(key in reset) && (key in model.defaults.state)) {
                            reset[key] = model.defaults.state[key];
                        }
                    });
                });
            } else {
                $.each(element, function (key) {
                    if (!(key in reset) && (key in model.defaults.state)) {
                        reset[key] = model.defaults.state[key];
                    }
                });
            }

            return $.extend(reset, animation);
        };





        /**
         |--------------------------------------------------------------------------
         | calc
         |--------------------------------------------------------------------------
         | Basic JSON calculator
         */
        var calc = {
            '+': function (a, b) {
                return a + b;
            },
            '-': function (a, b) {
                return a - b;
            },
            '*': function (a, b) {
                return a * b;
            },
            '/': function (a, b) {
                return a / b;
            }
        };

        /**
         |--------------------------------------------------------------------------
         | operation
         |--------------------------------------------------------------------------
         | Helper function to add two variables a, b with a measurement unit suffix
         */
        var operation = function (op, x, y) {
            if (!(typeof x === 'string' || x instanceof String))
                x = x.toString();
            if (!(typeof y === 'string' || y instanceof String))
                y = y.toString();

            var exp = /(-?[0-9]*)(px|%|deg)/i;
            var matchx = x.match(exp);
            var matchy = y.match(exp);

            x = matchx != null ? parseFloat(matchx[1]) : parseFloat(x);
            y = matchy != null ? parseFloat(matchy[1]) : parseFloat(y);

            if (matchx != null && matchy != null)
                return calc[op](x, y) + matchx[2];

            if (matchx != null && matchy == null)
                return calc[op](x, y) + matchx[2];

            if (matchx == null && matchy != null)
                return calc[op](x, y) + matchy[2];

            return calc[op](x, y);
        };


        /**
         |--------------------------------------------------------------------------
         | defined
         |--------------------------------------------------------------------------
         | Helper function to check whether a variable is defined or not
         | @var     variable
         */
        var defined = function (variable) {
            return typeof variable != 'undefined';
        };

        /**
         |--------------------------------------------------------------------------
         | Initialize Animus
         |--------------------------------------------------------------------------
         */
        animus.init();

    };

})(jQuery, window, document);

