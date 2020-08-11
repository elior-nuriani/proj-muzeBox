const express = require('express');
const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const io = require('socket.io')(http);
const path = require('path');


const roomRoutes = require('./api/rooms/rooms.routes');
const userRoutes = require('./api/users/users.routes');
const authRoutes = require('./api/auth/auth.routes');
const connectSockets = require('./api/sockets/sockets-routes');


app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

if (process.env.NODE_ENV !== 'production') {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080'],
        credentials: true
    };
    app.use(cors(corsOptions));
}

app.use('/api/rooms',roomRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth',authRoutes);
connectSockets(io)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')));
}

var PORT = process.env.PORT || 3000;

http.listen(PORT, function () {
    console.log('Server is listening to port', PORT)
})