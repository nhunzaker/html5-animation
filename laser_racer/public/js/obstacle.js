/**
 * @class Obstacle
 */

define(['lib/eventemitter2'], function(EE) {

    function Obstacle(points, color) {

        var self = this;

        color = color || "#fff";

        this.color = color;
        this.points = points || [];

        this.on("collision", function() {

            self.color = "red";

            setTimeout(function() {
                self.color = color;
            }, 200);

        });
    }

    Obstacle.prototype = new EE();

    Obstacle.prototype.update = function() {};

    Obstacle.prototype.draw = function(ctx) {

        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.color;

        ctx.beginPath();
        this.points.forEach(function(point) {
            ctx.lineTo(point.x, point.y);
        });
        ctx.closePath();

        ctx.stroke();
        ctx.restore();

        return this;

    };

    return Obstacle;

});
