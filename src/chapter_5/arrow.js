/**
 * @class Arrow
 */

(function(window) {

    function Arrow () {
        this.x = 0;
        this.y = 0;
        this.color = "#ffff00";
        this.rotation = 0;
    }

    Arrow.prototype.draw = function (ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.lineWidth = 2;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(-50, -25);
        ctx.lineTo(0, -25);
        ctx.lineTo(0, -50);
        ctx.lineTo(50, 0);
        ctx.lineTo(0, 50);
        ctx.lineTo(0, 25);
        ctx.lineTo(-50, 25);
        ctx.lineTo(-50, -25);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    };

    window.Arrow = Arrow;

}(window));
