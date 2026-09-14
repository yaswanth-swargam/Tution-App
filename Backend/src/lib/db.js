import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: process.env.NODE_ENV === 'production'
        ? {
            ca: process.env.DB_SSL_CA,
            rejectUnauthorized: true
        }
        : undefined,

    waitForConnections: true,
    connectionLimit: 10,
})

export default pool