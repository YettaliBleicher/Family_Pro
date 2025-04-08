import { getOutsideQuery } from './query.js';

// קבלת כל חברי המשפחה של משתמש מסוים
const getFamilyMembersByFamilyId = async (familyId) => {
    try {

        const query = `
        SELECT 
            fm.familyMemberId, fm.firstName, fm.lastName, CONVERT(DATE, fm.birthDate) AS birthDate, 
            CONVERT(DATE, fm.deathDate) AS deathDate, fm.youthName, fm.biography, g.genderType AS gender, fm.photoPath, 
            s.statusType AS status, fm.isAlive, fm.birthCountry
        FROM familyMembers fm
        LEFT JOIN genders g ON fm.genderId = g.genderId
        LEFT JOIN statuses s ON fm.statusId = s.statusId
        WHERE fm.familyId = ${familyId};
        `;
        console.log(query);

        let familyMembers = await getOutsideQuery(query);
        return familyMembers;
    } catch (err) {
        console.error('Query failed! Error:', err);
        return [];
    }
};

const getRealationshipByFamilyId = async (familyId) => {
    try {
        const query = `
        SELECT fr.familyMemberId1, fr.familyMemberId2, r.relationshipType
        FROM familyRealationships fr
        JOIN realationships r ON fr.relationshipId = r.relationshipId
        JOIN familyMembers fm ON fr.familyMemberId1 = fm.familyMemberId
        WHERE fm.familyId = ${familyId};
        `;
        let realationships = await getOutsideQuery(query);
        return realationships;
    } catch (err) {
        console.error('Query failed! Error:', err);
        return [];
    }
};


const addNewFamilyMember = async (newMember) => {
    // הוספת חבר משפחה חדש
};


const getUsersOfFamily = async (familyId) => {
    try {
        const query = `
        SELECT * FROM users WHERE familyId = ${familyId} AND isManager = 1;
        `
        let result = await getOutsideQuery(query);
        console.log(result)
        return result
    } catch (err) {
        console.error('Query failed! Error:', err);
        return [];
    } finally {

    }
};

export { getFamilyMembersByFamilyId, getRealationshipByFamilyId, addNewFamilyMember, getUsersOfFamily };
