import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy } from 'passport-local';
const localStrategy = Strategy;
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


app.get('/', (req, res) => {
  if (session.user) {
    res.redirect('/home')
  } else {
    res.redirect('/login')
  }
})

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html')
})

app.post('/login', async (req, res) => {

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

app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/public/main.html')
})








const server = app.listen(8080, () => console.log('Server ready on 8080'));
server.on('error', (e) => console.log('Error en servidor: ', e));