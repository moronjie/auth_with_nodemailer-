import jwt from 'jsonwebtoken'
import config from '../config'
import mongoose from 'mongoose'

export const generateJwt = (id: mongoose.Types.ObjectId) => {
    return jwt.sign({id}, config.secret, {expiresIn: '7d'})

}