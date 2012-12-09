/**
 * @name Multiplayer
 * @desc Handles multiplayer functionality via websockets
 */

define(['bullet'], function(Bullet) {

    var Multiplayer = function(world) {

        var socket = io.connect('http://' + window.location.hostname);
        var player = world.addShip(545, 368);

        // On shot, sync player information and send out a
        // request for a bullet
        player.on("shoot", function(bullet) {
            syncPlayer();
            spawnBullet();
        });

        // Players take damage on collisions, when this happens
        // we need to sync the change to all clients
        player.on("collision", syncPlayer);

        // On death, restart (the collision event will sync info)
        player.on("death", function() {
            alert("Oh snap, you died! Restarting...");
            window.location = window.location;
        });


        // Syncing
        // -------------------------------------------------- //

        // Get all player information and request syncing
        function syncPlayer() {

            socket.emit("sync_player", {
                id: player.id,
                vr: player.vr,
                thrust: player.thrust,
                rotation: player.rotation,
                x: player.x,
                y: player.y,
                health: player.health
            });

        }

        // Send a request to spawn a bullet at the current
        // position, rotation, and velocity of the player
        function spawnBullet() {

            socket.emit("shoot", {
                rotation: player.rotation,
                x:  player.x,
                y:  player.y,
                vx: player.vx,
                vy: player.vy
            });

        }


        // Socket Events
        // -------------------------------------------------- //

        // Syncs player data based upon their GUID
        socket.on("sync_player", function(data) {

            var ship = world.units.get(data.id);

            if (!ship) ship = world.addShip(0, 0, data.id);

            ship.health = data.health;
            ship.rotation = data.rotation;
            ship.x = data.x;
            ship.y = data.y;
            ship.vr = data.vr;
            ship.thrust = data.thrust;

        });

        // Creates bullets
        socket.on("shoot", function(d) {

            var bullet = new Bullet(
                d.x,
                d.y,
                d.rotation,
                35,
                d.vx,
                d.vy);

            bullet.id = d.id;
            bullet.world = player.world;
            player.world.units.put(bullet.id, bullet);
        });

        // Start an initial sync so players see user right as they
        // sign on
        syncPlayer();


        // Keyboard input
        // -------------------------------------------------- //

        // Keydown events handle standard movement, left/right change
        // rotation, up adds thrust.
        window.addEventListener('keydown', function(event) {

            switch (event.keyCode) {
            case 37: player.vr = -3;       break;
            case 39: player.vr = 3;        break;
            case 38: player.thrust = 0.19; break;
            }

            syncPlayer();

        }, false);

        // Note: shoot is a keyup event so we don't have millions of
        // bullets passing through the server. This could probably
        // be optimized with a debounce method.
        window.addEventListener('keyup', function(event) {

            switch (event.keyCode) {
            case 37:
            case 39: player.vr = 0;     break;
            case 38: player.thrust = 0; break;
            case 32: player.shoot();    break;
            }

            syncPlayer();

        }, false);

    };

    return Multiplayer;

});
