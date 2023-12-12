const db = require('../mongo_db_connection');
const status = require('../model/statusModel')
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const saltRounds = 10

const resister = (req,res)=>{
  const user =  {
    email:req.body.email,
    password : req.body.password,
    name : req.body.name
  }
  
  db().then((database)=>{
    const collection = database.collection('users');
    collection.findOne({email: user.email}).then((result)=>{
      if(!result){
        bcrypt.hash(user.password, saltRounds)
              .then(hash => {
                  collection.insertOne({
                    name: user.name,
                    email: user.email,
                    password: hash
                  })
                  res.send(status.userCreated);
              })
              .catch(err => console.error(err.message))
        
      }
      else{
        res.send(status.userExists);
      }
    })
  })
}

const login = (req,res)=>{
  const param_user=req.body
  db().then((database)=>{
    const collection = database.collection('users');
    collection.findOne({email: param_user.email}).then((result)=>{
      if(result){
        matchPassword(param_user.password,result.password).then((match)=>{
          if(match){
            let token = generateToken(result);
            status.successfullyLogin['token']=token;
            res.send(status.successfullyLogin);
          }
          else{
            res.send(status.wrongCredentials);
          }
        })
        .catch((error)=>{
          console.log(error);
        })
      }
      else{
        res.send(status.invalidCredentials);
      }
    })   
  })
}

const test=(req,res)=>{
  res.status(200).send("hi")
}

function generateToken(data){
  const token = jwt.sign(data, process.env.JWT_SECRET,{expiresIn: "3600s"})
  return token
}

function verify_user(req,res,next){
  let preauthData=req.headers['authorization']
  if(preauthData!=undefined){
    const token = preauthData.split(" ")[1]
    jwt.verify(token,process.env.JWT_SECRET,(err,authData)=>{
      if(authData){
        req.authData = authData;
        next()
      }
      else{
        res.send(status.sessonExpired)
      }
    })
  } 
  else{
    res.send(status.sessonExpired)
  }
}

function matchPassword(real_password,hash_password){
  return new Promise((resolve, reject) =>{
    bcrypt
      .compare(real_password, hash_password)
      .then(res => {
         resolve(res)
      })
      .catch(err => {console.error(err.message)
        reject(err)
      }) 
  })
}

function matchId(providedId, resultId){
  return new Promise((resolve,reject)=>{
    if(providedId==resultId){
      resolve(true)
    }
    else{
      resolve(false)
    }
  })
}

const google_login=(req,res)=>{
  db().then((database)=>{
    const collection = database.collection('users');
    collection.findOne({email: userProfile.info.email}).then((result)=>{
      if(result && result.uid != undefined){
        let token = generateToken(result);
        matchId(userProfile.info.sub,result.uid).then((match)=>{
          if(match){
            status.successfullyLogin['token']=token;
            res.send(status.successfullyLogin);
          }
          else{
            res.send(status.wrongCredentials);
          }
        })
        .catch((error)=>{
          console.log(error);
        })
      }
      else if(result && result.uid == undefined){
        let token = generateToken(result);
        collection.updateOne({email:result.email},{$set: { uid: userProfile.info.sub}})
        status.successfullyLogin['token']=token;
        res.send(status.successfullyLogin);
      }
      else{
        const user_data={
          name:  userProfile.info.name,
          email: userProfile.info.email,
          uid: userProfile.info.sub,
          password: userProfile.token.accessToken,
          profile_pic_url: userProfile.info.picture
        }
        collection.insertOne(user_data).then((result)=>{
          if(result.acknowledged){
            let token = generateToken(user_data);
            status.successfullyLogin['token']=token;
            res.send(status.successfullyLogin);
          }
        })
        
      }
    })   
  })
}

module.exports = {
  resister, 
  test,
  verify_user,
  login,
  google_login
}