require('dotenv').config({path: './backend/.env'});
const pool = require('./backend/connections/db');

async function check() {
    try {
        const [tables] = await pool.query('SHOW TABLES');
        console.log('Tables:', tables.map(t => Object.values(t)[0]));
    } catch (e) {
        console.error('Error:', e.message);
    }
    process.exit();
}

check();
