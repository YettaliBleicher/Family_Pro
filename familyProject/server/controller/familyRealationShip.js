import { getAllFamilyRealationShip, getFamilyRealationShipById, addFamilyRealationShip, deleteFamilyRealationShip } from '../service/familyRealationShip.js';

export class FamilyRealationShip {

    getAll = async (req, res) => {

        try {
            let familyRealationShip = await getAllFamilyRealationShip();
            res.send(familyRealationShip);

        } catch (error) {
            console.error('there was an error:', error.message);
            res.status(500).send(error.message);
        }
    };


    getById = async (req, res) => {

        try {
            const familyMemberId = req.params.familyMemberId;
            let familyRealationShip = await getFamilyRealationShipById(familyMemberId);
            res.send(familyRealationShip);

        } catch (error) {
            console.error('there was an error:', error.message);
            res.status(500).send(error.message);
        }
    };


    // add = async (req, res) => {

    //     try {
    //         let newFamilyRealationShip = req.body;
    //         //  add validate
    //         let familieRealationShips = await addFamilyRealationShip(newFamilyRealationShip);
    //         res.send(familieRealationShips);

    //     } catch (error) {
    //         console.log('there was an error:', error.message);
    //         res.status(500).send(error.message);

    //     }
    // }

    add = async (req, res) => {
        try {
            let newFamilyRealationShip = req.body;
            //  add validate
            let familieRealationShips = await addFamilyRealationShip(newFamilyRealationShip);
            
            if (familieRealationShips.error) {
                return res.status(500).send(familieRealationShips.error);
            }
    
            res.send(familieRealationShips);
        } catch (error) {
            console.log('there was an error:', error.message);
            res.status(500).send(error.message);
        }
    }

    delete = async (req, res) => {
        try {
            const familyRealationShipId = req.params.familyMemberId;
            deleteFamilyRealationShip(familyRealationShipId)
            res.send({ message: `FamilyRelationShip with id ${familyRealationShipId} deleted successfully` });
        } catch (error) {
            console.log('There was an error:', error.message);
            res.status(500).send(error.message);
        }
    };
}