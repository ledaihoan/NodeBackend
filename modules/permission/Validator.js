import Joi from 'joi';

const postUser = Joi.object().keys({
    user: Joi.string().alphanum().min(3).max(30).required(),
    timestamp: Joi.number(),
});

const schema = {
};

export default schema;