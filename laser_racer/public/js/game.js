define([
    "world",
    "map",
    "multiplayer",
    "lib/poly_animation"
], function(World, map, Multiplayer) {

    var canvas = document.querySelector("#scene"),
        world  = new World(canvas);

    var player;

    map.forEach(function(coords) {
        world.addObstacle(coords);
    });

    world.play();

    Multiplayer(world);

});
