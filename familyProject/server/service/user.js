import { getQuery, insertQuery2, updateQuery, deleteQuery, getOutsideQuery } from '../service/query.js'
import jwt from 'jsonwebtoken'

// import dotenv from 'dotenv';
// dotenv.config();


const getUsers = async (email) => {
    console.log("in service");

    try {
        let users = await getQuery("users");
        return users;
    } catch (err) {
        console.error('Query failed! Error:', err);
        return [];
    } finally {

    }
};



const getUserById = async (userId) => {

    try {
        const query = `
        SELECT * FROM users WHERE userId = '${userId}';
    `;
        let result = await getOutsideQuery(query);
        console.log(result)
        return result

    } catch (error) {
        console.error('Error executing query:', error);
        return null; // או לזרוק שגיאה לפי הצורך
    }
};

const getUserByFamilyId = async (familyId) => {

    try {
        const query = `
        SELECT * FROM users WHERE familyId = '${familyId}' and isManager=0;
    `;
        let result = await getOutsideQuery(query);
        console.log(result)
        return result

    } catch (error) {
        console.error('Error executing query:', error);
        return null; // או לזרוק שגיאה לפי הצורך
    }
};

const checkIfEmailExists = async (email) => {
    try {
        console.log("email" + email);
        const user = await getOutsideQuery(`SELECT * FROM users WHERE email='${email}'`);
        console.log("users check email:", user); // הדפס את התוצאות לבדיקה
        if (user.length > 0) { // מחזיר true אם יש משתמשים עם המייל הזה
            return user;
        }
        else {
            return null;
        }
    } catch (err) {
        console.error('Error checking email:', err);
        throw new Error('Database error');
    }
}

const checkIfPasswordExists = async (password) => {
    try {
        console.log("password" + password);
        const user = await getOutsideQuery(`SELECT * FROM users WHERE userPassword='${password}'`);
        console.log("users check password:", user); // הדפס את התוצאות לבדיקה
        // return users.length > 0; // מחזיר true אם יש משתמשים עם המייל הזה
        if (user.length > 0) { // מחזיר true אם יש משתמשים עם המייל הזה
            return user;
        }
        else {
            return null;
        }
    } catch (err) {
        console.error('Error checking password:', err);
        throw new Error('Database error');
    }
}

const logInService = async (user) => {
    try {

        const emailExists = await checkIfEmailExists(user.email);
        console.log("emailE = " + JSON.stringify(emailExists));
        console.log("passUser = " + user.userPassword);
        console.log("passExis = " + emailExists[0].userPassword);
        console.log("check def:" + user.userPassword !== emailExists[0].userPassword)
        if (emailExists != null) {
            if (user.userPassword !== emailExists[0].userPassword)
                return { error: true, message: "סיסמא שגויה" };
            else {
                const token = generateToken(emailExists[0]);
                return token;
            }
        }
        else {
            return { error: true, message: "משתמש לא קיים במערכת" };
        }
    } catch (err) {
        console.error('Error checking password:', err);
        throw new Error('Database error');
    }
}

const addUser = async (newUser) => {
    try {
        // בדיקה אם המייל כבר קיים במערכת
        const emailExists = await checkIfEmailExists(newUser.email);
        if (emailExists != null) {
            return { error: true, message: "Email already exists" };
        }
        // בדיקה אם הסיסמה כבר קיימת במערכת
        const passwordExists = await checkIfPasswordExists(newUser.userPassword);
        if (passwordExists != null) {
            return { error: true, message: "Password already exists" };
        }

        let nameValues = "";
        let values = "";
        for (const key in newUser) {
            nameValues += key + ',';
            values += typeof newUser[key] === "string" ? `'${newUser[key]}',` : `${newUser[key]},`;
        }
        nameValues = nameValues.slice(0, -1);
        values = values.slice(0, -1);
        const result = await insertQuery2("users", nameValues, values);
        // return result;
        const token = generateToken(newUser);
        return token;
    } catch (err) {
        console.error('Error adding user:', err);
        throw new Error('Database error');
    }
};



const updateUser = async (email, updatedUser) => {
    try {
        console.log("updatedUser - - -"+JSON.stringify(updatedUser))
        if (updatedUser.userPassword != undefined) {
            const passwordExists = await checkIfPasswordExists(updatedUser.userPassword);
            if (passwordExists != null && `'${passwordExists[0].email}'` !== email) {
                return { error: true, message: "Password already exists" };
            }
        }

        let updateU = "";
        for (const key in updatedUser) {
            if (typeof updatedUser[key] === "string") {
                updateU += `${key} = '${updatedUser[key]}', `;
            }
            else
                if (typeof updatedUser[key] === 'boolean') {
                    if (updatedUser[key] == true)
                        updateU += ` ${key} = 1 ,`;
                    else
                        updateU += `${key} = 0 ,`;
                }
                else {
                    updateU += `${key} = ${updatedUser[key]}, `;
                }
        }
        updateU = updateU.slice(0, -2);
        let user = await updateQuery("users", updateU, "email", email);
        const query = `
        SELECT * FROM users WHERE email = ${email};
        `
        user = await getOutsideQuery(query);
        console.log("token 0"+JSON.stringify(user[0]));
        const token = generateToken(user[0]);
        return token;
    } catch (err) {
        console.error('Query Error:', err);
        return { "error": "err" };
    }
};


const deleteUser = async (userId) => {
    try {
        let user = await deleteQuery("users", "userId", userId);
        return user;
    } catch (err) {
        console.error('Query Error:', err);
        return { "error": "err" };
    }
};

const generateToken = (user) => {
    console.log("user in service "+ JSON.stringify(user))
    const privateKey = process.env.JWT_SECRET || 'JWT_SECRET';
    const data = { firstName: user.firstName, lastName: user.lastName, email: user.email, isManager: user.isManager, familyId: user.familyId };
    console.log("data in service "+JSON.stringify(data));
    const token = jwt.sign(data, privateKey, { expiresIn: '2h' });
    return token;
};


export { getUsers, getUserById, addUser, updateUser, deleteUser, getUserByFamilyId, generateToken, logInService }
