import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import bodyParser from 'body-parser';
import express from "express";
import path from "path";
export default function initHttpMiddleware(app) {
    app.use(cors());
    app.use(cookieParser());
    // Add content compression middleware
    app.use(compression());
    // Use the body-parser package in our application
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    // Add static middleware
    const oneDay = 86400000;
    const staticPath = path.resolve('public');
    console.log(staticPath);
    app.use('/', express.static(staticPath, { maxAge: oneDay }));
    // Setup objects needed by views
    app.use(function(req, res, next) {
        res.locals.user = req.user;
        next();
    });
}
