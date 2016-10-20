const { User } = require('../models/user');

const authenticate = (req, res, next) => {
  const token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      res.sendStatus(401);
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.sendStatus(401);
  });
};

module.exports = { authenticate };
