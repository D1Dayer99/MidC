'use strict';

const sqlite3 = require('sqlite3').verbose()

class DB {
    constructor(file) {
        this.db = new sqlite3.Database(file);
        this.createTable();
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS AuthUser(
            id integer PRIMARY KEY,
            username text UNIQUE,
            email text,
            password text
        )`
        return this.db.run(sql)
        
    }

    selectByUsername(username, callback) {
        return this.db.get(`SELECT * FROM AuthUser WHERE username = ?`, [username], function (err, row) {
            callback(err,row)
        })
    }

    insertUser(user, callback) {
        return this.db.run(`INSERT INTO AuthUser (username, password) VALUES (?,?,?)`,user,(err) => {callback(err)})
    }

}

module.exports = DB
