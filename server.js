// const result = require('dotenv').config({debug: true});
import express from 'express';
import initDb from './database';
import initHttpBasicMiddleware from './middleware/http';
import initBasicApiRoutes from './routes/api';
const app = express();
const PORT = process.env.PORT || 8797;

// import initSessionMiddleware from './middleware/session';
import framework from './modules/framework';
(async () => {

    await initDb();
    initHttpBasicMiddleware(app);
    // We use JWT for authentication, naturally we don't need session handle more
    // Only use Session Middleware if we need to support OAuth2
    // initSessionMiddleware(app);
    initBasicApiRoutes(app);
    framework.init(app);
    app.listen(PORT, () => {console.log("Server started on http://localhost:"+PORT)});

    module.exports = app;
})();
