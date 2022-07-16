// require library
require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const path = require('path');

// require router
const userRouter = require('./routes/userRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const notifyRouter = require('./routes/NotifyRoutes');
const uploadFileRouter = require('./routes/uploadFileRouter');
const productRouter = require('./routes/productRouter');
const orderRouter = require('./routes/orderRoutes');

const app = express();
// using middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(
    fileUpload({
        useTempFiles: true,
    })
);
// allow cors (access from another domain)
app.use(cors({ credentials: true, origin: 'https://smartphone-mern-app.surge.sh' })); //https://smartphone-mern-app.surge.sh

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', 'https://smartphone-mern-app.surge.sh');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// connect to mongoosedb
const URL = process.env.MONGODB_URL;
mongoose.connect(URL, (err) => {
    if (err) {
        console.log('Connect to MongoDb fail :(');
        throw err;
    }
    console.log('Connect to MongoDb success :)');
});

//using router
app.use('/user', userRouter);
app.use('/api', notifyRouter);
app.use('/api', productRouter);
app.use('/api', uploadFileRouter);
app.use('/api', categoryRouter);
app.use('/api', orderRouter);

// Set up port and listen server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server is running on port: ', PORT);
});
