'use strict'

define(['jquery'], function($) {
    return {
        init: function(config) {
            config = config || {}

            // Make sure we were given a selector to find the canvas to add our
            // event handlers to.
            if(typeof config.selector === 'undefined') {
                return;
            }

            // Adapted from: http://stackoverflow.com/a/5932203
            function toRelMouseCoords(self, coords) {
                var totalOffsetX = 0;
                var totalOffsetY = 0;
                var canvasX = 0;
                var canvasY = 0;
                var currentElement = self;

                do {
                    totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
                    totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
                } while(currentElement = currentElement.offsetParent);

                canvasX = coords.x - totalOffsetX;
                canvasY = coords.y - totalOffsetY;

                return {x: canvasX, y: canvasY};
            }

            $(document).ready(function() {

                var down = false;
                var inside = false;
                var lines = [];

                var addLine = function(self) {
                    var newline = []

                    var pt = toRelMouseCoords(self, {x: event.pageX, y: event.pageY});

                    newline.push(pt);
                    lines.push(newline);
                };
                var addPoint = function(self) {
                    var pt = toRelMouseCoords(self, {x: event.pageX, y: event.pageY});
                    lines[lines.length - 1].push(pt);
                };

                // We want to seamlessly handle the mouse entering and leaving the
                // canvas and handling clicking, etc.
                $(document).mousedown(function(event) {
                    down = true;

                    if(inside && down) addLine(this);
                });
                $(document).mouseup(function(event) {
                    down = false;
                });
                $(config.selector).mouseenter(function(event) {
                    inside = true;

                    if(inside && down) addLine(this);
                });
                $(config.selector).mouseleave(function(event) {
                    inside = false;
                });

                // Now, we just query the mouse state with our nifty variables and just
                // add our new point to the current line (The one at the back of the
                // lines array).
                $(config.selector).mousemove(function(event) {
                    if(down && inside) addPoint(this);
                });

                var canvas = $(config.selector)[0];

                if(canvas.getContext){
                    var ctx = canvas.getContext("2d");
                }

                setInterval(function(){
                    lines.forEach(function(line) {
                        var path = new Path2D()
                        line.forEach(function(pt) {
                            path.lineTo(pt.x, pt.y);
                        });
                        ctx.strokeStyle = "green";
                        ctx.stroke(path);
                    });
                }, 60.0 / 1000.0);
            });
        }
    };
});
