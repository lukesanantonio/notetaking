'use strict';

(function(){

    var Point = function(x, y){
        x = x || 0;
        y = y || 0;

        return {x: x, y: y};
    }
    var Line = function(pt1, pt2){
        pt1 = pt1 || new Point();
        pt2 = pt2 || new Point();

        return {pt1: pt1, pt2: pt2};
    }

    // Adapted from: http://stackoverflow.com/a/5932203
    function toRelMouseCoords(self, coords) {
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var canvasX = 0;
        var canvasY = 0;
        var currentElement = self;

        do{
            totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
            totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        }
        while(currentElement = currentElement.offsetParent)

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

            var pt = toRelMouseCoords(self, new Point(event.pageX, event.pageY));

            newline.push(pt);
            lines.push(newline);
        };
        var addPoint = function(self) {
            var pt = toRelMouseCoords(self, new Point(event.pageX, event.pageY));
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
        $("#canvas").mouseenter(function(event) {
            inside = true;

            if(inside && down) addLine(this);
        });
        $("#canvas").mouseleave(function(event) {
            inside = false;
        });

        // Now, we just query the mouse state with our nifty variables and just
        // add our new point to the current line (The one at the back of the
        // lines array).
        $("#canvas").mousemove(function(event) {
            if(down && inside) addPoint(this);
        });

        var canvas = $("#canvas")[0];

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
        }, 60.0 / 1000.0)
    });
})()
