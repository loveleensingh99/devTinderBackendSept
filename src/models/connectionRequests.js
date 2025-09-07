const mongoose = require("mongoose")
const validator = require("validator")



const statusEnum = ["ignored", "interested", "accepted", "rejected"]
const connectionRequestSchema = mongoose.Schema({

    fromUserId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },//ref is used to reference another model
    toUserId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    status: {
        type: String,
        required: true,
        enum: { values: statusEnum, message: "Status is not valid" },
    }

}, {
    timestamps: true
}
)

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true })



//this piece of code is to make sure that a user cannot send a connection request to himself/herself
//this is a pre save hook that will run before saving the document

connectionRequestSchema.pre("save", async function (next) {
    const connectionRequest = this;
    //check if from userdi is same  as to userid 
    if (connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()) {
        throw new Error("You cannot send connection request to yourself");
    }
    next()
})




const connectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema)
module.exports = connectionRequestModel;