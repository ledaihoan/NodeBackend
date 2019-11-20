import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
    name: {type: String, required: true, trim: true, minlength: 3},
    description: {type: String},
    isSystem: {type: Number, default: 0}
});

export default mongoose.model('Permission', permissionSchema);
