import express from "express";
import { Application } from "express";
import authController from '../controllers/authController'
import authMiddleware from "../middleware/authMiddleware";

let router = express.Router();


router.post('/refresh-token',authMiddleware.authenToken,authController.refreshAccessToken )
  
 

export = router;
