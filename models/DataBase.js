'use strict'
console.clear();
const mysql = require('mysql2/promise');
let db = {
    iNit: async function(){
        let conn = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "MySQL",
            database: "QuanLyKhachSan",
            multipleStatements: true
        });
        return conn;
    },
    nullisZero: (x)=>{
        if(x==null||x==undefined) {return 0;}
        else return x;
    }
} 
    
module.exports = db;