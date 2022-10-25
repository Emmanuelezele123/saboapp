const User = require('../models/user')
const bcrypt = require('bcrypt')
const saltRounds = 10
require('dotenv').config()

const setPin = async (req,res) => {
    const {pin} = req.body
    const {id} = req.user
    const hashedPin = await bcrypt.hash(pin, saltRounds);
    
    User.updateOne({ _id: id }, {
        $set: {
       pin:hashedPin
       
    }}, function (err, affected, resp) {
        if (err) {
            console.log(err.message)
            console.error(err)
            res.json({ Error: err.message })
        } else {
            return res.json({ status:"Success",message: "pin added" })
    
       
        }
    })
    
    
    
    }
    
    const verifyPin = async (req,res) => {
        try {
            const user = await User.findOne({ _id: req.user.id });
        
            if (user) {
              const cmp = await bcrypt.compare(req.body.pin, user.pin);
              if (cmp) {
                //   ..... further code to maintain authentication like jwt or sessions
                res.send({status:"Success", message:"Pin verification successful"});
              } else {
                res.send({status:"Failure", message:"Wrong Pin"});
              }
            } else {
              res.send({status:"Failure", message:"Wrong Pin"});
            }
          } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server error Occured");
          }
    }

    const completeProfile = (req,res) => {
        const {firstName,lastName,birthDate,address} = req.body
        const {id} = req.user
        User.updateOne({ _id: id }, {
            $set: {
           firstName:firstName,
           lastName: lastName,
           birthDate: birthDate,
           address:address

           
        }}, function (err, affected, resp) {
            if (err) {
                console.log(err.message)
                console.error(err)
                res.json({ Error: err.message })
            } else {
                return res.json({ status:"Success",message: "Profile Completed" })
        
           
            }
        })
    }

    

const getProfile = async (req,res) => {


    try{
        const user = await User.findOne({ _id: req.user.id }).sort('createdAt')
        res.status(200).json({ status:"Success", message:user })
    }catch(err){
        console.log(err.message)
        console.error(err)
        res.json({Error:err.message})

    }

}

    module.exports = {
        getProfile,
        completeProfile,
        setPin,
        verifyPin
   }