const db = require('../mongo_db_connection');
const { ObjectId } = require('mongodb');

var collection
var friendsCollection
var followersCollection

db().then((database)=>{
  collection = database.collection('users');
  friendsCollection = database.collection('friends');
  followersCollection = database.collection('followers');
})

const current_user = (email)=>{
  return new Promise((resolve, reject)=>{
    collection.findOne({email: email}).then((userdata)=>{resolve(userdata)})
  })
}

const getAllFriends = (email) =>{
  return new Promise((resolve, reject)=>{
    current_user(email).then((userdata)=>{
      friendsCollection.findOne({"_id": new ObjectId('656b45c28193e9508117cd2d')}).then((data)=>{
        const ar = data.friend_ids.map(item => new ObjectId(item));
        collection.find({"_id": {"$in": ar}}).toArray().then((friends)=>{
          resolve(friends);
        }).catch(err => {console.error(err.message)
          reject(err)
        }) 
        
      }).catch(err => {console.error(err.message)
        reject(err)
      }) 
    }).catch(err => {console.error(err.message)
      reject(err)
    }) 
    
  })
}
const getAllUsers = (email) =>{
  return new Promise((resolve, reject)=>{
    current_user(email).then((currentData)=>{
      followersCollection.findOne({user_id: currentData._id.toString()}).then((followers)=>{
        const alreadyFollower = followers.followers_list.map(item => new ObjectId(item))
        alreadyFollower.push(currentData._id)
        collection.find({_id:{ $nin: alreadyFollower }  },{ projection: { name: 1,profile_pic_url: 1 } }).toArray()
        .then((userdata)=>{resolve(userdata)})
        .catch(err => {console.error(err.message)
          reject(err)
        })

      })
      
    }).catch(err => {
      console.error(err.message)
      reject(err)
    })
  })
}

const follow = (requestTo,requestFrom)=>{

  return new Promise((resolve,reject)=>{
    followersCollection.findOne({user_id: requestTo}).then((result)=>{
      if(!result){
        followersCollection.insertOne({user_id: requestTo,followers_list: [requestFrom]})
        .then((followers)=>{
          if(followers){
            resolve(true)
          }
          else{
            resolve(true)
          }
        }).catch((error)=>{
          reject(error)
        })
      }
      else{
        followersCollection.updateOne({user_id: requestTo},{$push: { followers_list: requestFrom }})
        .then((followers)=>{
          if(followers){
            resolve(true)
          }
          else{
            resolve(true)
          }
        }).catch((error)=>{
          reject(error)
        })
      }
    }).catch((error)=>{
      reject(error)
    })
  })

}

const followers = (id) =>{
  return new Promise((resolve,reject)=>{
    followersCollection.findOne({user_id: id}).then((result)=>{
      if(result){
        const followersUser = result.followers_list.map(item => new ObjectId(item))
        collection.find({_id: {$in: followersUser}},{projection: {name:1,profile_pic_url:1, _id:1,}}).toArray().then((followUsers)=>{
          if(followUsers){
            resolve(followUsers)
          }
          else{
            resolve([])
          }
        }).catch((error)=>{
          reject(error)
        })
      }
      else{
        resolve([])
      }
    }).catch((error)=>{
      reject(error)
    })
  })
}



module.exports ={
  current_user,
  getAllUsers,
  getAllFriends,
  follow,
  followers
}