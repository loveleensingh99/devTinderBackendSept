

app.get("/getByEmailId", async (req, res) => {
    const email = req.body.email;
    try {
        const user = await User.find({ email: email })
        if (user.length === 0) {
            res.status(404).send("User not found")
        } else {
            res.send(user)
        }
    } catch (err) {
        console.log("Something went wrong", err)
        res.status(400).send(err);
    }
})

app.get("/getAll", async (req, res) => {
    try {
        const users = await User.find();
        res.send(users)

    } catch (err) {
        console.log("ER", err)
        res.status(404).send(err)
    }
})

app.delete("/deleteByEmail", async (req, res) => {
    try {
        const email = req.body.email;
        if (!email) {
            return res.status(400).send({ message: "Email is required" });
        }

        const user = await User.findOneAndDelete({ email });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.send({ message: "User deleted successfully", user });
    } catch (err) {
        console.error("ER", err);
        res.status(404).send(err);
    }
});

app.put("/updateByEmail", async (req, res) => {
    try {
        const email = req.body.email;
        if (!email) {
            return res.status(400).send({ message: "Email is required" });
        }
        const data = req.body.data;
        const user = await User.findOneAndUpdate({ email }, { $set: { data } }, { new: true });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.send({ message: "User updated successfully", user });
    } catch (err) {
        console.error("ER", err);
        res.status(404).send(err);
    }
});


app.put("/updateByUserId/:userId", async (req, res) => {
    try {
        console.log("api hitted")
        const userId = req.params?.userId;
        if (!userId) {
            return res.status(400).send({ message: "userId is required" });
        }

        const data = req.body;
        console.log("🚀 ~ data:", data)

        const user = await User.findByIdAndUpdate(userId, { $set: data }, { new: true });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.send({ message: "User updated successfully", user });
    } catch (err) {
        console.error("ER", err);
        res.status(404).send(err);
    }
});