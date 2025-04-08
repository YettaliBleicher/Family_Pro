import express from "express";
import { FamilyRealationShip } from "../controller/familyRealationShip.js"
import { isAuth } from "../../middlewares/middleware.js";

const familyRealationShipRouter = express.Router();
const FamilyRealationShipController = new FamilyRealationShip();

familyRealationShipRouter.get("/familyRealationShip", FamilyRealationShipController.getAll);
familyRealationShipRouter.get("/familyRealationShip/:familyMemberId", FamilyRealationShipController.getById);
familyRealationShipRouter.post("/familyRealationShip",isAuth, FamilyRealationShipController.add);
familyRealationShipRouter.delete("/familyRealationShip/:familyMemberId", FamilyRealationShipController.delete);


export { familyRealationShipRouter }
