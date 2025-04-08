import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

import { insertQuery, updateQuery } from '../service/query.js';


cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
    
});


const uploadToCloudinary = async (memberId, filePath) => {
    try {
        console.log(" = " + filePath);

        // מחכים לסיום ההעלאה ל-Cloudinary באמצעות await
        const result = await cloudinary.v2.uploader.upload(filePath, { unique_filename: true, resource_type: 'auto' }
        );

        const fileType = result.resource_type;

        console.log("fileType  ==" + fileType);

        console.log("url= " + result.secure_url);

        // קוראים לפונקציה getUrl ומעבירים לה את התוצאה מההעלאה
        await getUrl(result, memberId, result.format);

        // מחזירים את התוצאה
        return result;
    } catch (err) {
        // אם יש שגיאה, זורקים את השגיאה למעלה
        throw err;
    }
};

const getUrl = async (fileURL, memberId, fileFormat) => {
    try {
        let filePath = fileURL.secure_url;
        console.log("filePath  =" + filePath);
        let fileTypeId;

        console.log("filePath: " + filePath);

        switch (fileFormat.toLowerCase()) {
            case 'png':
            case 'jpg':
            case 'jpeg':
                fileTypeId = 1;
                break;
            case 'mp4':
            case 'mp3':
            case 'mov':
            case 'wmv':
            case 'wav':
                fileTypeId = 3;
                break;
            default:
                console.log("Invalid fileType");
                return;
            // return { "error": "err" };
            // break;
        }


        let newFile = {
            "familyMemberId": memberId,
            "filePath": filePath,
            "fileTypeId": fileTypeId
        };

        console.log("newFile:   " + newFile); // הדפסה לצורך בדיקה

        let files = await addFile(newFile);


        console.log("back!!!!!!!!!    " + files);
        return files;

    } catch (error) {
        console.log('There was an error:', error.message);
        throw error; // זריקת השגיאה למעלה
    }
};


const uploadProfile = async (memberId, filePath) => {
    try {
        console.log(" = " + filePath);

        // מחכים לסיום ההעלאה ל-Cloudinary באמצעות await
        const result = await cloudinary.v2.uploader.upload(filePath, { unique_filename: true, resource_type: 'auto' }
        );
        const fileType = result.resource_type;

        console.log("fileType  ==" + fileType);

        console.log("url= " + result.secure_url);

        // קוראים לפונקציה getUrl ומעבירים לה את התוצאה מההעלאה
        await getUrlOfProfile(result, memberId);

        // מחזירים את התוצאה
        return result;
    } catch (err) {
        // אם יש שגיאה, זורקים את השגיאה למעלה
        throw err;
    }
};


const getUrlOfProfile = async (fileURL, memberId) => {
    try {
        let photoPath = fileURL.secure_url;
        let files = await updateQuery("familyMembers", `photoPath = '${photoPath}'`, "familyMemberId", memberId);
        return files;

    } catch (error) {
        console.log('There was an error:', error.message);
        throw error; // זריקת השגיאה למעלה
    }
};


const addFile = async (newFile) => {
    console.log("addFile");
    try {
        const { familyMemberId, filePath, fileTypeId } = newFile;
        let file = await insertQuery("files", "familyMemberId, filePath, fileTypeId", `'${familyMemberId}', '${filePath}', ${fileTypeId}`);
        return file;
    } catch (err) {
        console.error('Query Error:', err);
        return { "error": "err" };
    }
};

export { uploadToCloudinary, uploadProfile, addFile }