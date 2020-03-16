const { db } = require('../config/database')

module.exports = {
    getUserLogin: (email, callback) => {
        let sql =  `SELECT * FROM users where email = ?`
        db.query(sql, email, (err, results) => {
            if(err) {
               return callback(err)
            }
            return callback(null, results[0])
        })
    }
}