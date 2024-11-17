import mongoose from "mongoose";

// SubTask Schema
const SubTaskSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const SubTask = mongoose.model('SubTask', SubTaskSchema);

export { SubTask }; 
