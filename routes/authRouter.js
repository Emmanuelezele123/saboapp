const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth");
const ProfileController = require("../controllers/profile");
const { authenticateUser } = require('../middlewares/authentication')

 router.post('/signup', AuthController.registerNewUser)


router.post('/login', AuthController.loginUser)


router.post('/passwordReset', AuthController.resetPassword)


router.post('/passwordReset/:userId/:token', AuthController.changePassword)

router.put("/completeprofile",authenticateUser,ProfileController.completeProfile)

router.get("/getProfile",authenticateUser,ProfileController.getProfile)

router.put("/setPin",authenticateUser,ProfileController.setPin)

router.post("/verifyPin",authenticateUser,ProfileController.verifyPin)

module.exports = router 
//2012-12-19