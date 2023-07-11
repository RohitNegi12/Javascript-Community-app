const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//express app
const app = express();
app.use(cors());
app.use(express.json({ limit: "3mb" }));

//connection to MongoDB
const dbURI = "mongodb://localhost:27017/questo";
const conn = mongoose
    .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log("Connected to DB");
        app.listen(5001);
        console.log("Listening at Port 5001");
    })
    .catch((err) => console.log("err"));

// mongoose and mongo sandbox routes
app.post("/signup-user", async (req, res) => {
    const { fname, lname, email, password } = req.body;
    const hashedPwd = await bcrypt.hash(password, 10);
    const user = new User({
        fname: fname,
        lname: lname,
        email: email,
        password: hashedPwd,
    });

    user.save()
        .then(() => {
            res.send({ status: "ok" });
        })
        .catch((err) => {
            console.log(err);
            res.send({ status: "failed", error: "Email already registered" });
        });
});

app.post("/login-user", async (req, res) => {
    const { email, password } = req.body;
    const userExists = await User.findOne({
        email: email,
    });
    if (!userExists) {
        res.send({
            status: "failed",
            error: "User does not exist.",
        });
    } else {
        const isPwdValid = bcrypt.compare(password, userExists.password);
        if (isPwdValid) {
            const token = jwt.sign(
                {
                    email: email,
                },
                "secret"
            );
            res.send({
                status: "ok",
                user: token,
                userInfo: {
                    fname: userExists.fname,
                    lname: userExists.lname,
                    email: userExists.email,
                },
            });
        } else {
            res.send({
                status: "failed",
                error: "Credentials do not match!",
            });
        }
    }
});

app.post("/update-user", async (req, res) => {
    const { email, langsKnown, socialMediaHandles } = req.body;
    const user = await User.findOne({
        email: email,
    });
    if (user) {
        user.langsKnown = langsKnown;
        user.socialMediaHandles = socialMediaHandles;
        user.save()
            .then(() => {
                res.send({ status: "ok", msg: "Profile updated successfully" });
            })
            .catch((error) => {
                res.send({ status: "failed", error: "Something went wrong." });
                console.log(error);
            });
    } else {
        res.send({ status: "failed", error: "Something went wrong." });
    }
});

app.post("/update-profile-photo", async (req, res) => {
    const { email, imageName, imageDataURL, langsKnown, socialMediaHandles } =
        req.body;
    const user = await User.findOne({
        email: email,
    });
    if (user) {
        user.profilePhoto.name = imageName;
        user.profilePhoto.img = imageDataURL;
        user.save()
            .then(() => {
                res.send({
                    status: "ok",
                    msg: "Profile updated successfully.",
                });
            })
            .catch((error) => {
                res.send({ status: "failed", error: "Something went wrong" });
                console.log(error);
            });
        console.log("Updated: " + user.email);
    } else {
        res.send({ status: "failed", error: "Something went wrong." });
    }
});

app.post("/get-profile-photo", async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        profilePhoto: { $exists: true },
    });
    if (user == null) res.send({ status: "no-profile-photo-set" });
    else
        res.send({ status: "profile-photo-set", photo: user.profilePhoto.img });
});

app.post("/get-user-info", async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
    });
    if (user) {
        res.send({
            status: "ok",
            langsKnown: user.langsKnown,
            socialMediaHandles: user.socialMediaHandles,
        });
    } else {
        res.send({ status: "failed", error: "Something went wrong." });
        console.log("error: did not find user");
    }
});

app.post("/get-profile-completion-status", async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
    });
    if (user) {
        let completed = 0;
        if (user.langsKnown[0] != null) completed++;
        if (user.socialMediaHandles[0] != null) completed++;
        if (user.profilePhoto.img != null) completed++;
        res.send({ status: "ok", completed: completed });
    } else {
        res.send({ status: "failed", error: "Something went wrong." });
        console.log("User not found");
    }
});
