const express = require("express");
const connectDb = require("./config/database")
const User = require("./models/user")

const app = express()
const port = 3000;

const cookieParser = require("cookie-parser")



app.use(express.json())
app.use(cookieParser())

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const connectionRequestRouter = require("./routes/connectionRequest")
const userRouter = require("./routes/user")


app.use("/", authRouter, profileRouter,connectionRequestRouter,userRouter)


connectDb()
    .then((res) => {
        console.log("🚀 ~ Connected DB:", res.connection.name);
        app.listen(port, () => {
            console.log("Server is successfully listeing on port: ", port)
        })
    })
    .catch((err) => {
        console.log("🚀 ~ err:", err);
    });


