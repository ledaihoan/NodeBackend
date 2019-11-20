import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    title: {type: String, required: true, trim: true, minlength: 3},
    description: {type: String},
    context: { type: Schema.Types.ObjectId, ref: 'Context' },
    permissions: [{type: Schema.Types.ObjectId, ref: 'Permission'}],
    status: { type: Number },
    isSystem: {type: Number, default: 0}
});

export default mongoose.model('Job', jobSchema);
