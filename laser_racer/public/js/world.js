/**
 * @class World
 */

define(['util', 'obstacle', 'ship'], function($, Obstacle, Ship) {

    function World (canvas) {

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.width = canvas.width;
        this.height = canvas.height;

        this.units = new Set();
        this.obstacles = [];
    }

    World.prototype.addObstacle = function(points) {
        this.obstacles.push(new Obstacle(points));
    };

    World.prototype.addShip = function(x, y, id) {

        var ship = new Ship(x, y, id);

        ship.world = this;

        this.units.add(ship);

        return ship;
    };

    World.prototype.checkCollisions = function(target) {

        var me = null;

        for (var unit of this.units) {

            if (unit === target) continue;

            var distance = $.distance(target, unit);

            if (distance < (unit.size + target.size)) {
                target.emit("collision", unit);
            }

        }

        this.obstacles.forEach(function(me) {

            var blocked = $.isWithinRegion(me.points, target.x, target.y);

            if (blocked) {
                target.emit("collision", me);
                me.emit("collision", target);
            }

        });

    };

    World.prototype.findById = function(id) {

        for (var unit of this.units) {
            if (unit.id === id) return unit;
        }

        return null;
    };

    World.prototype.removeUnit = function(obj) {
        this.units.delete(obj);
    };

    World.prototype.update = function() {

        var self = this;

        for (var unit of this.units) {
            unit.update();
            this.checkCollisions(unit);
        }

        this.obstacles.forEach(function(me) {
            me.update();
        });

    };

    World.prototype.draw = function(ctx) {

        ctx = ctx || this.ctx;

        for (var unit of this.units) unit.draw(ctx);

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
