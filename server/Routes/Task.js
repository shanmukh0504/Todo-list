import express from 'express';
import { verifyJwtToken } from '../middlware/VerifyToken.js';
import { CreateTask, getTask, getTasks, UpdateTask, DeleteTask } from '../Controllers/Task.js';

const router = express.Router();

router.post('/create', verifyJwtToken, CreateTask);
router.put('/:id', verifyJwtToken, UpdateTask);
router.get('/:id', verifyJwtToken, getTask);
router.get('/', verifyJwtToken, getTasks);
router.delete('/:id', verifyJwtToken, DeleteTask);

export default router;
