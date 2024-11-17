import mongoose from "mongoose";

const TaskSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['default', 'personal', 'shopping', 'wishlist', 'work'],
        default: 'default'
    },
    status: {
        type: String,
        enum: ['in-progress', 'pending', 'completed', 'canceled'],
        default: 'pending'
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    subTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubTask' }]
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);

export { Task };
