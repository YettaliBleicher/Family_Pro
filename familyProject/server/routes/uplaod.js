import express from "express";
import { UploadFile } from '../controller/uplaod.js';
import { isAuth } from "../../middlewares/middleware.js";

const uploadRouter = express.Router();
const UploadController = new UploadFile();

uploadRouter.post('/upload', UploadController.uploadFile);
uploadRouter.post('/upload/:memberId',isAuth, UploadController.uploadFile);

// uploadRouter.post('/uploadProfile', UploadController.uploadProfile);
uploadRouter.post('/uploadProfile/:memberId',isAuth, UploadController.uploadProfile);



export{uploadRouter};
