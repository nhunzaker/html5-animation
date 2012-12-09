/**
 * @name Bullet
 *
 * @desc Given a point and rotation, bullets will advance forever until they
 *       collide with another object.
 *
 * @param {Number} x         - The initial x coordinate position
 * @param {Number} y         - The initial y coordinate position
 * @param {Number} rotation  - The initial facing of the object in radians
 * @param {Number} offset    - Automatically calculates offset of initial given
 *                             point based upon rotation
 * @param {Number} vx        - Velocity x
 * @param {Number} vy        - Velocity y
 *
 * Events:
 * collision - when this object comes in conflict with another
 *
 */

define(['util'], function($) {

    function Bullet (x, y, rotation, offset, vx, vy) {

        if (!x === undefined)       throw "Please provide an x coordinate";
        if (!y === undefined)       throw "Please provide an y coordinate";
        if (rotation === undefined) throw "Please provide a radian rotational value";

        offset = offset || 0;

        this.x = x + (Math.cos(rotation) * offset);
        this.y = y + (Math.sin(rotation) * offset);

        this.thrust = 0.7;
        this.vx = vx || 0;
        this.vy = vy || 0;

        this.color = "lime";

        this.size = 10;
        this.rotation = rotation;

        $.extend(this, new $.EventEmitter());

        this.on('collision', function(other) {
            this.world.removeUnit(this);
        });

    }

    Bullet.prototype.update = function() {

        var angle = this.rotation,
            ax = Math.cos(angle) * this.thrust,
            ay = Math.sin(angle) * this.thrust;

        this.vx += ax - (this.vx * 0.05);
        this.vy += ay - (this.vy * 0.05);

        this.x += this.vx;
        this.y += this.vy;

        this.emit("update");

        return this;
    };

    Bullet.prototype.draw = function(ctx) {

        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.lineWidth = 1;
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, 20, 3);
        ctx.restore();

        return this;

    };

    return Bullet;

});
