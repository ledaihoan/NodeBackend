import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "4h";
const tokenSchema = new Schema({
    userid: {type: Schema.Types.ObjectId, ref: 'User'},
    access: {type: String, required: true, trim: true, minlength: 3},
    refresh: {type: String, required: true, trim: true, minlength: 3}
}, {timestamps: true});
tokenSchema.index({createAt: 1}, {expires: refreshTokenLife});
export default mongoose.model('Token', tokenSchema);
