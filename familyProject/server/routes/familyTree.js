import express from "express";
import { FamilyTreeController } from "../controller/familyTree.js";

const familyTreeRouter = express.Router();
const familyTreeController = new FamilyTreeController();

familyTreeRouter.post("/getFamilyMemberData", familyTreeController.getFamilyMemberTree); // קבלת העץ
familyTreeRouter.post("/getRealationshipData", familyTreeController.getRealationshipTree); // קבלת העץ
// familyTreeRouter.post("/getRealationshipData", familyTreeController.getRealationshipTree); // קבלת העץ
familyTreeRouter.post("/usersOfFamily", familyTreeController.getAllUsersOfFamily); // קבלת העץ


export { familyTreeRouter };
