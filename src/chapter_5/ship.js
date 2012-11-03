/**
 * @class Ship
 */

(function() {

    function Ship() {
        this.x = 0;
        this.y = 0;
        this.width = 25;
        this.height = 20;
        this.rotation = 0;
        this.showFlame = false;
    }

    Ship.prototype.draw = function(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(-10, 10);
        ctx.lineTo(-5, 0);
        ctx.lineTo(-10, -10);
        ctx.lineTo(10, 0);
        ctx.stroke();

        if (this.showFlame) {

            var flame = [
                (155 + Math.random() * 100)|0, // r
                (Math.random() * 180)|0,       // g
                0                              // b
            ];

            ctx.strokeStyle = "rgb(" + flame.join(",") + ")";
            ctx.beginPath();
            ctx.moveTo(-7.5, -5);
            ctx.lineTo(-15, 0);
            ctx.lineTo(-7.5, 5);
            ctx.stroke();
        }

        ctx.restore();

    };

    window.Ship = Ship;

}());
