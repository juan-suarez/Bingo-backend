import { Server } from 'socket.io';

export const handleWebSocket = (server) => {
  let users = {}
  const io = new Server(server, {
    connectionStateRecovery: {},
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
    },
  });
  io.on('connection', async (socket) => {
    const userName = socket.handshake.auth.username || 'guest';
    const userRole = socket.handshake.auth.role || 'user';
    users[socket.id] = {userName, userRole}

    io.emit('connected-users', users);

    socket.on('bingo', async (message) => {
      //make bingo winner logic 
      console.log("BINGO")
    });

    socket.on('table-generator', async (message) => {
      //make table generator logic
      console.log("table generated")
    });

    socket.on('start-game', async (message) => {
      //make init game logic
      console.log('game started')
    });

    socket.on('disconnect', () => {
      delete users[socket.id];
      io.emit('connected-users',users);
      console.log('user disconnected');
    });
  });
};
