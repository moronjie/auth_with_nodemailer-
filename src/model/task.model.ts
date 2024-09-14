import Joi from "joi";
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true,
        default: "Normal",
        enum: ['High', "Normal", 'Medium', 'Low']
    }, 
    atriute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

export const verifyTaskSchema = (data: unknown) => {
    const schema = Joi.object({
    });

    return schema.validate(data);
};

export const Task = mongoose.model('TaskSchema', taskSchema);