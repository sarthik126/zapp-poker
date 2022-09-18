const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const { v4:uuid } = require('uuid')

// const PORT = process.env.PORT || 5500
const PORT = 5500;

app.use(cors());
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const rooms = {};

app.get("/", (req, res) => {
  res.send("Server running...");
});

app.get('/get-room-id',(req,res)=>{
  let roomId = uuid()
  rooms[roomId] = []
  res.json({roomId:roomId})
})

io.on("connection", (socket) => {
  let roomId = socket.handshake.query.roomId;
  let userName = socket.handshake.query.userName;
  let socketId = socket.id;

  console.log(`${userName} with socket id ${socketId} connected to room : ${roomId}`);
  socket.join(roomId);
  if(!rooms[roomId]) {
    rooms[roomId] = []
  }
  rooms[roomId].push({socketId:socketId,userName:userName,index:null})

  socket.to(roomId).emit("new-user", {socketId:socketId,userName:userName,index:null});
  io.to(roomId).emit("all-data",{room:rooms[roomId]})

  socket.on("disconnect", () => {
    console.log(`user disconnected --> ${socket.id}`);
    let [roomDisconneted,userDisconnected] = deletePlayer(socket.id);
    if(roomDisconneted !== null) {
      io.to(roomDisconneted).emit("remove-user", {userName:userDisconnected,socketId:socket.id,index:null});
      io.to(roomDisconneted).emit("all-data",{room:rooms[roomId]})
    }
  });

  socket.on("vote", (data) => {
    setData(data.roomId,data.socketId,data.index)
    io.to(data.roomId).emit("all-data",{room:rooms[roomId]})
  });

  socket.on("reset", (data) => {
    socket.to(data.roomId).emit("reset");
    resetData(data.roomId)
    io.to(data.roomId).emit("all-data",{room:rooms[roomId]})
    console.log("RESET")
  });

});

app.get("/rooms", (req, res) => {
  res.json(rooms);
});

app.get("/rooms/:roomId", (req, res) => {
  let roomId = req.params.roomId
  if(rooms[roomId]){
    res.json(rooms[roomId]);
  }
  res.json([])
});

server.listen(PORT, () => {
  console.log(`Server listening on port : ${PORT}`);
});

function deletePlayer(socketId) {
  let tempRoom = null
  let tempName = null
  
  for (let room in rooms) {
    for (let index in rooms[room]) {
      //   console.log(user)
      if (rooms[room][index].socketId === socketId) {
        // console.log(user)
        tempName = rooms[room][index].userName;
        tempRoom = room;
        rooms[room].splice(index, 1)
      }
    }
  }

  // console.log(rooms[tempRoom])

  if (rooms[tempRoom].length === 0) {
    delete rooms[tempRoom];
    return [null,null]
  }
  
  return [tempRoom, tempName]
}

function setData(roomId,socketId,index) {
  for (let i in rooms[roomId]) {
    if (rooms[roomId][i].socketId === socketId) {
      // console.log(user)
      rooms[roomId][i].index = index
    }
  }
}

function resetData(roomId) {
  for (let i in rooms[roomId]) {
    rooms[roomId][i].index = null;
  }
}
