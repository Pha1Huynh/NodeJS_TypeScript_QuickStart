import express from "express";
import { Application } from "express";
import userController from '../controllers/userController'
import authMiddleware from "../middleware/authMiddleware";
let router = express.Router();


  router.post('/create',userController.handleRegister )
  router.post('/login',userController.handleLogin)
  router.patch('/update',authMiddleware.authenToken,userController.handleUpdateUser)
 

export = router;
