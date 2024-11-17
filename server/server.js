import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import cron from 'node-cron';
import { fileURLToPath } from 'url';
import path from 'path';
import multer from 'multer';
import UserRoutes from './Routes/User.js';
import TaskRoutes from './Routes/Task.js';
import { Register } from './Controllers/User.js';
import { Task } from './models/Task.js';
import { User } from './models/User.js';
import { makeCall } from './TwilioService.js';
import { CreateSubTask, UpdateSubTaskCompletion, DeleteSubTask } from './Routes/subtasks.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: 'https://todo-twillio.netlify.app/', credentials: true }));
app.use(cookieParser());

app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets');
    },
    filename: function (req, file, cb) {
        const picturePath = new Date().toISOString().replace(/:/g, '-') + file.originalname;
        req.body.picturePath = picturePath;
        cb(null, picturePath);
    }
});

const upload = multer({ storage });

app.use('/auth', UserRoutes);
app.use('/auth/register', upload.single('picture'), Register);
app.use('/task', TaskRoutes);
app.get('/', (req, res) => {
    res.send('This is a vercel response');
});
app.post('/tasks/:taskId/subtasks', CreateSubTask);
app.put('/subtasks/:subTaskId', UpdateSubTaskCompletion);
app.delete('/subtasks/:subTaskId', DeleteSubTask);

app.get('/auth/users/count', async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ count });
    } catch (error) {
        console.error("Error fetching user count:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`app is listening to PORT ${PORT}`);
        });
        const calledTasks = new Set();
        cron.schedule('0 12 * * *', async () => {
            console.log("Checking task priorities...");
            try {
                const currentDate = new Date();
                const overdueTasks = await Task.find({
                    status: { $nin: ['completed', 'canceled'] },
                    date: { $lte: currentDate }
                });

                overdueTasks.forEach(async (task) => {
                    let priority = 'low';

                    const timeDifference = currentDate.getTime() - task.date.getTime();
                    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
                    console.log(daysDifference);
                    if (daysDifference <= 1) {
                        priority = 'medium';
                    } else if (daysDifference >= 2) {
                        priority = 'high';
                    }

                    if (task.priority !== priority) {
                        await Task.findByIdAndUpdate(task._id, { priority });
                    }
                });

                const tasksByUser = {};
                overdueTasks.forEach(task => {
                    const userId = task.userId.toString();
                    if (!tasksByUser[userId]) {
                        tasksByUser[userId] = [];
                    }
                    tasksByUser[userId].push(task);
                });

                Object.values(tasksByUser).forEach(tasks => {
                    tasks.sort((taskA, taskB) => taskA.priority.localeCompare(taskB.priority));
                });
            } catch (error) {
                console.error("Error updating task priorities:", error);
            }
        });
        cron.schedule('0 12 * * *', async () => {
            console.log("Checking tasks deadline...");
            try {
                const currentDate = new Date();
                const fifteenMinutesFromNow = new Date(currentDate.getTime() + (15 * 60000));

                const users = await User.find().sort({ priority: 'asc' });

                for (const user of users) {
                    console.log(`Fetching tasks for user ${user._id}...`);

                    const tasksToCall = await Task.find({
                        userId: user._id,
                        time: { $lte: fifteenMinutesFromNow.toISOString() },
                        priority: { $in: ['medium', 'high'] }
                    });

                    if (tasksToCall.length > 0) {
                        console.log(`Found ${tasksToCall.length} tasks to call for user ${user._id}.`);

                        tasksToCall.sort((taskA, taskB) => {
                            const priorityOrder = { high: 2, medium: 1 };
                            return priorityOrder[taskB.priority] - priorityOrder[taskA.priority];
                        });

                        for (let i = 0; i < tasksToCall.length; i++) {
                            const task = tasksToCall[i];
                            if (calledTasks.has(task._id.toString())) {
                                console.log(`Task ${task._id} already called.`);
                                continue;
                            }

                            const phoneNumber = user.phoneNumber;
                            if (!phoneNumber) {
                                console.log(`Phone number is undefined for user ${user._id}`);
                                continue;
                            }
                            const formattedPhoneNumber = "91" + phoneNumber;

                            await new Promise(resolve => setTimeout(resolve, i * 60000));

                            console.log(`Calling ${formattedPhoneNumber} for task ${task._id}`);
                            try {
                                await makeCall(formattedPhoneNumber);

                            } catch (error) {
                                console.error("Error making call:", error);
                            }
                            calledTasks.add(task._id.toString());
                        }
                    } else {
                        console.log(`No tasks found to call for user ${user._id}.`);
                    }
                }
            } catch (error) {
                console.error("Error checking tasks deadline:", error);
            }
        });



    })
    .catch((err) => {
        console.log("Error connecting to MongoDB:", err);
    });
