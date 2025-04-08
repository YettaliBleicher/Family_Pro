import { getAllStatus } from '../service/status.js';

export class Status {
    getAll = async (req, res) => {

        try {
            let status = await getAllStatus();
            res.send(status);

        } catch (error) {
            console.error('there was an error:', error.message);
            res.status(500).send(error.message);
        }
    };
}