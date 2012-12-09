/**
 * @class World
 */

define([
    'util',
    'obstacle',
    'ship'
], function($, Obstacle, Ship) {

    function World (canvas) {

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.width = canvas.width;
        this.height = canvas.height;

        this.units = new $.Hashtable();
        this.obstacles = [];
    }

    World.prototype.addObstacle = function(points) {
        this.obstacles.push(new Obstacle(points));
    };

    World.prototype.addShip = function(x, y, id) {

        if (!id) throw "Ship must have id";

        var ship = new Ship(x, y, id);

        ship.world = this;

        this.units.put(ship.id, ship);

        return ship;
    };

    World.prototype.checkCollisions = function(target) {

        var me = null;

        this.units.each(function(id, unit) {

            if (unit === target) return;

            var distance = $.distance(target, unit);

            if (distance < (unit.size + target.size)) {
                target.emit("collision", unit);
                unit.emit("collision", target);
            }

        });

        this.obstacles.forEach(function(me) {

            var blocked = $.isWithinRegion(me.points, target.x, target.y);

            if (blocked) {
                target.emit("collision", me);
                me.emit("collision", target);
            }

        });

    };

    World.prototype.removeUnit = function(obj) {
        this.units.remove(obj.id);
    };

    World.prototype.update = function() {

        var self = this;

        this.units.each(function(id, unit) {
            unit.update();
            self.checkCollisions(unit);
        });

        this.obstacles.forEach(function(me) {
            me.update();
        });

    };

    World.prototype.draw = function(ctx) {

        ctx = ctx || this.ctx;

        this.units.each(function(id, unit) {
            unit.draw(ctx);
        });

        this.obstacles.forEach(function(me) {
            me.draw(ctx);
        });

    };

    World.prototype.play = function() {
        requestAnimationFrame(this.play.bind(this));
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.update();
        this.draw();
    };

    return World;

});
