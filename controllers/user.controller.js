const { getUserLogin } = require('../models/user.models')
const { genSaltSync, hashSync, compareSync  } = require("bcryptjs")
const { sign } = require('jsonwebtoken')
const { db } = require('../config/database')


module.exports = {
    register: (req, res, next) => {
     const body = req.body;
     let checkEmail = `SELECT * FROM users where email = ?`
     db.query(checkEmail, body.email, (error, result, fields) => {
       if (error) {
         throw error
       }
       let usernameMatch = result.username === req.body.username;
       if (result.length > 0 && usernameMatch) {
         res
         .status(201)
         .json({
           message: `Sorry Username ${req.body.username} is taken`
         })
       } else if (result.length > 0) {
         res.json({
           message: `Sorry, this Email is already in use`
         })
       } else {
         //register user now
         const salt = genSaltSync(10);
         body.password = hashSync(body.password, salt)
            let sql = `INSERT INTO users SET ?`;
            db.query(sql, body, (err, results) => {
                if(err) {
                console.log(err)
               return res.status(500).json({
                 message: "Sorry an error occured... try again"
                });
                } else {
                  let user = {
                    id: results.insertId,
                    username: req.body.username,
                    email: req.body.email
                  }
                  const token = sign({ user: user }, process.env.TOKEN_SECRET, { expiresIn: 60 * 24 }); 
                  return res
                  .status(200)
                  .json({
                    token,
                    results,
                    user,
                    message: "Registration successful!!"
                  })
                }
            })
       }
     })
    },
    login: (req, res) => {
        const { email, password } = req.body;
        const userEmail = "SELECT * FROM users WHERE email = ?";
        db.query(userEmail, [email], (error, results, fields) => {
          if (error) {
            res.json({
              status: "error",
              message: "please debug me!!!"
            });
          } else {
            if (results.length > 0) {
              const match = compareSync(password, results[0].password);
              if (match) {
                const user = {
                  id: results[0].id,
                  username: results[0].username,
                  email: results[0].email
                }
                const token = sign({ user: user }, process.env.TOKEN_SECRET, { expiresIn: 60 * 24 });
                res
                  .status(201)
                  .json({
                    token,
                    status: "success",
                    message: "logged in!",
                    user
                  });
              } else {
                res.json({
                  status: "error",
                  message: "Email and password does not match"
                });
              }
            } else {
              res.json({
                status: "error",
                message: "Email does not exits"
              });
            }
          }
        });
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