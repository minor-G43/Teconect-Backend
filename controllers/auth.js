const crypto = require('crypto');
const User = require("../models/User");
const Response = require('../utils/response');
const Mail = require('../utils/mail');
const TokenSchema = require('../models/token');
var token = "";
exports.register = async (req, res, next) => {
    let username = req.body.username,
        email = req.body.email,
        PhoneNo = req.body.PhoneNo,
        password = req.body.password,
        github = req.body.github,
        techstack = req.body.techstack,
        tags = req.body.tags,
        project = req.body.project,
        description = req.body.description;
    token = "";
    try {
        tags = tags.toLowerCase();
        tags = tags.split(",");
        const user = await User.create({
            username,
            email,
            password,
            PhoneNo,
            github,
            techstack,
            tags,
            project,
            description
        });
        token = sendToken(user, 201, res, "signup");
        res.status(201).send({
            status: 201,
            statusText: "register success",
            token: token
        })
        console.log("register success");
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    if (!email || !password) {
        return next(new Response("Please enter email and password", 400));
    }

    try {
        const user = await User.findOne({
            email
        }).select("+password");
        if (!user) {
            return next(new Response("Email ID not found", 404));
        }

        const isMatch = await user.matchPasswords(password);

        if (!isMatch) {
            return next(new Response("Invalid Credentials", 401));
        }
        res.status(201).json({
            success: true,
            token: sendToken(user, 201, res, "login")
        });

    } catch (error) {
        res.status(500).json({
            success: true,
            error: error.message
        });
    }
};
exports.loginToken = async (req, res, next) => {
    const reqtoken = req.params.token;
    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNzE0MWYxMTZlYTZlZDk4ZDJkMzMwYyIsImlhdCI6MTYzNDgxMjQwMSwiZXhwIjoxNjM0ODEzMDAxfQ.zYJAF9_2pSnyoeYft1JyJib9yLJ8_fa7G84_PK2UlEc
    // {
    //     "username" : "somya",
    //     "email"  :"somyaupta@gmail.com",
    //     "password" : "jkhgfddkd",
    //     "PhoneNo" : "0987654321",
    //     "github" : "bmfbjhff",
    //     "techstack" : "iouytr",
    //     "tags" : "oiuytr,khjghgfdf",
    //     "project" : "yutuytui",
    //     "description" : ""
    //   }
    try {
        let verify = await tokenFound(reqtoken);
        console.log(verify);
        if (!verify && (reqtoken == token)) {
            await saveToken(reqtoken);
            console.log("token saved");
            return res.status(201).json({
                success: true,
                token: reqtoken
            });
        } else if (verify) {
            return res.status(201).json({
                success: true,
                token: reqtoken
            });

        } else {
            return res.status(401).json({
                success: false,
                token: reqtoken,
                error: "not a valid token"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: true,
            error: error.message
        });
    }finally{
        token = "delete token"
    }
};

exports.forgotpassword = async (req, res, next) => {
    const {
        email
    } = req.body;

    try {
        const user = await User.findOne({
            email
        });

        if (!user) {
            return next(new Response("Email could not be sent", 404));
        }
        const resetToken = user.getResetPasswordToken();
        await user.save();

        const resetUrl = `http://localhost:3000/password-reset/${resetToken}`;

        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `;

        try {
            await Mail({
                to: user.email,
                subject: "Password Reset Request",
                text: message,
            });

            res.status(200).json({
                success: true,
                data: "Email Sent"
            });

        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();
            return next(new Response("Email could not be sent", 500));
        }

    } catch (error) {
        next(error);
    }

};

exports.resetpassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: {
                $gt: Date.now()
            }
        })

        if (!user) {
            return next(new Response("Invalid Reset Token", 400))
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(201).json({
            success: true,
            data: "Password was Reset!"
        })
    } catch (error) {
        next(error);
    }
};

const sendToken = (user, statusCode, res, type) => {
    const token = user.getSignedToken();
    return token;
}
const saveToken = async (reqtoken) => {
    let saved = new TokenSchema({
        token: reqtoken
    });
    return reqtoken;
}
const tokenFound = async (reqtoken) => {
    TokenSchema.findOne({
        token: reqtoken
    }).then(res => {
        if (res != null) {
            return true;
        } else {
            return false;
        }
    })
}