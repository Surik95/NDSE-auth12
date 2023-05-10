const users = [
  {
    id: 0,
    login: 'admin',
    password: '123',
  },
];

const findById = function (id, cb) {
  process.nextTick(function () {
    const idx = users.findIndex((item) => item.id === id);
    if (idx !== -1) {
      cb(null, users[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
};

const findByUsername = function (login, cb) {
  process.nextTick(function () {
    let i = 0,
      len = users.length;
    for (; i < len; i++) {
      const user = users[i];
      if (user.login === login) {
        return cb(null, user);
      }
    }
    return cb(null, null);
  });
};

const verifyPassword = (user, password) => {
  return user.password === password;
};

export { findById, findByUsername, verifyPassword, users };
