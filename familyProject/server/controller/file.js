import { getAllFiles, getFilesById, addFile, /*updateFile,*/ deleteFile } from '../service/file.js';
// import { uploadToCloudinary } from '../service/file.js';

export class File {
    getAll = async (req, res) => {

        try {
            let files = await getAllFiles();
            res.send(files);

        } catch (error) {
            console.error('there was an error:', error.message);
            res.status(500).send(error.message);
        }
    };

    getById = async (req, res) => {

        try {
            const fileId = req.params.fileId;
            let file = await getFilesById(fileId);
            res.send(file);

        } catch (error) {
            console.error('there was an error:', error.message);
            res.status(500).send(error.message);
        }
    };

    
    add = async (req, res) => {

        try {
            let newFile = req.body;
            console.log(newFile);//delete
            //  add validate
            let files = await addFile(newFile);
            res.send(files);

        } catch (error) {
            console.log('there was an error:', error.message);
            res.status(500).send(error.message);
        }
    }

    update = async (req, res) => {
        try {
            const fileId = req.params.fileId;
            let updatedFile = req.body;  
            let updatedFiles = await updateFile(fileId, updatedFile); 
            res.send(updatedFiles);
        } catch (error) {
            console.log('There was an error:', error.message);
            res.status(500).send(error.message);
        }
    }

    delete = async (req, res) => {
        try {
            const fileId = req.params.fileId;
            let result = await deleteFile(fileId); 
            if (result.success) {
                res.send({ message: `File with id ${fileId} deleted successfully` });
            } else {
                res.status(500).send({ error: 'Failed to delete file' });
            }
        }
        catch (error) {
            console.log('There was an error:', error.message);
            res.status(500).send(error.message);
        }
    };
}
