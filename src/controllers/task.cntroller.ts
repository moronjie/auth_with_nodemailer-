import { Response, Request, NextFunction } from 'express';
import { Task, verifyTaskSchema } from '../model/task.model';
import { customError } from '../middleware/errorHandler';

// create a new task 
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    // validate the request body
    const {error} = verifyTaskSchema(req.body);
    if (error) return next(customError(error.message, 400));

    // create a new task
    const task = new Task(req.body)

    await task.save()

    res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
    })
}

// get single task 

// get my task 

// update my task

// delete my task