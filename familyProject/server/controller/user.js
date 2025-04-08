import validator from 'validator';
import { getUsers, getUserById, addUser, logInService, updateUser, deleteUser, getUserByFamilyId, generateToken } from '../service/user.js';
function isHebrewOrEnglish(input) {
    return /^[א-ת ]+$/.test(input) || /^[a-zA-Z ]+$/.test(input);
}

export class User {
    getAll = async (req, res) => {
        console.log("in controller");
        try {

            let users = await getUsers();
            console.log(users[0].firstName);
            console.log("users controller === " + users);

            res.send(users);

        } catch (error) {
            console.error('there was an error:', error.message);
            res.status(500).send(error.message);
        }
    };

    getById = async (req, res) => {

        try {
            const userId = req.params.userId;
            let user = await getUserById(userId);
            res.send(user);

        } catch (error) {
            console.error('there was an error:', error.message);
            res.status(500).send(error.message);
        }
    };

    getByFamilyId = async (req, res) => {
        console.log("in controller");
        try {
            const familyId = req.params.familyId;
            let user = await getUserByFamilyId(familyId);
            console.log("in controler after service user=== " + user);
            res.send(user);

        } catch (error) {
            console.error('there was an error:', error.message);
            res.status(500).send(error.message);
        }
    };

    add = async (req, res) => {
        try {

            console.log("Request body:", req.body); // בדיקה של תוכן הבקשה
            const newUser = req.body;

            if (!validator.isEmail(newUser.email)) {
                return res.status(400).json({ error: 'כתובת אימייל אינה תקינה' });
            }

            if (!validator.isLength(newUser.userPassword, { min: 8, max: 8 })) {
                return res.status(400).json({ error: 'סיסמה חייבת להכיל 8 תווים' });
            }

            if (!isHebrewOrEnglish(newUser.firstName)) {
                return res.status(400).json({ error: 'שם לא מכיל אותיות' });
            }
            if (!isHebrewOrEnglish(newUser.lastName)) {
                return res.status(400).json({ error: 'שם לא מכיל אותיות' });
            }
            console.log("i am here!" + newUser)
            const result = await addUser(newUser);
            console.log("result----!" + result);
            console.log("result.error----" + result.error);

            if (result.error == true) {
                res.json({ message: `${result.message}` });
                return;
            }

            res.json(result);
            return;
        } catch (error) {
            console.log('Error in add controller:', error);
            res.status(500).json({ message: "Server error" });
        }
    };

    logIn = async (req, res) => {
        try {
            console.log("Request body:", req.body); // בדיקה של תוכן הבקשה
            const user = req.body;

            console.log("i am here!" + user)
            const result = await logInService(user);
            console.log("result----!" + result);
            console.log("result.error----" + result.error);

            if (result.error == true) {
                res.json({ message: `${result.message}` });
                return;
            }

            res.json(result);
            return;
        } catch (error) {
            console.log('Error in add controller:', error);
            res.status(500).json({ message: "Server error" });
        }
    };


    update = async (req, res) => {
        try {
            const email = req.params.email;
            console.log("in controller email= " + email)

            let updatedUser = req.body;
            if (updatedUser.userPassword != undefined) {
                if (!validator.isLength(updatedUser.userPassword, { min: 8, max: 8 })) {
                    return res.status(400).json({ error: 'סיסמה חייבת להכיל 8 תווים' });
                }
            }
            if (updatedUser.firstName != undefined) {
                if (!isHebrewOrEnglish(updatedUser.firstName)) {
                    return res.status(400).json({ error: 'שם צריך להכיל אותיות בלבד' });
                }
            }
            if (updatedUser.lastName != undefined) {
                if (!isHebrewOrEnglish(updatedUser.lastName)) {
                    return res.status(400).json({ error: 'שם צריך להכיל אותיות בלבד' });
                }
            }



            console.log("controller updatedUser= " + JSON.stringify(updatedUser));
            let updatedUsers = await updateUser(email, updatedUser);
            console.log(updatedUsers)
            if (updatedUsers.error == true) {
                res.json({ message: `${updatedUsers.message}` });
                return;
            }

            res.json(updatedUsers);
        } catch (error) {
            console.log('There was an error:', error.message);
            res.status(500).send(error.message);
        }
    }

    delete = async (req, res) => {
        try {
            const userId = req.params.userId;
            let result = await deleteUser(userId);
            if (result.success) {
                res.send({ message: `User with id ${userId} deleted successfully` });
            } else {
                res.status(500).send({ error: 'Failed to delete user' });
            }
        } catch (error) {
            console.log('There was an error:', error.message);
            res.status(500).send(error.message);
        }
    };

    // route שמחזיר מידע מוגבל בלבד לקליינט
    getUserDataFromTOken = (req, res) => {
        const user = req.user;
        console.log("inn controller  " + JSON.stringify(user))
        const familyId = user.familyId;
        const isManager = user.isManager;
        const firstName = user.firstName
        const lastName = user.lastName;
        const email = user.email;
        res.json({ familyId, isManager, firstName, lastName, email });
    };

}