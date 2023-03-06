
import express from "express";
import bodyParser, { urlencoded } from "body-parser";
import userRoutes from "./route/userRoutes";
import authRoutes from "./route/authRoutes"
import {connectDB} from './config/connectDB';

require("dotenv").config();
let app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/user',userRoutes)
app.use('/auth',authRoutes)

connectDB();

let port = process.env.PORT || 8080;
app.listen(port, () => {
console.log("backend node js is runnung on the http://localhost:" + port);
});



