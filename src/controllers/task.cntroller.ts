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
export const getTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await Task.findById(req.params.id).populate("atriute")
        if (!task) return next(customError('Task not found', 404));

        res.status(200).json({
            success: true,
            data: task
        })

    } catch (err) {
        const error = err as Error;
        next(customError(error.message, 500));
    }
}

// get all tasks
export const getAllTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await Task.find()

        // add pagination

        res.status(200).json({
            success: true,
            data: tasks
        })

    } catch (err) {
        const error = err as Error;
        next(customError(error.message, 500));
    }
}

// get my task 

// update my task

// delete my task