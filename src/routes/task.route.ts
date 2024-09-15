import { Router } from "express";
import { createTask, deleteTask, getAllTask, getMyTask, getTask, updateMyTask } from "../controllers/task.cntroller";
import { authUser } from "../middleware/auth.jwt";

const router = Router();

// create task
router.post('/', createTask) 

// get a single task 
router.get('/:id', authUser, getTask) 

// get my task 
router.get('/mytask', authUser, getMyTask) 

// get all task with pagination 
router.get('/', authUser, getAllTask)

// update my task 
router.put('/mytask', authUser, updateMyTask)

// delete my task 
router.delete('/mytask', authUser, deleteTask)


export default router