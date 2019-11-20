import { API_METHODS } from './Router';
import Job from '../../models/job';
const errHandler = async(res, e) => {
    return await res.status(503).json({success: false, err: true, message: `Oops! There was an error while processing your request`, errMessage: e.message});
};
const dataHandler = async(res, data) => {
    return await res.json({success: true, message: data && data.message ? data.message: '', data: data});
};
export const handler = {
    [API_METHODS.GET_ALL_JOBS]: async (req, res) => {
        try {
            const jobs = await Job.find().exec();
            return await dataHandler(res, jobs);
        } catch(e) {
            return await errHandler(res, e);
        }

    },
    [API_METHODS.POST_JOB]: async (req, res) => {
        const job = new Job(req.body);
        try {
            const insertJob = await job.save();
            return await dataHandler(res, {message: 'Added Job successfully', uid: insertJob._id});
        } catch(e) {
            return await errHandler(res, e);
        }

    },
    [API_METHODS.GET_JOB]:  async (req, res, next) => {
        try {
            const job = await Job.findOne({_id: req.params.id}).exec();
            return await dataHandler(res, job);
        } catch(e) {
            return await errHandler(res, e);
        }

    },
    [API_METHODS.DELETE_JOB]:  async (req, res, next) => {
        const deleteId = req.params.id;
        if (deleteId) {
            const job = await Job.findOne({_id: req.user._id}).exec();
            if(job) {
                const job = {}
                if(job.isSystem === 0) {
                    job.status = 0;
                    await job.save();
                    return res.json({success: true, message: 'Job was suspended'});
                } else {
                    return res.json({success: false, message: 'Job marked as system can not be suspended or removed'});
                }
            } else {
                return res.status(403).json({success: false, message: `No user exists with id = ${deleteId}`});
            }
        } else {
            return res.status(403).json({success: false, message: 'Invalid request'});
        }
    },
    [API_METHODS.UPDATE_JOB]:  async (req, res, next) => {
        const updateId = req.params.id;
        if (updateId) {
            return await res.json({success: true, message: 'Updated'});
        } else {
            return await res.status(403).json({message: 'Your request data is invalid'});
        }
    }
};

export default handler;