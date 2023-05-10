import express from 'express';
import session from 'express-session';
import passport from 'passport';
import strategy from 'passport-local';
const LocalStrategy = strategy.Strategy;
import { findById, findByUsername, verifyPassword, users } from './db/users.js';
import { Profile } from './db/profile.js';

const verify = (login, password, done) => {
  findByUsername(login, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    if (!verifyPassword(user, password)) {
      return done(null, false);
    }

    return done(null, user);
  });
};

const options = {
  usernameField: 'user',
  passwordField: 'password',
};

passport.use('local', new LocalStrategy(options, verify));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.render('home', { user: req.user, message: app.get('message') });
  app.set('message', null);
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res) => {
    console.log('req.user: ', req.user);
    res.redirect('/');
  }
);

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', (req, res) => {
  const user = new Profile(req.body);
  if (req.body.login && req.body.password) {
    users.push(user);
    app.set('message', true);
  }
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

app.get(
  '/profile',
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/login');
    }
    next();
  },
  (req, res) => {
    res.render('profile', { user: req.user });
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
