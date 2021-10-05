import mysql from 'mysql';
import dotenv from "dotenv";
dotenv.config();
const db = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PWD,
    database : process.env.DB_NAME
});

db.connect(function (err){
    if(err) throw err;
});

export default db;
