const express = require("express");
const { SECRECT_KEY } = require("../keys");

const authRouter = express.Router()
const User = require("../models/user")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


authRouter.post("/signup", async (req, res) => {
    //creating a new instance of user model

    //Encrypt password
    const { firstName, lastName, email, password } = req.body
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: passwordHash })

    try {
        const ALLOWED_UPDATES = [
            "firstName",
            "lastName",
            "email",
            "password",
            "photoUrl",
            "about",
            "gender",
            "age"
        ];

        const bodyKeys = Object.keys(req.body);
        const invalidFields = bodyKeys.filter(
            (field) => !ALLOWED_UPDATES.includes(field)
        );

        if (invalidFields.length > 0) {
            const error = new Error("Invalid fields in request body");
            error.statusCode = 400;
            error.details = { invalidFields };
            throw error;
        }
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            message: error.message || "Update not allowed",
            invalidFields: error.details?.invalidFields || []
        });
    }


    try {
        await user.save({ runValidators: true });
        res.send("User added successfully")
    } catch (err) {
        res.status(400).send({
            message: "Error occurred",
            error: err.message
        });
    }
})


authRouter.post("/login", async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email })
        if (!user) {
            throw new Error("Email id is  not present.")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw new Error("Password is not valid.")
        }

        //create a token
        const token = await jwt.sign({ _id: user._id }, SECRECT_KEY, { expiresIn: '1h' })
        res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 }); // 1 hour
        res.status(200).send("Login successful!!")


    } catch (error) {
        res.status(400).send("Error:" + error.message)
    }
})

authRouter.post("/logout", (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
    res.send("Logout successful")
})



module.exports = authRouter;