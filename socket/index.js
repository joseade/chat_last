const express = require('express');
const cors = require('cors');

const socketio = require('socket.io');
const http = require('http');

const app = express();

const server = http.createServer(app);
const io = socketio(server);
// const io = socketio(server, {
//   cors: {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//   },
// });
const PORT = 5000;

app.enable('trust proxy', true);
app.use(cors());
// Health check endpoint
app.get('/adelino', (req, res) => res.send('Healthy'));

server.listen(PORT, () => {
  console.log(`Server running in por ${PORT}`);
});

let users = [];

const addUser = (userId, socketId, name, profilePicture, email) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId, name, profilePicture, email });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  //when connect
  console.log('a user connected.');

  socket.on('message', (payload) => {
    switch (payload.type) {
      case 'ADD_USER': {
        addUser(
          payload.userId,
          socket.id,
          payload.name,
          payload.profilePicture,
          payload.email
        );
        io.emit('message', { type: 'GET_USERS', payload: users });
        return;
      }
      case 'SEND_FOLLOWER': {
        const { sender, receiver } = payload;
        const user = getUser(receiver.id);
        if (user === undefined) {
          return;
        }
        io.to(user.socketId).emit('message', {
          type: 'GET_FOLLOWER',
          payload: sender,
        });
        return;
      }
      case 'SEND_CONVERSATION': {
        const { receiver, conversation } = payload;
        const user = getUser(receiver);
        if (user === undefined) {
          console.log('HHHHHHHH');
          return;
        }
        io.to(user.socketId).emit('message', {
          type: 'GET_CONVERSATION',
          payload: conversation,
        });

        return;
      }

      case 'SEND_MESSAGE': {
        const { receiver, message } = payload;
        const user = getUser(receiver);
        if (user === undefined) {
          return;
        }
        io.to(user.socketId).emit('message', {
          type: 'GET_MESSAGE',
          payload: message,
        });

        return;
      }
    }
  });

  //when disconnect
  socket.on('logout', () => {
    console.log('a user disconnected!');
    removeUser(socket.id);
    io.emit('message', { type: 'GET_USERS', payload: users });
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected!');
    removeUser(socket.id);
    //io.emit("getUsers", users);
    io.emit('message', { type: 'GET_USERS', payload: users });
  });
});
