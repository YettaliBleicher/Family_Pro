import { getAllGender } from '../service/gender.js';

export class Gender {
    getAll = async (req, res) => {

        try {
            let genders = await getAllGender();
            res.send(genders);

        } catch (error) {
            console.error('there was an error:', error.message);
            res.status(500).send(error.message);
        }
    };
}