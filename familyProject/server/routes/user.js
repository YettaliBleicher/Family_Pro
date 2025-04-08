import express from "express";
import { User } from "../controller/user.js"
import { isAuth, isAdmin } from "../../middlewares/middleware.js";

const userRouter = express.Router();
const UserController = new User();

userRouter.get("/user", UserController.getAll);
userRouter.get("/user/:userId", UserController.getById);
userRouter.get("/familyManager/:familyId", isAuth, isAdmin, UserController.getByFamilyId);
userRouter.get('/getUserData', isAuth, UserController.getUserDataFromTOken)

userRouter.post("/logIn", UserController.logIn);

userRouter.post("/user", UserController.add);
userRouter.put("/user/:userId", UserController.update);
userRouter.put("/updateUser/:email",isAuth, UserController.update);
userRouter.delete("/user/:userId", UserController.delete);



export { userRouter }
