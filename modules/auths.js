import appModules from './appModules';
import _ from 'lodash';
//handlers.js
export const auths = _(appModules)
    .mapKeys(module => module)
    .mapValues((module) => {
        try {
            return require(`./${module}/Auth`).default;
        } catch (error) {
            // console.log(error.stack);
            console.log(`[WARNING]: Module ${module} auth middleware are not configured properly`);
            return null;
        }
    }).value();
export default auths;