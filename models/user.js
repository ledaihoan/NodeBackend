import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Grid from 'gridfs-stream';
Grid.mongo = mongoose.mongo;
import bcrypt from 'bcrypt';
const saltRound = process.env.SECURITY_HASH_ROUND || 10;
const userAvatarCollection = process.env.USER_AVATAR_COLLECTION || 'avatar';
const userSchema = new Schema({
    email: {type: String, unique: true, required: true, trim: true, minlength: 6},
    phone: {type: String, unique: true, required: true, trim: true, minlength: 6},
    fullname: {type: String, required: true},
    nickname: {type: String, required: true, unique: true, minlength: 3},
    password: {type: String, required: true},
    avatar: {type: Schema.Types.ObjectId, ref: 'Attachment'},
    identify: {type: String, required: true, unique: true},
    joined_date: {type: Date, required: true},
    quit_date: {type: Date},
    contexts: [{type: Schema.Types.ObjectId, ref: 'Context'}],
    jobs: [{type: Schema.Types.ObjectId, ref: 'Job'}],
    total_rate: {type: Number},
    count_rate: {type: Number},
    status: {type: Number},
    isSystem: {type: Number, default: 0}
});
userSchema.statics.findByNickname = function (queryNickname, callback) {
    this.findOne({nickname: queryNickname}, function (err, user) {
        if (err) return callback(err);
        if (!user) return callback(`User with nickname=${queryNickname} not found.`);
        delete user.password;
        callback(null, user);
    });
};
userSchema.statics.findByEmail = function (queryEmail, callback) {
    return new Promise((resolve, reject) => {
        this.findOne({email: queryEmail}, function (err, user) {
            if (err) reject(err);
            else if (!user) reject(new Error(`User with email=${queryEmail} not found.`));
            else {
                delete user.password;
                resolve(user);
            }
        });
    });
};
userSchema.pre('save', function(callback) {
    const user = this;
    // Break out if the password hasn't changed
    if (!user.isModified('password')) {
        return callback();
    }
    // Password changed so we need to hash it
    bcrypt.genSalt(saltRound, function(err, salt) {
        if (err) {
            console.log(err.stack);
            return callback(err);
        }
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
                console.log(err.stack);
                return callback(err);
            }
            user.password = hash;
            callback();
        });
    });
});
userSchema.methods.verifyPassword = function(password, callback) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, this.password, function(err, isMatch) {
            if (err) reject(err);
            else resolve(isMatch);
        });
    });
};
userSchema.statics.downloadAvatar = function(avatarId,res){
    const conn = mongoose.createConnection(process.env.DB_URL);
    conn.once('open', function () {
        const gfs = Grid(conn.db);
        gfs.collection(userAvatarCollection);
        gfs.findOne({ _id: mongoose.Types.ObjectId(avatarId) },function (err, file) {
            if (err) return callback(err);
            res.status(200);
            res.writeHead(200, {'Content-Type': file.contentType});

            const readStream = gfs.createReadStream({
                filename: file.filename
            });
            readStream.on('data', function(data) {
                res.write(data);
            });

            readStream.on('end', function() {
                conn.close();
                res.end();
            });

            readStream.on('error', function (err) {
                console.log('An error occurred!', err);
                conn.close();
                throw err;
            });
        });
    });
};
export default mongoose.model('User', userSchema);
