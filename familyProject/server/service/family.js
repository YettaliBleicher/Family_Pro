// import connectToDatabase from './database.js';
// import { getQuery, insertQuery, updateQuery, deleteQuery, getOutsideQuery } from './query.js'
// const colums = { "familyPassword": "string" };

// const getFamilies = async () => {
//     try {
//         let families = await getQuery("families");
//         return families;
//     } catch (err) {
//         console.error('Query failed! Error:', err);
//         return [];
//     } finally {

//     }
// };

// const getFamilyId = async (familyPassword) => {

//     try {
//         const query = `
//         SELECT familyId FROM families WHERE familyPassword = '${familyPassword}';
//     `;
//         let result = await getOutsideQuery(query);
//         if(result[0][0].familyId!=0)
//             return result[0][0].familyId;
//         return null;

//     } catch (error) {
//         console.error('Error executing query:', error);
//         return null; // או לזרוק שגיאה לפי הצורך
//     }

// };

// // const getFamilyId = async (familyId) => {

// //     try {
// //         const query = `
// //         SELECT * FROM families WHERE familyId = '${familyId}';
// //     `;
// //         let result = await getOutsideQuery(query);
// //         if (result[0][0].familyId != 0)
// //             return result[0][0].familyId;
// //         return null;

// //     } catch (error) {
// //         console.error('Error executing query:', error);
// //         return null; // או לזרוק שגיאה לפי הצורך
// //     }

// // };

// const addFamily = async (newFamily) => {
//     console.log("addFamily");
//     try {
//         let nameValues = "";
//         let values = "";
//         for (const key in newFamily) {
//             nameValues += key + ',';
//             if (typeof newFamily[key] === "string")
//                 values += `'${newFamily[key]}',`;
//             else
//                 values += newFamily[key] + ',';
//         }
//         nameValues = nameValues.slice(0, -1);
//         values = values.slice(0, -1);
//         let family = await insertQuery("families", nameValues, values);
//         return family;
//     } catch (err) {
//         console.error('Query Error:', err);
//         return { "error": "err" };
//     }
// };

// const updateFamily = async (familyId, updatedFamily) => {
//     try {
//         let updateF = "";
//         for (const key in updatedFamily) {
//             if (typeof updatedFamily[key] === "string") {
//                 updateF += `${key} = '${updatedFamily[key]}', `;
//             } else {
//                 updateF += `${key} = ${updatedFamily[key]}, `;
//             }
//         }
//         updateF = updateF.slice(0, -2);
//         let family = await updateQuery("families", updateF, "familyId", familyId);
//         return family;
//     } catch (err) {
//         console.error('Query Error:', err);
//         return { "error": "err" };
//     }
// };

// const deleteFamily = async (familyId) => {
//     try {
//         let family = await deleteQuery("families", "familyId", familyId);
//         return family;
//     } catch (err) {
//         console.error('Query Error:', err);
//         return { "error": "err" };
//     }
// };

// export { getFamilies, getFamilyId, addFamily, updateFamily, deleteFamily }


import { getQuery, insertQuery, updateQuery, deleteQuery, getOutsideQuery, insertQueryWithOutput } from './query.js'
const colums = { "familyPassword": "string" };

const getFamilies = async () => {
    try {
        let families = await getQuery("families");
        return families;
    } catch (err) {
        console.error('Query failed! Error:', err);
        return [];
    } finally {

    }
};

const getFamilyId = async (familyPassword) => {

    try {
        const query = `
        SELECT familyId FROM families WHERE familyPassword = '${familyPassword}';
    `;

        let result = await getOutsideQuery(query);

        if (result.length == 0)
            return { error: true, message: "סיסמת משפחה שגויה" };

        console.log("hiii  " + result[0].familyId)
        // if (result[0].familyId != 0)
        return result[0].familyId;
        // return null;

    } catch (error) {
        console.error('Error executing query:', error);
        return null; // או לזרוק שגיאה לפי הצורך
    }

};

// const getFamilyId = async (familyId) => {

//     try {
//         const query = `
//         SELECT * FROM families WHERE familyId = '${familyId}';
//     `;
//         let result = await getOutsideQuery(query);
//         if (result[0][0].familyId != 0)
//             return result[0][0].familyId;
//         return null;

//     } catch (error) {
//         console.error('Error executing query:', error);
//         return null; // או לזרוק שגיאה לפי הצורך
//     }

// };
const checkIfPasswordExists = async (password) => {
    try {
        console.log("password" + password);
        const family = await getOutsideQuery(`SELECT * FROM families WHERE familyPassword='${password}'`);
        console.log("family check password:", family); // הדפס את התוצאות לבדיקה
        return family.length > 0; // מחזיר true אם יש משתמשים עם המייל הזה
    } catch (err) {
        console.error('Error checking password:', err);
        throw new Error('Database error');
    }
}

const addFamily = async (newFamily) => {
    console.log("service addFamily");
    try {
        // בדיקה אם הסיסמה כבר קיימת במערכת
        const passwordExists = await checkIfPasswordExists(newFamily.familyPassword);
        console.log("check service passwordExists----" + passwordExists)
        if (passwordExists) {
            console.log("Password already exists");
            return { error: true, message: "Password already exists" };
        }
        console.log("after check password");


        let nameValues = "";
        let values = "";
        for (const key in newFamily) {
            nameValues += key + ',';
            if (typeof newFamily[key] === "string")
                values += `'${newFamily[key]}',`;
            else
                values += newFamily[key] + ',';
        }
        nameValues = nameValues.slice(0, -1);
        values = values.slice(0, -1);
        let family = await insertQueryWithOutput("families", nameValues, "familyId", values,);
        console.log("service familyId = " + family[0].familyId)
        return { id: family[0].familyId, ...newFamily };
    } catch (err) {
        console.error('Query Error:', err);
        return { "error": "err" };
    }
};

const updateFamily = async (familyId, updatedFamily) => {
    try {
        let updateF = "";
        for (const key in updatedFamily) {
            if (typeof updatedFamily[key] === "string") {
                updateF += `${key} = '${updatedFamily[key]}', `;
            } else {
                updateF += `${key} = ${updatedFamily[key]}, `;
            }
        }
        updateF = updateF.slice(0, -2);
        let family = await updateQuery("families", updateF, "familyId", familyId);
        return family;
    } catch (err) {
        console.error('Query Error:', err);
        return { "error": "err" };
    }
};

const deleteFamily = async (familyId) => {
    try {
        let family = await deleteQuery("families", "familyId", familyId);
        return family;
    } catch (err) {
        console.error('Query Error:', err);
        return { "error": "err" };
    }
};

export { getFamilies, getFamilyId, addFamily, updateFamily, deleteFamily }