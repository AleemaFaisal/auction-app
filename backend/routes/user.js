import express from "express"
import userController from "../controllers/users.js";

const userRouter = express.Router();
userRouter.route('/signup').post(userController.createUser);
userRouter.route('/login').get(userController.getUser);
userRouter.route('/changePassword').post(userController.changePassword);

export default userRouter;
