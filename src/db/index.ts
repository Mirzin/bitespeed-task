import { Pool } from 'pg';

const pool = new Pool({
    user: 'node_app',
    host: 'localhost',
    database: 'bitespeed',
    password: 'password',
    port: 5432,
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    client?.query('SELECT NOW()', (err) => {
        release();
        if (err) {
            return console.error('Error executing query', err.stack);
        }
        console.log("Connected to Database!");
    });
});

export default pool;
