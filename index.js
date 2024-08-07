require('dotenv').config();
const http = require('http');
const express = require('express');
const app = express();

// const server = http.createServer(app);
// const {Server} = require('socket.io');
// const io = new Server(server, {cors: { origin: "*" }});
// const EventEmitter = require('events');

const path = require('path');
const cors = require('cors');
const session = require('express-session');
require('./configs/mongodb');

const port = process.env.PORT || 5001;

// Setup CORS
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type,Accept,Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,DELETE,POST');
        return res.status(200).json({});
    }
    next();
});

// const eventEmitter = new EventEmitter();
// app.set("event-emitter", eventEmitter);

/*
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    // Perform your authentication check here
    if (isValidToken(token)) {
        return next();
    }
    return next(new Error("authentication error"));
});

io.on('connection', (socket)=>{
    console.log("A new connetion established : ",socket.id);

    socket.on("join", (data)=>{
        console.log("join data : ",data);
        socket.join(data);
    })

    // socket.on("join-room", (roomId)=>{
    //     console.log("room id : ",roomId);
    // })

    // socket.on("recieve-msg", (msg)=>{
    //     console.log("message from client : ",msg);
    // })

    eventEmitter.on("refresh-images", (data) => {
        console.log("refresh-images data : ",data)
        socket.emit("refresh-data", data);
    })
})

function isValidToken(token) {
    // Replace this with your actual authentication logic
    return token === process.env.SOCKET_AUTH_TOKEN;
}
    */

app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));

app.use(express.json({limit: '500mb'}));
app.use(express.urlencoded({extended: false, limit: '500mb'}));

// Setup View Engine
app.set('Views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.use(logger('dev'));

app.use(express.static(path.join(__dirname, '/public')));

app.use('/api', require('./routes/routes'))

app.get("/", (req, res, next)=>{
    res.send(`Hey ! I'm working`);
})

app.use('*', async (req, res)=>{
    res.status(200).send({status:400, message:'URL does not exists !!'})
})

app.listen(port, () =>{
    console.log(`Server started at port ${port}`);
})
