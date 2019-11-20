import appModules from './appModules';
import _ from 'lodash';
// schemas.js
export const schemas = _(appModules)
    .mapKeys(module => module)
    .mapValues((module) => {
        try {
            return require(`./${module}/Validator`).default;
        } catch (error) {
            // console.log(error);
            console.log(`[WARNING]: Module ${module} 's schema names are not configured properly`);
            return null;
        }
    }).value();
export default schemas;