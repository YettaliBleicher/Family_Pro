import express from "express";
import { FamilyMember } from "../controller/familyMember.js"
import { isAdmin, isAuth } from "../../middlewares/middleware.js";

const familyMemberRouter = express.Router();
const FamilyMemberController = new FamilyMember();

familyMemberRouter.get("/familyMember", FamilyMemberController.getAll);
familyMemberRouter.get("/familyMember/:familyMemberId", FamilyMemberController.getById);
familyMemberRouter.get("/memberBiography/:familyMemberId", FamilyMemberController.getBiographyById);
familyMemberRouter.put("/memberBiography/:familyMemberId",isAuth, FamilyMemberController.update);
familyMemberRouter.post("/",isAuth, FamilyMemberController.add);
familyMemberRouter.put("/familyMember/:familyMemberId", isAuth, isAdmin, FamilyMemberController.update);
familyMemberRouter.delete("/familyMember/:familyMemberId", FamilyMemberController.delete);



export { familyMemberRouter }
