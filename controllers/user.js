import User from '../models/user';
import multer from 'multer';
import mongoose from 'mongoose';
import HTTPStatus from 'http-status';
import GridStorage from 'multer-gridfs-storage';
const userAvatarCollection = process.env.USER_AVATAR_COLLECTION || 'avatar';
console.log(process.env.DB_URL);
const storage = GridStorage({
    url: process.env.DB_URL,
    root: userAvatarCollection,
    metadata: function(req, file, cb) {
        const metadata={};
        metadata.originalname=file.originalname;
        cb(null, metadata);
    }
});
const uploader = multer({ storage: storage });
async function addUser(req, res) {
    const existingUser = await User.findByEmail(req.body.email);
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
            // jobs: [],
            total_rate: 0,
            count_rate: 0,
            status: req.body.status || 2
        });
        try {
            let saveUser = await user.save(); //when fail its goes to catch
            console.log(saveUser); //when success it print.
            await res.json({ success:true, message: 'Đã thêm người dùng!', username:user.username});

        } catch (err) {
            console.log('err' + err);
            res.status(500).send(err);
        }
    } else {
        await res.json({success: false, message: 'Email đã được sử dụng'})
    }
}
function getUsers(req, res) {
    if (req.query.nickname) {
        const queryNickname = req.query.nickname;
        User.findByNickname(queryNickname, function(err, user) {
            if (err) return res.status(HTTPStatus.UNPROCESSABLE_ENTITY).json({ msg: err });
            res.json(user);
        });
    } else {
        User.find(function(err, users) {
            if (err) return res.status(HTTPStatus.BAD_REQUEST).json({ success: false,msg: err });
            res.json({success:true,users:users});
        });
    }
}
export default {
    addUser: addUser,
    getUsers: getUsers
};