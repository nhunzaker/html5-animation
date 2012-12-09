/**
 * @class Ship
 */

define(['lib/eventemitter2', 'bullet'], function(EE, Bullet) {

    function Bullet (x, y, rotation) {

        this.x = x || 0;
        this.y = y || 0;

        this.thrust = 0.7;
        this.vr = 0;
        this.vx = 0;
        this.vy = 0;

        this.color = "lime";

        this.size = 10;
        this.rotation = rotation;

        this.on('collision', function(other) {
            this.world.removeUnit(this);
        });

    }

    Bullet.prototype = new EE();

    Bullet.prototype.update = function() {

        this.rotation += this.vr * Math.PI / 180;

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
