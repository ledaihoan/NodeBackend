import { API_METHODS } from './Router';
import Context from '../../models/context';
const errHandler = async(res, e) => {
    return await res.status(503).json({success: false, err: true, message: `Oops! There was an error while processing your request`, errMessage: e.message});
};
const dataHandler = async(res, data) => {
    return await res.json({success: true, message: data && data.message ? data.message: '', data: data});
};
export const handler = {
    [API_METHODS.GET_ALL_CONTEXTS]: async (req, res) => {
        try {
            const contexts = await Context.find().exec();
            return await dataHandler(res, contexts);
        } catch(e) {
            return await errHandler(res, e);
        }

    },
    [API_METHODS.GET_ALL_CONTEXTS_IN_CONTEXT]: async (req, res) => {
        try {
            const contexts = await Context.find( { parents: req.params.context_id }).exec();
            return await dataHandler(res, contexts);
        } catch(e) {
            return await errHandler(res, e);
        }

    },
    [API_METHODS.POST_CONTEXT]: async (req, res) => {
        const context = new Context(req.body);
        try {
            const insertContext = await context.save();
            return await dataHandler(res, {message: 'Added Context successfully', uid: insertContext._id});
        } catch(e) {
            return await errHandler(res, e);
        }

    },
    [API_METHODS.GET_CONTEXT]:  async (req, res, next) => {
        try {
            const context = await Context.find({_id: req.params.id}).exec();
            return await dataHandler(res, context);
        } catch(e) {
            return await errHandler(res, e);
        }

    },
    [API_METHODS.DELETE_CONTEXT]: async (req, res, next) => {
        const deleteId = req.params.id;
        if (deleteId) {
            const context = await Context.find({_id: req.user._id}).exec();
            if(context) {
                context.status = 0;
                await context.save();
                return res.json({success: true, message: 'User was suspend'});
            } else {
                return res.status(403).json({success: false, message: `No user exists with id = ${deleteId}`});
            }
        } else {
            return res.status(403).json({success: false, message: 'Invalid request'});
        }
    },
    [API_METHODS.UPDATE_CONTEXT]:  async (req, res, next) => {
        const updateId = req.params.id;
        if (updateId) {
            return await res.json({success: true, message: 'Updated'});
        } else {
            return await res.status(403).json({message: 'Your request data is invalid'});
        }
    }
};

export default handler;