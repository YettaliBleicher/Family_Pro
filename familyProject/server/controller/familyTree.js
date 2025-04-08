import { getFamilyMembersByFamilyId,getRealationshipByFamilyId, addNewFamilyMember, getUsersOfFamily } from '../service/familyTree.js';

export class FamilyTreeController {
    // מקבל את העץ של המשתמש הנוכחי לפי familyId
    getFamilyMemberTree = async (req, res) => {
        try {
            const {familyId} = req.body; // מניחים שיש לך את ה-ID של המשפחה מהמשתמש
            console.log(" familyId- 0 - 0 - "+familyId);

            let familyMembers = await getFamilyMembersByFamilyId(familyId);
            res.json(familyMembers);
        } catch (error) {
            console.error('Error:', error.message);
            res.status(500).send(error.message);
        }
    };

    getRealationshipTree = async (req, res) => {
        try {
            const {familyId} = req.body; // מניחים שיש לך את ה-ID של המשפחה מהמשתמש
            let realationships = await getRealationshipByFamilyId(familyId);
            res.json(realationships);
        } catch (error) {
            console.error('Error:', error.message);
            res.status(500).send(error.message);
        }
    };

    // הוספת חבר משפחה חדש
    addFamilyMember = async (req, res) => {
        try {
            let newFamilyMember = req.body;
            let result = await addNewFamilyMember(newFamilyMember);
            res.send(result);
        } catch (error) {
            console.log('Error:', error.message);
            res.status(500).send(error.message);
        }
    };


    getAllUsersOfFamily = async (req, res) => {

        try {
            const {familyId} = req.body;
            console.log("familyId---"+familyId);
            let users = await getUsersOfFamily(familyId);
            res.send(users);

        } catch (error) {
            console.error('there was an error:', error.message);
            res.status(500).send(error.message);
        }
    };

}
