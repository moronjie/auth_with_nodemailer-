import { NextFunction, Request, Response } from 'express';
import { customError } from '../middleware/errorHandler';
import { User, validateUserLogIn, validateUserSignUp } from '../model/user.model';
import { generateJwt } from '../utils/generateJwt';
import { sendEmail } from '../utils/sendEmail';
const { v4: uuidv4 } = require('uuid');

export const signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { error } = validateUserSignUp(req.body);
        if (error) return next(customError(error.message, 400));

        const { username, email, password, confirmPassword } = req.body;

        const existUser = await User.findOne({ email });
        if (existUser) return next(customError("user already exist", 409));

        const existUserName = await User.findOne({ username });
        if (existUserName) return next(customError("username already exist", 409));

        if (password !== confirmPassword) {
            return next(customError("passwords does not match", 400));
        }

        const user = await User.create({ username, email, password });

        if (!user) return next(customError("user not created", 400));

        const token = generateJwt(user._id);
        res.cookie("token", token, { httpOnly: true, sameSite: "none", secure: true });

        const { password: string, ...data } = user.toJSON();

        res.status(201).json({
            success: true,
            message: "user created successfully",
            data,
            token
        });

    } catch (err) {
        const error = err as Error;
        next(customError(error.message, 500));
    }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error } = validateUserLogIn(req.body);
        if (error) return next(customError(error.message, 400));

        const user = await User.findOne({ email: req.body.email });

        if (!user) return next(customError("user does not exist", 404));
        if (!user.comparePassword(req.body.password)) return next(customError("password is incorrect", 400));

        const token = generateJwt(user._id)
        res.cookie("token", token, { httpOnly: true, sameSite: "none", secure: true });

        const { password, ...data } = user.toJSON();

        res.status(200).json({
            success: true,
            message: "user logged in successfully",
            data,
            token
        });
    } catch (err) {
        const error = err as Error;
        next(customError(error.message, 500));

    }
}

export const signOut = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            success: true,
            message: "successfully logged out"
        });
    } catch (err) {
        const error = err as Error;
        next(customError(error.message, 500));

    }
}

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get user who forgot password
        // generate random token
        // send email with the link to reset password

        const {email} = req.body;
        const user = await User.findOne({email});
        if (!user) return next(customError("user does not exist", 404));

        const token = uuidv4();
        const expirationTime = 10 * 60 * 1000;

        user.resetPasswordToken = token;
        user.resetPasswordExpire = expirationTime;

        await user.save();

        sendEmail(email, "password reset", `http://localhost:5000/${user._id}/${token}`);

        res.status(200).json({
            success: true,
            message: "email sent successfully",
        });

    } catch (err) {
        const error = err as Error;
        next(customError(error.message, 500));

    }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id, token} = req.params;
        const user = await User.findById(id)
        if (!user) return next(customError("user does not exist", 404));

        const invalidToken = user.resetPasswordToken !== token && user.resetPasswordExpire < Date.now();
        if (invalidToken) return next(customError("invalid token", 401));

        user.password = req.body.password;
        user.resetPasswordToken = "";
        user.resetPasswordExpire = 0;

        await user.save();

        res.status(200).json({
            success: true,
            message: "password reset successfully",
        });

    } catch (err) {
        const error = err as Error;
        next(customError(error.message, 500));

    }
}