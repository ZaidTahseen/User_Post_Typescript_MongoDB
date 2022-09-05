import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
const app = express();

import error from './middleware/error';

const dbUrl = process.env.dbUrl as string;
mongoose.connect(dbUrl)
    .then(() => {
        console.log('Datebase connected');
    })
    .catch((err) => {
        console.log('Datebase is not connected');
    });

// Importing the router files for user and posts
import userRouter from './router/userRouter';
import postRouter from './router/postsRouter';

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use('/api', userRouter);
app.use('/api', postRouter);
app.use(error);




export = app; 