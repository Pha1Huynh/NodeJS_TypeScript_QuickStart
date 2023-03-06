
import express from "express";
import bodyParser, { urlencoded } from "body-parser";

import userRoutes from "./route/userRoutes";
import authRoutes from "./route/authRoutes"
import {connectDB} from './config/connectDB';

require("dotenv").config();
let app = express();
// app.use(morgan("combined"));
// Add headers before the routes are defined
//khac phuc loi CORS
// app.use(cors({ origin: true }));

app.use(function (req, res, next) {
// Website you wish to allow to connect
// res.setHeader("Access-Control-Allow-Origin", process.env.URL_REACT);

// Request methods you wish to allow
res.setHeader(
"Access-Control-Allow-Methods",
"GET, POST, OPTIONS, PUT, PATCH, DELETE"
);

// Request headers you wish to allow
res.setHeader(
"Access-Control-Allow-Headers",
"X-Requested-With,content-type"
);

// Set to true if you need the website to include cookies in the requests sent
// to the API (e.g. in case you use sessions)
res.setHeader("Access-Control-Allow-Credentials", new Boolean(true).toString());

// Pass to next layer of middleware
next();
});
//config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/user',userRoutes)
app.use('/auth',authRoutes)
connectDB();
let port = process.env.PORT || 8080;
app.listen(port, () => {
console.log("backend node js is runnung on the http://localhost:" + port);
});


