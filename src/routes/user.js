const express = require("express")
const { userAuth } = require("../middlewares/userAuth")

const userRouter = express.Router()
const connectionRequest = require("../models/connectionRequests")


//get all pending requests for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const connectionRequestData = await connectionRequest.find({ toUserId: loggedInUser._id, status: "interested" }).populate("fromUserId", ["firstName", "lastName", "photoUrl"])
        res.send({ data: connectionRequestData }).status(200)

    } catch (error) {
        res.status(404).send("Error:" + error.message)
    }
})



//get all pending requests for the logged in user
userRouter.get("/user/connections", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const connectionsData = await connectionRequest.find({
            $or: [{ toUserId: loggedInUser._id, status: "accepted" }, { fromUserId: loggedInUser._id, status: "accepted" }]
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl"]).populate("toUserId ", ["firstName", "lastName", "photoUrl"])

        const data = connectionsData.map(item => {


            if (item.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return item.toUserId

            }
            return item.fromUserId
        }
        )
        res.send({ data: data }).status(200)

    } catch (error) {
        res.status(404).send("Error:" + error.message)
    }
})


module.exports = userRouter;