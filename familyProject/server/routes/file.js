import express from "express";
import { File } from "../controller/file.js"

const fileRouter = express.Router();
const FileController = new File();

fileRouter.get("/file", FileController.getAll);
fileRouter.get("/file/:fileId", FileController.getById);
fileRouter.post("/file", FileController.add);

fileRouter.put("/file/:fileId", FileController.update);
fileRouter.delete("/file/:fileId", FileController.delete);

export { fileRouter }