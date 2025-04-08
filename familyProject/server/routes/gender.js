
import express from "express";
import { Gender } from "../controller/gender.js"

const genderRouter = express.Router();
const GenderController = new Gender();

genderRouter.get("/gender", GenderController.getAll);


export { genderRouter }
