const { getUserLogin } = require('../models/user.models')
const { genSaltSync, hashSync, compareSync } = require("bcryptjs")
const { sign } = require('jsonwebtoken')
const { db } = require('../config/database')


module.exports = {
    register: (req, res, next) => {
     const body = req.body;
     const salt = genSaltSync(10);
     body.password = hashSync(body.password, salt)
        let sql = `INSERT INTO users SET ?`;
        db.query(sql, body, (err, results) => {
            if(err) {
           return res.status(500).json({message: "Sorry an error occured... try again"});
            }
            return res.status(200).json({message: "Registration successful!!"})
        })
    },
    login: (req, res, next) => {
       const body = req.body
       getUserLogin (body, (err, results) => {
            if(err) {
                return res.status(500).json({
                    message: 'An error occured'
                })
            }

            if(!results) {
             return  res.json({
                    success: 0,
                    message: "Incorrect Email or Password"
                })
            }
            const result = compareSync(body.password, results.password);
            if(result){
            results.password = undefined;
            const jsontoken = sign({result: results}, "qwu28", {
                expiresIn: "1h"
            });
           return res.json({
                success: 1,
                message: "login success",
                token: jsontoken,
                result: results
            });
        } else {
            return res.json({
                success: 0,
                message: "Incorrect Email or Password"
            })
    }
    })
},

update: (req, res, next) => {
    const body = req.body;
    let sql = `UPDATE users SET ? WHERE id = ${req.params.id}`
    db.query(sql, body, (err, results) => {
        if (err) {
            return console.log(err)
        } else {
            return res.json({
                success: 1,
                result: results,
                message: 'Profile updated succesfully'
            })
        }
    }) 
},

updatep: (req, res, next) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt)
    let sql = `UPDATE users SET ? WHERE id = ${req.params.id}`
    db.query(sql, body, (err, results) => {
        if (err) {
            return console.log(err)
        } else {
            return res.json({
                success: 1,
                result: results,
                message: 'Password updated succesfully'
            })
        }
    }) 
}
}