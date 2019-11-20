import appModules from './appModules';
import _ from 'lodash';
//handlers.js
export const handlers = _(appModules)
    .mapKeys(module => module)
    .mapValues((module) => {
        try {
            return require(`./${module}/Handler`).default;
        } catch (error) {
            console.log(error);
            throw `Module ${module} is turned on for use but there was no handlers defined within it at ..../modules/${module}/Handler`;
        }
    }).value();
export default handlers;