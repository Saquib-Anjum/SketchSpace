const express =require("express");
const socket = require('socket.io');

const app=express();
app.use(express.static("public"))
let port = process.env.PORT || 3000;
// let server = app.listen(port, ()=>{
//     console.log("listining to port   "+ port);
// });

//socket io
let io = socket(server);
io.on("connection", (socket) => {
    console.log("Connection completed with socket");
    socket.on("beginPath", (data) => {
      io.sockets.emit("beginPath", data);
    });
    socket.on("drawStroke", (data) => {
      io.sockets.emit("drawStroke", data);
    });

    socket.on('canvasState', (url) => {
      io.sockets.emit('canvasState', url); // Emit the canvas state to all clients
    });
  
    socket.on('undoAction', (track) => {
      io.sockets.emit('undoAction', track); // Emit the undo action to all clients
    });
  
    socket.on('redoAction', (track) => {
      io.sockets.emit('redoAction', track); // Emit the redo action to all clients
    });
  });