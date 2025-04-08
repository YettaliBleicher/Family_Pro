import express from "express";
import { Status } from "../controller/status.js"

const statusRouter = express.Router();
const StatusController = new Status();

statusRouter.get("/status", StatusController.getAll);


export { statusRouter }
