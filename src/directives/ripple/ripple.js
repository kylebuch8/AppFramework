/**
 * Add a ripple to any element.
 * The color of the ripple is determined by the element's
 * color computed style.
 *
 * Usage:
 * <button af-ripple>Button</button>
 * or
 * <af-ripple>Somthing awesome</af-ripple>
 *
 * Attribute Options:
 * af-ripple-center="true" : Centers the ripple in the element
 * af-ripple-color="#efefef" : Sets the color of the ripple
 */

angular.module('app-framework.directives.ripple', [])
    .directive('afRipple', afRipple);

afRipple.$inject = ['$window'];

function afRipple($window) {
    var directive = {
        restrict: 'AE',
        link: link
    };

    function link(scope, element, attrs) {
        var circle,
            ripple,
            timing = 0.75;

        var svgElement = '<div style="height: 0; width: 0; position: absolute; visibility: hidden;" aria-hidden="true">' +
                              '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" focusable="false">' +
                                  '<symbol id="ripply-scott" viewBox="0 0 100 100">' +
                                      '<circle id="ripple-shape" cx="1" cy="1" r="1" />' +
                                  '</symbol>' +
                              '</svg>' +
                          '</div>';

        var rippleElement = '<svg class="ripple-obj" id="js-ripple">' +
                                '<use width="100" height="100" xlink:href="#ripply-scott" class="js-ripple"></use>' +
                            '</svg>';

        function getColor() {
            return parseColor(getElementColor());
        }

        function getElementColor() {
            return attrs.afRippleColor || $window.getComputedStyle(element[0]).color;
        }

        function parseColor (color) {
            var multiplier = 1;

            if (!color) return;
            if (color.indexOf('rgba') === 0) return color.replace(/\d?\.?\d*\s*\)\s*$/, (0.1 * multiplier).toString() + ')');
            if (color.indexOf('rgb') === 0) return rgbToRGBA(color);
            if (color.indexOf('#') === 0) return hexToRGBA(color);

            /**
            * Converts hex value to RGBA string
            * @param color {string}
            * @returns {string}
            */
            function hexToRGBA (color) {
                var hex     = color[ 0 ] === '#' ? color.substr(1) : color,
                    dig     = hex.length / 3,
                    red     = hex.substr(0, dig),
                    green   = hex.substr(dig, dig),
                    blue    = hex.substr(dig * 2),
                    opacity = (attrs.afRippleColor) ? 1 : 0.3;

                if (dig === 1) {
                    red += red;
                    green += green;
                    blue += blue;
                }

                return 'rgba(' + parseInt(red, 16) + ',' + parseInt(green, 16) + ',' + parseInt(blue, 16) + ',' + opacity + ')';
            }

            /**
            * Converts an RGB color to RGBA
            * @param color {string}
            * @returns {string}
            */
            function rgbToRGBA (color) {
                var opacity = (attrs.afRippleColor) ? 1 : 0.3;
                return color.replace(')', ', ' + opacity + ')').replace('(', 'a(');
            }

        }

        /**
         * Creates the animation for the ripple
         * @param event {event}
         * @param timing {float}
         * @returns tl {TimelineMax}
         */
        function rippleAnimation(event, timing) {
            var tl           = new TimelineMax(),
                w            = event.currentTarget.offsetWidth,
                h            = event.currentTarget.offsetHeight,
                x            = (!attrs.afRippleCenter) ? event.layerX : w / 2,
                y            = (!attrs.afRippleCenter) ? event.layerY : h / 2,
                offsetX      = Math.abs( (w / 2) - x ),
                offsetY      = Math.abs( (h / 2) - y ),
                deltaX       = (w / 2) + offsetX,
                deltaY       = (h / 2) + offsetY,
                scale_ratio  = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

            tl.fromTo(ripple, timing, {
              x: x,
              y: y,
              transformOrigin: '50% 50%',
              scale: 0,
              opacity: 1,
              ease: Linear.easeIn
            },{
              scale: scale_ratio,
              opacity: 0
            });

            return tl;
        }

        /**
         * put the element together
         */
        element.append(rippleElement).prepend(svgElement).css({
            position: 'relative'
        });

        /**
         * set the fill color of the ripple svg
         */
        element[0].querySelectorAll('.ripple-obj')[0].style.fill = getColor();

        circle = element[0].querySelector('#js-ripple');
        ripple = element[0].querySelectorAll('.js-ripple');

        /*
         * listen for some clicks
         */
        element[0].addEventListener('click', function (event) {
            rippleAnimation.call(this, event, timing);
        });
    }

    return directive;
}
