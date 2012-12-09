/**
 * @class Ship
 */

define(['lib/eventemitter2'], function(EE) {

    function Ship(x, y) {

        this.x = x || 0;
        this.y = y || 0;

        this.thrust = 0;

        this.vr = 0;
        this.vx = 0;
        this.vy = 0;

        this.size = 15;
        this.rotation = 0;


        this.on('collision', function(other) {
            this.x += this.vx > 0 ? -5 : 5;
            this.y += this.vy > 0 ? -5 : 5;
            this.vx *= -0.3;
            this.vy *= -0.3;

            this.draw_collision = true;
        });

    }

    Ship.prototype = new EE();

    Ship.prototype.update = function() {

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

    Ship.prototype.draw = function(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.lineWidth = 1;

        ctx.fillStyle = this.draw_collision? "red" : "#fff";
        this.draw_collision = false;

        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(-10, 10);
        ctx.lineTo(-5, 0);
        ctx.lineTo(-10, -10);
        ctx.lineTo(10, 0);
        ctx.fill();

        if (this.thrust > 0) {

            var force = (Math.abs(this.vx + this.vy) * 6) + 5;

            var flame = "rgb(" + [
                (155 + Math.random() * 100)|0, // r
                (Math.random() * 180)|0,       // g
                0                              // b
            ].join(",") + ")";

            ctx.fillStyle = flame;
            ctx.beginPath();
            ctx.moveTo(-7.5, -5);
            ctx.lineTo(-force, 0);
            ctx.lineTo(-7.5, 5);
            ctx.fill();

            var rings = (force / 4) | 0;
            for (var i = 0; i < rings; i++) {
                ctx.save();
                ctx.scale(0.5, 1);
                ctx.lineWidth = 2;
                ctx.strokeStyle = flame;
                ctx.globalAlpha = 1 - (i * 0.10);
                ctx.beginPath();
                ctx.arc(-i * 15, 0, i * 2.5, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }
        }

        ctx.restore();

        return this;

    };

    return Ship;

});
