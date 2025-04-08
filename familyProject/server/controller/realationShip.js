import { getAllRealationShip } from '../service/realatioShip.js';

export class RealationShip {
    getAll = async (req, res) => {

        try {
            let realationShips = await getAllRealationShip();
            res.send(realationShips);

        } catch (error) {
            console.error('there was an error:', error.message);
            res.status(500).send(error.message);
        }
    };
}