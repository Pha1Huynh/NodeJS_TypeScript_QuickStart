import express from 'express';
import bodyParser from 'body-parser';

import userRoutes from './route/userRoutes';
import authRoutes from './route/authRoutes';
import { connectDb } from './config/connectDb';
import { errorHandler } from './middleware/errorHandling';
import * as dotenv from 'dotenv';
dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use(errorHandler);
connectDb();

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('backend node js is runnung on the http://localhost:' + port);
});
