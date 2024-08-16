import Joi, { required } from "joi";
import mongoose, { Document, CallbackWithoutResultAndOptionalError } from 'mongoose';
import bcrypt from "bcrypt"
import { customError } from "../middleware/errorHandler";

export interface userInterface extends Document {
    _id: mongoose.Types.ObjectId,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string,
    active: boolean,
    resetPasswordToken: string,
    resetPasswordExpire: Date,
    createdAt: Date,
    updatedAt: Date
    comparePassword(password: string): Promise<boolean | undefined>;
}

const userSchema = new mongoose.Schema<userInterface>({
    firstName:{
        type: String,
        required: [true, 'first name is required.'],
        unique: true
    },
    lastName:{
        type: String,
        required: [true, 'last name is required.'],
        unique: true
    },
    email:{
        type: String,
        required: [true, 'Email is required.'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'Password is required.'],
        minlength: [8, 'Password must be at least 8 characters or more.'],
    },
    role:{
        type: String,
        default: "user",
        enum: ["user", "admin"],
    },
    active: {type: Boolean, default: false},
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {timestamps: true})

userSchema.pre("save", async function (this: userInterface, next: CallbackWithoutResultAndOptionalError): Promise<void> {
    try {
        if (!this.isModified("password")) return next()

        const salt = await bcrypt.genSalt(10)
        
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (err: any) {
        next(customError(err.message, 500))
    }
})

userSchema.methods.comparePassword = async function (password: string): Promise<boolean | undefined> {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (err: any) {
        customError(err.message, 401)
    }
}


export const User = mongoose.model<userInterface>('User', userSchema)

export const validateUserSignUp = (data: unknown) => {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().min(8).required(),
        confirmPassword: Joi.ref('password'),
        // role: Joi.string().valid('user', 'admin'),
        // active: Joi.boolean()
    })
    return schema.validate(data)
}

export const validateUserLogIn = (data:unknown) => {
    const schema = Joi.object({
        email: Joi.string().email().max(256).required(),
        password: Joi.string().min(8).max(256).required(),
    })
    return schema.validate(data)
}

export const validateUserForgotPassword = (data:unknown) => {
    const schema = Joi.object({
        email: Joi.string().email().max(256).required(),
    })
    return schema.validate(data)
}

export const validateUserResetPassword = (data:unknown) => {
    const schema = Joi.object({
        password: Joi.string().min(8).max(256).required(),
        confirmPassword: Joi.string().min(8).max(256).required().valid(Joi.ref('password')),
    })
    return schema.validate(data)
}