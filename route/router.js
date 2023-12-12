const express = require('express')
const multer  = require('multer');
const os = require('os');
const router= express.Router();
const authentication_hellper= require('../middleware/authentication')
const userInfo_helper = require('../middleware/userinfo');
const firebaseHelper = require('../middleware/firebaseHelper')
const path = require('path');
const storage = multer.diskStorage({
  destination: os.tmpdir(),
  filename: function(req, file, callback) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    callback(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
router.get('/test',authentication_hellper.test)
router.post('/resister',authentication_hellper.resister)
router.post('/login',authentication_hellper.login)
router.get('/userInfo',authentication_hellper.verify_user,userInfo_helper.userData)
router.get('/success', authentication_hellper.google_login);
router.get('/error', (req, res) => res.send("error logging in"));
router.post('/file/upload',authentication_hellper.verify_user, upload.single('file'),firebaseHelper.uploadFileToFirebase);
router.get('/allUsers',authentication_hellper.verify_user,userInfo_helper.allUsers)
router.post('/addFollowersRequest',authentication_hellper.verify_user,userInfo_helper.addFollowersRequest)
router.get('/getFellowUser',authentication_hellper.verify_user,userInfo_helper.getFellowUser)


module.exports = router