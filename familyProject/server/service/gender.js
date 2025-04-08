import { getOutsideQuery } from './query.js'

const getAllGender = async () => {
    try {
        const query = `
        SELECT genderType FROM genders;
    `;
    let genders = await getOutsideQuery(query);
    return genders;

    } catch (error) {
        console.error('Error executing query:', error);
        return null; // או לזרוק שגיאה לפי הצורך
    }
};

const getGenderId = async (genderType) => {
    try {
        const query = `
        SELECT genderId FROM genders WHERE genderType = '${genderType}';
    `;
        let result = await getOutsideQuery(query);
        if(result[0][0].genderId!=0)
            return result[0][0].genderId;
        return null;

    } catch (error) {
        console.error('Error executing query:', error);
        return null; // או לזרוק שגיאה לפי הצורך
    }
};

export {getAllGender, getGenderId };
