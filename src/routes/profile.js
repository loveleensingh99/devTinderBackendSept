const express = require("express")
const profileRouter = express.Router()
const User = require("../models/user")
const { userAuth } = require("../middlewares/userAuth");
const { validateProfileData, validatePasswordData } = require("../utils/validations");
const bcrypt = require("bcrypt");
const { SECRECT_KEY } = require("../keys");


profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user).status(200)
    } catch (error) {
        res.status(400).send("Error:" + error.message)
    }
})





profileRouter.put("/profile/edit", userAuth, async (req, res) => {
    try {
        const isValid = validateProfileData(req)
        if (isValid !== true) {
            return res.status(400).json(isValid)
        }

        const user = req.user;
        console.log("🚀 ~ user:", user)

        const updatedUser = await User.findByIdAndUpdate({ _id: user[0]._id }, req.body, { new: true, runValidators: true })
        console.log("🚀 ~ updatedUser:", updatedUser)
        res.send(updatedUser).status(200)
    } catch (error) {
        console.log("🚀 ~ error:", error)
        res.status(400).send("Error:" + error.message)
    }
})

profileRouter.put("/profile/password", userAuth, async (req, res) => {
    try {
        const isValid = validatePasswordData(req)
        if (isValid !== true) {
            return res.status(400).json(isValid)
        }

        const user = req.user;
        console.log("🚀 ~ user:", user)

        //first compare the old password with the hashed password
        const { oldPassword, newPassword } = req.body;
        const isMatch = await bcrypt.compare(oldPassword, user[0].password)

        if (!isMatch) {
            res.status(400).send("Old password is incorrect")
        }
        //hash the new password
        const newHashedPasswword = await bcrypt.hash(newPassword, 10)
        const updatedData = await User.findByIdAndUpdate({ _id: user[0]._id },
            { password: newHashedPasswword }
        )

        res.send("Password updated successfully").status(200)
    } catch (error) {
        console.log("🚀 ~ error:", error)
        res.status(400).send("Error:" + error.message)
    }
})


profileRouter.get("/sendConnectionRequest", async (req, res) => {
    //sending a connection request to another user
    try {


    } catch (err) {

    }


})



module.exports = profileRouter;