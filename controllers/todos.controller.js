const { db } = require('../config/database')

module.exports = {
    addtask: (req, res, next) => {
     const body = req.body;
     body.completed = false;
        let sql = `INSERT INTO todos SET ?`;
        db.query(sql, body, (err, results) => {
            if(err) {
           return res.status(500).json({message: "Sorry an error occured... try again"});
            }
            return res.status(200).json({message: "Task added succesfully"})
        })
    },

    gettodos: (req, res, next) => {
               let sql = `SELECT id, task, date, time, completed FROM todos WHERE user_id = ${req.params.user_id}`;
               db.query(sql, (err, results) => {
                   if(err) {
                  return res.status(500).json({message: "Sorry an error occured... try again"});
                   }
                   return res.status(200).json({result: results})
               })
           },
    deleteTask: (req, res, next) => {
        let sql = `DELETE FROM todos WHERE id = ${req.params.id}`
        db.query(sql, (err, results) => {
            if (err) {
                console.log(err)
            } else {
                return res.json({
                    success: 1,
                    message: 'deleted succesfully'
                })
            }
        })
    },
    mark: (req, res, next) => {
        body = req.body
        let sql = `UPDATE todos SET completed = ${body.completed} WHERE id = ${req.params.id}`
        db.query(sql, body, (err, results) => {
            if (err) {
                console.log(err)
            } else {
                return res.json({
                    success: 1,
                    result: results,
                    message: 'Marked as done'
                })
            }
        }) 
    }
 }