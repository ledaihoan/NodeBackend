import { API_METHODS } from './Router';
import Permission from '../../models/permission';
import User from "../../models/user";
const errHandler = async(res, e) => {
    return await res.status(503).json({success: false, err: true, message: `Oops! There was an error while processing your request`, errMessage: e.message});
};
const dataHandler = async(res, data) => {
    return await res.json({success: true, message: data && data.message ? data.message: '', data: data});
};
export const handler = {
    [API_METHODS.GET_ALL_PERMISSIONS]: async (req, res) => {
        try {
            const permissions = await Permission.find().exec();
            return await dataHandler(res, permissions);
        } catch(e) {
            return await errHandler(res, e);
        }

    },
    [API_METHODS.POST_PERMISSION]: async (req, res) => {
        const permission = new Permission(req.body);
        try {
            const insertPermission = await permission.save();
            return await dataHandler(res, {message: 'Added Permission successfully', uid: insertPermission._id});
        } catch(e) {
            return await errHandler(res, e);
        }

    },
    [API_METHODS.GET_PERMISSION]:  async (req, res, next) => {
        try {
            const permission = await Permission.findOne({_id: req.params.id}).exec();
            return await dataHandler(res, permission);
        } catch(e) {
            return await errHandler(res, e);
        }

    },
    [API_METHODS.DELETE_PERMISSION]:  async (req, res, next) => {
        const deleteId = req.params.id;
        if (deleteId) {
            const permission = await Permission.findOne({_id: req.user._id}).exec();
            if(permission) {
                if(permission.isSystem === 0) {
                    permission.status = 0;
                    await permission.save();
                    return res.json({success: true, message: 'Permission was suspended'});
                } else {
                    return res.json({success: false, message: 'Permission marked as system can not be suspended or removed'});
                }

            } else {
                return res.status(403).json({success: false, message: `No user exists with id = ${deleteId}`});
            }
        } else {
            return res.status(403).json({success: false, message: 'Invalid request'});
        }
    },
    [API_METHODS.UPDATE_PERMISSION]:  async (req, res, next) => {
        const updateId = req.params.id;
        if (updateId) {
            return await res.json({success: true, message: 'Updated'});
        } else {
            return await res.status(403).json({message: 'Your request data is invalid'});
        }
    }
};

export default handler;