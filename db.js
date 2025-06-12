import mysql from 'mysql2/promise';
import keys from '.config/keys.js';

async function createConnection() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: keys.password,
        database: 'shop_online'
    });
    return connection;
}

const connection = await createConnection();
export default connection;

