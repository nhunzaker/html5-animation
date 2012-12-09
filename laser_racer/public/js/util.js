/**
 * @name Util
 */

define(['lib/hashtable', 'lib/eventemitter2'], function(hash, ee) {

    var slice = Array.prototype.slice;

    var util = {

        Hashtable: hash,

        EventEmitter: ee,

        GUID: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },

        each: function(obj, iterator, context) {

            if (obj == null) return;

            if (obj.length === +obj.length) {
                for (var i = 0, l = obj.length; i < l; i++) {
                    if (iterator.call(context, obj[i], i, obj) === {}) return;
                }
            } else {
                for (var key in obj) {
                    if (_.has(obj, key)) {
                        if (iterator.call(context, obj[key], key, obj) === {}) return;
                    }
                }
            }
        },

        extend: function(obj) {

            util.each(slice.call(arguments, 1), function(source) {

                if (source) {
                    for (var prop in source) {
                        obj[prop] = source[prop];
                    }
                }

            });

            return obj;
        },

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
         * @param {Array} region - A list of coordinates
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

    return util;

});
