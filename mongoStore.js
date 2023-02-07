import MongoStore from 'connect-mongo';
import session from 'express-session';
import config from './config.js';


export default () => {
  return (session({
    store: MongoStore.create({
      mongoUrl: config.cnxStr,
      collectionName: 'sessions',
      ttl: 30,
      mongoOptions: config.options
    }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30000
    }
  }))
}