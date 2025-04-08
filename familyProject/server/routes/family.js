// import express from "express";
// import { Family } from "../controller/family.js"
// // import { readFile, writeFile } from 'node:fs/promises';

// const familyRouter = express.Router();
// const FamilyController = new Family();

// familyRouter.get("/family", FamilyController.getAll);
// familyRouter.post("/", FamilyController.add);
// familyRouter.put("/family/:familyId", FamilyController.update);
// familyRouter.delete("/family/:familyId", FamilyController.delete);


// export { familyRouter }


import express from "express";
import { Family } from "../controller/family.js"
// import { readFile, writeFile } from 'node:fs/promises';

const familyRouter = express.Router();
const FamilyController = new Family();

familyRouter.get("/family", FamilyController.getAll);
familyRouter.get("/familyPassword/:familyPassword", FamilyController.getByPassword);
familyRouter.post("/",FamilyController.add);
familyRouter.put("/family/:familyId", FamilyController.update);
familyRouter.delete("/family/:familyId", FamilyController.delete);


export { familyRouter }