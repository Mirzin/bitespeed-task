import { Pool } from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    ssl: {
    ca: fs.readFileSync(path.join('certs', 'ap-south-1-bundle.pem')).toString(),
  },
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
