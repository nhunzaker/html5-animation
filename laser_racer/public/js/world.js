/**
 * @name World
 * @desc The world object contains all units and obstacles and handles updating
 *       the map. It also calculates collisions.
 *
 * @param {Canvas} canvas - The target canvas element for the scene.
 */

define([
    'util', 'obstacle', 'ship'
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

    World.prototype.update = function(delta) {
        console.log(delta);
        var self = this;

        this.units.each(function(id, unit) {
            unit.update(delta);
            self.checkCollisions(unit);
        });

        this.obstacles.forEach(function(me) {
            me.update(delta);
        });

    };
    
    World.prototype.render = function(ctx) {

        ctx = ctx || this.ctx;

        this.ctx.clearRect(0, 0, this.width, this.height);

        this.units.each(function(id, unit) {
            unit.draw(ctx);
        });

        this.obstacles.forEach(function(me) {
            me.draw(ctx);
        });

    };

    return World;

});
