import express from "express";
import { FileType } from "../controller/fileType.js"

const fileTypeRouter = express.Router();
const FileTypeController = new FileType();

fileTypeRouter.get("/fileType", FileTypeController.getAll);


export { fileTypeRouter }