define([
    "world", "map", "multiplayer", "lib/poly_animation"
], function(World, map, Multiplayer) {

    var canvas = document.querySelector("#scene"),
        world  = new World(canvas);

    // Add obstacles
    // -------------------------------------------------- //

    map.forEach(function(coords) {
        world.addObstacle(coords);
    });


    // Start multiplayer
    // -------------------------------------------------- //

    Multiplayer(world);


    // Intiate game
    // -------------------------------------------------- //

    var Game = window.Game = window.Game || {};

    Game.pause = function() {
        window.cancelAnimationFrame(Game.core.animationFrame);
    };

    Game.play = function() {
        Game.core.then = Date.now();
        Game.core.frame();
    };


    Game.core = {

        frame: function() {
            Game.core.setDelta();
            Game.core.update();
            Game.core.render();
            Game.core.animationFrame = window.requestAnimationFrame(Game.core.frame);
        },

        setDelta: function() {
            Game.core.now = Date.now();
            Game.core.delta = 1 - (Game.core.now - Game.core.then) / 1000;
            Game.core.then = Game.core.now;
        },

        update: function() {
            world.update(Game.core.delta);
        },

        render: function() {
            world.render();
        }

    };

    Game.play();

});
