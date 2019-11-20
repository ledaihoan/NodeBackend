import mongoose from 'mongoose';
import passport from 'passport';

import session from 'express-session';
import ConnectMongo from 'connect-mongo';
const MongoStore = ConnectMongo(session);
const aWeek = 604800;
export default function initSessionMiddleware(app) {
    // Use express session support since OAuth2orize requires it
    app.use(session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: true,
        cookie: { httpOnly: true,maxAge: aWeek},
        // rolling: true,
        resave: false,
        store: new MongoStore({mongooseConnection: mongoose.connection.useDb(process.env.SESSION_DB),ttl: aWeek })
    }));

    // Use the passport package in our application
    app.use(passport.initialize());
    app.use(passport.session());
}
