import connectToDatabase from './database.js';
import { getOutsideQuery, insertQuery, deleteQuery } from '../service/query.js';
// import cloudinary from 'cloudinary';

// // הגדרת Cloudinary
// cloudinary.v2.config({
//     cloud_name: 'dhsaibwuc', 
//     api_key: '736515383134115', 
//     api_secret: 'mtUS2RFlQ53z2zA1PMHd4faDo4M'
// });




const getAllFiles = async (limit, start, sort) => {
    try {
        const query = ` SELECT * FROM  files `;
        let files = await getOutsideQuery(query);
        console.log(query);//delete
        return files;
    } catch (err) {
        console.error('Query failed! Error:', err);
        return [];
    }
};

const getFilesById = async (familyMemberId) => {
    try {
        const query = ` SELECT * FROM  files WHERE familyMemberId = ${familyMemberId}; `;
        let files = await getOutsideQuery(query);
        return files;
    } catch (err) {
        console.error('Query failed! Error:', err);
        return [];
    }
};


const addFile = async (newFile) => {
    console.log("addFile");
    try {
        let nameValues = "";
        let values = "";
        for (const key in newFile) {
            nameValues += key + ',';
            if (typeof newFile[key] === "string")
                values += `'${newFile[key]}',`;
            else
                values += newFile[key] + ',';
        }
        nameValues = nameValues.slice(0, -1);
        values = values.slice(0, -1);
        console.log("namevalue"+nameValues);//delete
        console.log("value"+values);//delete
        let file = await insertQuery("files", nameValues, values);
        return file;
    } catch (err) {
        console.error('Query Error:', err);
        return { "error": "err" };
    }
};


const deleteFile = async (fileId) => {
    try {
        let file = await deleteQuery("files", "fileId", fileId);
        return file;
    } catch (err) {
        console.error('Query Error:', err);
        return { "error": "err" };
    }
};

export { getAllFiles, getFilesById, addFile, /*updateFile,*/ deleteFile, /*uploadToCloudinary*/ }