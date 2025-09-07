const jwt = require("jsonwebtoken");
const User = require("../models/user")
const SECRECT_KEY = "THISISASECRETKEY"

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new Error("Token is not present. Please login")
        }
        //validate token
        const decodedToken = await jwt.verify(token, SECRECT_KEY)
        const { _id } = decodedToken;
        const user = await User.find({ _id })

        if (user.length === 0) {
            throw new Error("User not found")
        }
        req.user = user;
        next()
    } catch (error) {
        return res.status(404).send("Error:" + error.message)
    }
}

module.exports = { userAuth };