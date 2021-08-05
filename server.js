const app = require('express')(); // On importe le serveur web node
const http = require('http').Server(app); // On importe le module http avec en paramètre notre serveur Web Express
const io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost",
        methods: ["GET", "POST"]
    }
}); // On instancie le serveur socket, à partir du serveur http

let users = [];

io.on('connection', socket => {
    console.log(socket.handshake.query.username + ' est connecté');
    users.push(socket.handshake.query.username);
    io.emit('new_user', {
        users
    });
    socket.on('disconnect', () => {
        console.log(socket.handshake.query.username + " s'est déconnecté");

        let index = users.indexOf(socket.handshake.query.username);

        users.splice(index, 1);
        io.emit('user_leave', {
            users
        });
    });

    socket.on('chat message', data => {
        io.emit('chat message', {
            username: socket.handshake.query.username,
            message: data
        });
    })
})


http.listen(3000, () => {
    console.log('Listening on port 3000...');
})