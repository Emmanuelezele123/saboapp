const mongoose = require('mongoose')
require('dotenv').config()
const { MONGO_URI } = process.env

const connectDB = (app) => {
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => { 
        app.listen(process.env.PORT || 6000,()=>{console.log(" SABO APP is running on ")})

    }).catch((err) => {
        console.log(err.message)
        console.error(err)
        process.exit(1)
    })
}

module.exports = connectDB