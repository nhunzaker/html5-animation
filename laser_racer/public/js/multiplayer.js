/**
 * @name Multiplayer
 * @desc Handles multiplayer functionality via websockets
 */

define(['bullet'], function(Bullet) {

    var Multiplayer = function(world) {

        var player;

        // Syncing
        // -------------------------------------------------- //

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

        function spawnBullet() {

            socket.emit("shoot", {
                rotation: player.rotation,
                x:  player.x,
                y:  player.y,
                vx: player.vx,
                vy: player.vy
            });

        }

        var socket = io.connect('http://' + window.location.hostname);

        socket.on('create_player', function (data) {

            player = world.addShip(545, 368 + (world.units.size() * 50), data.id);

            player.on("shoot", function(bullet) {
                syncPlayer();
                spawnBullet();
            });

            player.on("collision", syncPlayer);

            player.on("death", function() {
                alert("Oh snap, you died!");
                window.location = window.location;
            });

            syncPlayer();

        });

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

        socket.on('remove_player', function (data) {

            for ( var unit in world.units) {
                if (unit.id === data.id) world.removeUnit(unit);
            }

        });

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


        // Keyboard input
        // -------------------------------------------------- //

        window.addEventListener('keydown', function(event) {

            switch (event.keyCode) {
            case 37: player.vr = -3;       break;
            case 39: player.vr = 3;        break;
            case 38: player.thrust = 0.19; break;
            }

            syncPlayer();

        }, false);

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
