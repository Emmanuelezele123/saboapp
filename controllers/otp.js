const User = require('../models/user')
const Otp = require('../models/otp')
const sendEmail = require('../helpers/sendEmail')
require('dotenv').config()

const sendOtp = async (req,res) => {
  
    var otp = Math.floor(1000 + Math.random() * 9000);
    var otp = otp.toString()
    const newOtp = new Otp({ 
        userId: req.user.id,
        otpText: otp
       });
    newOtp.save((err, result) => {
        if (err) {
            console.log(err.message)
            console.error(err)
            res.json({Error:err.message})
        } else {
            sendEmail(req.user.email, "Otp verification Code for sabo app ", `Your verification code is ${otp}`,res,"code")
       
        }
    });
    }
    
const verifyOtp = async (req,res) => {
    const otp = req.body.otp
    try{   
        const otps = await Otp.findOne({ userId: req.user.id ,otpText :otp })
        if (otps) {
          
            Otp.deleteMany({ userId: req.user.id }, (err, result) => {
                if (err) {
                    console.log(err.message)
                    console.error(err)
                    res.json({ Error: err.message })
                } else {
                   
                 
                    return res.status(200).json({ status: "Your account has been verified" })
                
        
                }
            });
          
           }
        else {
            return res.status(401).json({ status: "Your account has not been verified" })

        }
    }catch(err){
         console.log(err.message)
        console.error(err)
       return res.json({Error:err.message})

    }
 }

   
    module.exports = {
        
        sendOtp,
        verifyOtp
   }