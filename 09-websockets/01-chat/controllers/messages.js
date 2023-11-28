const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  const token = ctx.headers.authorization.split(' ')[1];
  const messages = [...(await Message.find({ user: ctx.user.displayName }))].map(message => mapMessage(message));

  ctx.body = { messages };
};
