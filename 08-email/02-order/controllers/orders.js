const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const Session = require('../models/Session');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  const token = ctx.get('Authorization').split(' ')[1];
  const session = await Session.findOne({ token });
  if (!session) ctx.throw(401, 'Пользователь не найден');

  const userId = session.user.toString();

  const order = new Order({ user: userId, ...ctx.request.body });
  await order.save();

  ctx.body = { order: order.id.toString() };

  const user = (await session.populate('user')).user;

  const product = (await order.populate('product')).product;

  await sendMail({
    to: user.email,
    template: 'order-confirmation',
    subject: 'Подтверждение заказа',
    locals: {
      id: user.id.toString(),
      product,
    },
  });
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const token = ctx.get('Authorization').split(' ')[1];
  const session = await Session.findOne({ token });
  if (!session) ctx.throw(401, 'Пользователь не найден');
  const userId = session.user.toString();
  const orders = [...(await Order.find({ user: userId }).populate('product'))].map(order => mapOrder(order));
  ctx.body = { orders };
};
