import { uploadToCloudinary,uploadProfile } from '../service/uplaod.js';

export class UploadFile {
    uploadFile = async (req, res) => {
        try {
            const memberId = req.params.memberId;
            console.log(memberId);
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send('No files were uploaded.');
            }

            let uploadedFile = req.files.myFile;
            const result = await uploadToCloudinary(memberId, uploadedFile.tempFilePath);
            console.log(result);

            res.json({ message: 'File uploaded successfully!', result });
        } catch (err) {
            res.status(500).send({ error: 'Failed to upload file', details: err });
        }
    }


    uploadProfile = async (req, res) => {
        try {
            const memberId = req.params.memberId;
            console.log(memberId);
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send('No files were uploaded.');
            }

            let uploadedFile = req.files.myFile;
            const result = await uploadProfile(memberId, uploadedFile.tempFilePath);
            console.log(result);

            res.json({ message: 'File uploaded successfully!', result });
        } catch (err) {
            res.status(500).send({ error: 'Failed to upload file', details: err });
        }
    }
 
    
};