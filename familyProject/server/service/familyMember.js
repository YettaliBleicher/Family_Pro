import connectToDatabase from './database.js';
import { getOutsideQuery, insertQuery, updateQuery, getOutsideQueryNonReturn, deleteQuery, insertQueryWithOutput } from '../service/query.js'
import { getGenderId } from '../service/gender.js'
import { getStatusId } from '../service/status.js'
import { getFamilyId } from '../service/family.js'


const getAllFamilyMembers = async (limit, start, sort) => {
    try {

        const query = `
            SELECT 
                fm.familyMemberId,
                fm.firstName,
                fm.lastName,
                fm.birthDate,
                fm.deathDate,
                fm.youthName,
                fm.biography,
                g.genderType AS gender,
                fm.photoPath,
                s.statusType AS status,
                f.familyPassword,
                fm.isAlive,
                fm.birthCountry
            FROM 
                familyMembers fm
            LEFT JOIN 
                genders g ON fm.genderId = g.genderId
            LEFT JOIN 
                statuses s ON fm.statusId = s.statusId
            LEFT JOIN 
                families f ON fm.familyId = f.familyId;
        `;
        let familyMembers = await getOutsideQuery(query);
        return familyMembers;
    } catch (err) {
        console.error('Query failed! Error:', err);
        return [];
    }
};

const getFamilyMembersById = async (familyMemberId) => {
    try {
        const query = `
            SELECT 
                fm.familyMemberId,
                fm.firstName,
                fm.lastName,
                fm.birthDate,
                fm.deathDate,
                fm.youthName,
                fm.biography,
                g.genderType AS gender,
                fm.photoPath,
                s.statusType AS status,
                f.familyPassword,
                fm.isAlive,
                fm.birthCountry
            FROM 
                familyMembers fm
            LEFT JOIN 
                genders g ON fm.genderId = g.genderId
            LEFT JOIN 
                statuses s ON fm.statusId = s.statusId
            LEFT JOIN 
                families f ON fm.familyId = f.familyId
            WHERE fm.familyMemberId = ${familyMemberId};
        `;

        let familyMembers = await getOutsideQuery(query);
        return familyMembers;
    } catch (err) {
        console.error('Query failed! Error:', err);
        return [];
    }
};

const getFamilyMemberBiographyById = async (familyMemberId) => {
    try {
        console.log("service---- " + familyMemberId);

        const query = `
            SELECT biography
            FROM familyMembers
            WHERE familyMemberId = ${familyMemberId};
        `;
        let familyMembers = await getOutsideQuery(query);
        return familyMembers;
    } catch (err) {
        console.error('Query failed! Error:', err);
        return [];
    }
};

const addFamilyMember = async (newFamilyMember) => {
    try {
        let nameValues = "";
        let values = "";
        for (const key in newFamilyMember) {
            nameValues += key + ',';
            if (typeof newFamilyMember[key] === "string")
                values += `'${newFamilyMember[key]}',`;
            else
                values += newFamilyMember[key] + ',';
        }
        nameValues = nameValues.slice(0, -1);
        values = values.slice(0, -1);

        let familyMember = await insertQueryWithOutput("familyMembers", nameValues, "familyMemberId", values);
        return { id: familyMember[0].familyMemberId, ...newFamilyMember }; // הנחה שהשאילתא מחזירה מערך עם אובייקטים
    } catch (err) {
        console.error('Query Error:', err);
        return { error: "err" };
    }
};

const checkIfIdExists = async (id) => {
    try {
        console.log("id" + id);
        const foundedId = await getOutsideQuery(`SELECT * FROM familyMembers WHERE familyMemberId='${id}'`);
        console.log("users check password:", id); // הדפס את התוצאות לבדיקה
        return foundedId.length > 0; // מחזיר true אם יש חבר משפחה עם המזהה הזה
    } catch (err) {
        console.error('Error checking id:', err);
        throw new Error('Database error');
    }
}

const updateFamilyMember = async (familyMemberId, updatedFamilyMember) => {

    const idExists = await checkIfIdExists(familyMemberId);
    console.log("idExists--- "+idExists);
    if (!idExists) {
        console.log("Id isnt exists");
        return { error: true, message: "Id isnt exists" };
    }

    console.log("updateFamilyMember");
    try {
        let updateF = "";
        for (const key in updatedFamilyMember) {
            if (typeof updatedFamilyMember[key] === "string") {
                updateF += `${key} = '${updatedFamilyMember[key]}', `;
            } else {
                updateF += `${key} = ${updatedFamilyMember[key]}, `;
            }
        }
        updateF = updateF.slice(0, -2);
        let familyMember = await updateQuery("familyMembers", updateF, "familyMemberId", familyMemberId);
        return familyMember;
    } catch (err) {
        console.error('Query Error:', err);
        return { "error": "err" };
    }
};

const deleteFamilyMember = async (familyMemberId) => {
    console.log("deleteFamily");
    try {
        let familyMember = await deleteQuery("familyMembers", "familyMemberId", familyMemberId);
        console.log(familyMember);
        return familyMember;
    } catch (err) {
        console.error('Query Error:', err);
        return { "error": "err" };
    }
};

export { getAllFamilyMembers, getFamilyMembersById, getFamilyMemberBiographyById, addFamilyMember, updateFamilyMember, deleteFamilyMember }
