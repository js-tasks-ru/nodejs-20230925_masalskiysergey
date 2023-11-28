const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) return done(null, false, 'Не указан email');

  const user = await User.findOne({ email });

  if (user) return done(null, user);

  try {
    const newUser = new User({ email, displayName });
    await newUser.save();
    return done(null, newUser);
  } catch (err) {
    return done(err);
  }

  done(null, false, `функция аутентификации с помощью ${strategy} не настроена`);
};
