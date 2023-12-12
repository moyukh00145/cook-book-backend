const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const {getDownloadURL } = require('firebase-admin/storage');
const db= require('../mongo_db_connection')

const serviceAccount = require('../cook-book-405712-firebase-adminsdk-7bru7-1cb11a991f.json');

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'gs://cook-book-405712.appspot.com'
});

const bucket = getStorage().bucket();

const uploadFileToFirebase = (req,res)=>{
  const file = req.file;
  bucket.upload(file.path).then((fr)=>{
    const fileRef = bucket.file(fr[0].name)
    getDownloadURL(fileRef).then((url)=>{
      db().then((database)=>{
        const collection = database.collection('users');
        collection.findOne({email: req.authData.email}).then((result)=>{
          collection.updateOne({email:result.email},{$set: { profile_pic_url: url}})
        })
      })
      res.status(200).send({url: url});
    })
  })

}

module.exports = {
  uploadFileToFirebase
}