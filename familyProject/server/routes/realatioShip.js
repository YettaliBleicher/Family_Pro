
import express from "express";
import { RealationShip } from "../controller/realationShip.js"

const realationShipRouter = express.Router();
const RealationShipController = new RealationShip();

realationShipRouter.get("/realationShip", RealationShipController.getAll);


export { realationShipRouter }
