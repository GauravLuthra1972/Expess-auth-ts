import mysql from 'mysql2/promise'

const db = mysql.createPool({

    host: 'localhost',
    user: 'root',
    password: 'bababubu',
    database: 'Usersauth'
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASS,
    // database: process.env.DB_NAME 
})

export default db