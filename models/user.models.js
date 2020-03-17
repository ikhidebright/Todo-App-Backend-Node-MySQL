const { db } = require('../config/database')

module.exports = {
    getUserLogin: (body, callBack) => {
      let sql = `select * from users where email = email AND password = password`
        db.query(sql, (error, results) => {
            if (error) {
             return callBack(error);
            }
            return callBack(null, results[0]);
          }
        );
      },
}