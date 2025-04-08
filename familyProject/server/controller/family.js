// // import { readFile, writeFile } from 'node:fs/promises';
// import { addFamily, getFamilies, updateFamily, deleteFamily } from '../service/family.js';

// export class Family {
//     getAll = async (req, res) => {

//         try {
//             let families = await getFamilies();
//             res.send(families);

//         } catch (error) {
//             console.error('there was an error:', error.message);
//             res.status(500).send(error.message);
//         }
//     };

//     add = async (req, res) => {

//         try {
//             let newFamily = req.body;
//             //  add validate
//             let families = await addFamily(newFamily);
//             res.send(families);

//         } catch (error) {
//             console.log('there was an error:', error.message);
//             res.status(500).send(error.message);

//         }
//     }

//     update = async (req, res) => {
//         try {
//             const familyId = req.params.familyId;
//             let updatedFamily = req.body;  
//             let updatedFamilies = await updateFamily(familyId, updatedFamily); 
//             res.send(updatedFamilies);
//         } catch (error) {
//             console.log('There was an error:', error.message);
//             res.status(500).send(error.message);
//         }
//     }

//     delete = async (req, res) => {
//         try {
//             const familyId = req.params.familyId;
//             let result = await deleteFamily(familyId); 
//             if (result.success) {
//                 res.send({ message: `Family with id ${familyId} deleted successfully` });
//             } else {
//                 res.status(500).send({ error: 'Failed to delete family' });
//             }
//         } catch (error) {
//             console.log('There was an error:', error.message);
//             res.status(500).send(error.message);
//         }
//     };
// }


// import { readFile, writeFile } from 'node:fs/promises';
import { addFamily, getFamilies, updateFamily, deleteFamily,getFamilyId } from '../service/family.js';

export class Family {
    getAll = async (req, res) => {

        try {
            let families = await getFamilies();
            res.send(families);

        } catch (error) {
            console.error('there was an error:', error.message);
            res.status(500).send(error.message);
        }
    };

    getByPassword = async (req, res) => {

        try {
            const familyPassword = req.params.familyPassword;
            let family = await getFamilyId(familyPassword);

            if (family.error == true) {
                res.json({ message: `${family.message}` });
                return;
            }
            console.log("family///////"+family)
            res.json({ familyId: family });

        } catch (error) {
            console.error('there was an error:', error.message);
            res.status(500).send(error.message);
        }
    };

    add = async (req, res) => {

        try {
            let newFamily = req.body;
            console.log("newFamily = "+newFamily.familyPassword)
            //  add validate
            let result = await addFamily(newFamily);
            console.log("controller result = "+result)

            if (result.error == true) {
                console.log("  סיסמה קיים כבר!!!!!")
              
                res.json({ message: `${result.message}` });
                
                return;
            }

            // res.json({ message: "User created successfully" });

            // return result;
            res.send(result);

        } catch (error) {
            console.log('there was an error:', error.message);
            res.status(500).send(error.message);

        }
    }

    update = async (req, res) => {
        try {
            const familyId = req.params.familyId;
            let updatedFamily = req.body;  
            let updatedFamilies = await updateFamily(familyId, updatedFamily); 
            res.send(updatedFamilies);
        } catch (error) {
            console.log('There was an error:', error.message);
            res.status(500).send(error.message);
        }
    }

    delete = async (req, res) => {
        try {
            const familyId = req.params.familyId;
            let result = await deleteFamily(familyId); 
            if (result.success) {
                res.send({ message: `Family with id ${familyId} deleted successfully` });
            } else {
                res.status(500).send({ error: 'Failed to delete family' });
            }
        } catch (error) {
            console.log('There was an error:', error.message);
            res.status(500).send(error.message);
        }
    };
}
