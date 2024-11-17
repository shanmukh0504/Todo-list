import { Task } from "../models/Task.js";
import dayjs from "dayjs";
export const CreateTask = async (req, res, next) => {
  try {
    const { id } = req.user;
    const completetionDate = new Date(req.body.date);
    const task = new Task({ ...req.body, userId: id, date: completetionDate });
    const saveTask = await task.save();
    return res.status(201).json({ task: saveTask });
  } catch (err) {
    next(err);
  }
};

export const DeleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export const UpdateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(id, { ...req.body }, { new: true })
    return res.status(201).json({ task })
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const { id } = req.params
    const task = await Task.findById(id).populate('subTasks')
    return res.status(201).json({ task })
  } catch (err) {
    next(err);
  }
};

export const getTasks = async (req, res, next) => {
  try {

    const { id } = req.user;
    const { type, status, day } = req.query;
    let minDate, maxDate;

    if (day === 'today') {
      minDate = dayjs().startOf('day').toDate();
      maxDate = dayjs().endOf('day').toDate();
    } else if (day === 'seven') {
      minDate = dayjs().subtract(7, 'days').startOf('day').toDate();
      maxDate = dayjs().endOf('day').toDate();
    } else if (day === 'thirty') {
      minDate = dayjs().subtract(30, 'days').startOf('day').toDate();
      maxDate = dayjs().endOf('day').toDate();
    }

    const query = { userId: id };
    if (type) query.type = type;
    if (status) query.status = status;
    if (day) query.date = { $gte: minDate, $lte: maxDate };

    const tasks = await Task.find(query).populate('subTasks');

    return res.status(200).json({ tasks });
  } catch (err) {
    next(err);
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({}).populate('subTasks');
    return res.status(200).json({ tasks });
  } catch (err) {
    next(err);
  }
};



