const crypto = require('crypto');
const Response = require('../utils/response');
const Mail = require('../utils/mail');

//Models
const User = require("../models/User");
const Token = require('../models/token');
const Connection = require('../models/connections');
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
    let resetpassword = "";
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
        token = await sendToken(user, 201, "signup", "");
        const TokenSchema = await Token.create({
            token
        })
        const ConnectDb = await Connection.create({
            user: user._id
        });
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
        console.log(user);
        const isMatch = await user.matchPasswords(password);

        if (!isMatch) {
            return next(new Response("Invalid Credentials", 401));
        }
        await Token.findOne(user._id).then(async result => {
            if (result != null) {
                return res.status(201).json({
                    success: true,
                    token: result.token
                });
            } else {
                return res.status(401).json({
                    success: false,
                    token: {}
                });
            }
        })

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
    // "email"  :"somyaupta@gmail.com",
    //     "password" : "jkhgfddkd",
    //     "PhoneNo" : "0987654321",
    //     "github" : "bmfbjhff",
    //     "techstack" : "iouytr",
    //     "tags" : "oiuytr,khjghgfdf",
    //     "project" : "yutuytui",
    //     "description" : ""
    //   }
    try {
        let verify;
        verify = await tokenFound(reqtoken);
        if (verify != true) {
            return res.status(401).json({
                success: false,
                token: reqtoken,
                error: "not a valid token"
            });
            // return res.status(401).json({
            //     success: false,
            //     token: ""
            // });
        } else if (verify == true) {
            return res.status(201).json({
                success: true,
                token: reqtoken
            });

        }
    } catch (error) {
        res.status(500).json({
            success: true,
            error: error.message
        });
    } finally {
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

        // const resetUrl = `http://localhost:5000/api/auth/password-reset/${resetToken}`;

        const message = `
            <h1>You have requestid a password reset</h1>
            <p>Please go to this link to reset your password</p>
            <form method="POST" action="https://tconect-front.herokuapp.com/forgotpassword/${resetToken}">
            <input type="hidden" name="_method" value="put" />
            <button type="submit"> Click Here</button>
            </form>
        `;

        try {
            await Mail({
                to: user.email,
                subject: "Password Reset Request",
                html: message,
            });

            return res.status(200).json({
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

exports.fetchProfile = async (req, res, next) => {
    const {
        email
    } = req.body;
    const {
        token
    } = req.params
    var userData;
    if (tokenFound(token)) {

        try {
            userData = await User.findOne({
                email
            });
        } catch {
            return res.status(500).send({
                "success": false
            })
        }
        return res.status(201).send({
            "success": true,
            data: userData
        })
    } else {
        return res.status(401).send({
            "success": false,
            "error" : "Unauthorised request"
        })
    }

}
exports.userList = async (req, res, next) => {
    let {
        authToken
    } = req.params;
    let status = await tokenFound(authToken);
    if (status == true) {
        User.find({}).then((result) => {
            // result.json().then(r =>{
            //     console.log(r);
            // })
            res.status(200).send({
                data: result
            })
        }).catch((err) => {
            res.status(500).send({
                error: "Internal server error"
            })
        });
    } else {
        res.status(401).send({
            error: "UnAuthorise request"
        })
    }
}
exports.friendConnection = async (io) => {
    io.on('connection', async (socket) => {
        // console.log('A user is connected');
        socket.on("join", async (token) => {
            let id = await Token.findOne(token);
            socket.userid = id.user
            console.log(socket.userid);
        })
        socket.on('friendrequest', async (requestid) => {
            console.log(socket.userid);
            await Connection.findOneAndUpdate({
                user: socket.userid
            }, {
                $push: {
                    outrequest: socket.userid
                }
            })
            await Connection.findOneAndUpdate({
                user: requestid
            }, {
                $push: {
                    inrequest: requestid
                }
            })
            io.to(requestid).emit('newFriendRequest', {
                from: socket.userid,
                to: requestid
            });
        });
        socket.on("accept", async (senderid) => {

            await Connection.findOneAndUpdate({
                user: socket.userid
            }, {
                $pull: {
                    outrequest: {
                        $eleMatch: socket.userid
                    }
                },
                $push: {
                    friend: senderid
                }
            })
            await Connection.findOneAndUpdate({
                user: senderid
            }, {
                $pull: {
                    friend: {
                        $eleMatch: socket.userid
                    }
                },
                $push: {
                    inrequest: requestid
                }
            })
            io.to(senderid).emit('newfriendcreated', {
                from: socket.userid,
                to: requestid
            });
        })
        socket.on("cancel", async (senderid) => {
            await Connection.findOneAndUpdate({
                user: socket.userid
            }, {
                $pull: {
                    outrequest: {
                        $eleMatch: socket.userid
                    }
                }
            })
            await Connection.findOneAndUpdate({
                user: senderid
            }, {
                $pull: {
                    friend: socket.userid
                }
            });
            io.to(senderid).emit('newfrienddenied', {
                from: socket.userid,
                to: requestid
            });
        });
    });
}


const sendToken = async (user, statusCode, res, email) => {
    const token = user.getSignedToken();
    if (res != "signup") {
        await saveToken(token, email);
    }
    return token;
}
const saveToken = async (reqtoken, email) => {
    let user = await User.findOne({
        email
    })
    Token.findOne(user._id).updateOne({
        token: reqtoken
    });
    console.log("saved token");
    return reqtoken;
}
const tokenFound = async (reqtoken) => {
    let res = await Token.findOne({
        reqtoken
    })
    if (res.token != null) {
        return true;
    } else {
        return false;
    }
}