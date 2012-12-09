/**
 * @name Util
 */

define(function() {

    return {

        distance: function (point1, point2) {

            var xs = 0,
                ys = 0;

            xs = point2.x - point1.x;
            xs *= xs;
            ys = point2.y - point1.y;
            ys *= ys;

            return Math.sqrt( xs + ys );

        },

        /**
         * @param {Number} nvert of vertices in the polygon. Whether to repeat
         * the first vertex at the end is discussed below.
         * @param {Array} vertx - X-coordinates of the polygon's vertices.
         * @param {Array} verty - Y-coordinates of the polygon's vertices.
         * @param {Number} testx - X-coordinate of the test point.
         * @param {Number} texty - Y-coordinate of the test point.
         */

        isWithinRegion: function pnpoly( region, testx, testy ) {

            var nvert = region.length,
                vertx = [],
                verty = [];

            region.forEach(function(point) {
                vertx.push(point.x);
                verty.push(point.y);
            });

            var i, j, c = false;
            for( i = 0, j = nvert-1; i < nvert; j = i++ ) {
                if( ( ( verty[i] > testy ) != ( verty[j] > testy ) ) &&
                    ( testx < ( vertx[j] - vertx[i] ) * ( testy - verty[i] ) / ( verty[j] - verty[i] ) + vertx[i] ) ) {
                        c = !c;
                    }
            }

            return c;
        }

    };

});
