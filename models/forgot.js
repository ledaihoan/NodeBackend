import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const forgotTokenLife = process.env.FORGOT_TOKEN_LIFE || "24h";
const forgotSchema = new Schema({
    access: {type: String, required: true, trim: true, minlength: 3},
}, {timestamps: true});
forgotSchema.index({createAt: 1}, {expires: forgotTokenLife});
export default mongoose.model('Forgot', forgotSchema);