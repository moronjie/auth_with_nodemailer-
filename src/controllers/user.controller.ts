import { NextFunction, Request, Response } from "express";
import { User } from "../model/user.model";
import { customError } from "../middleware/errorHandler";

// get all users 
const allUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get users from db
        const users = await User.find().select('-password').exec;
        res.status(200).json({
            success : true,
            message: "User found successfully",
            data: users
        });
    } catch (error) {
        let errorMessage = error as Error;
        next(customError(errorMessage.message, 500));
    }
}
// get a single user 

const singleUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get users from db
        const user = await User.findById(req.params).select('-password').exec;
        if(!user) return next(customError("User not found", 404));
        res.status(200).json({
            success : true,
            message: "User found successfully",
            data: user
        });

    } catch (error) {
        let errorMessage = error as Error;
        next(customError(errorMessage.message, 500));
    }
}

//update user 

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get users from db
    } catch (error) {
        let errorMessage = error as Error;
        next(customError(errorMessage.message, 500))
    }
}

//delete user
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get users from db
    } catch (error) {
        let errorMessage = error as Error;
        next(customError(errorMessage.message, 500));
    }
}