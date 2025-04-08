import connectToDatabase from './database.js';
import {insertQuery,getOutsideQueryNonReturn, getOutsideQuery} from '../service/query.js'

const getAllFamilyRealationShip = async (limit, start, sort) => {
    try {

        const query = `
            SELECT * from familyRealationShips;
        `;
        let familyRealationShip = await getOutsideQuery(query);
        return familyRealationShip;
    } catch (err) {
        console.error('Query failed! Error:', err);
        return [];
    }
};

const getFamilyRealationShipById = async (familyMemberId) => {
    try {
        console.log(familyMemberId);
        const query = `
            SELECT * from familyRealationShips
            WHERE familyMemberId1 = ${familyMemberId} or familyMemberId2 = ${familyMemberId};
        `;

        console.log(query);

        let familyRealationShip = await getOutsideQuery(query);
        return familyRealationShip;
    } catch (err) {
        console.error('Query failed! Error:', err);
        return [];
    }
};


// const addFamilyRealationShip = async (newFamilyRealationShip) => {
//     console.log("addFamilyRealationShip");
//     try {
//         let nameValues = "";
//         let values = "";
//         for (const key in newFamilyRealationShip) {
//             nameValues += key + ',';
//             if (typeof newFamilyRealationShip[key] === "string")
//                 values += `'${newFamilyRealationShip[key]}',`;
//             else
//                 values += newFamilyRealationShip[key] + ',';
//         }
//         nameValues = nameValues.slice(0, -1);
//         values = values.slice(0, -1);
//         let familyRealationShip = await insertQuery("familyRealationships", nameValues, values);
//         return familyRealationShip;
//     } catch (err) {
//         console.error('Query Error:', err);
//         return { "error": "err" };
//     }
// };

const addFamilyRealationShip = async (newFamilyRealationShip) => {
    console.log("addFamilyRealationShip");
    try {
        let nameValues = "";
        let values = "";
        for (const key in newFamilyRealationShip) {
            nameValues += key + ',';
            if (typeof newFamilyRealationShip[key] === "string")
                values += `'${newFamilyRealationShip[key]}',`;
            else
                values += newFamilyRealationShip[key] + ',';
        }
        nameValues = nameValues.slice(0, -1);
        values = values.slice(0, -1);
        let familyRealationShip = await insertQuery("familyRealationships", nameValues, values);
        return familyRealationShip;
    } catch (err) {
        console.error('Query Error:', err);
        return { error: "Database error" }; // החזר שגיאה ברורה
    }
};

const deleteFamilyRealationShip = async (familyMemberId) => {
    try {
        const query = `DELETE FROM familyRealationships WHERE familyMemberId1 = ${familyMemberId}  or familyMemberId2 = ${familyMemberId} `;
        getOutsideQueryNonReturn(query);
        // let result = await getOutsideQuery(query);
        // return result;
    } catch (err) {
        console.error('Query Error:', err);
        return { "error": "err" };
    }
};
export{getAllFamilyRealationShip,getFamilyRealationShipById, addFamilyRealationShip, deleteFamilyRealationShip}