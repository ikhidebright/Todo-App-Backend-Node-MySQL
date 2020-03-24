require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express();
const morgan = require("morgan")
const { register, login, update, updatep } = require('./controllers/user.controller')
const { addtask, gettodos, deleteTask, mark } = require('./controllers/todos.controller')
const { db } = require('./config/database')


db.getConnection(function(err, connection) {
    if (err) throw err; // not connected!

      // Handle error after the release.
      if (connection) {
          console.log("database connected!!!")
      }
  });

app.use(morgan("dev"))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.post('/register', register)
app.post('/login', login)
app.post('/todo', addtask)
app.get('/todos/:user_id', gettodos)
app.get('/delete/:id', deleteTask)
app.put('/mark/:id', mark)
app.post('/update/:id', update)
app.post('/update/:id', updatep)

app.listen(process.env.PORT || 9000, () => {
    console.log("port started at port " + process.env.PORT || 9000)
})