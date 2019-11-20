import express from 'express';
import Joi from 'joi';
import _ from 'lodash';
import modules from './appModules';
import validators from './validators';
import handlers from './handlers';
import routers from './routers';
import auths from './auths';
import AuthMiddleWare from "../middleware/auth";
const createRouter = () => (routingContext) => {
    const router = express.Router();
};
const validatorMiddleware = (validator) => (req, res, next) => {
    if (_.isNull(validator)) {
        console.log('The validator is null');
        next();
    } else {
        const result = Joi.validate(req.body, validator);
        console.log('Req Body: ', req.body);
        result.error === null ? next() : res.status(422).json({ errors: result.error});
        console.log(result.error);
    }
};
const getRouterPath = (moduleName) => `/${moduleName}`;
const defaultHandler = (req, res) => {
    res.status(404).json({ errors: ' Not Implemented'});
};
const connectRouters = (app) => {
    console.log('connecting Routers', JSON.stringify(routers));
    _.forEach(modules, (moduleName) => {
        const router = express.Router();
        router.use(AuthMiddleWare.isAuth);
        const moduleValidator = validators[moduleName] || [];
        const moduleHandler = handlers[moduleName] || [];
        const moduleAuth = auths[moduleName] || [];
        console.log(JSON.stringify(handlers));
        _.forEach(routers[moduleName], (api, apiKey ) => {
            const { path, method } = api;
            const authArr = moduleAuth[apiKey] || [];
            const schema = _.isNil(moduleValidator[apiKey]) ? null : moduleValidator[apiKey];
            const handler = _.isNil(moduleHandler[apiKey]) ? defaultHandler : moduleHandler[apiKey];
            const middleware = schema != null ? authArr.concat(validatorMiddleware(schema)) : authArr;
            // connection
            if(middleware.length > 0) {
                router[_.lowerCase(method)](path, middleware, handler);
            } else {
                router[_.lowerCase(method)](path, handler);
            }

        });
        app.use(getRouterPath(moduleName), router);
    });
};
export default {
    _,
    createRouter,
    express,
    validatorMiddleware,
    init: connectRouters,
}