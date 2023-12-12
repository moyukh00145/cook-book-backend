const userModel = require('../model/userModel')
const status = require('../model/statusModel')
const userData = (req,res)=>{
  userModel.current_user(req.authData.email).then((user)=>{
    if(user){
      const userData={
        user: {
          name: user.name,
          email: user.email,
          profile_pic_url: user.profile_pic_url
        }
      }
      res.send(userData)
    }
    else{
      res.send(status.sessonExpired)
    }  
  })  
}
const allUsers = (req,res)=>{
  userModel.getAllUsers(req.authData.email).then((userData)=>{
    res.send(userData)
  }).catch((err)=>{
    res.send(status.sessonExpired)
  })
}

const addFollowersRequest = (req, res) => {
  userModel.follow(req.body.requestTo,req.authData._id).then((result)=>{
    res.send(result)
  })
}

const getFellowUser = (req, res) => {
  userModel.followers(req.authData._id).then((result)=>{
    res.send(result)
  })
}

module.exports ={
  userData,
  allUsers,
  addFollowersRequest,
  getFellowUser
}