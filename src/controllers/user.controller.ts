import { NextFunction, Request, Response } from "express";
import { User } from "../model/user.model";
import { customError } from "../middleware/errorHandler";
import { AuthReq } from "../types";

// get all users 
export const allUsers = async (req: Request, res: Response, next: NextFunction) => {
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

export const singleUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get users from db
        const user = await User.findById(req.params.id).select('-password').exec;
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

export const updateUser = async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params
        if (req.user?._id.toString() !== id.toString()) return next(customError("you are not allowed to update this user", 404));

        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true}).select('-password');

        res.status(200).json({success: true, message: "User updated successfully", data: user});
    } catch (error) {
        let errorMessage = error as Error;
        next(customError(errorMessage.message, 500))
    }
}

//delete user
export const deleteUser = async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params
        if (req.user?._id.toString() !== id.toString()) return next(customError("you are not allowed to update this user", 404));

        await User.findByIdAndDelete(req.user._id)

        res.status(200).json({success: true, message: "User deleted successfully"});

    } catch (error) {
        let errorMessage = error as Error;
        next(customError(errorMessage.message, 500));
    }
}