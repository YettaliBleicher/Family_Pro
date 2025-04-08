import { getAllFamilyMembers, getFamilyMembersById, getFamilyMemberBiographyById, addFamilyMember, updateFamilyMember, deleteFamilyMember } from '../service/familyMember.js';

export class FamilyMember {
    getAll = async (req, res) => {

        try {
            let familyMembers = await getAllFamilyMembers();
            res.send(familyMembers);

        } catch (error) {
            console.error('there was an error:', error.message);
            res.status(500).send(error.message);
        }
    };

    getById = async (req, res) => {

        try {
            
            const familyMemberId1 = req.params.familyMemberId;
            let familyMembers = await getFamilyMembersById(familyMemberId1);
            res.json(familyMembers);

        } catch (error) {
            console.error('there was an error:', error.message);
            res.status(500).send(error.message);
        }
    };

    getBiographyById = async (req, res) => {

        try {
            const familyMemberId1  = req.params.familyMemberId; // מניחים שיש לך את ה-ID של המשפחה מהמשתמש

            console.log("familyMemberId1 - - - controller  "+familyMemberId1);

            // const familyMemberId1 = req.params.familyMemberId;
            let biography = await getFamilyMemberBiographyById(familyMemberId1);
            res.json(biography);

        } catch (error) {
            console.error('there was an error:', error.message);
            res.status(500).send(error.message);
        }
    };

    add = async (req, res) => {

        try {

            let newFamilyMember = req.body;
            console.log('Request body:', req.body);

            //  add validate
            let familyMember = await addFamilyMember(newFamilyMember);
            // אם הוספת ההורים הצליחה, נחזיר את המידע החדש
            if (familyMember && familyMember.error !== "err") {
                res.status(201).send(familyMember); // החזרת המידע של איש המשפחה החדש
            } else {
                res.status(400).send({ error: "Failed to add family member" });
            }

        } catch (error) {
            console.log('there was an error:', error.message);
            res.status(500).send(error.message);

        }
    }

    update = async (req, res) => {
        try {
            console.log("server!");
            let familyMemberId = req.params.familyMemberId;
            let updatedFamilyMember = req.body;

            console.log(updatedFamilyMember);

            let updatedFamilyMembers = await updateFamilyMember(familyMemberId, updatedFamilyMember);

            if(updatedFamilyMembers.error==true){
                res.json({message: `${updatedFamilyMembers.message}`})
                return;
            }

            console.log(updatedFamilyMembers);
            res.send(updatedFamilyMembers);
        } catch (error) {
            console.log('There was an error:', error.message);
            res.status(500).send(error.message);
        }
    }

    delete = async (req, res) => {
        try {
            const familyMemberId = req.params.familyMemberId;
            console.log(`Deleting family with id: ${familyMemberId}`);
            let result = await deleteFamilyMember(familyMemberId);
            console.log(result);
            if (result.success) {
                res.send({ message: `Family with id ${familyMemberId} deleted successfully` });
            } else {
                res.status(500).send({ error: 'Failed to delete family' });
            }
        } catch (error) {
            console.log('There was an error:', error.message);
            res.status(500).send(error.message);
        }
    };
}
