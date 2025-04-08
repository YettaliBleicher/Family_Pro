import { getOutsideQuery } from './query.js'

const getAllFileType = async () => {
    try {
        const query = `
        SELECT fileType FROM fileTypes;
    `;
    let fileTypes = await getOutsideQuery(query);
    return fileTypes;

    } catch (error) {
        console.error('Error executing query:', error);
        return null; // או לזרוק שגיאה לפי הצורך
    }
};


export {getAllFileType, /*getFileTypeId*/ };