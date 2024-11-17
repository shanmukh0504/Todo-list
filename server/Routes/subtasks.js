import { Task } from '../models/Task.js';
import { SubTask } from '../models/Subtask.js';
export const CreateSubTask = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        const { name } = req.body;
        const newSubTask = new SubTask({ name })
        await newSubTask.save();
        task.subTasks.push(newSubTask._id);
        const updatedTask = await task.save();

        return res.status(201).json({ task: updatedTask });
    } catch (err) {
        console.log("error:",err)
        next(err);
    }
};

export const UpdateSubTaskCompletion = async (req, res, next) => {
    try {
        const { subTaskId } = req.params;
        const { completed } = req.body;

        const subTask = await SubTask.findByIdAndUpdate(subTaskId, { completed }, { new: true });

        if (!subTask) {
            return res.status(404).json({ message: "Sub-task not found" });
        }

        return res.status(200).json({ subTask });
    } catch (err) {
        next(err);
    }
};

export const DeleteSubTask = async (req, res, next) => {
    try {
      const { subTaskId } = req.params;
      await SubTask.findByIdAndDelete(subTaskId);
      return res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  };