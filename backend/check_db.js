require('dotenv').config();
const pool = require('./connections/db');

async function check() {
    try {
        const [tables] = await pool.query('SHOW TABLES');
        const tableList = tables.map(t => Object.values(t)[0]);
        console.log('Tables:', tableList);
        
        for (const table of tableList) {
            try {
                const [cols] = await pool.query(`DESCRIBE ${table}`);
                console.log(`Columns in ${table}:`, cols.map(c => c.Field));
            } catch (e) {
                console.log(`Could not describe ${table}:`, e.message);
            }
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
    process.exit();
}

check();
