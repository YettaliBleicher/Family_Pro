import express from "express";

//מטפל בהעלאת קבצים
import fileUpload from 'express-fileupload';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();


import { familyRouter } from "./server/routes/family.js";
import { familyMemberRouter } from "./server/routes/familyMember.js";
import { genderRouter } from "./server/routes/gender.js";
import { statusRouter } from "./server/routes/status.js";
import { realationShipRouter } from "./server/routes/realatioShip.js";
import { familyRealationShipRouter } from "./server/routes/familyRealationShip.js";
import { userRouter } from "./server/routes/user.js";
import { familyTreeRouter } from "./server/routes/familyTree.js"
import { fileRouter } from "./server/routes/file.js";
import { fileTypeRouter } from "./server/routes/fileType.js";
import { uploadRouter } from "./server/routes/uplaod.js";

//מטפל בהעלאת קבצים


const app = express();
const port = process.env.port || 3000

import cors from 'cors'
app.use(cors());


const __dirname = path.resolve(); // כיוון שאין `__dirname` כברירת מחדל ב-ES6

// Middleware להעלאת קבצים
// הגדרת התיקייה client כציבורית
app.use(express.static(path.join(__dirname, 'client')));

// ניתוב לדף family-Tree.html
app.get('/family-tree', (req, res) => {
    res.sendFile(path.join(__dirname, './client/html/family-Tree.html'));
});

// Middleware להעלאת קבצים
app.use(fileUpload({ useTempFiles: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static('uploads'))

//file
app.use("/", fileRouter);
app.use("/file", fileRouter);
app.use('/file/:femilyMemberId', fileRouter);


//fileType
app.use("/", fileTypeRouter);
app.use("/fileType", fileTypeRouter);

//uploadFile
app.use("/", uploadRouter);
app.use("/upload", uploadRouter);
app.use("/upload/:memberId", uploadRouter);

//uploadProfile
app.use("/", uploadRouter);
app.use("/uploadProfile", uploadRouter);
app.use("/uploadProfile/:memberId", uploadRouter);

//family
app.use("/", familyRouter);
app.use("/family", familyRouter);
app.use('/family/:familyId', familyRouter);
app.use("/familyPassword", familyRouter);
app.use("/familyPassword/:familyPassword", familyRouter);


//familyMember
app.use("/", familyMemberRouter);
app.use("/familyMember", familyMemberRouter);
app.use("/familyMember/:familyMemberId", familyMemberRouter);
// app.use("/familyMember/:familyMemberId", familyMemberRouter);
app.use("/memberBiography", familyMemberRouter);
app.use("/memberBiography/:familyMemberId", familyMemberRouter);
app.use("/searchFamilyMember", familyMemberRouter);


//gender
app.use("/", genderRouter);
app.use("/gender", genderRouter);

//status
app.use("/", statusRouter);
app.use("/status", statusRouter);

//relationShip
app.use("/", realationShipRouter);
app.use("/realationShip", realationShipRouter);

//familyRealationShip
app.use("/", familyRealationShipRouter);
app.use("/familyRealationShip", familyRealationShipRouter);
app.use("/familyRealationShip/:familyMemberId", familyRealationShipRouter);

//user 
app.use("/", userRouter);
app.use("/user", userRouter);
app.use("/user/:userId", userRouter);
app.use("/updateUser/:email", userRouter);
app.use("/familyManager/:familyId", userRouter);
app.use("/logIn", userRouter);
app.use("/getUserData", userRouter);



//tree

app.use("/", familyTreeRouter);
app.use("/getFamilyMemberData'", familyTreeRouter);

app.use("/", familyTreeRouter);
app.use("/getRealationshipData", familyTreeRouter);


app.listen(port, () => {
    console.log(`example app ${port}`)
});
