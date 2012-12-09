/**
 * @name Obstacle
 * @desc A standard boundary object. Given a collection of points,
 *       it will generate a blocking object.
 *
 * @param {Array} points - A list of {x,y} values that describe the shape.
 * @param {String} color - An optional value to change the color of the outline.
 */

define(['util'], function($) {

    function Obstacle(points, color) {

        var self = this;

        color = color || "#fff";

        this.id = $.getGUID();

        this.color = color;
        this.points = points || [];

        $.extend( this, new $.EventEmitter() );

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
