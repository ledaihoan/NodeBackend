import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const contextSchema = new Schema({
    name: {type: String, required: true, trim: true, minlength: 3},
    description: {type: String},
    parents: [{type: Schema.Types.ObjectId, ref: 'Context'}],
    status: {type: Number},
    isSystem: {type: Number, default: 0}
});

export default mongoose.model('Context', contextSchema);
