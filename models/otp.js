const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    otpText: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("Otp", otpSchema);