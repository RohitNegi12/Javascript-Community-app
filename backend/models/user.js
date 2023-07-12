const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    langsKnown: {
        type: [String],
        required: false,
    },
    socialMediaHandles: {
        type: [],
        required: false,
    },
    profilePhoto: {
        name: { type: String, required: false },
        img: { type: String, required: false },
    },
});

const User = mongoose.model("User", usersSchema);

module.exports = User;
