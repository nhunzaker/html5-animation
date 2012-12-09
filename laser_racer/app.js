var express = require("express");

var app    = express(),
    server = require('http').createServer(app),
    io     = require("socket.io").listen(server);

app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

io.set('log level', 1);

io.sockets.on('connection', function (socket) {

    var ID = Date.now();

    socket.emit("create_player", { id: ID });
    socket.broadcast.emit("new_player", { id: ID });

    socket.on('sync_player', function(data) {
        socket.broadcast.emit("sync_player", data);
    });

    socket.on('shoot', function(data) {
        socket.broadcast.emit("shoot", data);
    });

    socket.on("disconnect", function() {
        socket.broadcast.emit("remove_player", { id: ID });
    });

});

server.listen(3000, function() {
    console.log("   info  - http listening on port 3000");
});

app.set("state", "idle");

app.get("/", function(req, res) {
    res.render("index.html");
});
