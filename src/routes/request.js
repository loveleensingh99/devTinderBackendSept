const express = require("express")
const requestRouter = express.Router()
const User = require("../models/user")
const { userAuth } = require("../middlewares/userAuth");

requestRouter.get("/sendConnectionRequest", async (req, res) => {
    //sending a connection request to another user
    try {


    } catch (err) {

    }


})

module.exports = requestRouter;