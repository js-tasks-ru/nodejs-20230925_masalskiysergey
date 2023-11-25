const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const verificationToken = uuid();
  const { displayName, email, password } = ctx.request.body;

  const user = await User.findOne({ email });

  if (user) {
    ctx.status = 400;
    ctx.body = {
      errors: {
        email: 'Такой email уже существует',
      },
    };
    return;
  }

  try {
    const newUser = new User({ email, password, displayName, verificationToken });
    await newUser.setPassword(password);
    await newUser.save();
    await sendMail({ locals: { token: verificationToken }, template: 'confirmation', to: email, subject: 'Подтвердите почту' });

    ctx.status = 200;
    ctx.body = { status: 'ok' };
  } catch (err) {
    ctx.throw(400, 'Невалидный email');
  }
};

module.exports.confirm = async (ctx, next) => {
  const { verificationToken } = ctx.request.body;

  const user = await User.findOne({ verificationToken });
  if (user) {
    user.verificationToken = undefined;
    await user.save();
    ctx.body = { token: verificationToken };
    return;
  }

  ctx.body = { error: 'Ссылка подтверждения недействительна или устарела' };
  ctx.status = 400;
};
