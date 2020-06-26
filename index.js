// 81
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const app = express();
const https = require('https');
const fs = require('fs');
const socketio = require("socket.io");
const MongoStore = require("connect-mongo")(session);
const sessionStore = new MongoStore({
    mongooseConnection: mongoose.connection
});
const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };
app.use(session({
    store: sessionStore,
    secret: ['6ajvmso28tnxlao28yppx//f0s@q4=6822!ssgielwvz[q[iy;wmvcx'],
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser('6ajvmso28tnxlao28yppx//f0s@q4=6822!ssgielwvz[q[iy;wmvcx'));
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));

// Passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

const db = require('./config/keys').mongoURI;
mongoose.connect(db, {useNewUrlParser: true}).then(() => {
    console.log(`Database connected successfully ${db}`)
}).catch(err => {
    console.log(`Unable to connect to database; ${err}`)
});

const users = require('./routes/api/users');
app.use('/api/users', users);

const msgs = require('./routes/api/msgs');
app.use('/api/msgs', msgs);

const offers = require('./routes/api/offers');
app.use('/api/offers', offers);

const port = process.env.PORT || 25565;
var httpsServer = https.createServer(options, app);

// https://www.codementor.io/tips/0217388244/sharing-passport-js-sessions-with-both-express-and-socket-io

const io = socketio(httpsServer);
const psi = require("passport.socketio");

io.use(psi.authorize({
    key: 'connect.sid',
    secret: '6ajvmso28tnxlao28yppx//f0s@q4=6822!ssgielwvz[q[iy;wmvcx',
    store: sessionStore,
    passport: passport,
    cookieParser: cookieParser
}));

let list = [];

function containsObject(obj, list) {
    for (let i = 0; i < list.length; i++){
        if (obj.from === list[i].to && obj.to === list[i].from) return list[i].sid;
    }
    return "";
}

io.on("connection", socket => {
    console.log("Socket connected");
    io.emit('message', 'Hello!');
    socket.on('establish', obj => {
        let record = {
            to: obj.to,
            from: obj.from,
            sid: obj.sid,
        };
        list.push(record);
    });
    socket.on('chatMessage', msg => {
        let check = {
            to: msg.to,
            from: msg.from, 
        };
        let test = containsObject(check, list);
        let obj = {
            to: msg.to,
            from: msg.from,
            msg: msg.msg,
        };
        if (test !== "") {
            io.to(test).emit('chatMessage', obj);
        }
        io.to(msg.sid).emit('chatMessage', obj);
    });
    socket.on('leaving', (data) => {
        console.log("Socket disconnecting");
        socket.leave(data.id);
        socket.disconnect();
    });
    socket.on('new-bid', bid => {
        io.emit('newbid', bid);
    });
    socket.on('listed', () =>{
        io.emit('update');
    });
    socket.on('refresh-your', () => {
        io.emit('refresh-your');
    })
});

httpsServer.listen(port);
