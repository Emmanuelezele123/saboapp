const User = require('../models/user')
const crypto = require('crypto')
const Token = require('../models/token')
const bcrypt = require('bcrypt')
const sendEmail = require('../helpers/sendEmail')
require("dotenv").config()
const expiryDate = process.env.EXPIRY_DATE
const { createToken } = require('../helpers/jwtService')

exports.registerNewUser = (req, res) => {
    // fetch users details from req.body
    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) {
            return res.status(500).json({ err })
        }
        // check if a user with this username exists
        if (existingUser) {
            return res.status(400).json({ message: 'a user with this email already exists' })
       }

    


        // create a new user
        User.create({
            email: req.body.email
 }, (err, newUser) => {
            if (err) {
                return res.status(500).json(err.message)
            }
            // hash user's password
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    return res.status(500).json(err.message);
                }
                bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
                    if (err) {
                        return res.status(500).json(err.message);
                    }
                    // save password to database
                    newUser.password = hashedPassword
                    newUser.save((err, savedUser) => {
                        if (err) {
                            return res.status(400).json({ err });
                        }
                        // create jwt for user
                        let token = createToken(newUser)
                        if (!token) {
                            return res.status(500).json({ message: "sorry, we could not authenticate you, please login" })
                        }
                        // send token to user
                        return res.status(200).json({
                            success: true,
                            message: "New sabo user added",
                            token : token
                        })
                    })
                })
            })
        })
    })
}

exports.loginUser = (req, res) => {
    // check if user exists
    User.findOne({ email: req.body.email }, (err, foundUser) => {
        if (err) {
            return res.status(500).json({ err })
        }
        if (!foundUser) {
            return res.status(401).json({ message: "incorrect email" })
        }
        // check if password is correct
        let match = bcrypt.compareSync(req.body.password, foundUser.password)
        if (!match) {
            return res.status(401).json({ message: "incorrect password" })
        }
        // create a token
        let token = createToken(foundUser)
        if (!token) {
            return res.status(500).json({ message: "sorry, we could not authenticate you, please login" })
        }
        //set token to cookie
        // send token to user
        return res.status(200).json({
            success: true,
            message: "sabo USER LOGGED IN",
            token:token
        })

    }) 
}

exports.resetPassword = async (req, res) => {
    const { email } = req.body
    try {

        const user = await User.findOne({ email: email });
        if (!user)
            return res.status(400).send("user with given email doesn't exist");

        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const link = `${process.env.BASE_URL}/auth/passwordReset/${user._id}/${token.token}`;
        sendEmail(user.email, "Password reset", link,res)
       
       
        
    } catch (error) {
        console.log(error.message)
       // res.status(500).send("An error occured");
    }



}

exports.changePassword = async (req, res) => {
    try {

        const user = await User.findById(req.params.userId);
        if (!user) return res.status(401).send("wrong user");

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(402).send("Invalid link or expired");

        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return res.status(403).send(err.message);
            }
            bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
                if (err) {
                    return res.status(404).send(err.message);
                }

                user.password = hashedPassword;
                 user.save();
                token.delete();

                res.json({status:"Success",message:"Password has been changed"})
            })
        })
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
}



