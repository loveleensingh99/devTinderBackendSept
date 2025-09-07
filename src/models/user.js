const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = mongoose.Schema({
    "firstName": { type: String, required: true },
    "lastName": { type: String, required: true },
    "email": {
        type: String, required: true, unique: true, lowercase: true,
        trim: true, validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email" + value)
            }
        }
    },
    "password": { type: String, required: true },
    age: { type: Number },
    "gender": {
        type: String, validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender is not valid")
            }
        }
    },
    "photoUrl": {
        type: String,
        default: "demoDefault"
    },
    "about": {
        type: String,
        default: "This is a bio."

    },
    "skills": {
        type: [String]
    },


}, {
    timestamps: true
}
)




const UserModel = mongoose.model("User", userSchema)
module.exports = UserModel;