const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function (socket, next) {
    const query = socket.handshake.query;
    if (!query?.token) return next(new Error('anonymous sessions are not allowed'));
    const session = await Session.findOne({ token: query.token });
    if (!session) return next(new Error('wrong or expired session token'));
    socket.user = (await session.populate('user')).user;

    next();
  });

  io.on('connection', function (socket) {
    socket.on('message', async msg => {
      if (socket?.user) {
        const message = Message.create({
          date: Date.now(),
          chat: socket.user.id,
          user: socket.user.displayName,
          text: msg,
        });

        await message.save();
      }
    });
  });

  return io;
}

module.exports = socket;
