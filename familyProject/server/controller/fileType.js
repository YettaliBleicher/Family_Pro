import { getAllFileType } from '../service/fileType.js';

export class FileType {
    getAll = async (req, res) => {
        try {
            let fileType = await getAllFileType();
            res.send(fileType);

        } catch (error) {
            console.error('there was an error:', error.message);
            res.status(500).send(error.message);
        }
    };
}