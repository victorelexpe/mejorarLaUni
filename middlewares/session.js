import session from 'express-session';
import connectMongo from 'connect-mongo';

const MongoStore = connectMongo(session);

export default function sessionMiddleware(req, res, next) {
  const mongoStore = new MongoStore({
    client: req.dbClient,
    stringify: false,
  });
  return session({
    secret: "letspingit",
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
  })(req, res, next);
}
