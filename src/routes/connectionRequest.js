const express = require("express")
const connectionRequestRouter = express.Router()
const User = require("../models/user")
const { userAuth } = require("../middlewares/userAuth");
const { validateProfileData, validatePasswordData } = require("../utils/validations");
const bcrypt = require("bcrypt");
const { SECRECT_KEY } = require("../keys");
const connectionRequest = require("../models/connectionRequests")

connectionRequestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid status value");
        }

        //need to check if there is already a request from the same user to the same user
        const existingRequest = await connectionRequest.findOne({ $or: [{ fromUserId: fromUserId, toUserId: toUserId }, { toUserId: fromUserId, fromUserId: toUserId }] });
        if (existingRequest) {
            throw new Error("Connection request already sent to this user");
        }
        const connectionRequestData = new connectionRequest({
            fromUserId,
            toUserId,
            status
        })

        await connectionRequestData.save();

        res.send({ message: "Connection Request send successfully", data: connectionRequestData }).status(200)

    } catch (error) {
        res.status(400).send("Error:" + error.message)
    }
})




connectionRequestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const allowedStatus = ["accepted", "rejected"];

        const { status, requestId } = req.params;
        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid status value");
        }


        const connectionRequestRes = await connectionRequest.findOne({ _id: requestId, toUserId: loggedInUser._id, status: "interested" });

        if (!connectionRequestRes) {
            throw new Error("No pending connection request found");
        }
        connectionRequestRes.status = status;
        await connectionRequestRes.save();
        res.status(200).send({
            message: "Connection Request sent successfully",
            data: connectionRequestRes
        });
    } catch (error) {
        res.status(400).send("Error:" + error.message)
    }

})



module.exports = connectionRequestRouter;