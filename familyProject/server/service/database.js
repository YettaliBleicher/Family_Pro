import sql from 'mssql';

const config = {
    user: 'tamar1',
    password: 'Ta2005may',
    // server: 'zz-sql',
    server: 'DESKTOP-SSNMLFD',
    database: 'family_Yettali_tami',
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

const connectToDatabase = async () => {
    try {
        let pool = await sql.connect(config);
        return pool;
    } catch (err) {
        console.error('Database connection failed! Error:', err);
        throw err;
    }
};

export default connectToDatabase;
