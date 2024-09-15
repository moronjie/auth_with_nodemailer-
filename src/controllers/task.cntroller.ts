import { Response, Request, NextFunction } from 'express';
import { Task, verifyTaskSchema } from '../model/task.model';
import { customError } from '../middleware/errorHandler';
import { AuthReq } from '../types';

// create a new task 
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    // validate the request body
    const {error} = verifyTaskSchema(req.body);
    if (error) return next(customError(error.message, 400));

    // create a new task
    const task = new Task(req.body);

    await task.save();

    res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
    });
}

// get single task 
export const getTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await Task.findById(req.params.id).populate("attribute");
        if (!task) return next(customError('Task not found', 404));

        res.status(200).json({
            success: true,
            data: task
        });

    } catch (err) {
        const error = err as Error;
        next(customError(error.message, 500));
    }
}

// get all tasks
export const getAllTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await Task.find();

        // add pagination

        res.status(200).json({
            success: true,
            data: tasks
        });

    } catch (err) {
        const error = err as Error;
        next(customError(error.message, 500));
    }
}

// get my task 
export const getMyTask = async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const task = await Task.findOne({"attribute": req.user?._id}).populate("attribute");
        if (!task) return next(customError('Task not found', 404));

        res.status(200).json({success: true, data: task});
    } catch (err) {
        const error = err as Error;
        next(customError(error.message, 500));
    }
}

// update my task

export const updateMyTask = async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return next(customError('Task not found', 404));

        if(req.user?._id.toString() !== task.attribute?.toString) return next(customError("you are not authorized to update this task", 401))

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true}).populate("attribute");
        if (!task) return next(customError('Task not found', 404));

        res.status(200).json({success: true, message: "task updated successfully", data: task});
    } catch (err) {
        const error = err as Error;
        next(customError(error.message, 500));
    }
}

// delete my task
export const deleteTask = async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return next(customError('Task not found', 404));

        if(req.user?._id.toString() !== task.attribute?.toString) return next(customError("you are not authorized to delete this task", 401))

        await Task.findByIdAndDelete(req.params.id);

        res.status(200).json({success: true, message: "task deleted successfully"});
        
    } catch (err) {
        const error = err as Error;
        next(customError(error.message, 500));
    }
}