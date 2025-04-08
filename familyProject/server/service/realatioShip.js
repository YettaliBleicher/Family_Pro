import { getOutsideQuery } from './query.js'

const getAllRealationShip = async () => {
    try {
        const query = `
        SELECT relationShipType FROM realationShips;
    `;
    let realationShips = await getOutsideQuery(query);
    return realationShips;

    } catch (error) {
        console.error('Error executing query:', error);
        return null; // או לזרוק שגיאה לפי הצורך
    }
};

const getRealationShipId = async (realationShipType) => {
    try {
        const query = `
        SELECT realationShipId FROM realationShips WHERE realationShipType = '${realationShipType}';
    `;
        let result = await getOutsideQuery(query);
        if(result[0][0].realationShipId!=0)
            return result[0][0].realationShipId;
        return null;

    } catch (error) {
        console.error('Error executing query:', error);
        return null; // או לזרוק שגיאה לפי הצורך
    }
};

export {getAllRealationShip, getRealationShipId };
