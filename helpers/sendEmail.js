// using Twilio SendGrid's v3 Node.js Library

const sgMail = require('@sendgrid/mail')
require("dotenv").config()
const sendEmail = (email, subject, text,res) => {
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: email, // Change to your recipient
      from: 'emmanuel.ezele@stu.cu.edu.ng', // Change to your verified sender
      subject: subject,
      text: text,
     }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
        return res.status(200).json({status:"Success",message:"password reset link sent to your email account"})
      
        
      })
      .catch((error) => {
        console.error(error)
        return res.status(401).json({status:"Failure",message:"password reset link was not sent"})
       })
};

module.exports = sendEmail;