import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { customError } from "./errorHandler"
import { User, userInterface } from "../model/user.model"
import { AuthReq } from "../types"


export const authUser = async (req: AuthReq, res: Response, next: NextFunction) => {
    // if(!req.headers.authorization) return next(customError("you are not authorized", 401))

    // const token = req.headers.authorization?.replace("Bearer ", "")
    const token = req.cookies.token;
    if (!token) return next(customError("you are not authorized", 401));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { _id: string };
        if (!decoded) return next(customError("you are not authorized", 401));
    
        const user = (await User.findById(decoded._id)) as userInterface;
        if (!user) return next(customError("User not found", 404));
        user.password = '';

        req.user = user;

        next();
    } catch (err) {
        const error = err as Error;
        next(customError(error.message, 500));
    }

}