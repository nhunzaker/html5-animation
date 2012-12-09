/**
 * @class Obstacle
 */

define(['util', 'lib/eventemitter2'], function($, EventEmitter) {

    function Obstacle(points, color) {

        var self = this;

        color = color || "#fff";

        this.id = $.GUID();

        this.color = color;
        this.points = points || [];

        $.extend( this, new EventEmitter() );

    }

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
