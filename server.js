require('dotenv').config({
    path: './config.env'
});
const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const Token = require('./models/token');
connectDB();
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server is listening on port ${port}`));
// io.listen
// activating socket
// require('./controllers/auth').friendConnection(io);
io.on('connection', (socket) => {
    console.log('A user is connected');
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





app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/private', require('./routes/private'));
// app.use("/", (req, res, next) => {
//     res.sendFile(path.join(__dirname, "./index.html"))
// })

app.use(errorHandler);


process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err}`);
    server.close(() => process.exit(1));
});