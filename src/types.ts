import {userInterface } from "./model/user.model"
import { Request} from "express"

export interface AuthReq extends Request {
    user?: userInterface
}
