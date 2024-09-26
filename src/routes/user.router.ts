import { Router } from "express";
import { allUsers, deleteUser, singleUser, updateUser } from "../controllers/user.controller";
import { authUser } from "../middleware/auth.jwt";

const router = Router();

//get all users
router.get('/users', allUsers)

//get single user 
router.get('/users/:id', singleUser)

// update user
router.post('/users/:id', authUser, updateUser)

// delete user
router.delete('/users/:id', authUser, deleteUser)

export default router