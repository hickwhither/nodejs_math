const express = require('express');
const { createServer } = require('node:http');
const { Socket } = require('socket.io');

const app = express();
const server = createServer(app);

app.get('/', (req, res) => {res.sendFile(__dirname + '/client/index.html');})
app.use('/client', express.static(__dirname + '/client'));

server.listen(3000, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Listening at http://%s:%s", host, port);
})


const io = require('socket.io')(server);
const game = new (require("./server/game.js"))(io);
io.on('connect', (socket) => {
    let id = socket.id;
    console.log(`${id} connected`);
    game.on_connect(id, socket);

    socket.on('disconnect', (socket) => {
        console.log(`${id} disconnected`)
        game.on_disconnect(id, socket);
    })

    socket.on('nextQuestion', () => game.on_nextQuestion(id));
    socket.on('submitAnswer', answer => game.on_submitAnswer(id, answer));
    socket.on('changeUsername', username => game.on_changeUsername(id, username));
})

