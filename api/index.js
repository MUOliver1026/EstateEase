import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('DB Connected');
}).catch((err) => {
    console.log('DB Connection Error: ', err);
});

const app = express();

app.listen(8000, () => {
    console.log('Server is running on port 8000!!!');
    }
);

app.use('/api/user', userRouter);