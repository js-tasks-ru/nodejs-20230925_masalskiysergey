const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy({ usernameField: 'email', session: false }, async function (email, password, done) {
  try {
    const user = await User.findOne({ email });

    if (user && (await user.checkPassword(password))) return done(null, user);

    if (user && !(await user.checkPassword(password))) {
      return done(null, false, 'Неверный пароль');
    }
    done(null, false, 'Нет такого пользователя');
  } catch (err) {
    done(err);
  }
});
