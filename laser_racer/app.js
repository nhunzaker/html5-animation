var express = require("express");

var app    = express(),
    server = require('http').createServer(app),
    io     = require("socket.io").listen(server);

app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

function getGUID() {

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });

}

io.sockets.on('connection', function (socket) {

    // Keeps information about a player in sync across all clients
    socket.on('sync_player', function(data) {
        socket.broadcast.emit("sync_player", data);
    });

    // Generates bullets
    socket.on('shoot', function(data) {
        data.id = getGUID();
        socket.emit("shoot", data);
        socket.broadcast.emit("shoot", data);
    });

});

server.listen(3000, function() {
    console.log("   info  - http listening on port 3000");
});

app.get("/", function(req, res) {
    res.render("index.html");
});
