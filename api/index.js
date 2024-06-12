import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('DB Connected');
}).catch((err) => {
    console.log('DB Connection Error: ', err);
});

const app = express();

app.use(express.json());
app.use(cookieParser());

let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    next();
  }
  app.use(allowCrossDomain);

app.use(cors({
    credentials: true,
    exposedHeaders: 'Authorization',
    origin: [
        'http://localhost:3000',
        'http://localhost:8000',
    ],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type',
}))

app.listen(8000, () => {
    console.log('Server is running on port 8000!!!');
    }
);

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

// middleware to handle errors

app.use((err, req, res, next) => {
    const statesCode = err.statesCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statesCode).json({
        success: false,
        statesCode,
        message
    });
});