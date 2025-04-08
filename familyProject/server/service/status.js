import { getOutsideQuery } from '../service/query.js'

const getAllStatus = async () => {
    try {
        const query = `
        SELECT statusType FROM statuses;
    `;
    let statuses = await getOutsideQuery(query);
    return statuses;

    } catch (error) {
        console.error('Error executing query:', error);
        return null; // או לזרוק שגיאה לפי הצורך
    }
};

const getStatusId = async (statusType) => {
    try {
        const query = `
        SELECT statusId FROM statuses WHERE statusType = '${statusType}';
    `;
        let result = await getOutsideQuery(query);
        if(result[0][0].statusId!=0)
            return result[0][0].statusId;
        return null;
    } catch (error) {
        console.error('Error executing query:', error);
        return null; // או לזרוק שגיאה לפי הצורך
    }

};


export {getAllStatus, getStatusId };