require('dotenv').config(); 
const express = require('express'); 
const session = require('express-session');
const massive = require('massive');  
const authCtrl = require('./controllers/authController'); 
const treasureCtrl = require('./controllers/treasureController');
const auth = require('./middleware/authMiddleware') 

const PORT = 4000; 

const {CONNECTION_STRING, SESSION_SECRET} = process.env; 

const app = express(); 
app.use(express.json()); 

app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}))

massive(CONNECTION_STRING).then(db => {
    console.log('connected to db')
    app.set('db', db);
});

// register
app.post('/auth/register', authCtrl.register)
//login 
app.post('/auth/login', authCtrl.login)
//logout
app.get('/auth/logout', authCtrl.logout)

// get dragon treasure 
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
//get user treasure 
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
//get my treasure 
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)
//get all treasure
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)


app.listen(PORT, console.log(`listening on port ${PORT}`))