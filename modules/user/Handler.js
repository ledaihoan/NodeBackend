import { API_METHODS } from './Router';
import User from '../../models/user';
const errHandler = async(res, e) => {
    return await res.status(503).json({success: false, err: true, message: `Oops! There was an error while processing your request`, errMessage: e.message});
};
const dataHandler = async(res, data) => {
    return await res.json({success: true, message: data && data.message ? data.message: '', data: data});
};
const rmUser = async (req, res, next) => {
    const deleteId = req.params.id;
    if (deleteId) {
        const user = await User.findOne({_id: deleteId}).exec();
        if(user) {
            user.status = 0;
            await user.save();
            return res.json({success: true, message: 'User was suspend'});
        } else {
            return res.status(403).json({success: false, message: `No user exists with id = ${deleteId}`});
        }
    } else {
        return res.status(403).json({success: false, message: 'Invalid request'});
    }
};
export const handler = {
    [API_METHODS.GET_ALL_USERS]: async (req, res) => {
        try {
            const users = await User.find().exec();
            users.forEach(user => delete user.password);
            return await dataHandler(res, users);
        } catch(e) {
            return await errHandler(res, e);
        }

    },
    [API_METHODS.GET_ALL_USERS_IN_CONTEXT]: async (req, res) => {
        try {
            const users = await User.find( { contexts: req.params.context_id }).exec();
            users.forEach(user => delete user.password);
            return await dataHandler(res, users);
        } catch(e) {
            return await errHandler(res, e);
        }

    },
    [API_METHODS.POST_USER]: async (req, res) => {
        try {
            const existingUser = await User.findOne({$or: [{email: req.body.email}, {nickname: req.body.nickname}, {phone: req.body.phone}]}).exec();
            if(existingUser == null) {
                const user = new User({
                    email: req.body.email,
                    phone: req.body.email,
                    fullname: req.body.fullname,
                    nickname: req.body.nickname,
                    password: req.body.password,
                    // avatar: {type: Schema.Types.ObjectId, ref: 'Attachment'},
                    identify: req.body.identify,
                    joined_date: req.body.joined_date || new Date(),
                    quit_date: req.body.quit_date,
                    jobs: req.body.jobs || [],
                    total_rate: 0,
                    count_rate: 0,
                    status: req.body.status || 2
                });
                const insertUser = await user.save();
                return await dataHandler(res, {message: 'Added user successfully', uid: insertUser._id});
            } else {
                const dup = existingUser.email === req.body.email ? 'Email' : existingUser.phone === req.body.phone ? 'Phone' : 'Nickname';
                return await res.json({success: false, message: `${dup} you entered already in use`, exists: dup});
            }
        } catch(e) {
            return await errHandler(res, e);
        }

    },
    [API_METHODS.GET_USER]:  async (req, res, next) => {
        try {
            const user = await User.findOne({_id: req.params.id}).exec();
            delete user.password;
            return await dataHandler(res, user);
        } catch(e) {
            return await errHandler(res, e);
        }

    },
    [API_METHODS.GET_PROFILE]:  async (req, res, next) => {
        try {
            console.log(req.user);
            const user = await User.findOne({_id: req.user._id}).exec();
            delete user.password;
            return await dataHandler(res, user);
        } catch(e) {
            return await errHandler(res, e);
        }

    },
    [API_METHODS.DELETE_USER]: rmUser,
    [API_METHODS.UPDATE_USER]:  async (req, res, next) => {
        const updateId = req.params.id;
        if (updateId) {
            return await res.json({success: true, message: 'Updated'});
        } else {
            return await res.status(403).json({message: 'Your request data is invalid'});
        }
    },
    [API_METHODS.ADD_USER_JOB]:  async (req, res, next) => {
        const updateId = req.params.id;
        if (updateId) {
            const user = await User.findOne({_id: updateId}).exec();
            user.jobs.push(req.body.job);
            return await res.json({success: true, message: `Added user job ${req.body.job}`});
        } else {
            return await res.status(403).json({message: 'Your request data is invalid'});
        }
    },
};

export default handler;