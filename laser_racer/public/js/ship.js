/**
 * @class Ship
 */

define(['util', 'lib/eventemitter2'], function($, EventEmitter) {

    function Ship(x, y, id) {

        this.id = id || Date.now();
        this.x = x || 0;
        this.y = y || 0;

        this.color = '#fff';

        this.thrust = 0;
        this.health = 10;
        this.total_health = 10;

        this.vr = 0;
        this.vx = 0;
        this.vy = 0;

        this.size = 15;
        this.rotation = 0;

        $.extend(this, new EventEmitter());

        this.on('collision', function(other) {

            var self = this;

            this.x += this.vx > 0 ? -5 : 5;
            this.y += this.vy > 0 ? -5 : 5;
            this.vx = -0.3;
            this.vy = -0.3;

            this.health--;

            this.color = "red";

            setTimeout(function() {
                self.color = '#fff';
            }, 200);

        });

    }

    Ship.prototype.die = function() {
        this.emit("death");
        this.world.removeUnit(this);
    };

    Ship.prototype.update = function() {

        if (this.health <= 0) return this.die();

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

        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(-10, 10);
        ctx.lineTo(-5, 0);
        ctx.lineTo(-10, -10);
        ctx.lineTo(10, 0);
        ctx.fill();

        if (this.thrust > 0) {

            var force = 5 + ( (Math.abs(this.vx) + Math.abs(this.vy) ) * 6);

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

        // Render Health
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = '#fff';
        ctx.fillRect(-15, -20, 30 * (this.health / this.total_health), 2);
        ctx.restore();

        return this;

    };

    Ship.prototype.shoot = function() {
        this.emit("shoot");
        return this;
    };

    return Ship;

});
