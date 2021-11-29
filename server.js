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
const cors = require('cors');
const Token = require('./models/token');
connectDB();
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server is listening on port ${port}`));


app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.use('/api/auth', require('./routes/auth'));
app.use('/api/private', require('./routes/private'));
app.use("/api/school", require('./routes/school'))
app.use(errorHandler);


process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err}`);
    server.close(() => process.exit(1));
});