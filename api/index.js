import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('DB Connected');
}).catch((err) => {
    console.log('DB Connection Error: ', err);
});

const app = express();

app.use(express.json());

app.listen(8000, () => {
    console.log('Server is running on port 8000!!!');
    }
);

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);