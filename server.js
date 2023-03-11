import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import mongoSession from './mongoStore.js';

import path from 'path'
import { fileURLToPath } from 'url';
import MongoUsers from './mongoUsers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const users = new MongoUsers();

const app = express();
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(mongoSession());


app.use(passport.initialize())
app.use(passport.session())


passport.use('local', new localStrategy(async (username, password, done) => {
  console.log('user: ', user)
  const user = await users.findUser(username);
  if (!user) {
    return done(null, false);
  } else {
    const passOk = await bcrypt.compare(password, user.password);
    if (!passOk) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  }
}))

passport.serializeUser((user, done) => {
  done(null, user.username);
})

passport.deserializeUser(async (username, done) => {
  const user = await users.findUser(username);
  done(null, user);
})

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}


app.get('/', (req, res) => {
  console.log('session.user: ', session.user)
  if (session.user) {
    res.redirect('/home')
  } else {
    res.redirect('/login')
  }
})

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html')
})

app.post('/login', passport.authenticate('local', {
  failureRedirect: '/login-error',
  successRedirect: '/home'
}),
  (req, res) => {
    console.log('post login')
    res.cookie('user', req.session.passport.user);
  })

app.get('/login-error', (req, res) => {
  res.sendFile(__dirname + '/public/login-error.html');
})

app.get('/home', isAuth, (req, res) => {
  res.sendFile(__dirname + '/public/main.html')
})

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/register.html')
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const result = await users.createUser(username, password);
  if (result) {
    res.redirect('/home')
  } else {
    res.sendFile(__dirname + '/public/register-error.html');
  }
})


app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.json({ status: 'error', body: err });
    }
  })
  res.redirect('/login');
})







const server = app.listen(8080, () => console.log('Server ready on 8080'));
server.on('error', (e) => console.log('Error en servidor: ', e));