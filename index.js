const express = require('express')
const app= express();
require('dotenv').config()
const db = require('./mongo_db_connection');
const router = require('./route/router');
const cors = require('cors');
const session = require('express-session');
const googleAuthHelper = require('./middleware/googleAuthHelper')

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use('/', router);
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));
app.use(googleAuthHelper.passport.initialize());
app.use(googleAuthHelper.passport.session());
var userProfile;
app.get('/auth/google', 
googleAuthHelper.passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
googleAuthHelper.passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('http://localhost:3000/loginCallback');
  });


db().then((res)=>{
  app.listen(process.env.PORT,()=>{
    console.log("listening on PORT "+ process.env.PORT);
    
  })

})

